// package: chat
// file: model.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as model_pb from "./model_pb";

interface IChatService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    startChatVK: IChatService_IStartChatVK;
    validateToken: IChatService_IValidateToken;
    createChat: IChatService_ICreateChat;
    getHomeworks: IChatService_IGetHomeworks;
    uploadFile: IChatService_IUploadFile;
    createStudent: IChatService_ICreateStudent;
    sendSolution: IChatService_ISendSolution;
    getEvents: IChatService_IGetEvents;
}

interface IChatService_IStartChatVK extends grpc.MethodDefinition<model_pb.Message, model_pb.Message> {
    path: "/chat.Chat/StartChatVK";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<model_pb.Message>;
    requestDeserialize: grpc.deserialize<model_pb.Message>;
    responseSerialize: grpc.serialize<model_pb.Message>;
    responseDeserialize: grpc.deserialize<model_pb.Message>;
}
interface IChatService_IValidateToken extends grpc.MethodDefinition<model_pb.ValidateTokenRequest, model_pb.ValidateTokenResponse> {
    path: "/chat.Chat/ValidateToken";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<model_pb.ValidateTokenRequest>;
    requestDeserialize: grpc.deserialize<model_pb.ValidateTokenRequest>;
    responseSerialize: grpc.serialize<model_pb.ValidateTokenResponse>;
    responseDeserialize: grpc.deserialize<model_pb.ValidateTokenResponse>;
}
interface IChatService_ICreateChat extends grpc.MethodDefinition<model_pb.CreateChatRequest, model_pb.CreateChatResponse> {
    path: "/chat.Chat/CreateChat";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<model_pb.CreateChatRequest>;
    requestDeserialize: grpc.deserialize<model_pb.CreateChatRequest>;
    responseSerialize: grpc.serialize<model_pb.CreateChatResponse>;
    responseDeserialize: grpc.deserialize<model_pb.CreateChatResponse>;
}
interface IChatService_IGetHomeworks extends grpc.MethodDefinition<model_pb.GetHomeworksRequest, model_pb.GetHomeworksResponse> {
    path: "/chat.Chat/GetHomeworks";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<model_pb.GetHomeworksRequest>;
    requestDeserialize: grpc.deserialize<model_pb.GetHomeworksRequest>;
    responseSerialize: grpc.serialize<model_pb.GetHomeworksResponse>;
    responseDeserialize: grpc.deserialize<model_pb.GetHomeworksResponse>;
}
interface IChatService_IUploadFile extends grpc.MethodDefinition<model_pb.FileUploadRequest, model_pb.FileUploadResponse> {
    path: "/chat.Chat/UploadFile";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<model_pb.FileUploadRequest>;
    requestDeserialize: grpc.deserialize<model_pb.FileUploadRequest>;
    responseSerialize: grpc.serialize<model_pb.FileUploadResponse>;
    responseDeserialize: grpc.deserialize<model_pb.FileUploadResponse>;
}
interface IChatService_ICreateStudent extends grpc.MethodDefinition<model_pb.CreateStudentRequest, model_pb.CreateStudentResponse> {
    path: "/chat.Chat/CreateStudent";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<model_pb.CreateStudentRequest>;
    requestDeserialize: grpc.deserialize<model_pb.CreateStudentRequest>;
    responseSerialize: grpc.serialize<model_pb.CreateStudentResponse>;
    responseDeserialize: grpc.deserialize<model_pb.CreateStudentResponse>;
}
interface IChatService_ISendSolution extends grpc.MethodDefinition<model_pb.SendSolutionRequest, model_pb.Nothing> {
    path: "/chat.Chat/SendSolution";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<model_pb.SendSolutionRequest>;
    requestDeserialize: grpc.deserialize<model_pb.SendSolutionRequest>;
    responseSerialize: grpc.serialize<model_pb.Nothing>;
    responseDeserialize: grpc.deserialize<model_pb.Nothing>;
}
interface IChatService_IGetEvents extends grpc.MethodDefinition<model_pb.GetEventsRequest, model_pb.GetEventsResponse> {
    path: "/chat.Chat/GetEvents";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<model_pb.GetEventsRequest>;
    requestDeserialize: grpc.deserialize<model_pb.GetEventsRequest>;
    responseSerialize: grpc.serialize<model_pb.GetEventsResponse>;
    responseDeserialize: grpc.deserialize<model_pb.GetEventsResponse>;
}

export const ChatService: IChatService;

export interface IChatServer extends grpc.UntypedServiceImplementation {
    startChatVK: grpc.handleBidiStreamingCall<model_pb.Message, model_pb.Message>;
    validateToken: grpc.handleUnaryCall<model_pb.ValidateTokenRequest, model_pb.ValidateTokenResponse>;
    createChat: grpc.handleUnaryCall<model_pb.CreateChatRequest, model_pb.CreateChatResponse>;
    getHomeworks: grpc.handleUnaryCall<model_pb.GetHomeworksRequest, model_pb.GetHomeworksResponse>;
    uploadFile: grpc.handleUnaryCall<model_pb.FileUploadRequest, model_pb.FileUploadResponse>;
    createStudent: grpc.handleUnaryCall<model_pb.CreateStudentRequest, model_pb.CreateStudentResponse>;
    sendSolution: grpc.handleUnaryCall<model_pb.SendSolutionRequest, model_pb.Nothing>;
    getEvents: grpc.handleUnaryCall<model_pb.GetEventsRequest, model_pb.GetEventsResponse>;
}

export interface IChatClient {
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

export class ChatClient extends grpc.Client implements IChatClient {
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
