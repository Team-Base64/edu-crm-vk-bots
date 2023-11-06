// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var backend_GRPC$backend_grpc_proto_model_pb = require('../../../../backend/GRPC-backend/grpc/proto/model_pb.js');

function serialize_chat_CreateChatRequest(arg) {
  if (!(arg instanceof backend_GRPC$backend_grpc_proto_model_pb.CreateChatRequest)) {
    throw new Error('Expected argument of type chat.CreateChatRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_CreateChatRequest(buffer_arg) {
  return backend_GRPC$backend_grpc_proto_model_pb.CreateChatRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_CreateChatResponse(arg) {
  if (!(arg instanceof backend_GRPC$backend_grpc_proto_model_pb.CreateChatResponse)) {
    throw new Error('Expected argument of type chat.CreateChatResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_CreateChatResponse(buffer_arg) {
  return backend_GRPC$backend_grpc_proto_model_pb.CreateChatResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_CreateStudentRequest(arg) {
  if (!(arg instanceof backend_GRPC$backend_grpc_proto_model_pb.CreateStudentRequest)) {
    throw new Error('Expected argument of type chat.CreateStudentRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_CreateStudentRequest(buffer_arg) {
  return backend_GRPC$backend_grpc_proto_model_pb.CreateStudentRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_CreateStudentRespose(arg) {
  if (!(arg instanceof backend_GRPC$backend_grpc_proto_model_pb.CreateStudentRespose)) {
    throw new Error('Expected argument of type chat.CreateStudentRespose');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_CreateStudentRespose(buffer_arg) {
  return backend_GRPC$backend_grpc_proto_model_pb.CreateStudentRespose.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_FileUploadRequest(arg) {
  if (!(arg instanceof backend_GRPC$backend_grpc_proto_model_pb.FileUploadRequest)) {
    throw new Error('Expected argument of type chat.FileUploadRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_FileUploadRequest(buffer_arg) {
  return backend_GRPC$backend_grpc_proto_model_pb.FileUploadRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_FileUploadResponse(arg) {
  if (!(arg instanceof backend_GRPC$backend_grpc_proto_model_pb.FileUploadResponse)) {
    throw new Error('Expected argument of type chat.FileUploadResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_FileUploadResponse(buffer_arg) {
  return backend_GRPC$backend_grpc_proto_model_pb.FileUploadResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_GetHomeworksRequest(arg) {
  if (!(arg instanceof backend_GRPC$backend_grpc_proto_model_pb.GetHomeworksRequest)) {
    throw new Error('Expected argument of type chat.GetHomeworksRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_GetHomeworksRequest(buffer_arg) {
  return backend_GRPC$backend_grpc_proto_model_pb.GetHomeworksRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_GetHomeworksResponse(arg) {
  if (!(arg instanceof backend_GRPC$backend_grpc_proto_model_pb.GetHomeworksResponse)) {
    throw new Error('Expected argument of type chat.GetHomeworksResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_GetHomeworksResponse(buffer_arg) {
  return backend_GRPC$backend_grpc_proto_model_pb.GetHomeworksResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_Message(arg) {
  if (!(arg instanceof backend_GRPC$backend_grpc_proto_model_pb.Message)) {
    throw new Error('Expected argument of type chat.Message');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_Message(buffer_arg) {
  return backend_GRPC$backend_grpc_proto_model_pb.Message.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_SendSolutionRequest(arg) {
  if (!(arg instanceof backend_GRPC$backend_grpc_proto_model_pb.SendSolutionRequest)) {
    throw new Error('Expected argument of type chat.SendSolutionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_SendSolutionRequest(buffer_arg) {
  return backend_GRPC$backend_grpc_proto_model_pb.SendSolutionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_SendSolutionResponse(arg) {
  if (!(arg instanceof backend_GRPC$backend_grpc_proto_model_pb.SendSolutionResponse)) {
    throw new Error('Expected argument of type chat.SendSolutionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_SendSolutionResponse(buffer_arg) {
  return backend_GRPC$backend_grpc_proto_model_pb.SendSolutionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_ValidateTokenRequest(arg) {
  if (!(arg instanceof backend_GRPC$backend_grpc_proto_model_pb.ValidateTokenRequest)) {
    throw new Error('Expected argument of type chat.ValidateTokenRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_ValidateTokenRequest(buffer_arg) {
  return backend_GRPC$backend_grpc_proto_model_pb.ValidateTokenRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_ValidateTokenResponse(arg) {
  if (!(arg instanceof backend_GRPC$backend_grpc_proto_model_pb.ValidateTokenResponse)) {
    throw new Error('Expected argument of type chat.ValidateTokenResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_ValidateTokenResponse(buffer_arg) {
  return backend_GRPC$backend_grpc_proto_model_pb.ValidateTokenResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var BotServiceService = exports.BotServiceService = {
  startChatVK: {
    path: '/chat.BotService/StartChatVK',
    requestStream: true,
    responseStream: true,
    requestType: backend_GRPC$backend_grpc_proto_model_pb.Message,
    responseType: backend_GRPC$backend_grpc_proto_model_pb.Message,
    requestSerialize: serialize_chat_Message,
    requestDeserialize: deserialize_chat_Message,
    responseSerialize: serialize_chat_Message,
    responseDeserialize: deserialize_chat_Message,
  },
  validateToken: {
    path: '/chat.BotService/ValidateToken',
    requestStream: false,
    responseStream: false,
    requestType: backend_GRPC$backend_grpc_proto_model_pb.ValidateTokenRequest,
    responseType: backend_GRPC$backend_grpc_proto_model_pb.ValidateTokenResponse,
    requestSerialize: serialize_chat_ValidateTokenRequest,
    requestDeserialize: deserialize_chat_ValidateTokenRequest,
    responseSerialize: serialize_chat_ValidateTokenResponse,
    responseDeserialize: deserialize_chat_ValidateTokenResponse,
  },
  createChat: {
    path: '/chat.BotService/CreateChat',
    requestStream: false,
    responseStream: false,
    requestType: backend_GRPC$backend_grpc_proto_model_pb.CreateChatRequest,
    responseType: backend_GRPC$backend_grpc_proto_model_pb.CreateChatResponse,
    requestSerialize: serialize_chat_CreateChatRequest,
    requestDeserialize: deserialize_chat_CreateChatRequest,
    responseSerialize: serialize_chat_CreateChatResponse,
    responseDeserialize: deserialize_chat_CreateChatResponse,
  },
  getHomeworks: {
    path: '/chat.BotService/GetHomeworks',
    requestStream: false,
    responseStream: false,
    requestType: backend_GRPC$backend_grpc_proto_model_pb.GetHomeworksRequest,
    responseType: backend_GRPC$backend_grpc_proto_model_pb.GetHomeworksResponse,
    requestSerialize: serialize_chat_GetHomeworksRequest,
    requestDeserialize: deserialize_chat_GetHomeworksRequest,
    responseSerialize: serialize_chat_GetHomeworksResponse,
    responseDeserialize: deserialize_chat_GetHomeworksResponse,
  },
  uploadFile: {
    path: '/chat.BotService/UploadFile',
    requestStream: false,
    responseStream: false,
    requestType: backend_GRPC$backend_grpc_proto_model_pb.FileUploadRequest,
    responseType: backend_GRPC$backend_grpc_proto_model_pb.FileUploadResponse,
    requestSerialize: serialize_chat_FileUploadRequest,
    requestDeserialize: deserialize_chat_FileUploadRequest,
    responseSerialize: serialize_chat_FileUploadResponse,
    responseDeserialize: deserialize_chat_FileUploadResponse,
  },
  createStudent: {
    path: '/chat.BotService/CreateStudent',
    requestStream: false,
    responseStream: false,
    requestType: backend_GRPC$backend_grpc_proto_model_pb.CreateStudentRequest,
    responseType: backend_GRPC$backend_grpc_proto_model_pb.CreateStudentRespose,
    requestSerialize: serialize_chat_CreateStudentRequest,
    requestDeserialize: deserialize_chat_CreateStudentRequest,
    responseSerialize: serialize_chat_CreateStudentRespose,
    responseDeserialize: deserialize_chat_CreateStudentRespose,
  },
  sendSolution: {
    path: '/chat.BotService/SendSolution',
    requestStream: false,
    responseStream: false,
    requestType: backend_GRPC$backend_grpc_proto_model_pb.SendSolutionRequest,
    responseType: backend_GRPC$backend_grpc_proto_model_pb.SendSolutionResponse,
    requestSerialize: serialize_chat_SendSolutionRequest,
    requestDeserialize: deserialize_chat_SendSolutionRequest,
    responseSerialize: serialize_chat_SendSolutionResponse,
    responseDeserialize: deserialize_chat_SendSolutionResponse,
  },
};

exports.BotServiceClient = grpc.makeGenericClientConstructor(BotServiceService);
