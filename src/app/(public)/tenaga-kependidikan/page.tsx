import { getStaff } from "@/lib/cms";
import { getMediaUrl } from "@/lib/media";

export const revalidate = 60;

export default async function StaffPage() {
  const staff = await getStaff();

  return (
    <div className="space-y-6">
      <section className="hero">
        <h1>Guru dan Staf</h1>
        <p>Tenaga pendidik dan kependidikan yang mendukung proses belajar siswa.</p>
      </section>

      <section className="grid grid-3">
        {staff.map((item) => {
          const photoUrl = getMediaUrl(item.photo);
          return (
            <article key={item.id} className="section">
              {photoUrl ? <img className="page-media h-56" src={photoUrl} alt={item.name} /> : <div className="page-media h-56 bg-zinc-100" />}
              <p className="badge mt-3">{item.category}</p>
              <h3 className="mt-2 text-lg font-semibold">{item.name}</h3>
              <p className="text-sm text-zinc-500">{item.position}</p>
              {item.bio ? <p className="mt-2 text-sm text-zinc-600">{item.bio}</p> : null}
            </article>
          );
        })}
      </section>
    </div>
  );
}
