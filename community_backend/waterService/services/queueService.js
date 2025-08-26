const amqp = require("amqplib");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function startWaterConsumer() {
  try {
    const conn = await amqp.connect("amqp://admin:admin@rabbitmq:5672");
    const ch = await conn.createChannel();
    const queue = "water_ack";

    await ch.assertQueue(queue);
    console.log("✅ Water Consumer started... waiting for messages");

    ch.consume(queue, async (msg) => {
      if (msg !== null) {
        try {
          const payload = JSON.parse(msg.content.toString());
          console.log("✅ Received from water_ack:", payload);

          const order = await prisma.order.findUnique({
            where: { id: payload.orderId },
          });

          if (!order) {
            console.log("⚠️ Order not found");
            return ch.ack(msg);
          }

          const updateMsg = {
            userId: order.userId,
            quantity: order.quantity,
          };
          await prisma.order.update({
            where:{
                id: order.id
            },
            data:{
                status: "PAID"
            }
          })
          await ch.assertQueue("userWaterUpdate");
          ch.sendToQueue("userWaterUpdate", Buffer.from(JSON.stringify(updateMsg)));
          console.log("✅ Sent update to userService");

          ch.ack(msg);
        } catch (err) {
          console.error("❌ Error handling message:", err);
          // Optionally: ch.nack(msg, false, true) for retry
        }
      }
    });
  } catch (err) {
    console.error("❌ Failed to start consumer:", err);
  }
}
startWaterConsumer();

module.exports = startWaterConsumer;
