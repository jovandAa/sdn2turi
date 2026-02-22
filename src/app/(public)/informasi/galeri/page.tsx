import { GalleryAlbumSlider } from "@/components/gallery-album-slider";
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

          <GalleryAlbumSlider
            title={album.title}
            items={album.items.map((item) => ({
              src: getMediaUrl(item.media),
              type: item.media.resourceType,
              caption: item.caption,
            }))}
          />
        </article>
      ))}
    </div>
  );
}

