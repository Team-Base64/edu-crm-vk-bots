export type ServerMessageToSlaveHandler = (internal_chat_id: number, text: string) => Promise<any>;

// TODO! Как понять какому пользователю мастер отправляет сообщение?
// export type ServerMessageToMasterHandler = (internal_chat_id: number, text: string) => Promise<any>;

export default abstract class Backend {
    // Проверка токена на валидность
    public abstract validateInviteToken(token: string): Promise<number | undefined>;
    
    // Создание чата
    public abstract createChat(): Promise<number | undefined>;

    // Отправка сообщения от бота к бэку
    public abstract resendMessageFromClient(internal_chat_id: number, text: string): Promise<boolean>;
    
    // Отправка сообщение от бэка к слейв боту
    public abstract resendFromServerToSlave(internal_chat_id: number, text: string) : void;
    public abstract addHandleMessageFromServerToSlave(handler : ServerMessageToSlaveHandler) : void;

    // TODO 
    // Отправка сообщение от бэка к мастер боту
    // public abstract  addHandleMessageFromServerToMaster(handler : ServerMessageToMasterHandler) : Promise<any> ;
}