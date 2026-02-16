import { getProfileSetting } from "@/lib/cms";

export const revalidate = 60;

export default async function TentangPage() {
  const profil = await getProfileSetting();

  return (
    <div className="space-y-6">
      <section className="hero">
        <h1>Tentang SDN Turi 2</h1>
        <p>Komitmen sekolah untuk menciptakan pembelajaran aktif, aman, dan berkarakter.</p>
      </section>

      <section className="section">
        <h2 className="text-xl font-semibold">Gambaran Umum</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600">{profil.overview}</p>
      </section>

      <section className="section">
        <h2 className="text-xl font-semibold">Misi Sekolah</h2>
        <ul className="mt-3 list-disc space-y-2 text-sm leading-relaxed text-zinc-600">
          {(profil.mission || []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
