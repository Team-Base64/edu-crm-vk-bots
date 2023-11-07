#!/bin/bash



dir=backend/GRPC-backend/grpc

npx grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:. \
    --grpc_out=grpc_js:. \
    $dir/proto/model.proto



# generate d.ts codes
npx protoc \
  --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
  --ts_out=grpc_js:$dir/proto \
  -I $dir/proto \
  $dir/proto/*.proto

    