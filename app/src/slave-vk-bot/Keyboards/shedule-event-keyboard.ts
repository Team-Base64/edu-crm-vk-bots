import { Keyboard } from "vk-io";
import { EventPayload } from "../../backend/models";

export const SheduleEventKeyboard = (event: EventPayload) =>
    Keyboard
        .builder()
        .textButton({
            label: 'Попросить перенести',
            color: 'negative',
            payload: {
                command: '/shedule_move',
                payload: JSON.stringify(event),
            }
        })