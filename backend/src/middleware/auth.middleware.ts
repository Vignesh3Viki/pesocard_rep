import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { sendError } from "../utils/response";

export const protect = async (req: any, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      sendError(res, "Not authorized, token failed", 401);
      return;
    }
  }

  if (!token) {
    sendError(res, "Not authorized, no token", 401);
    return;
  }
};
