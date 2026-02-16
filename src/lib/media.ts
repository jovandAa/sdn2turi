import type { MediaType } from "@prisma/client";

export function getCloudinaryDeliveryUrl(publicId: string, resourceType: MediaType = "IMAGE") {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName || !publicId) return "";

  const typePath = resourceType === "VIDEO" ? "video" : "image";
  const transforms = resourceType === "VIDEO" ? "q_auto,f_auto" : "f_auto,q_auto";

  return `https://res.cloudinary.com/${cloudName}/${typePath}/upload/${transforms}/${publicId}`;
}

export function getMediaUrl(media?: { publicId: string; resourceType: MediaType } | null) {
  if (!media) return "";
  const withFolder = media as { publicId: string; resourceType: MediaType; folder?: string | null };
  if (withFolder.folder?.startsWith("seed-fallback/")) {
    return `/media/${withFolder.folder.replace("seed-fallback/", "")}`;
  }
  return getCloudinaryDeliveryUrl(media.publicId, media.resourceType);
}

export function extractPublicIdFromCloudinaryUrl(url: string) {
  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;

  const tail = url.slice(idx + marker.length);
  const segments = tail.split("/").filter(Boolean);
  const filtered = segments.filter((seg) => !/^v\d+$/.test(seg) && !seg.includes(",") && !seg.startsWith("w_") && !seg.startsWith("h_"));

  if (filtered.length === 0) return null;
  const joined = filtered.join("/");
  return joined.replace(/\.[a-zA-Z0-9]+$/, "");
}
