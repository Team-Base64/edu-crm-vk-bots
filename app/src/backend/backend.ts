
// TODO! Как понять какому пользователю мастер отправляет сообщение?
// export type ServerMessageToMasterHandler = (internal_chat_id: number, text: string) => Promise<any>;

import { ValidateTokenPayload, ValidateTokenResult, CreateChatPayload, CreateChatResult, GetHomeworksPayload, GetHomeworksResult, FileUploadPayload, FileUploadResult, CreateStudentPayload, CreateStudentResult, SendSolutionPayload, SendSolutionResult, ServerMessageToSlaveHandler, MessagePayload, GetEventsPayload, GetEventsResult } from "./models";

export default abstract class Backend {
    // Получение расписания 
    public abstract getClassEvents(payload: GetEventsPayload)  : Promise<GetEventsResult>;
    
    // Проверка токена на валидность
    public abstract validateInviteToken(payload: ValidateTokenPayload): Promise<ValidateTokenResult>;

    // Создание чата
    public abstract createInternalChat(payload: CreateChatPayload): Promise<CreateChatResult>;

    // Получение списка дз 
    public abstract getClassHomeworks(payload: GetHomeworksPayload): Promise<GetHomeworksResult>;

    // Загрузка файла 
    public abstract uploadAttachment(payload: FileUploadPayload): Promise<FileUploadResult>;

    // Создание студента 
    public abstract createNewStudent(payload: CreateStudentPayload): Promise<CreateStudentResult>;

    // Отправка решения дз
    public abstract sendHomeworkSolution(payload: SendSolutionPayload): Promise<SendSolutionResult>;

    // Отправка сообщения от бота к бэку
    public abstract resendMessageFromClient(payload: MessagePayload): Promise<boolean>;

    // Отправка сообщение от бэка к слейв боту
    public abstract resendFromServerToSlave(payload : MessagePayload): void;
    public abstract addHandleMessageFromServerToSlave(handler: ServerMessageToSlaveHandler): void;

    // TODO 
    // Отправка сообщение от бэка к мастер боту
    // public abstract  addHandleMessageFromServerToMaster(handler : ServerMessageToMasterHandler) : Promise<any> ;

    public abstract start() : Promise<any>;
    public abstract stop() : Promise<any>;
}