import { Keyboard } from "vk-io";

export const AcceptTokenKeyboard = Keyboard.builder()
    .textButton({
        label: 'Отменить',
        payload: {
            command: '/cancel'
        },
        color: "negative",
})