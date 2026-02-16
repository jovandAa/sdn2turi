import { getGallery } from "@/lib/cms";
import { getMediaUrl } from "@/lib/media";

export const revalidate = 60;

export default async function GaleriPage() {
  const albums = await getGallery();

  return (
    <div className="space-y-6">
      <section className="hero">
        <h1>Galeri Sekolah</h1>
        <p>Dokumentasi kegiatan, prestasi siswa, dan fasilitas sekolah.</p>
      </section>

      {albums.map((album) => (
        <article key={album.id} className="section space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{album.title}</h2>
            <p className="text-sm text-zinc-500">{album.description}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {album.items.map((item) => {
              const mediaUrl = getMediaUrl(item.media);
              return (
                <figure key={item.id} className="card overflow-hidden">
                  {mediaUrl ? <img className="page-media h-56" src={mediaUrl} alt={item.caption || album.title} /> : <div className="page-media h-56 bg-zinc-100" />}
                  <figcaption className="mt-2 text-sm text-zinc-600">{item.caption}</figcaption>
                </figure>
              );
            })}
          </div>
        </article>
      ))}
    </div>
  );
}
