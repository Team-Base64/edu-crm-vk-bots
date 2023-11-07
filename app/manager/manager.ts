import Backend from "../backend/backend";
import { MessagePayload } from "../backend/models";
import logger from "../helpers/logger";
import { VkMasterBot } from "../master-vk-bot/master-bot";
import VkSlaveBot from "../slave-vk-bot/slave-bot";
import Store from "../store/store";
import VkBot from "../vk-bot/vk-bot";

const grpc = require('@grpc/grpc-js');

const managerLogger = logger.child({ class: 'VkBotsManager' });

export default class VkBotsManager {
    db: Store;
    backend: Backend;
    slaves: Map<number, VkSlaveBot>;
    master: { bot: VkMasterBot, group_id: number } | undefined;
    private isInit: boolean;

    constructor(db: Store, bakcend: Backend) {
        this.db = db;
        this.backend = bakcend;
        this.slaves = new Map<number, VkSlaveBot>();
        this.master = undefined;
        this.isInit = false;
    }

    public async init(): Promise<any> {
        managerLogger.info('Starting...');
        this.backend.addHandleMessageFromServerToSlave(this.sendToSlave.bind(this));
        return Promise.all([
            this.initSlaves(),
            this.initMaster()
        ]).then(() => {
            this.isInit = true;
            managerLogger.info('Started');
        })
            .catch(e => {
                managerLogger.error(e, 'Not started');
            });
    }

    private async initSlaves(): Promise<void> {
        managerLogger.debug('Fetch Slave bots from store');
        const bots = await this.db.getSlaveBots();
        if (!bots) {
            managerLogger.error('Cant fetch slave bots');
            return Promise.reject('Cant fetch slave bots');
        }

        if (bots.length < 1) {
            managerLogger.warn('No slave bots...');
        }

        bots.forEach((bot, index) => {
            this.slaves.set(
                bot.vk_group_id,
                new VkSlaveBot(bot.token, `Slave #${index}`, this.db, this.backend)
            );
        });
    }

    private async initMaster(): Promise<void> {
        managerLogger.debug('Fetch Master bots from store');
        const bots = await this.db.getMasterBots();
        if (!bots) {
            managerLogger.error('Cant fetch master bots');
            return Promise.reject('Cant fetch master bots');
        }

        if (bots.length < 1) {
            managerLogger.warn('No master bots');
        }
        const { token, vk_group_id } = bots[0];

        this.master = {
            group_id: vk_group_id,
            bot: new VkMasterBot(token, `Master #1`, this.db, this.backend)
        };
    }

    private async startBot(m: VkBot, group_id: number): Promise<void> {
        managerLogger.debug(`Check group_id of bot ${m.name}`);
        const group_id_check = await m.getBotGroupId();
        if (group_id != group_id_check) {
            managerLogger.error({ group_id, group_id_check }, `Ivalid group ID in Store for ${m.name}`);
            // TODO: обработать ошибку
            throw Error('Invalid group id');
        }
        managerLogger.debug(`Staring bot ${m.name}`);
        await m.start();
        managerLogger.debug(`Bot ${m.name} started`);
    }

    public async startAll(): Promise<void> {
        if (!this.isInit) {
            managerLogger.error('Initialize bots first');
            throw Error('Init first');
        }

        managerLogger.info('Starting Master');
        await this.master?.bot.start();

        managerLogger.info('Starting Slaves');
        for (const [group_id, bot] of this.slaves) {
            await this.startBot(bot, group_id);
        }
    }

    public async sendToSlave(payload : MessagePayload) {
        const sendLogger = managerLogger.child({ func: 'SendToSlave' });
        const {text, internal_chat_id, attachmentURLs} = payload;

        sendLogger.debug({ internal_chat_id }, 'Get bot data using internal chat_id');
        const data = await this.db.getTargetViaInternalChatId(internal_chat_id);
        if (!data) {
            sendLogger.warn({ internal_chat_id }, 'Bot for this chat_id does not exist in DB');
            return;
        }

        const { peer_id, vk_group_id } = data;

        const targ_bot = this.slaves.get(vk_group_id);
        if (!targ_bot) {
            sendLogger.warn({ internal_chat_id }, 'Bot for this chat_id does not exist in Manager');
            return;
        }

        sendLogger.debug('Redirecting message to bot instance');
        return targ_bot.sendMessageToClient(peer_id, text);
    }

    // public async sendToMaster()
}