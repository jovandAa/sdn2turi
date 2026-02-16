import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [activities, albums, media, staff, ppdbGraduates, users] = await Promise.all([
    prisma.activity.count(),
    prisma.galleryAlbum.count(),
    prisma.mediaAsset.count(),
    prisma.staffMember.count(),
    prisma.ppdbGraduate.count(),
    prisma.user.count(),
  ]);

  const stats = [
    { label: "Aktivitas", value: activities },
    { label: "Album Galeri", value: albums },
    { label: "Media Asset", value: media },
    { label: "Guru/Staf", value: staff },
    { label: "Lulusan PPDB", value: ppdbGraduates },
    { label: "User Admin", value: users },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <article key={stat.label} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{stat.label}</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">{stat.value}</p>
        </article>
      ))}
    </div>
  );
}
