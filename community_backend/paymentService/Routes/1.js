const express = require('express');
const router = express.Router();
const amqp = require('amqplib');
// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
const client = require('../redisClient/redisClient.js')
const updateAmountById = require('../amountClient.js')

router.post('/verifiedpay/:code', async(req,res)=>{
try{
    const code =  req.params.code
    const deposited = req.body.deposited
    const cached = await client.get(code);

    if (cached) {
      const isAlreadyProcessed = await client.get(`processed:${code}`);
      if (isAlreadyProcessed === 'true') {
      return res.status(400).json({ message: "Payment already processed for this code." });
      }

      const parsed = JSON.parse(cached);
      console.log('Cache hit:', parsed);
        const orderId = parsed.orderId
        console.log(orderId)
        if(Number(deposited) === parsed.price){
          const updatedUser = await updateAmountById(parsed.userId,deposited)
        console.log(updatedUser)
        await client.set(`processed:${code}`, 'true', { EX: 300 }); // Expire in 1 hour

        
        const conn = await amqp.connect('amqp://admin:admin@rabbitmq:5672');
        const ch = await conn.createChannel();
        const queue = parsed.ack;
        const responseToServices = {
          "isSuccess": updatedUser.isSuccess,
          "messege":updatedUser.message,
          "orderId":parsed.orderId
        }
        await ch.assertQueue(queue);
        ch.sendToQueue(queue, Buffer.from(JSON.stringify(responseToServices)));
        console.log(`ack Sent to ${parsed.ack}`);
        await ch.close();
        await conn.close();


      return res.json({
        "messege":updatedUser.message,
        "orderId":orderId,
      })
        }
        else{
          return res.json(
            {
              "messege":"Please pay the correct amount, you money is not deducted",
            }
          )
        }
        
    }

    return res.json({
        "messege":"not found 404"
    })
  }catch(error){
    res.json({
      message:"Something went wrong",
      error: error.message
    })
  }
})

module.exports = router;