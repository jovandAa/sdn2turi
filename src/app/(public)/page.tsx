import Link from "next/link";
import { HeroAnimator } from "@/components/hero-animator";
import { getActivities, getBerandaSections, getContactInfo } from "@/lib/cms";
import { getCloudinaryDeliveryUrl } from "@/lib/media";

export const revalidate = 60;

const featureItems = [
  {
    icon: "GURU",
    title: "Guru Berkualitas",
    description: "Tenaga pengajar profesional dan berpengalaman.",
  },
  {
    icon: "KURIKULUM",
    title: "Kurikulum Lengkap",
    description: "Kurikulum nasional dengan pengembangan karakter.",
  },
  {
    icon: "FASILITAS",
    title: "Fasilitas Memadai",
    description: "Ruang kelas nyaman, perpustakaan, dan lab komputer.",
  },
  {
    icon: "EKSKUL",
    title: "Ekstrakurikuler",
    description: "Berbagai pilihan kegiatan bakat dan minat.",
  },
];

const defaultWelcomeBody = [
  "Website ini kami hadirkan sebagai sarana untuk memberikan informasi mengenai profil sekolah, program kerja, kegiatan siswa, prestasi, serta berbagai layanan pendidikan yang kami selenggarakan.",
  "SDN Turi 2 Blitar berkomitmen untuk memberikan layanan pendidikan yang berkualitas, membentuk peserta didik yang berakhlak mulia, berprestasi, serta memiliki karakter yang kuat sesuai nilai-nilai luhur bangsa.",
  "Kami menyampaikan terima kasih kepada seluruh guru, tenaga kependidikan, komite sekolah, orang tua/wali murid, serta semua pihak yang telah memberikan dukungan demi kemajuan sekolah.",
];

const activityIcons = ["MUSIK", "SENI", "AGAMA"];

export default async function HomePage() {
  const sections = await getBerandaSections();
  const hero = sections.find((s) => s.sectionKey === "hero");
  const welcome = sections.find((s) => s.sectionKey === "welcome");
  const heroContent = (hero?.content as { subtitle?: string; ctaLabel?: string; ctaHref?: string }) || {};
  const welcomeContent =
    (welcome?.content as {
      principalName?: string;
      principalTitle?: string;
      principalPhotoPublicId?: string;
      body?: string[];
    }) || {};

  const principalPhotoUrl = welcomeContent.principalPhotoPublicId
    ? getCloudinaryDeliveryUrl(welcomeContent.principalPhotoPublicId, "IMAGE")
    : "/media/ASY'ARI.jpg";

  const activities = await getActivities();
  const contact = await getContactInfo();
  const welcomeParagraphs = welcomeContent.body?.length ? welcomeContent.body : defaultWelcomeBody;

  return (
    <div className="space-y-10">
      <HeroAnimator>
        <section className="hero">
          <p className="hero-animate text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">Website Resmi SDN 2 Turi Blitar</p>
          <h1 className="hero-animate mt-5">{hero?.heading || "Selamat Datang di SDN Turi 2 Blitar"}</h1>
          <p className="hero-animate">
            {heroContent.subtitle || "Membentuk Generasi Cerdas, Kreatif, dan Berakhlak Mulia"}
          </p>
          <div className="hero-animate mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href={heroContent.ctaHref || "/tentang"} className="btn-primary min-w-52">
              {heroContent.ctaLabel || "Pelajari Lebih Lanjut"}
            </Link>
            <Link href="/informasi/ppdb" className="btn-outline min-w-52">
              Lihat PPDB
            </Link>
          </div>
        </section>
      </HeroAnimator>

      <section className="section bg-white/95">
        <h2 className="text-center text-3xl font-extrabold text-slate-800">Mengapa Memilih Kami?</h2>
        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featureItems.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-indigo-100 bg-white p-6 text-center shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold tracking-wider text-indigo-600">{item.icon}</span>
              <h3 className="mt-3 text-xl font-bold text-slate-800">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-[#f9fbfd] px-4 py-12 md:px-7">
        <div className="relative mx-auto max-w-4xl rounded-3xl border-2 border-[#4cd6c6] bg-white px-5 pb-8 pt-24 shadow-[0_10px_30px_rgba(76,214,198,0.12)] md:px-10 md:pt-24">
          <div className="absolute -top-14 left-1/2 h-28 w-28 -translate-x-1/2 overflow-hidden rounded-full border-4 border-[#4cd6c6] bg-white p-1 shadow-md md:h-36 md:w-36">
            <img className="h-full w-full rounded-full object-cover" src={principalPhotoUrl} alt={welcomeContent.principalName || "Kepala Sekolah"} />
          </div>

          <h2 className="text-center text-3xl font-extrabold text-slate-800">{welcome?.heading || "Sambutan Kepala Sekolah"}</h2>
          <div className="mt-5 space-y-4 text-justify text-sm leading-7 text-slate-600 md:text-base">
            <p className="font-semibold">Assalamu&apos;alaikum Warahmatullahi Wabarakatuh.</p>
            {welcomeParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="font-semibold">Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh.</p>
          </div>

          <hr className="my-6 border-slate-200" />
          <div className="text-left">
            <h4 className="text-xl font-bold text-slate-800">{welcomeContent.principalName || "ASY'ARI S.Pd.SD"}</h4>
            <p className="text-sm text-slate-500">{welcomeContent.principalTitle || "Kepala UPT SDN Turi 2 Blitar"}</p>
          </div>
        </div>
      </section>

      <section className="section bg-white/95">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-3xl font-extrabold text-slate-800">Sekilas Kegiatan</h2>
          <Link href="/informasi/kegiatan" className="btn-outline">
            Lihat Semua Kegiatan
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {activities.slice(0, 3).map((activity, index) => (
            <article
              key={activity.id}
              className="rounded-3xl border border-indigo-100 bg-white p-6 text-center shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold tracking-wider text-indigo-600">{activityIcons[index] || "KEGIATAN"}</p>
              <h3 className="mt-3 text-xl font-bold text-slate-800">{activity.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{activity.description}</p>
            </article>
          ))}
        </div>
      </section>

      {contact ? (
        <section className="section bg-white/95">
          <h2 className="text-center text-3xl font-extrabold text-slate-800">Hubungi Kami</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <article className="rounded-3xl border border-indigo-100 bg-white p-6 text-center shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <p className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold tracking-wider text-indigo-600">ALAMAT</p>
              <h3 className="mt-3 text-lg font-bold text-slate-800">Alamat</h3>
              <p className="mt-2 text-sm text-slate-600">{contact.address}</p>
            </article>
            <article className="rounded-3xl border border-indigo-100 bg-white p-6 text-center shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <p className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold tracking-wider text-indigo-600">TELEPON</p>
              <h3 className="mt-3 text-lg font-bold text-slate-800">Telepon</h3>
              <p className="mt-2 text-sm text-slate-600">{contact.phone}</p>
            </article>
            <article className="rounded-3xl border border-indigo-100 bg-white p-6 text-center shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <p className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold tracking-wider text-indigo-600">EMAIL</p>
              <h3 className="mt-3 text-lg font-bold text-slate-800">Email</h3>
              <p className="mt-2 text-sm text-slate-600">{contact.email}</p>
            </article>
          </div>
        </section>
      ) : null}
    </div>
  );
}
