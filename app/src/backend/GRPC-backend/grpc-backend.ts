import Backend from "../backend";
// import grpcOptions from "./config";
import grpc from "@grpc/grpc-js";
import logger from "../../helpers/logger";
import { BotChatClient } from "./model_grpc_pb";
//const grpc = require('@grpc/grpc-js');
import { CreateChatPayload, CreateChatResult, CreateStudentPayload, CreateStudentResult, FileUploadPayload, FileUploadResult, GetEventsPayload, GetEventsResult, GetHomeworksPayload, GetHomeworksResult, HomeworkPayload, MessagePayload, SendSolutionPayload, SendSolutionResult, ServerMessageToSlaveHandler, TaskPayload, ValidateTokenPayload, ValidateTokenResult } from "../models";
import { CreateChatRequest, CreateStudentRequest, FileUploadRequest, Message as GRPCMessage, GetEventsRequest, GetHomeworksRequest, SendSolutionRequest, SolutionData, ValidateTokenRequest } from "./model_pb";

import { gracefulStop } from "../../helpers/graceful-stop";
import client from "./config";

const streamReconnectTimeout = 3;

const backendLogger = logger.child({}, {
    msgPrefix: 'GRPC backend: ',
});

export default class GRPCBackend implements Backend {
    private client: BotChatClient;
    private stream: grpc.ClientDuplexStream<GRPCMessage, GRPCMessage> | null;
    private toSlaveHandlers: ServerMessageToSlaveHandler[];

    constructor() {
        this.client = client;
        this.toSlaveHandlers = [];
        this.stream = null;
        gracefulStop(this.stop.bind(this));
    }

    public async start(): Promise<any> {
        this.streamConnent();
    }

    public async stop(): Promise<any> {
        this.client.close();
    }

    private streamConnent() {
        this.stream = this.client.startChatVK({}); // TODO errors
        this.stream.on('data', this.streamDataHandler.bind(this));
        this.stream.on('end', this.streamEndHandler.bind(this));
        this.stream.on('error', this.streamErrorHandler.bind(this));
    }

    private streamEndHandler(): void {
        backendLogger.warn('End of GRPC stream');
        setTimeout(this.streamConnent.bind(this), streamReconnectTimeout * 1000);
    }

    private streamErrorHandler(err: Error): void {
        backendLogger.error(err, 'GRPC error');
    }

    private streamDataHandler(chunk: any): void {
        try {
            const message: MessagePayload = {
                internal_chat_id: Number(chunk.array[0]),
                text: String(chunk.array[1] ?? ''),
                attachmentURLs: chunk.array[2] as string[],
            };

            backendLogger.debug({ message }, 'GRPC get message from server');
            this.resendFromServerToSlave(message);

        } catch (e) {
            backendLogger.warn(e, 'Cant parse message from remote backend');
        }
    }

    public async validateInviteToken(payload: ValidateTokenPayload): Promise<ValidateTokenResult> {
        backendLogger.debug(payload, 'Backend start token validation');
        const { token } = payload;

        const req = new ValidateTokenRequest();
        req.setToken(token);

        return new Promise((resolve) => {
            this.client.validateToken(req, (err, resp) => {
                if (err) {
                    backendLogger.warn(err, 'Backend validae token error');
                    return resolve({ class_id: 0, isError: true, error: err.message });
                }

                return resolve({ class_id: resp.getClassid() });
            });
        });
    }

    public createInternalChat(payload: CreateChatPayload): Promise<CreateChatResult> {
        backendLogger.debug(payload, 'Backend start chat create');
        const { student_id, class_id } = payload;

        const req = new CreateChatRequest();
        req.setClassid(class_id);
        req.setStudentid(student_id);

        return new Promise((resolve) => {
            this.client.createChat(req, (err, resp) => {
                if (err) {
                    backendLogger.warn(err, 'Backend create chat error');
                    return resolve({ internal_chat_id: 0, isError: true, error: err.message });
                }
                return resolve({ internal_chat_id: resp.getInternalchatid() });
            });
        });
    }

    public getClassHomeworks(payload: GetHomeworksPayload): Promise<GetHomeworksResult> {
        backendLogger.debug(payload, 'Backend start get Homeworks');
        const { class_id } = payload;

        const req = new GetHomeworksRequest();
        req.setClassid(class_id);

        return new Promise((resolve) => {
            this.client.getHomeworks(req, (err, resp) => {
                if (err) {
                    backendLogger.warn(err, 'Backend get homeworks error');
                    return resolve({ homeworks: [], isError: true, error: err.message });
                }
                const homeworks: HomeworkPayload[] = resp
                    .getHomeworksList()
                    .map((hw): HomeworkPayload => {
                        const tasks = hw.getTasksList().map<TaskPayload>(
                            task => {
                                return {
                                    description: task.getDescription(),
                                    attachmentURLs: task.getAttachmenturlsList(),
                                };
                            }
                        );
                        return {
                            homework_id: hw.getHomeworkid(),
                            title: hw.getTitle(),
                            description: hw.getDescription(),
                            createDateISO: hw.getCreatedate(),
                            deadlineDateISO: hw.getDeadlinedate(),
                            tasks
                        };
                    });
                backendLogger.debug({ homeworks }, 'Backend get homeworks done');

                return resolve({ homeworks: homeworks });
            });
        });
    }

