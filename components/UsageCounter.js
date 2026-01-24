export default function UsageCounter({ remainingUses }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8 text-center border-2 border-amber-500">
      <div className="flex items-center justify-center gap-3 mb-2">
        <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <h3 className="text-xl font-bold text-slate-900">Essai gratuit</h3>
      </div>
      <p className="text-slate-600 text-sm">
        <span className="text-3xl font-bold text-amber-500">{remainingUses}</span> / 1 essai gratuit utilisé
      </p>
    </div>
  );
}
