export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Choisissez votre formule",
      description: "Sélectionnez l'abonnement qui correspond à vos besoins professionnels."
    },
    {
      number: "02",
      title: "Renseignez les détails",
      description: "Indiquez le contexte de votre relance en quelques clics seulement."
    },
    {
      number: "03",
      title: "Recevez vos emails",
      description: "L'IA génère 3 versions adaptées à votre situation en 30 secondes."
    }
  ];

  return (
    <section className="mb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Comment ça fonctionne
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Un processus simple et efficace pour récupérer vos paiements
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-100 h-full">
              <div className="text-6xl font-bold text-amber-500/20 mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
