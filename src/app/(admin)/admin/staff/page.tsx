import { createStaffMember, deleteStaffMember, updateClassPhotos, updateStaffMember } from "@/app/(admin)/admin/actions";
import { PublicIdUploadField } from "@/components/admin/public-id-upload-field";
import { prisma } from "@/lib/prisma";

function readDefault(galleries: Record<string, unknown>, classNo: string, idx: number) {
  const raw = galleries[classNo];
  if (!Array.isArray(raw)) return "";
  return String(raw[idx] || "");
}

export default async function AdminStaffPage() {
  const [staff, classPhotoSetting] = await Promise.all([
    prisma.staffMember.findMany({
      include: { photo: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.siteSetting.findUnique({ where: { key: "class-photos" } }),
  ]);

  const galleries = (classPhotoSetting?.value as Record<string, unknown>) || {};

  return (
    <div className="space-y-6">
      <details className="section">
        <summary className="cursor-pointer select-none text-lg font-semibold">
          Foto Kelas (untuk halaman Guru &amp; Staf)
        </summary>
        <p className="mt-2 text-sm text-zinc-600">
          Isi dengan <span className="font-semibold">Public ID Cloudinary</span> (disarankan), URL Cloudinary, atau path file{" "}
          <span className="font-mono">/media/...</span>.
        </p>
        <form action={updateClassPhotos} className="mt-4 space-y-6">
          {["1", "2", "3", "4", "5", "6"].map((classNo) => (
            <div key={classNo} className="space-y-3">
              <h4 className="text-base font-semibold text-zinc-800">Kelas {classNo}</h4>
              <div className="grid gap-3 md:grid-cols-2">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <PublicIdUploadField
                    key={idx}
                    name={`class_${classNo}_${idx}`}
                    label={`Foto ${idx}`}
                    defaultValue={readDefault(galleries, classNo, idx - 1)}
                  />
                ))}
              </div>
            </div>
          ))}
          <button type="submit" className="btn-outline w-fit">Simpan Foto Kelas</button>
        </form>
      </details>

      <section className="section">
        <h3 className="text-lg font-semibold">Tambah Guru/Staf</h3>
        <form action={createStaffMember} className="mt-4 grid gap-3 md:grid-cols-2">
          <label>
            Nama
            <input name="name" required />
          </label>
          <label>
            Jabatan
            <input name="position" required />
          </label>
          <label>
            Kategori
            <select name="category" defaultValue="TEACHER">
              <option value="PRINCIPAL">PRINCIPAL</option>
              <option value="TEACHER">TEACHER</option>
              <option value="STAFF">STAFF</option>
            </select>
          </label>
          <label>
            Urutan
            <input type="number" name="sortOrder" defaultValue={0} />
          </label>
          <label className="md:col-span-2">
            Bio
            <textarea name="bio" />
          </label>
          <div className="md:col-span-2">
            <PublicIdUploadField name="photoPublicId" label="Public ID Foto" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="btn-primary w-fit">Tambah</button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Daftar Guru/Staf</h3>
        {staff.map((item) => (
          <article key={item.id} className="section">
            <form action={updateStaffMember} className="grid gap-3 md:grid-cols-2">
              <input type="hidden" name="id" value={item.id} />
              <label>
                Nama
                <input name="name" defaultValue={item.name} required />
              </label>
              <label>
                Jabatan
                <input name="position" defaultValue={item.position} required />
              </label>
              <label>
                Kategori
                <select name="category" defaultValue={item.category}>
                  <option value="PRINCIPAL">PRINCIPAL</option>
                  <option value="TEACHER">TEACHER</option>
                  <option value="STAFF">STAFF</option>
                </select>
              </label>
              <label>
                Urutan
                <input type="number" name="sortOrder" defaultValue={item.sortOrder} />
              </label>
              <label className="md:col-span-2">
                Bio
                <textarea name="bio" defaultValue={item.bio || ""} />
              </label>
              <div className="md:col-span-2">
                <PublicIdUploadField
                  name="photoPublicId"
                  label="Public ID Foto"
                  defaultValue={item.photo?.publicId || ""}
                />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isActive" defaultChecked={item.isActive} />
                Aktif
              </label>
              <div className="md:col-span-2 flex flex-wrap gap-2">
                <button type="submit" className="btn-outline">Update</button>
              </div>
            </form>

            {item.category === "TEACHER" ? (
              <details className="mt-4 rounded-xl border border-zinc-200 bg-white p-4">
                <summary className="cursor-pointer select-none text-sm font-semibold text-zinc-800">
                  Foto Kelas untuk guru ini
                </summary>
                <p className="mt-2 text-sm text-zinc-600">
                  Ini akan mengganti slider “foto kelas” di halaman Guru &amp; Staf untuk guru ini saja.
                </p>
                <form action={updateClassPhotos} className="mt-3 grid gap-3 md:grid-cols-2">
                  {[1, 2, 3, 4, 5].map((idx) => (
                    <PublicIdUploadField
                      key={idx}
                      name={`staff_${item.id}_${idx}`}
                      label={`Foto ${idx}`}
                      defaultValue={readDefault(galleries, item.id, idx - 1)}
                    />
                  ))}
                  <div className="md:col-span-2">
                    <button type="submit" className="btn-outline w-fit">Simpan Foto Kelas</button>
                  </div>
                </form>
              </details>
            ) : null}

            <form action={deleteStaffMember} className="mt-2">
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" className="btn-danger">Hapus</button>
            </form>
          </article>
        ))}
      </section>
    </div>
  );
}
