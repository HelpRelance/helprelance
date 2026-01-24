import { useState } from 'react';

const VERIFICATION_CODE = 'RELANCE2025';

export default function EmailVerificationModal({ isOpen, onClose, onVerified }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    if (code.toUpperCase() !== VERIFICATION_CODE) {
      setError('Code invalide. Le code est : RELANCE2025');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-with-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('helprelance_email', email);
        localStorage.setItem('helprelance_verified', 'true');
        onVerified(data.user);
        setEmail('');
        setCode('');
      } else {
        setError(data.error || 'Erreur');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-fadeIn relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-emerald-900 mb-4">
          🎁 Débloquez vos 3 essais gratuits
        </h2>
        
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4 mb-6">
          <p className="text-sm font-semibold text-emerald-800 mb-2">
            🔑 Code de vérification :
          </p>
          <p className="text-2xl font-bold text-emerald-600 text-center tracking-wider">
            RELANCE2025
          </p>
        </div>

        <p className="text-gray-600 mb-6 text-sm">
          Entrez votre email et le code ci-dessus pour débloquer vos essais gratuits.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
            className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Entrez le code"
            required
            className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg text-center font-bold tracking-wider focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Vérification...' : '✅ Débloquer mes essais'}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          🔒 Limité à 3 essais par connexion. Vos données sont sécurisées.
        </p>
      </div>
    </div>
  );
}
