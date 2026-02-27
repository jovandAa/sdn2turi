import { updatePpdb } from "@/app/(admin)/admin/actions";
import { getPpdb } from "@/lib/cms";
import { getMediaUrl } from "@/lib/media";
import { PublicIdUploadField } from "@/components/admin/public-id-upload-field";

export default async function AdminPpdbPage() {
  const ppdb = await getPpdb();
  const posterUrl = ppdb?.poster ? getMediaUrl(ppdb.poster) : "";

  return (
    <article className="section">
      <h3 className="text-lg font-semibold">Update PPDB Aktif</h3>
      <form action={updatePpdb} className="mt-4">
        <label>
          Periode
          <input name="periodYear" defaultValue={ppdb?.periodYear || "2026/2027"} required />
        </label>
        <label>
          Syarat (1 baris 1 item)
          <textarea name="requirements" defaultValue={((ppdb?.requirements as string[] | null) || []).join("\n")} required />
        </label>
        <label>
          Alur (1 baris 1 langkah)
          <textarea name="flowSteps" defaultValue={((ppdb?.flowSteps as string[] | null) || []).join("\n")} required />
        </label>
        <label>
          Catatan
          <textarea name="notes" defaultValue={ppdb?.notes || ""} />
        </label>
        <PublicIdUploadField
          name="posterPublicId"
          label="Poster SPMB (opsional)"
          defaultValue={ppdb?.poster?.publicId || ""}
        />
        <label>
          Alt Text Poster (opsional)
          <input name="posterAltText" defaultValue={ppdb?.poster?.altText || ""} placeholder="Poster SPMB" />
        </label>
        {posterUrl ? (
          <div className="rounded-2xl border border-zinc-200 p-3">
            <p className="text-sm font-medium text-zinc-700">Preview Poster</p>
            <img className="page-media mt-3 h-48" src={posterUrl} alt={ppdb?.poster?.altText || "Poster SPMB"} />
          </div>
        ) : null}
        <button type="submit" className="btn-primary w-fit">Simpan</button>
      </form>
    </article>
  );
}
