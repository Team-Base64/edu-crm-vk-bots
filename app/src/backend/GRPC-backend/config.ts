const grpc = require('@grpc/grpc-js');
const services = require('./model_grpc_pb');

const client = new services.BotChatClient(
    [process.env.GRPC_HOST, process.env.GRPC_PORT].join(':'),
    grpc.credentials.createInsecure(),
);

export default client;
