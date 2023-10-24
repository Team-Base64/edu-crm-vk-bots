import { Keyboard } from "vk-io"

export const MainKeyboard = Keyboard.builder()
    .textButton({
        label: 'Принять приглашение',
        payload: {
            command: '/accept'
        },
        color: "positive",
    })