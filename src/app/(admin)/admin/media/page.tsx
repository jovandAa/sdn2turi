import { deleteMediaAsset, registerMediaPublicId } from "@/app/(admin)/admin/actions";
import { UploadWidgetButton } from "@/components/admin/upload-widget-button";
import { getMediaAssets } from "@/lib/cms";
import { getMediaUrl } from "@/lib/media";

export default async function AdminMediaPage() {
  const assets = await getMediaAssets();

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <article className="section">
        <h3 className="text-lg font-semibold">Upload File ke Cloudinary</h3>
        <p className="mt-2 text-sm text-zinc-500">
          Klik tombol di bawah untuk membuka popup Cloudinary Upload Widget.
        </p>
        <div className="mt-4">
          <UploadWidgetButton label="Upload Gambar / Video" className="btn-primary w-fit" />
        </div>

        <h3 className="mt-8 text-lg font-semibold">Register Public ID Manual (Opsional)</h3>
        <form action={registerMediaPublicId} className="mt-4">
          <label>
            Public ID / Cloudinary URL
            <input name="publicId" required />
          </label>
          <label>
            Tipe Media
            <select name="mediaType" defaultValue="IMAGE">
              <option value="IMAGE">Image</option>
              <option value="VIDEO">Video</option>
            </select>
          </label>
          <label>
            Alt Text
            <input name="altText" />
          </label>
          <button type="submit" className="btn-outline w-fit">Simpan Public ID</button>
        </form>
      </article>

      <article className="section">
        <h3 className="text-lg font-semibold">Media Terbaru</h3>
        <div className="mt-4 space-y-4">
          {assets.slice(0, 20).map((asset) => {
            const mediaUrl = getMediaUrl(asset);

            return (
              <div key={asset.id} className="rounded-2xl border border-zinc-200 p-3">
                <p className="badge">{asset.resourceType}</p>
                <p className="mt-2 break-all text-xs text-zinc-500">{asset.publicId}</p>
                {asset.resourceType === "IMAGE" && mediaUrl ? (
                  <img className="page-media mt-3 h-36" src={mediaUrl} alt={asset.altText || asset.publicId} />
                ) : null}

                <div className="mt-3 flex flex-wrap gap-2">
                  <UploadWidgetButton
                    label="Replace via Popup"
                    className="btn-outline"
                    replaceMediaId={asset.id}
                  />
                </div>

                <form action={deleteMediaAsset} className="mt-2">
                  <input type="hidden" name="mediaId" value={asset.id} />
                  <button type="submit" className="btn-danger w-fit">Hapus Media</button>
                </form>
              </div>
            );
          })}
        </div>
      </article>
    </div>
  );
}
