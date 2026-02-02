import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { sendError } from "../utils/response.js";

export const validate =
  (schema: Joi.ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const errorDetails = error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        }));
        return sendError(res, "Validation Error", 400, errorDetails);
      }

      req.body = value;
      next();
    } catch (err) {
      console.error("Validation middleware error:", err);
      return sendError(res, "Internal Server Error", 500);
    }
  };
