const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const path = require('path');


const PROTO_PATH = path.join(__dirname, 'Proto', 'amount.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDef);
const userPackage = grpcObject.user;

const client = new userPackage.AmountService('userservice:50051',grpc.credentials.createInsecure());

function updateAmountById(userId,amount) {
    return new Promise((resolve, reject) =>{
        client.GetAmountById({
            id: userId,
            amount: amount
        }, (err, response)=>{
            if(err) return reject(err);
            resolve(response);
        });
    });
}

module.exports = updateAmountById