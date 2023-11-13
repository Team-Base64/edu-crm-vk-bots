import { Keyboard } from "vk-io";

export const ChatLinkKeyboard = (chats: { group_id: number, title?: string }[]) => {
    return Keyboard.keyboard([
        chats.map(({ group_id, title }, i) => {
            return Keyboard.urlButton({
                label: title || `Чат №${i + 1}`,
                url: `https://vk.com/im?sel=-${group_id}`,
            });
        }),
    ]);
}