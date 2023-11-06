// package: chat
// file: model.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as model_pb from "./model_pb";

interface IBotServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    startChatVK: IBotServiceService_IStartChatVK;
    validateToken: IBotServiceService_IValidateToken;
    createChat: IBotServiceService_ICreateChat;
    getHomeworks: IBotServiceService_IGetHomeworks;
    uploadFile: IBotServiceService_IUploadFile;
    createStudent: IBotServiceService_ICreateStudent;
    sendSolution: IBotServiceService_ISendSolution;
}

interface IBotServiceService_IStartChatVK extends grpc.MethodDefinition<model_pb.Message, model_pb.Message> {
    path: "/chat.BotService/StartChatVK";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<model_pb.Message>;
    requestDeserialize: grpc.deserialize<model_pb.Message>;
    responseSerialize: grpc.serialize<model_pb.Message>;
    responseDeserialize: grpc.deserialize<model_pb.Message>;
}
interface IBotServiceService_IValidateToken extends grpc.MethodDefinition<model_pb.ValidateTokenRequest, model_pb.ValidateTokenResponse> {
    path: "/chat.BotService/ValidateToken";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<model_pb.ValidateTokenRequest>;
    requestDeserialize: grpc.deserialize<model_pb.ValidateTokenRequest>;
    responseSerialize: grpc.serialize<model_pb.ValidateTokenResponse>;
    responseDeserialize: grpc.deserialize<model_pb.ValidateTokenResponse>;
}
interface IBotServiceService_ICreateChat extends grpc.MethodDefinition<model_pb.CreateChatRequest, model_pb.CreateChatResponse> {
    path: "/chat.BotService/CreateChat";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<model_pb.CreateChatRequest>;
    requestDeserialize: grpc.deserialize<model_pb.CreateChatRequest>;
    responseSerialize: grpc.serialize<model_pb.CreateChatResponse>;
    responseDeserialize: grpc.deserialize<model_pb.CreateChatResponse>;
}
interface IBotServiceService_IGetHomeworks extends grpc.MethodDefinition<model_pb.GetHomeworksRequest, model_pb.GetHomeworksResponse> {
    path: "/chat.BotService/GetHomeworks";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<model_pb.GetHomeworksRequest>;
    requestDeserialize: grpc.deserialize<model_pb.GetHomeworksRequest>;
    responseSerialize: grpc.serialize<model_pb.GetHomeworksResponse>;
    responseDeserialize: grpc.deserialize<model_pb.GetHomeworksResponse>;
}
interface IBotServiceService_IUploadFile extends grpc.MethodDefinition<model_pb.FileUploadRequest, model_pb.FileUploadResponse> {
    path: "/chat.BotService/UploadFile";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<model_pb.FileUploadRequest>;
    requestDeserialize: grpc.deserialize<model_pb.FileUploadRequest>;
    responseSerialize: grpc.serialize<model_pb.FileUploadResponse>;
    responseDeserialize: grpc.deserialize<model_pb.FileUploadResponse>;
}
interface IBotServiceService_ICreateStudent extends grpc.MethodDefinition<model_pb.CreateStudentRequest, model_pb.CreateStudentRespose> {
    path: "/chat.BotService/CreateStudent";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<model_pb.CreateStudentRequest>;
    requestDeserialize: grpc.deserialize<model_pb.CreateStudentRequest>;
    responseSerialize: grpc.serialize<model_pb.CreateStudentRespose>;
    responseDeserialize: grpc.deserialize<model_pb.CreateStudentRespose>;
}
interface IBotServiceService_ISendSolution extends grpc.MethodDefinition<model_pb.SendSolutionRequest, model_pb.SendSolutionResponse> {
    path: "/chat.BotService/SendSolution";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<model_pb.SendSolutionRequest>;
    requestDeserialize: grpc.deserialize<model_pb.SendSolutionRequest>;
    responseSerialize: grpc.serialize<model_pb.SendSolutionResponse>;
    responseDeserialize: grpc.deserialize<model_pb.SendSolutionResponse>;
}

export const BotServiceService: IBotServiceService;

export interface IBotServiceServer extends grpc.UntypedServiceImplementation {
    startChatVK: grpc.handleBidiStreamingCall<model_pb.Message, model_pb.Message>;
    validateToken: grpc.handleUnaryCall<model_pb.ValidateTokenRequest, model_pb.ValidateTokenResponse>;
    createChat: grpc.handleUnaryCall<model_pb.CreateChatRequest, model_pb.CreateChatResponse>;
    getHomeworks: grpc.handleUnaryCall<model_pb.GetHomeworksRequest, model_pb.GetHomeworksResponse>;
    uploadFile: grpc.handleUnaryCall<model_pb.FileUploadRequest, model_pb.FileUploadResponse>;
    createStudent: grpc.handleUnaryCall<model_pb.CreateStudentRequest, model_pb.CreateStudentRespose>;
    sendSolution: grpc.handleUnaryCall<model_pb.SendSolutionRequest, model_pb.SendSolutionResponse>;
}

