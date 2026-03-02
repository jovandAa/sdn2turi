"use client";

import { useState } from "react";

type MediaItem = {
  id: string;
  type: "IMAGE" | "VIDEO";
  url: string;
};

type ActivityPhotoSliderProps = {
  title: string;
  items: MediaItem[];
};

export function ActivityPhotoSlider({ title, items }: ActivityPhotoSliderProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const validItems = items.filter((item) => Boolean(item.url));

  if (!validItems.length) {
    return <div className="page-media h-44 bg-zinc-100" />;
  }

  const current = validItems[index] || validItems[0];

  function next() {
    setIndex((prev) => (prev + 1) % validItems.length);
  }

  function prev() {
    setIndex((prev) => (prev - 1 + validItems.length) % validItems.length);
  }

  return (
    <>
      <button
        suppressHydrationWarning
        type="button"
        onClick={() => {
          setIndex(0);
          setOpen(true);
        }}
        className="w-full overflow-hidden rounded-2xl border border-zinc-200"
        title={`Lihat foto kegiatan ${title}`}
      >
        {validItems[0].type === "VIDEO" ? (
          <div className="relative flex h-44 w-full items-center justify-center bg-black text-sm font-semibold text-white">
            <span className="badge absolute left-3 top-3 bg-white/90 text-slate-800">VIDEO</span>
            <span className="rounded-full bg-white/15 px-4 py-2">Klik untuk memutar</span>
          </div>
        ) : (
          <img src={validItems[0].url} alt={title} className="page-media h-44 w-full object-cover" />
        )}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-4xl rounded-2xl bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">{title}</p>
              <button suppressHydrationWarning type="button" onClick={() => setOpen(false)} className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-600">
                Tutup
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                suppressHydrationWarning
                type="button"
                onClick={prev}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700"
                disabled={validItems.length <= 1}
              >
                Prev
              </button>

              <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {current.type === "VIDEO" ? (
                  <video className="h-[60vh] w-full bg-black object-contain" controls preload="metadata" playsInline>
                    <source src={current.url} />
                  </video>
                ) : (
                  <img src={current.url} alt={`${title} ${index + 1}`} className="h-[60vh] w-full object-contain" />
                )}
              </div>

              <button
                suppressHydrationWarning
                type="button"
                onClick={next}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700"
                disabled={validItems.length <= 1}
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
