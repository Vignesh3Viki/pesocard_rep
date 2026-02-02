import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { sendSuccess, sendError } from "../../utils/response.js";
import {
  createCardShare,
  addUserView,
  addCardSave,
  addProfileVisit,
  getUserCardMetrics,
  getUserProfileAnalytics,
} from "./analytics.service.js";
import { encryptUserId, decryptUserId } from "../auth/auth.service.js";
import { generateToken, verifyToken } from "../../utils/jwt.js";

export const trackView = asyncHandler(async (req: Request, res: Response) => {
  const { visitor_id, country_name } = req.body;

  // Extract share token from Authorization header
  const authHeader = req.headers.authorization || "";
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    sendError(res, "Authorization token required", 401);
    return;
  }
  let decoded: any;
  try {
    decoded = verifyToken(parts[1]);
  } catch (e) {
    sendError(res, "Invalid or expired authorization token", 401);
    return;
  }

  const card_share_id = decoded?.sid;
  if (!card_share_id) {
    sendError(res, "Invalid share token", 401);
    return;
  }

  const view = await addUserView(card_share_id, visitor_id, country_name);
  if (!view) {
    sendSuccess(res, { deduped: true }, "View already recorded");
    return;
  }
  sendSuccess(res, { view_id: view.id }, "View recorded", 201);
});

export const trackSave = asyncHandler(async (req: Request, res: Response) => {
  const { visitor_id } = req.body;

  // Extract share token from Authorization header
  const authHeader = req.headers.authorization || "";
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    sendError(res, "Authorization token required", 401);
    return;
  }
  let decoded: any;
  try {
    decoded = verifyToken(parts[1]);
  } catch (e) {
    sendError(res, "Invalid or expired authorization token", 401);
    return;
  }

  const card_share_id = decoded?.sid;
  if (!card_share_id) {
    sendError(res, "Invalid share token", 401);
    return;
  }

  const save = await addCardSave(card_share_id, visitor_id);
  if (!save) {
    sendSuccess(res, { deduped: true }, "Save already recorded");
    return;
  }
  sendSuccess(res, { save_id: save.id }, "Save recorded", 201);
});

export const trackProfileVisit = asyncHandler(
  async (req: Request, res: Response) => {
    const { visitor_id, visiting_source } = req.body;

    // Extract share token from Authorization header
    const authHeader = req.headers.authorization || "";
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      sendError(res, "Authorization token required", 401);
      return;
    }
    let decoded: any;
    try {
      decoded = verifyToken(parts[1]);
    } catch (e) {
      sendError(res, "Invalid or expired authorization token", 401);
      return;
    }

    const card_share_id = decoded?.sid;
    if (!card_share_id) {
      sendError(res, "Invalid share token", 401);
      return;
    }

    const visit = await addProfileVisit(
      card_share_id,
      visitor_id,
      visiting_source,
    );

    if (!visit) {
      sendSuccess(res, { deduped: true }, "Visit already recorded");
      return;
    }

    sendSuccess(res, { visit_id: visit.id }, "Visit recorded", 201);
  },
);

export const getMetrics = asyncHandler(async (req: Request, res: Response) => {
  // Extract authenticated user from Authorization Bearer token
  // Supports both regular auth tokens (with 'id') and share-generated tokens (with 'userId')
  const authHeader = req.headers.authorization || "";
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    sendError(res, "Authorization token required", 401);
    return;
  }
  let decoded: any;
  try {
    decoded = verifyToken(parts[1]);
  } catch (e) {
    sendError(res, "Invalid or expired authorization token", 401);
    return;
  }

  // Support both regular auth token (id) and share token (userId)
  const userId = parseInt(decoded?.id || decoded?.userId, 10);
  if (!userId || isNaN(userId)) {
    sendError(res, "Invalid user in token", 401);
    return;
  }

  const metrics = await getUserCardMetrics(userId);
  sendSuccess(res, metrics, "Aggregated metrics");
});

export const generateShareLink = asyncHandler(
  async (req: Request, res: Response) => {
    // Extract authenticated user from Authorization Bearer token
    const authHeader = req.headers.authorization || "";
    const type = req.body.type || "shareLink";
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      sendError(res, "Authorization token required", 401);
      return;
    }
    let decoded: any;
    try {
      decoded = verifyToken(parts[1]);
    } catch (e) {
      sendError(res, "Invalid or expired authorization token", 401);
      return;
    }
    const userId = parseInt(decoded?.id, 10);
    if (!userId || isNaN(userId)) {
      sendError(res, "Invalid user in token", 401);
      return;
    }

    // Record share event as shareLink and capture share idq
    const share = await createCardShare(userId, type);

    // Generate a token tied to this user/card (no expiry)
    const token = generateToken(
      { sid: share.id, userId: userId, type: type },
      "999y",
    );

    // Frontend will build the URL; return token, share_id, and suggested path pattern
    sendSuccess(
      res,
      {
        token,
        path: `/my-card/${encodeURIComponent(token)}`,
      },
      "Share link token generated",
      201,
    );
  },
);

export const getProfileAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    // Extract authenticated user from Authorization Bearer token
    const authHeader = req.headers.authorization || "";
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      sendError(res, "Authorization token required", 401);
      return;
    }
    let decoded: any;
    try {
      decoded = verifyToken(parts[1]);
    } catch (e) {
      sendError(res, "Invalid or expired authorization token", 401);
      return;
    }

    const userId = parseInt(decoded?.id || decoded?.userId, 10);
    if (!userId || isNaN(userId)) {
      sendError(res, "Invalid user in token", 401);
      return;
    }

    const analytics = await getUserProfileAnalytics(userId);
    if (!analytics) {
      sendSuccess(
        res,
        {
          profile_views: 0,
          profile_visits: 0,
          rates: {
            View_rate_percentage: 0,
            share_rate_percentage: 0,
            visit_rate_percentage: 0,
          },
          today: {
            views: 0,
            shares: 0,
            visits: 0,
          },
        },
        "Profile analytics",
      );
      return;
    }

    sendSuccess(res, analytics, "Profile analytics");
  },
);

export const handleQRScan = asyncHandler(
  async (req: Request, res: Response) => {
    const { encryptedUserId } = req.params;

    if (!encryptedUserId) {
      sendError(res, "Encrypted user ID required", 400);
      return;
    }

    // Decrypt the user ID from QR code (guard against malformed encoding)
    let decodedEncryptedUserId: string;

    try {
      decodedEncryptedUserId = decodeURIComponent(String(encryptedUserId));
    } catch {
      sendError(res, "Invalid or expired QR code", 400);
      return;
    }

    const decryptedUserId = decryptUserId(decodedEncryptedUserId);

    if (!decryptedUserId) {
      sendError(res, "Invalid or expired QR code", 400);
      return;
    }

    const userId = parseInt(decryptedUserId, 10);
    if (!userId || isNaN(userId)) {
      sendError(res, "Invalid user ID in QR code", 400);
      return;
    }

    // Create a card share record for QR scan tracking
    const share = await createCardShare(userId, "QR");

    // Generate a token tied to this user/card (no expiry)
    const token = generateToken(
      { sid: share.id, userId: userId, type: "QR" },
      "999y",
    );

    // Redirect to the card page with the share token
    res.redirect(
      `${process.env.WEBSITE_URL}/my-card/${encodeURIComponent(token)}`,
    );
  },
);
