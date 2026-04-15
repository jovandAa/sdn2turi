import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sortPpdbGraduates } from "@/lib/ppdb-graduate-sort";
import { publicProcedure, router } from "@/server/trpc";

export const ppdbGraduateRouter = router({
  list: publicProcedure
    .input(z.object({ year: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const graduates = await prisma.ppdbGraduate.findMany({
        where: input?.year ? { graduationYear: input.year } : undefined,
        orderBy: [{ graduationYear: "desc" }, { registrationNo: "asc" }, { fullName: "asc" }],
      });

      return sortPpdbGraduates(graduates);
    }),
});

