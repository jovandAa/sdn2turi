import { getProfileSetting } from "@/lib/cms";

export const revalidate = 60;

export default async function ProfilPage() {
  const profil = await getProfileSetting();

  return (
    <div className="space-y-6">
      <section className="hero">
        <h1>Profil Sekolah</h1>
        <p>Informasi utama SDN Turi 2 Blitar, visi pendidikan, dan data sekolah.</p>
      </section>

      <section className="section">
        <p className="text-sm leading-relaxed text-zinc-600">{profil.overview}</p>
      </section>

      <section className="grid grid-3">
        <article className="section">
          <h2 className="text-xl font-semibold">Visi</h2>
          <p className="mt-2 text-sm text-zinc-600">{profil.vision}</p>
        </article>
        <article className="section">
          <h2 className="text-xl font-semibold">Jumlah Siswa</h2>
          <p className="mt-2 text-3xl font-bold">{profil.students}</p>
        </article>
        <article className="section">
          <h2 className="text-xl font-semibold">Jumlah Guru</h2>
          <p className="mt-2 text-3xl font-bold">{profil.teachers}</p>
        </article>
      </section>
    </div>
  );
}
