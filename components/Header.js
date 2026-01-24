import { useState, useEffect } from 'react';

export default function Header() {
  const [todayCount, setTodayCount] = useState(127);
  const [totalEmails, setTotalEmails] = useState(2847);

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

  return (
    <header className="text-center mb-16 pt-8">
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
    </header>
  );
}
