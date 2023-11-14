import { IKeyboardProxyButton, Keyboard } from "vk-io";
import logger from "./logger";
import { P } from "pino";

export const paginate = (data: any[], page: number, els_on_page: number): {
    data: any[],
    isFirstPage: boolean,
    isLastPage: boolean,
} => {
    logger.debug('Keyboard builder');

    let pages = Math.floor(data.length / els_on_page);
    if (pages * els_on_page < data.length) pages++;

    const isFirstPage = page < 1;
    const isLastPage = page >= pages - 1;

    const from = els_on_page * page;
    const to = Math.min(els_on_page * (page + 1), data.length);

    return {
        data: data.slice(from, to),
        isFirstPage: isFirstPage,
        isLastPage: isLastPage,
    }
}

export function paginatedKeyboard<T>(
    content: T[],
    buttonRender: (item: T) => IKeyboardProxyButton,
    page: number,
    command?: string
) {
    const { data, isFirstPage, isLastPage } = paginate(content, page, 4);
   
    const prev = isFirstPage ? [] :
        [
            Keyboard.textButton({
                label: 'Предудущая',
                payload: {
                    command: command ? command : '',
                    page: page - 1,
                },
                color: 'secondary',
            })
        ];

    const next = isLastPage ? [] :
        [
            Keyboard.textButton({
                label: 'Следующая',
                payload: {
                    command: command ? command : '',
                    page: page + 1,
                },
                color: 'secondary',
            })
        ];

    return Keyboard.keyboard(
        [
            ...data.map(item => buttonRender(item)),
            [
                ...prev,
                ...next,
            ]
        ]
    );
}