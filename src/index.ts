import GRPCBackend from "./backend/GRPC-backend/grpc-backend";
import Backend from "./backend/backend";
import BackendMock from "./backend/mock/backend";
import { VkMasterBot } from "./master-vk-bot/master-bot";
import VkSlaveBot from "./slave-vk-bot/slave-bot";
import { JsonStorage } from "./store/JsonDatabase/JsonDB";
import { PostrgesStore } from "./store/PostrgeSQL/postrgesql";
import Store from "./store/store";
import { token, token2, token3 } from "./tokens";
import VkBot from "./vk-bot/vk-bot";

const grpc = require('@grpc/grpc-js');


class VkBotsManager {
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
        this.backend.addHandle(this.sendToSlave.bind(this));
        return Promise.all([
            this.initSlaves(),
            this.initMaster()
        ]).then(() => {
            this.isInit = true;
        });
    }

    private async initSlaves(): Promise<void> {
        const bots = await this.db.getSlaveBots();
        if (!bots) {
            return Promise.reject('Cant init slave bots');
        }

        if (bots.length < 1) {
            console.log('No slave bots....');
        }

        bots.forEach((bot, index) => {
            this.slaves.set(
                bot.vk_group_id,
                new VkSlaveBot(bot.token, `Slave #${index}`, this.db, this.backend)
            );
        });
    }

    private async initMaster(): Promise<void> {
        const bots = await this.db.getMasterBots();
        if (!bots) {
            return Promise.reject('Cant init master bots');
        }

        if (bots.length < 1) {
            console.log('No master bots....');
        }
        const { token, vk_group_id } = bots[0];

        this.master = {
            group_id: vk_group_id,
            bot: new VkMasterBot(token, `Master #1`, this.db, this.backend)
        };
    }

    private async startBot(m: VkBot, group_id: number): Promise<void> {
        const group_id_check = await m.getBotGroupId();
        if (group_id != group_id_check) {
            const e =
                `Group id is different:\n
            \t${m.name}->${m.token.slice(0, 10)}\n
            \t\tRem: ${group_id_check} <-> Loc: ${group_id}`;

            throw Error(e);
        }
        await m.start();
    }

    public async startAll(): Promise<void> {
        if (!this.isInit) {
            throw Error('Init first');
        }

        await this.master?.bot.start();

        for (const [group_id, bot] of this.slaves) {
            await this.startBot(bot, group_id);
        }
    }

    public async sendToSlave(internal_chat_id: number, text: string) {
        const data = await this.db.getTargetViaInternalChatId(internal_chat_id);
        if (!data) {
            return;
        }

        const { peer_id, vk_group_id } = data;

        const targ_bot = this.slaves.get(vk_group_id);
        if (!targ_bot) {
            return;
        }

        return targ_bot.sendMessageToClient(peer_id, text);
    }

    // public async sendToMaster()
}


(async () => {
    console.log("Hello vk slave bots");

    const db = new PostrgesStore();
    await db.start();

    // const backend = new BackendMock();
    // await backend.start();

    const backend = new GRPCBackend({
        address: '127.0.0.1:8082',
        credentials: grpc.credentials.createInsecure(),
    });

    const manager = new VkBotsManager(db, backend);
    await manager.init();
    await manager.startAll();
    // const mb1 = new VkMasterBot(token2, 'EDUcrm#2', db);
    // await mb1.start();

    // const sb1 = new VkSlaveBot(token, 'EDUcrm#1', db);
    // await sb1.start();

    // const sb2 = new VkSlaveBot(token3, 'EDUcrm#3', db);
    // await sb2.start();
})();

