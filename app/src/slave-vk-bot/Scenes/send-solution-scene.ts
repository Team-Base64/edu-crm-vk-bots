import { StepScene } from "@vk-io/scenes";
import Store from "../../store/store";
import Backend from "../../backend/backend";
import { parseAttachments, uploadAttachments } from "../../helpers/attachmentsHelper";
import { HomeworkPayload } from "../../backend/models";
import logger from "../../helpers/logger";
import { paginatedKeyboard } from "../../helpers/pagination";
import { HomeworkButton } from "../Keyboards/homeworks-keyboard";

const sceneLogger = logger.child({}, {
    msgPrefix: 'Scene: ',
});

const cacheTime = 10; //60 * 5 * 1000; // 5 минут
const cache = new Map<number, { homeworks: HomeworkPayload[], time: number }>();


const getHomeworks = async (backend: Backend, class_id: number, page: number): Promise<HomeworkPayload[] | undefined> => {
    sceneLogger.debug('Cache');
    const cached = cache.get(class_id);

    if (cached && cached.time + cacheTime > Date.now()) {
        sceneLogger.debug('Cached');
        return cached.homeworks;
    }

    sceneLogger.debug('Not cached');
    const { homeworks, ...homeworksError } = await backend.getClassHomeworks({ class_id: class_id });

    if (homeworksError.isError) {
        sceneLogger.debug('Cache get error');
        return undefined;
    }

    cache.set(class_id, { homeworks: homeworks, time: Date.now() });

    sceneLogger.debug({homeworks}, 'Cache done');
    return homeworks;
}

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

                    const { homework_id } = context.scene.state;
                    const { stundent_id } = context.state;
                    if (!homework_id || !stundent_id) {
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
                    }

                    await context.send('Отправлено');
                    return context.scene.step.next();
                }
            ],
        });
    }
}