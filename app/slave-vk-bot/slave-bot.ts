import VkBot from "../vk-bot/vk-bot"
import Store from "../store/store";
import Backend from "../backend/backend";

import { ContextDefaultState, MessageContext } from "vk-io";

export default class VkSlaveBot extends VkBot {
    constructor(token: string, name: string, db: Store, backend : Backend) {
        super(token, 'Slave ' + name, db, backend);
        this.initMiddlewares();
    }

    private initMiddlewares(): void {
        this.vk.updates.on('message_new', async (context, next) => {
            if (!await this.handleMessage(context)) {
                return;
            }

            return next();
        });
    }

    private async handleMessage(context: MessageContext<ContextDefaultState>): Promise<boolean> {
        console.log('Slage get message');
        const { peerId, $groupId, text } = context;

        if (!$groupId) {
            console.log('Group id is undefined');
            return false;
        }

        // Проверить что пользователь привязан к боту и чату в crm 
        // Получить из базы chat_id 
        const internal_chat_id = await this.db.getInternalChatId(peerId, $groupId);
        console.log('\t Found chat', internal_chat_id);

        if (!internal_chat_id) {
            await context.send("С этим ботом не связан ваш преподаватель", { peer_id: peerId });
            console.log(`Пользователь ${peerId} не связан с ${$groupId}`);

            return false;
        }

        // Собрать сообщение
        // Отправить сообщение на бэкэнд
        console.log('\tОтправляем');
        const isOk = await this.backend.resendMessageFromClient(internal_chat_id, text || '' );

        if(!isOk){
            this.sendMessageToClient(peerId, 'Сообщение не доставлено');
        }
        console.log('\tОтправили');
        // Sending
        // random_id: - рандомное число, Date.now() + smth
        // peer_id:  vk_id получателя
        // message: - текстовое сообщение
        // group_id: - id группы вк где бот - не обязательно!!!

        return true;
    }
}