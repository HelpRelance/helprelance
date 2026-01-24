export default function PricingModal({ isOpen, onClose, onReopenEmailModal }) {
  if (!isOpen) return null;

  const handleSubscribe = (plan) => {
    alert(`🚀 Redirection vers le paiement Stripe...\n\nPour l'instant, contactez-nous à ${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@helprelance.com'}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Passez à Premium 🚀</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Plan Pro (RECOMMANDÉ) */}
          <div className="border-4 border-emerald-500 rounded-xl p-6 relative bg-gradient-to-br from-emerald-50 to-teal-50 transform scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold">
              RECOMMANDÉ
            </div>
            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <p className="text-4xl font-bold mb-1">
              <span className="line-through text-gray-400 text-2xl">15€</span> 7€
              <span className="text-lg text-gray-500">/mois</span>
            </p>
            <p className="text-xs text-emerald-600 font-semibold mb-4">
              🎉 -50% Offre de lancement
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✓</span>
                <span className="text-sm font-semibold">Emails illimités</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✓</span>
                <span className="text-sm font-semibold">Historique complet</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✓</span>
                <span className="text-sm font-semibold">Rappels automatiques</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✓</span>
                <span className="text-sm font-semibold">Support prioritaire</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✓</span>
                <span className="text-sm font-semibold">Sans publicité</span>
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe('pro')}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-lg font-bold transition shadow-lg"
            >
              Passer à Pro →
            </button>
            <p className="text-xs text-center text-gray-500 mt-3">
              Paiement mensuel • Annulation en 1 clic
            </p>
          </div>

          {/* Plan Premium */}
          <div className="border-2 border-gray-300 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-2">Premium</h3>
            <p className="text-4xl font-bold mb-4">
              19€<span className="text-lg text-gray-500">/mois</span>
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✓</span>
                <span className="text-sm">Tout du plan Pro</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✓</span>
                <span className="text-sm font-semibold">Suite complète de templates</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✓</span>
                <span className="text-sm font-semibold">Propositions commerciales</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✓</span>
                <span className="text-sm font-semibold">Emails de remerciement</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✓</span>
                <span className="text-sm font-semibold">Contrats automatiques</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✓</span>
                <span className="text-sm font-semibold">Intégrations (Gmail, Outlook)</span>
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe('premium')}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-bold transition"
            >
              Passer à Premium →
            </button>
            <p className="text-xs text-center text-gray-500 mt-3">
              Paiement mensuel • Annulation en 1 clic
            </p>
          </div>
        </div>

        <div className="mt-8 text-center border-t pt-6">
          <p className="text-sm text-gray-600 mb-3">
            💡 Vous préférez d'abord tester gratuitement ?
          </p>
          <button
            onClick={onReopenEmailModal}
            className="text-emerald-600 font-semibold hover:underline"
          >
            ← Entrer mon email pour 3 essais gratuits
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            💳 Paiement sécurisé par Stripe • 🔒 Annulation en 1 clic
          </p>
        </div>
      </div>
    </div>
  );
}
