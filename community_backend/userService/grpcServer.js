const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const userService = require('./Services/grpcUserService.js')

const PROTO_PATH = path.join(__dirname, 'Proto', 'user.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDef);
const userPackage = grpcObject.user;

const server = new grpc.Server();
server.addService(userPackage.UserService.service,{
    GetUserById: userService.getUserById
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(),()=>{
    console.log("gRPC Server running on port 50051");
    server.start();
});