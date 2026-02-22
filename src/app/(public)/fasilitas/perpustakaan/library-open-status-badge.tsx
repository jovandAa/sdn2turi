"use client";

import { useEffect, useState } from "react";

function isLibraryOpen(now: Date) {
  const hour = now.getHours();
  const day = now.getDay();
  const isSunday = day === 0;

  return !isSunday && hour >= 7 && hour < 14;
}

export function LibraryOpenStatusBadge() {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setOpen(isLibraryOpen(new Date()));
    update();

    const intervalId = window.setInterval(update, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  if (open === null) return null;

  return open ? (
    <span className="mt-3 inline-flex items-center gap-2 rounded-full border-2 border-emerald-500 px-4 py-1 text-sm font-bold text-emerald-600">
      <span aria-hidden>🟢</span> SEDANG BUKA
    </span>
  ) : (
    <span className="mt-3 inline-flex items-center gap-2 rounded-full border-2 border-rose-500 px-4 py-1 text-sm font-bold text-rose-600">
      <span aria-hidden>🔴</span> TUTUP
    </span>
  );
}

