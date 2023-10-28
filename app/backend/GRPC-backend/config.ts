import grpc from "@grpc/grpc-js";

export default  interface grpcOptions {
    address: string;
    credentials: grpc.ChannelCredentials;
    options?: any;
}
export const grpc_config : grpcOptions = {
    address: '127.0.0.1:8082',
    credentials: grpc.credentials.createInsecure(),
}
