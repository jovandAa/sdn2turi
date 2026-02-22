"use client";

import { useEffect, useMemo, useState } from "react";

type GallerySliderItem = {
  src: string;
  type: "IMAGE" | "VIDEO";
  caption?: string | null;
};

type GalleryAlbumSliderProps = {
  title: string;
  items: GallerySliderItem[];
};

export function GalleryAlbumSlider({ title, items }: GalleryAlbumSliderProps) {
  const safeItems = useMemo(() => items.filter((item) => Boolean(item.src)), [items]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const current = safeItems[index] || safeItems[0];

  function openSlider(startIndex: number) {
    setIndex(startIndex);
    setOpen(true);
  }

  function next() {
    setIndex((prev) => (prev + 1) % safeItems.length);
  }

  function prev() {
    setIndex((prev) => (prev - 1 + safeItems.length) % safeItems.length);
  }

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, safeItems.length]);

  if (!safeItems.length) {
    return <div className="page-media h-56 bg-zinc-100" />;
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {safeItems.map((item, itemIndex) => (
          <figure key={`${item.src}-${itemIndex}`} className="card overflow-hidden">
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => openSlider(itemIndex)}
              className="relative block w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white"
              title={`Lihat ${item.type === "VIDEO" ? "video" : "foto"}: ${title}`}
            >
              {item.type === "VIDEO" ? (
                <div className="page-media flex h-56 items-center justify-center bg-black text-sm font-semibold text-white">VIDEO</div>
              ) : (
                <img className="page-media h-56 w-full object-cover" src={item.src} alt={item.caption || title} />
              )}
            </button>
            <figcaption className="mt-2 text-sm text-zinc-600">{item.caption}</figcaption>
          </figure>
        ))}
      </div>

      {open && current ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-5xl rounded-2xl bg-white p-4 shadow-xl">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-700">{title}</p>
                <p className="text-xs text-slate-500">
                  {index + 1} / {safeItems.length}
                  {current.caption ? ` \u2022 ${current.caption}` : ""}
                </p>
              </div>
              <button
                suppressHydrationWarning
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-600"
              >
                Tutup
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                suppressHydrationWarning
                type="button"
                onClick={prev}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700"
                disabled={safeItems.length <= 1}
              >
                Prev
              </button>

              <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {current.type === "VIDEO" ? (
                  <video className="h-[60vh] w-full bg-black" controls>
                    <source src={current.src} />
                  </video>
                ) : (
                  <img src={current.src} alt={`${title} ${index + 1}`} className="h-[60vh] w-full object-contain" />
                )}
              </div>

              <button
                suppressHydrationWarning
                type="button"
                onClick={next}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700"
                disabled={safeItems.length <= 1}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

