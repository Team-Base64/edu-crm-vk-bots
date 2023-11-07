import { Keyboard } from "vk-io";
import { HomeworkData } from "../../backend/models";

export const HomeworksInlineKeyboard = (homeworks: HomeworkData[]) => {
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

    return builder.inline();
}