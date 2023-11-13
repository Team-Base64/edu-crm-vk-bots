import { StepScene } from "@vk-io/scenes";
import Store from "../../store/store";
import Backend from "../../backend/backend";
import logger from "../../helpers/logger";
import { ChatLinkKeyboard } from "../Keyboards/chat-link-keyboard";
import { Context, VK } from "vk-io";
import { randomInt } from "crypto";

const sceneLogger = logger.child({}, {
    msgPrefix: 'AcceptScene: ',
});

export namespace AcceptTokenScene {
    export const name: string = 'accept_scene';
    export const scene = (db: Store, backend: Backend, vk: VK) => {
        return new StepScene(name, {
            steps: [

                // 1. Получение токена
                (context) => {
                    if (context.scene.step.firstTime) {
                        context.text = undefined;
                        return context.send('Пожалуйста, отправьте токен преподавателя');
                    }

                    if (!context.text) {
                        return;
                    }

                    context.scene.state.invite_token = context.text;
                    sceneLogger.debug({ token: context.text }, 'Token');
                    return context.scene.step.next();
                },

                // 2. Проверка токена на бэке
                async (context) => {

                    const { invite_token } = context.scene.state
                    if (!invite_token) {
                        sceneLogger.warn('Validate token: Нет токена');
                        await context.send('Что-то пошло не так. Повторите позднее');
                        return context.scene.leave();
                    }

                    const { class_id, ...validationError } = await backend.validateInviteToken({
                        token: invite_token
                    });

                    if (validationError.isError) {
                        sceneLogger.debug({ invite_token }, 'Validate token: no such token');
                        await context.send(`Токен "${invite_token}" не найден`);
                        return context.scene.leave();
                    }

                    context.scene.state.class_id = class_id;

                    return context.scene.step.next();
                },

                // 3. Проверка использован ли этот токен
                async (context) => {
                    const { class_id } = context.scene.state;
                    if (!class_id) {
                        sceneLogger.warn('Check link to class: Нет class_id');
                        await context.send('Что-то пошло не так. Повторите позднее');
                        return context.scene.leave();
                    }
                    const { peerId } = context;

                    sceneLogger.debug({ peerId, class_id }, 'Проверка повторного использования токена');

                    const group_id = await db.getClassChat(peerId, class_id);

                    if (group_id === undefined) {
                        sceneLogger.warn('Ошибка проверки связи с ботом');
                        await context.send('Что-то пошло не так. Повторите позднее');
                        return context.scene.leave();
                    }

                    if (group_id > 0) {
                        sceneLogger.debug('Пользователь уже в классе');
                        await context.send({
                            message: 'Вы уже участник класса',
                            keyboard: ChatLinkKeyboard(group_id).inline(),
                        });
                        return context.scene.leave();
                    }

                    sceneLogger.debug('Пользователь НЕ в классе');
                    return context.scene.step.next();
                },

                //4. Получить свободных ботов
                async (context) => {
                    // Посмтреть есть ли свободные боты 
                    sceneLogger.debug('Ищем свободные боты');

                    const { peerId } = context;
                    const free_bot_groups_ids = await db.getFreeSlaveBots(peerId);

                    // Ошибка при получении ботов
                    if (!free_bot_groups_ids) {
                        sceneLogger.error('Ошибка получения свободных ботов');
                        await context.send('Не удалось получить список чатов. Повторите запрос позже');

                        return context.scene.leave();
                    }

                    // Нет свободных ботов
                    if (!free_bot_groups_ids.length) {
                        sceneLogger.debug('Нет свободных ботов');
                        await context.send('Нет свободных чатов :с');

                        return context.scene.leave();
                    }
                    sceneLogger.debug({ free_bot_groups_ids }, 'Есть свободные боты');

                    context.scene.state.free_bots = free_bot_groups_ids;

                    return context.scene.step.next();
                },

                // 5. Посмотреть привязан ли ВК к студенту 
                async (context) => {
                    const { peerId } = context;
                    const student_id = await db.getStudentId(peerId);

                    sceneLogger.debug({ student_id }, 'Профиль');
                    context.scene.state.student_id = student_id;

                    return context.scene.step.next();
                },

                // 6. Регистрация студента
                async (context) => {
                    const this_student_id = context.scene.state.student_id;

                    // ошибка        
                    if (!this_student_id) {
                        sceneLogger.warn(' Ошибка получения профиля');
                        await context.send('Ошибка проверки аккаунта. Повторите позже');

                        return context.scene.leave();
                    }

                    if (this_student_id > 0) {
                        sceneLogger.debug('Аккаунт существует');
                        // Аккаунт есть
                        return context.scene.step.next();
                    }

                    const { peerId } = context;

                    // Получаем данные 
                    const user = (await vk.api.users.get({ user_ids: [peerId] })).at(0);

                    // имя фамилию
                    const { first_name, last_name } = user;

                    sceneLogger.debug({ first_name, last_name }, 'Регистрация');

                    // Регаем
                    const { isError, error, student_id } = await backend.createNewStudent({
                        name: [first_name, last_name].join(' '),
                        type: 'vk',
                    });

                    // Если ошибка 
                    if (isError) {
                        sceneLogger.error({ error }, 'Ошибка регистрации');
                        await context.send('Не удалось вас зарегистрировать. Повторите попытку позже');

                        return context.scene.leave();
                    }

                    // Если ок
                    sceneLogger.debug('Связывает вк и профиль');

                    const isOk = await db.linkStudent(peerId, student_id);

                    if (!isOk) {
                        sceneLogger.error('Ошибка связи');
                        await context.send('Не получилось привязать вк к вашему профилю. Повторите позднее');

                        return context.scene.leave();
                    }

                    // ДА id > 0 или зарегали
                    context.scene.state.student_id = student_id;

                    return context.scene.step.next();
                },

                //7. Создание нового чата
                async (context) => {
                    const { class_id, student_id } = context.scene.state;
                    sceneLogger.debug('Создание чата');

                    const { internal_chat_id, ...createChatError } = await backend.createInternalChat({ class_id: class_id, student_id: student_id });

                    if (createChatError.isError) {
                        sceneLogger.error(createChatError.error, 'Создание чата ошибка');
                        await context.send('Не удалось создать чат. Повторите попытку позднее');

                        return context.scene.leave();
                    }

                    sceneLogger.debug(internal_chat_id, 'Чат создан');
                    context.scene.state.internal_chat_id = internal_chat_id;

                    return context.scene.step.next();
                },

                // 8. Выбор бота
                async (context) => {
                    sceneLogger.debug('Выбор бота');

                    const { free_bots, internal_chat_id, class_id } = context.scene.state;
                    const { peerId } = context;
                    // *тут умный алгоритм*
                    const len = free_bots.length;
                    const index = len > 1 ? randomInt(0, len - 1) : 0;
                    const group_id = free_bots[index];

                    // Привязать бота к новому чату
                    sceneLogger.debug('Привязываем бота к чату и классу');

                    const isOk = await db.setChatInfo(peerId, group_id, internal_chat_id, class_id);

                    if (!isOk) {
                        sceneLogger.error('Ошибка привязки');
                        await context.send('Не удалось привязать вас к чату. Повторите позднее');

                        return context.scene.leave();
                    }

                    // Готово
                    sceneLogger.error('Готово!');

                    await context.send({
                        message: 'Токен принят!',
                        keyboard: ChatLinkKeyboard(group_id, 'Чат с преподавателем').inline(),
                    });

                    return context.scene.step.next();
                }
            ],
        });
    }
}