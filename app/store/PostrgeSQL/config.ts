import {ClientConfig} from "pg";

export const postgres_config_localhost: ClientConfig = {
    user: "george",
    host: "localhost",
    password: "1234567890",
    port: 8000,
    database: 'vk_bots_db',
}

export const postgres_config_docker: ClientConfig = {
    user: "george",
    host: "db",
    password: "1234567890",
    port: 5432,
    database: 'vk_bots_db',
}
