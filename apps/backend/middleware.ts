import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.token as string;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.userId) {
      req.userId = userId;
      next();
    } else {
      res.status(403).json({ messge: "Incorrect token" });
    }
  } catch (e) {
    res.status(403).json({ messge: "Incorrect token" });
  }
}
