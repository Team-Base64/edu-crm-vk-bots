import { Client, ClientConfig } from "pg";
import { gracefulStop } from "../../helpers/graceful-stop";
import Backend, { ServerMessageToSlaveHandler } from "../backend";
import logger from "../../helpers/logger";

const backendLogger = logger.child({ class: 'MOCKbackend' });

class BackendMock implements Backend {
    db: Client;
    toSlaveHandler: ServerMessageToSlaveHandler[];

    constructor(db_config: ClientConfig) {
        this.db = new Client(db_config);
        this.toSlaveHandler = [];
        gracefulStop(this.stop.bind(this));
    }

    public async start() {
        backendLogger.info('Connecting to mock DB');
        return this.db.connect().then(() => {
            backendLogger.info('Connected to mock DB');
            return;
        })
            .catch(e => {
                backendLogger.error(e, 'NOT Connected to mock DB');
                return Promise.reject();
            });
    }

    public async stop() {
        backendLogger.info('Disconnecting posrgres db');

        return this.db.end().then(() => {
            backendLogger.info('Disconnected posrgres db ok');
            return;
        })
            .catch(e => {
                backendLogger.error(e, 'NOT disconnected from posrgres');
                return;
            });
    }

    private async db_getToken(token: string): Promise<number | undefined> {
        return this.db.query(`select expires
                              from tokens
                              where token = $1`,
            [token]
        )
            .then(data => {
                if (!data.rows[0]?.expires) {
                    return undefined;
                }
                const expires = Number(data.rows[0].expires);
                return expires;
            })
            .catch(e => {
                backendLogger.error(e, 'DB Get token error ');
                return undefined;
            });
    }

    public async db_createChat(): Promise<number | undefined> {
        return this.db.query(`insert into internal_chats(slug)
                              values ($1)
                              returning internal_chat_id;`,
            ['slug'])
            .then(data => {
                if (!data.rows[0]?.internal_chat_id) {
                    backendLogger.warn('DB cant create chat');
                    return undefined;
                }
                return Number(data.rows[0].internal_chat_id);
            })
            .catch(e => {
                backendLogger.error(e, 'DB cant create chat');
                return undefined;
            });
    }

    public async validateInviteToken(token: string): Promise<number | undefined> {
        // Смотрим токен в бд
        const expires = await this.db_getToken(token);

        // Если не нашли
        if (!expires) {
            backendLogger.debug('Validation token failed');
            return undefined;
        }

        return expires;
    }

    public async createChat(): Promise<number | undefined> {
        // Если нашли
        // Создаём чат
        const chat_id = await this.db_createChat();

        return chat_id;
    }


    public resendMessageFromClient(internal_chat_id: number, text: string): Promise<boolean> {
        backendLogger.info({internal_chat_id, text}, 'MOCK-GRPC. Sending msg to sever ');
        
        return new Promise(() => {
            setTimeout( () => {
        backendLogger.info({internal_chat_id, text}, 'MOCK-GRPC. msg SENT to sever ');

                return Promise.resolve(true);
            }, 3000);
        });
    }

    public resendFromServerToSlave(internal_chat_id: number, text: string): void {
        throw new Error("Method not implemented.");
    }
    public addHandleMessageFromServerToSlave(handler: ServerMessageToSlaveHandler): void {
        this.toSlaveHandler.push(handler);
    }
}

export default BackendMock;
