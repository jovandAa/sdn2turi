import { z } from "zod";
import { publicProcedure, router } from "@/server/trpc";
import { prisma } from "@/lib/prisma";

export const ppdbGraduateRouter = router({
  list: publicProcedure
    .input(z.object({ year: z.string().optional() }).optional())
    .query(async ({ input }) => {
      return prisma.ppdbGraduate.findMany({
        where: input?.year ? { graduationYear: input.year } : undefined,
        orderBy: [{ graduationYear: "desc" }, { rank: "asc" }, { fullName: "asc" }],
      });
    }),
});
