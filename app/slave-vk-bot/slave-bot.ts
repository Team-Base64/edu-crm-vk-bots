import VkBot from "../vk-bot/vk-bot"
import Store from "../store/store";
import Backend from "../backend/backend";
import { ContextDefaultState, MessageContext } from "vk-io";
import logger from "../helpers/logger";
import { NextMiddleware } from "middleware-io";

import { CommandPatterns } from "./Commands/command-patterns";
import { MainKeyboard } from "./Keyboards/main-keyboard";
import { SessionManager } from "@vk-io/session";
import { SceneManager } from "@vk-io/scenes";
import { SendSolutionScene } from "./Scenes/send-solution-scene";
import { parseAttachments, uploadAttachments } from "../helpers/attachmentsHelper";

const slaveBotLogger = logger.child({}, {
    msgPrefix: 'SlaveVkBot: '
});

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
        context.scene.enter(SendSolutionScene.name);
    }

    private async handleGetHomeworks(context: MessageContext<ContextDefaultState>) {
        const { peerId } = context;

        const resp = await this.db.getInternalChatId(peerId, this.group_id);
        if (!resp) {
            slaveBotLogger.warn({peerId}, 'Get internal chat id error');
            return;
        }

        const { class_id } = resp;

        const { homeworks, ...getHomeworksError } = await this.backend.getClassHomeworks({
            class_id: class_id,
        });

        if (getHomeworksError.isError) {
            slaveBotLogger.warn(getHomeworksError.error, 'Get homeworks error');
            return context.send('Не получилось загрузить домашние задния :с');
        }

        if (!homeworks.length) {
            return context.send('Нет дз');
        }

        const msg = 'Список дз:\n\n' + homeworks.map((hw, index) => {
            return `
            ${index}: ${hw.title}
            ${hw.description}
            `;
        }).join('');

        return context.send(msg);
    }

    private async authMiddleware(context: MessageContext<ContextDefaultState>, next: NextMiddleware) {
        const { peerId } = context;
        const { group_id } = this;

        // Проверить что пользователь привязан к боту и чату в crm 
        // Получить из базы chat_id 
        const chatData = await this.db.getInternalChatId(peerId, group_id);

        if (!chatData) {
            slaveBotLogger.debug({ peerId, group_id }, 'Vk user is not linked to bot');
            return context.send("С этим ботом не связан ваш преподаватель", { peer_id: peerId });
        }

        // Получить stundent_id; 
        const stundent_id = await this.db.getStudentId(peerId);

        if (!stundent_id) {
            slaveBotLogger.debug({ peerId, group_id }, 'Vk user is not linked to student');
            return context.send("Не удалось загрузить ваш профиль. повторите позднее", { peer_id: peerId });
        }

        context.state = { ...context.state, ...chatData, stundent_id };
        return next();
    }

    private async messageMiddleware(context: MessageContext<ContextDefaultState>, next: NextMiddleware) {

        if (context.state.isCommand) {
            return next();
        }

        const { peerId, $groupId, text, attachments } = context;
        const internal_chat_id: number = context.state.internal_chat_id;

        if (!internal_chat_id) {
            return next();
        }

        if (!$groupId) {
            slaveBotLogger.warn('Group id in vk message is undefined ');
            return next();
        }

        // Работа с вложениями
        let uploaded_attaches: string[] = [];

        if (attachments) {
            const pasrsed = parseAttachments(attachments);
            uploaded_attaches = await uploadAttachments(pasrsed, this.backend);
        }

        // Собрать сообщение
        // Отправить сообщение на бэкэнд
        const isOk = await this.backend.resendMessageFromClient({
            internal_chat_id: internal_chat_id,
            text: text || '',
            attachmentURLs: uploaded_attaches,
        });

        if (!isOk) {
            slaveBotLogger.warn('Sending msg to backend failed');
            return context.send('Сообщение не доставлено');
        }
    }
}