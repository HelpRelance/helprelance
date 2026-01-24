import { useState } from 'react';

export default function EmailForm({ userEmail, remainingUses, onGenerate, onShowPricing }) {
  const [formData, setFormData] = useState({
    serviceType: '',
    relanceType: '',
    delayTime: '',
    previousFollowups: '',
    tone: '',
    clientName: '',
    detail: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userEmail) {
      alert('⚠️ Veuillez d\'abord vous abonner');
      onShowPricing();
      return;
    }

    if (remainingUses <= 0) {
      onShowPricing();
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, userEmail }),
      });

      const data = await response.json();

      if (response.status === 429 || response.status === 401) {
        alert('⚠️ ' + data.error);
        if (response.status === 429) {
          onShowPricing();
        }
        return;
      }

      if (data.success) {
        onGenerate(data.emailsText, formData, data.remainingUses);
      } else {
        alert('❌ ' + (data.error || 'Une erreur est survenue'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Une erreur est survenue. Vérifiez votre connexion internet.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200">
      <h2 className="text-3xl font-bold text-slate-900 mb-6">
        Générez votre email de relance
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Type de service *
          </label>
          <input
            type="text"
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            placeholder="Ex: Design graphique, Développement web, Rédaction..."
            required
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Type de relance *
          </label>
          <input
            type="text"
            name="relanceType"
            value={formData.relanceType}
            onChange={handleChange}
            placeholder="Ex: Devis sans réponse, Facture impayée, Projet en pause..."
            required
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Depuis combien de temps sans réponse ? *
          </label>
          <select
            name="delayTime"
            value={formData.delayTime}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
          >
            <option value="">Sélectionnez...</option>
            <option value="2 jours">2 jours</option>
            <option value="1 semaine">1 semaine</option>
            <option value="2 semaines">2 semaines</option>
            <option value="1 mois ou plus">1 mois ou plus</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Combien de relances avez-vous déjà envoyées ? *
          </label>
          <select
            name="previousFollowups"
            value={formData.previousFollowups}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
          >
            <option value="">Sélectionnez...</option>
            <option value="0">0 (première relance)</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3 ou plus">3 ou plus</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Ton de l'email *
          </label>
          <select
            name="tone"
            value={formData.tone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
          >
            <option value="">Sélectionnez...</option>
            <option value="Amical et décontracté">Amical et décontracté</option>
            <option value="Professionnel et neutre">Professionnel et neutre</option>
            <option value="Ferme mais poli">Ferme mais poli</option>
            <option value="Urgent">Urgent (pour factures)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Prénom du client *
          </label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            placeholder="Ex: Marie"
            required
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Détail à mentionner *
          </label>
          <textarea
            name="detail"
            value={formData.detail}
            onChange={handleChange}
            placeholder="Ex: le logo pour votre boutique en ligne, la facture n°1234 de 850€..."
            required
            rows="3"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold py-4 px-6 rounded-xl transition duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Génération en cours...
            </span>
          ) : (
            '💰 Générer mes emails de relance'
          )}
        </button>
      </form>
    </section>
  );
}
