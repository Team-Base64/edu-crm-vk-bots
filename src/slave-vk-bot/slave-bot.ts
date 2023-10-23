import { ContextDefaultState, MessageContext } from "vk-io";
import VkBot from "../vk-bot/vk-bot"


export default class VkSlaveBot extends VkBot {
    constructor(token: string, name: string) {
        super(token, 'Slave ' + name);
        this.initMiddlewares();
    }

    private initMiddlewares(): void {
        this.vk.updates.on('message_new', (context, next) => {
            this.handleMessage(context);
            return next();
        });
    }

    private handleMessage(context: MessageContext<ContextDefaultState>) {


        // Проверить что GroupId + sender_id есть в базе

        // Получить из базы chat_id 

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
        
        console.log('ChatId: ', context.chatId);
        console.log('GroupId: ', context.$groupId);
        console.log('UserId: ', context.senderId);
        console.log('Text: ', context.text);
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