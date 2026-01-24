export default function TopBanner({ onShowPricing }) {
  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 text-center text-sm">
      <span className="animate-pulse">
        🎉 Offre de lancement : Premium à 7€/mois au lieu de 15€ !
      </span>
      <button
        onClick={onShowPricing}
        className="ml-4 bg-white text-emerald-600 px-4 py-1 rounded-full font-semibold hover:bg-emerald-50 transition"
      >
        Voir l'offre →
      </button>
    </div>
  );
}
