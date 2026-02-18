"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import slugify from "slugify";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";
import { extractPublicIdFromCloudinaryUrl } from "@/lib/media";
import { prisma } from "@/lib/prisma";

const heroSchema = z.object({
  heading: z.string().min(3),
  subtitle: z.string().min(3),
  ctaLabel: z.string().min(2),
  ctaHref: z.string().min(1),
});

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/profil");
  revalidatePath("/tentang");
  revalidatePath("/tenaga-kependidikan");
  revalidatePath("/fasilitas/prasarana");
  revalidatePath("/informasi/galeri");
  revalidatePath("/informasi/kegiatan");
  revalidatePath("/informasi/ppdb");
  revalidatePath("/kontak");
  revalidatePath("/alamat");
  revalidatePath("/admin");
  revalidatePath("/admin/beranda");
  revalidatePath("/admin/kegiatan");
  revalidatePath("/admin/galeri");
  revalidatePath("/admin/media");
  revalidatePath("/admin/ppdb");
  revalidatePath("/admin/ppdb-lulusan");
  revalidatePath("/admin/kontak-alamat");
  revalidatePath("/admin/staff");
  revalidatePath("/admin/facilities");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/pages");
  revalidatePath("/admin/security");
  revalidatePath("/admin/users");
}

async function ensureAdminAccess() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("UNAUTHORIZED");
  }

  return session;
}

async function ensureSuperAdminAccess() {
  const session = await ensureAdminAccess();

  if (session.user.role !== "SUPER_ADMIN") {
    throw new Error("FORBIDDEN");
  }

  return session;
}

async function destroyCloudinaryAsset(publicId: string, resourceType: "image" | "video") {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true,
  });
}

export async function updateBerandaHero(formData: FormData) {
  await ensureAdminAccess();

  const data = heroSchema.parse({
    heading: formData.get("heading"),
    subtitle: formData.get("subtitle"),
    ctaLabel: formData.get("ctaLabel"),
    ctaHref: formData.get("ctaHref"),
  });

  const page = await prisma.page.findUnique({ where: { slug: "beranda" } });
  if (!page) return;

  await prisma.pageSection.upsert({
    where: { pageId_sectionKey: { pageId: page.id, sectionKey: "hero" } },
    update: {
      heading: data.heading,
      content: {
        subtitle: data.subtitle,
        ctaLabel: data.ctaLabel,
        ctaHref: data.ctaHref,
      },
      isVisible: true,
      sortOrder: 1,
    },
    create: {
      pageId: page.id,
      sectionKey: "hero",
      heading: data.heading,
      content: {
        subtitle: data.subtitle,
        ctaLabel: data.ctaLabel,
        ctaHref: data.ctaHref,
      },
      isVisible: true,
      sortOrder: 1,
    },
  });

  revalidateAll();
}

export async function updateBerandaWelcome(formData: FormData) {
  await ensureAdminAccess();

  const heading = String(formData.get("heading") || "").trim();
  const principalName = String(formData.get("principalName") || "").trim();
  const principalTitle = String(formData.get("principalTitle") || "").trim();
  const principalPhotoPublicId = String(formData.get("principalPhotoPublicId") || "").trim();
  const bodyRaw = String(formData.get("body") || "").trim();
  const body = bodyRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const page = await prisma.page.findUnique({ where: { slug: "beranda" } });
  if (!page) return;

  await prisma.pageSection.upsert({
    where: { pageId_sectionKey: { pageId: page.id, sectionKey: "welcome" } },
    update: {
      heading: heading || "Sambutan Kepala Sekolah",
      content: {
        principalName: principalName || "ASY'ARI S.Pd.SD",
        principalTitle: principalTitle || "Kepala UPT SDN Turi 2 Blitar",
        principalPhotoPublicId,
        body,
      },
      isVisible: true,
      sortOrder: 2,
    },
    create: {
      pageId: page.id,
      sectionKey: "welcome",
      heading: heading || "Sambutan Kepala Sekolah",
      content: {
        principalName: principalName || "ASY'ARI S.Pd.SD",
        principalTitle: principalTitle || "Kepala UPT SDN Turi 2 Blitar",
        principalPhotoPublicId,
        body,
      },
      isVisible: true,
      sortOrder: 2,
    },
  });

  revalidateAll();
}

