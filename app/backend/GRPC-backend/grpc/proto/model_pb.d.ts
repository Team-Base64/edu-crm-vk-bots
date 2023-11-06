// package: chat
// file: model.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class Message extends jspb.Message { 
    getChatid(): number;
    setChatid(value: number): Message;
    getText(): string;
    setText(value: string): Message;
    clearAttachmenturlsList(): void;
    getAttachmenturlsList(): Array<string>;
    setAttachmenturlsList(value: Array<string>): Message;
    addAttachmenturls(value: string, index?: number): string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Message.AsObject;
    static toObject(includeInstance: boolean, msg: Message): Message.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Message, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Message;
    static deserializeBinaryFromReader(message: Message, reader: jspb.BinaryReader): Message;
}

export namespace Message {
    export type AsObject = {
        chatid: number,
        text: string,
        attachmenturlsList: Array<string>,
    }
}

export class HomeworkData extends jspb.Message { 
    getHomeworkid(): number;
    setHomeworkid(value: number): HomeworkData;
    getTitle(): string;
    setTitle(value: string): HomeworkData;
    getDescription(): string;
    setDescription(value: string): HomeworkData;
    clearAttachmenturlsList(): void;
    getAttachmenturlsList(): Array<string>;
    setAttachmenturlsList(value: Array<string>): HomeworkData;
    addAttachmenturls(value: string, index?: number): string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HomeworkData.AsObject;
    static toObject(includeInstance: boolean, msg: HomeworkData): HomeworkData.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HomeworkData, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HomeworkData;
    static deserializeBinaryFromReader(message: HomeworkData, reader: jspb.BinaryReader): HomeworkData;
}

export namespace HomeworkData {
    export type AsObject = {
        homeworkid: number,
        title: string,
        description: string,
        attachmenturlsList: Array<string>,
    }
}

export class SolutionData extends jspb.Message { 
    getText(): string;
    setText(value: string): SolutionData;
    clearAttachmenturlsList(): void;
    getAttachmenturlsList(): Array<string>;
    setAttachmenturlsList(value: Array<string>): SolutionData;
    addAttachmenturls(value: string, index?: number): string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SolutionData.AsObject;
    static toObject(includeInstance: boolean, msg: SolutionData): SolutionData.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SolutionData, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SolutionData;
    static deserializeBinaryFromReader(message: SolutionData, reader: jspb.BinaryReader): SolutionData;
}

export namespace SolutionData {
    export type AsObject = {
        text: string,
        attachmenturlsList: Array<string>,
    }
}

export class ValidateTokenRequest extends jspb.Message { 
    getToken(): string;
    setToken(value: string): ValidateTokenRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ValidateTokenRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ValidateTokenRequest): ValidateTokenRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ValidateTokenRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ValidateTokenRequest;
    static deserializeBinaryFromReader(message: ValidateTokenRequest, reader: jspb.BinaryReader): ValidateTokenRequest;
}

export namespace ValidateTokenRequest {
    export type AsObject = {
        token: string,
    }
}

export class CreateStudentRequest extends jspb.Message { 
    getName(): string;
    setName(value: string): CreateStudentRequest;
    getType(): string;
    setType(value: string): CreateStudentRequest;
    getAvatarurl(): string;
    setAvatarurl(value: string): CreateStudentRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateStudentRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CreateStudentRequest): CreateStudentRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateStudentRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateStudentRequest;
    static deserializeBinaryFromReader(message: CreateStudentRequest, reader: jspb.BinaryReader): CreateStudentRequest;
}

export namespace CreateStudentRequest {
    export type AsObject = {
        name: string,
        type: string,
        avatarurl: string,
    }
}

export class CreateChatRequest extends jspb.Message { 
    getStudentid(): number;
    setStudentid(value: number): CreateChatRequest;
    getClassid(): number;
    setClassid(value: number): CreateChatRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateChatRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CreateChatRequest): CreateChatRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateChatRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateChatRequest;
    static deserializeBinaryFromReader(message: CreateChatRequest, reader: jspb.BinaryReader): CreateChatRequest;
}

export namespace CreateChatRequest {
    export type AsObject = {
        studentid: number,
        classid: number,
    }
}

export class GetHomeworksRequest extends jspb.Message { 
    getClassid(): number;
    setClassid(value: number): GetHomeworksRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetHomeworksRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetHomeworksRequest): GetHomeworksRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetHomeworksRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetHomeworksRequest;
    static deserializeBinaryFromReader(message: GetHomeworksRequest, reader: jspb.BinaryReader): GetHomeworksRequest;
}

