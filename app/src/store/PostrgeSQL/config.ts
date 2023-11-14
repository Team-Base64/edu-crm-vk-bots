import { ClientConfig } from "pg";
import 'dotenv/config';

const postgres_config: ClientConfig = {
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB,
}

export default postgres_config;
