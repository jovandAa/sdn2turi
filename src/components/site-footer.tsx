export function SiteFooter() {
  return (
    <footer className="mt-12 bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-200 lg:px-6">
        <p className="font-semibold text-white">SDN Turi 2 Blitar</p>
        <p>Copyright {new Date().getFullYear()} - Website resmi sekolah.</p>
      </div>
    </footer>
  );
}
