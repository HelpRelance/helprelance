import { useState } from 'react';

export default function EmailResults({ emails, onReset, onSave, onShowHistory }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyEmail = (emailNum) => {
    const email = emails[emailNum - 1];
    const fullEmail = `Objet: ${email.subject}\n\n${email.body}`;

    navigator.clipboard.writeText(fullEmail).then(() => {
      setCopiedIndex(emailNum);
      setTimeout(() => setCopiedIndex(null), 2000);
    }).catch(() => {
      alert('❌ Erreur lors de la copie. Copiez manuellement le texte.');
    });
  };

  return (
    <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Vos 3 emails de relance 📧</h2>
        <button
          onClick={onSave}
          className="text-sm bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-200 transition"
        >
          💾 Sauvegarder
        </button>
      </div>
      <p className="text-gray-600 mb-6">
        Choisissez celui qui vous convient le mieux et cliquez pour copier !
      </p>

      <div className="space-y-6">
        {/* Email 1 - Court */}
        <div className="email-card border-2 border-gray-200 rounded-xl p-6 hover:border-emerald-400 hover:shadow-lg transition">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-emerald-600">📝 Version Courte (3-4 lignes)</h3>
            <button
              onClick={() => copyEmail(1)}
              className="copy-btn bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-2 rounded-lg text-sm font-semibold"
            >
              {copiedIndex === 1 ? '✅ Copié !' : '📋 Copier'}
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-2 font-semibold">OBJET :</p>
            <p className="font-semibold text-gray-800 mb-4">{emails[0].subject}</p>
            <p className="text-xs text-gray-500 mb-2 font-semibold">MESSAGE :</p>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{emails[0].body}</p>
          </div>
        </div>

        {/* Email 2 - Standard */}
        <div className="email-card border-2 border-gray-200 rounded-xl p-6 hover:border-emerald-400 hover:shadow-lg transition">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-emerald-600">📨 Version Standard (6-8 lignes)</h3>
            <button
              onClick={() => copyEmail(2)}
              className="copy-btn bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-2 rounded-lg text-sm font-semibold"
            >
              {copiedIndex === 2 ? '✅ Copié !' : '📋 Copier'}
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-2 font-semibold">OBJET :</p>
            <p className="font-semibold text-gray-800 mb-4">{emails[1].subject}</p>
            <p className="text-xs text-gray-500 mb-2 font-semibold">MESSAGE :</p>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{emails[1].body}</p>
          </div>
        </div>

        {/* Email 3 - Détaillé */}
        <div className="email-card border-2 border-gray-200 rounded-xl p-6 hover:border-emerald-400 hover:shadow-lg transition">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-emerald-600">📬 Version Détaillée (10-12 lignes)</h3>
            <button
              onClick={() => copyEmail(3)}
              className="copy-btn bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-2 rounded-lg text-sm font-semibold"
            >
              {copiedIndex === 3 ? '✅ Copié !' : '📋 Copier'}
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-2 font-semibold">OBJET :</p>
            <p className="font-semibold text-gray-800 mb-4">{emails[2].subject}</p>
            <p className="text-xs text-gray-500 mb-2 font-semibold">MESSAGE :</p>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{emails[2].body}</p>
          </div>
        </div>
      </div>

      {/* Actions post-génération */}
      <div className="mt-8 flex gap-4 justify-center">
        <button
          onClick={onReset}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition"
        >
          🔄 Générer un autre email
        </button>
        <button
          onClick={onShowHistory}
          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold py-3 px-6 rounded-lg transition"
        >
          📚 Voir mon historique
        </button>
      </div>
    </section>
  );
}
