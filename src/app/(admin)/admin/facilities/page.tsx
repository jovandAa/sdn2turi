import { createFacility, deleteFacility, updateFacility } from "@/app/(admin)/admin/actions";
import { PublicIdUploadField } from "@/components/admin/public-id-upload-field";
import { prisma } from "@/lib/prisma";

export default async function AdminFacilitiesPage() {
  const facilities = await prisma.facility.findMany({
    include: { thumbnail: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <section className="section">
        <h3 className="text-lg font-semibold">Tambah Fasilitas</h3>
        <form action={createFacility} className="mt-4 grid gap-3 md:grid-cols-2">
          <label>
            Nama
            <input name="name" required />
          </label>
          <label>
            Urutan
            <input type="number" name="sortOrder" defaultValue={0} />
          </label>
          <label className="md:col-span-2">
            Deskripsi
            <textarea name="description" required />
          </label>
          <div className="md:col-span-2">
            <PublicIdUploadField name="thumbnailPublicId" label="Public ID Thumbnail" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="btn-primary w-fit">Tambah</button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Daftar Fasilitas</h3>
        {facilities.map((item) => (
          <article key={item.id} className="section">
            <form action={updateFacility} className="grid gap-3 md:grid-cols-2">
              <input type="hidden" name="id" value={item.id} />
              <label>
                Nama
                <input name="name" defaultValue={item.name} required />
              </label>
              <label>
                Urutan
                <input type="number" name="sortOrder" defaultValue={item.sortOrder} />
              </label>
              <label className="md:col-span-2">
                Deskripsi
                <textarea name="description" defaultValue={item.description} required />
              </label>
              <div className="md:col-span-2">
                <PublicIdUploadField
                  name="thumbnailPublicId"
                  label="Public ID Thumbnail"
                  defaultValue={item.thumbnail?.publicId || ""}
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
            <form action={deleteFacility} className="mt-2">
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" className="btn-danger">Hapus</button>
            </form>
          </article>
        ))}
      </section>
    </div>
  );
}
