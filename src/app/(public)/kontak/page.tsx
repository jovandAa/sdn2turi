import { getContactInfo } from "@/lib/cms";
import { Instagram, Music2, Youtube } from "lucide-react";

export const revalidate = 60;

export default async function KontakPage() {
  const contact = await getContactInfo();
  const social = (contact?.social as { instagram?: string; facebook?: string; youtube?: string; tiktok?: string } | null) || {};
  const instagramUrl = social.instagram || "https://www.instagram.com/sdn2turi_blitar?igsh=MXIyeDdpc3RkN3YwYw==";
  const youtubeUrl = social.youtube || "https://youtube.com/@sdn2turi?si=4_c6Q3LEQ8asto-k";
  const tiktokUrl = social.tiktok || "";

  return (
    <div className="space-y-6">
      <section className="hero">
        <h1>Hubungi Kami</h1>
        <p>Informasi kontak, alamat, dan peta SDN Turi 2 Blitar.</p>
      </section>

      <section className="grid grid-3">
        <article className="section">
          <h3 className="text-lg font-semibold">Email</h3>
          <p className="mt-2 text-sm text-zinc-600">{contact?.email || "-"}</p>
        </article>
        <article className="section">
          <h3 className="text-lg font-semibold">Telepon</h3>
          <p className="mt-2 text-sm text-zinc-600">{contact?.phone || "-"}</p>
        </article>
        <article className="section">
          <h3 className="text-lg font-semibold">Media Sosial</h3>
          <div className="mt-3 space-y-3">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl bg-gradient-to-r from-slate-100 to-slate-50 px-4 py-3 shadow-sm transition hover:shadow-md"
            >
              <span className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700">Ikuti Kami</span>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-orange-400 text-white shadow-[0_0_20px_rgba(236,72,153,0.45)]">
                <Instagram className="h-7 w-7" />
              </span>
            </a>

            <a
              href={youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl bg-gradient-to-r from-slate-100 to-slate-50 px-4 py-3 shadow-sm transition hover:shadow-md"
            >
              <span className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700">Youtube Sekolah</span>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.45)]">
                <Youtube className="h-7 w-7" />
              </span>
            </a>

            {tiktokUrl ? (
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl bg-gradient-to-r from-slate-100 to-slate-50 px-4 py-3 shadow-sm transition hover:shadow-md"
              >
                <span className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700">TikTok Sekolah</span>
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-[0_0_20px_rgba(0,0,0,0.45)]">
                  <Music2 className="h-7 w-7" />
                </span>
              </a>
            ) : null}
          </div>
        </article>
      </section>

      <section className="section space-y-4">
        <h2 className="text-2xl font-semibold">Alamat Sekolah</h2>
        <p className="text-sm text-zinc-600">{contact?.address || "-"}</p>
        {contact?.googleMapsEmbedUrl ? (
          <iframe
            title="Lokasi SDN Turi 2"
            src={contact.googleMapsEmbedUrl}
            className="h-[420px] w-full rounded-2xl border border-zinc-200"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : null}
      </section>
    </div>
  );
}
