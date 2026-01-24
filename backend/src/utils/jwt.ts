import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const generateToken = (payload: any, expiresIn?: string | number) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: expiresIn ?? (env.JWT_EXPIRES_IN as any),
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET);
};
