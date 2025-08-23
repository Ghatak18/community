const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const getPaymentUrl = require('./paymentServices/paymentService.js')

const PROTO_PATH = path.join(__dirname, 'Proto', 'payment.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDef);
const paymentPackage = grpcObject.payment;

const server = new grpc.Server();
server.addService(paymentPackage.RequestForPayment.service,{
    RequestForPayment: getPaymentUrl
});



server.bindAsync('0.0.0.0:50053', grpc.ServerCredentials.createInsecure(),()=>{
    console.log("gRPC Server running on port 50053");
    server.start();
});