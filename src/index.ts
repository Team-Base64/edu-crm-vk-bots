import { VkMasterBot } from "./master-vk-bot/master-bot";
import VkSlaveBot from "./slave-vk-bot/slave-bot";
import { JsonStorage } from "./store/JsonDatabase/JsonDB";
import { token, token2 } from "./tokens";

console.log("Hello vk slave bots");

// const db = new JsonStorage('tmp/db.json');

// const sb1 = new VkSlaveBot(token, 'EDUcrm#1', db);
const mb1 = new VkMasterBot(token2, 'EDUcrm#2');

mb1.start();
// sb1.start();