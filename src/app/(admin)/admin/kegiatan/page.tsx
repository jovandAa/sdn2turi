import { createActivity, deleteActivity, deleteActivityMedia, updateActivity } from "@/app/(admin)/admin/actions";
import { PublicIdUploadField } from "@/components/admin/public-id-upload-field";
import { getActivities } from "@/lib/cms";
import { getMediaUrl } from "@/lib/media";

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
              <form action={updateActivity} className="grid gap-3">
                <input type="hidden" name="id" value={item.id} />
                <label>
                  Judul
                  <input name="title" defaultValue={item.title} required />
                </label>
                <label>
                  Deskripsi
                  <textarea name="description" defaultValue={item.description} required />
                </label>

                <PublicIdUploadField
                  name="mediaPublicId"
                  label="Tambah Public ID Media (opsional)"
                />

                <label>
                  Tipe Media
                  <select name="mediaType" defaultValue="IMAGE">
                    <option value="IMAGE">Image</option>
                    <option value="VIDEO">Video</option>
                  </select>
                </label>

                <div className="flex flex-wrap gap-2">
                  <button type="submit" className="btn-outline">Update</button>
                </div>
              </form>

              {item.media.length ? (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {item.media.map((mediaLink) => {
                    const mediaUrl = getMediaUrl(mediaLink.media);
                    const isVideo = mediaLink.media.resourceType === "VIDEO";
                    return (
                      <div key={mediaLink.id} className="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
                        {isVideo ? (
                          <video className="h-28 w-full rounded-md border border-zinc-200 bg-black" controls>
                            <source src={mediaUrl} />
                          </video>
                        ) : (
                          <img className="h-28 w-full rounded-md border border-zinc-200 object-cover" src={mediaUrl} alt={item.title} />
                        )}
                        <form action={deleteActivityMedia} className="mt-2">
                          <input type="hidden" name="activityMediaId" value={mediaLink.id} />
                          <button type="submit" className="btn-danger w-full">Hapus Foto/Media Ini</button>
                        </form>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              <form action={deleteActivity} className="mt-2">
                <input type="hidden" name="id" value={item.id} />
                <button type="submit" className="btn-danger">Hapus</button>
              </form>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
