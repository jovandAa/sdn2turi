import { getFacilities } from "@/lib/cms";
import { getMediaUrl } from "@/lib/media";

export const revalidate = 60;

export default async function PrasaranaPage() {
  const facilities = await getFacilities();

  return (
    <div className="space-y-6">
      <section className="hero">
        <h1>Sarana dan Prasarana</h1>
        <p>Fasilitas utama sekolah untuk mendukung pembelajaran akademik dan non-akademik.</p>
      </section>

      <section className="grid grid-3">
        {facilities.map((facility) => {
          const thumbUrl = getMediaUrl(facility.thumbnail);

          return (
            <article key={facility.id} className="section">
              {thumbUrl ? <img className="page-media h-56" src={thumbUrl} alt={facility.name} /> : <div className="page-media h-56 bg-zinc-100" />}
              <h3 className="mt-3 text-lg font-semibold">{facility.name}</h3>
              <p className="mt-2 text-sm text-zinc-500">{facility.description}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
