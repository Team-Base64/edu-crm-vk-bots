import Backend from "../backend/backend";
import Store from "../store/store";
import VkBot from "../vk-bot/vk-bot";

import { SceneManager } from '@vk-io/scenes';
import { SessionManager } from '@vk-io/session';
import { MessageContext } from "vk-io";
import logger from "../helpers/logger";
import { paginatedKeyboard } from "../helpers/pagination";
import { CommandPatterns } from "./Commands/command-patterns";
import { ChatLinkButton } from "./Keyboards/chat-link-keyboard";
import { MainKeyboard } from "./Keyboards/main-keyboard";
import { AcceptTokenScene } from "./Scenes/accept-token-scene";
import { customSceneMiddleware } from "./Scenes/custom-scene-middleware";

export interface InviteData {
    invite_token: string,
    peer_id: number,
}

const masterBotLogger = logger.child({}, {
    msgPrefix: 'VkMasterBot: '
});

export class VkMasterBot extends VkBot {

    sessionManager: SessionManager;
    sceneManager: SceneManager;

    constructor(token: string, name: string, db: Store, backend: Backend) {
        super(token, name, db, backend);

        this.sessionManager = new SessionManager();
        this.sceneManager = new SceneManager();

        this.initSceneManager();
        this.initMiddlewares();
    }

    private initMiddlewares(): void {
        this.vk.updates.on('message_new', this.sessionManager.middleware); // Для сцен, на будущее
        this.vk.updates.on('message_new', this.sceneManager.middleware); // Сцены
        this.vk.updates.on('message_new', this.sceneManager.middlewareIntercept); // Сцены

        this.initCommandMiddlewares([
            {
                command: CommandPatterns.Start,
                handler: (context) => {
                    return context.send('Привет! Главное меню.', {
                        keyboard: MainKeyboard,
                    });
                }
            },
            {
                command: CommandPatterns.Accept,
                handler: (context) => {
                    return context.scene.enter(AcceptTokenScene.name);
                }
            },

            {
                command: CommandPatterns.Chats,
                handler: this.handleGetChats.bind(this),
            },
            {
                command: CommandPatterns.Cancel,
                handler: (context) => {
                    if (context.scene.current) {
                        context.scene.canceled = true;
                    }
                }
            },
        ]);

        this.vk.updates.on('message_new', customSceneMiddleware);
    }

    private initSceneManager() {
        this.sceneManager.addScenes([
            AcceptTokenScene.scene(this.db, this.backend, this.vk),
        ]);
    }

    private async handleGetChats(context: MessageContext) {
        const { peerId } = context;
        const chats = await this.db.getStudentChats(peerId);
        if (!chats) {
            masterBotLogger.error('Get user chats error');
            return context.send('Не удалось получить список чатов');
        }

        if (!chats.length) {
            return context.send('У вас нет активных чатов');
        }

        const page: number = context.messagePayload.page || 0;

        const data = chats.map((id, index) => {
            return { group_id: id, title: `Чат №${index + 1}` };
        });

        return context.send({
            message: 'Ваши чаты',
            keyboard: paginatedKeyboard(data, ChatLinkButton, page, '/chats').inline(),
        });
    }
}
