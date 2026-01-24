export default function UsageCounter({ remainingUses, onShowPricing }) {
  return (
    <div className="text-center mb-8 animate-fadeIn">
      <div className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-full shadow-xl">
        <span className="text-sm font-semibold uppercase tracking-wide">
          Essais gratuits restants : <span className="text-3xl font-bold mx-2">{remainingUses}</span>/3
        </span>
      </div>
      <p className="text-gray-600 text-sm mt-3">
        👆 Profitez-en maintenant ! 
        <button
          onClick={onShowPricing}
          className="text-emerald-600 underline hover:text-emerald-800 font-semibold ml-1"
        >
          Ou passez à Premium
        </button>
      </p>
    </div>
  );
}
