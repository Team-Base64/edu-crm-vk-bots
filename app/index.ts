import GRPCBackend from "./backend/GRPC-backend/grpc-backend";
import BackendMock from "./backend/mock/backend";
import VkBotsManager from "./manager/manager";
import { PostrgesStore } from "./store/PostrgeSQL/postrgesql";
import {postgres_config_docker} from "./store/PostrgeSQL/config";
import {grpc_config} from "./backend/GRPC-backend/config";

const grpc = require('@grpc/grpc-js');


// Main function
(async () => {
    console.log("Hello vk slave bots");

    // Init database
    const db = new PostrgesStore(postgres_config_docker);
    await db.start();

    // Init backend

    // Mock backend
    const backend = new BackendMock(postgres_config_docker);
    await backend.start();

    // GRPC remote backend
    // const backend = new GRPCBackend(grpc_config);

    const manager = new VkBotsManager(db, backend);
    await manager.init();
    await manager.startAll();
})();

