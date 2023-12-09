import { StepScene } from "@vk-io/scenes";
import Backend from "../../backend/backend";
import { HomeworkPayload } from "../../backend/models";
import { parseAttachments, uploadAttachments } from "../../helpers/attachmentsHelper";
import logger from "../../helpers/logger";
import { paginatedKeyboard } from "../../helpers/pagination";
import Store from "../../store/store";
import { HomeworkButton } from "../Keyboards/homeworks-keyboard";
import { MainKeyboard } from "../Keyboards/main-keyboard";

const sceneLogger = logger.child({}, {
    msgPrefix: 'Сцена отправки решения: ',
});

const cacheTime = 10; //60 * 5 * 1000; // 5 минут
const cache = new Map<number, { homeworks: HomeworkPayload[], time: number; }>();


const getHomeworks = async (backend: Backend, class_id: number, page: number): Promise<HomeworkPayload[] | undefined> => {
    const cached = cache.get(class_id);

    if (cached && cached.time + cacheTime > Date.now()) {
        sceneLogger.debug('Достаём дз из кэша');
        return cached.homeworks;
    }

    const { homeworks, ...homeworksError } = await backend.getClassHomeworks({ class_id: class_id });

    if (homeworksError.isError) {
        sceneLogger.debug('Ошибка обновления кэша ДЗ');
        return undefined;
    }

    cache.set(class_id, { homeworks: homeworks, time: Date.now() });

    return homeworks;
};

export namespace SendSolutionScene {
    export const name: string = 'solution_scene';

    export const scene = (db: Store, backend: Backend) => {
        return new StepScene(name, {
            steps: [
                async (context) => {
                    const hw_id = context?.messagePayload?.homework_id;
                    if (hw_id) {
                        context.scene.state.homework_id = hw_id;
                        return context.scene.step.next();
                    }

                    const { class_id } = context.state;

                    if (!class_id) {
                        await context.send('Ошибка авторизации');
                        return context.scene.leave();
                    }


                    const page = context?.messagePayload?.page || 0;

                    const homeworks = await getHomeworks(backend, class_id, page);

                    if (!homeworks) {
                        await context.send('Ошибка получения дз');
                        return context.scene.leave();
                    }

                    if (!homeworks.length) {
                        await context.send('Нет доступных заданий');
                        return context.scene.leave();
                    }

                    if (context.scene.step.firstTime) {
                        await context.send('Пожалуйста, выберете задание');
                    }

                    const kb = paginatedKeyboard(homeworks, HomeworkButton, page);
                    await context.send({
                        message: `Страница ${page + 1}`,
                        keyboard: kb,
                    });
                },

                async (context) => {
                    if (context.scene.step.firstTime) {
                        return context.send('Отправьте решение');
                    }

                    const  homework_id  = context.scene.state.homework_id;
                    const stundent_id  = context.state.student_id;
                    if (!homework_id || !stundent_id) {
                        sceneLogger.warn({homework_id, stundent_id} , 'Неверный контекст');
                        await context.send('Что-то пошло не так');
                        return context.scene.leave();
                    }

                    const { text, attachments } = context;

                    if (!text && !attachments) {
                        return context.send('Ничего не прикреплено. Повторите отправку');
                    }

                    await context.send('Отправка... Ожидайте');

                    let internal_urls: string[] = [];
                    if (attachments) {
                        const parsed = parseAttachments(attachments);
                        internal_urls = await uploadAttachments(parsed, backend);
                    }

                    const { ...sendError } = await backend.sendHomeworkSolution({
                        student_id: stundent_id,
                        homework_id: homework_id,
                        solution: {
                            text: text || '',
                            attachmentURLs: internal_urls,
                        }
                    });

                    if (sendError.isError) {
                        await context.send('Ошибка отправки');
                        return context.scene.leave();
                    } else {
                        await context.send('Отправлено');
                    }

                    await context.send({
                        message: 'Возврат к обмену сообщениями',
                        keyboard: MainKeyboard
                    });
                    return context.scene.leave();
                }
            ],
        });
    };
}
