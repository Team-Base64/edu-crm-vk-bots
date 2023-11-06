
// TODO! Как понять какому пользователю мастер отправляет сообщение?
// export type ServerMessageToMasterHandler = (internal_chat_id: number, text: string) => Promise<any>;

import { CreateChatRequest, CreateChatResponse, CreateStudentRequest, CreateStudentResponse, FileUploadRequest, FileUploadResponse, GetHomeworksRequest, GetHomeworksResponse, Message, SendSolutionRequest, SendSolutionResponse, ServerMessageToSlaveHandler, ValidateTokenRequest, ValidateTokenResponse } from "./models";

export default abstract class Backend {
    // Проверка токена на валидность
    public abstract validateInviteToken(payload: ValidateTokenRequest): Promise<ValidateTokenResponse>;

    // Создание чата
    public abstract createChat(payload: CreateChatRequest): Promise<CreateChatResponse>;

    // Получение списка дз 
    public abstract getHomeworks(payload: GetHomeworksRequest): Promise<GetHomeworksResponse>;

    // Загрузка файла 
    public abstract uploadFile(payload: FileUploadRequest): Promise<FileUploadResponse>;

    // Создание студента 
    public abstract createStudent(payload: CreateStudentRequest): Promise<CreateStudentResponse>;

    // Отправка решения дз
    public abstract sendHomeworkSolution(payload: SendSolutionRequest): Promise<SendSolutionResponse>;

    // Отправка сообщения от бота к бэку
    public abstract resendMessageFromClient(payload: Message): Promise<boolean>;

    // Отправка сообщение от бэка к слейв боту
    public abstract resendFromServerToSlave(internal_chat_id: number, text: string): void;
    public abstract addHandleMessageFromServerToSlave(handler: ServerMessageToSlaveHandler): void;

    // TODO 
    // Отправка сообщение от бэка к мастер боту
    // public abstract  addHandleMessageFromServerToMaster(handler : ServerMessageToMasterHandler) : Promise<any> ;
}