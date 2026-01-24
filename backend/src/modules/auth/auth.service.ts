import { query } from "../../config/db";
import { hashPassword } from "../../utils/password";
import { User, UpdateProfileInput } from "./auth.types";
import * as crypto from "crypto";
import https from "https";

export const findUserByEmail = async (email: string) => {
  const result = await query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

export const findUserById = async (id: string): Promise<User | null> => {
  const result = await query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0] || null;
};

export const createUser = async (userData: any) => {
  const { email, password } = userData;
  const hashedPassword = await hashPassword(password);

  const result = await query(
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at",
    [email, hashedPassword],
  );

  return result.rows[0];
};

export const updateUserProfile = async (
  id: string,
  profileData: UpdateProfileInput,
): Promise<User | null> => {
  try {
    const {
      profile_photo_url,
      cover_photo_url,
      first_name,
      second_name,
      qualification,
      job_position,
      company,
      bio,
      address,
      phone,
      website_url,
      linkedin_url,
    } = profileData;

    // Build dynamic update query
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // Add only fields that have values
    if (first_name !== undefined && first_name !== null) {
      fields.push(`first_name = $${paramIndex++}`);
      values.push(first_name);
    }
    if (second_name !== undefined && second_name !== null) {
      fields.push(`second_name = $${paramIndex++}`);
      values.push(second_name);
    }
    if (qualification !== undefined && qualification !== null) {
      fields.push(`qualification = $${paramIndex++}`);
      values.push(qualification);
    }
    if (job_position !== undefined && job_position !== null) {
      fields.push(`job_position = $${paramIndex++}`);
      values.push(job_position);
    }
    if (company !== undefined && company !== null) {
      fields.push(`company = $${paramIndex++}`);
      values.push(company);
    }
    if (bio !== undefined && bio !== null) {
      fields.push(`bio = $${paramIndex++}`);
      values.push(bio);
    }
    if (address !== undefined && address !== null) {
      fields.push(`address = $${paramIndex++}`);
      values.push(address);
    }
    if (phone !== undefined && phone !== null) {
      fields.push(`phone = $${paramIndex++}`);
      values.push(phone);
    }
    if (website_url !== undefined && website_url !== null) {
      fields.push(`website_url = $${paramIndex++}`);
      values.push(website_url);
    }
    if (linkedin_url !== undefined && linkedin_url !== null) {
      fields.push(`linkedin_url = $${paramIndex++}`);
      values.push(linkedin_url);
    }
    if (profile_photo_url !== undefined && profile_photo_url !== null) {
      fields.push(`profile_photo_url = $${paramIndex++}`);
      values.push(profile_photo_url);
    }
    if (cover_photo_url !== undefined && cover_photo_url !== null) {
      fields.push(`cover_photo_url = $${paramIndex++}`);
      values.push(cover_photo_url);
    }

    if (fields.length === 0) {
      console.log("No fields to update for user:", id);
      return await findUserById(id);
    }

    // Add updated_at timestamp (not a parameterized value)
    fields.push(`updated_at = NOW()`);

    // Now add the id parameter for WHERE clause
    values.push(id);
    const whereParamIndex = paramIndex;

    const updateQuery = `UPDATE users SET ${fields.join(
      ", ",
    )} WHERE id = $${whereParamIndex} RETURNING *`;

    console.log("Update query:", updateQuery);
    console.log("Update values:", values);

    const result = await query(updateQuery, values);
    console.log("Update successful, rows:", result.rows.length);

    return result.rows[0] || null;
  } catch (error: any) {
    console.error("updateUserProfile error:", error.message);
    console.error("Error details:", error);
    throw new Error(`Profile update failed: ${error.message}`);
  }
};

/**
 * Fetch image from URL and convert to base64
 */
const fetchImageAsBase64 = async (imageUrl: string): Promise<string | null> => {
  return new Promise((resolve) => {
    try {
      https
        .get(imageUrl, (response) => {
          const chunks: Buffer[] = [];
          response.on("data", (chunk) => chunks.push(chunk));
          response.on("end", () => {
            const buffer = Buffer.concat(chunks);
            resolve(buffer.toString("base64"));
          });
        })
        .on("error", (error) => {
          console.error("Error fetching image:", error.message);
          resolve(null);
        });
    } catch (error: any) {
      console.error("Error in fetchImageAsBase64:", error.message);
      resolve(null);
    }
  });
};

