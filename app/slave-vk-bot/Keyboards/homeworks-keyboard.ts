import { Keyboard } from "vk-io";
import { HomeworkPayload } from "../../backend/models";
import { paginate } from "../../helpers/pagination";

const hwsOnPage = 4;

export const HomeworksKeyboard = (homeworks: HomeworkPayload[], page: number) => {
    const { data, isFirstPage, isLastPage } = paginate(homeworks, page, hwsOnPage);

    const content = data.map(hw => {
        return Keyboard.textButton({
            label: hw.title,
            payload: {
                homework_id: hw.homework_id,
            },
            color: "primary",
        });
    });

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
            ...content,
            [
                ...prev,
                ...next,
            ]
        ]
    );

    return builder.oneTime();
}