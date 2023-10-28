import VkBot from "../vk-bot/vk-bot";
import Store from "../store/store";
import Backend from "../backend/backend";

import { SessionManager } from '@vk-io/session';
import { SceneManager } from '@vk-io/scenes';
import { CommandPatterns } from "./Commands/command-patterns";
import { MainKeyboard } from "./Keyboards/main-keyboard";
import { AcceptTokenScene } from "./Scenes/accept-token-scene";
import { customSceneMiddleware } from "./Scenes/custom-scene-middleware";
import { randomInt } from "crypto";
import logger from "../helpers/logger";

export interface InviteData {
    invite_token: string,
    peer_id: number,
}

const masterBotLogger = logger.child({ class: 'VkMasterBot' });

export class VkMasterBot extends VkBot {

    sessionManager: SessionManager;
    sceneManager: SceneManager;

    constructor(token: string, name: string, db: Store, backend: Backend) {
        super(token, name, db, backend);

        this.sessionManager = new SessionManager();
        this.sceneManager = new SceneManager();

        this.initMiddlewares();
        this.initSceneManager();
    }

    private initMiddlewares(): void {
        this.vk.updates.on('message_new', this.sessionManager.middleware); // Для сцен, на будущее
        this.vk.updates.on('message_new', this.sceneManager.middleware); // Сцены

        this.initCommandMiddlewares([
            {
                command: CommandPatterns.Start,
                handler: (context) => {
                    return context.send('Привет! Главное меню.', {
                        keyboard: MainKeyboard.oneTime(),
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
            AcceptTokenScene.scene(this.handleInvite.bind(this))
        ]);
    }

    private async handleInvite(data: InviteData) {
        masterBotLogger.debug(data, 'Checking invite token');

        // Проверить токен на валидность на бэке 
        const { invite_token, peer_id } = data;
        const expires = await this.backend.validateInviteToken(invite_token);

        // Если не ок, получить undefined
        if (!expires) {
            masterBotLogger.debug({invite_token}, 'Invite token not found');
            this.sendMessageToClient(peer_id, 'Не нашли токен для приглашения ' + invite_token);
            return;
        }

        // Если ок, 

        // Посмтреть есть ли свободные боты 
        masterBotLogger.debug({peer_id}, 'Checking vacant bots for');
        const free_bot_groups_ids = await this.db.getFreeSlaveBots(peer_id);

        // Ошибка при получении ботов
        if (!free_bot_groups_ids) {
            masterBotLogger.error({peer_id}, 'Check vacant bots error for');
            this.sendMessageToClient(peer_id, 'Повторите запрос позже');
            return;
        }

        // Нет свободных ботов
        if (free_bot_groups_ids.length < 1) {
            masterBotLogger.debug({peer_id}, 'Vacant bots not found for');
            this.sendMessageToClient(peer_id, 'Все боты заняты :с');
            return;
        }

        // получить internal_chat_id (создать чат на бэке)
        masterBotLogger.debug('Creating chat');
        const internal_chat_id = await this.backend.createChat();

        if (!internal_chat_id) {
            masterBotLogger.error('Creating chat error');
            this.sendMessageToClient(peer_id, 'Что-то пошло не так');
            return;
        }

        // выбрать бота
        // *тут умный алгоритм*
        const len = free_bot_groups_ids.length;
        const index = len > 1 ? randomInt(0, len - 1) : 0;
        const group_id = free_bot_groups_ids[index];

        // Привязать бота к новому чату
        masterBotLogger.debug({ peer_id, group_id, internal_chat_id }, 'Linking vacant bot ');
        const isOk = await this.db.setInternalChatId(peer_id, group_id, internal_chat_id);

        if (!isOk) {
            masterBotLogger.error({ peer_id, group_id, internal_chat_id }, 'Linking vacant bot error');
            this.sendMessageToClient(peer_id, 'Ошибка :с');
            return;
        }

        this.sendMessageToClient(peer_id, `Токен принят!\n\n
        Для связи с преподавателем используйте:\n
        https://vk.com/im?sel=-${group_id}`)

        return;
    }
}