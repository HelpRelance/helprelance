import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PricingModal({ isOpen, onClose }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [isOpen]);

  const handleSelectPlan = async (plan) => {
    setError('');
    
    if (!user) {
      localStorage.setItem('selected_plan', plan);
      router.push('/signup');
      return;
    }

    setIsLoading(true);

    try {
      const priceId = plan === 'pro' 
        ? 'price_1Su5KOAfNQgXJOqEGdA9kV9r'
        : 'price_1Stla1AfNQgXJOqEZwTj6Xnv';

      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          userEmail: user.email,
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
      <div className="bg-white rounded-2xl p-6 max-w-5xl w-full shadow-2xl animate-fadeIn relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl font-bold z-10 transition"
        >
          ✕
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Choisissez votre formule
          </h2>
          <p className="text-slate-600">
            Générez vos emails de relance professionnels en quelques clics
          </p>
          {!user && (
            <p className="text-sm text-amber-600 mt-2">
              Vous serez redirigé vers la création de compte
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-amber-500 transition-all duration-300">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Pro</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold text-slate-900">7,99€</span>
                <span className="text-slate-500">/mois</span>
              </div>
              <p className="text-sm text-slate-500">Idéal pour démarrer</p>
            </div>

            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-700"><strong>50 emails</strong> / mois</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-700">3 versions par email</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-700">Historique (30 emails max)</span>
              </li>
            </ul>

            <button 
              onClick={() => handleSelectPlan('pro')}
              disabled={isLoading}
              className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 transition-colors duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Chargement...' : user ? 'Commencer avec Pro' : 'S\'inscrire - Pro'}
            </button>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 relative shadow-2xl">
            <div className="absolute top-3 right-3">
              <span className="bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                Recommandé
              </span>
            </div>

            <div className="mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold text-white">15,99€</span>
                <span className="text-slate-300">/mois</span>
              </div>
              <p className="text-sm text-slate-300">Pour les pros exigeants</p>
            </div>

            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white"><strong>Emails illimités</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white">3 versions par email</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white">Historique illimité</span>
              </li>
            </ul>

            <button 
              onClick={() => handleSelectPlan('premium')}
              disabled={isLoading}
              className="w-full bg-amber-500 text-slate-900 font-bold py-3 rounded-xl hover:bg-amber-400 transition-colors duration-300 shadow-lg disabled:opacity-50"
            >
              {isLoading ? 'Chargement...' : user ? 'Commencer avec Premium' : 'S\'inscrire - Premium'}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Sans engagement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
