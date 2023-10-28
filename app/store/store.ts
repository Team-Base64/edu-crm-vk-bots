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
    // По данным vk_user + vk_bot получить chat_id, к которому он привязан
    public abstract getInternalChatId(peer_id: number, group_id: number): Promise<number | undefined>;

    // Привязать пользователя вк к боту и к чату
    public abstract setInternalChatId(peer_id: number, group_id: number, chat_id: number): Promise<boolean>;

    // Получить id всех свободных для пользователя ВК ботов
    public abstract getFreeSlaveBots(peer_id: number) : Promise<number[] | undefined>;

    // Получить данные слейв ботов
    public abstract getSlaveBots() : Promise< VkBotData[]| undefined>;
    
    // Получить данные мастер ботов
    public abstract getMasterBots() : Promise< VkBotData[]| undefined>;

    // Получить данные для отправки сообщения через нужного бота нужному пользователю
    public abstract getTargetViaInternalChatId(internal_chat_id : number) : Promise<VkBotLink | undefined>
}