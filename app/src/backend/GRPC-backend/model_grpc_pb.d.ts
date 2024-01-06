// package: chat
// file: model.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as model_pb from "./model_pb";

interface IBotChatService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    startChatVK: IBotChatService_IStartChatVK;
    validateToken: IBotChatService_IValidateToken;
    createChat: IBotChatService_ICreateChat;
    getHomeworks: IBotChatService_IGetHomeworks;
    uploadFile: IBotChatService_IUploadFile;
    createStudent: IBotChatService_ICreateStudent;
    sendSolution: IBotChatService_ISendSolution;
    getEvents: IBotChatService_IGetEvents;
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
interface IBotChatService_IValidateToken extends grpc.MethodDefinition<model_pb.ValidateTokenRequest, model_pb.ValidateTokenResponse> {
    path: "/chat.BotChat/ValidateToken";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<model_pb.ValidateTokenRequest>;
    requestDeserialize: grpc.deserialize<model_pb.ValidateTokenRequest>;
    responseSerialize: grpc.serialize<model_pb.ValidateTokenResponse>;
    responseDeserialize: grpc.deserialize<model_pb.ValidateTokenResponse>;
}
interface IBotChatService_ICreateChat extends grpc.MethodDefinition<model_pb.CreateChatRequest, model_pb.CreateChatResponse> {
    path: "/chat.BotChat/CreateChat";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<model_pb.CreateChatRequest>;
    requestDeserialize: grpc.deserialize<model_pb.CreateChatRequest>;
    responseSerialize: grpc.serialize<model_pb.CreateChatResponse>;
    responseDeserialize: grpc.deserialize<model_pb.CreateChatResponse>;
}
interface IBotChatService_IGetHomeworks extends grpc.MethodDefinition<model_pb.GetHomeworksRequest, model_pb.GetHomeworksResponse> {
    path: "/chat.BotChat/GetHomeworks";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<model_pb.GetHomeworksRequest>;
    requestDeserialize: grpc.deserialize<model_pb.GetHomeworksRequest>;
    responseSerialize: grpc.serialize<model_pb.GetHomeworksResponse>;
    responseDeserialize: grpc.deserialize<model_pb.GetHomeworksResponse>;
}
interface IBotChatService_IUploadFile extends grpc.MethodDefinition<model_pb.FileUploadRequest, model_pb.FileUploadResponse> {
    path: "/chat.BotChat/UploadFile";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<model_pb.FileUploadRequest>;
    requestDeserialize: grpc.deserialize<model_pb.FileUploadRequest>;
    responseSerialize: grpc.serialize<model_pb.FileUploadResponse>;
    responseDeserialize: grpc.deserialize<model_pb.FileUploadResponse>;
}
interface IBotChatService_ICreateStudent extends grpc.MethodDefinition<model_pb.CreateStudentRequest, model_pb.CreateStudentResponse> {
    path: "/chat.BotChat/CreateStudent";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<model_pb.CreateStudentRequest>;
    requestDeserialize: grpc.deserialize<model_pb.CreateStudentRequest>;
    responseSerialize: grpc.serialize<model_pb.CreateStudentResponse>;
    responseDeserialize: grpc.deserialize<model_pb.CreateStudentResponse>;
}
interface IBotChatService_ISendSolution extends grpc.MethodDefinition<model_pb.SendSolutionRequest, model_pb.Nothing> {
    path: "/chat.BotChat/SendSolution";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<model_pb.SendSolutionRequest>;
    requestDeserialize: grpc.deserialize<model_pb.SendSolutionRequest>;
    responseSerialize: grpc.serialize<model_pb.Nothing>;
    responseDeserialize: grpc.deserialize<model_pb.Nothing>;
}
interface IBotChatService_IGetEvents extends grpc.MethodDefinition<model_pb.GetEventsRequest, model_pb.GetEventsResponse> {
    path: "/chat.BotChat/GetEvents";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<model_pb.GetEventsRequest>;
    requestDeserialize: grpc.deserialize<model_pb.GetEventsRequest>;
    responseSerialize: grpc.serialize<model_pb.GetEventsResponse>;
    responseDeserialize: grpc.deserialize<model_pb.GetEventsResponse>;
}

