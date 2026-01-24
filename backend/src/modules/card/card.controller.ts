import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import pool from "../../config/db";
import { decryptUserId } from "../auth/auth.service";
import { sendSuccess, sendError } from "../../utils/response";
import { verifyToken } from "../../utils/jwt";

/**
 * Get card by token
 */
export const getCardById = asyncHandler(async (req: Request, res: Response) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization || "";
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    sendError(res, "Authorization token required", 401);
    return;
  }
  const tokenParam = parts[1];

  let decoded: any;
  try {
    decoded = verifyToken(tokenParam);
  } catch (e) {
    sendError(res, "Invalid or expired token", 401);
    return;
  }

  // Handle two token types:
  // 1. Regular card tokens with 'id' (user id)
  // 2. Share-generated tokens with 'userId' (user id)
  let cardId: number;

  if (decoded?.id) {
    // Regular card token
    cardId = parseInt(decoded.id, 10);
  } else if (decoded?.userId) {
    // Share token
    cardId = parseInt(decoded.userId, 10);
  } else {
    sendError(res, "Invalid token format", 401);
    return;
  }

  if (isNaN(cardId)) {
    sendError(res, "Invalid card ID format", 400);
    return;
  }

  console.log("[CARD] Looking up user with ID:", cardId);

  // Fetch user profile data from database
  const result = await pool.query(
    "SELECT id, first_name, second_name, job_position, company, bio, address, phone, email, website_url, linkedin_url, profile_photo_url, cover_photo_url, qualification FROM users WHERE id = $1",
    [cardId],
  );

  console.log("[CARD] Query result rows:", result.rows.length);

  if (result.rows.length === 0) {
    sendError(res, "Card not found", 404);
    return;
  }

  const user = result.rows[0];
  console.log("[CARD] Found user:", user.id);

  // Return user profile data
  sendSuccess(res, { user }, "Profile retrieved successfully");
});
