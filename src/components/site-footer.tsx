export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 lg:px-6">
        <p className="font-medium text-slate-700">SDN Turi 2 Blitar</p>
        <p>Copyright {new Date().getFullYear()} - Website resmi sekolah.</p>
      </div>
    </footer>
  );
}
