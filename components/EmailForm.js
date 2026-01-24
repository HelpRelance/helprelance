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
      alert('⚠️ Veuillez d\'abord vérifier votre email');
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

  const isButtonDisabled = !userEmail || remainingUses <= 0;

  return (
    <section className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Générez votre email de relance
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Type de service
          </label>
          <select
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">Sélectionnez...</option>
            <option value="Design graphique">Design graphique</option>
            <option value="Rédaction">Rédaction</option>
            <option value="Développement web">Développement web</option>
            <option value="Consulting">Consulting</option>
            <option value="Marketing">Marketing</option>
            <option value="Photographie">Photographie</option>
            <option value="Vidéo">Vidéo/Montage</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Type de relance
          </label>
          <select
            name="relanceType"
            value={formData.relanceType}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">Sélectionnez...</option>
            <option value="Devis envoyé sans réponse">Devis envoyé sans réponse</option>
            <option value="Projet en cours, client silencieux">Projet en cours, client silencieux</option>
            <option value="Facture impayée">Facture impayée</option>
            <option value="Réunion confirmée mais client absent">Réunion confirmée mais client absent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Depuis combien de temps sans réponse ?
          </label>
          <select
            name="delayTime"
            value={formData.delayTime}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">Sélectionnez...</option>
            <option value="2 jours">2 jours</option>
            <option value="1 semaine">1 semaine</option>
            <option value="2 semaines">2 semaines</option>
            <option value="1 mois ou plus">1 mois ou plus</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Combien de relances avez-vous déjà envoyées ?
          </label>
          <select
            name="previousFollowups"
            value={formData.previousFollowups}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">Sélectionnez...</option>
            <option value="0">0 (première relance)</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3 ou plus">3 ou plus</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ton de l'email
          </label>
          <select
            name="tone"
            value={formData.tone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">Sélectionnez...</option>
            <option value="Amical et décontracté">Amical et décontracté</option>
            <option value="Professionnel et neutre">Professionnel et neutre</option>
            <option value="Ferme mais poli">Ferme mais poli</option>
            <option value="Urgent">Urgent (pour factures)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Prénom du client <span className="text-gray-400 font-normal">(optionnel)</span>
          </label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            placeholder="Ex: Marie"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Détail à mentionner <span className="text-gray-400 font-normal">(optionnel)</span>
          </label>
          <input
            type="text"
            name="detail"
            value={formData.detail}
            onChange={handleChange}
            placeholder="Ex: le logo pour votre boutique en ligne"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={isButtonDisabled || isLoading}
          className={`w-full font-bold py-4 px-6 rounded-lg transition duration-300 transform shadow-lg ${
            isButtonDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:scale-105 text-white'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Génération en cours...
            </span>
          ) : isButtonDisabled ? (
            '⚠️ Vérifiez votre email pour continuer'
          ) : (
            '💰 Récupérer mon argent maintenant'
          )}
        </button>
      </form>
    </section>
  );
}
