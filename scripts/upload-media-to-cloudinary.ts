import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import path from "path";
import slugify from "slugify";

type UploadMapItem = {
  fileName: string;
  publicId: string;
  resourceType: "IMAGE" | "VIDEO";
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
  folder?: string;
  secureUrl?: string;
};

const MEDIA_DIR = path.join(process.cwd(), "public", "media");
const MAP_PATH = path.join(process.cwd(), "prisma", "media-upload-map.json");

function buildPublicId(fileName: string) {
  const ext = path.extname(fileName).replace(".", "").toLowerCase();
  const base = path.basename(fileName, path.extname(fileName));
  const safeBase = slugify(base, { lower: true, strict: true }) || `file-${Date.now()}`;
  return `sdn-turi2/assets/${safeBase}-${ext}`;
}

async function main() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary env belum lengkap.");
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const files = await fs.readdir(MEDIA_DIR);
  const filtered = files.filter((f) => /\.(jpg|jpeg|png|webp|gif|mp4|mov|avi|mkv)$/i.test(f));

  const results: UploadMapItem[] = [];

  for (const fileName of filtered) {
    const filePath = path.join(MEDIA_DIR, fileName);
    const publicId = buildPublicId(fileName);

    const upload = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      overwrite: true,
      resource_type: "auto",
      invalidate: true,
    });

    results.push({
      fileName,
      publicId: upload.public_id,
      resourceType: upload.resource_type === "video" ? "VIDEO" : "IMAGE",
      format: upload.format,
      width: upload.width,
      height: upload.height,
      bytes: upload.bytes,
      folder: upload.folder,
      secureUrl: upload.secure_url,
    });

    console.log(`Uploaded: ${fileName} -> ${upload.public_id}`);
  }

  await fs.writeFile(MAP_PATH, JSON.stringify(results, null, 2), "utf8");
  console.log(`\nDone. Map saved to ${MAP_PATH}`);
}

main().catch((err) => {
  console.error("Upload failed:", err);
  process.exit(1);
});
