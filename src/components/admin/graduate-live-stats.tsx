"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { createBrowserTrpcClient } from "@/lib/trpc/client";

export function GraduateLiveStats() {
  const trpc = useMemo(() => createBrowserTrpcClient(), []);

  const { data, isLoading } = useQuery({
    queryKey: ["ppdb-graduates", "all"],
    queryFn: () => trpc.ppdbGraduates.list.query(),
    staleTime: 30_000,
  });

  const total = data?.length || 0;
  const thisYear = data?.filter((g) => g.graduationYear === "2026/2027").length || 0;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <article className="card border-blue-100 bg-blue-50">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Total Data Lulusan</p>
        <p className="mt-2 text-2xl font-bold text-blue-900">{isLoading ? "..." : total}</p>
      </article>
      <article className="card border-emerald-100 bg-emerald-50">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Lulusan 2026/2027</p>
        <p className="mt-2 text-2xl font-bold text-emerald-900">{isLoading ? "..." : thisYear}</p>
      </article>
    </div>
  );
}
