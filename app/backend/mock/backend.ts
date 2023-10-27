import {Client, ClientConfig} from "pg";
import { gracefulStop } from "../../helpers/graceful-stop";
import Backend, { ServerMessageToSlaveHandler } from "../backend";

class BackendMock implements Backend {
    db: Client;
    toSlaveHandler: ServerMessageToSlaveHandler[];

    constructor(db_config : ClientConfig) {
        this.db = new Client(db_config);
        this.toSlaveHandler = [];
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

    private async db_getToken(token: string): Promise<number | undefined> {
        console.log('Backend: db get token');
        return this.db.query(`select expires
                              from tokens
                              where token = $1`,
            [token]
        )
            .then(data => {
                if (!data.rows[0]?.expires) {
                    console.log('here');
                    return undefined;
                }
                const expires = Number(data.rows[0].expires);
                return expires;
            })
            .catch(e => {
                console.log('Backend Mock get token error ', e);
                return undefined;
            });
    }

    public async db_createChat(): Promise<number | undefined> {
        console.log('Backend: cheate chat');

        return this.db.query(`insert into internal_chats(slug)
                              values ($1)
                              returning internal_chat_id;`,
            ['slug'])
            .then(data => {
                if (!data.rows[0]?.internal_chat_id) {
                    console.log('Mock backend cant create chat');
                    return undefined;
                }
                return Number(data.rows[0].internal_chat_id);
            })
            .catch(e => {
                console.log('Mock backend cant create chat error ', e);
                return undefined;
            });
    }

    public async validateInviteToken(token: string): Promise<number | undefined> {
        console.log('Backend validate token');
        // Смотрим токен в бд
        const expires = await this.db_getToken(token);

        console.log(expires);
        // Если не нашли
        if (!expires) {
            console.log('\t expires undefined');
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
        console.log('MOCK-GRPC. Sending msg to sever ', text);
        return Promise.resolve(true);
    }

    public resendFromServerToSlave(internal_chat_id: number, text: string): void {
        throw new Error("Method not implemented.");
    }
    public addHandleMessageFromServerToSlave(handler: ServerMessageToSlaveHandler): void {
        this.toSlaveHandler.push(handler);
    }
}

export default BackendMock;
