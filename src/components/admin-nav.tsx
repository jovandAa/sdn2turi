import Link from "next/link";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/beranda", label: "Beranda" },
  { href: "/admin/kegiatan", label: "Kegiatan" },
  { href: "/admin/galeri", label: "Galeri" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/ppdb", label: "PPDB" },
  { href: "/admin/ppdb-lulusan", label: "Lulusan PPDB" },
  { href: "/admin/kontak-alamat", label: "Kontak & Alamat" },
];

export function AdminNav() {
  return (
    <nav className="mb-5 flex flex-wrap gap-2">
      {adminLinks.map((link) => (
        <Link key={link.href} href={link.href} className="btn-outline">
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
