import { PrismaClient, PublishStatus, StaffCategory, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
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
};

const prisma = new PrismaClient();
const mediaMapPath = path.join(process.cwd(), "prisma", "media-upload-map.json");

const uploadedMap: Record<string, UploadMapItem> = (() => {
  if (!fs.existsSync(mediaMapPath)) return {};
  try {
    const parsed = JSON.parse(fs.readFileSync(mediaMapPath, "utf8")) as UploadMapItem[];
    return Object.fromEntries(parsed.map((item) => [item.fileName, item]));
  } catch {
    return {};
  }
})();

function buildSeedPublicId(fileName: string) {
  const ext = path.extname(fileName).replace(".", "").toLowerCase();
  const base = path.basename(fileName, path.extname(fileName));
  const safe = slugify(base, { lower: true, strict: true }) || `file-${Date.now()}`;
  return `sdn-turi2/seed/${safe}-${ext}`;
}

async function upsertMediaFromLocal(fileName: string, altText: string, fallbackType: "IMAGE" | "VIDEO" = "IMAGE") {
  const mapped = uploadedMap[fileName];
  const publicId = mapped?.publicId || buildSeedPublicId(fileName);

  return prisma.mediaAsset.upsert({
    where: { publicId },
    update: {
      resourceType: mapped?.resourceType || fallbackType,
      format: mapped?.format || null,
      width: mapped?.width || null,
      height: mapped?.height || null,
      bytes: mapped?.bytes || null,
      altText,
      folder: mapped?.folder || `seed-fallback/${fileName}`,
    },
    create: {
      publicId,
      resourceType: mapped?.resourceType || fallbackType,
      format: mapped?.format || null,
      width: mapped?.width || null,
      height: mapped?.height || null,
      bytes: mapped?.bytes || null,
      altText,
      folder: mapped?.folder || `seed-fallback/${fileName}`,
    },
  });
}

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
  const password = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: "admin@sdnturi2.sch.id" },
    update: { password, role: UserRole.SUPER_ADMIN, isActive: true },
    create: {
      name: "Super Admin SDN Turi 2",
      email: "admin@sdnturi2.sch.id",
      password,
      role: UserRole.SUPER_ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "operator@sdnturi2.sch.id" },
    update: { password, role: UserRole.ADMIN, isActive: true },
    create: {
      name: "Admin Konten SDN Turi 2",
      email: "operator@sdnturi2.sch.id",
      password,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  const logo = await upsertMediaFromLocal("logo-sd.png", "Logo SDN Turi 2");
  const principalPhoto = await upsertMediaFromLocal("ASY'ARI.jpg", "Kepala Sekolah");

  const facilityMedia = await Promise.all([
    upsertMediaFromLocal("RuangKelas5.jpeg", "Ruang Kelas"),
    upsertMediaFromLocal("PerpusDalam_1.jpeg", "Perpustakaan"),
    upsertMediaFromLocal("LAB.jpeg", "Laboratorium"),
    upsertMediaFromLocal("MusholaDalam.jpeg", "Mushola"),
    upsertMediaFromLocal("UKS.jpeg", "UKS"),
    upsertMediaFromLocal("Kantin.jpeg", "Kantin"),
    upsertMediaFromLocal("AulaDalam_1.jpeg", "Aula Serbaguna"),
  ]);

  const activityMediaFiles = [
    "rebana.jpeg",
    "Rebana1.jpeg",
    "angklung.jpg",
    "seni-lukis.jpg",
    "Tari.jpeg",
    "karawitan.jpeg",
    "pramuka1.jpg",
    "pramuka2.jpeg",
  ];

  const activityMediaAssets = await Promise.all(
    activityMediaFiles.map((fileName) => upsertMediaFromLocal(fileName, "Dokumentasi kegiatan")),
  );

  const galleryMediaFiles = [
    "upacara.jpg",
    "seni-lukis.jpg",
    "pramuka1.jpg",
    "lapangan.jpeg",
    "prestasi1.jpg",
    "senam.jpg",
  ];

  const galleryMedia = await Promise.all(
    galleryMediaFiles.map((fileName) => upsertMediaFromLocal(fileName, "Galeri SDN Turi 2")),
  );

  await prisma.page.upsert({
    where: { slug: "beranda" },
    update: {
      title: "Beranda",
      metaTitle: "SDN Turi 2 Blitar - Beranda",
      metaDescription: "Website resmi SDN Turi 2 Blitar",
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
    },
    create: {
      slug: "beranda",
      title: "Beranda",
      metaTitle: "SDN Turi 2 Blitar - Beranda",
      metaDescription: "Website resmi SDN Turi 2 Blitar",
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  });

  const defaultPages = [
    { slug: "profil", title: "Profil Sekolah" },
    { slug: "tentang", title: "Tentang Sekolah" },
    { slug: "tenaga-kependidikan", title: "Tenaga Kependidikan" },
    { slug: "fasilitas-prasarana", title: "Fasilitas Prasarana" },
    { slug: "informasi-kegiatan", title: "Informasi Kegiatan" },
    { slug: "informasi-galeri", title: "Informasi Galeri" },
    { slug: "informasi-ppdb", title: "Informasi PPDB" },
    { slug: "kontak", title: "Kontak Sekolah" },
    { slug: "alamat", title: "Alamat Sekolah" },
  ];

  for (const page of defaultPages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        metaTitle: `${page.title} - SDN Turi 2 Blitar`,
        metaDescription: `Halaman ${page.title} SDN Turi 2 Blitar`,
        status: PublishStatus.PUBLISHED,
        publishedAt: new Date(),
      },
      create: {
        slug: page.slug,
        title: page.title,
        metaTitle: `${page.title} - SDN Turi 2 Blitar`,
        metaDescription: `Halaman ${page.title} SDN Turi 2 Blitar`,
        status: PublishStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });
  }

  const berandaPage = await prisma.page.findUniqueOrThrow({ where: { slug: "beranda" } });

  await prisma.pageSection.upsert({
    where: { pageId_sectionKey: { pageId: berandaPage.id, sectionKey: "hero" } },
    update: {
      heading: "Selamat Datang di SDN Turi 2 Blitar",
      content: {
        subtitle: "Membentuk Generasi Cerdas, Kreatif, dan Berakhlak Mulia",
        ctaLabel: "Pelajari Lebih Lanjut",
        ctaHref: "/tentang",
      },
      sortOrder: 1,
      isVisible: true,
    },
    create: {
      pageId: berandaPage.id,
      sectionKey: "hero",
      heading: "Selamat Datang di SDN Turi 2 Blitar",
      content: {
        subtitle: "Membentuk Generasi Cerdas, Kreatif, dan Berakhlak Mulia",
        ctaLabel: "Pelajari Lebih Lanjut",
        ctaHref: "/tentang",
      },
      sortOrder: 1,
      isVisible: true,
    },
  });

  await prisma.pageSection.upsert({
    where: { pageId_sectionKey: { pageId: berandaPage.id, sectionKey: "welcome" } },
    update: {
      heading: "Sambutan Kepala Sekolah",
      content: {
        principalName: "ASY'ARI S.Pd.SD",
        principalTitle: "Kepala UPT SDN Turi 2 Blitar",
        principalPhotoPublicId: principalPhoto.publicId,
        body: [
          "Website ini kami hadirkan sebagai sarana informasi profil sekolah, kegiatan siswa, prestasi, dan layanan pendidikan.",
          "Kami berkomitmen menciptakan lingkungan belajar aman, nyaman, dan menyenangkan untuk mendukung perkembangan optimal setiap siswa.",
          "Terima kasih kepada seluruh guru, tenaga kependidikan, komite sekolah, dan orang tua atas dukungannya.",
        ],
      },
      sortOrder: 2,
      isVisible: true,
    },
    create: {
      pageId: berandaPage.id,
      sectionKey: "welcome",
      heading: "Sambutan Kepala Sekolah",
      content: {
        principalName: "ASY'ARI S.Pd.SD",
        principalTitle: "Kepala UPT SDN Turi 2 Blitar",
        principalPhotoPublicId: principalPhoto.publicId,
        body: [
          "Website ini kami hadirkan sebagai sarana informasi profil sekolah, kegiatan siswa, prestasi, dan layanan pendidikan.",
          "Kami berkomitmen menciptakan lingkungan belajar aman, nyaman, dan menyenangkan untuk mendukung perkembangan optimal setiap siswa.",
          "Terima kasih kepada seluruh guru, tenaga kependidikan, komite sekolah, dan orang tua atas dukungannya.",
        ],
      },
      sortOrder: 2,
      isVisible: true,
    },
  });

  await prisma.siteSetting.upsert({
    where: { key: "identity" },
    update: {
      value: {
        schoolName: "SDN Turi 2 Blitar",
        shortName: "SDN Turi 2",
        logoPublicId: logo.publicId,
        tagline: "Membentuk Generasi Cerdas, Kreatif, dan Berakhlak Mulia",
      },
    },
    create: {
      key: "identity",
      value: {
        schoolName: "SDN Turi 2 Blitar",
        shortName: "SDN Turi 2",
        logoPublicId: logo.publicId,
        tagline: "Membentuk Generasi Cerdas, Kreatif, dan Berakhlak Mulia",
      },
    },
  });

  await prisma.siteSetting.upsert({
    where: { key: "profil" },
    update: {
      value: {
        overview:
          "SDN Turi 2 Blitar adalah sekolah dasar negeri dengan fokus penguatan karakter, akademik, dan kreativitas peserta didik.",
        vision:
          "Mewujudkan peserta didik yang berkarakter unggul dalam prestasi, kreatif, mandiri, komunikatif berlandaskan iman dan taqwa.",
        mission: [
          "Optimalisasi pengembangan kecerdasan spiritual, intelektual, emosional, dan sosial.",
          "Mewujudkan pembelajaran aktif, kreatif, efektif, dan menyenangkan.",
          "Meningkatkan kompetensi pendidik dan tenaga kependidikan.",
        ],
        students: 240,
        teachers: 13,
      },
    },
    create: {
      key: "profil",
      value: {
        overview:
          "SDN Turi 2 Blitar adalah sekolah dasar negeri dengan fokus penguatan karakter, akademik, dan kreativitas peserta didik.",
        vision:
          "Mewujudkan peserta didik yang berkarakter unggul dalam prestasi, kreatif, mandiri, komunikatif berlandaskan iman dan taqwa.",
        mission: [
          "Optimalisasi pengembangan kecerdasan spiritual, intelektual, emosional, dan sosial.",
          "Mewujudkan pembelajaran aktif, kreatif, efektif, dan menyenangkan.",
          "Meningkatkan kompetensi pendidik dan tenaga kependidikan.",
        ],
        students: 240,
        teachers: 13,
      },
    },
  });

  await prisma.siteSetting.upsert({
    where: { key: "footer" },
    update: {
      value: {
        footerDescription: "Website resmi SDN Turi 2 Blitar",
        copyright: "Copyright 2026 - Website resmi sekolah.",
      },
    },
    create: {
      key: "footer",
      value: {
        footerDescription: "Website resmi SDN Turi 2 Blitar",
        copyright: "Copyright 2026 - Website resmi sekolah.",
      },
    },
  });

  await prisma.siteSetting.upsert({
    where: { key: "social" },
    update: {
      value: {
        instagram: "https://instagram.com",
        facebook: "https://facebook.com",
        youtube: "https://youtube.com",
        tiktok: "",
      },
    },
    create: {
      key: "social",
      value: {
        instagram: "https://instagram.com",
        facebook: "https://facebook.com",
        youtube: "https://youtube.com",
        tiktok: "",
      },
    },
  });

  await prisma.staffMember.deleteMany();
  await prisma.staffMember.createMany({
    data: [
      {
        name: "ASY'ARI S.Pd.SD",
        position: "Kepala Sekolah",
        category: StaffCategory.PRINCIPAL,
        photoMediaId: principalPhoto.id,
        sortOrder: 1,
      },
      { name: "Guru Kelas 1", position: "Wali Kelas", category: StaffCategory.TEACHER, sortOrder: 2 },
      { name: "Guru Kelas 2", position: "Wali Kelas", category: StaffCategory.TEACHER, sortOrder: 3 },
      { name: "Guru Kelas 3", position: "Wali Kelas", category: StaffCategory.TEACHER, sortOrder: 4 },
      { name: "Guru Kelas 4", position: "Wali Kelas", category: StaffCategory.TEACHER, sortOrder: 5 },
      { name: "Guru Kelas 5", position: "Wali Kelas", category: StaffCategory.TEACHER, sortOrder: 6 },
      { name: "Guru Kelas 6", position: "Wali Kelas", category: StaffCategory.TEACHER, sortOrder: 7 },
      { name: "Tenaga Administrasi", position: "Staf TU", category: StaffCategory.STAFF, sortOrder: 8 },
      { name: "Pustakawan", position: "Staf Perpustakaan", category: StaffCategory.STAFF, sortOrder: 9 },
      { name: "Penjaga Sekolah", position: "Staf Sarpras", category: StaffCategory.STAFF, sortOrder: 10 },
    ],
  });

  const facilityNames = [
    "Ruang Kelas",
    "Perpustakaan",
    "Laboratorium",
    "Mushola",
    "Ruang UKS",
    "Kantin Sehat",
    "Aula Serbaguna",
  ];

  await prisma.facility.deleteMany();
  for (const [index, name] of facilityNames.entries()) {
    await prisma.facility.create({
      data: {
        name,
        description: `Fasilitas ${name} untuk mendukung pembelajaran siswa.`,
        thumbnailMediaId: facilityMedia[index]?.id,
        sortOrder: index + 1,
      },
    });
  }

  await prisma.activityMedia.deleteMany();
  await prisma.activity.deleteMany();

  const activityNames = ["Sholawat/Rebana", "Seni Musik", "Seni Lukis", "Tari", "Karawitan", "Pramuka"];

  for (const [index, title] of activityNames.entries()) {
    const activity = await prisma.activity.create({
      data: {
        title,
        slug: slugify(title, { lower: true, strict: true }),
        description: `Kegiatan ekstrakurikuler ${title} di SDN Turi 2 Blitar.`,
        isFeatured: index < 3,
        status: PublishStatus.PUBLISHED,
        publishedAt: new Date(),
        sortOrder: index + 1,
      },
    });

    const first = activityMediaAssets[index] || activityMediaAssets[0];
    const second = activityMediaAssets[index + 1] || activityMediaAssets[1];

    await prisma.activityMedia.createMany({
      data: [
        { activityId: activity.id, mediaId: first.id, sortOrder: 1 },
        { activityId: activity.id, mediaId: second.id, sortOrder: 2 },
      ],
      skipDuplicates: true,
    });
  }

  await prisma.galleryItem.deleteMany();
  await prisma.galleryAlbum.deleteMany();

  const album = await prisma.galleryAlbum.create({
    data: {
      title: "Dokumentasi Terbaru",
      slug: "dokumentasi-terbaru",
      description: "Dokumentasi kegiatan, fasilitas, dan momen siswa",
      coverMediaId: galleryMedia[0]?.id,
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  });

  await prisma.galleryItem.createMany({
    data: galleryMedia.map((media, index) => ({
      albumId: album.id,
      mediaId: media.id,
      caption: [
        "Upacara Bendera",
        "Kelas Seni Lukis",
        "Kegiatan Pramuka",
        "Lapangan Olahraga",
        "Prestasi Siswa",
        "Senam Pagi",
      ][index],
      sortOrder: index + 1,
    })),
  });

  await prisma.ppdbInfo.deleteMany();
  await prisma.ppdbInfo.create({
    data: {
      periodYear: "2026/2027",
      requirements: [
        "Fotokopi Akta Kelahiran",
        "Fotokopi Kartu Keluarga",
        "Pas foto 3x4 (2 lembar)",
        "Usia minimal sesuai ketentuan PPDB",
      ],
      flowSteps: [
        "Ambil formulir pendaftaran",
        "Serahkan berkas persyaratan",
        "Seleksi administrasi",
        "Pengumuman hasil",
      ],
      notes: "Informasi lengkap dapat menghubungi kontak resmi sekolah.",
      isActive: true,
    },
  });

  await prisma.ppdbGraduate.deleteMany();
  await prisma.ppdbGraduate.createMany({
    data: [
      {
        fullName: "Aisyah Nabila Putri",
        registrationNo: "PPDB-26001",
        schoolOrigin: "TK Melati",
        graduationYear: "2026/2027",
        rank: 1,
        isPublished: true,
      },
      {
        fullName: "Rafa Alghifari",
        registrationNo: "PPDB-26002",
        schoolOrigin: "RA Al Hidayah",
        graduationYear: "2026/2027",
        rank: 2,
        isPublished: true,
      },
      {
        fullName: "Nayla Safitri",
        registrationNo: "PPDB-25013",
        schoolOrigin: "TK Pertiwi",
        graduationYear: "2025/2026",
        rank: 1,
        isPublished: true,
      },
    ],
  });

  await prisma.contactInfo.deleteMany();
  await prisma.contactInfo.create({
    data: {
      address: "Jl. Turi, Kec. Sukorejo, Kota Blitar",
      phone: "(0342) 000000",
      email: "sdnturi2@example.sch.id",
      googleMapsEmbedUrl: "https://www.google.com/maps?q=SDN+Turi+2+Blitar&output=embed",
      social: {
        instagram: "https://instagram.com",
        facebook: "https://facebook.com",
        youtube: "https://youtube.com",
      },
    },
  });

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
