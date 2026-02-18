import { getSchoolProfileContent } from "@/lib/cms";

export const revalidate = 60;

export default async function ProfilPage() {
  const profil = await getSchoolProfileContent();
  const missions = [...(profil.missions || [])].slice(0, 6);

  return (
    <div className="space-y-8">
      <section className="hero">
        <h1>Profil Sekolah</h1>
        <p>Profil, Visi Misi, dan Data Sekolah</p>
      </section>

      <section className="section space-y-6">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-extrabold text-slate-800">Profil Sekolah</h2>
          <div className="mt-5 space-y-4 text-justify text-sm leading-7 text-slate-600 md:text-base">
            <p>{profil.profileParagraph1}</p>
            <p>{profil.profileParagraph2}</p>
            <p>{profil.profileParagraph3}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-center text-3xl font-extrabold text-slate-800">Visi &amp; Misi</h2>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-[#f9fbfd] p-7 text-center">
            <h3 className="text-sm font-extrabold tracking-[0.2em] text-indigo-500">VISI SEKOLAH</h3>
            <p className="mt-4 text-xl font-bold italic leading-relaxed text-slate-800 md:text-2xl">&quot;{profil.vision}&quot;</p>
          </div>

          <div className="mt-8">
            <h3 className="border-b-2 border-slate-200 pb-2 text-xl font-bold text-violet-700">MISI SEKOLAH</h3>
            <ol className="mt-4 space-y-3 pl-0 text-sm leading-7 text-slate-600 md:text-base">
              {missions.map((item, index) => (
                <li key={`${index}-${item}`} className="flex gap-3 text-justify">
                  <span className="font-bold text-violet-700">{index + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl bg-white p-7 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-800">Akreditasi &amp; Sertifikasi</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
              Sekolah ini telah terakreditasi <strong>{profil.accreditation}</strong>
              {profil.accreditationSk ? <> dengan Nomor SK Akreditasi <strong>{profil.accreditationSk}</strong></> : null}
              {profil.accreditationDate ? <> pada tanggal {profil.accreditationDate}</> : null}.
            </p>
          </article>

          <article className="rounded-2xl bg-white p-7 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-800">Peserta Didik</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">{profil.studentSummary}</p>
          </article>
        </div>
      </section>
    </div>
  );
}
