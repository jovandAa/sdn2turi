export const revalidate = 60;

export default function PerpustakaanPage() {
  return (
    <div className="space-y-6">
      <section className="hero">
        <h1>Perpustakaan Sekolah</h1>
        <p>Ruang literasi siswa dengan koleksi buku lengkap dan area belajar yang nyaman.</p>
      </section>

      <section className="grid grid-3">
        <article className="section">
          <h3 className="text-lg font-semibold">Koleksi Lengkap</h3>
          <p className="mt-2 text-sm text-zinc-500">Cerita rakyat, sains, atlas, dan buku penunjang kurikulum.</p>
        </article>
        <article className="section">
          <h3 className="text-lg font-semibold">Ruang Nyaman</h3>
          <p className="mt-2 text-sm text-zinc-500">Area baca siswa yang kondusif dan mendukung pembelajaran.</p>
        </article>
        <article className="section">
          <h3 className="text-lg font-semibold">Jam Layanan</h3>
          <p className="mt-2 text-sm text-zinc-500">Buka Senin hingga Sabtu pada jam sekolah.</p>
        </article>
      </section>
    </div>
  );
}
