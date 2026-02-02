import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as authService from "./auth.service.js";
import { generateToken, verifyToken } from "../../utils/jwt.js";
import { comparePassword } from "../../utils/password.js";
import { sendSuccess, sendError } from "../../utils/response.js";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await authService.findUserByEmail(email);
  if (existingUser) {
    sendError(res, "User with this email already exists", 400);
    return;
  }

  const user = await authService.createUser(req.body);
  const token = generateToken({ id: user.id, email: user.email });

  sendSuccess(res, { user, token }, "User registered successfully", 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await authService.findUserByEmail(email);
  if (!user || !(await comparePassword(password, user.password))) {
    sendError(res, "Invalid email or password", 401);
    return;
  }

  const token = generateToken({ id: user.id, email: user.email });

  // Remove password from user object
  delete user.password;

  sendSuccess(res, { user, token }, "Login successful");
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const user = await authService.findUserById(userId);
  if (!user) {
    sendError(res, "User not found", 404);
    return;
  }

  // Remove password from response
  delete user.password;

  const encryptedUserId = authService.encryptUserId(userId.toString());

  console.log(encryptedUserId, "Encrypted User Id");

  user["encryptedUserId"] = encryptedUserId;

  sendSuccess(res, { user }, "Profile retrieved successfully");
});

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        console.error("No userId in request");
        sendError(res, "User not authenticated", 401);
        return;
      }

      const profileData = req.body;
      const files = req.files as any;

      console.log("Updating profile for user:", userId);
      console.log("Profile data:", profileData);
      console.log("Files:", files ? "present" : "not present");

      // ✅ Store filenames only (frontend builds full URL)
      if (files?.profile_photo?.[0]) {
        profileData.profile_photo_url = files.profile_photo[0].filename;
        console.log("Profile photo filename:", profileData.profile_photo_url);
      }

      if (files?.cover_photo?.[0]) {
        profileData.cover_photo_url = files.cover_photo[0].filename;
        console.log("Cover photo filename:", profileData.cover_photo_url);
      }

      const updatedUser = await authService.updateUserProfile(
        userId,
        profileData,
      );

      if (!updatedUser) {
        console.error("User not found:", userId);
        sendError(res, "User not found", 404);
        return;
      }

      delete updatedUser.password;

      console.log("Profile updated successfully for user:", userId);
      sendSuccess(res, { user: updatedUser }, "Profile updated successfully");
    } catch (error: any) {
      console.error("Update profile error:", error.message);
      console.error("Stack:", error.stack);
      sendError(res, error.message || "Failed to update profile", 500);
    }
  },
);

export const downloadVCard = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization || "";
      const parts = authHeader.split(" ");
      if (parts.length !== 2 || parts[0] !== "Bearer") {
        sendError(res, "Authorization token required", 401);
        return;
      }

      const token = parts[1];
      let decoded: any;
      try {
        decoded = verifyToken(token);
      } catch (e) {
        sendError(res, "Invalid or expired authorization token", 401);
        return;
      }

      // Handle both token types:
      // 1. Regular auth tokens with 'id'
      // 2. Share-generated tokens with 'userId'
      let userId: string;
      if (decoded?.id) {
        userId = decoded.id.toString();
      } else if (decoded?.userId) {
        userId = decoded.userId.toString();
      } else {
        sendError(res, "Invalid token format", 401);
        return;
      }

      const user = await authService.findUserById(userId);
      if (!user) {
        sendError(res, "User not found", 404);
        return;
      }

      const buildUploadUrl = (value: string, baseUrl: string): string => {
        if (value.startsWith("http://") || value.startsWith("https://")) {
          return value;
        }
        const trimmed = value.startsWith("/") ? value.slice(1) : value;
        const normalized = trimmed.startsWith("uploads/")
          ? trimmed
          : `uploads/${trimmed}`;
        return `${baseUrl}/${normalized}`;
      };

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const userForVCard = {
        ...user,
        profile_photo_url: user.profile_photo_url
          ? buildUploadUrl(user.profile_photo_url, baseUrl)
          : null,
      };

      // Generate vCard format with base64 encoded photo
      const vCardContent = await authService.generateVCardFormat(userForVCard);

      // Set response headers for file download
      const fileName = `${user.first_name || "user"}-${
        user.second_name || "contact"
      }`
        .toLowerCase()
        .replace(/\s+/g, "-");

      res.setHeader("Content-Type", "text/vcard;charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}.vcf"`,
      );
      res.setHeader("Content-Length", Buffer.byteLength(vCardContent));

      res.send(vCardContent);
    } catch (error: any) {
      console.error("VCard download error:", error.message);
      sendError(res, "Failed to generate vCard", 500);
    }
  },
);

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    console.log("=== DELETE PROFILE START ===");
    console.log("Request user object:", (req as any).user);

    const userId = (req as any).user?.id;

    if (!userId) {
      console.error("❌ No userId found in request");
      console.error("User object:", (req as any).user);
      sendError(res, "User ID not found in token", 401);
      return;
    }

    console.log("✓ User ID found:", userId);
    console.log("Attempting to delete profile for user:", userId);

    const deleted = await authService.deleteUserProfile(userId);
    console.log("Delete result:", deleted);

    if (!deleted) {
      console.warn("⚠️ User not found for deletion:", userId);
      sendError(res, "User not found", 404);
      return;
    }

    console.log("✅ Profile deleted successfully for user:", userId);
    console.log("=== DELETE PROFILE END ===");
    sendSuccess(res, null, "Profile deleted successfully", 200);
  } catch (error: any) {
    console.error("❌ DELETE PROFILE ERROR");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error object:", JSON.stringify(error, null, 2));
    console.log("=== DELETE PROFILE FAILED ===");
    sendError(res, error.message || "Failed to delete profile", 500);
  }
};
export const getPublicProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId: encryptedUserId } = req.query;

    if (!encryptedUserId) {
      sendError(res, "User ID is required", 400);
      return;
    }

    // Decrypt the userId
    const decryptedUserId = authService.decryptUserId(
      encryptedUserId as string,
    );

    const user = await authService.findUserById(decryptedUserId);
    if (!user) {
      sendError(res, "User not found", 404);
      return;
    }

    // Remove password and sensitive fields from response
    delete user.password;

    sendSuccess(res, { user }, "Public profile retrieved successfully");
  },
);
