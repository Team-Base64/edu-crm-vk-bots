import { JsonDB, Config } from 'node-json-db';
import Store, { VkBotData, VkBotLink } from '../store';

export class JsonStorage implements Store {
    db: JsonDB;
    constructor(path: string) {
        this.db = new JsonDB(new Config(path, true, true, '/'));
    }
    public getSlaveBots(): Promise<VkBotData[] | undefined> {
        throw new Error('Method not implemented.');
    }
    public getMasterBots(): Promise<VkBotData[] | undefined> {
        throw new Error('Method not implemented.');
    }
    public getTargetViaInternalChatId(internal_chat_id: number): Promise<VkBotLink | undefined> {
        throw new Error('Method not implemented.');
    }
    public getFreeSlaveBots(peer_id: number): Promise<number[] | undefined> {
        throw new Error('Method not implemented.');
    }

    public async getInternalChatId(peer_id: number, group_id: number): Promise<number | undefined> {
        const path = '/chats/' + String(peer_id) + String(group_id);
        console.log('DB: get ', path);

        return await this.db.getObjectDefault<number | undefined>(path, undefined);

        // try {
        // const data = await this.db.getData(path);
        // return Number(data);
        // 
        // } catch (e) {
        // console.log('DB get error ', e);
        // return undefined;
        // }
    }

    public async setInternalChatId(peer_id: number, group_id: number, chat_id: number): Promise<boolean> {
        const path = '/chats/' + String(peer_id) + String(group_id);

        let check_id;

        // try {
            check_id = await this.getInternalChatId(peer_id, group_id);
        // } catch (e) {
            // console.log('DB set error ', e);
            // return false;
        // }

        if (check_id) {
            console.log('DB set ', path, 'exists');
            return false;
        }


        // try {
            await this.db.push(path, chat_id);
            console.log('DB set ', path, ' success');
            return true;
        // } catch (e) {
            // console.log('DB set error ', e);
            // return false;
        // }
    }

}