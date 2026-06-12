import { prisma } from "db/client";
import express from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middleware";
import { loopback } from "./loopback";

const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(411).json("enter username & password");
  }

  const response = await prisma.users.create({
    data: { username, password },
  });
  res.json({
    id: response.id,
  });
});

app.post("/api/v1/signin", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(411).json("enter username & password");
  }

  const response = await prisma.users.findFirst({
    where: { username, password },
  });

  if (!response) {
    res.status(403).json({ message: "Incorrect creds" });
  }
  res.json({
    token: jwt.sign({ userId: response?.id }, process.env.JWT_SECRET!),
  });
});

app.post("/admin/market", async (req, res) => {
  const { symbol, imageUrl } = req.body;
  const token = req.headers.token;

  if (token != process.env.ADMIN_SECRET) {
    res.status(403).json({});
    return;
  }

  const response = await prisma.market.create({
    data: {
      slug: symbol,
      imageUrl,
    },
  });

  const queueLoopbackResponce = await loopback({
    messageType: "create_market",
    marketId: response.id,
  });

  res.json({ id: response.id });
});

app.post("/api/v1/onramp", authMiddleware, async (req, res) => {
  const userId: string = req.userId!;

  const queueLoopbackResponce = await loopback({
    messageType: "onramp",
    userId: userId,
    amount: req.body.amount.toString(),
  });
});

app.post("/api/v1/order", authMiddleware, (req, res) => {});

app.listen(3000);
