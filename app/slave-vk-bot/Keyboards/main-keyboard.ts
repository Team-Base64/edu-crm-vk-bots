import { Keyboard } from "vk-io";

export const MainKeyboard = Keyboard.builder()
.textButton({
    label: 'Отправить решение',
    payload: {
        command: '/solution'
    },
    color: "primary",
})
.row()
.textButton({
    label: 'Мои домашние задания',
    payload: {
        command: '/homeworks'
    },
    color: "secondary",
})
.oneTime();