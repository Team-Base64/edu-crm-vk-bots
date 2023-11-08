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
                    if (context.scene) {
                    console.log('scene');
                        try { context.scene.leave(); }
                        catch {}
                    }
                }
            },
        ]);

        this.vk.updates.on('message_new', this.sceneManager.middlewareIntercept);

        this.vk.updates.on('message_new', (context, next) => {
            if (context.state.isCommand) {
                return next();
            }
            return context.send('Неизвестная команда');
        });
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

        const { class_id, ...validateTokenError } = await this.backend.validateInviteToken({ token: invite_token });

        // Если не ок
        if (validateTokenError.isError) {
            masterBotLogger.debug({ invite_token }, 'Invite token not found');
            this.sendMessageToClient(peer_id, 'Не нашли токен для приглашения ' + invite_token);
            return;
        }

        // Если ок, 

        // Посмотреть привязан ли ВК к студенту 
        masterBotLogger.debug({ peer_id }, 'Checking link vk - stundent');

        let current_student_id = await this.db.getStudentId(peer_id);

        // ошибка undefined        
        if (!current_student_id) {
            masterBotLogger.warn('Get student_id error');
            this.sendMessageToClient(peer_id, 'Ошибка проверки аккаунта. Повторите позже');
            return;
        }

        // НЕТ id == -1
        if (current_student_id < 0) {
            masterBotLogger.debug({ peer_id }, 'Student not exist');

            // Получаем данные 
            const users = await this.vk.api.users.get({ user_ids: [peer_id] })
            const user = users[0];

            // имя фамилию
            const { first_name, last_name } = user;

            // Регаем
            masterBotLogger.debug({ peer_id, first_name, last_name }, 'Registration of student');

            const { isError, error, student_id } = await this.backend.createNewStudent({
                name: [first_name, last_name].join(' '),
                type: 'vk',
            });


            // Если ошибка 
            if (isError) {
                masterBotLogger.warn(error, 'Create student error');
                this.sendMessageToClient(peer_id, 'Не можем зарегистрировать');
                return;
            }

            // Если ок, то линкуем
            masterBotLogger.debug({ peer_id, student_id }, 'Link new student to vk');

            const isOk = await this.db.linkStudent(peer_id, student_id);

            if (!isOk) {
                masterBotLogger.warn('Не получилось связать ВК и студента');
                this.sendMessageToClient(peer_id, 'Не получилось привязать вк');
                return;
            }

            current_student_id = student_id;
        }

        // ДА id > 0 или зарегали

        // TODO привязан ли он к классу

        // Посмтреть есть ли свободные боты 
        masterBotLogger.debug({ peer_id, current_student_id }, 'Checking vacant bots for');
        const free_bot_groups_ids = await this.db.getFreeSlaveBots(peer_id);

        // Ошибка при получении ботов
        if (!free_bot_groups_ids) {
            masterBotLogger.error({ peer_id }, 'Check vacant bots error for');
            this.sendMessageToClient(peer_id, 'Повторите запрос позже');
            return;
        }

        // Нет свободных ботов
        if (free_bot_groups_ids.length < 1) {
            masterBotLogger.debug({ peer_id }, 'Vacant bots not found for');
            this.sendMessageToClient(peer_id, 'Все боты заняты :с');
            return;
        }

        // Есть свободные боты 
        // получить internal_chat_id (создать чат на бэке)
        masterBotLogger.debug('Creating chat');
        const { internal_chat_id, ...createChatError } = await this.backend.createInternalChat({ class_id: class_id, student_id: current_student_id });

        if (createChatError.isError) {
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
        const isOk = await this.db.setInternalChatId(peer_id, group_id, internal_chat_id, class_id);

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