export const BotChatService: IBotChatService;

export interface IBotChatServer extends grpc.UntypedServiceImplementation {
    startChatVK: grpc.handleBidiStreamingCall<model_pb.Message, model_pb.Message>;
    validateToken: grpc.handleUnaryCall<model_pb.ValidateTokenRequest, model_pb.ValidateTokenResponse>;
    createChat: grpc.handleUnaryCall<model_pb.CreateChatRequest, model_pb.CreateChatResponse>;
    getHomeworks: grpc.handleUnaryCall<model_pb.GetHomeworksRequest, model_pb.GetHomeworksResponse>;
    uploadFile: grpc.handleUnaryCall<model_pb.FileUploadRequest, model_pb.FileUploadResponse>;
    createStudent: grpc.handleUnaryCall<model_pb.CreateStudentRequest, model_pb.CreateStudentResponse>;
    sendSolution: grpc.handleUnaryCall<model_pb.SendSolutionRequest, model_pb.Nothing>;
    getEvents: grpc.handleUnaryCall<model_pb.GetEventsRequest, model_pb.GetEventsResponse>;
}

export interface IBotChatClient {
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
    createStudent(request: model_pb.CreateStudentRequest, callback: (error: grpc.ServiceError | null, response: model_pb.CreateStudentResponse) => void): grpc.ClientUnaryCall;
    createStudent(request: model_pb.CreateStudentRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: model_pb.CreateStudentResponse) => void): grpc.ClientUnaryCall;
    createStudent(request: model_pb.CreateStudentRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: model_pb.CreateStudentResponse) => void): grpc.ClientUnaryCall;
    sendSolution(request: model_pb.SendSolutionRequest, callback: (error: grpc.ServiceError | null, response: model_pb.Nothing) => void): grpc.ClientUnaryCall;
    sendSolution(request: model_pb.SendSolutionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: model_pb.Nothing) => void): grpc.ClientUnaryCall;
    sendSolution(request: model_pb.SendSolutionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: model_pb.Nothing) => void): grpc.ClientUnaryCall;
    getEvents(request: model_pb.GetEventsRequest, callback: (error: grpc.ServiceError | null, response: model_pb.GetEventsResponse) => void): grpc.ClientUnaryCall;
    getEvents(request: model_pb.GetEventsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: model_pb.GetEventsResponse) => void): grpc.ClientUnaryCall;
    getEvents(request: model_pb.GetEventsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: model_pb.GetEventsResponse) => void): grpc.ClientUnaryCall;
}

export class BotChatClient extends grpc.Client implements IBotChatClient {
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
    public createStudent(request: model_pb.CreateStudentRequest, callback: (error: grpc.ServiceError | null, response: model_pb.CreateStudentResponse) => void): grpc.ClientUnaryCall;
    public createStudent(request: model_pb.CreateStudentRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: model_pb.CreateStudentResponse) => void): grpc.ClientUnaryCall;
    public createStudent(request: model_pb.CreateStudentRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: model_pb.CreateStudentResponse) => void): grpc.ClientUnaryCall;
    public sendSolution(request: model_pb.SendSolutionRequest, callback: (error: grpc.ServiceError | null, response: model_pb.Nothing) => void): grpc.ClientUnaryCall;
    public sendSolution(request: model_pb.SendSolutionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: model_pb.Nothing) => void): grpc.ClientUnaryCall;
    public sendSolution(request: model_pb.SendSolutionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: model_pb.Nothing) => void): grpc.ClientUnaryCall;
    public getEvents(request: model_pb.GetEventsRequest, callback: (error: grpc.ServiceError | null, response: model_pb.GetEventsResponse) => void): grpc.ClientUnaryCall;
    public getEvents(request: model_pb.GetEventsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: model_pb.GetEventsResponse) => void): grpc.ClientUnaryCall;
    public getEvents(request: model_pb.GetEventsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: model_pb.GetEventsResponse) => void): grpc.ClientUnaryCall;
}
