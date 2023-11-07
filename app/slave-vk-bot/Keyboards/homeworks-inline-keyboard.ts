import { Keyboard } from "vk-io";
import { HomeworkPayload } from "../../backend/models";

export const HomeworksInlineKeyboard = (homeworks: HomeworkPayload[]) => {
    const builder = Keyboard.keyboard(
        [
            homeworks.map(hw => {
                return Keyboard.textButton({
                    label: hw.title,
                    payload: {
                        homework_id: hw.homework_id,
                    },
                    color: "primary",
                });
            }),
        ]
    );

    return builder.oneTime();
}