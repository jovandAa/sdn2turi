import { getBerandaSections } from "@/lib/cms";
import { updateBerandaHero, updateBerandaWelcome } from "@/app/(admin)/admin/actions";
import { PublicIdUploadField } from "@/components/admin/public-id-upload-field";

export default async function AdminBerandaPage() {
  const sections = await getBerandaSections();
  const hero = sections.find((s) => s.sectionKey === "hero");
  const heroContent = (hero?.content as { subtitle?: string; ctaLabel?: string; ctaHref?: string }) || {};

  const welcome = sections.find((s) => s.sectionKey === "welcome");
  const welcomeContent =
    (welcome?.content as {
      principalName?: string;
      principalTitle?: string;
      principalPhotoPublicId?: string;
      body?: string[];
    }) || {};

  return (
    <div className="space-y-5">
      <article className="section">
        <h3 className="text-lg font-semibold">Edit Hero Beranda</h3>
        <form action={updateBerandaHero} className="mt-4">
          <label>
            Heading
            <input name="heading" defaultValue={hero?.heading || "Selamat Datang di SDN Turi 2 Blitar"} required />
          </label>
          <label>
            Subtitle
            <textarea name="subtitle" defaultValue={heroContent.subtitle || ""} required />
          </label>
          <label>
            Label Tombol
            <input name="ctaLabel" defaultValue={heroContent.ctaLabel || "Pelajari Lebih Lanjut"} required />
          </label>
          <label>
            Link Tombol
            <input name="ctaHref" defaultValue={heroContent.ctaHref || "/tentang"} required />
          </label>
          <button type="submit" className="btn-primary w-fit">Simpan Hero</button>
        </form>
      </article>

      <article className="section">
        <h3 className="text-lg font-semibold">Edit Sambutan Kepala Sekolah</h3>
        <form action={updateBerandaWelcome} className="mt-4">
          <label>
            Judul Section
            <input name="heading" defaultValue={welcome?.heading || "Sambutan Kepala Sekolah"} required />
          </label>
          <label>
            Nama Kepala Sekolah
            <input name="principalName" defaultValue={welcomeContent.principalName || "ASY'ARI S.Pd.SD"} required />
          </label>
          <label>
            Jabatan
            <input name="principalTitle" defaultValue={welcomeContent.principalTitle || "Kepala UPT SDN Turi 2 Blitar"} required />
          </label>

          <PublicIdUploadField
            name="principalPhotoPublicId"
            label="Public ID Foto Kepala Sekolah"
            defaultValue={welcomeContent.principalPhotoPublicId || ""}
          />

          <label>
            Isi Sambutan (1 paragraf per baris)
            <textarea name="body" defaultValue={(welcomeContent.body || []).join("\n")} rows={6} />
          </label>
          <button type="submit" className="btn-primary w-fit">Simpan Sambutan</button>
        </form>
      </article>
    </div>
  );
}
