import { getServerSession } from "next-auth";
import { resetAllRateLimits, unlockRateLimit } from "@/app/(admin)/admin/actions";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminSecurityPage() {
  const session = await getServerSession(authOptions);
  const canManage = session?.user?.role === "SUPER_ADMIN";

  const limits = await prisma.loginRateLimit.findMany({
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <section className="section">
        <h3 className="text-lg font-semibold">Monitoring Rate Limit Login</h3>
        <p className="mt-2 text-sm text-zinc-500">
          Maksimal 10 percobaan gagal, lalu akun/email+IP terkunci selama 24 jam.
        </p>
        {canManage ? (
          <form action={resetAllRateLimits} className="mt-4">
            <button type="submit" className="btn-danger w-fit">Reset Semua Rate Limit</button>
          </form>
        ) : (
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
            Hanya SUPER_ADMIN yang bisa unlock/reset rate limit.
          </p>
        )}
      </section>

      <section className="space-y-3">
        {limits.map((item) => (
          <article key={item.id} className="section">
            <p className="text-sm font-semibold text-zinc-900">{item.identifier}</p>
            <p className="mt-1 text-sm text-zinc-600">Gagal: {item.failedCount}</p>
            <p className="text-sm text-zinc-600">
              Terkunci sampai: {item.lockedUntil ? item.lockedUntil.toLocaleString("id-ID") : "Tidak terkunci"}
            </p>
            <p className="text-xs text-zinc-500">Update: {item.updatedAt.toLocaleString("id-ID")}</p>
            {canManage ? (
              <form action={unlockRateLimit} className="mt-3">
                <input type="hidden" name="id" value={item.id} />
                <button type="submit" className="btn-outline">Unlock/Reset</button>
              </form>
            ) : null}
          </article>
        ))}
        {limits.length === 0 ? (
          <div className="section text-sm text-zinc-500">Belum ada data rate limit.</div>
        ) : null}
      </section>
    </div>
  );
}

