import { createStaffMember, deleteStaffMember, updateStaffMember } from "@/app/(admin)/admin/actions";
import { PublicIdUploadField } from "@/components/admin/public-id-upload-field";
import { prisma } from "@/lib/prisma";

export default async function AdminStaffPage() {
  const staff = await prisma.staffMember.findMany({
    include: { photo: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
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
