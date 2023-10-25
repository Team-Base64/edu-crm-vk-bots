export type HMFS = (internal_chat_id: number, text: string) => Promise<any>;

export default abstract class Backend {
    public abstract validateInviteToken(token: string): Promise<number | undefined>;
    public abstract createChat(): Promise<number | undefined>;

    public abstract resendMessageFromClient(internal_chat_id: number, text: string): Promise<boolean>;
    
    public abstract resendMessageFromServer(internal_chat_id: number, text: string) : Promise<any>;

        public abstract  addHandle(handler : HMFS) : void ;
}