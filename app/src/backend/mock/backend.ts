import { Client } from "pg";
import { gracefulStop } from "../../helpers/graceful-stop";
import logger from "../../helpers/logger";
import postgres_config from "../../store/PostrgeSQL/config";
import Backend from "../backend";
import { CreateChatPayload, CreateChatResult, CreateStudentPayload, CreateStudentResult, FileUploadPayload, FileUploadResult, GetEventsPayload, GetEventsResult, GetHomeworksPayload, GetHomeworksResult, HomeworkPayload, MessagePayload, SendSolutionPayload, SendSolutionResult, ServerMessageToSlaveHandler, ValidateTokenPayload, ValidateTokenResult } from "../models";

const backendLogger = logger.child({}, {
    msgPrefix: 'MOCKbackend'
});

class BackendMock implements Backend {
    db: Client;
    toSlaveHandler: ServerMessageToSlaveHandler[];

    constructor() {
        this.db = new Client(postgres_config);
        this.toSlaveHandler = [];
        gracefulStop(this.stop.bind(this));
    }
    public getClassEvents(payload: GetEventsPayload): Promise<GetEventsResult> {
        return new Promise((res) => {
            return res({
                events: [{
                    title: 'title',
                    description: 'desccr',
                    uuid: 'dwdwd',
                    startDateISO: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
                    endDateISO: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
                }]
            })
        });
    }

    public async validateInviteToken(payload: ValidateTokenPayload): Promise<ValidateTokenResult> {
        const { token } = payload;

        const class_id = await this.db_getToken(token);


        if (class_id) {
            return { class_id: class_id };
        }

        return { isError: true, error: 'Validation token error', class_id: 0 };
    }

    public async createInternalChat(payload: CreateChatPayload): Promise<CreateChatResult> {
        const { student_id, class_id } = payload;
        const chat_id = await this.db_createChat(student_id, class_id);
        if (chat_id) {
            return { internal_chat_id: chat_id };
        }

        return { isError: true, error: 'Cant create chat', internal_chat_id: 0 };
    }

    public async getClassHomeworks(payload: GetHomeworksPayload): Promise<GetHomeworksResult> {
        const { class_id } = payload;
        const hws = await this.db_getHomeworks(class_id);

        if (hws) {
            return { homeworks: hws };
        }

        return { isError: true, error: 'Cant get homeworks', homeworks: [] };
    }

    public uploadAttachment(payload: FileUploadPayload): Promise<FileUploadResult> {
        return new Promise((resolve) => {
            setTimeout(() => {
                return resolve({ internalFileURL: payload.fileURL });
            }, 1500);
        });
    }

    public async createNewStudent(payload: CreateStudentPayload): Promise<CreateStudentResult> {
        const student_id = await this.db_createStudent(payload.name);

        if (student_id) {
            return { student_id: student_id };
        }
        return { isError: true, error: 'Cant create student', student_id: 0 };
    }
    public async sendHomeworkSolution(payload: SendSolutionPayload): Promise<SendSolutionResult> {
        const { homework_id, solution, student_id } = payload;
        const { text, attachmentURLs } = solution;
        const id = await this.db_createSolution(text, attachmentURLs);

        if (id) {
            backendLogger.debug({ homework_id, solution, id }, 'Solution отправлено');
            return {};
        }
        backendLogger.error({ id }, 'Solution ошибка отправки');

        return {
            isError: true,
            error: 'Cant send solution',
        };
    }
    public resendFromServerToSlave(payload: MessagePayload): void {
        throw new Error("Method not implemented.");
    }

    public async start() {
        backendLogger.info('Connecting to mock DB');
        return this.db.connect().then(() => {
            backendLogger.info('Connected to mock DB');
            return;
        })
            .catch(e => {
                backendLogger.error(e, 'NOT Connected to mock DB');
                return Promise.reject();
            });
    }

    public async stop() {
        backendLogger.info('Disconnecting posrgres db');

        return this.db.end().then(() => {
            backendLogger.info('Disconnected posrgres db ok');
            return;
        })
            .catch(e => {
                backendLogger.error(e, 'NOT disconnected from posrgres');
                return;
            });
    }

