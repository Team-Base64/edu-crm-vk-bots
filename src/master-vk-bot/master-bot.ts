import VkBot from "../vk-bot/vk-bot";
import { SessionManager } from '@vk-io/session';
import { SceneManager } from '@vk-io/scenes';

import { CommandPatterns } from "./Commands/command-patterns";
import { MainKeyboard } from "./Keyboards/main-keyboard";
import { AcceptTokenScene } from "./Scenes/accept-token-scene";
import { customSceneMiddleware } from "./Scenes/custom-scene-middleware";

export class VkMasterBot extends VkBot {

    sessionManager: SessionManager;
    sceneManager: SceneManager;

    constructor(token: string, name: string) {
        super(token, 'Master ' + name);

        this.sessionManager = new SessionManager();
        this.sceneManager = new SceneManager();

        this.initMiddlewares();
        this.initSceneManager();
    }

    private initMiddlewares(): void {
        this.vk.updates.on('message_new', this.sessionManager.middleware); // Для сцен, на будущее
        this.vk.updates.on('message_new', this.sceneManager.middleware); // Сцены

        this.initCommandMiddlewares([
            {
                command: CommandPatterns.Start,
                handler: (context) => {
                    return context.send('Привет! Главное меню.', {
                        keyboard: MainKeyboard.oneTime(),
                    });
                }
            },
            {
                command: CommandPatterns.Accept,
                handler: (context) => {
                    return context.scene.enter(AcceptTokenScene.name);
                }
            },

            {
                command: CommandPatterns.Cancel,
                handler: (context) => {
                    if (context.scene.current) {
                        context.scene.canceled = true;
                    }
                }
            },
        ]);

        this.vk.updates.on('message_new', customSceneMiddleware);
    }

    private initSceneManager() {
        this.sceneManager.addScenes([
            AcceptTokenScene.scene
        ]);
    }



}