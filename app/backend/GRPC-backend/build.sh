# generate js codes via grpc-tools
npx grpc_tools_node_protoc \
--js_out=import_style=commonjs,binary:. \
--grpc_out=grpc_js:. \
--plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
-I ./ \
./*.proto

# generate d.ts codes
npx protoc \
--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
--ts_out=grpc_js:. \
-I ./ \
./*.proto