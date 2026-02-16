import { updateSiteFooter, updateSiteIdentity, updateSiteSocial } from "@/app/(admin)/admin/actions";
import { PublicIdUploadField } from "@/components/admin/public-id-upload-field";
import { prisma } from "@/lib/prisma";

export default async function AdminSettingsPage() {
  const [identitySetting, footerSetting, socialSetting] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { key: "identity" } }),
    prisma.siteSetting.findUnique({ where: { key: "footer" } }),
    prisma.siteSetting.findUnique({ where: { key: "social" } }),
  ]);

  const identity = (identitySetting?.value as {
    schoolName?: string;
    shortName?: string;
    tagline?: string;
    logoPublicId?: string;
  }) || {};

  const footer = (footerSetting?.value as {
    copyright?: string;
    footerDescription?: string;
  }) || {};

  const social = (socialSetting?.value as {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
  }) || {};

  return (
    <div className="space-y-6">
      <section className="section">
        <h3 className="text-lg font-semibold">Identity Sekolah</h3>
        <form action={updateSiteIdentity} className="mt-4 grid gap-3 md:grid-cols-2">
          <label>
            Nama Sekolah
            <input name="schoolName" defaultValue={identity.schoolName || ""} required />
          </label>
          <label>
            Nama Pendek
            <input name="shortName" defaultValue={identity.shortName || ""} />
          </label>
          <label className="md:col-span-2">
            Tagline
            <input name="tagline" defaultValue={identity.tagline || ""} />
          </label>
          <div className="md:col-span-2">
            <PublicIdUploadField
              name="logoPublicId"
              label="Public ID Logo"
              defaultValue={identity.logoPublicId || ""}
            />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="btn-primary w-fit">Simpan Identity</button>
          </div>
        </form>
      </section>

      <section className="section">
        <h3 className="text-lg font-semibold">Footer Global</h3>
        <form action={updateSiteFooter} className="mt-4 grid gap-3">
          <label>
            Footer Description
            <textarea name="footerDescription" defaultValue={footer.footerDescription || ""} />
          </label>
          <label>
            Copyright
            <input name="copyright" defaultValue={footer.copyright || ""} />
          </label>
          <button type="submit" className="btn-outline w-fit">Simpan Footer</button>
        </form>
      </section>

      <section className="section">
        <h3 className="text-lg font-semibold">Sosial Media Global</h3>
        <form action={updateSiteSocial} className="mt-4 grid gap-3 md:grid-cols-2">
          <label>
            Instagram
            <input name="instagram" defaultValue={social.instagram || ""} />
          </label>
          <label>
            Facebook
            <input name="facebook" defaultValue={social.facebook || ""} />
          </label>
          <label>
            YouTube
            <input name="youtube" defaultValue={social.youtube || ""} />
          </label>
          <label>
            TikTok
            <input name="tiktok" defaultValue={social.tiktok || ""} />
          </label>
          <div className="md:col-span-2">
            <button type="submit" className="btn-outline w-fit">Simpan Sosial</button>
          </div>
        </form>
      </section>
    </div>
  );
}
