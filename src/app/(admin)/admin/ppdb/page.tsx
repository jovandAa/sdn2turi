import { closePpdb, updatePpdb } from "@/app/(admin)/admin/actions";
import { getLatestPpdb } from "@/lib/cms";
import { getMediaUrl } from "@/lib/media";
import { PublicIdUploadField } from "@/components/admin/public-id-upload-field";
import { ppdbListToTextarea } from "@/lib/ppdb-list";

export default async function AdminPpdbPage() {
  const ppdb = await getLatestPpdb();
  const posterUrl = ppdb?.poster ? getMediaUrl(ppdb.poster) : "";
  const isActive = Boolean(ppdb?.isActive);
  const statusLabel = isActive ? `Aktif (${ppdb?.periodYear})` : ppdb ? `Ditutup (${ppdb.periodYear})` : "Ditutup";

  return (
    <article className="section">
      <h3 className="text-lg font-semibold">Update PPDB</h3>
      <p className="mt-1 text-sm text-slate-600">
        Status: <span className="font-semibold">{statusLabel}</span>
      </p>

      <form action={updatePpdb} className="mt-4">
        <label>
          Periode
          <input name="periodYear" defaultValue={ppdb?.periodYear || "2026/2027"} required />
        </label>
        <label>
          Syarat (1 item per baris. Sub-poin: awali baris dengan - )
          <textarea name="requirements" defaultValue={ppdbListToTextarea(ppdb?.requirements)} required />
        </label>
        <label>
          Alur (1 langkah per baris. Sub-poin: awali baris dengan - )
          <textarea name="flowSteps" defaultValue={ppdbListToTextarea(ppdb?.flowSteps)} required />
        </label>
        <label>
          Jadwal Pelaksanaan (opsional, 1 item per baris. Sub-poin: awali baris dengan - )
          <textarea name="schedule" defaultValue={ppdbListToTextarea(ppdb?.schedule)} />
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
        <button type="submit" className="btn-primary w-fit">Simpan (Aktifkan)</button>
      </form>

      <form action={closePpdb} className="mt-3">
        <button type="submit" className="btn-outline w-fit" disabled={!ppdb || !isActive}>
          Tutup PPDB
        </button>
      </form>
    </article>
  );
}
