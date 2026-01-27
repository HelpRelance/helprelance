import { useState } from 'react';

export default function HistoryExtensionModal({ isOpen, onClose, userEmail, userId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePurchase = async () => {
    setError('');
    setIsLoading(true);

    try {
      const priceId = 'price_1Su56vAfNQgXJOqEhuqkoXkd';

      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId,
          userEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (error) {
      setError(error.message || 'Une erreur est survenue. Réessayez.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-fadeIn relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl font-bold z-10 transition"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
              <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
              <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Extension Historique
          </h2>
          <p className="text-slate-600">
            Augmentez la capacité de stockage de votre historique
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="bg-gradient-to-br from-slate-50 to-white border-2 border-amber-200 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-700 font-semibold">Historique actuel</span>
            <span className="text-slate-900 font-bold">30 emails max</span>
          </div>
          
          <div className="flex items-center justify-center my-4">
            <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-700 font-semibold">Après extension</span>
            <span className="text-amber-600 font-bold text-xl">60 emails max</span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-amber-900 mb-1">
                +30 emplacements d'historique
              </p>
              <p className="text-xs text-amber-700">
                Gardez un historique plus complet de vos emails de relance
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-baseline justify-center gap-2 mb-6">
          <span className="text-4xl font-bold text-slate-900">5€</span>
          <span className="text-slate-500">/mois</span>
        </div>

        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-4 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg disabled:opacity-50"
        >
          {isLoading ? 'Chargement...' : 'Ajouter l\'extension'}
        </button>

        <p className="text-xs text-slate-500 text-center mt-4">
          Sans engagement • Annulation à tout moment
        </p>
      </div>
    </div>
  );
}
