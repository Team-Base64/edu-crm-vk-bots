import { NextMiddleware } from "middleware-io";
import { ContextDefaultState, MessageContext } from "vk-io";
import Backend from "../backend/backend";
import logger from "../helpers/logger";
import Store from "../store/store";
import VkBot from "../vk-bot/vk-bot";

import { SceneManager } from "@vk-io/scenes";
import { SessionManager } from "@vk-io/session";
import { HomeworkPayload } from "../backend/models";
import { loadAttachments, parseAttachments, uploadAttachments } from "../helpers/attachmentsHelper";
import { dateToString } from "../helpers/date";
import { CommandPatterns } from "./Commands/command-patterns";
import { HomeworkActionsKeyboard } from "./Keyboards/homework-item-keyboard";
import { MainKeyboard } from "./Keyboards/main-keyboard";
import { SendSolutionScene } from "./Scenes/send-solution-scene";

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
            },
            {
                command: CommandPatterns.Start,
                handler: ctx => {
                    return ctx.send({
                        message: 'Все готово! Можете начинать общаться с преподавателем.',
                        keyboard: MainKeyboard
                    });
                }
            },
            {
                command: CommandPatterns.Help,
                handler: ctx => {
                    return ctx.send(
                        'Добро пожаловать в VK бота сервиса EDUCRM!\n' +
                        'Важные замечания:\n' +
                        '- В нашем сервисе можно прикреплять только картинки и pdf'
                    );
                }
            },
            {
                command: CommandPatterns.Shedule,
                handler: this.handleGetShedule.bind(this),
            },
            {
                command: CommandPatterns.Tasks,
                handler: this.handleGetTasks.bind(this),
            },
        ]);

        // this.vk.updates.on('message_new', customSceneMiddleware);

        this.vk.updates.on('message_new', this.messageMiddleware.bind(this));
    }

    private async handleGetShedule(context: MessageContext) {
        const { class_id } = context.state;
        slaveBotLogger.debug({ class_id }, 'Обработка получения эвентов');
        if (!class_id) {
            slaveBotLogger.error('Получение эвентов: class_id === null');
            return context.send('Произошла ошибка, повторите позднее');
        }

        const { isError, error, events } = await this.backend.getClassEvents({
            classID: class_id
        });

        if (isError) {
            slaveBotLogger.error(error, 'Ошибка получения эвентов');
            return context.send('Произошла ошибка, повторите позднее');
        }

        if (!events.length) {
            return context.send('В этом классе занятия пока не запланированы');
        }

        await context.send('Ваше расписание:');

        events.forEach(async (event, index) => {
            const durationDate = new Date(Math.abs(Date.parse(event.endDateISO) - Date.parse(event.startDateISO)));
            const duration =
                (durationDate.getHours() < 10 ? '0' : '')
                +
                durationDate.getHours()
                +
                ':'
                +
                (durationDate.getMinutes() < 10 ? '0' : '')
                +
                durationDate.getMinutes()
                ;

            const start = dateToString(new Date(event.startDateISO));
            await context.send({
                message: `${index + 1}: ${event.title || 'Без заголовка'}\n` +
                    `Начало: ${start}\n` +
                    `Продолжительность: ${duration}\n` +
                    `Описание:\n${event.description || 'Без описания'}`,
            });

        });

        return;
    }

    private async handleSendSolution(context: MessageContext) {
        context.scene.enter(SendSolutionScene.name);
    }

    private async handleGetTasks(context: MessageContext) {
        const { peerId } = context;
        const hwID = context?.messagePayload?.homework_id;

        if (!hwID) {
            slaveBotLogger.error('Получение задач, нет HW ID');
            return context.send('Ошибка получения полного дз');
        }

        const { isError, homeworks } = await this.getHomeworks(context);

        if (isError) {
            return context.send('Ошибка получения полного дз');
        }


        const hw = homeworks.find(({ homework_id }) => hwID === homework_id);
        if (!hw) {
            slaveBotLogger.warn({ hwID }, 'Получение задач: дз не найдено');
            return context.send('ДЗ не найдено');
        }

        const { title, description, tasks, createDateISO, deadlineDateISO } = hw;

        await context.send({
            message: `Домашнее задание: ${title || 'Без заголовка'}
                Дата выдачи: ${dateToString(new Date(createDateISO))}
                Срок выполнения: ${dateToString(new Date(deadlineDateISO))}
                Описание:\n${description || 'Без описания'}
                Задачи: ${tasks.length ? '\n' : 'Без задач'}
                `,
        });

        for (let [index, task] of tasks.entries()) {
            const { description, attachmentURLs } = task;

            // TODO error while upload is ignored
            const attaches = await loadAttachments(peerId, this.vk, attachmentURLs);

            await context.send({
                message: `Задача №${index + 1}
                Описание:\n${description || 'Без описания'}
                `,
                attachment: attaches,
            });
        }
    }

    private async getHomeworks(context: MessageContext): Promise<{ isError: boolean, homeworks: HomeworkPayload[]; }> {
        const { class_id } = context.state;

        slaveBotLogger.debug({ class_id }, 'Обработка получения домашних заданий');
        if (!class_id) {
            slaveBotLogger.error('Получение дз: class_id === null');
            return { isError: true, homeworks: [] };
        }

        const { homeworks, ...getHomeworksError } = await this.backend.getClassHomeworks({
            class_id: class_id,
        });

        if (getHomeworksError.isError) {
            slaveBotLogger.warn(getHomeworksError.error, 'Ошибка получения дз с бэка');
            return { isError: true, homeworks: [] };
        }

        return { isError: false, homeworks: homeworks };
    }

    private async handleGetHomeworks(context: MessageContext<ContextDefaultState>) {

        const { isError, homeworks } = await this.getHomeworks(context);

        if (isError) {
            return context.send('Не получилось загрузить домашние задния');
        }

        if (!homeworks.length) {
            return context.send('Нет домашних заданий');
        }

        await context.send('Ваши домашние задания:');

        for (let [index, hw] of homeworks.entries()) {
            const { tasks, title, description, homework_id, deadlineDateISO } = hw;
            await context.send({
                message: `${index + 1}: ${title || 'Без заголовка'}
                Срок выполнения: ${dateToString(new Date(deadlineDateISO))}
                Описание:\n${description || 'Без описания'}
                Количество задач: ${tasks.length ? tasks.length : 'Без задач'}
                `,
                keyboard: HomeworkActionsKeyboard(homework_id).inline()
            });
        }
    }

    private async authMiddleware(context: MessageContext<ContextDefaultState>, next: NextMiddleware) {
        const { peerId } = context;
        const { group_id } = this;

        slaveBotLogger.debug({ peerId, group_id }, 'Проверка авторизации');

        // Проверить что пользователь привязан к боту и чату в crm
        // Получить из базы chat_id
        const chatData = await this.db.getChatInfo(peerId, group_id);

        if (!chatData) {
            slaveBotLogger.debug({ peerId, group_id }, 'Vk user is not linked to bot');
            return context.send("С этим ботом не связан ваш преподаватель", { peer_id: peerId });
        }

        // Получить stundent_id;
        const student_id = await this.db.getStudentId(peerId);

        if (!student_id) {
            slaveBotLogger.debug({ peerId, group_id }, 'Vk user is not linked to student');
            return context.send("Не удалось загрузить ваш профиль. повторите позднее", { peer_id: peerId });
        }

        // Создать чат, если его ещё нет (первое сообщение)
        if (chatData.internal_chat_id === null) {
            const { internal_chat_id, ...createChatError } = await this.backend.createInternalChat({
                class_id: chatData.class_id,
                student_id
            });

            if (createChatError.isError) {
                slaveBotLogger.debug({ peerId, group_id }, 'Error creating chat');
                return context.send('Не удалось создать чат. Повторите попытку позднее');
            }

            if (!await this.db.updateChatIds(internal_chat_id, peerId, group_id)) {
                slaveBotLogger.debug({ peerId, group_id }, 'Error update chat id');
                return context.send('Не удалось создать чат. Повторите попытку позднее');
            }

            const isOk = await this.backend.resendMessageFromClient({
                internal_chat_id: internal_chat_id,
                text: 'Ученик присоединился к классу!',
                attachmentURLs: [],
            });

            if (!isOk) {
                slaveBotLogger.error('Sending first msg to backend failed');
            }

            chatData.internal_chat_id = internal_chat_id;
        }

        slaveBotLogger.debug({ peerId, group_id, chatData, student_id }, 'Авторизация ОК');

        context.state = { ...context.state, ...chatData, student_id };
        return next();
    }

    private async messageMiddleware(context: MessageContext<ContextDefaultState>, next: NextMiddleware) {

        if (context.state.isCommand) {
            return next();
        }

        if (context.isCropped) {
            await context.loadMessagePayload({ force: true });
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


        slaveBotLogger.debug({ uploaded_attaches }, 'Upload attachments in message');
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
