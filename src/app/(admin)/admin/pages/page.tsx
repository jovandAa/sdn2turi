import {
  createOrUpdatePageMeta,
  createOrUpdatePageSection,
  deletePageSection,
} from "@/app/(admin)/admin/actions";
import { prisma } from "@/lib/prisma";

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({
    include: {
      sections: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { slug: "asc" },
  });

  return (
    <div className="space-y-6">
      <section className="section">
        <h3 className="text-lg font-semibold">Tambah/Hapus Metadata Page</h3>
        <form action={createOrUpdatePageMeta} className="mt-4 grid gap-3 md:grid-cols-2">
          <label>
            Slug
            <input name="slug" placeholder="contoh: fasilitas-prasarana" required />
          </label>
          <label>
            Title
            <input name="title" required />
          </label>
          <label>
            Meta Title
            <input name="metaTitle" />
          </label>
          <label>
            Status
            <select name="status" defaultValue="PUBLISHED">
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="DRAFT">DRAFT</option>
            </select>
          </label>
          <label className="md:col-span-2">
            Meta Description
            <textarea name="metaDescription" />
          </label>
          <div className="md:col-span-2">
            <button type="submit" className="btn-primary w-fit">Simpan Page</button>
          </div>
        </form>
      </section>

      <section className="section">
        <h3 className="text-lg font-semibold">Tambah Section Page</h3>
        <form action={createOrUpdatePageSection} className="mt-4 grid gap-3 md:grid-cols-2">
          <label>
            Page
            <select name="pageId" required>
              <option value="">Pilih page</option>
              {pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.title} ({page.slug})
                </option>
              ))}
            </select>
          </label>
          <label>
            Section Key
            <input name="sectionKey" placeholder="contoh: hero" required />
          </label>
          <label>
            Heading
            <input name="heading" />
          </label>
          <label>
            Urutan
            <input type="number" name="sortOrder" defaultValue={0} />
          </label>
          <label className="md:col-span-2">
            Content JSON
            <textarea
              name="contentJson"
              defaultValue='{"text":"Isi konten"}'
            />
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isVisible" defaultChecked />
            Tampilkan section
          </label>
          <div className="md:col-span-2">
            <button type="submit" className="btn-outline w-fit">Simpan Section</button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Page & Section Saat Ini</h3>
        {pages.map((page) => (
          <article key={page.id} className="section">
            <form action={createOrUpdatePageMeta} className="grid gap-3 md:grid-cols-2">
              <input type="hidden" name="pageId" value={page.id} />
              <label>
                Slug
                <input name="slug" defaultValue={page.slug} required />
              </label>
              <label>
                Title
                <input name="title" defaultValue={page.title} required />
              </label>
              <label>
                Meta Title
                <input name="metaTitle" defaultValue={page.metaTitle || ""} />
              </label>
              <label>
                Status
                <select name="status" defaultValue={page.status}>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="DRAFT">DRAFT</option>
                </select>
              </label>
              <label className="md:col-span-2">
                Meta Description
                <textarea name="metaDescription" defaultValue={page.metaDescription || ""} />
              </label>
              <div className="md:col-span-2">
                <button type="submit" className="btn-outline w-fit">Update Metadata</button>
              </div>
            </form>

            <div className="mt-4 space-y-3">
              {page.sections.map((section) => (
                <form key={section.id} action={createOrUpdatePageSection} className="rounded-2xl border border-zinc-200 p-4">
                  <input type="hidden" name="sectionId" value={section.id} />
                  <input type="hidden" name="pageId" value={page.id} />
                  <label>
                    Section Key
                    <input name="sectionKey" defaultValue={section.sectionKey} required />
                  </label>
                  <label>
                    Heading
                    <input name="heading" defaultValue={section.heading || ""} />
                  </label>
                  <label>
                    Urutan
                    <input type="number" name="sortOrder" defaultValue={section.sortOrder} />
                  </label>
                  <label>
                    Content JSON
                    <textarea
                      name="contentJson"
                      defaultValue={JSON.stringify(section.content, null, 2)}
                    />
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="isVisible" defaultChecked={section.isVisible} />
                    Tampilkan section
                  </label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="submit" className="btn-outline">Update Section</button>
                  </div>
                </form>
              ))}
            </div>

            {page.sections.map((section) => (
              <form key={`${section.id}-delete`} action={deletePageSection} className="mt-2 inline-block">
                <input type="hidden" name="id" value={section.id} />
                <button type="submit" className="btn-danger">Hapus Section: {section.sectionKey}</button>
              </form>
            ))}
          </article>
        ))}
      </section>
    </div>
  );
}