    public async uploadAttachment(payload: FileUploadPayload): Promise<FileUploadResult> {
        backendLogger.debug(payload, 'Backend start upload attachment');
        const { fileURL, mimetype } = payload;

        const req = new FileUploadRequest();
        req.setFileurl(fileURL);
        req.setMimetype(mimetype);

        return new Promise((resolve) => {
            this.client.uploadFile(req, (err, resp) => {
                if (err) {
                    backendLogger.warn(err, 'Backend upload file error');
                    return resolve({ internalFileURL: '', isError: true, error: err.message });
                }

                return resolve({ internalFileURL: resp.getInternalfileurl() });
            });
        });
    }

    public async createNewStudent(payload: CreateStudentPayload): Promise<CreateStudentResult> {
        backendLogger.debug(payload, 'Backend start create student');
        const { name, type, avatarURL } = payload;

        const req = new CreateStudentRequest();
        req.setName(name);
        req.setType(type);
        req.setAvatarurl(avatarURL);

        return new Promise((resolve) => {
            this.client.createStudent(req, (err, resp) => {
                if (err) {
                    backendLogger.warn(err, 'Backend create student error');
                    return resolve({ student_id: 0, isError: true, error: err.message });
                }

                return resolve({ student_id: resp.getStudentid() });
            });
        });
    }

    public async sendHomeworkSolution(payload: SendSolutionPayload): Promise<SendSolutionResult> {
        backendLogger.debug(payload, 'Backend start create solution');
        const { homework_id, student_id, solution } = payload;
        const { text, attachmentURLs } = solution;


        const grpcSolution = new SolutionData();
        grpcSolution.setText(text);
        grpcSolution.setAttachmenturlsList(attachmentURLs);

        const req = new SendSolutionRequest();
        req.setStudentid(student_id);
        req.setHomeworkid(homework_id);
        req.setSolution(grpcSolution);

        return new Promise((resolve) => {
            this.client.sendSolution(req, (err, resp) => {
                if (err) {
                    backendLogger.warn(err, 'Backend send solution error');
                    return resolve({ isError: true, error: err.message });
                }

                return resolve({});
            });
        });
    }

    public async resendMessageFromClient(payload: MessagePayload): Promise<boolean> {
        backendLogger.debug(payload, 'Backend send message to server started');
        const { internal_chat_id, text, attachmentURLs } = payload;

        const req = new GRPCMessage();
        req.setChatid(internal_chat_id);
        req.setText(text);
        req.setAttachmenturlsList(attachmentURLs);

        return new Promise((resolve) => {
            if (!this.stream) {
                backendLogger.error('Backend Cant send msg to server. stream is null');
                return resolve(false);
            }

            this.stream.write(req, (err: any) => {
                if (err) {
                    backendLogger.warn({ payload, err }, 'Backend message sent GRPC error');
                    return resolve(false);
                }

                backendLogger.debug({ payload }, 'Message sent');
                return resolve(true);
            });
        });
    }

    public resendFromServerToSlave(payload: MessagePayload): void {
        this.toSlaveHandlers.forEach(h => h(payload).catch(
            error => backendLogger.error('resendFromServerToSlave: ' + error)
        ));
    }

    public addHandleMessageFromServerToSlave(handler: ServerMessageToSlaveHandler): void {
        this.toSlaveHandlers.push(handler);
    }

    public getClassEvents(payload: GetEventsPayload): Promise<GetEventsResult> {
        backendLogger.debug(payload, 'Получение эвентов началось');
        const { classID } = payload;

        const req = new GetEventsRequest();
        req.setClassid(classID);

        return new Promise((resolve) => {
            this.client.getEvents(req, (err, resp) => {
                if (err) {
                    backendLogger.error(err, 'Ошибка получения эвентов ');
                    return resolve({ isError: true, error: err.message, events: [] });
                }

                return resolve({
                    events: resp
                        .getEventsList()
                        .map(e => ({
                            title: e.getTitle(),
                            description: e.getDescription(),
                            startDateISO: e.getStartdate(),
                            endDateISO: e.getEnddate(),
                            uuid: e.getId(),
                        })),
                });
            });
        });
    }
}
