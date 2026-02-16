import { createActivity } from "@/app/(admin)/admin/actions";
import { PublicIdUploadField } from "@/components/admin/public-id-upload-field";
import { getActivities } from "@/lib/cms";

export default async function AdminKegiatanPage() {
  const activities = await getActivities();

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <article className="section">
        <h3 className="text-lg font-semibold">Tambah Kegiatan</h3>
        <form action={createActivity} className="mt-4">
          <label>
            Judul
            <input name="title" required />
          </label>
          <label>
            Deskripsi
            <textarea name="description" required />
          </label>

          <PublicIdUploadField
            name="mediaPublicId"
            label="Public ID Media (opsional)"
          />

          <label>
            Tipe Media
            <select name="mediaType" defaultValue="IMAGE">
              <option value="IMAGE">Image</option>
              <option value="VIDEO">Video</option>
            </select>
          </label>
          <button type="submit" className="btn-primary w-fit">Tambah</button>
        </form>
      </article>

      <article className="section">
        <h3 className="text-lg font-semibold">Daftar Kegiatan</h3>
        <ul className="mt-4 space-y-3">
          {activities.map((item) => (
            <li key={item.id} className="rounded-xl border border-zinc-200 p-3">
              <strong className="text-zinc-900">{item.title}</strong>
              <p className="mt-1 text-sm text-zinc-500">{item.description}</p>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
