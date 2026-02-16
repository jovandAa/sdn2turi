import { prisma } from "@/lib/prisma";

export async function getIdentity() {
  const setting = await prisma.siteSetting.findUnique({ where: { key: "identity" } });
  return (
    (setting?.value as {
      schoolName?: string;
      shortName?: string;
      logoPublicId?: string;
      tagline?: string;
    }) || {
      schoolName: "SDN Turi 2 Blitar",
      shortName: "SDN Turi 2",
      logoPublicId: "",
      tagline: "Membentuk Generasi Cerdas, Kreatif, dan Berakhlak Mulia",
    }
  );
}

export async function getBerandaSections() {
  const page = await prisma.page.findUnique({
    where: { slug: "beranda" },
    include: {
      sections: {
        where: { isVisible: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return page?.sections ?? [];
}

export async function getProfileSetting() {
  const setting = await prisma.siteSetting.findUnique({ where: { key: "profil" } });
  return (
    (setting?.value as {
      overview?: string;
      vision?: string;
      mission?: string[];
      students?: number;
      teachers?: number;
    }) || {
      overview: "Profil belum diisi.",
      vision: "",
      mission: [],
      students: 0,
      teachers: 0,
    }
  );
}

export async function getStaff() {
  return prisma.staffMember.findMany({
    where: { isActive: true },
    include: { photo: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getFacilities() {
  return prisma.facility.findMany({
    where: { isActive: true },
    include: { thumbnail: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getActivities() {
  return prisma.activity.findMany({
    where: { status: "PUBLISHED" },
    include: {
      media: {
        include: { media: true },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getGallery() {
  return prisma.galleryAlbum.findMany({
    where: { status: "PUBLISHED" },
    include: {
      cover: true,
      items: {
        include: { media: true },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getPpdb() {
  return prisma.ppdbInfo.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPpdbGraduates(year?: string) {
  return prisma.ppdbGraduate.findMany({
    where: {
      isPublished: true,
      graduationYear: year || undefined,
    },
    orderBy: [{ graduationYear: "desc" }, { rank: "asc" }, { fullName: "asc" }],
  });
}

export async function getPpdbGraduateYears() {
  const years = await prisma.ppdbGraduate.findMany({
    distinct: ["graduationYear"],
    select: { graduationYear: true },
    orderBy: { graduationYear: "desc" },
  });

  return years.map((y) => y.graduationYear);
}

export async function getContactInfo() {
  return prisma.contactInfo.findFirst({ orderBy: { updatedAt: "desc" } });
}

export async function getMediaAssets() {
  return prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
}
