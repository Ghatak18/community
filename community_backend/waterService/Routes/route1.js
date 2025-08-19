const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getUserById = require('../grpcClient.js')

let orders = {};
let orderIdCounter = 1;

router.post("/buywatergrpc", async(req,res)=>{
  console.log('Headers:', req.headers);
  const userId = 1; // from JWT
  const userDetails = await getUserById(userId);
  console.log(userDetails); // 🔍 confirm it works

  // Continue with buying logic
  res.json({ message: 'Water purchased', user: userDetails });
 // res.json({ message: 'Water purchased' });
})
router.post("/buywater",async(req,res)=>{
    const requiredUnit = req.body.requiredUnit;
    const costPerUnit = 5;
    
    
    const requiredAmount = requiredUnit*costPerUnit;
    
    // orders[orderIdCounter] = {
    //     "orderId":orderIdCounter,
    //     "requiredUnit":requiredUnit,
    //     "requiredAmount":requiredAmount
    // }

    //   const serviceOrderId =  Math.floor(Math.random() * 100000)
    //   const payment = await prisma.payment.create({
    //   data: {
    //     serviceType: "water",
    //     serviceOrderId: serviceOrderId, // could be replaced with an actual order table
    //     requiredAmountPaise: requiredAmount
    //   }})
    
    
    // res.json({
    //     "orderId":serviceOrderId,
    //     "Messege":`Please Pay ${requiredAmount}`,
    //     "requiredAmount": requiredAmount,
    //     "paymentUrl":"http://localhost:3000/1/pay"
    // });
    res.json({
      "messege":"hellow"
    })
    orderIdCounter++;
})
// route.put('/updatewater',async(req,res) =>{

// })

module.exports = router;