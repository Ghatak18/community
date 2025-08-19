-- CreateTable
CREATE TABLE "public"."WaterStorage" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaterStorage_pkey" PRIMARY KEY ("id")
);
