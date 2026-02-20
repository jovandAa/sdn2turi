"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const callbackUrl = "/admin";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      if (result.error.startsWith("RATE_LIMITED:")) {
        const lockUntilIso = result.error.split("RATE_LIMITED:")[1];
        const lockUntil = new Date(lockUntilIso);
        const formatted = lockUntil.toLocaleString("id-ID", {
          dateStyle: "full",
          timeStyle: "short",
        });
        setError(`Terlalu banyak percobaan login gagal. Coba lagi pada ${formatted}.`);
        return;
      }

      setError("Email atau password salah.");
      return;
    }

    router.push(callbackUrl);
  }

  return (
    <section className="mx-auto max-w-md card-surface p-6">
      <h1 className="text-2xl font-bold text-slate-900">Login Admin</h1>
      <p className="mt-1 text-sm text-slate-500">Masuk untuk mengelola konten website sekolah.</p>
      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input suppressHydrationWarning className="input-base mt-1" type="email" name="email" required />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <input suppressHydrationWarning className="input-base mt-1" type="password" name="password" required />
        </label>
        {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
        <button suppressHydrationWarning className="btn-primary w-full" type="submit" disabled={loading}>
          {loading ? "Memproses..." : "Login"}
        </button>
      </form>
    </section>
  );
}
