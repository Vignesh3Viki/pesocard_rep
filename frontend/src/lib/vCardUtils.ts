/* =========================================================
   vCard 3.0 Utility – Production Ready
   Compatible with Android / iOS / Google / Apple
========================================================= */

export interface ContactInfo {
  first_name: string;
  second_name: string;
  email?: string;
  phone?: string;
  job_position?: string;
  company?: string;
  address?: string;
  website_url?: string;
  linkedin_url?: string;
  bio?: string;
  profile_photo_url?: string | null;
  qualification?: string;
}

const MAX_FILE_SIZE = 200 * 1024; // 200KB (mobile safe)

/* =========================================================
   vCard helpers
========================================================= */

/** Escape text per vCard 3.0 */
const encodeVCardText = (value?: string | null): string => {
  if (!value) return "";
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
};

/** Fold lines to max 75 characters (RFC rule) */
const foldVCardLine = (line: string): string => {
  const limit = 75;
  let result = "";

  while (line.length > limit) {
    result += line.slice(0, limit) + "\r\n ";
    line = line.slice(limit);
  }

  return result + line;
};

/* =========================================================
   Image processing
========================================================= */

const compressImage = async (blob: Blob): Promise<Blob> => {
  const targetSize = 100 * 1024;
  if (blob.size <= targetSize) return blob;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > 600 || height > 600) {
          const scale = Math.min(600 / width, 600 / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(blob);

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((b) => resolve(b || blob), "image/jpeg", 0.75);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(blob);
  });
};

const imageUrlToDataUrl = async (url: string): Promise<string | null> => {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    let blob = await res.blob();
    if (blob.size > 100 * 1024) {
      blob = await compressImage(blob);
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

const extractBase64 = (dataUrl: string): string => dataUrl.split(",")[1] || "";

const extractImageType = (dataUrl: string): string => {
  try {
    return dataUrl.split(";")[0].split("/")[1].toUpperCase();
  } catch {
    return "JPEG";
  }
};

const buildPhotoLine = (dataUrl: string): string => {
  const base64 = extractBase64(dataUrl);
  const type = extractImageType(dataUrl);

  return foldVCardLine(`PHOTO;ENCODING=BASE64;TYPE=${type}:` + base64);
};

/* =========================================================
   vCard builder
========================================================= */

const buildVCardString = (
  contact: ContactInfo,
  photoDataUrl: string | null
): string => {
  const lines: string[] = [];

  lines.push("BEGIN:VCARD");
  lines.push("VERSION:3.0");

  lines.push(
    `FN:${encodeVCardText(
      `${contact.first_name} ${contact.second_name}`.trim()
    )}`
  );

  lines.push(
    `N:${encodeVCardText(contact.second_name)};${encodeVCardText(
      contact.first_name
    )};;;`
  );

  if (contact.company) lines.push(`ORG:${encodeVCardText(contact.company)}`);

  if (contact.job_position)
    lines.push(`TITLE:${encodeVCardText(contact.job_position)}`);

  if (contact.email) lines.push(`EMAIL;TYPE=INTERNET:${contact.email}`);

  if (contact.phone)
    lines.push(`TEL;TYPE=CELL,VOICE:+91${contact.phone.replace(/\D/g, "")}`);

  if (contact.address)
    lines.push(`ADR;TYPE=WORK:;;${encodeVCardText(contact.address)};;;;`);

  if (contact.website_url) lines.push(`URL:${contact.website_url}`);

  if (contact.linkedin_url)
    lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${contact.linkedin_url}`);

  if (contact.bio) lines.push(`NOTE:${encodeVCardText(contact.bio)}`);

  if (contact.qualification)
    lines.push(`CATEGORIES:${encodeVCardText(contact.qualification)}`);

  if (photoDataUrl) lines.push(buildPhotoLine(photoDataUrl));

  lines.push(
    `REV:${new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d+Z$/, "Z")}`
  );

  lines.push("END:VCARD");

  return lines.join("\r\n");
};

/* =========================================================
   Public API
========================================================= */

export const generatevCard = async (contact: ContactInfo): Promise<string> => {
  let photoDataUrl: string | null = null;

  if (contact.profile_photo_url) {
    photoDataUrl = await imageUrlToDataUrl(contact.profile_photo_url);
  }

  return buildVCardString(contact, photoDataUrl);
};

export const downloadvCard = async (contact: ContactInfo): Promise<void> => {
  const vCard = await generatevCard(contact);

  if (!vCard.includes("BEGIN:VCARD")) {
    throw new Error("Invalid vCard");
  }

  const blob = new Blob([vCard], {
    type: "text/vcard;charset=utf-8",
  });

  if (blob.size > MAX_FILE_SIZE) {
    console.warn("⚠️ vCard exceeds 200KB mobile limit");
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const fileName = `${contact.first_name}-${contact.second_name}`
    .toLowerCase()
    .replace(/\s+/g, "-");

  link.href = url;
  link.download = `${fileName}.vcf`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
