//import grpc from '@grpc/grpc-js';
// const grpc = require('@grpc/grpc-js');

// // export default  interface grpcOptions {
// //     address: string;
// //     credentials: grpc.ChannelCredentials;
// //     options?: any;
// // }

// export const grpc_config : grpcOptions = {
//     address: '127.0.0.1:8082',
//     credentials: grpc.credentials.createInsecure(),
//}

const grpc = require('@grpc/grpc-js');
const services = require('./model_grpc_pb');

const client = new services.BotChatClient(
    '127.0.0.1:8082',
    //`host.docker.internal:8082`,
    grpc.credentials.createInsecure(),
);

export default client;
