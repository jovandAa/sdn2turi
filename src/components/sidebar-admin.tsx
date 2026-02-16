import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/beranda", label: "Beranda" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/kegiatan", label: "Kegiatan" },
  { href: "/admin/galeri", label: "Galeri" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/staff", label: "Guru/Staf" },
  { href: "/admin/facilities", label: "Fasilitas" },
  { href: "/admin/ppdb", label: "PPDB" },
  { href: "/admin/ppdb-lulusan", label: "Lulusan PPDB" },
  { href: "/admin/kontak-alamat", label: "Kontak & Alamat" },
  { href: "/admin/security", label: "Security" },
];

const superAdminLinks = [{ href: "/admin/users", label: "User Management" }];

type SidebarAdminProps = {
  role: string;
};

export function SidebarAdmin({ role }: SidebarAdminProps) {
  const menu = role === "SUPER_ADMIN" ? [...links, ...superAdminLinks] : links;

  return (
    <aside className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
      <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Navigasi Admin</p>
      <nav className="space-y-1">
        {menu.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
