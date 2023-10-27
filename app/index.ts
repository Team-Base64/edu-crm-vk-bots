import GRPCBackend from "./backend/GRPC-backend/grpc-backend";
import BackendMock from "./backend/mock/backend";
import VkBotsManager from "./manager/manager";
import { PostrgesStore } from "./store/PostrgeSQL/postrgesql";
import {postgres_config_docker, postgres_config_localhost} from "./store/PostrgeSQL/config";
import {grpc_config} from "./backend/GRPC-backend/config";
import logger from "./helpers/logger";

const grpc = require('@grpc/grpc-js');

// Main function
(async () => {
    logger.info('Starting app...');

    // Init database
    const db = new PostrgesStore(postgres_config_localhost);
    await db.start();

    // Init backend

    // Mock backend
    const backend = new BackendMock(postgres_config_localhost);
    await backend.start();

    // GRPC remote backend
    // const backend = new GRPCBackend(grpc_config);

    const manager = new VkBotsManager(db, backend);
    await manager.init();
    await manager.startAll();
})();

