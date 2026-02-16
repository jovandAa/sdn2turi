import { getContactInfo } from "@/lib/cms";

export const revalidate = 60;

export default async function KontakPage() {
  const contact = await getContactInfo();
  const social = (contact?.social as { instagram?: string; facebook?: string; youtube?: string } | null) || {};

  return (
    <div className="space-y-6">
      <section className="hero">
        <h1>Hubungi Kami</h1>
        <p>Silakan hubungi sekolah untuk informasi akademik, administrasi, maupun PPDB.</p>
      </section>

      <section className="grid grid-3">
        <article className="section">
          <h3 className="text-lg font-semibold">Email</h3>
          <p className="mt-2 text-sm text-zinc-600">{contact?.email}</p>
        </article>
        <article className="section">
          <h3 className="text-lg font-semibold">Telepon</h3>
          <p className="mt-2 text-sm text-zinc-600">{contact?.phone}</p>
        </article>
        <article className="section">
          <h3 className="text-lg font-semibold">Media Sosial</h3>
          <p className="mt-2 text-sm text-zinc-600">Instagram: {social.instagram || "-"}</p>
          <p className="text-sm text-zinc-600">Facebook: {social.facebook || "-"}</p>
          <p className="text-sm text-zinc-600">YouTube: {social.youtube || "-"}</p>
        </article>
      </section>
    </div>
  );
}
