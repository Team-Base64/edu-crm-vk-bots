export namespace CommandPatterns {
    export const Start = /^(\/){0,1}(начать|старт|start)+/
    export const Accept = RegExp(`^(\/){0,1}(принять([\s\S]приглашение)*|accept)+`)
    export const Cancel = /^(\/){0,1}(cancel|отмена|отменить)/
}
