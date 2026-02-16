import { updatePpdb } from "@/app/(admin)/admin/actions";
import { getPpdb } from "@/lib/cms";

export default async function AdminPpdbPage() {
  const ppdb = await getPpdb();

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
        <button type="submit" className="btn-primary w-fit">Simpan</button>
      </form>
    </article>
  );
}
