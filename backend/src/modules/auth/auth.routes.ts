import { Router } from "express";
import * as authController from "./auth.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import upload from "../../middleware/upload.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { loginSchema, signupSchema } from "./auth.schema.js";

const router = Router();

// Public routes
router.post("/signup", validate(signupSchema), authController.signup);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh-token", authController.refreshAccessToken);

// Protected routes
router.get("/profile", protect, authController.getProfile);

router.put(
  "/profile",
  protect,
  upload.fields([
    { name: "profile_photo", maxCount: 1 },
    { name: "cover_photo", maxCount: 1 },
  ]),
  authController.updateProfile
);

router.delete("/profile", protect, authController.deleteProfile);

// Public route - view profile without authentication
router.get("/public-profile", authController.getPublicProfile);

// Public route - accepts encrypted userid parameter
router.get("/download-vcard", authController.downloadVCard);

export default router;
