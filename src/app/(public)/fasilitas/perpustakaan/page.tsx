import { LibraryOpenStatusBadge } from "./library-open-status-badge";

export const revalidate = 60;

export default function PerpustakaanPage() {
  return (
    <div className="space-y-8">
      <section className="hero">
        <h1>Perpustakaan Sekolah</h1>
        <p>Ruang literasi siswa dengan koleksi buku lengkap dan area belajar yang nyaman.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-center text-3xl font-extrabold text-slate-800">Fasilitas &amp; Layanan</h2>
        <div className="grid grid-3">
          <article className="section text-center">
            <div className="text-4xl" aria-hidden>
              📚
            </div>
            <h3 className="mt-3 text-lg font-semibold">Koleksi Lengkap</h3>
            <p className="mt-2 text-sm text-zinc-500">Cerita rakyat, sains, atlas, dan buku penunjang kurikulum.</p>
          </article>
          <article className="section text-center">
            <div className="text-4xl" aria-hidden>
              🪑
            </div>
            <h3 className="mt-3 text-lg font-semibold">Ruang Nyaman</h3>
            <p className="mt-2 text-sm text-zinc-500">Area baca siswa yang kondusif dan mendukung pembelajaran.</p>
          </article>
          <article className="section text-center">
            <div className="text-4xl" aria-hidden>
              ⏰
            </div>
            <h3 className="mt-3 text-lg font-semibold">Buka Senin-Sabtu</h3>
            <p className="mt-2 text-sm text-zinc-500">Jam layanan 07.00–14.00 (mengikuti jam sekolah).</p>
            <LibraryOpenStatusBadge />
          </article>
        </div>
      </section>

      <section className="section">
        <h2 className="text-center text-2xl font-extrabold text-slate-800 md:text-3xl">Buku Terpopuler Bulan Ini</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-5">
          <div
            className="w-40 cursor-default rounded-xl p-5 text-center shadow-sm transition-transform hover:-translate-y-2"
            style={{ background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%)" }}
          >
            <div className="text-4xl" aria-hidden>
              📖
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-800">Cerita Rakyat</h3>
          </div>
          <div
            className="w-40 cursor-default rounded-xl p-5 text-center shadow-sm transition-transform hover:-translate-y-2"
            style={{ background: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)" }}
          >
            <div className="text-4xl" aria-hidden>
              🌍
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-800">Atlas Dunia</h3>
          </div>
          <div
            className="w-40 cursor-default rounded-xl p-5 text-center shadow-sm transition-transform hover:-translate-y-2"
            style={{ background: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)" }}
          >
            <div className="text-4xl" aria-hidden>
              🔬
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-800">Sains Kuark</h3>
          </div>
        </div>
      </section>
    </div>
  );
}