export namespace GetHomeworksRequest {
    export type AsObject = {
        classid: number,
    }
}

export class SendSolutionRequest extends jspb.Message { 
    getHomeworkid(): number;
    setHomeworkid(value: number): SendSolutionRequest;

    hasSolution(): boolean;
    clearSolution(): void;
    getSolution(): SolutionData | undefined;
    setSolution(value?: SolutionData): SendSolutionRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SendSolutionRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SendSolutionRequest): SendSolutionRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SendSolutionRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SendSolutionRequest;
    static deserializeBinaryFromReader(message: SendSolutionRequest, reader: jspb.BinaryReader): SendSolutionRequest;
}

export namespace SendSolutionRequest {
    export type AsObject = {
        homeworkid: number,
        solution?: SolutionData.AsObject,
    }
}

export class FileUploadRequest extends jspb.Message { 
    getMimetype(): string;
    setMimetype(value: string): FileUploadRequest;
    getFileurl(): string;
    setFileurl(value: string): FileUploadRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FileUploadRequest.AsObject;
    static toObject(includeInstance: boolean, msg: FileUploadRequest): FileUploadRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: FileUploadRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FileUploadRequest;
    static deserializeBinaryFromReader(message: FileUploadRequest, reader: jspb.BinaryReader): FileUploadRequest;
}

export namespace FileUploadRequest {
    export type AsObject = {
        mimetype: string,
        fileurl: string,
    }
}

export class ValidateTokenResponse extends jspb.Message { 
    getClassid(): number;
    setClassid(value: number): ValidateTokenResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ValidateTokenResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ValidateTokenResponse): ValidateTokenResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ValidateTokenResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ValidateTokenResponse;
    static deserializeBinaryFromReader(message: ValidateTokenResponse, reader: jspb.BinaryReader): ValidateTokenResponse;
}

export namespace ValidateTokenResponse {
    export type AsObject = {
        classid: number,
    }
}

export class CreateStudentRespose extends jspb.Message { 
    getStudentid(): number;
    setStudentid(value: number): CreateStudentRespose;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateStudentRespose.AsObject;
    static toObject(includeInstance: boolean, msg: CreateStudentRespose): CreateStudentRespose.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateStudentRespose, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateStudentRespose;
    static deserializeBinaryFromReader(message: CreateStudentRespose, reader: jspb.BinaryReader): CreateStudentRespose;
}

export namespace CreateStudentRespose {
    export type AsObject = {
        studentid: number,
    }
}

export class CreateChatResponse extends jspb.Message { 
    getInternalchatid(): number;
    setInternalchatid(value: number): CreateChatResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateChatResponse.AsObject;
    static toObject(includeInstance: boolean, msg: CreateChatResponse): CreateChatResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateChatResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateChatResponse;
    static deserializeBinaryFromReader(message: CreateChatResponse, reader: jspb.BinaryReader): CreateChatResponse;
}

export namespace CreateChatResponse {
    export type AsObject = {
        internalchatid: number,
    }
}

export class GetHomeworksResponse extends jspb.Message { 
    clearHomeworksList(): void;
    getHomeworksList(): Array<HomeworkData>;
    setHomeworksList(value: Array<HomeworkData>): GetHomeworksResponse;
    addHomeworks(value?: HomeworkData, index?: number): HomeworkData;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetHomeworksResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetHomeworksResponse): GetHomeworksResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetHomeworksResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetHomeworksResponse;
    static deserializeBinaryFromReader(message: GetHomeworksResponse, reader: jspb.BinaryReader): GetHomeworksResponse;
}

export namespace GetHomeworksResponse {
    export type AsObject = {
        homeworksList: Array<HomeworkData.AsObject>,
    }
}

export class SendSolutionResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SendSolutionResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SendSolutionResponse): SendSolutionResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SendSolutionResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SendSolutionResponse;
    static deserializeBinaryFromReader(message: SendSolutionResponse, reader: jspb.BinaryReader): SendSolutionResponse;
}

export namespace SendSolutionResponse {
    export type AsObject = {
    }
}

export class FileUploadResponse extends jspb.Message { 
    getInternalfileurl(): string;
    setInternalfileurl(value: string): FileUploadResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FileUploadResponse.AsObject;
    static toObject(includeInstance: boolean, msg: FileUploadResponse): FileUploadResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: FileUploadResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FileUploadResponse;
    static deserializeBinaryFromReader(message: FileUploadResponse, reader: jspb.BinaryReader): FileUploadResponse;
}

export namespace FileUploadResponse {
    export type AsObject = {
        internalfileurl: string,
    }
}
