import Link from "next/link";
import { getPpdb, getPpdbGraduateYears, getPpdbGraduates } from "@/lib/cms";
import { getMediaUrl } from "@/lib/media";
import { coercePpdbList } from "@/lib/ppdb-list";

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

  const isOpen = Boolean(ppdb);
  const requirements = coercePpdbList(ppdb?.requirements);
  const flowSteps = coercePpdbList(ppdb?.flowSteps);
  const schedule = coercePpdbList(ppdb?.schedule);
  const posterUrl = ppdb?.poster ? getMediaUrl(ppdb.poster) : "";

  return (
    <div className="space-y-6">
      <section className="card-surface p-6">
        <p className="mb-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {isOpen ? `PPDB ${ppdb?.periodYear}` : "PPDB Ditutup"}
        </p>
        <h1 className="text-2xl font-bold text-slate-900">
          {isOpen ? "Informasi Penerimaan Peserta Didik Baru" : "PPDB Sedang Ditutup"}
        </h1>
        <p className="mt-2 text-slate-600">
          {isOpen
            ? "Lihat syarat, alur pendaftaran, dan daftar siswa yang lulus."
            : "Informasi PPDB belum tersedia saat ini. Silakan hubungi sekolah untuk informasi lebih lanjut."}
        </p>
        {!isOpen ? (
          <Link href="/kontak" className="btn-primary mt-4 w-fit">
            Hubungi Sekolah
          </Link>
        ) : null}
      </section>

      {isOpen && posterUrl ? (
        <section className="card-surface p-5">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Poster SPMB</h2>
          <div className="overflow-hidden rounded-2xl bg-slate-50">
            <img className="h-auto w-full object-contain" src={posterUrl} alt={ppdb?.poster?.altText || "Poster SPMB"} />
          </div>
        </section>
      ) : null}

      {isOpen ? (
        <section className={`grid gap-4 ${schedule.length ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          <article className="card-surface p-5">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Syarat Pendaftaran</h2>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
              {requirements.map((item, index) => (
                <li key={`${index}-${item.text}`}>
                  <p>{item.text}</p>
                  {item.subItems?.length ? (
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {item.subItems.map((sub) => (
                        <li key={sub}>{sub}</li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ol>
          </article>
          <article className="card-surface p-5">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Alur Pendaftaran</h2>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
              {flowSteps.map((item, index) => (
                <li key={`${index}-${item.text}`}>
                  <p>{item.text}</p>
                  {item.subItems?.length ? (
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {item.subItems.map((sub) => (
                        <li key={sub}>{sub}</li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ol>
          </article>
          {schedule.length ? (
            <article className="card-surface p-5">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">Jadwal Pelaksanaan</h2>
              <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
                {schedule.map((item, index) => (
                  <li key={`${index}-${item.text}`}>
                    <p>{item.text}</p>
                    {item.subItems?.length ? (
                      <ul className="mt-1 list-disc space-y-1 pl-5">
                        {item.subItems.map((sub) => (
                          <li key={sub}>{sub}</li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ol>
            </article>
          ) : null}
        </section>
      ) : null}

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

      {isOpen ? (
        <section className="card-surface p-5 text-sm text-slate-600">
          <p>{ppdb?.notes}</p>
          <Link href="/kontak" className="btn-primary mt-4">Hubungi Sekolah</Link>
        </section>
      ) : null}
    </div>
  );
}
