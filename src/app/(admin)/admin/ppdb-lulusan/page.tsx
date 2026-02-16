import {
  createPpdbGraduate,
  deletePpdbGraduate,
  updatePpdbGraduate,
} from "@/app/(admin)/admin/actions";
import { GraduateLiveStats } from "@/components/admin/graduate-live-stats";
import { prisma } from "@/lib/prisma";

export default async function AdminPpdbGraduatesPage() {
  const graduates = await prisma.ppdbGraduate.findMany({
    orderBy: [{ graduationYear: "desc" }, { rank: "asc" }, { fullName: "asc" }],
  });

  return (
    <div className="space-y-6">
      <GraduateLiveStats />

      <section className="card-surface p-5">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Tambah Siswa Lulus PPDB</h3>
        <form action={createPpdbGraduate} className="grid gap-3 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Nama Lengkap
            <input className="input-base mt-1" name="fullName" required />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Tahun Lulus
            <input className="input-base mt-1" name="graduationYear" placeholder="2026/2027" required />
          </label>
          <label className="text-sm font-medium text-slate-700">
            No. Pendaftaran
            <input className="input-base mt-1" name="registrationNo" />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Asal TK/RA
            <input className="input-base mt-1" name="schoolOrigin" />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Peringkat
            <input className="input-base mt-1" type="number" name="rank" min={1} />
          </label>
          <label className="flex items-center gap-2 self-end text-sm font-medium text-slate-700">
            <input type="checkbox" name="isPublished" defaultChecked />
            Publish ke halaman publik
          </label>
          <div className="md:col-span-2">
            <button type="submit" className="btn-primary">Simpan</button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">Daftar & Edit Lulusan</h3>
        {graduates.map((graduate) => (
          <article key={graduate.id} className="card-surface p-4">
            <form action={updatePpdbGraduate} className="grid gap-3 md:grid-cols-3">
              <input type="hidden" name="id" value={graduate.id} />
              <label className="text-sm font-medium text-slate-700">
                Nama
                <input className="input-base mt-1" name="fullName" defaultValue={graduate.fullName} required />
              </label>
              <label className="text-sm font-medium text-slate-700">
                No Pendaftaran
                <input className="input-base mt-1" name="registrationNo" defaultValue={graduate.registrationNo || ""} />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Asal TK/RA
                <input className="input-base mt-1" name="schoolOrigin" defaultValue={graduate.schoolOrigin || ""} />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Tahun
                <input className="input-base mt-1" name="graduationYear" defaultValue={graduate.graduationYear} required />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Rank
                <input className="input-base mt-1" type="number" name="rank" min={1} defaultValue={graduate.rank || undefined} />
              </label>
              <label className="flex items-center gap-2 self-end text-sm font-medium text-slate-700">
                <input type="checkbox" name="isPublished" defaultChecked={graduate.isPublished} />
                Publish
              </label>
              <div className="md:col-span-3 flex flex-wrap gap-2">
                <button type="submit" className="btn-outline">Update</button>
              </div>
            </form>
            <form action={deletePpdbGraduate} className="mt-2">
              <input type="hidden" name="id" value={graduate.id} />
              <button type="submit" className="btn-danger">Hapus</button>
            </form>
          </article>
        ))}
        {graduates.length === 0 ? (
          <div className="card-surface p-6 text-sm text-slate-500">Belum ada data lulusan.</div>
        ) : null}
      </section>
    </div>
  );
}
