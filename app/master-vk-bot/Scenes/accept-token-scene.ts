import { StepScene } from "@vk-io/scenes";
import { AcceptTokenKeyboard } from "../Keyboards/accept-token-keyboard";
import { leaveHandlerCustom } from "./custom-scene-middleware";
import { MainKeyboard } from "../Keyboards/main-keyboard";
import { InviteData } from "../master-bot";

export namespace AcceptTokenScene {
    export const name: string = 'accept_scene';
    export const scene = (handleInvite: (data: InviteData) => void) => {
        return new StepScene(name, {
            steps: [
                (context) => {
                    if (context.scene.step.firstTime) {
                        return context.send('Пожалуйста, отправьте токен преподавателя', {
                            keyboard: AcceptTokenKeyboard,
                        });
                    }
                    return context.scene.step.next();
                },
                async (context) => {

                    if (context.scene.step.firstTime || !context.text) {
                        return;
                    }
                    const invite_token = context.text;
                    const invite_data: InviteData = {
                        invite_token: invite_token,
                        peer_id: context.peerId
                    }

                    handleInvite(invite_data);
                    return context.scene.step.next(); // Automatic exit, since this is the last scene
                }
            ],
            leaveHandler: (context) => {
                console.log('leave handler cust ', context.scene);
            }
        },
        
        );
    }

}