import Link from "next/link";
import { getPpdb, getPpdbGraduateYears, getPpdbGraduates } from "@/lib/cms";
import { getMediaUrl } from "@/lib/media";

type Props = {
  searchParams: Promise<{ year?: string }>;
};

export const revalidate = 60;

export default async function PpdbPage({ searchParams }: Props) {
  const params = await searchParams;
  const selectedYear = params.year;

  const [ppdb, years, graduates] = await Promise.all([
    getPpdb(),
    getPpdbGraduateYears(),
    getPpdbGraduates(selectedYear),
  ]);

  const requirements = (ppdb?.requirements as string[] | null) || [];
  const flowSteps = (ppdb?.flowSteps as string[] | null) || [];
  const posterUrl = ppdb?.poster ? getMediaUrl(ppdb.poster) : "";

  return (
    <div className="space-y-6">
      <section className="card-surface p-6">
        <p className="mb-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">PPDB {ppdb?.periodYear}</p>
        <h1 className="text-2xl font-bold text-slate-900">Informasi Penerimaan Peserta Didik Baru</h1>
        <p className="mt-2 text-slate-600">Lihat syarat, alur pendaftaran, dan daftar siswa yang lulus.</p>
      </section>

      {posterUrl ? (
        <section className="card-surface p-5">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Poster SPMB</h2>
          <div className="overflow-hidden rounded-2xl bg-slate-50">
            <img className="h-auto w-full object-contain" src={posterUrl} alt={ppdb?.poster?.altText || "Poster SPMB"} />
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2">
        <article className="card-surface p-5">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Syarat Pendaftaran</h2>
          <ol className="list-inside list-decimal space-y-1 text-sm text-slate-700">
            {requirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </article>
        <article className="card-surface p-5">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Alur Pendaftaran</h2>
          <ol className="list-inside list-decimal space-y-1 text-sm text-slate-700">
            {flowSteps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </article>
      </section>

      <section className="card-surface overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Daftar Siswa Lulus PPDB</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/informasi/ppdb" className={!selectedYear ? "btn-primary" : "btn-outline"}>Semua</Link>
            {years.map((year) => (
              <Link
                key={year}
                href={`/informasi/ppdb?year=${encodeURIComponent(year)}`}
                className={selectedYear === year ? "btn-primary" : "btn-outline"}
              >
                {year}
              </Link>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">No</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Nama Siswa</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">No Pendaftaran</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Jalur</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Asal TK/RA</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Tahun</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {graduates.map((student, i) => (
                <tr key={student.id}>
                  <td className="px-4 py-3 text-slate-600">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{student.fullName}</td>
                  <td className="px-4 py-3 text-slate-600">{student.registrationNo || "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{student.admissionPath || "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{student.schoolOrigin || "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{student.graduationYear}</td>
                </tr>
              ))}
              {graduates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">Belum ada data kelulusan untuk filter ini.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card-surface p-5 text-sm text-slate-600">
        <p>{ppdb?.notes}</p>
        <Link href="/kontak" className="btn-primary mt-4">Hubungi Sekolah</Link>
      </section>
    </div>
  );
}
