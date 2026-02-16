import Link from "next/link";
import { HeroAnimator } from "@/components/hero-animator";
import { getActivities, getBerandaSections, getContactInfo } from "@/lib/cms";
import { getCloudinaryDeliveryUrl } from "@/lib/media";

export const revalidate = 60;

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

  return (
    <div className="space-y-8">
      <HeroAnimator>
        <section className="hero overflow-hidden">
          <p className="hero-animate text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Website Resmi SDN Turi 2 Blitar</p>
          <h1 className="hero-animate mt-5">{hero?.heading || "Membentuk Generasi Cerdas, Kreatif, dan Berakhlak Mulia"}</h1>
          <p className="hero-animate">{heroContent.subtitle || "Informasi sekolah, kegiatan siswa, PPDB, dan layanan pendidikan dalam satu tempat."}</p>
          <div className="hero-animate mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href={heroContent.ctaHref || "/tentang"} className="btn-primary min-w-48">{heroContent.ctaLabel || "Pelajari Lebih Lanjut"}</Link>
            <Link href="/informasi/ppdb" className="btn-outline min-w-48">Lihat PPDB</Link>
          </div>
        </section>
      </HeroAnimator>

      <section className="section">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="flex flex-col items-center rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
            <div className="relative h-[18rem] w-[14rem] overflow-hidden rounded-[2rem] border-[10px] border-white shadow-md ring-1 ring-zinc-200">
              <img className="h-full w-full object-cover" src={principalPhotoUrl} alt={welcomeContent.principalName || "Kepala Sekolah"} />
            </div>
            <p className="mt-4 text-center text-base font-semibold text-zinc-900">{welcomeContent.principalName || "ASY'ARI S.Pd.SD"}</p>
            <p className="text-center text-xs text-zinc-500">{welcomeContent.principalTitle || "Kepala UPT SDN Turi 2 Blitar"}</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{welcome?.heading || "Sambutan Kepala Sekolah"}</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-zinc-600">
              {(welcomeContent.body || []).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Sekilas Kegiatan</h2>
          <Link href="/informasi/kegiatan" className="btn-outline">Lihat Semua</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {activities.slice(0, 3).map((activity) => (
            <article key={activity.id} className="card rounded-2xl">
              <p className="badge">Kegiatan</p>
              <h3 className="mt-3 text-lg font-semibold">{activity.title}</h3>
              <p className="mt-2 text-sm text-zinc-500">{activity.description}</p>
            </article>
          ))}
        </div>
      </section>

      {contact ? (
        <section className="grid gap-4 md:grid-cols-3">
          <article className="section p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Alamat</p>
            <p className="mt-2 text-sm text-zinc-700">{contact.address}</p>
          </article>
          <article className="section p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Telepon</p>
            <p className="mt-2 text-sm text-zinc-700">{contact.phone}</p>
          </article>
          <article className="section p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Email</p>
            <p className="mt-2 text-sm text-zinc-700">{contact.email}</p>
          </article>
        </section>
      ) : null}
    </div>
  );
}