/**
 * Generate vCard format string from user data
 * Compliant with vCard 3.0 specification
 */
export const generateVCardFormat = async (user: User): Promise<string> => {
  const encodeVCardText = (value?: string | null): string => {
    if (!value) return "";
    return value
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,");
  };

  const foldVCardLine = (line: string): string => {
    const limit = 75;
    let result = "";
    while (line.length > limit) {
      result += line.slice(0, limit) + "\r\n ";
      line = line.slice(limit);
    }
    return result + line;
  };

  const lines: string[] = [];

  lines.push("BEGIN:VCARD");
  lines.push("VERSION:3.0");

  const fullName = `${user.first_name || ""} ${user.second_name || ""}`.trim();
  lines.push(`FN:${encodeVCardText(fullName)}`);

  lines.push(
    `N:${encodeVCardText(user.second_name)};${encodeVCardText(
      user.first_name,
    )};;;`,
  );

  if (user.company) lines.push(`ORG:${encodeVCardText(user.company)}`);

  if (user.job_position)
    lines.push(`TITLE:${encodeVCardText(user.job_position)}`);

  if (user.email) lines.push(`EMAIL;TYPE=INTERNET:${user.email}`);

  if (user.phone) {
    lines.push(`TEL;TYPE=CELL,VOICE:${user.phone}`);
  }

  if (user.address)
    lines.push(`ADR;TYPE=WORK:;;${encodeVCardText(user.address)};;;;`);

  if (user.website_url) lines.push(`URL:${user.website_url}`);

  if (user.linkedin_url)
    lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${user.linkedin_url}`);

  if (user.bio) lines.push(`NOTE:${encodeVCardText(user.bio)}`);

  if (user.qualification)
    lines.push(`CATEGORIES:${encodeVCardText(user.qualification)}`);

  // Fetch and encode profile photo as base64
  if (user.profile_photo_url) {
    const base64Photo = await fetchImageAsBase64(user.profile_photo_url);
    if (base64Photo) {
      lines.push(`PHOTO;ENCODING=BASE64;TYPE=JPEG:${base64Photo}`);
    }
  }

  lines.push(
    `REV:${new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d+Z$/, "Z")}`,
  );

  lines.push("END:VCARD");

  return lines.join("\r\n");
};

/**
 * Encrypt userId using AES encryption
 * Returns encrypted string that can be safely passed as URL parameter
 */
export const encryptUserId = (userId: string): string => {
  try {
    console.log("[encryptUserId] Input userId:", userId);

    const secret = process.env.ENCRYPTION_SECRET;
    console.log(
      "[encryptUserId] Using encryption secret:",
      secret ? "***" : "NOT SET",
    );

    if (!secret) {
      throw new Error("ENCRYPTION_SECRET is not set in environment variables");
    }

    const algorithm = "aes-256-cbc";
    const key = crypto.scryptSync(secret, "salt", 32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(userId, "utf8", "hex");
    encrypted += cipher.final("hex");

    const result = `${iv.toString("hex")}:${encrypted}`;

    console.log(
      "[encryptUserId] Output encrypted:",
      result.substring(0, 50) + "...",
    );

    // Return iv + encrypted, both hex encoded, separated by ':'
    return result;
  } catch (error) {
    console.error("[encryptUserId] Encryption failed:", error);
    throw error; // rethrow so caller can handle it
  }
};
/**
 * Decrypt userId from encrypted string
 * Returns the original userId or null if decryption fails
 */
export const decryptUserId = (encryptedData: string): string | null => {
  try {
    console.log(
      "[decryptUserId] Input encrypted:",
      encryptedData.substring(0, 50) + "...",
    );
    const secret = process.env.ENCRYPTION_SECRET;
    console.log(
      "[decryptUserId] Using encryption secret:",
      secret ? "***" : "NOT SET",
    );
    const algorithm = "aes-256-cbc";

    if (!secret) {
      console.error("[decryptUserId] ENCRYPTION_SECRET not set in environment");
      return null;
    }

    let key: Buffer;
    try {
      key = crypto.scryptSync(secret, "salt", 32);
      console.log("[decryptUserId] Key generated successfully");
    } catch (keyError: any) {
      console.error("[decryptUserId] Error generating key:", keyError.message);
      return null;
    }

    const parts = encryptedData.split(":");
    console.log("[decryptUserId] Split parts count:", parts.length);

    if (parts.length !== 2) {
      console.error(
        "[decryptUserId] Invalid format: expected 2 parts, got",
        parts.length,
      );
      return null;
    }

    const [ivHex, encryptedHex] = parts;
    if (!ivHex || !encryptedHex) {
      console.error(
        "[decryptUserId] Invalid encrypted data format. ivHex:",
        !!ivHex,
        "encryptedHex:",
        !!encryptedHex,
      );
      return null;
    }

    console.log(
      "[decryptUserId] IV hex length:",
      ivHex.length,
      "Encrypted hex length:",
      encryptedHex.length,
    );

    let iv: Buffer;
    try {
      iv = Buffer.from(ivHex, "hex");
      console.log("[decryptUserId] IV buffer created, length:", iv.length);
    } catch (bufferError: any) {
      console.error(
        "[decryptUserId] Error creating IV buffer:",
        bufferError.message,
      );
      return null;
    }

    try {
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      let decrypted = decipher.update(encryptedHex, "hex", "utf8");
      decrypted += decipher.final("utf8");

      console.log("[decryptUserId] Decrypted successfully:", decrypted);
      return decrypted;
    } catch (decipherError: any) {
      console.error(
        "[decryptUserId] Error during decryption:",
        decipherError.message,
      );
      return null;
    }
  } catch (error: any) {
    console.error("[decryptUserId] Unexpected error:", error.message);
    console.error("[decryptUserId] Error stack:", error.stack);
    return null;
  }
};

export const deleteUserProfile = async (id: string): Promise<boolean> => {
  try {
    console.log("[AUTH.SERVICE] === DELETEUSERPROFILE START ===");
    console.log("[AUTH.SERVICE] User ID:", id);
    console.log("[AUTH.SERVICE] User ID type:", typeof id);

    if (!id || id === undefined) {
      console.error("[AUTH.SERVICE] ❌ Invalid user ID:", id);
      throw new Error("User ID is required");
    }

    // Clear all profile fields by setting them to NULL
    const updateQuery = `UPDATE users 
       SET first_name = NULL,
           second_name = NULL,
           qualification = NULL,
           job_position = NULL,
           company = NULL,
           bio = NULL,
           address = NULL,
           phone = NULL,
           website_url = NULL,
           linkedin_url = NULL,
           profile_photo_url = NULL,
           cover_photo_url = NULL
       WHERE id = $1
       RETURNING id`;

    console.log("[AUTH.SERVICE] Executing delete query...");
    console.log("[AUTH.SERVICE] Parameter:", id);

    const result = await query(updateQuery, [id]);

    console.log("[AUTH.SERVICE] Query executed successfully");
    console.log("[AUTH.SERVICE] Result rows affected:", result.rows.length);

    if (result.rows.length === 0) {
      console.warn("[AUTH.SERVICE] ⚠️ No rows updated - user may not exist");
    } else {
      console.log("[AUTH.SERVICE] ✅ User profile cleared:", result.rows[0]);
    }

    console.log("[AUTH.SERVICE] === DELETEUSERPROFILE END ===");
    return result.rows.length > 0;
  } catch (error: any) {
    console.error("[AUTH.SERVICE] ❌ === DELETEUSERPROFILE ERROR ===");
    console.error("[AUTH.SERVICE] Error type:", error.constructor.name);
    console.error("[AUTH.SERVICE] Error message:", error.message);
    console.error("[AUTH.SERVICE] Error code:", error.code);
    console.error("[AUTH.SERVICE] Error detail:", error.detail);
    console.error("[AUTH.SERVICE] Stack trace:", error.stack);
    throw error;
  }
};
