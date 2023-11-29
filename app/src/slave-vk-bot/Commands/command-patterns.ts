export namespace CommandPatterns {
    export const Menu = /^(\/){0,1}(меню|menu|действия|actions)+/i;
    export const Homeworks = /^(\/){0,1}(дз|homeworks)+/i;
    export const NewSolution = /^(\/){0,1}(решение|сдать|solution)+/i;
    export const Cancel = /^(\/){0,1}(cancel|отмена|отменить)/i;
    export const Start = /^(\/){0,1}(Начать|начать|start)/i;
    export const Help = /^(\/){0,1}(help|помощь|h|\?)/i;
}
