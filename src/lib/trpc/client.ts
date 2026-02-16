"use client";

import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/server/routers/_app";

export function createBrowserTrpcClient() {
  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: "/api/trpc",
      }),
    ],
  });
}
