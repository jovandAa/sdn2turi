import { prisma } from "@/lib/prisma";

const schoolProfileFallback = {
  schoolName: "UPT Satuan Pendidikan SDN Turi 2",
  status: "Negeri",
  level: "Sekolah Dasar (SD)",
  accreditation: "A",
  accreditationSk: "200/BAP-S/M/SK/X/2016",
  accreditationDate: "25 Oktober 2016",
  curriculum: "Kurikulum Merdeka",
  address: "Jl. Turi, Kecamatan Sukorejo, Kota Blitar, Jawa Timur",
  profileParagraph1:
    "UPT Satuan Pendidikan SDN Turi 2 merupakan salah satu sekolah jenjang SD berstatus Negeri yang berada di wilayah Kec. Sukorejo, Kota Blitar, Jawa Timur. UPT Satuan Pendidikan SDN Turi 2 didirikan pada tanggal 17 April 1973 dengan Nomor SK Pendirian Inpres No. 10 yang berada dalam naungan Kementerian Pendidikan dan Kebudayaan.",
  profileParagraph2:
    "Dalam kegiatan pembelajaran, sekolah yang memiliki 240 siswa ini dibimbing oleh 13 guru yang profesional di bidangnya. Kepala Sekolah UPT Satuan Pendidikan SDN Turi 2 saat ini adalah ASY'ARI S.Pd.SD. Operator yang bertanggung jawab adalah Wibatsu Karebet Yoseph.",
  profileParagraph3:
    "Dengan adanya keberadaan UPT Satuan Pendidikan SDN Turi 2, diharapkan dapat memberikan kontribusi dalam mencerdaskan anak bangsa di wilayah Kec. Sukorejo, Kota Blitar.",
  vision:
    "Mewujudkan peserta didik yang berkarakter unggul dalam prestasi, kreatif, mandiri, komunikatif berlandaskan iman dan taqwa",
  missions: [
    "Optimalisasi pengembangan aspek kecerdasan, spiritual, intelektual, emosional, dan kepekaan sosial secara sinergis dalam mewujudkan profil pelajar Pancasila melalui kegiatan kurikuler, ekstrakurikuler dan kokurikuler.",
    "Mewujudkan pembelajaran aktif, kreatif, efektif, menyenangkan dengan pendekatan kontekstual (CTL), bervariatif sehingga dapat meningkatkan prestasi belajar siswa yang berprofil pelajar Pancasila.",
    "Meningkatkan kualitas Pendidikan dengan mengembangkan kompetensi pendidik dan tenaga kependidikan untuk mendukung terciptanya profil pelajar Pancasila melalui kegiatan pengembangan diri.",
    "Mewujudkan sarana, prasarana Pendidikan, media pembelajaran, dan lingkungan pembelajaran yang kondusif dan representative guna mendukung terciptanya profil pelajar Pancasila.",
    "Mewujudkan budaya hidup sehat, cinta dan berbudaya lingkungan.",
    "Mengoptimalkan peran serta orangtua dan masyarakat untuk mendukung kemajuan Pendidikan dalam mewujudkan profil pelajar Pancasila, melalui pemberdayaan komite sekolah, dan paguyuban kelas.",
  ],
  studentSummary:
    "Pada saat artikel ini ditulis, UPT Satuan Pendidikan SDN Turi 2 memiliki total 210 siswa dan siswi yang tersebar di 6 kelas dari tingkat 1 hingga tingkat 6.",
  aboutParagraph1:
    "UPT Satuan Pendidikan SDN Turi 2 adalah sekolah dasar negeri di Kecamatan Sukorejo, Kota Blitar. Sekolah ini berkomitmen membangun peserta didik yang cerdas, berkarakter, dan berdaya saing.",
  aboutParagraph2:
    "Pembelajaran dilaksanakan dengan pendekatan aktif, kreatif, dan menyenangkan melalui dukungan guru profesional serta sarana belajar yang memadai.",
  aboutParagraph3:
    "Selain akademik, sekolah juga mengembangkan potensi siswa melalui berbagai kegiatan ekstrakurikuler dan pembinaan karakter.",
  principalName: "ASY'ARI, S.Pd.SD",
  principalTitle: "Kepala Sekolah",
  principalPhotoPublicId: "",
} as const;

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
      history?: string;
      vision?: string;
      mission?: string[];
      students?: number;
      teachers?: number;
    }) || {
      overview: "Profil belum diisi.",
      history:
        "UPT Satuan Pendidikan SDN Turi 2 merupakan sekolah dasar negeri di Kecamatan Sukorejo, Kota Blitar, Jawa Timur. Sekolah ini berdiri pada 17 April 1973 berdasarkan SK Inpres No. 10 dan terus berkomitmen memberikan layanan pendidikan dasar yang berkualitas.",
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

export async function getClassPhotoGalleries() {
  const setting = await prisma.siteSetting.findUnique({ where: { key: "class-photos" } });
  return (setting?.value as Record<string, unknown>) || {};
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

export async function getSchoolProfileContent() {
  const content = await prisma.schoolProfileContent.findUnique({
    where: { key: "main" },
  });

  if (!content) {
    return schoolProfileFallback;
  }

  const missionsRaw = Array.isArray(content.missions) ? content.missions : [];
  const missions = missionsRaw.map((item) => String(item)).filter(Boolean);

  return {
    schoolName: content.schoolName,
    status: content.status,
    level: content.level,
    accreditation: content.accreditation,
    accreditationSk: content.accreditationSk || "",
    accreditationDate: content.accreditationDate || "",
    curriculum: content.curriculum,
    address: content.address,
    profileParagraph1: content.profileParagraph1,
    profileParagraph2: content.profileParagraph2,
    profileParagraph3: content.profileParagraph3,
    vision: content.vision,
    missions,
    studentSummary: content.studentSummary,
    aboutParagraph1: content.aboutParagraph1,
    aboutParagraph2: content.aboutParagraph2,
    aboutParagraph3: content.aboutParagraph3,
    principalName: content.principalName,
    principalTitle: content.principalTitle,
    principalPhotoPublicId: content.principalPhotoPublicId || "",
  };
}
