import { credentials } from '@grpc/grpc-js';
import { ChatClient } from './model_grpc_pb';

const client = new ChatClient(
    [process.env.GRPC_HOST, process.env.GRPC_PORT].join(':'),
    credentials.createInsecure(),
);

export default client;
