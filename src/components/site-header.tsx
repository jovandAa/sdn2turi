"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { useUiStore } from "@/store/ui-store";

type HeaderProps = {
  schoolName: string;
  tagline: string;
  logoUrl: string;
};

type NavGroup = {
  key: string;
  label: string;
  href?: string;
  children?: Array<{ label: string; href: string }>;
};

const navGroups: NavGroup[] = [
  { key: "beranda", label: "Beranda", href: "/" },
  {
    key: "profil",
    label: "Profil",
    children: [
      { label: "Profil Sekolah", href: "/profil" },
      { label: "Tentang", href: "/tentang" },
      { label: "Guru & Staf", href: "/tenaga-kependidikan" },
    ],
  },
  {
    key: "fasilitas",
    label: "Fasilitas",
    children: [
      { label: "Prasarana", href: "/fasilitas/prasarana" },
      { label: "Perpustakaan", href: "/fasilitas/perpustakaan" },
    ],
  },
  {
    key: "informasi",
    label: "Informasi",
    children: [
      { label: "Kegiatan", href: "/informasi/kegiatan" },
      { label: "Galeri", href: "/informasi/galeri" },
      { label: "PPDB", href: "/informasi/ppdb" },
    ],
  },
  {
    key: "kontak",
    label: "Kontak",
    children: [
      { label: "Hubungi Kami", href: "/kontak" },
      { label: "Alamat", href: "/alamat" },
    ],
  },
];

export function SiteHeader({ schoolName, tagline, logoUrl }: HeaderProps) {
  const { mobileNavOpen, toggleMobileNav, setMobileNavOpen, activeDropdown, setActiveDropdown } = useUiStore();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setMobileNavOpen(false)}>
          {logoUrl ? (
            <img src={logoUrl} alt="Logo SDN" className="h-10 w-10 rounded-full object-cover ring-1 ring-zinc-200" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-zinc-200 ring-1 ring-zinc-300" />
          )}
          <div>
            <p className="text-base font-bold text-zinc-900">{schoolName}</p>
            <p className="text-xs text-zinc-500">{tagline}</p>
          </div>
        </Link>

        <button
          suppressHydrationWarning
          className="rounded-lg border border-zinc-200 p-2 lg:hidden"
          onClick={toggleMobileNav}
          aria-label="Toggle menu"
        >
          {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {navGroups.map((group) => {
            if (!group.children) {
              return (
                <Link
                  key={group.key}
                  href={group.href || "#"}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                >
                  {group.label}
                </Link>
              );
            }

            return (
              <div
                key={group.key}
                className="relative"
                onMouseEnter={() => setActiveDropdown(group.key)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  suppressHydrationWarning
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                >
                  {group.label}
                  <ChevronDown className="h-4 w-4" />
                </button>
                <AnimatePresence>
                  {activeDropdown === group.key ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute left-0 top-11 w-60 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg"
                    >
                      {group.children.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block rounded-lg px-3 py-2 text-sm text-zinc-600 transition hover:bg-zinc-100"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </div>

      <AnimatePresence>
        {mobileNavOpen ? (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-zinc-200 bg-white lg:hidden"
          >
            <div className="mx-auto max-w-7xl space-y-2 px-4 py-3">
              {navGroups.map((group) => (
                <div key={group.key}>
                  {group.children ? (
                    <details className="rounded-lg border border-zinc-200 p-2">
                      <summary className="cursor-pointer list-none text-sm font-semibold text-zinc-700">{group.label}</summary>
                      <div className="mt-2 space-y-1">
                        {group.children.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block rounded-md px-2 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100"
                            onClick={() => setMobileNavOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </details>
                  ) : (
                    <Link
                      href={group.href || "#"}
                      className="block rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700"
                      onClick={() => setMobileNavOpen(false)}
                    >
                      {group.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
