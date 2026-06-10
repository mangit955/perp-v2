-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Filled', 'PartiallyFilled', 'Cancelled', 'Open');

-- CreateEnum
CREATE TYPE "Side" AS ENUM ('Bid', 'Ask');

-- CreateEnum
CREATE TYPE "orderType" AS ENUM ('Market', 'Limit');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Market" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Market_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "user_Id" TEXT NOT NULL,
    "market_Id" TEXT NOT NULL,
    "orderType" "orderType" NOT NULL,
    "side" "Side" NOT NULL,
    "Price" TEXT NOT NULL,
    "Slippage" INTEGER NOT NULL,
    "qty" TEXT NOT NULL,
    "initialMargin" TEXT NOT NULL,
    "filledQty" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fills" (
    "id" TEXT NOT NULL,
    "maker_Id" TEXT NOT NULL,
    "taker_Id" TEXT NOT NULL,
    "qty" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "makerOrder_Id" TEXT NOT NULL,
    "takerOrder_Id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fills_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_Id_fkey" FOREIGN KEY ("user_Id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fills" ADD CONSTRAINT "Fills_takerOrder_Id_fkey" FOREIGN KEY ("takerOrder_Id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fills" ADD CONSTRAINT "Fills_makerOrder_Id_fkey" FOREIGN KEY ("makerOrder_Id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fills" ADD CONSTRAINT "Fills_taker_Id_fkey" FOREIGN KEY ("taker_Id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fills" ADD CONSTRAINT "Fills_maker_Id_fkey" FOREIGN KEY ("maker_Id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
