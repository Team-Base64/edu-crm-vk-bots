export enum VkBotRole{
    MASTER,
    SLAVE
}

export interface VkBotData {
    token : string;
    vk_group_id : number;
    role: VkBotRole;
};

export interface VkBotLink {
    peer_id: number;
    internal_chat_id: number;
    vk_group_id : number;
}

export default abstract class Store {
    public abstract getInternalChatId(peer_id: number, group_id: number): Promise<number | undefined>;

    public abstract setInternalChatId(peer_id: number, group_id: number, chat_id: number): Promise<boolean>;

    public abstract getFreeSlaveBots(peer_id: number) : Promise<number[] | undefined>;

    public abstract getSlaveBots() : Promise< VkBotData[]| undefined>;
    
    public abstract getMasterBots() : Promise< VkBotData[]| undefined>;

    public abstract getTargetViaInternalChatId(internal_chat_id : number) : Promise<VkBotLink | undefined>
}