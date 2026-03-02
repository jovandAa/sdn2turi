import { updateSchoolProfileContent } from "@/app/(admin)/admin/actions";
import { getSchoolProfileContent } from "@/lib/cms";

function missionsToTextarea(missions: string[] | unknown) {
  if (!Array.isArray(missions)) return "";
  return missions.map((m) => String(m)).filter(Boolean).join("\n");
}

export default async function AdminProfilTentangPage() {
  const profil = await getSchoolProfileContent();
  const missionsText = missionsToTextarea(profil.missions);

  return (
    <article className="section space-y-4">
      <header>
        <h3 className="text-lg font-semibold">Profil &amp; Tentang</h3>
        <p className="mt-1 text-sm text-slate-600">Konten untuk halaman publik: /profil dan /tentang.</p>
      </header>

      <form action={updateSchoolProfileContent} className="grid gap-5">
        <section className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h4 className="text-base font-semibold text-slate-900">Data Sekolah</h4>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label>
              Nama Sekolah
              <input name="schoolName" defaultValue={profil.schoolName || ""} required />
            </label>
            <label>
              Status
              <input name="status" defaultValue={profil.status || ""} required />
            </label>
            <label>
              Jenjang
              <input name="level" defaultValue={profil.level || ""} required />
            </label>
            <label>
              Kurikulum
              <input name="curriculum" defaultValue={profil.curriculum || ""} required />
            </label>
            <label>
              Akreditasi
              <input name="accreditation" defaultValue={profil.accreditation || ""} required />
            </label>
            <label>
              No SK Akreditasi (opsional)
              <input name="accreditationSk" defaultValue={profil.accreditationSk || ""} />
            </label>
            <label>
              Tanggal Akreditasi (opsional)
              <input name="accreditationDate" defaultValue={profil.accreditationDate || ""} />
            </label>
            <label className="md:col-span-2">
              Alamat
              <input name="address" defaultValue={profil.address || ""} required />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h4 className="text-base font-semibold text-slate-900">Profil (Halaman /profil)</h4>
          <div className="mt-4 grid gap-3">
            <label>
              Paragraf 1
              <textarea name="profileParagraph1" defaultValue={profil.profileParagraph1 || ""} required />
            </label>
            <label>
              Paragraf 2
              <textarea name="profileParagraph2" defaultValue={profil.profileParagraph2 || ""} required />
            </label>
            <label>
              Paragraf 3
              <textarea name="profileParagraph3" defaultValue={profil.profileParagraph3 || ""} required />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h4 className="text-base font-semibold text-slate-900">Visi, Misi, Ringkasan</h4>
          <div className="mt-4 grid gap-3">
            <label>
              Visi
              <textarea name="vision" defaultValue={profil.vision || ""} required />
            </label>
            <label>
              Misi (1 baris = 1 poin)
              <textarea name="missions" defaultValue={missionsText} />
            </label>
            <label>
              Ringkasan Peserta Didik
              <textarea name="studentSummary" defaultValue={profil.studentSummary || ""} required />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h4 className="text-base font-semibold text-slate-900">Tentang (Halaman /tentang)</h4>
          <div className="mt-4 grid gap-3">
            <label>
              Paragraf 1
              <textarea name="aboutParagraph1" defaultValue={profil.aboutParagraph1 || ""} required />
            </label>
            <label>
              Paragraf 2
              <textarea name="aboutParagraph2" defaultValue={profil.aboutParagraph2 || ""} required />
            </label>
            <label>
              Paragraf 3
              <textarea name="aboutParagraph3" defaultValue={profil.aboutParagraph3 || ""} required />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h4 className="text-base font-semibold text-slate-900">Kepala Sekolah</h4>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label>
              Nama Kepala Sekolah
              <input name="principalName" defaultValue={profil.principalName || ""} required />
            </label>
            <label>
              Jabatan Kepala Sekolah
              <input name="principalTitle" defaultValue={profil.principalTitle || ""} required />
            </label>
            <input type="hidden" name="principalPhotoPublicId" value={profil.principalPhotoPublicId || ""} />
          </div>
        </section>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary w-fit">Update</button>
        </div>
      </form>
    </article>
  );
}
