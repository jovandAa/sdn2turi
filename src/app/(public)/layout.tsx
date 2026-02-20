import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getIdentity } from "@/lib/cms";
import { getCloudinaryDeliveryUrl } from "@/lib/media";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const identity = await getIdentity();
  const logoUrl = identity.logoPublicId
    ? getCloudinaryDeliveryUrl(identity.logoPublicId, "IMAGE")
    : "/media/logo-sd.png";

  return (
    <>
      <SiteHeader
        schoolName={identity.schoolName || "SDN 2 Turi  Blitar"}
        tagline={identity.tagline || "Website resmi"}
        logoUrl={logoUrl || "/media/logo-sd.png"}
      />
      <main className="mx-auto w-full max-w-7xl px-4 py-7 lg:px-8">{children}</main>
      <SiteFooter />
    </>
  );
}
