import { useState } from 'react';

export default function EmailCollectionModal({ isOpen, onClose, onSubmit }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      onSubmit(email);
      setEmail('');
    } else {
      alert('Veuillez entrer une adresse email valide');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-fadeIn relative">
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold transition"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-emerald-900 mb-4">
          🎁 Débloquez vos 3 essais gratuits
        </h2>
        <p className="text-gray-600 mb-6">
          Entrez votre email pour recevoir vos 3 générations gratuites + des conseils
          exclusifs pour récupérer vos paiements.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
            className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition"
          >
            🚀 Débloquer mes essais gratuits
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Pas de spam. Désinscription en 1 clic.
        </p>
      </div>
    </div>
  );
}
