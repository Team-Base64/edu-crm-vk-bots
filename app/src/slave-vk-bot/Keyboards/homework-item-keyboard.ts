import { Keyboard } from "vk-io";

export const HomeworkActionsKeyboard = (homework_id: number | string) => {
    return Keyboard
        .builder()
        .textButton({
            label: 'Посмотреть полностью',
            color: 'secondary',
            payload: {
                command: '/tasks',
                homework_id: homework_id,
            },
        })
        .textButton({
            label: 'Отправить решение',
            color: 'positive',
            payload: {
                command: '/solution',
                homework_id: homework_id,
            },
        });
};
