import { JsonDB, Config } from 'node-json-db';

abstract class Store {
    public abstract getInternalChatId(peer_id: number, group_id: number): Promise<number | undefined>;

    public abstract setInternalChatId(peer_id: number, group_id: number, chat_id: number): Promise<boolean>;
}


export class JsonStorage implements Store {
    db: JsonDB;
    constructor(path: string) {
        this.db = new JsonDB(new Config(path, true, true, '/'));
    }

    public async getInternalChatId(peer_id: number, group_id: number): Promise<number | undefined> {
        const path = '/chats/' + String(peer_id) + String(group_id);
        console.log('DB: get ', path);

        try {
            const data = await this.db.getData(path);
            return Promise.resolve(Number(data));

        } catch (e) {
            console.log('DB get error ', e);
            return Promise.resolve(undefined);
        }
    }

    public async setInternalChatId(peer_id: number, group_id: number, chat_id: number): Promise<boolean> {
        const path = '/chats/' + String(peer_id) + String(group_id);

        const check_id = await this.getInternalChatId(peer_id, group_id);

        if (check_id) {
            console.log('DB set ', path, 'exists');
            return Promise.resolve(false);
        }


        try {
            await this.db.push(path, chat_id);
            console.log('DB set ', path, ' success');
            return Promise.resolve(true);
        } catch (e) {
            console.log('DB set error ', e);
            return Promise.resolve(false);
        }
    }

}