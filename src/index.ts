import GRPCBackend from "./backend/GRPC-backend/grpc-backend";
import BackendMock from "./backend/mock/backend";
import VkBotsManager from "./manager/manager";
import { PostrgesStore } from "./store/PostrgeSQL/postrgesql";

const grpc = require('@grpc/grpc-js');


// Main functions
(async () => {
    console.log("Hello vk slave bots");

    // Init database
    const db = new PostrgesStore();
    await db.start();

    // Init backend

    // Mock backend
    const backend = new BackendMock();
    await backend.start();

    // GRPC remote backend
    // const backend = new GRPCBackend({
        // address: '127.0.0.1:8082',
        // credentials: grpc.credentials.createInsecure(),
    // });

    const manager = new VkBotsManager(db, backend);
    await manager.init();
    await manager.startAll();
})();

