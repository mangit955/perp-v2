import { prisma } from "db/client";
import express from "express";

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

app.listen(3000);
