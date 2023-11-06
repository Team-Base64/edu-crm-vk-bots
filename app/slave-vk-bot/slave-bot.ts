import VkBot from "../vk-bot/vk-bot"
import Store from "../store/store";
import Backend from "../backend/backend";

import { Attachment, AttachmentType, ContextDefaultState, MessageContext, PhotoAttachment } from "vk-io";
import logger from "../helpers/logger";

const slaveBotLogger = logger.child({ class: 'SlaveVkBot' });

export default class VkSlaveBot extends VkBot {
    constructor(token: string, name: string, db: Store, backend: Backend) {
        super(token, name, db, backend);
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
        const { peerId, $groupId, text, attachments } = context;
        slaveBotLogger.debug({peerId}, 'Get message ');

        if (!$groupId) {
            slaveBotLogger.warn('Group id in vk message is undefined ');
            return false;
        }

        // Проверить что пользователь привязан к боту и чату в crm 
        // Получить из базы chat_id 

        slaveBotLogger.debug({ peerId, $groupId }, 'Check vk user is linked to bot');
        const internal_chat_id = await this.db.getInternalChatId(peerId, $groupId);

        if (!internal_chat_id) {
            slaveBotLogger.debug({ peerId, $groupId }, 'Vk user is not linked to bot');
            await context.send("С этим ботом не связан ваш преподаватель", { peer_id: peerId });

            return false;
        }

        // Работа с вложениями
        // Проверить есть ли вложения
        const attachmentUrls :string[] =  [];
        if(attachments){
            // для каждого вложения
            attachments.forEach((a)=> {
                // Если фото
                if(a.type === AttachmentType.PHOTO){
                   // Получаем url
                    const {largeSizeUrl} : any = a.toJSON(); 
                    if(largeSizeUrl){
                        attachmentUrls.push(largeSizeUrl);
                    } 
                }
            });
        }
        
        

        // Собрать сообщение
        // Отправить сообщение на бэкэнд
        slaveBotLogger.debug('Sending msg to backend');
        const isOk = await this.backend.resendMessageFromClient(internal_chat_id, text || '');
        if (!isOk) {
            slaveBotLogger.warn('Sending msg to backend failed');
            this.sendMessageToClient(peerId, 'Сообщение не доставлено');
        }

        // Sending
        // random_id: - рандомное число, Date.now() + smth
        // peer_id:  vk_id получателя
        // message: - текстовое сообщение
        // group_id: - id группы вк где бот - не обязательно!!!

        return Promise.resolve(true);
    }
}