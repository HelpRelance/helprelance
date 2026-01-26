import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import PricingModal from '../components/PricingModal';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);
      
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();
      
      if (userData) {
        if (userData.is_premium) {
          setSubscription('Premium');
        } else if (userData.remaining_uses && userData.remaining_uses > 0) {
          setSubscription('Pro');
        } else {
          setSubscription('Aucun abonnement');
        }
      }

      loadHistory();
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const loadHistory = () => {
    const savedHistory = JSON.parse(localStorage.getItem('helprelance_history') || '[]');
    setHistory(savedHistory);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Tableau de bord</h1>
            <p className="text-slate-600">Bienvenue {user?.email}</p>
          </div>
          <Link
            href="/"
            className="px-6 py-2 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:border-amber-500 transition"
          >
            ← Accueil
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Emails générés</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{history.length}</p>
            <p className="text-sm text-slate-500 mt-1">Total depuis inscription</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Abonnement</h3>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {subscription || 'Chargement...'}
            </p>
            {subscription === 'Aucun abonnement' && (
              <button 
                onClick={() => setShowPricingModal(true)}
                className="text-sm text-amber-500 hover:text-amber-600 font-semibold mt-2"
              >
                Choisir une formule →
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Membre depuis</h3>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {user && new Date(user.created_at).toLocaleDateString('fr-FR')}
            </p>
            <p className="text-sm text-slate-500 mt-1">Date d'inscription</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Historique des emails</h2>
          
          {history.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-slate-600 mb-4">Aucun email généré pour le moment</p>
              {subscription === 'Aucun abonnement' ? (
                <button
                  onClick={() => setShowPricingModal(true)}
                  className="inline-block px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold rounded-lg hover:from-slate-800 hover:to-slate-700 transition"
                >
                  Choisir une formule pour commencer
                </button>
              ) : (
                <Link
                  href="/"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold rounded-lg hover:from-slate-800 hover:to-slate-700 transition"
                >
                  Générer mon premier email
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-6 hover:border-amber-500 transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-slate-500">
                        {new Date(item.timestamp).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
                      3 versions
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition">
                      Voir les emails
                    </button>
                    <button className="px-4 py-2 border-2 border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:border-amber-500 transition">
                      Copier
                    </button>
                    <button className="px-4 py-2 border-2 border-red-200 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 transition">
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />
    </div>
  );
}
