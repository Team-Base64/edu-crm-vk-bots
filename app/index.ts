import PostrgesStore from "./src/store/PostrgeSQL/postrgesql";

import GRPCBackend from "./src/backend/GRPC-backend/grpc-backend";
import BackendMock from "./src/backend/mock/backend";

import VkBotsManager from "./src/manager/manager";

import logger from "./src/helpers/logger";

// Main function
(async () => {
    console.log('Running app...');
    logger.info('Starting app...');

    // Init database
    const db = new PostrgesStore();
    await db.start();

    // Init backend
    const backend = process.env.MOCK === "true" ?
         new BackendMock() :
         new GRPCBackend();
    await backend.start();

    // Init manager
    const manager = new VkBotsManager(db, backend);
    await manager.init();
    await manager.startAll();
})();
