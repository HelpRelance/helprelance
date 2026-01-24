import { useState } from 'react';

export default function EmailVerificationModal({ isOpen, onClose, onVerified }) {
  const [step, setStep] = useState('email'); // 'email' ou 'code'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep('code');
        alert('✅ Code envoyé ! Vérifiez votre boîte email (et spam).');
      } else {
        setError(data.error || 'Erreur lors de l\'envoi');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('helprelance_email', email);
        localStorage.setItem('helprelance_verified', 'true');
        onVerified(data.user);
        setEmail('');
        setCode('');
        setStep('email');
      } else {
        setError(data.error || 'Code invalide');
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

        {step === 'email' ? (
          <>
            <h2 className="text-3xl font-bold text-emerald-900 mb-4">
              🎁 Débloquez vos 3 essais gratuits
            </h2>
            <p className="text-gray-600 mb-6">
              Entrez votre email pour recevoir un code de vérification et débloquer vos essais.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSendCode} className="space-y-4">
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
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition disabled:opacity-50"
              >
                {isLoading ? 'Envoi...' : '📧 Recevoir le code'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-emerald-900 mb-4">
              🔐 Entrez votre code
            </h2>
            <p className="text-gray-600 mb-2">
              Un code à 6 chiffres a été envoyé à :
            </p>
            <p className="font-bold text-emerald-600 mb-6">{email}</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                required
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg text-center text-2xl font-bold tracking-widest focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={isLoading || code.length !== 6}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition disabled:opacity-50"
              >
                {isLoading ? 'Vérification...' : '✅ Vérifier'}
              </button>
            </form>

            <button
              onClick={() => setStep('email')}
              className="w-full mt-4 text-sm text-gray-600 hover:text-emerald-600"
            >
              ← Changer d'email
            </button>
          </>
        )}

        <p className="text-xs text-gray-500 mt-4 text-center">
          🔒 Vos données sont sécurisées et ne seront jamais partagées.
        </p>
      </div>
    </div>
  );
}
