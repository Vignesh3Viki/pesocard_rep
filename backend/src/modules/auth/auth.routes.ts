import { Router } from "express";
import * as authController from "./auth.controller";
import { protect } from "../../middleware/auth.middleware";
import upload from "../../middleware/upload.middleware";
import { validate } from "../../middleware/validate.middleware";
import { loginSchema, signupSchema } from "./auth.schema";

const router = Router();

// Public routes
router.post("/signup", validate(signupSchema), authController.signup);
router.post("/login", validate(loginSchema), authController.login);

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
