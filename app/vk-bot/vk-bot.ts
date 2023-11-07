import { VK } from "vk-io";
import { NextMiddleware } from "middleware-io";
import { ContextDefaultState, MessageContext } from "vk-io";
import Store from "../store/store";
import { gracefulStop } from "../helpers/graceful-stop";
import Backend from "../backend/backend";
import logger from "../helpers/logger";

const vkBotLogger = logger.child({}, {
    msgPrefix: 'VkBotShared: ',
});

interface CommandMiddleware {
    command: string | RegExp;
    handler: (context: MessageContext<ContextDefaultState>) => any;
}

export default class VkBot {
    public readonly token: string;
    public readonly name: string;

    protected vk: VK;
    protected db: Store;
    protected backend: Backend;
    protected group_id: number;

    constructor(token: string, name: string, db: Store, backend: Backend) {
        this.token = token;
        this.name = name;
        this.db = db;
        this.backend = backend;
        this.vk = new VK({
            token: this.token,
        });
        this.group_id = 0;
        gracefulStop(this.stop.bind(this));
    }

    public async getBotGroupId() {
        vkBotLogger.debug('Getting vk group_id');
        const data = await this.vk.api.groups.getById({});
        if (!data[0].id) {
            vkBotLogger.error('Getting vk group_id error');
            throw Error('Error while getting bot group id');
        }

        return data[0].id;
    }

    public async start() {
        vkBotLogger.info(`Starting bot ${this.name}`);

        this.group_id = await this.getBotGroupId();

        if (this.vk.updates.isStarted) {
            vkBotLogger.debug(`Bot ${this.name} already started`);
            return Promise.resolve();
        }

        return this.vk.updates.start()
            .then(() => {
                vkBotLogger.info(`Bot ${this.name} started`);
                return Promise.resolve();
            })
            .catch(e => {
                vkBotLogger.error(e, `Bot ${this.name} not started`);
                Promise.reject();
            });
    }

    public async stop() {
        vkBotLogger.info(`Stopping bot ${this.name}`);
        if (!this.vk.updates.isStarted) {
            vkBotLogger.debug(`Bot ${this.name} already stopped`);
            return Promise.resolve();
        }
        return this.vk.updates.stop()
            .then(() => {
                vkBotLogger.info(`Bot ${this.name} stopped`);
                return Promise.resolve();
            })
            .catch(e => {
                vkBotLogger.error(e, `Bot ${this.name} not stopped`);
                Promise.reject();
            });
    }

    public async sendMessageToClient(peer_id: number, text: string) {
        return this.vk.api.messages.send({
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
                            context.state.isCommand = true;
                            await mw.handler(context);
                            // return next();
                            break;
                        }
                    } else if (typeof mw.command === 'string') {
                        if (mw.command === check_value) {
                            context.state.isCommand = true;
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
