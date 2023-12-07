export enum VkBotRole {
    MASTER,
    SLAVE
}

export interface VkBotData {
    token: string;
    vk_group_id: number;
    role: VkBotRole;
};

export interface VkBotLink {
    peer_id: number;
    internal_chat_id: number;
    vk_group_id: number;
}


export default abstract class Store {
    // Получить список чатов пользователя
    public abstract getStudentChats(peer_id: number): Promise<number[] | undefined>;

    // Получить студента по vk_id
    public abstract getStudentId(peer_id: number): Promise<number | undefined>;

    // Привязать стуента к vk_id
    public abstract linkStudent(peer_id: number, student_id: number): Promise<boolean>;

    // По данным vk_user + vk_bot получить chat_id + class_id, к которому он привязан
    public abstract getChatInfo(peer_id: number, group_id: number): Promise<{ class_id: number, internal_chat_id: number | null; } | undefined>;

    // По данынм vk_user + class_id получить бота для связи
    public abstract getClassChat(peer_id: number, class_id: number): Promise<number | undefined>;

    // Привязать пользователя вк к боту, чату и классу
    public abstract setChatInfo(peer_id: number, group_id: number, class_id: number): Promise<boolean>;

    // Получить id всех свободных для пользователя ВК ботов
    public abstract getFreeSlaveBots(peer_id: number): Promise<number[] | undefined>;

    // Получить данные слейв ботов
    public abstract getSlaveBots(): Promise<VkBotData[] | undefined>;

    // Получить данные мастер ботов
    public abstract getMasterBots(): Promise<VkBotData[] | undefined>;

    // Получить данные для отправки сообщения через нужного бота нужному пользователю
    public abstract getTargetViaInternalChatId(internal_chat_id: number): Promise<VkBotLink | undefined>;

    // Изменить id чата
    public abstract updateChatIds(internal_chat_id: number, peer_id: number, group_id: number): Promise<boolean>;
}