async function ensureMediaAsset(publicIdRaw: string, altText: string, resourceType: "IMAGE" | "VIDEO") {
  const publicId = publicIdRaw.trim();
  if (!publicId) return null;

  return prisma.mediaAsset.upsert({
    where: { publicId },
    update: {
      altText: altText || undefined,
      resourceType,
    },
    create: {
      publicId,
      altText: altText || null,
      resourceType,
    },
  });
}

export async function createActivity(formData: FormData) {
  await ensureAdminAccess();

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const mediaPublicId = String(formData.get("mediaPublicId") || "").trim();
  const mediaType = String(formData.get("mediaType") || "IMAGE") === "VIDEO" ? "VIDEO" : "IMAGE";

  if (!title || !description) return;

  const activity = await prisma.activity.create({
    data: {
      title,
      slug: slugify(`${title}-${Date.now()}`, { lower: true, strict: true }),
      description,
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  if (mediaPublicId) {
    const media = await ensureMediaAsset(mediaPublicId, title, mediaType);
    if (media) {
      await prisma.activityMedia.create({
        data: {
          activityId: activity.id,
          mediaId: media.id,
        },
      });
    }
  }

  revalidateAll();
}

export async function deleteActivity(formData: FormData) {
  await ensureAdminAccess();

  const id = String(formData.get("id") || "").trim();
  if (!id) return;

  await prisma.activity.delete({ where: { id } });
  revalidateAll();
}

export async function updateActivity(formData: FormData) {
  await ensureAdminAccess();

  const id = String(formData.get("id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const mediaPublicId = String(formData.get("mediaPublicId") || "").trim();
  const mediaType = String(formData.get("mediaType") || "IMAGE") === "VIDEO" ? "VIDEO" : "IMAGE";

  if (!id || !title || !description) return;

  await prisma.activity.update({
    where: { id },
    data: {
      title,
      description,
    },
  });

  if (mediaPublicId) {
    const media = await ensureMediaAsset(mediaPublicId, title, mediaType);
    if (media) {
      await prisma.activityMedia.upsert({
        where: {
          activityId_mediaId: {
            activityId: id,
            mediaId: media.id,
          },
        },
        update: {},
        create: {
          activityId: id,
          mediaId: media.id,
        },
      });
    }
  }

  revalidateAll();
}

export async function deleteActivityMedia(formData: FormData) {
  await ensureAdminAccess();

  const activityMediaId = String(formData.get("activityMediaId") || "").trim();
  if (!activityMediaId) return;

  await prisma.activityMedia.deleteMany({
    where: { id: activityMediaId },
  });

  revalidateAll();
}

export async function createGalleryAlbum(formData: FormData) {
  await ensureAdminAccess();

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  if (!title) return;

  await prisma.galleryAlbum.create({
    data: {
      title,
      slug: slugify(`${title}-${Date.now()}`, { lower: true, strict: true }),
      description,
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  revalidateAll();
}

export async function createGalleryItem(formData: FormData) {
  await ensureAdminAccess();

  const albumId = String(formData.get("albumId") || "");
  const mediaPublicId = String(formData.get("mediaPublicId") || "").trim();
  const caption = String(formData.get("caption") || "").trim();
  const mediaType = String(formData.get("mediaType") || "IMAGE") === "VIDEO" ? "VIDEO" : "IMAGE";

  if (!albumId || !mediaPublicId) return;

  const media = await ensureMediaAsset(mediaPublicId, caption || "Gallery Item", mediaType);
  if (!media) return;

  await prisma.galleryItem.create({
    data: {
      albumId,
      mediaId: media.id,
      caption,
    },
  });

  revalidateAll();
}

export async function updatePpdb(formData: FormData) {
  await ensureAdminAccess();

  const periodYear = String(formData.get("periodYear") || "").trim();
  const requirements = String(formData.get("requirements") || "")
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);
  const flowSteps = String(formData.get("flowSteps") || "")
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);
  const notes = String(formData.get("notes") || "").trim();

  if (!periodYear) return;

  await prisma.ppdbInfo.updateMany({ data: { isActive: false } });
  await prisma.ppdbInfo.create({
    data: {
      periodYear,
      requirements,
      flowSteps,
      notes,
      isActive: true,
    },
  });

  revalidateAll();
}

export async function createPpdbGraduate(formData: FormData) {
  await ensureAdminAccess();

  const fullName = String(formData.get("fullName") || "").trim();
  const registrationNo = String(formData.get("registrationNo") || "").trim();
  const schoolOrigin = String(formData.get("schoolOrigin") || "").trim();
  const graduationYear = String(formData.get("graduationYear") || "").trim();
  const rankRaw = String(formData.get("rank") || "").trim();
  const isPublished = String(formData.get("isPublished") || "on") === "on";

  if (!fullName || !graduationYear) return;

  await prisma.ppdbGraduate.create({
    data: {
      fullName,
      registrationNo: registrationNo || null,
      schoolOrigin: schoolOrigin || null,
      graduationYear,
      rank: rankRaw ? Number(rankRaw) : null,
      isPublished,
    },
  });

  revalidateAll();
}

export async function updatePpdbGraduate(formData: FormData) {
  await ensureAdminAccess();

  const id = String(formData.get("id") || "").trim();
  const fullName = String(formData.get("fullName") || "").trim();
  const registrationNo = String(formData.get("registrationNo") || "").trim();
  const schoolOrigin = String(formData.get("schoolOrigin") || "").trim();
  const graduationYear = String(formData.get("graduationYear") || "").trim();
  const rankRaw = String(formData.get("rank") || "").trim();
  const isPublished = String(formData.get("isPublished") || "off") === "on";

  if (!id || !fullName || !graduationYear) return;

  await prisma.ppdbGraduate.update({
    where: { id },
    data: {
      fullName,
      registrationNo: registrationNo || null,
      schoolOrigin: schoolOrigin || null,
      graduationYear,
      rank: rankRaw ? Number(rankRaw) : null,
      isPublished,
    },
  });

  revalidateAll();
}

export async function deletePpdbGraduate(formData: FormData) {
  await ensureAdminAccess();

  const id = String(formData.get("id") || "").trim();
  if (!id) return;

  await prisma.ppdbGraduate.delete({ where: { id } });
  revalidateAll();
}

export async function updateContact(formData: FormData) {
  await ensureAdminAccess();

  const address = String(formData.get("address") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const googleMapsEmbedUrl = String(formData.get("googleMapsEmbedUrl") || "").trim();
  const instagram = String(formData.get("instagram") || "").trim();
  const facebook = String(formData.get("facebook") || "").trim();
  const youtube = String(formData.get("youtube") || "").trim();
  const tiktok = String(formData.get("tiktok") || "").trim();

  if (!address || !phone || !email) return;

  const current = await prisma.contactInfo.findFirst({ orderBy: { updatedAt: "desc" } });

  if (current) {
    await prisma.contactInfo.update({
      where: { id: current.id },
      data: {
        address,
        phone,
        email,
        googleMapsEmbedUrl,
        social: { instagram, facebook, youtube, tiktok },
      },
    });
  } else {
    await prisma.contactInfo.create({
      data: {
        address,
        phone,
        email,
        googleMapsEmbedUrl,
        social: { instagram, facebook, youtube, tiktok },
      },
    });
  }

  revalidateAll();
}

export async function registerMediaPublicId(formData: FormData) {
  await ensureAdminAccess();

  const input = String(formData.get("publicId") || "").trim();
  const altText = String(formData.get("altText") || "").trim();
  const selectedType = String(formData.get("mediaType") || "IMAGE") === "VIDEO" ? "VIDEO" : "IMAGE";

  if (!input) return;

  const parsedPublicId = input.includes("res.cloudinary.com")
    ? extractPublicIdFromCloudinaryUrl(input)
    : input;

  if (!parsedPublicId) return;

  await ensureMediaAsset(parsedPublicId, altText, selectedType);

  revalidateAll();
}

export async function uploadToCloudinary(formData: FormData) {
  await ensureAdminAccess();

  const file = formData.get("file") as File | null;
  if (!file) {
    return;
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  const upload = await cloudinary.uploader.upload(dataUri, {
    folder: "sdn-turi2",
    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    resource_type: "auto",
  });

  await prisma.mediaAsset.upsert({
    where: { publicId: upload.public_id },
    update: {
      resourceType: upload.resource_type === "video" ? "VIDEO" : "IMAGE",
      format: upload.format,
      width: upload.width,
      height: upload.height,
      bytes: upload.bytes,
      altText: file.name,
      folder: upload.folder,
    },
    create: {
      publicId: upload.public_id,
      resourceType: upload.resource_type === "video" ? "VIDEO" : "IMAGE",
      format: upload.format,
      width: upload.width,
      height: upload.height,
      bytes: upload.bytes,
      altText: file.name,
      folder: upload.folder,
    },
  });

  revalidateAll();
}

export async function replaceMediaAsset(formData: FormData) {
  await ensureAdminAccess();

  const mediaId = String(formData.get("mediaId") || "").trim();
  const file = formData.get("file") as File | null;
  if (!mediaId || !file) return;

  const current = await prisma.mediaAsset.findUnique({ where: { id: mediaId } });
  if (!current) return;

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  const upload = await cloudinary.uploader.upload(dataUri, {
    folder: current.folder || "sdn-turi2",
    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    resource_type: "auto",
  });

  await prisma.mediaAsset.update({
    where: { id: mediaId },
    data: {
      publicId: upload.public_id,
      resourceType: upload.resource_type === "video" ? "VIDEO" : "IMAGE",
      format: upload.format,
      width: upload.width,
      height: upload.height,
      bytes: upload.bytes,
      altText: file.name,
      folder: upload.folder,
    },
  });

  await destroyCloudinaryAsset(
    current.publicId,
    current.resourceType === "VIDEO" ? "video" : "image",
  );

  revalidateAll();
}

export async function deleteMediaAsset(formData: FormData) {
  await ensureAdminAccess();

  const mediaId = String(formData.get("mediaId") || "").trim();
  if (!mediaId) return;

  const media = await prisma.mediaAsset.findUnique({ where: { id: mediaId } });
  if (!media) return;

  await prisma.mediaAsset.delete({ where: { id: mediaId } });

  await destroyCloudinaryAsset(
    media.publicId,
    media.resourceType === "VIDEO" ? "video" : "image",
  );

  revalidateAll();
}

export async function createStaffMember(formData: FormData) {
  await ensureAdminAccess();

  const name = String(formData.get("name") || "").trim();
  const position = String(formData.get("position") || "").trim();
  const category = String(formData.get("category") || "TEACHER");
  const bio = String(formData.get("bio") || "").trim();
  const photoPublicId = String(formData.get("photoPublicId") || "").trim();
  const sortOrder = Number(String(formData.get("sortOrder") || "0")) || 0;

  if (!name || !position) return;

  const photo = photoPublicId
    ? await ensureMediaAsset(photoPublicId, `${name} - ${position}`, "IMAGE")
    : null;

  await prisma.staffMember.create({
    data: {
      name,
      position,
      category: ["PRINCIPAL", "TEACHER", "STAFF"].includes(category) ? category as "PRINCIPAL" | "TEACHER" | "STAFF" : "TEACHER",
      bio: bio || null,
      photoMediaId: photo?.id || null,
      sortOrder,
      isActive: true,
    },
  });

  revalidateAll();
}

export async function updateStaffMember(formData: FormData) {
  await ensureAdminAccess();

  const id = String(formData.get("id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const position = String(formData.get("position") || "").trim();
  const category = String(formData.get("category") || "TEACHER");
  const bio = String(formData.get("bio") || "").trim();
  const photoPublicId = String(formData.get("photoPublicId") || "").trim();
  const sortOrder = Number(String(formData.get("sortOrder") || "0")) || 0;
  const isActive = String(formData.get("isActive") || "off") === "on";

  if (!id || !name || !position) return;

  const photo = photoPublicId
    ? await ensureMediaAsset(photoPublicId, `${name} - ${position}`, "IMAGE")
    : null;

  await prisma.staffMember.update({
    where: { id },
    data: {
      name,
      position,
      category: ["PRINCIPAL", "TEACHER", "STAFF"].includes(category) ? category as "PRINCIPAL" | "TEACHER" | "STAFF" : "TEACHER",
      bio: bio || null,
      photoMediaId: photo?.id || null,
      sortOrder,
      isActive,
    },
  });

  revalidateAll();
}

export async function deleteStaffMember(formData: FormData) {
  await ensureAdminAccess();

  const id = String(formData.get("id") || "").trim();
  if (!id) return;

  await prisma.staffMember.delete({ where: { id } });
  revalidateAll();
}

export async function createFacility(formData: FormData) {
  await ensureAdminAccess();

  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const thumbnailPublicId = String(formData.get("thumbnailPublicId") || "").trim();
  const sortOrder = Number(String(formData.get("sortOrder") || "0")) || 0;

  if (!name || !description) return;

  const thumbnail = thumbnailPublicId
    ? await ensureMediaAsset(thumbnailPublicId, name, "IMAGE")
    : null;

  await prisma.facility.create({
    data: {
      name,
      description,
      thumbnailMediaId: thumbnail?.id || null,
      sortOrder,
      isActive: true,
    },
  });

  revalidateAll();
}

export async function updateFacility(formData: FormData) {
  await ensureAdminAccess();

  const id = String(formData.get("id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const thumbnailPublicId = String(formData.get("thumbnailPublicId") || "").trim();
  const sortOrder = Number(String(formData.get("sortOrder") || "0")) || 0;
  const isActive = String(formData.get("isActive") || "off") === "on";

  if (!id || !name || !description) return;

  const thumbnail = thumbnailPublicId
    ? await ensureMediaAsset(thumbnailPublicId, name, "IMAGE")
    : null;

  await prisma.facility.update({
    where: { id },
    data: {
      name,
      description,
      thumbnailMediaId: thumbnail?.id || null,
      sortOrder,
      isActive,
    },
  });

  revalidateAll();
}

export async function deleteFacility(formData: FormData) {
  await ensureAdminAccess();

  const id = String(formData.get("id") || "").trim();
  if (!id) return;

  await prisma.facility.delete({ where: { id } });
  revalidateAll();
}

export async function updateSiteIdentity(formData: FormData) {
  await ensureAdminAccess();

  const schoolName = String(formData.get("schoolName") || "").trim();
  const shortName = String(formData.get("shortName") || "").trim();
  const tagline = String(formData.get("tagline") || "").trim();
  const logoPublicId = String(formData.get("logoPublicId") || "").trim();

  if (!schoolName) return;

  await prisma.siteSetting.upsert({
    where: { key: "identity" },
    update: {
      value: {
        schoolName,
        shortName: shortName || schoolName,
        tagline,
        logoPublicId,
      },
    },
    create: {
      key: "identity",
      value: {
        schoolName,
        shortName: shortName || schoolName,
        tagline,
        logoPublicId,
      },
    },
  });

  revalidateAll();
}

export async function updateSiteFooter(formData: FormData) {
  await ensureAdminAccess();

  const copyright = String(formData.get("copyright") || "").trim();
  const footerDescription = String(formData.get("footerDescription") || "").trim();

  await prisma.siteSetting.upsert({
    where: { key: "footer" },
    update: {
      value: {
        copyright,
        footerDescription,
      },
    },
    create: {
      key: "footer",
      value: {
        copyright,
        footerDescription,
      },
    },
  });

  revalidateAll();
}

export async function updateSiteSocial(formData: FormData) {
  await ensureAdminAccess();

  const instagram = String(formData.get("instagram") || "").trim();
  const facebook = String(formData.get("facebook") || "").trim();
  const youtube = String(formData.get("youtube") || "").trim();
  const tiktok = String(formData.get("tiktok") || "").trim();

  await prisma.siteSetting.upsert({
    where: { key: "social" },
    update: {
      value: {
        instagram,
        facebook,
        youtube,
        tiktok,
      },
    },
    create: {
      key: "social",
      value: {
        instagram,
        facebook,
        youtube,
        tiktok,
      },
    },
  });

  revalidateAll();
}

export async function createOrUpdatePageMeta(formData: FormData) {
  await ensureAdminAccess();

  const pageId = String(formData.get("pageId") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const metaTitle = String(formData.get("metaTitle") || "").trim();
  const metaDescription = String(formData.get("metaDescription") || "").trim();
  const status = String(formData.get("status") || "PUBLISHED");

  if (!slug || !title) return;

  const payload = {
    slug,
    title,
    metaTitle: metaTitle || null,
    metaDescription: metaDescription || null,
    status: status === "DRAFT" ? "DRAFT" : "PUBLISHED",
    publishedAt: status === "PUBLISHED" ? new Date() : null,
  } as const;

  if (pageId) {
    await prisma.page.update({
      where: { id: pageId },
      data: payload,
    });
  } else {
    await prisma.page.upsert({
      where: { slug },
      update: payload,
      create: payload,
    });
  }

  revalidateAll();
}

export async function createOrUpdatePageSection(formData: FormData) {
  await ensureAdminAccess();

  const pageId = String(formData.get("pageId") || "").trim();
  const sectionId = String(formData.get("sectionId") || "").trim();
  const sectionKey = String(formData.get("sectionKey") || "").trim();
  const heading = String(formData.get("heading") || "").trim();
  const contentRaw = String(formData.get("contentJson") || "").trim();
  const sortOrder = Number(String(formData.get("sortOrder") || "0")) || 0;
  const isVisible = String(formData.get("isVisible") || "off") === "on";

  if (!pageId || !sectionKey) return;

  let content: unknown = {};
  if (contentRaw) {
    try {
      content = JSON.parse(contentRaw);
    } catch {
      throw new Error("INVALID_JSON");
    }
  }

  if (sectionId) {
    await prisma.pageSection.update({
      where: { id: sectionId },
      data: {
        sectionKey,
        heading: heading || null,
        content: content as never,
        sortOrder,
        isVisible,
      },
    });
  } else {
    await prisma.pageSection.upsert({
      where: { pageId_sectionKey: { pageId, sectionKey } },
      update: {
        heading: heading || null,
        content: content as never,
        sortOrder,
        isVisible,
      },
      create: {
        pageId,
        sectionKey,
        heading: heading || null,
        content: content as never,
        sortOrder,
        isVisible,
      },
    });
  }

  revalidateAll();
}

export async function deletePageSection(formData: FormData) {
  await ensureAdminAccess();

  const id = String(formData.get("id") || "").trim();
  if (!id) return;

  await prisma.pageSection.delete({ where: { id } });
  revalidateAll();
}

export async function createUser(formData: FormData) {
  await ensureSuperAdminAccess();

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const role = String(formData.get("role") || "ADMIN");
  const passwordRaw = String(formData.get("password") || "").trim();

  if (!name || !email || !passwordRaw) return;

  const password = await bcrypt.hash(passwordRaw, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password,
      role: role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN",
      isActive: true,
    },
  });

  revalidateAll();
}

export async function updateUser(formData: FormData) {
  await ensureSuperAdminAccess();

  const id = String(formData.get("id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const role = String(formData.get("role") || "ADMIN");
  const isActive = String(formData.get("isActive") || "off") === "on";
  const newPassword = String(formData.get("newPassword") || "").trim();

  if (!id || !name || !email) return;

  const data: {
    name: string;
    email: string;
    role: "SUPER_ADMIN" | "ADMIN";
    isActive: boolean;
    password?: string;
  } = {
    name,
    email,
    role: role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN",
    isActive,
  };

  if (newPassword) {
    data.password = await bcrypt.hash(newPassword, 10);
  }

  await prisma.user.update({
    where: { id },
    data,
  });

  revalidateAll();
}

export async function deleteUser(formData: FormData) {
  const session = await ensureSuperAdminAccess();

  const id = String(formData.get("id") || "").trim();
  if (!id) return;

  if (session.user.id === id) {
    throw new Error("SELF_DELETE_NOT_ALLOWED");
  }

  await prisma.user.delete({ where: { id } });
  revalidateAll();
}

export async function unlockRateLimit(formData: FormData) {
  await ensureSuperAdminAccess();

  const id = String(formData.get("id") || "").trim();
  if (!id) return;

  await prisma.loginRateLimit.update({
    where: { id },
    data: {
      failedCount: 0,
      firstFailedAt: null,
      lockedUntil: null,
    },
  });

  revalidateAll();
}

export async function resetAllRateLimits() {
  await ensureSuperAdminAccess();

  await prisma.loginRateLimit.updateMany({
    data: {
      failedCount: 0,
      firstFailedAt: null,
      lockedUntil: null,
    },
  });

  revalidateAll();
}
