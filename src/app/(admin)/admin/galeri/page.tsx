import { createGalleryAlbum, createGalleryItem } from "@/app/(admin)/admin/actions";
import { PublicIdUploadField } from "@/components/admin/public-id-upload-field";
import { getGallery } from "@/lib/cms";

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
          <button type="submit" className="btn-primary w-fit">Buat Album</button>
        </form>

        <h3 className="mt-8 text-lg font-semibold">Tambah Item ke Album</h3>
        <form action={createGalleryItem} className="mt-4">
          <label>
            Album
            <select name="albumId" required>
              <option value="">Pilih album</option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>{album.title}</option>
              ))}
            </select>
          </label>

          <PublicIdUploadField
            name="mediaPublicId"
            label="Public ID Media"
            required
          />

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
          <button type="submit" className="btn-primary w-fit">Tambah Item</button>
        </form>
      </article>

      <article className="section">
        <h3 className="text-lg font-semibold">Album Saat Ini</h3>
        <ul className="mt-4 space-y-3">
          {albums.map((album) => (
            <li key={album.id} className="rounded-xl border border-zinc-200 p-3">
              <strong>{album.title}</strong>
              <p className="text-sm text-zinc-500">Item: {album.items.length}</p>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
