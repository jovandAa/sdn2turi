import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return session;
}

export async function requireSuperAdmin() {
  const session = await requireAdmin();

  if (session.user.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  return session;
}
