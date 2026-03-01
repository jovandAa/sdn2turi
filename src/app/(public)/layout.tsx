import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getFooterSetting, getIdentity } from "@/lib/cms";
import { getCloudinaryDeliveryUrl } from "@/lib/media";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [identity, footer] = await Promise.all([getIdentity(), getFooterSetting()]);
  const logoUrl = identity.logoPublicId
    ? getCloudinaryDeliveryUrl(identity.logoPublicId, "IMAGE")
    : "/media/logo-sd.png";

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        schoolName={identity.schoolName || "SDN Turi 2 Blitar"}
        tagline={identity.tagline || "Website resmi"}
        logoUrl={logoUrl || "/media/logo-sd.png"}
      />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-7 lg:px-8">{children}</main>
      <SiteFooter
        schoolName={identity.shortName || identity.schoolName || "SDN Turi 2 Blitar"}
        footerDescription={footer.footerDescription}
        copyright={footer.copyright}
      />
    </div>
  );
}
