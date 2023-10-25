import { gracefulStop } from "../../../helpers/graceful-stop";
import Store, { VkBotData, VkBotLink } from "../store";
import { Client } from "pg";

export class PostrgesStore implements Store {

    db: Client;

    constructor() {
        this.db = new Client({
            user: "george",
            // host: "db",
            host: "localhost",
            password: "1234567890",
            // port: 5432,
            port: 8000,
            database: 'vk_bots_db',
        });

        gracefulStop(async () => {
            await this.stop.bind(this);
        });
    }

    public async start() {
        console.log('Connecting to posrgres db');
        this.db.connect().then(() => {
            console.log('Connecting to posrgres db success');
            return;
        })
            .catch(e => {
                console.log('Failed to connect to postges db\n', e);
                return Promise.reject();
            });
    }

    public async stop() {
        console.log('Disconnecting posrgres db');

        this.db.end().then(() => {
            console.log('Disconnecting posrgres db ok');
            return;
        })
            .catch(e => {
                console.log('Disconnecting posrgres db not ok\n', e);
                return;
            });
    }

    public async getInternalChatId(peer_id: number, group_id: number): Promise<number | undefined> {
        return this.db.query(`select internal_chat_id
                              from link_user_bot_chat
                              where vk_group_id = $1
                                and vk_user_id = $2;`,
            [group_id, peer_id])
            .then(data => {
                console.log(data.rows);
                if (!data.rows[0].internal_chat_id) {
                    return undefined;
                }
                const internal_chat_id = data.rows[0].internal_chat_id;
                return internal_chat_id;
            })
            .catch(e => {
                console.log('Postrges get internal_chat_id error');
                return undefined;
            });
    }

    public setInternalChatId(peer_id: number, group_id: number, internal_chat_id: number): Promise<boolean> {
        return this.db.query(`insert into link_user_bot_chat
                                  (internal_chat_id, vk_group_id, vk_user_id)
                              values ($1, $2, $3)
                              returning internal_chat_id;`,
            [internal_chat_id, group_id, peer_id])
            .then(data => {
                if (data.rowCount < 1) {
                    return false;
                }
                return true;
            })
            .catch(e => {
                console.log('Postrges cant link ', e);
                return false;
            })
    }

    public getFreeSlaveBots(peer_id: number): Promise<number[] | undefined> {
        return this.db.query(`SELECT vk_group_id
                              FROM vk_bots
                              WHERE vk_group_id NOT IN (SELECT vk_group_id
                                                        FROM link_user_bot_chat
                                                        WHERE vk_bots.vk_group_id = link_user_bot_chat.vk_group_id
                                                          AND vk_user_id = $1)
                                AND bot_type = 'S';`,
            [peer_id])
            .then(data => {
                console.log(data.rows);
                const group_ids = data.rows.map(item => {
                    return item.vk_group_id;
                })
                return group_ids;
            })
            .catch(e => {
                console.log('Postrges cant get free bots', e);
                return undefined;
            });

    }

    private async getBots(role: 'M' | 'S'): Promise<VkBotData[] | undefined> {
        return this.db.query(`select token, vk_group_id, bot_type 
        from vk_bots 
        where bot_type = $1;`,
            [role])
            .then(data => {
                if (!data.rows) {
                    return undefined
                }
                return data.rows.map((row): VkBotData => {
                    return {
                        token: row.token,
                        role: row.bot_type,
                        vk_group_id: row.vk_group_id,
                    };
                })
            })
            .catch(e => {
                console.log('Postrges get vk bots ', e);
                return undefined;
            });
    }

    public async getSlaveBots(): Promise<VkBotData[] | undefined> {
        return this.getBots('S');
    }

    public async getMasterBots(): Promise<VkBotData[] | undefined> {
        return this.getBots('M');
    }

    public getTargetViaInternalChatId(internal_chat_id: number): Promise<VkBotLink | undefined> {
        return this.db.query(`select vk_group_id, vk_user_id, inernal_chat_id 
        from link_user_bot_chat
         where internal_chat_id = $1;`,
            [internal_chat_id])

            .then(data => {
                if (!data.rows.length) {
                    return undefined;
                }
                const row = data.rows[0];
                const res: VkBotLink = {
                    peer_id: row.vk_user_id,
                    vk_group_id: row.vk_group_id,
                    internal_chat_id: row.inernal_chat_id
                }
                return res;
            })
            .catch(e => {
                console.log('Postrges get bot data via chat id ',e );
                return undefined;
            });
    }
}
