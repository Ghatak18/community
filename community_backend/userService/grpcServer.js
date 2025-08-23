const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const userService = require('./Services/grpcUserService.js')
const paymentService = require('./Services/grpcAmountService.js')

const PROTO_PATH = path.join(__dirname, 'Proto', 'user.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDef);
const userPackage = grpcObject.user;

const server = new grpc.Server();
server.addService(userPackage.UserService.service,{
    GetUserById: userService.getUserById
});

server.addService(userPackage.AmountService.service,{
    GetAmountById: paymentService.getAmountById
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error("Server binding failed:", err);
        return;
    }

    console.log(`gRPC Server successfully bound on port ${port}`);
    server.start();  // ✅ Safe to start here
});