    private async db_createSolution(text: string, attaches: string[]): Promise<number | undefined> {
        return this.db.query(`insert into solutions(text, attaches)
                                values($1, $2)
                                returning id;`,
            [text, attaches]
        )
            .then(data => {
                if (!data.rows) {
                    backendLogger.warn('DB Solution not created');
                    return undefined;
                }

                return data.rows[0].id;

            })
            .catch(e => {
                backendLogger.error(e, 'DB Create solution error');
                return undefined;
            });
    }

    private async db_createStudent(name: string): Promise<number | undefined> {
        return this.db.query(`insert into students(name, avatarURL, sn)
                                values($1, $2, $3)
                                returning id;`,
            [name, '', 'vk']
        )
            .then(data => {
                if (!data.rows) {
                    backendLogger.warn('DB Stundet not created');
                    return undefined;
                }

                return data.rows[0].id;

            })
            .catch(e => {
                backendLogger.error(e, 'DB create student error');
                return undefined;
            });
    }

    private async db_getHomeworks(class_id: number): Promise<HomeworkPayload[] | undefined> {
        return this.db.query(`select id, class_id, title, descr, attaches
                                from homeworks
                                where class_id = $1;`,
            [class_id]
        )
            .then(data => {
                if (!data.rows) {
                    backendLogger.warn('DB get hws err');
                    return undefined;
                }

                const hws: HomeworkPayload[] = data.rows.map((row) => {
                    // const attaches: string[] = row.attaches.map((a: any) => String(a));

                    return {
                        homework_id: Number(row.id),
                        title: String(row.title),
                        description: String(row.descr),
                        tasks: [
                            {
                                description: 'Супер пупер задача 1',
                                attachmentURLs: [
                                    'https://kartin.papik.pro/uploads/posts/2023-06/1686810876_kartin-papik-pro-p-kartinki-plokhogo-kachestva-priroda-66.jpg',
                                    'https://kartin.papik.pro/uploads/posts/2023-06/1686810868_kartin-papik-pro-p-kartinki-plokhogo-kachestva-priroda-45.jpg',
                                ]
                            },
                            {
                                description: 'Супер пупер задача 2',
                                attachmentURLs: [
                                    'https://kartin.papik.pro/uploads/posts/2023-06/1686810870_kartin-papik-pro-p-kartinki-plokhogo-kachestva-priroda-51.jpg',
                                ]
                            }
                        ]
                    };
                });

                return hws;
            })
            .catch(e => {
                backendLogger.error(e, 'DB get hws error');
                return undefined;
            });
    }

    private async db_getToken(token: string): Promise<number | undefined> {
        return this.db.query(`select class_id
                              from tokens
                              where token = $1`,
            [token]
        )
            .then(data => {
                if (!data.rows[0]?.class_id) {
                    return undefined;
                }
                const class_id = Number(data.rows[0].class_id);
                return class_id;
            })
            .catch(e => {
                backendLogger.error(e, 'DB Get token error ');
                return undefined;
            });
    }

    public async db_createChat(student_id: number, class_id: number): Promise<number | undefined> {
        return this.db.query(`insert into internal_chats(student_id, class_id)
                              values ($1, $2)
                              returning internal_chat_id;`,
            [student_id, class_id])
            .then(data => {
                if (!data.rows[0]?.internal_chat_id) {
                    backendLogger.warn('DB cant create chat');
                    return undefined;
                }
                return Number(data.rows[0].internal_chat_id);
            })
            .catch(e => {
                backendLogger.error(e, 'DB cant create chat');
                return undefined;
            });
    }

    public resendMessageFromClient(payload: MessagePayload): Promise<boolean> {
        const { internal_chat_id, text, attachmentURLs } = payload;
        backendLogger.info({ internal_chat_id, text, attachmentURLs }, 'MOCK-GRPC. Sending msg to sever ');

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                backendLogger.info({ internal_chat_id, text, attachmentURLs }, 'MOCK-GRPC. msg SENT to sever ');

                resolve(true);
            }, 3000);
        });
    }

    public addHandleMessageFromServerToSlave(handler: ServerMessageToSlaveHandler): void {
        this.toSlaveHandler.push(handler);
    }
}

export default BackendMock;
