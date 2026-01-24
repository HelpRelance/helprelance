export default function WhyFreelancesLoveIt() {
  return (
    <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Pourquoi les freelances adorent HelpRelance
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center p-4">
          <div className="text-4xl mb-3">⏱️</div>
          <h3 className="font-bold text-lg mb-2">Gagnez du temps</h3>
          <p className="text-gray-600 text-sm">
            Plus besoin de réfléchir 20 minutes à chaque relance
          </p>
        </div>
        <div className="text-center p-4">
          <div className="text-4xl mb-3">💼</div>
          <h3 className="font-bold text-lg mb-2">Professionnalisme</h3>
          <p className="text-gray-600 text-sm">
            Des emails polis, confiants et efficaces à chaque fois
          </p>
        </div>
        <div className="text-center p-4">
          <div className="text-4xl mb-3">📈</div>
          <h3 className="font-bold text-lg mb-2">Résultats prouvés</h3>
          <p className="text-gray-600 text-sm">
            85% de taux de réponse après la 2ème relance
          </p>
        </div>
      </div>
    </section>
  );
}
