import { SiteFooter } from "@/components/site-footer";
import { getFooterSetting, getIdentity } from "@/lib/cms";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [identity, footer] = await Promise.all([getIdentity(), getFooterSetting()]);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-7 lg:px-8">{children}</main>
      <SiteFooter
        schoolName={identity.shortName || identity.schoolName || "SDN Turi 2 Blitar"}
        footerDescription={footer.footerDescription}
        copyright={footer.copyright}
      />
    </div>
  );
}
