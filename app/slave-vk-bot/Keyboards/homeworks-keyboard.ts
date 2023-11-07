import { Keyboard } from "vk-io";
import { HomeworkPayload } from "../../backend/models";

const hwsOnPage = 4;

export const HomeworksKeyboard = (homeworks: HomeworkPayload[], page: number) => {
    let pages = Math.floor(homeworks.length / hwsOnPage);
    if (pages * hwsOnPage < homeworks.length) pages++;

    const hasPrev = page > 0;
    const hasNext = page < pages - 1;

    const from = hwsOnPage * page;
    const to = Math.min(hwsOnPage * (page + 1), homeworks.length);

    const content = homeworks.slice(from, to).map(hw => {
        return Keyboard.textButton({
            label: hw.title,
            payload: {
                homework_id: hw.homework_id,
            },
            color: "primary",
        });
    });

    const prev = hasPrev ? [Keyboard.textButton({
        label: 'Предудущая',
        payload: {
            page: page - 1,
        },
        color: 'secondary',
    })] : [];

    const next = hasNext ? [Keyboard.textButton({
        label: 'Следующая',
        payload: {
            page: page + 1,
        },
        color: 'secondary',
    })] : [];

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