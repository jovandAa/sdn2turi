import { getSchoolProfileContent } from "@/lib/cms";
import { getCloudinaryDeliveryUrl } from "@/lib/media";

export const revalidate = 60;

export default async function TentangPage() {
  const profil = await getSchoolProfileContent();
  const principalPhotoUrl = profil.principalPhotoPublicId
    ? getCloudinaryDeliveryUrl(profil.principalPhotoPublicId, "IMAGE")
    : "/media/ASY'ARI.jpg";

  return (
    <div className="space-y-8">
      <section className="hero">
        <h1>Tentang SDN Turi 2</h1>
        <p>Informasi umum UPT Satuan Pendidikan SDN Turi 2</p>
      </section>

      <section className="section space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800">Gambaran Umum</h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600 md:text-base">
              <p>{profil.aboutParagraph1}</p>
              <p>{profil.aboutParagraph2}</p>
              <p>{profil.aboutParagraph3}</p>
            </div>
          </article>

          <aside className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <img src={principalPhotoUrl} alt="Kepala Sekolah" className="mx-auto mb-4 w-full max-w-[280px] rounded-xl object-cover" />
            <h3 className="text-xl font-bold text-slate-800">{profil.principalName}</h3>
            <p className="mt-1 font-bold text-indigo-500">{profil.principalTitle}</p>
          </aside>
        </div>

        <div>
          <h2 className="text-center text-3xl font-extrabold text-slate-800">Identitas Lembaga</h2>
          <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm md:text-base">
                <tbody>
                  <tr>
                    <td className="w-[38%] border-b border-slate-200 px-2 py-3 font-bold text-slate-800">Nama Sekolah</td>
                    <td className="border-b border-slate-200 px-2 py-3 text-slate-600">{profil.schoolName}</td>
                  </tr>
                  <tr>
                    <td className="w-[38%] border-b border-slate-200 px-2 py-3 font-bold text-slate-800">Status</td>
                    <td className="border-b border-slate-200 px-2 py-3 text-slate-600">{profil.status}</td>
                  </tr>
                  <tr>
                    <td className="w-[38%] border-b border-slate-200 px-2 py-3 font-bold text-slate-800">Jenjang</td>
                    <td className="border-b border-slate-200 px-2 py-3 text-slate-600">{profil.level}</td>
                  </tr>
                  <tr>
                    <td className="w-[38%] border-b border-slate-200 px-2 py-3 font-bold text-slate-800">Akreditasi</td>
                    <td className="border-b border-slate-200 px-2 py-3 text-slate-600">{profil.accreditation}</td>
                  </tr>
                  <tr>
                    <td className="w-[38%] border-b border-slate-200 px-2 py-3 font-bold text-slate-800">Kurikulum</td>
                    <td className="border-b border-slate-200 px-2 py-3 text-slate-600">{profil.curriculum}</td>
                  </tr>
                  <tr>
                    <td className="w-[38%] border-b border-slate-200 px-2 py-3 font-bold text-slate-800">Alamat</td>
                    <td className="border-b border-slate-200 px-2 py-3 text-slate-600">{profil.address}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
