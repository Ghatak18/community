const { v4: uuidv4 } = require('uuid');
const client = require('../redisClient/redisClient.js')


const getPaymentUrl = async(call,callback)=>{
    console.log("this is so cooool");
    const code = uuidv4();
    const url = `http://localhost:4001/pay/verifiedpay/${code}`
    console.log("Request received:", call.request);
    const orderId = call.request.orderId
    const userId = call.request.userId
    const price = call.request.price
    const cacheData = {
      orderId,
      userId,
      price
    };

    await client.set(code, JSON.stringify(cacheData), {
      EX: 300 // expire after 5 minutes
    });
    callback(null, { paymentLink: url });
}
module.exports = getPaymentUrl