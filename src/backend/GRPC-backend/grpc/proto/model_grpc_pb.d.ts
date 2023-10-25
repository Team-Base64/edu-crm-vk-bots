// package: chat
// file: model.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as model_pb from "./model_pb";

interface IBotChatService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    startChatVK: IBotChatService_IStartChatVK;
}

interface IBotChatService_IStartChatVK extends grpc.MethodDefinition<model_pb.Message, model_pb.Message> {
    path: "/chat.BotChat/StartChatVK";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<model_pb.Message>;
    requestDeserialize: grpc.deserialize<model_pb.Message>;
    responseSerialize: grpc.serialize<model_pb.Message>;
    responseDeserialize: grpc.deserialize<model_pb.Message>;
}

export const BotChatService: IBotChatService;

export interface IBotChatServer extends grpc.UntypedServiceImplementation {
    startChatVK: grpc.handleBidiStreamingCall<model_pb.Message, model_pb.Message>;
}

export interface IBotChatClient {
    startChatVK(): grpc.ClientDuplexStream<model_pb.Message, model_pb.Message>;
    startChatVK(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<model_pb.Message, model_pb.Message>;
    startChatVK(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<model_pb.Message, model_pb.Message>;
}

export class BotChatClient extends grpc.Client implements IBotChatClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public startChatVK(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<model_pb.Message, model_pb.Message>;
    public startChatVK(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<model_pb.Message, model_pb.Message>;
}
