import VkSlaveBot from "./slave-vk-bot/slave-bot";
import { JsonStorage } from "./store/JsonDatabase/JsonDB";
import { token } from "./tokens";

console.log("Hello vk slave bots");

const db = new JsonStorage('tmp/db.json');

const sb1 = new VkSlaveBot(token, 'EDUcrm#1', db);

sb1.start();