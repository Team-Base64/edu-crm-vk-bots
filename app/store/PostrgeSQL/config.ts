import {ClientConfig} from "pg";

const postgres_config_localhost: ClientConfig = {
    user: "george",
    host: "localhost",
    password: "1234567890",
    port: 8500,
    database: 'vk_bots_db',
}

const postgres_config_docker: ClientConfig = {
    user: "george",
    host: "db",
    password: "1234567890",
    port: 5432,
    database: 'vk_bots_db',
}

let postgres_config : ClientConfig;

if(process.env.DOCKER){
    postgres_config = postgres_config_docker;
} else {
    postgres_config = postgres_config_localhost;
}


export default postgres_config;
