export default abstract class Store {
    public abstract getInternalChatId(peer_id: number, group_id: number): Promise<number | undefined>;

    public abstract setInternalChatId(peer_id: number, group_id: number, chat_id: number): Promise<boolean>;

    public abstract getFreeSlaveBots(peer_id: number) : Promise<number[] | undefined>;
}