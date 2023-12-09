import { Keyboard } from "vk-io";
import { HomeworkPayload } from "../../backend/models";

const hwsOnPage = 4;

export const HomeworkButton = (homework: HomeworkPayload) => {
    return Keyboard.textButton({
        label: homework.title,
        payload: {
            homework_id: homework.homework_id,
        },
        color: "primary",
    });
};
