const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getUserById = require("../grpcClient.js");
const requestPayment = require("../grpcPaymentClient.js");
const amqp = require("amqplib");

let orders = {};
let orderIdCounter = 1;

router.post("/buywatergrpc", async (req, res) => {
  console.log("Headers:", req.headers);
  const userId = req.headers["x-user-id"];
  const userDetails = await getUserById(userId);

  const pricePerUnit = 5;
  const quantity = req.body.quantity;
  const price = quantity * pricePerUnit;
  const storage = await prisma.waterStorage.findUnique({
    where: {
      id: 1,
    },
  });
  console.log(storage);

  if (storage.quantity >= quantity) {
    const order = await prisma.order.create({
      data: {
        userId: userId,
        userData: userDetails,
        quantity: quantity,
        price: price,
        invoiceId: String(2 * Math.random()),
      },
    });
    const ack = "water_ack"
    const response = await requestPayment(
      order.id.toString(),
      order.userId,
      order.price,
      ack
    );
    console.log("Payment Link:", response.paymentLink);

    res.json({
      message: "please pay here",
      link: response.paymentLink,
      price: price,
    });

    const conn = await amqp.connect("amqp://admin:admin@rabbitmq:5672");
    const ch = await conn.createChannel();
    const queue = ack;

    await ch.assertQueue(queue);
    console.log(" [*] Waiting for messages...");
    ch.consume(queue, (msg) => {
      if (msg !== null) {
        const payload = JSON.parse(msg.content.toString());
        console.log(" [x] Received:", payload);
        ch.ack(msg);
      }
    });
  } else {
    return res.json({
      messege: "hi this is me",
    });
  }

  // res.json({ message: 'Water purchased' });
});

router.post("/updatewaterstorage", async (req, res) => {
  const quantity = req.body.quantity;
  const updateWater = await prisma.waterStorage.create({
    data: {
      quantity: 1000,
    },
  });
  res.json({
    messege: "WaterStorage is created",
  });
});

module.exports = router;
