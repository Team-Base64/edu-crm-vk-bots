import { StepScene } from "@vk-io/scenes";
import { HomeworksInlineKeyboard } from "../Keyboards/homeworks-inline-keyboard";
import Store from "../../store/store";
import Backend from "../../backend/backend";
import { parseAttachments, uploadAttachments } from "../../helpers/attachmentsHelper";

export namespace SendSolutionScene {
    export const name: string = 'solution_scene';

    export const scene = (db: Store, backend: Backend) => {
        return new StepScene(name, {
            steps: [
                async (context) => {
                    if (context.scene.step.firstTime) {
                        const { class_id } = context.state;
                        const { homeworks, ...homeworksError } = await backend.getClassHomeworks({ class_id: class_id });
                        if (homeworksError.isError) {
                            await context.send('Ошибка получения ДЗ');
                            return context.scene.leave();
                        }

                        if (!homeworks.length) {
                            await context.send('Нет доступных заданий');
                            return context.scene.leave();
                        }

                        const kb = HomeworksInlineKeyboard(homeworks);

                        return context.send({
                            message: 'Выбирете задание из списка',
                            keyboard: kb,
                        });
                    }
                    return context.scene.step.next();
                },

                async (context) => {
                    const hw_id = context?.messagePayload?.homework_id;
                    if (!hw_id) {
                        return context.send('Пожалуйста, сначала выберете задание');
                    }
                    context.scene.state.homework_id = hw_id;
                    return context.scene.step.next();
                },

                async (context) => {
                    if (context.scene.step.firstTime) {
                        return context.send('Отправьте решение');
                    }

                    const { homework_id } = context.scene.state;
                    const {stundent_id} = context.state;
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

                    if(sendError.isError){
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