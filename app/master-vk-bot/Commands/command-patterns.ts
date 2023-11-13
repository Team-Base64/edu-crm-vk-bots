export namespace CommandPatterns {
    export const Start = /^(\/){0,1}(начать|старт|start|menu|меню|\?)+/
    export const Accept = RegExp(`^(\/){0,1}(принять([\s\S]приглашение)*|accept)+`)
    export const Chats = RegExp(`^(\/){0,1}(чаты|chats|контакты|препод|учителя|боты)+`)
    export const Cancel = /^(\/){0,1}(cancel|отмена|отменить)/
}
