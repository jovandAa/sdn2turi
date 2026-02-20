import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SidebarAdmin } from "@/components/sidebar-admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pt-6 lg:px-8">
      <div className="admin-simple grid flex-1 gap-4 lg:grid-cols-[260px_1fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-zinc-900">Admin Panel</p>
            <p className="mt-1 text-xs text-zinc-500">{session.user.email}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">{session.user.role}</p>
            <Link href="/api/auth/signout" className="btn-outline mt-3 w-full">
              Logout
            </Link>
          </div>
          <SidebarAdmin role={session.user.role} />
        </div>

        <section className="space-y-4">{children}</section>
      </div>

      <footer className="mt-auto border-t border-zinc-200 px-1 py-4 text-center text-xs text-zinc-500">
        Copyright {new Date().getFullYear()} - Admin SDN Turi 2 Blitar
      </footer>
    </div>
  );
}
