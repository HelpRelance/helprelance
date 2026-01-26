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

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden group"
          >
            <summary className="px-6 py-5 cursor-pointer list-none flex items-center justify-between font-semibold text-slate-900 hover:bg-slate-50 transition">
              <span>{faq.question}</span>
              <svg
                className="w-5 h-5 text-amber-500 transform group-open:rotate-180 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-6 pb-5 text-slate-600 leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
