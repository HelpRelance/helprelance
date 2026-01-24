export default function HowItWorks() {
  return (
    <section className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-xl p-8 mb-8 text-white animate-fadeIn">
      <h2 className="text-3xl font-bold mb-8 text-center">Comment ça marche ?</h2>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {/* Étape 1 */}
        <div className="text-center">
          <div className="bg-white text-emerald-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
            1
          </div>
          <h3 className="font-bold text-xl mb-3">Remplissez le formulaire</h3>
          <p className="text-emerald-50">
            Type de service, situation, ton souhaité... Tout est simple et rapide (30 secondes chrono)
          </p>
        </div>
        
        {/* Étape 2 */}
        <div className="text-center">
          <div className="bg-white text-emerald-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
            2
          </div>
          <h3 className="font-bold text-xl mb-3">Obtenez 3 versions d'emails</h3>
          <p className="text-emerald-50">
            Notre IA génère 3 emails professionnels adaptés : court, standard et détaillé. Vous choisissez celui qui vous convient
          </p>
        </div>
        
        {/* Étape 3 */}
        <div className="text-center">
          <div className="bg-white text-emerald-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
            3
          </div>
          <h3 className="font-bold text-xl mb-3">Copiez et envoyez</h3>
          <p className="text-emerald-50">
            Un clic pour copier, collez dans votre messagerie, et voilà ! 85% de chances de recevoir une réponse sous 24h
          </p>
        </div>
      </div>
      
      {/* Résultat final */}
      <div className="mt-10 text-center bg-white/10 backdrop-blur rounded-xl p-6 max-w-2xl mx-auto border border-white/20">
        <p className="text-2xl font-bold mb-2">📊 Résultat moyen</p>
        <p className="text-lg">
          Les utilisateurs récupèrent <span className="text-3xl font-bold text-yellow-300">85%</span> de leurs paiements en moins d'une semaine
        </p>
      </div>
    </section>
  );
}
