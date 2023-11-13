import { gracefulStop } from "../../helpers/graceful-stop";
import logger from "../../helpers/logger";
import Store, { VkBotData, VkBotLink } from "../store";
import { Client, ClientConfig } from "pg";

const posrgresLogger = logger.child({}, {
    msgPrefix: 'PostrgesStore'
});

export class PostrgesStore implements Store {

    db: Client;

    constructor(config: ClientConfig) {
        this.db = new Client(config);

        gracefulStop(async () => {
            await this.stop.bind(this);
        });
    }

    public async getStudentId(peer_id: number): Promise<number | undefined> {
        return this.db.query(`select student_id
                                from link_user_student
                                where vk_user_id = $1;`,
            [peer_id])
            .then(data => {
                if (!data.rowCount) {
                    posrgresLogger.debug(peer_id, 'VK user not linked to student');
                    return -1;
                }

                const student_id = data.rows[0].student_id;

                return Number(student_id);
            })
            .catch(e => {
                posrgresLogger.error(e, 'Get student_id error');
                return undefined;
            });

    }

    public async linkStudent(peer_id: number, student_id: number): Promise<boolean> {
        return this.db.query(`insert into link_user_student(vk_user_id, student_id)
                            values($1, $2);`,
            [peer_id, student_id])
            .then(data => {
                if (data.rowCount < 1) {
                    posrgresLogger.warn('Link vk user and student error');
                    return false;
                }

                return true;
            }).catch(e => {
                posrgresLogger.error(e, 'Link vk user and student error');
                return false;
            });
    }

    public async start() {
        posrgresLogger.info('Connecting to db');
        return this.db.connect().then(() => {
            posrgresLogger.info('Connected to db');
            return;
        })
            .catch(e => {
                posrgresLogger.error(e, 'db connection error ');
                return Promise.reject();
            });
    }

    public async stop() {
        posrgresLogger.info('Disconnecting db');
        return this.db.end().then(() => {
            posrgresLogger.info('Disconnected db');
            return;
        })
            .catch(e => {
                posrgresLogger.error(e, 'db disconnection error');
                return;
            });
    }

    public async getChatInfo(peer_id: number, group_id: number): Promise<{ class_id: number, internal_chat_id: number } | undefined> {
        return this.db.query(`select internal_chat_id, class_id
                              from link_user_bot_chat
                              where vk_group_id = $1
                                and vk_user_id = $2;`,
            [group_id, peer_id])
            .then(data => {
                if (!data.rows[0]) {
                    return undefined;
                }
                const internal_chat_id = data.rows[0].internal_chat_id;
                const class_id = data.rows[0].class_id;
                return { internal_chat_id: internal_chat_id, class_id: class_id };
            })
            .catch(e => {
                posrgresLogger.error(e, 'Get chat info error');
                return undefined;
            });
    }

    public getClassChat(peer_id: number, class_id: number): Promise<number | undefined> {
        return this.db.query(`select vk_group_id
        from link_user_bot_chat
        where vk_user_id = $1
          and class_id = $2;`,
            [peer_id, class_id])
            .then(data => {
                posrgresLogger.debug({ rows: data.rows }, 'Связь чата и пользователя');
                if (!data.rowCount) {
                    return -1;
                }
                const group_id = data.rows[0].vk_group_id;
                return group_id;
            })
            .catch(e => {
                posrgresLogger.error(e, 'Get student s class bot error');
                return undefined;
            });
    }

    public setChatInfo(peer_id: number, group_id: number, internal_chat_id: number, class_id: number): Promise<boolean> {
        return this.db.query(`insert into link_user_bot_chat
                                  (internal_chat_id, vk_group_id, vk_user_id, class_id)
                              values ($1, $2, $3, $4)
                              returning internal_chat_id;`,
            [internal_chat_id, group_id, peer_id, class_id])
            .then(data => {
                if (data.rowCount < 1) {
                    return false;
                }
                return true;
            })
            .catch(e => {
                posrgresLogger.error(e, 'Link user to chat and class error');
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
                const group_ids = data.rows.map(item => {
                    return item.vk_group_id;
                })
                return group_ids;
            })
            .catch(e => {
                posrgresLogger.error(e, 'Get free slave bots error');
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
                posrgresLogger.error(e, 'Get bots error');
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
        return this.db.query(`select vk_group_id, vk_user_id, internal_chat_id 
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
                    internal_chat_id: row.internal_chat_id
                }
                return res;
            })
            .catch(e => {
                posrgresLogger.error(e, 'Get bot data via chat id error');
                return undefined;
            });
    }

    public getStudentChats(peer_id: number): Promise<number[] | undefined> {
        return this.db.query(`select vk_group_id 
        from link_user_bot_chat
         where vk_user_id = $1;`,
            [peer_id])

            .then(data => {
                return data.rows.map(r => r.vk_group_id);
            })
            .catch(e => {
                posrgresLogger.error(e, 'Get student chats error');
                return undefined;
            });
    }

}
