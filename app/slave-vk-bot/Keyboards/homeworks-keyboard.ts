import { Keyboard } from "vk-io";
import { HomeworkPayload } from "../../backend/models";
import { paginate } from "../../helpers/pagination";
import logger from "../../helpers/logger";

const hwsOnPage = 4;

export const HomeworksKeyboard = (homeworks: HomeworkPayload[], page: number) => {
    logger.debug('Keyboard builder');
    const { data, isFirstPage, isLastPage } = paginate(homeworks, page, hwsOnPage);

    const prev = isFirstPage ?
        []
        :
        [
            Keyboard.textButton({
                label: 'Предудущая',
                payload: {
                    page: page - 1,
                },
                color: 'secondary',
            })
        ];

    const next = isLastPage ?
        []
        :
        [
            Keyboard.textButton({
                label: 'Следующая',
                payload: {
                    page: page + 1,
                },
                color: 'secondary',
            })
        ];

    const builder = Keyboard.keyboard(
        [
            ...data.map(hw => {
                return Keyboard.textButton({
                    label: hw.title,
                    payload: {
                        homework_id: hw.homework_id,
                    },
                    color: "primary",
                });
            }),
            [
                ...prev,
                ...next,
            ]
        ]
    );

    return builder.oneTime();
}