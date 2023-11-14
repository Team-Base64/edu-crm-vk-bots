import { Keyboard } from "vk-io";

interface props {
    group_id: number;
    title?: string
};

export const ChatLinkButton = (data: props) => {
    const { group_id, title } = data;
    return Keyboard.urlButton({
        label: title || 'Ссылка на чат',
        url: `https://vk.com/im?sel=-${group_id}`,
    });
}

export const ChatLinkKeyboard = (data: props) => {
    return Keyboard.keyboard([
        ChatLinkButton(data)
    ]);
}