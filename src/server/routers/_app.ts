import { router } from "@/server/trpc";
import { ppdbGraduateRouter } from "@/server/routers/ppdb-graduate";

export const appRouter = router({
  ppdbGraduates: ppdbGraduateRouter,
});

export type AppRouter = typeof appRouter;
