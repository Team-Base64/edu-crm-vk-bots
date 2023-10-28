// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// grpc_tools_node_protoc --js_out=import_style=commonjs,binary:.
// --grpc_out=grpc_js:. proto/model.proto
'use strict';
var grpc = require('@grpc/grpc-js');
var src_backend_GRPC$backend_grpc_proto_model_pb = require('./model_pb.js');

function serialize_chat_Message(arg) {
  if (!(arg instanceof src_backend_GRPC$backend_grpc_proto_model_pb.Message)) {
    throw new Error('Expected argument of type chat.Message');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_chat_Message(buffer_arg) {
  return src_backend_GRPC$backend_grpc_proto_model_pb.Message.deserializeBinary(new Uint8Array(buffer_arg));
}


var BotChatService = exports.BotChatService = {
  startChatVK: {
    path: '/chat.BotChat/StartChatVK',
    requestStream: true,
    responseStream: true,
    requestType: src_backend_GRPC$backend_grpc_proto_model_pb.Message,
    responseType: src_backend_GRPC$backend_grpc_proto_model_pb.Message,
    requestSerialize: serialize_chat_Message,
    requestDeserialize: deserialize_chat_Message,
    responseSerialize: serialize_chat_Message,
    responseDeserialize: deserialize_chat_Message,
  },
};

exports.BotChatClient = grpc.makeGenericClientConstructor(BotChatService);
