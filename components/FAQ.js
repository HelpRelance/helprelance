export default function FAQ() {
  const faqs = [
    {
      question: 'Est-ce que mes données sont sécurisées ?',
      answer: 'Absolument. Nous ne stockons aucune information sensible. Les données du formulaire sont utilisées uniquement pour générer vos emails et ne sont jamais partagées avec des tiers. Votre email est sécurisé et vous pouvez vous désinscrire à tout moment.',
    },
    {
      question: 'Puis-je vraiment récupérer mes paiements avec ça ?',
      answer: "Nos utilisateurs ont un taux de réponse de 85% après la deuxième relance. Les emails sont conçus pour être polis mais fermes, créant juste assez d'urgence sans être agressifs. Bien sûr, le résultat dépend aussi de votre situation, mais HelpRelance maximise vos chances de succès.",
    },
    {
      question: 'Combien de temps ça prend ?',
      answer: "30 secondes pour remplir le formulaire, puis 5-10 secondes pour générer vos 3 emails. Total : moins d'une minute pour avoir des emails professionnels prêts à envoyer. C'est 20x plus rapide que de les écrire vous-même.",
    },
    {
      question: 'Est-ce que je peux personnaliser les emails ?',
      answer: "Oui ! Les emails générés sont déjà personnalisés avec le nom du client et les détails que vous fournissez. Vous recevez 3 versions (courte, standard, détaillée) et vous pouvez les modifier avant de les envoyer. Ce sont des bases solides que vous pouvez ajuster à votre style.",
    },
    {
      question: 'Que se passe-t-il après mes 3 essais gratuits ?',
      answer: "Après vos 3 essais, vous pouvez passer au plan Pro (7€/mois) pour des emails illimités + historique + rappels automatiques. Vous pouvez aussi rester en gratuit si vous êtes satisfait, mais vous ne pourrez plus générer de nouveaux emails. Aucun engagement, annulation en 1 clic.",
    },
    {
      question: 'C\'est compatible avec Gmail, Outlook, etc. ?',
      answer: "100% compatible ! Vous copiez simplement l'email généré et le collez dans n'importe quelle messagerie : Gmail, Outlook, Apple Mail, Thunderbird, etc. Ça fonctionne partout.",
    },
    {
      question: 'Je ne suis pas doué en écriture, est-ce que ça va marcher pour moi ?',
      answer: "C'est exactement pour ça qu'on a créé HelpRelance ! Vous n'avez pas besoin d'être bon en écriture. Vous remplissez un formulaire simple (cases à cocher + quelques mots), et l'IA fait tout le travail. Les emails sont automatiquement pros, polis et efficaces.",
    },
  ];

  return (
    <section className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Questions fréquentes 💬
      </h2>

      <div className="max-w-3xl mx-auto space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className={index !== faqs.length - 1 ? 'border-b border-gray-200 pb-6' : 'pb-6'}>
            <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-start">
              <span className="text-emerald-600 mr-3">Q:</span>
              {faq.question}
            </h3>
            <p className="text-gray-600 ml-8">{faq.answer}</p>
          </div>
        ))}
      </div>

      {/* CTA après FAQ */}
      <div className="mt-10 text-center bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
        <p className="text-lg font-semibold text-gray-800 mb-3">
          Vous avez d'autres questions ?
        </p>
        <a
          href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@helprelance.com'}`}
          className="text-emerald-600 font-bold hover:underline"
        >
          📧 Contactez-nous à {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@helprelance.com'}
        </a>
      </div>
    </section>
  );
}
