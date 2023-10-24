import { StepScene } from "@vk-io/scenes";
import { AcceptTokenKeyboard } from "../Keyboards/accept-token-keyboard";
import { leaveHandlerCustom } from "./custom-scene-middleware";
import { MainKeyboard } from "../Keyboards/main-keyboard";

export namespace AcceptTokenScene {
    export const name: string = 'accept_scene';

    export const scene = new StepScene(name, {
        steps: [
            (context) => {
                if (context.scene.step.firstTime) { //|| !context.text
                    return context.send('Пожалуйста, отправьте токен преподавателя', {
                        keyboard: AcceptTokenKeyboard,
                    });
                }
                // context.scene.state.token = context.text;
                return context.scene.step.next();
            },

            async (context) => {
                if (context.scene.step.firstTime || !context.text) { //|| !context.text
                    return;
                }
                context.scene.state.token = context.text;
                return context.scene.step.next();
            },

            async (context) => {
                const { token } = context.scene.state;
                await context.send(`Конец сцены. Вы написали: ${token}`);
                return context.scene.step.next(); // Automatic exit, since this is the last scene
            }
        ],
        leaveHandler: leaveHandlerCustom({
            msgCancel: {
                message: 'Принятие приглашения отменено',
                keyboard: MainKeyboard
            },
            msgDone: {
                message: 'Токен принят и проверяется',
                // keyboard: MainKeyboard
            }
        })
    });
}