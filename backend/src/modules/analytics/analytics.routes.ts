import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import {
  shareSchema,
  viewSchema,
  saveSchema,
  profileVisitSchema,
} from "./analytics.schema.js";
import {
  trackView,
  trackSave,
  trackProfileVisit,
  getMetrics,
  generateShareLink,
  getProfileAnalytics,
  handleQRScan,
} from "./analytics.controller.js";

const router = Router();

// QR Code scan handler - redirect to share link
router.get("/qr/:encryptedUserId", handleQRScan);

// Generate a short-lived share token (20 mins) for public link
router.post("/share-link", generateShareLink);
router.post("/view", validate(viewSchema), trackView);
router.post("/save", validate(saveSchema), trackSave);
router.post("/profile-visit", validate(profileVisitSchema), trackProfileVisit);

router.get("/metrics", getMetrics);
router.get("/profile-analytics", getProfileAnalytics);

export default router;
