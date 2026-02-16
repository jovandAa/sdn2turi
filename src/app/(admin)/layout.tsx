export default function AdminGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="min-h-screen bg-zinc-50">{children}</main>;
}
