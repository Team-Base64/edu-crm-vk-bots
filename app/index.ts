import GRPCBackend from "./backend/GRPC-backend/grpc-backend";
import BackendMock from "./backend/mock/backend";
import VkBotsManager from "./manager/manager";
import { PostrgesStore } from "./store/PostrgeSQL/postrgesql";
import {grpc_config} from "./backend/GRPC-backend/config";
import logger from "./helpers/logger";
import postgres_config from "./store/PostrgeSQL/config";

// Main function
(async () => {
    console.log('Running app...');
    logger.info('Starting app...');

    // Init database
    const db = new PostrgesStore(postgres_config);
    await db.start();

    // Init backend

    // // Mock backend
    // const backend = new BackendMock(postgres_config);
    // await backend.start();

    // GRPC remote backend
    const backend = new GRPCBackend(grpc_config);

    const manager = new VkBotsManager(db, backend);
    await manager.init();
    await manager.startAll();
})();

