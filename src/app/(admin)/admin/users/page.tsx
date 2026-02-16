import { createUser, deleteUser, updateUser } from "@/app/(admin)/admin/actions";
import { requireSuperAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  await requireSuperAdmin();

  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="space-y-6">
      <section className="section">
        <h3 className="text-lg font-semibold">Tambah User Admin</h3>
        <form action={createUser} className="mt-4 grid gap-3 md:grid-cols-2">
          <label>
            Nama
            <input name="name" required />
          </label>
          <label>
            Email
            <input type="email" name="email" required />
          </label>
          <label>
            Role
            <select name="role" defaultValue="ADMIN">
              <option value="ADMIN">ADMIN</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            </select>
          </label>
          <label>
            Password
            <input type="password" name="password" minLength={8} required />
          </label>
          <div className="md:col-span-2">
            <button type="submit" className="btn-primary w-fit">Buat User</button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Daftar User</h3>
        {users.map((user) => (
          <article key={user.id} className="section">
            <form action={updateUser} className="grid gap-3 md:grid-cols-3">
              <input type="hidden" name="id" value={user.id} />
              <label>
                Nama
                <input name="name" defaultValue={user.name} required />
              </label>
              <label>
                Email
                <input type="email" name="email" defaultValue={user.email} required />
              </label>
              <label>
                Role
                <select name="role" defaultValue={user.role}>
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                </select>
              </label>
              <label>
                Password Baru (opsional)
                <input type="password" name="newPassword" minLength={8} />
              </label>
              <label className="flex items-center gap-2 self-end">
                <input type="checkbox" name="isActive" defaultChecked={user.isActive} />
                User aktif
              </label>
              <div className="md:col-span-3 flex flex-wrap gap-2">
                <button type="submit" className="btn-outline">Update</button>
              </div>
            </form>
            <form action={deleteUser} className="mt-2">
              <input type="hidden" name="id" value={user.id} />
              <button type="submit" className="btn-danger">Hapus User</button>
            </form>
          </article>
        ))}
      </section>
    </div>
  );
}
