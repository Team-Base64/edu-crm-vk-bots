import { Keyboard } from "vk-io";

export const ChatLinkKeyboard = (group_id: number, title: string = 'Ссылка на чат') => {
    return Keyboard.builder()
        .urlButton({
            label: title,
            url: `https://vk.com/im?sel=-${group_id}`,
        });
}