import { updateContact } from "@/app/(admin)/admin/actions";
import { getContactInfo } from "@/lib/cms";

export default async function AdminContactPage() {
  const contact = await getContactInfo();
  const social = (contact?.social as { instagram?: string; facebook?: string; youtube?: string } | null) || {};

  return (
    <article className="section">
      <h3 className="text-lg font-semibold">Edit Kontak & Alamat</h3>
      <form action={updateContact} className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="md:col-span-2">
          Alamat
          <textarea name="address" defaultValue={contact?.address || ""} required />
        </label>
        <label>
          Telepon
          <input name="phone" defaultValue={contact?.phone || ""} required />
        </label>
        <label>
          Email
          <input name="email" defaultValue={contact?.email || ""} required />
        </label>
        <label className="md:col-span-2">
          Google Maps Embed URL
          <input name="googleMapsEmbedUrl" defaultValue={contact?.googleMapsEmbedUrl || ""} />
        </label>
        <label>
          Instagram
          <input name="instagram" defaultValue={social.instagram || ""} />
        </label>
        <label>
          Facebook
          <input name="facebook" defaultValue={social.facebook || ""} />
        </label>
        <label>
          YouTube
          <input name="youtube" defaultValue={social.youtube || ""} />
        </label>
        <div className="md:col-span-2">
          <button type="submit" className="btn-primary w-fit">Simpan</button>
        </div>
      </form>
    </article>
  );
}
