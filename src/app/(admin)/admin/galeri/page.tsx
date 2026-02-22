import {
  createGalleryAlbum,
  createGalleryItem,
  deleteGalleryAlbum,
  deleteGalleryItem,
  updateGalleryAlbum,
  updateGalleryItem,
} from "@/app/(admin)/admin/actions";
import { PublicIdUploadField } from "@/components/admin/public-id-upload-field";
import { getGallery } from "@/lib/cms";
import { getMediaUrl } from "@/lib/media";

export default async function AdminGaleriPage() {
  const albums = await getGallery();

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <article className="section">
        <h3 className="text-lg font-semibold">Tambah Album</h3>
        <form action={createGalleryAlbum} className="mt-4">
          <label>
            Judul Album
            <input name="title" required />
          </label>
          <label>
            Deskripsi
            <textarea name="description" />
          </label>
          <button type="submit" className="btn-primary w-fit">
            Buat Album
          </button>
        </form>

        <h3 className="mt-8 text-lg font-semibold">Tambah Item ke Album</h3>
        <form action={createGalleryItem} className="mt-4">
          <label>
            Album
            <select name="albumId" required>
              <option value="">Pilih album</option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title}
                </option>
              ))}
            </select>
          </label>

          <PublicIdUploadField name="mediaPublicId" label="Public ID Media" required />

          <label>
            Tipe Media
            <select name="mediaType" defaultValue="IMAGE">
              <option value="IMAGE">Image</option>
              <option value="VIDEO">Video</option>
            </select>
          </label>
          <label>
            Caption
            <input name="caption" />
          </label>
          <button type="submit" className="btn-primary w-fit">
            Tambah Item
          </button>
        </form>
      </article>

      <article className="section">
        <h3 className="text-lg font-semibold">Album Saat Ini</h3>
        <ul className="mt-4 space-y-3">
          {albums.map((album) => (
            <li key={album.id} className="rounded-xl border border-zinc-200 p-3">
              <form action={updateGalleryAlbum} className="grid gap-3">
                <input type="hidden" name="id" value={album.id} />
                <label>
                  Judul Album
                  <input name="title" defaultValue={album.title} required />
                </label>
                <label>
                  Deskripsi
                  <textarea name="description" defaultValue={album.description || ""} />
                </label>

                <PublicIdUploadField
                  name="coverPublicId"
                  label="Cover Public ID (opsional)"
                  defaultValue={album.cover?.publicId || ""}
                />

                <label>
                  Cover Tipe Media
                  <select name="coverMediaType" defaultValue={album.cover?.resourceType || "IMAGE"}>
                    <option value="IMAGE">Image</option>
                    <option value="VIDEO">Video</option>
                  </select>
                </label>

                <div className="flex flex-wrap gap-2">
                  <button type="submit" className="btn-outline">
                    Update Album
                  </button>
                </div>
              </form>

              {album.cover ? (
                <div className="mt-3">
                  {album.cover.resourceType === "VIDEO" ? (
                    <video className="h-36 w-full rounded-md border border-zinc-200 bg-black object-cover" controls>
                      <source src={getMediaUrl(album.cover)} />
                    </video>
                  ) : (
                    <img
                      className="h-36 w-full rounded-md border border-zinc-200 object-cover"
                      src={getMediaUrl(album.cover)}
                      alt={album.title}
                    />
                  )}
                </div>
              ) : null}

              <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-sm font-semibold text-zinc-800">Tambah Item ke Album Ini</p>
                <form action={createGalleryItem} className="mt-3 grid gap-3">
                  <input type="hidden" name="albumId" value={album.id} />
                  <PublicIdUploadField name="mediaPublicId" label="Public ID Media" required />
                  <label>
                    Tipe Media
                    <select name="mediaType" defaultValue="IMAGE">
                      <option value="IMAGE">Image</option>
                      <option value="VIDEO">Video</option>
                    </select>
                  </label>
                  <label>
                    Caption
                    <input name="caption" />
                  </label>
                  <button type="submit" className="btn-primary w-fit">
                    Tambah Item
                  </button>
                </form>
              </div>

              {album.items.length ? (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {album.items.map((item) => {
                    const mediaUrl = getMediaUrl(item.media);
                    const isVideo = item.media.resourceType === "VIDEO";
                    return (
                      <div key={item.id} className="rounded-lg border border-zinc-200 bg-white p-2">
                        {isVideo ? (
                          <video className="h-28 w-full rounded-md border border-zinc-200 bg-black" controls>
                            <source src={mediaUrl} />
                          </video>
                        ) : (
                          <img
                            className="h-28 w-full rounded-md border border-zinc-200 object-cover"
                            src={mediaUrl}
                            alt={item.caption || album.title}
                          />
                        )}

                        <form action={updateGalleryItem} className="mt-2 grid gap-2">
                          <input type="hidden" name="id" value={item.id} />
                          <label>
                            Caption
                            <input name="caption" defaultValue={item.caption || ""} />
                          </label>
                          <label>
                            Urutan
                            <input name="sortOrder" type="number" defaultValue={item.sortOrder} />
                          </label>
                          <button type="submit" className="btn-outline w-full">
                            Update Item
                          </button>
                        </form>

                        <form action={deleteGalleryItem} className="mt-2">
                          <input type="hidden" name="id" value={item.id} />
                          <button type="submit" className="btn-danger w-full">
                            Hapus Item
                          </button>
                        </form>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-4 text-sm text-zinc-500">Belum ada item di album ini.</p>
              )}

              <form action={deleteGalleryAlbum} className="mt-4">
                <input type="hidden" name="id" value={album.id} />
                <button type="submit" className="btn-danger">
                  Hapus Album
                </button>
              </form>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}

