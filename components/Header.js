import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Header() {
  const router = useRouter();
  const [todayCount, setTodayCount] = useState(127);
  const [totalEmails, setTotalEmails] = useState(2847);
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const todayInterval = setInterval(() => {
      setTodayCount(prev => prev + 1);
    }, 15000);

    const totalInterval = setInterval(() => {
      setTotalEmails(prev => prev + 1);
    }, 60000);

    return () => {
      clearInterval(todayInterval);
      clearInterval(totalInterval);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowMenu(false);
    router.push('/');
  };

  return (
    <header className="mb-16 pt-8">
      <div className="flex justify-end mb-6 gap-3">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border-2 border-slate-200 hover:border-amber-500 transition"
            >
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                {user.email?.[0].toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-slate-700">{user.email}</span>
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                  onClick={() => setShowMenu(false)}
                >
                  📊 Tableau de bord
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                  onClick={() => setShowMenu(false)}
                >
                  💳 Mon abonnement
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                  onClick={() => setShowMenu(false)}
                >
                  📂 Historique
                </Link>
                <hr className="my-2 border-slate-200" />
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  🚪 Se déconnecter
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-amber-500 transition"
            >
              Se connecter
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white text-sm font-bold rounded-lg hover:from-slate-800 hover:to-slate-700 transition"
            >
              S'inscrire
            </Link>
          </>
        )}
      </div>

      <div className="text-center">
        <div className="inline-block mb-6">
          <div className="flex items-center gap-3 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-2 rounded-full shadow-lg">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            <span className="text-white font-medium text-sm tracking-wide">
              {todayCount} freelances ont récupéré leurs paiements aujourd'hui
            </span>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Récupérez vos factures
          <br />
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            impayées en 24h
          </span>
        </h1>

        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Des emails de relance professionnels générés par IA.
          <br />
          Augmentez votre taux de réponse de 85% avec des messages personnalisés et efficaces.
        </p>

        <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500 mb-12">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Sans engagement</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Résultats garantis</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Support 7j/7</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto border border-slate-200">
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">{totalEmails.toLocaleString()}</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider">Emails générés</div>
            </div>
            <div className="text-center border-l border-slate-200">
              <div className="text-4xl font-bold text-slate-900 mb-2">85%</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider">Taux de réponse</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
