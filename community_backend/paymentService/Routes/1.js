const express = require('express');
const router = express.Router();
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