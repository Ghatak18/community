const express = require('express');
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/pay",async(req,res)=>{
    const{orderId,payingAmount}= req.body;
    
    
    const order = await prisma.payment.findFirst({ where: { serviceOrderId: orderId } })
    console.log(order)
    if(!order){
        res.json({
            "messege":"There is no such order"
        })
    }
    console.log("DB Required:", order.requiredAmountPaise, typeof order.requiredAmountPaise);
    console.log("Paying:", payingAmount, typeof payingAmount);

    if(order.requiredAmountPaise === Number(payingAmount) ){
        res.json({
            "messege":"Payment SuccessFul",
        })
        //delete orders[orderId];
    }
    else{
        res.json({
            "amount": payingAmount,
            "messege":"Here is your money, please diposit the correct amount"
        })
    }
})

module.exports = router;