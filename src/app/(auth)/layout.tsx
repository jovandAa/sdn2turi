import { SiteFooter } from "@/components/site-footer";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-7 lg:px-8">{children}</main>
      <SiteFooter />
    </div>
  );
}

