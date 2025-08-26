const amqp = require("amqplib");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function startWaterConsumer() {
  try {
    const conn = await amqp.connect("amqp://admin:admin@rabbitmq:5672");
    const ch = await conn.createChannel();
    const queue = "userWaterUpdate";

    await ch.assertQueue(queue);
    console.log("✅ Water Consumer started... waiting for messages");

    ch.consume(queue, async (msg) => {
      if (msg !== null) {
        try {
          const payload = JSON.parse(msg.content.toString());
          console.log("✅ Received from userWaterUpdate:", payload);

          const updatedUser = await prisma.user.update({
            where: {
              id: payload.userId, // Specifies which record to update
            },
            data: {
              waterAmount: {
                increment: payload.quantity, // 🔥 adds payload.amount to current value
              },
            },
          });

          console.log(`Water Amount Updated successfully to ${updatedUser.waterAmount}`)
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