export interface IBotServiceClient {
    startChatVK(): grpc.ClientDuplexStream<model_pb.Message, model_pb.Message>;
    startChatVK(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<model_pb.Message, model_pb.Message>;
    startChatVK(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<model_pb.Message, model_pb.Message>;
    validateToken(request: model_pb.ValidateTokenRequest, callback: (error: grpc.ServiceError | null, response: model_pb.ValidateTokenResponse) => void): grpc.ClientUnaryCall;
    validateToken(request: model_pb.ValidateTokenRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: model_pb.ValidateTokenResponse) => void): grpc.ClientUnaryCall;
    validateToken(request: model_pb.ValidateTokenRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: model_pb.ValidateTokenResponse) => void): grpc.ClientUnaryCall;
    createChat(request: model_pb.CreateChatRequest, callback: (error: grpc.ServiceError | null, response: model_pb.CreateChatResponse) => void): grpc.ClientUnaryCall;
    createChat(request: model_pb.CreateChatRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: model_pb.CreateChatResponse) => void): grpc.ClientUnaryCall;
    createChat(request: model_pb.CreateChatRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: model_pb.CreateChatResponse) => void): grpc.ClientUnaryCall;
    getHomeworks(request: model_pb.GetHomeworksRequest, callback: (error: grpc.ServiceError | null, response: model_pb.GetHomeworksResponse) => void): grpc.ClientUnaryCall;
    getHomeworks(request: model_pb.GetHomeworksRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: model_pb.GetHomeworksResponse) => void): grpc.ClientUnaryCall;
    getHomeworks(request: model_pb.GetHomeworksRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: model_pb.GetHomeworksResponse) => void): grpc.ClientUnaryCall;
    uploadFile(request: model_pb.FileUploadRequest, callback: (error: grpc.ServiceError | null, response: model_pb.FileUploadResponse) => void): grpc.ClientUnaryCall;
    uploadFile(request: model_pb.FileUploadRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: model_pb.FileUploadResponse) => void): grpc.ClientUnaryCall;
    uploadFile(request: model_pb.FileUploadRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: model_pb.FileUploadResponse) => void): grpc.ClientUnaryCall;
    createStudent(request: model_pb.CreateStudentRequest, callback: (error: grpc.ServiceError | null, response: model_pb.CreateStudentRespose) => void): grpc.ClientUnaryCall;
    createStudent(request: model_pb.CreateStudentRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: model_pb.CreateStudentRespose) => void): grpc.ClientUnaryCall;
    createStudent(request: model_pb.CreateStudentRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: model_pb.CreateStudentRespose) => void): grpc.ClientUnaryCall;
    sendSolution(request: model_pb.SendSolutionRequest, callback: (error: grpc.ServiceError | null, response: model_pb.SendSolutionResponse) => void): grpc.ClientUnaryCall;
    sendSolution(request: model_pb.SendSolutionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: model_pb.SendSolutionResponse) => void): grpc.ClientUnaryCall;
    sendSolution(request: model_pb.SendSolutionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: model_pb.SendSolutionResponse) => void): grpc.ClientUnaryCall;
}

export class BotServiceClient extends grpc.Client implements IBotServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public startChatVK(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<model_pb.Message, model_pb.Message>;
    public startChatVK(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<model_pb.Message, model_pb.Message>;
    public validateToken(request: model_pb.ValidateTokenRequest, callback: (error: grpc.ServiceError | null, response: model_pb.ValidateTokenResponse) => void): grpc.ClientUnaryCall;
    public validateToken(request: model_pb.ValidateTokenRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: model_pb.ValidateTokenResponse) => void): grpc.ClientUnaryCall;
    public validateToken(request: model_pb.ValidateTokenRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: model_pb.ValidateTokenResponse) => void): grpc.ClientUnaryCall;
    public createChat(request: model_pb.CreateChatRequest, callback: (error: grpc.ServiceError | null, response: model_pb.CreateChatResponse) => void): grpc.ClientUnaryCall;
    public createChat(request: model_pb.CreateChatRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: model_pb.CreateChatResponse) => void): grpc.ClientUnaryCall;
    public createChat(request: model_pb.CreateChatRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: model_pb.CreateChatResponse) => void): grpc.ClientUnaryCall;
    public getHomeworks(request: model_pb.GetHomeworksRequest, callback: (error: grpc.ServiceError | null, response: model_pb.GetHomeworksResponse) => void): grpc.ClientUnaryCall;
    public getHomeworks(request: model_pb.GetHomeworksRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: model_pb.GetHomeworksResponse) => void): grpc.ClientUnaryCall;
    public getHomeworks(request: model_pb.GetHomeworksRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: model_pb.GetHomeworksResponse) => void): grpc.ClientUnaryCall;
    public uploadFile(request: model_pb.FileUploadRequest, callback: (error: grpc.ServiceError | null, response: model_pb.FileUploadResponse) => void): grpc.ClientUnaryCall;
    public uploadFile(request: model_pb.FileUploadRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: model_pb.FileUploadResponse) => void): grpc.ClientUnaryCall;
    public uploadFile(request: model_pb.FileUploadRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: model_pb.FileUploadResponse) => void): grpc.ClientUnaryCall;
    public createStudent(request: model_pb.CreateStudentRequest, callback: (error: grpc.ServiceError | null, response: model_pb.CreateStudentRespose) => void): grpc.ClientUnaryCall;
    public createStudent(request: model_pb.CreateStudentRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: model_pb.CreateStudentRespose) => void): grpc.ClientUnaryCall;
    public createStudent(request: model_pb.CreateStudentRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: model_pb.CreateStudentRespose) => void): grpc.ClientUnaryCall;
    public sendSolution(request: model_pb.SendSolutionRequest, callback: (error: grpc.ServiceError | null, response: model_pb.SendSolutionResponse) => void): grpc.ClientUnaryCall;
    public sendSolution(request: model_pb.SendSolutionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: model_pb.SendSolutionResponse) => void): grpc.ClientUnaryCall;
    public sendSolution(request: model_pb.SendSolutionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: model_pb.SendSolutionResponse) => void): grpc.ClientUnaryCall;
}
