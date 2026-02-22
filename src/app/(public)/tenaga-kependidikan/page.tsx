import { getClassPhotoGalleries, getStaff } from "@/lib/cms";
import { getCloudinaryDeliveryUrl, getMediaUrl } from "@/lib/media";
import { ClassPhotoSlider } from "@/components/class-photo-slider";

export const revalidate = 60;

const classGalleryFallback: Record<string, string[]> = {
  "1": ["/media/PanoKelas.jpeg", "/media/RuangPano.jpeg", "/media/SD.jpg"],
  "2": ["/media/PanoKelas.jpeg", "/media/RuangKelas5.jpeg", "/media/Kelas5Luar.jpeg"],
  "3": ["/media/RuangPano.jpeg", "/media/PanoKelas.jpeg", "/media/SD.jpg"],
  "4": ["/media/Kelas5Luar.jpeg", "/media/RuangKelas5.jpeg", "/media/PanoKelas.jpeg"],
  "5": ["/media/RuangKelas5.jpeg", "/media/Kelas5Luar.jpeg", "/media/PanoKelas.jpeg"],
  "6": ["/media/SD.jpg", "/media/RuangPano.jpeg", "/media/PanoKelas.jpeg"],
};

function resolveImageValue(raw: string) {
  const value = String(raw || "").trim();
  if (!value) return "";
  if (value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://")) return value;
  return getCloudinaryDeliveryUrl(value, "IMAGE") || value;
}

function resolveClassGallery(label: string, galleries: Record<string, unknown>, staffId?: string) {
  const match = label.match(/\d+/);
  const classNo = match?.[0] || "";

  const staffRaw = staffId ? galleries[staffId] : undefined;
  const staffGallery = Array.isArray(staffRaw) ? staffRaw.map((item) => resolveImageValue(String(item))) : [];
  const staffResolved = staffGallery.filter(Boolean);
  if (staffResolved.length) return staffResolved;

  const fromSettingRaw = galleries[classNo];
  const fromSetting = Array.isArray(fromSettingRaw) ? fromSettingRaw.map((item) => resolveImageValue(String(item))) : [];
  const fallback = (classGalleryFallback[classNo] || ["/media/PanoKelas.jpeg"]).map(resolveImageValue);

  const resolved = fromSetting.filter(Boolean);
  return resolved.length ? resolved : fallback;
}

export default async function StaffPage() {
  const [staff, classPhotoSetting] = await Promise.all([getStaff(), getClassPhotoGalleries()]);

  const principal = staff.find((item) => item.category === "PRINCIPAL") || staff[0] || null;
  const teachers = staff.filter((item) => item.category === "TEACHER");
  const supportStaff = staff.filter((item) => item.category === "STAFF");

  const principalPhotoUrl = principal ? getMediaUrl(principal.photo) : "";

  return (
    <div className="space-y-8">
      <section className="hero">
        <h1>Guru dan Staf</h1>
        <p>Tenaga pendidik dan kependidikan yang mendukung proses belajar siswa.</p>
      </section>

      {principal ? (
        <section className="section">
          <h2 className="text-center text-3xl font-extrabold text-slate-800">Kepala Sekolah</h2>
          <div className="mt-6 flex justify-center">
            <article className="w-full max-w-md rounded-3xl border-t-4 border-amber-400 bg-white p-6 text-center shadow-md">
              <div className="mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full border-4 border-white shadow-md ring-1 ring-slate-200">
                {principalPhotoUrl ? (
                  <img className="h-full w-full object-cover" src={principalPhotoUrl} alt={principal.name} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-500">Tanpa Foto</div>
                )}
              </div>
              <p className="badge">Pimpinan</p>
              <h3 className="mt-3 text-xl font-bold text-slate-800">{principal.name}</h3>
              <p className="text-sm text-slate-600">{principal.position}</p>
            </article>
          </div>
        </section>
      ) : null}

      <section className="section">
        <h2 className="text-center text-3xl font-extrabold text-slate-800">Guru Kelas</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="w-[140px] px-4 py-3 text-left font-semibold text-slate-600">No</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Nama Guru</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Jabatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {teachers.map((item, index) => {
                const classGallery = resolveClassGallery(`${item.name} ${item.position}`, classPhotoSetting, item.id);
                return (
                  <tr key={item.id}>
                    <td className="px-4 py-3 align-top text-slate-700">
                      <div className="space-y-2">
                        <p className="font-semibold">{index + 1}</p>
                        <ClassPhotoSlider images={classGallery} label={item.name} />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                    <td className="px-4 py-3 text-slate-600">{item.position}</td>
                  </tr>
                );
              })}
              {!teachers.length ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-slate-500">Belum ada data guru kelas.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2 className="text-center text-3xl font-extrabold text-slate-800">Tenaga Kependidikan (Staf)</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {supportStaff.map((item) => {
            const photoUrl = getMediaUrl(item.photo);
            return (
              <article key={item.id} className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
                {photoUrl ? <img className="page-media h-48" src={photoUrl} alt={item.name} /> : <div className="page-media h-48 bg-zinc-100" />}
                <h3 className="mt-3 text-lg font-semibold text-slate-800">{item.name}</h3>
                <p className="text-sm text-slate-600">{item.position}</p>
                {item.bio ? <p className="mt-2 text-sm text-slate-600">{item.bio}</p> : null}
              </article>
            );
          })}
          {!supportStaff.length ? <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">Belum ada data staf.</div> : null}
        </div>
      </section>
    </div>
  );
}
