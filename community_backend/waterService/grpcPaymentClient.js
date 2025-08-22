const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'Proto', 'payment.proto');

// Load and parse the .proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,               // Important for lowercase service names like `requestForPayment`
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const grpcObject = grpc.loadPackageDefinition(packageDefinition);

// ⚠️ Important: `payment` is the package name in your proto
const paymentPackage = grpcObject.payment;

// ⚠️ Now correctly access the service (case-sensitive!)
const client = new paymentPackage.RequestForPayment(
  'host.docker.internal:50051',  // Or 'paymentservice:50051' if in Docker
  grpc.credentials.createInsecure()
);

// Export a function to use this
function requestPayment(orderId, userId, price) {
  return new Promise((resolve, reject) => {
    client.RequestForPayment(
      {
        orderId,
        userId,
        price
      },
      (err, response) => {
        if (err) return reject(err);
        resolve(response);
      }
    );
  });
}

module.exports = requestPayment;
