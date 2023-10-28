import { ContextDefaultState, MessageContext } from "vk-io";
import VkBot from "../vk-bot/vk-bot"
import Store from "../store/store";


export default class VkSlaveBot extends VkBot {
    constructor(token: string, name: string, db: Store) {
        super(token, 'Slave ' + name, db);
        this.initMiddlewares();
    }

    private initMiddlewares(): void {
        // this.vk.updates.use(async (context, next) => {
        //     try {
        //         await next();
        //     } catch (e) {
        //         console.error(e);
        //     }
        // });

        this.vk.updates.on('message_new', async (context, next) => {
            if (!await this.handleMessage(context)) {
                return;
            }

            return next();
        });
    }

    private async handleMessage(context: MessageContext<ContextDefaultState>): Promise<boolean> {

        const { peerId, $groupId } = context;

        if (!$groupId) {
            console.log('Group id is undefined');
            return false;
        }

        // Проверить что GroupId + sender_id есть в базе
        // Получить из базы chat_id 

        const inernal_chat_id = await this.db.getInternalChatId(peerId, $groupId);

        if (!inernal_chat_id) {
            // this.sendMessageToClient(peerId, )
            await context.send("С этим ботом не связан ваш преподаватель", { peer_id: peerId });
            console.log(`Пользователь ${peerId} не связан с ${$groupId}`);

            return false;
        }



        // Собрать сообщение

        // Отправить сообщение по grpc


        // VK API

        // Receiving 

        // ChatId - групповые беседы
        // senderId - id автора сообщения
        // GroupId - id группы в вк


        // Sending
        // random_id: - рандомное число, Date.now() + smth
        // peer_id:  vk_id получателя
        // message: - текстовое сообщение
        // group_id: - id группы вк где бот - не обязательно!!!
        console.log("new message:");
        console.log('\tChatId: ', context.chatId);
        console.log('\tGroupId: ', context.$groupId);
        console.log('\tUserId: ', context.senderId);
        console.log('\tText: ', context.text);

        return true;
    }

    // public sendMsg(text: string) {
    //     this.vk.api.messages.send({
    //         random_id: Date.now(),
    //         peer_id: 211427710,
    //         message: "Hello!!!!!",
    //         // group_id: 222973424,
    //     });
    // }

}