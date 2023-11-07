import VkBot from "../vk-bot/vk-bot"
import Store from "../store/store";
import Backend from "../backend/backend";
import { AttachmentType, ContextDefaultState, MessageContext, PhotoAttachment } from "vk-io";
import logger from "../helpers/logger";
import { NextMiddleware } from "middleware-io";

import mime from 'mime';
import { changeHttpsToHttp } from "../helpers/changeHttpsToHttp";
import { CommandPatterns } from "./Commands/command-patterns";
import { MainKeyboard } from "./Keyboards/main-keyboard";
import { customSceneMiddleware } from "../master-vk-bot/Scenes/custom-scene-middleware";
import { SessionManager } from "@vk-io/session";
import { SceneContext, SceneManager } from "@vk-io/scenes";
import { SendSolutionScene } from "./Scenes/send-solution-scene";

const slaveBotLogger = logger.child({ class: 'SlaveVkBot' });

export default class VkSlaveBot extends VkBot {
    sessionManager: SessionManager;
    sceneManager: SceneManager;

    constructor(token: string, name: string, db: Store, backend: Backend) {
        super(token, name, db, backend);
        this.sessionManager = new SessionManager();
        this.sceneManager = new SceneManager();
        this.initMiddlewares();
        this.initSceneManager();

    }

    private initSceneManager() {
        this.sceneManager.addScenes([
            SendSolutionScene.scene(this.db, this.backend),
        ]);
    }

    private initMiddlewares(): void {
        this.vk.updates.on('message_new', this.authMiddleware.bind(this));

        this.vk.updates.on('message_new', this.sessionManager.middleware); // Для сцен, на будущее
        this.vk.updates.on('message_new', this.sceneManager.middleware); // Сцены
        this.vk.updates.on('message_new', this.sceneManager.middlewareIntercept); // Сцены


        this.initCommandMiddlewares([
            {
                command: CommandPatterns.Menu,
                handler: (context) => {
                    console.log('menu cmd');
                    context.send({
                        message: 'Главное меню',
                        keyboard: MainKeyboard,
                    });
                }
            },
            {
                command: CommandPatterns.Homeworks,
                handler: this.handleGetHomeworks.bind(this),
            },

            {
                command: CommandPatterns.NewSolution,
                handler: this.handleSendSolution.bind(this),
            },
            {
                command: CommandPatterns.Cancel,
                handler: (context) => {
                    if (context.scene.current) {
                        context.scene.canceled = true;
                    }
                }
            }
        ]);

        // this.vk.updates.on('message_new', customSceneMiddleware);

        this.vk.updates.on('message_new', this.messageMiddleware.bind(this));
    }

    private async handleSendSolution(context: MessageContext) {
        console.log('New solution cmd');
        context.scene.enter(SendSolutionScene.name);
    }

    private async handleGetHomeworks(context: MessageContext<ContextDefaultState>) {
        console.log('homeworks');

        const { peerId } = context;

        const resp = await this.db.getInternalChatId(peerId, this.group_id);
        if (!resp) {
            return;
        }

        const { class_id } = resp;

        const { homeworks, ...getHomeworksError } = await this.backend.getHomeworks({
            class_id: class_id,
        });

        if (getHomeworksError.isError) {
            slaveBotLogger.warn(getHomeworksError.error, 'Get homeworks error');
            this.sendMessageToClient(peerId, 'Не получилось загрузить домашние задния :с');
            return;
        }

        if (!homeworks.length) {
            this.sendMessageToClient(peerId, 'Нет дз');
            return;
        }

        const msg = 'Список дз:\n\n' + homeworks.map((hw, index) => {
            return `
            ${index}: ${hw.title}
            ${hw.description}
            `;
        }).join('');

        this.sendMessageToClient(peerId, msg);
    }

    private async authMiddleware(context: MessageContext<ContextDefaultState>, next: NextMiddleware) {
        console.log('auth');
        const { peerId } = context;
        const { group_id } = this;
        // Проверить что пользователь привязан к боту и чату в crm 
        // Получить из базы chat_id 

        slaveBotLogger.debug({ peerId, group_id }, 'Check vk user is linked to bot');
        const chatData = await this.db.getInternalChatId(peerId, group_id);

        if (!chatData) {
            slaveBotLogger.debug({ peerId, group_id }, 'Vk user is not linked to bot');
            await context.send("С этим ботом не связан ваш преподаватель", { peer_id: peerId });

            return;
        }

        context.state = {...context.state, ...chatData};
        return next();
    }

    private async messageMiddleware(context: MessageContext<ContextDefaultState>): Promise<boolean> {
        console.log('message mw');

        if (context.state.isCommand) {
            return false;
        }

        const { peerId, $groupId, text, attachments } = context;
        const internal_chat_id: number = context.state.internal_chat_id;

        if (!internal_chat_id) {
            console.log('No chat_id ', context.state);
            return false;
        }

        slaveBotLogger.debug({ peerId }, 'Get message ');

        if (!$groupId) {
            slaveBotLogger.warn('Group id in vk message is undefined ');
            return false;
        }



        // Работа с вложениями

        const uploaded_attaches: string[] = [];

        // для каждого вложения
        for (let attach of attachments) {
            const attachJson = attach.toJSON() as any;

            // Если документ
            if (attach.type === AttachmentType.DOCUMENT) {
                // url
                const { url, extension }: { url: string, extension: string } = attachJson;

                // mimetype
                const mimetype = mime.getType(extension);
                if (!mimetype) continue;

                // Загружаем на бэк
                const { internalFileURL, ...uploadFileError } =
                    await this.backend.uploadFile({
                        fileURL: changeHttpsToHttp(url),
                        mimetype: mimetype
                    });

                if (uploadFileError.isError) {
                    slaveBotLogger.warn(uploadFileError.error, 'Upload document error');
                    continue;
                }

                // Сохраняем внутренний путь
                uploaded_attaches.push(internalFileURL);
                continue;
            }

            // Если фото
            if (attach.type === AttachmentType.PHOTO) {
                // Получаем url
                const fullURL: string = attachJson.largeSizeUrl;
                if (!fullURL) continue;

                // mimetype
                const mimetype = mime.getType(
                    fullURL
                        .slice(
                            0,
                            fullURL.indexOf('?')
                        )
                );

                if (!mimetype) continue;

                // Загружаем на бэк
                const { internalFileURL, ...uploadFileError } =
                    await this.backend.uploadFile({
                        fileURL: changeHttpsToHttp(fullURL),
                        mimetype: mimetype
                    });

                if (uploadFileError.isError) {
                    slaveBotLogger.warn(uploadFileError.error, 'Upload photo error');
                    continue;
                }

                // Сохраняем внутренний путь
                uploaded_attaches.push(internalFileURL);
                continue;
            }
        }



        // Собрать сообщение
        // Отправить сообщение на бэкэнд
        slaveBotLogger.debug('Sending msg to backend');
        const isOk = await this.backend.resendMessageFromClient({
            internal_chat_id: internal_chat_id,
            text: text || '',
            attachmentURLs: uploaded_attaches,
        });

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