const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

let orders = {};
let orderIdCounter = 1;

router.post("/buyelectric",async(req,res)=>{
    const requiredUnit = req.body.requiredUnit;
    const costPerUnit = 8;
    
    
    const requiredAmount = requiredUnit*costPerUnit;
    
    // orders[orderIdCounter] = {
    //     "orderId":orderIdCounter,
    //     "requiredUnit":requiredUnit,
    //     "requiredAmount":requiredAmount
    // }

      const serviceOrderId =  Math.floor(Math.random() * 100000)
      const payment = await prisma.payment.create({
      data: {
        serviceType: "electric",
        serviceOrderId: serviceOrderId, // could be replaced with an actual order table
        requiredAmountPaise: requiredAmount
      }})
    
    
    res.json({
        "orderId":serviceOrderId,
        "Messege":`Please Pay ${requiredAmount}`,
        "requiredAmount": requiredAmount,
        "paymentUrl":"http://localhost:3001/2/pay"
    });
    orderIdCounter++;
})


module.exports = router;