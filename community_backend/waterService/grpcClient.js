const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const path = require('path');


const PROTO_PATH = path.join(__dirname, 'Proto', 'user.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDef);
const userPackage = grpcObject.user;

const client = new userPackage.UserService('userservice:50051',grpc.credentials.createInsecure());

function getUserById(userId) {
    return new Promise((resolve, reject) =>{
        client.getUserById({
            id: userId
        }, (err, response)=>{
            if(err) return reject(err);
            resolve(response);
        });
    });
}

module.exports = getUserById