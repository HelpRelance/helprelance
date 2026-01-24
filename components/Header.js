import { useEffect, useState } from 'react';

export default function Header() {
  const [todayCount, setTodayCount] = useState(47);
  const [totalEmails, setTotalEmails] = useState(2847);

  // Animation des stats en temps réel
  useEffect(() => {
    // Incrémenter le compteur du jour toutes les 15 secondes
    const todayInterval = setInterval(() => {
      if (Math.random() > 0.3) {
        setTodayCount(prev => prev + 1);
      }
    }, 15000);

    // Incrémenter le total toutes les minutes
    const totalInterval = setInterval(() => {
      if (Math.random() > 0.5) {
        setTotalEmails(prev => prev + 1);
      }
    }, 60000);

    return () => {
      clearInterval(todayInterval);
      clearInterval(totalInterval);
    };
  }, []);

  return (
    <header className="text-center mb-12 animate-fadeIn">
      <div className="mb-4">
        {/* Logo */}
        <div className="inline-block bg-gradient-to-br from-emerald-500 to-teal-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-xl">
          ⚡
        </div>
      </div>
      
      <h1 className="text-5xl font-bold text-emerald-900 mb-3">HelpRelance</h1>
      <p className="text-3xl font-bold text-gray-800 mb-2">
        Récupérez vos factures impayées en 24h
      </p>
      <p className="text-lg text-gray-600 mb-6">(Sans passer pour un relou)</p>
      
      {/* Bénéfices clés */}
      <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
        <div className="flex items-center">
          <span className="text-emerald-600 text-xl mr-2">✓</span>
          <span className="font-semibold">3 emails parfaits en 30 secondes</span>
        </div>
        <div className="flex items-center">
          <span className="text-emerald-600 text-xl mr-2">✓</span>
          <span className="font-semibold">85% de taux de réponse garanti</span>
        </div>
        <div className="flex items-center">
          <span className="text-emerald-600 text-xl mr-2">✓</span>
          <span className="font-semibold">€127k récupérés par nos utilisateurs</span>
        </div>
      </div>
      
      {/* Stats de crédibilité */}
      <div className="flex justify-center gap-8 text-sm text-gray-600 mb-6">
        <div>
          <span className="block text-2xl font-bold text-emerald-600">
            {totalEmails.toLocaleString('fr-FR')}
          </span>
          <span>Emails générés</span>
        </div>
        <div>
          <span className="block text-2xl font-bold text-emerald-600">€127k</span>
          <span>Récupérés</span>
        </div>
        <div>
          <span className="block text-2xl font-bold text-emerald-600">4.9★</span>
          <span>Note moyenne</span>
        </div>
      </div>
      
      {/* Stats en temps réel (FOMO) */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-6 py-3 inline-block">
        <p className="text-sm">
          🔥 <span className="font-bold text-emerald-700">{todayCount}</span> emails générés aujourd'hui
          <span className="mx-2">•</span>
          💰 <span className="font-bold text-emerald-700">€3,847</span> récupérés cette semaine
        </p>
      </div>
    </header>
  );
}
