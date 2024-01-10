// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var model_pb = require('./model_pb.js');

function serialize_chat_CreateChatRequest(arg) {
  if (!(arg instanceof model_pb.CreateChatRequest)) {
    throw new Error('Expected argument of type chat.CreateChatRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_CreateChatRequest(buffer_arg) {
  return model_pb.CreateChatRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_CreateChatResponse(arg) {
  if (!(arg instanceof model_pb.CreateChatResponse)) {
    throw new Error('Expected argument of type chat.CreateChatResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_CreateChatResponse(buffer_arg) {
  return model_pb.CreateChatResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_CreateStudentRequest(arg) {
  if (!(arg instanceof model_pb.CreateStudentRequest)) {
    throw new Error('Expected argument of type chat.CreateStudentRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_CreateStudentRequest(buffer_arg) {
  return model_pb.CreateStudentRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_CreateStudentResponse(arg) {
  if (!(arg instanceof model_pb.CreateStudentResponse)) {
    throw new Error('Expected argument of type chat.CreateStudentResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_CreateStudentResponse(buffer_arg) {
  return model_pb.CreateStudentResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_FileUploadRequest(arg) {
  if (!(arg instanceof model_pb.FileUploadRequest)) {
    throw new Error('Expected argument of type chat.FileUploadRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_FileUploadRequest(buffer_arg) {
  return model_pb.FileUploadRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_FileUploadResponse(arg) {
  if (!(arg instanceof model_pb.FileUploadResponse)) {
    throw new Error('Expected argument of type chat.FileUploadResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_FileUploadResponse(buffer_arg) {
  return model_pb.FileUploadResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_GetEventsRequest(arg) {
  if (!(arg instanceof model_pb.GetEventsRequest)) {
    throw new Error('Expected argument of type chat.GetEventsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_GetEventsRequest(buffer_arg) {
  return model_pb.GetEventsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_GetEventsResponse(arg) {
  if (!(arg instanceof model_pb.GetEventsResponse)) {
    throw new Error('Expected argument of type chat.GetEventsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_GetEventsResponse(buffer_arg) {
  return model_pb.GetEventsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_GetHomeworksRequest(arg) {
  if (!(arg instanceof model_pb.GetHomeworksRequest)) {
    throw new Error('Expected argument of type chat.GetHomeworksRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_GetHomeworksRequest(buffer_arg) {
  return model_pb.GetHomeworksRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_GetHomeworksResponse(arg) {
  if (!(arg instanceof model_pb.GetHomeworksResponse)) {
    throw new Error('Expected argument of type chat.GetHomeworksResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_GetHomeworksResponse(buffer_arg) {
  return model_pb.GetHomeworksResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_Message(arg) {
  if (!(arg instanceof model_pb.Message)) {
    throw new Error('Expected argument of type chat.Message');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_Message(buffer_arg) {
  return model_pb.Message.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_Nothing(arg) {
  if (!(arg instanceof model_pb.Nothing)) {
    throw new Error('Expected argument of type chat.Nothing');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_Nothing(buffer_arg) {
  return model_pb.Nothing.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_SendSolutionRequest(arg) {
  if (!(arg instanceof model_pb.SendSolutionRequest)) {
    throw new Error('Expected argument of type chat.SendSolutionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_SendSolutionRequest(buffer_arg) {
  return model_pb.SendSolutionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_ValidateTokenRequest(arg) {
  if (!(arg instanceof model_pb.ValidateTokenRequest)) {
    throw new Error('Expected argument of type chat.ValidateTokenRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_ValidateTokenRequest(buffer_arg) {
  return model_pb.ValidateTokenRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_chat_ValidateTokenResponse(arg) {
  if (!(arg instanceof model_pb.ValidateTokenResponse)) {
    throw new Error('Expected argument of type chat.ValidateTokenResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_ValidateTokenResponse(buffer_arg) {
  return model_pb.ValidateTokenResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var ChatService = exports.ChatService = {
  startChatVK: {
    path: '/chat.Chat/StartChatVK',
    requestStream: true,
    responseStream: true,
    requestType: model_pb.Message,
    responseType: model_pb.Message,
    requestSerialize: serialize_chat_Message,
    requestDeserialize: deserialize_chat_Message,
    responseSerialize: serialize_chat_Message,
    responseDeserialize: deserialize_chat_Message,
  },
  validateToken: {
    path: '/chat.Chat/ValidateToken',
    requestStream: false,
    responseStream: false,
    requestType: model_pb.ValidateTokenRequest,
    responseType: model_pb.ValidateTokenResponse,
    requestSerialize: serialize_chat_ValidateTokenRequest,
    requestDeserialize: deserialize_chat_ValidateTokenRequest,
    responseSerialize: serialize_chat_ValidateTokenResponse,
    responseDeserialize: deserialize_chat_ValidateTokenResponse,
  },
  createChat: {
    path: '/chat.Chat/CreateChat',
    requestStream: false,
    responseStream: false,
    requestType: model_pb.CreateChatRequest,
    responseType: model_pb.CreateChatResponse,
    requestSerialize: serialize_chat_CreateChatRequest,
    requestDeserialize: deserialize_chat_CreateChatRequest,
    responseSerialize: serialize_chat_CreateChatResponse,
    responseDeserialize: deserialize_chat_CreateChatResponse,
  },
  getHomeworks: {
    path: '/chat.Chat/GetHomeworks',
    requestStream: false,
    responseStream: false,
    requestType: model_pb.GetHomeworksRequest,
    responseType: model_pb.GetHomeworksResponse,
    requestSerialize: serialize_chat_GetHomeworksRequest,
    requestDeserialize: deserialize_chat_GetHomeworksRequest,
    responseSerialize: serialize_chat_GetHomeworksResponse,
    responseDeserialize: deserialize_chat_GetHomeworksResponse,
  },
  uploadFile: {
    path: '/chat.Chat/UploadFile',
    requestStream: false,
    responseStream: false,
    requestType: model_pb.FileUploadRequest,
    responseType: model_pb.FileUploadResponse,
    requestSerialize: serialize_chat_FileUploadRequest,
    requestDeserialize: deserialize_chat_FileUploadRequest,
    responseSerialize: serialize_chat_FileUploadResponse,
    responseDeserialize: deserialize_chat_FileUploadResponse,
  },
  createStudent: {
    path: '/chat.Chat/CreateStudent',
    requestStream: false,
    responseStream: false,
    requestType: model_pb.CreateStudentRequest,
    responseType: model_pb.CreateStudentResponse,
    requestSerialize: serialize_chat_CreateStudentRequest,
    requestDeserialize: deserialize_chat_CreateStudentRequest,
    responseSerialize: serialize_chat_CreateStudentResponse,
    responseDeserialize: deserialize_chat_CreateStudentResponse,
  },
  sendSolution: {
    path: '/chat.Chat/SendSolution',
    requestStream: false,
    responseStream: false,
    requestType: model_pb.SendSolutionRequest,
    responseType: model_pb.Nothing,
    requestSerialize: serialize_chat_SendSolutionRequest,
    requestDeserialize: deserialize_chat_SendSolutionRequest,
    responseSerialize: serialize_chat_Nothing,
    responseDeserialize: deserialize_chat_Nothing,
  },
  getEvents: {
    path: '/chat.Chat/GetEvents',
    requestStream: false,
    responseStream: false,
    requestType: model_pb.GetEventsRequest,
    responseType: model_pb.GetEventsResponse,
    requestSerialize: serialize_chat_GetEventsRequest,
    requestDeserialize: deserialize_chat_GetEventsRequest,
    responseSerialize: serialize_chat_GetEventsResponse,
    responseDeserialize: deserialize_chat_GetEventsResponse,
  },
};

exports.ChatClient = grpc.makeGenericClientConstructor(ChatService);
