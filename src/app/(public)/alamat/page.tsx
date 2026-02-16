import { getContactInfo } from "@/lib/cms";

export const revalidate = 60;

export default async function AlamatPage() {
  const contact = await getContactInfo();

  return (
    <div className="space-y-6">
      <section className="hero">
        <h1>Alamat Sekolah</h1>
        <p>Lokasi dan peta SDN Turi 2 Blitar.</p>
      </section>

      <section className="section space-y-4">
        <p className="text-sm text-zinc-600">{contact?.address}</p>
        {contact?.googleMapsEmbedUrl ? (
          <iframe
            title="Lokasi SDN Turi 2"
            src={contact.googleMapsEmbedUrl}
            className="h-[420px] w-full rounded-2xl border border-zinc-200"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : null}
      </section>
    </div>
  );
}
