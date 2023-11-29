export namespace CommandPatterns {
    export const Start = /^(\/){0,1}(начать|старт|start|menu|меню|\?)+/i;
    export const Accept = /^(\/){0,1}(принять([\s\S]приглашение)*|accept)+/i;
    export const Chats = /^(\/){0,1}(чаты|chats|контакты|препод|учителя|боты)+/i;
    export const Cancel = /^(\/){0,1}(cancel|отмена|отменить)/i;
}
