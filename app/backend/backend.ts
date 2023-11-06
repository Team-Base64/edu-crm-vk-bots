
// TODO! Как понять какому пользователю мастер отправляет сообщение?
// export type ServerMessageToMasterHandler = (internal_chat_id: number, text: string) => Promise<any>;

import { BackendError, CreateChatRequest, CreateChatResponse, CreateStudentRequest, CreateStudentResponse, FileUploadRequest, FileUploadResponse, GetHomeworksRequest, GetHomeworksResponse, SendSolutionRequest, SendSolutionResponse, ServerMessageToSlaveHandler, ValidateTokenRequest, ValidateTokenResponse } from "./models";

export default abstract class Backend {
    // Проверка токена на валидность
    public abstract validateInviteToken(payload: ValidateTokenRequest): Promise<ValidateTokenResponse | BackendError>;

    // Создание чата
    public abstract createChat(payload: CreateChatRequest): Promise<CreateChatResponse | BackendError>;

    // Получение списка дз 
    public abstract getHomeworks(payload: GetHomeworksRequest): Promise<GetHomeworksResponse | BackendError>;

    // Загрузка файла 
    public abstract uploadFile(payload: FileUploadRequest): Promise<FileUploadResponse | BackendError>;

    // Создание студента 
    public abstract createStudent(payload: CreateStudentRequest): Promise<CreateStudentResponse | BackendError>;

    // Отправка решения дз
    public abstract sendHomeworkSolution(payload: SendSolutionRequest): Promise<SendSolutionResponse | BackendError>;

    // Отправка сообщения от бота к бэку
    public abstract resendMessageFromClient(internal_chat_id: number, text: string): Promise<boolean>;

    // Отправка сообщение от бэка к слейв боту
    public abstract resendFromServerToSlave(internal_chat_id: number, text: string): void;
    public abstract addHandleMessageFromServerToSlave(handler: ServerMessageToSlaveHandler): void;

    // TODO 
    // Отправка сообщение от бэка к мастер боту
    // public abstract  addHandleMessageFromServerToMaster(handler : ServerMessageToMasterHandler) : Promise<any> ;
}