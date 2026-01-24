export default function TopBanner({ onShowPricing }) {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-3 px-4 text-center shadow-lg">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            Offre limitée
          </span>
          <span className="text-sm font-medium">
            -30% sur tous les abonnements annuels
          </span>
        </div>
        <button
          onClick={onShowPricing}
          className="text-amber-400 hover:text-amber-300 text-sm font-semibold underline underline-offset-2 transition"
        >
          Voir l'offre →
        </button>
      </div>
    </div>
  );
}
