import VkSlaveBot from "./slave-vk-bot/slave-bot";
import { token } from "./tokens";

console.log("Hello vk slave bots");

const sb1 = new VkSlaveBot(token, 'EDUcrm#1');

sb1.start();