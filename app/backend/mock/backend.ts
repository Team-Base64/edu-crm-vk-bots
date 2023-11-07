import { Client, ClientConfig } from "pg";
import { gracefulStop } from "../../helpers/graceful-stop";
import Backend from "../backend";
import logger from "../../helpers/logger";
import { CreateChatPayload, CreateChatResult, CreateStudentPayload, CreateStudentResult, FileUploadPayload, FileUploadResult, GetHomeworksPayload, GetHomeworksResult, HomeworkPayload, MessagePayload, SendSolutionPayload, SendSolutionResult, ServerMessageToSlaveHandler, ValidateTokenPayload, ValidateTokenResult } from "../models";

const backendLogger = logger.child({ class: 'MOCKbackend' });

class BackendMock implements Backend {
    db: Client;
    toSlaveHandler: ServerMessageToSlaveHandler[];

    constructor(db_config: ClientConfig) {
        this.db = new Client(db_config);
        this.toSlaveHandler = [];
        gracefulStop(this.stop.bind(this));
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

        return { isError: true, error: 'Cant create chat', internal_chat_id : 0 };
    }

    public async getClassHomeworks(payload: GetHomeworksPayload): Promise<GetHomeworksResult> {
        const { class_id } = payload;
        const hws = await this.db_getHomeworks(class_id);
        console.log('MOCK: getHws', class_id, hws);

        if (hws) {
            return { homeworks: hws };
        }

        return { isError: true, error: 'Cant get homeworks', homeworks: []};

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
            backendLogger.debug(id, 'MOCK solution отправлено');
            return {};
        }
        backendLogger.error(id, 'MOCK solution ошибка отправки');

        return {
            isError: true,
            error: 'Cant send solution',
        };
    }
    public resendFromServerToSlave(payload : MessagePayload): void {
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
                    return undefined;
                }

                return data.rows[0].id;

            })
            .catch(e => {
                backendLogger.error(e, 'MOCK db create solution error');
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
                    return undefined;
                }

                return data.rows[0].id;

            })
            .catch(e => {
                backendLogger.error(e, 'MOCK db create student error');
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
                    return undefined;
                }

                const hws: HomeworkPayload[] = data.rows.map((row) => {
                    const attaches: string[] = row.attaches.map((a: any) => String(a));

                    return {
                        homework_id: Number(row.id),
                        title: String(row.title),
                        description: String(row.descr),
                        attachmentURLs: attaches,
                    };
                });

                return hws;
            })
            .catch(e => {
                backendLogger.error(e, 'MOCK db get hws error');
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

    public resendMessageFromClient(payload : MessagePayload): Promise<boolean> {
        const {internal_chat_id, text, attachmentURLs} = payload;
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
