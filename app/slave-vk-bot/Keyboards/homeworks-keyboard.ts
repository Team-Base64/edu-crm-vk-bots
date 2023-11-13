import { Keyboard } from "vk-io";
import { HomeworkPayload } from "../../backend/models";
import { paginate } from "../../helpers/pagination";
import logger from "../../helpers/logger";

const hwsOnPage = 4;

export const HomeworkButton = (homework: HomeworkPayload) => {
    return Keyboard.textButton({
        label: homework.title,
        payload: {
            homework_id: homework.homework_id,
        },
        color: "primary",
    });
}