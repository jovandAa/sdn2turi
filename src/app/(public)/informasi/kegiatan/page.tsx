import { getActivities } from "@/lib/cms";
import { getMediaUrl } from "@/lib/media";
import { ActivityPhotoSlider } from "@/components/activity-photo-slider";

export const revalidate = 60;

export default async function KegiatanPage() {
  const activities = await getActivities();

  return (
    <div className="space-y-6">
      <section className="hero">
        <h1>Kegiatan Sekolah</h1>
        <p>Ekstrakurikuler dan aktivitas siswa untuk mengembangkan bakat, minat, dan karakter.</p>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {activities.map((activity) => (
          <article key={activity.id} className="section space-y-3">
            <div>
              <h3 className="text-lg font-semibold">{activity.title}</h3>
              <p className="text-sm text-zinc-500">{activity.description}</p>
            </div>
            <ActivityPhotoSlider
              title={activity.title}
              images={activity.media.filter((media) => media.media.resourceType !== "VIDEO").map((media) => getMediaUrl(media.media))}
            />
          </article>
        ))}
      </section>
    </div>
  );
}
