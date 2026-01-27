export default function FAQ() {
  const faqs = [
    {
      question: "Comment fonctionne HelpRelance ?",
      answer: "Vous remplissez un formulaire avec les détails de votre situation (type de service, client, délai...) et notre IA génère instantanément 3 versions d'emails de relance personnalisés et professionnels."
    },
    {
      question: "Combien d'emails puis-je générer ?",
      answer: "Avec la formule Pro, vous pouvez générer jusqu'à 50 emails par mois. Avec Premium, les emails sont illimités."
    },
    {
      question: "Puis-je personnaliser le ton des emails ?",
      answer: "Oui ! Vous pouvez choisir parmi plusieurs tons : professionnel et neutre, amical et décontracté, ferme mais respectueux, ou urgent et direct."
    },
    {
      question: "Les emails sont-ils vraiment efficaces ?",
      answer: "Nos emails sont optimisés pour obtenir un taux de réponse de 85%. Ils sont personnalisés selon votre situation et respectent les meilleures pratiques de communication professionnelle."
    },
    {
      question: "Puis-je annuler mon abonnement à tout moment ?",
      answer: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre espace client. Aucun engagement de durée."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Absolument. Toutes vos données sont cryptées et sécurisées. Nous ne partageons jamais vos informations avec des tiers."
    }
  ];

  return (
    <section className="mb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Questions fréquentes
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Tout ce que vous devez savoir sur HelpRelance
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:border-amber-500 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-start gap-4 mb-3">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 text-lg leading-tight">
                {faq.question}
              </h3>
            </div>
            <p className="text-slate-600 leading-relaxed pl-12">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
