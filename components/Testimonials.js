export default function Testimonials() {
  const testimonials = [
    {
      initial: 'S',
      name: 'Sophie M.',
      role: 'Designer freelance',
      text: "J'ai récupéré 1200€ de factures impayées grâce à HelpRelance en 1 semaine. Les emails sont parfaits !",
    },
    {
      initial: 'M',
      name: 'Marc L.',
      role: 'Développeur web',
      text: 'Plus besoin de stresser à chaque relance. Je gagne 2h par semaine minimum avec cet outil.',
    },
    {
      initial: 'A',
      name: 'Amélie K.',
      role: 'Consultante marketing',
      text: 'Les emails sont tellement pros que mes clients répondent en moins de 24h maintenant !',
    },
  ];

  return (
    <section className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Ce qu'ils en disent ⭐⭐⭐⭐⭐
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="border-l-4 border-emerald-500 pl-4 bg-emerald-50 p-4 rounded-r-lg"
          >
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                {testimonial.initial}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{testimonial.name}</p>
                <p className="text-xs text-gray-500">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-gray-700 italic">{testimonial.text}</p>
            <p className="text-sm text-emerald-600 mt-2">⭐⭐⭐⭐⭐</p>
          </div>
        ))}
      </div>
    </section>
  );
}
