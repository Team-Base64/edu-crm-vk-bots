import backend from "../mock/backend";
import { VkMasterBot } from "./master-vk-bot/master-bot";
import VkSlaveBot from "./slave-vk-bot/slave-bot";
import { JsonStorage } from "./store/JsonDatabase/JsonDB";
import { PostrgesStore } from "./store/PostrgeSQL/postrgesql";
import { token, token2, token3 } from "./tokens";


(async () => { 
    console.log("Hello vk slave bots");

    const db = new PostrgesStore();
    await db.start();

    await backend.start();
    
    const mb1 = new VkMasterBot(token2, 'EDUcrm#2', db);
    await mb1.start();

    const sb1 = new VkSlaveBot(token, 'EDUcrm#1', db);
    await sb1.start();

    const sb2 = new VkSlaveBot(token3, 'EDUcrm#3', db);
    await sb2.start();
})();

