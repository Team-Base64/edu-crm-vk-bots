import { VK } from "vk-io";
import { gracefulStop } from "../helpers/graceful-stop";
import { Middleware, NextMiddleware } from "middleware-io";
import { ContextDefaultState, MessageContext } from "vk-io";

interface CommandMiddleware {
    command: string | RegExp;
    handler: (context: MessageContext<ContextDefaultState>) => any;
}

export default class VkBot {
    protected token: string;
    protected vk: VK;
    protected name: string;
    constructor(token: string, name: string) {
        this.token = token;
        this.name = name;
        this.vk = new VK({
            token: this.token,
        });

        gracefulStop(this.stop.bind(this));
    }

    public async start() {
        console.log('Starting bot ', this.name);
        if (this.vk.updates.isStarted) {
            console.log(`Bot ${this.name} already started`);
            return Promise.resolve();
        }

        this.vk.updates.start()
            .then(() => {
                console.log(`Bot ${this.name} started successfully`);
                return Promise.resolve();
            })
            .catch(e => {
                console.log(`Bot ${this.name} started with error: \n\t ${e}`);
                Promise.reject();
            });
    }

    public async stop() {
        console.log('Stopping bot ', this.name);
        if (!this.vk.updates.isStarted) {
            console.log(`Bot ${this.name} already stopped`);
            return Promise.resolve();
        }
        this.vk.updates.stop()
            .then(() => {
                console.log(`Bot ${this.name} stopped successfully`);
                return Promise.resolve();
            })
            .catch(e => {
                console.log(`Bot ${this.name} stopped with error: \n\t ${e}`);
                Promise.reject();
            });
    }

    public async sendMessageToClient(peer_id: number, text: string) {
        this.vk.api.messages.send({
            peer_id: peer_id,
            message: text,
            random_id: Date.now() + peer_id,
        })
    }

    protected initCommandMiddlewares = (cmdMiddleware: CommandMiddleware[]): void => {

        this.vk.updates.on('message_new',
            async (context: MessageContext<ContextDefaultState>, next: NextMiddleware) => {

                let check_value: undefined | string = undefined;

                // Проверить payload
                if (context.hasMessagePayload && context.messagePayload.command) {
                    check_value = context.messagePayload.command;
                }

                // Проверить текст
                if (!check_value && context.text) {
                    check_value = context.text;
                }

                if (!check_value) {
                    return next();
                }

                for (let mw of cmdMiddleware) {
                    if (mw.command instanceof RegExp) {
                        if (mw.command.test(check_value as string)) {
                            await mw.handler(context);
                            // return next();
                            break;
                        }
                    } else if (typeof mw.command === 'string') {
                        if (mw.command === check_value) {
                            await mw.handler(context);
                            // return next();
                            break;
                        }
                    }
                }

                return next();
            }
        );
    }
}