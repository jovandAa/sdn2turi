"use client";

import { useState } from "react";

type ClassPhotoSliderProps = {
  images: string[];
  label: string;
};

export function ClassPhotoSlider({ images, label }: ClassPhotoSliderProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const safeImages = images.length ? images : ["/media/PanoKelas.jpeg"];
  const current = safeImages[index] || safeImages[0];

  function next() {
    setIndex((prev) => (prev + 1) % safeImages.length);
  }

  function prev() {
    setIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  }

  function openSlider(startIndex = 0) {
    setIndex(startIndex);
    setOpen(true);
  }

  return (
    <>
      <button
        suppressHydrationWarning
        type="button"
        onClick={() => openSlider(0)}
        className="block w-[280px] overflow-hidden rounded-lg border border-indigo-200 bg-indigo-50 shadow-sm"
        title={`Lihat foto kelas - ${label}`}
      >
        <img src={safeImages[0]} alt={`Foto kelas ${label}`} className="h-[120px] w-[280px] object-cover" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-4xl rounded-2xl bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">{label}</p>
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
                disabled={safeImages.length <= 1}
              >
                Prev
              </button>

              <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <img src={current} alt={`Slide foto kelas ${label}`} className="h-[60vh] w-full object-contain" />
              </div>

              <button
                suppressHydrationWarning
                type="button"
                onClick={next}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700"
                disabled={safeImages.length <= 1}
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
