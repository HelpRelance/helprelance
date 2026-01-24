import { useState } from 'react';
import Head from 'next/head';
import TopBanner from '../components/TopBanner';
import Header from '../components/Header';
import HowItWorks from '../components/HowItWorks';
import WhyFreelancesLoveIt from '../components/WhyFreelancesLoveIt';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import PricingModal from '../components/PricingModal';

export default function Home() {
  const [showPricingModal, setShowPricingModal] = useState(false);

  return (
    <>
      <Head>
        <title>HelpRelance - Récupérez vos factures impayées en 24h</title>
        <meta
          name="description"
          content="Générez des emails de relance professionnels en 30 secondes. 85% de taux de réponse garanti."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <TopBanner onShowPricing={() => setShowPricingModal(true)} />

      <div className="container mx-auto px-4 py-8 max-w-4xl bg-gradient-to-br from-emerald-50 to-teal-100 min-h-screen">
        <Header />
        <HowItWorks />
        <WhyFreelancesLoveIt />

        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center">
          <h2 className="text-3xl font-bold text-emerald-900 mb-4">
            🚀 Prêt à récupérer votre argent ?
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Choisissez votre formule et commencez à générer des emails de relance professionnels dès maintenant.
          </p>
          <button
            onClick={() => setShowPricingModal(true)}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-4 px-8 rounded-lg hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition duration-300 shadow-lg text-xl"
          >
            💰 Voir les formules
          </button>
        </section>

        <Testimonials />
        <FAQ />

        <footer className="text-center mt-12 text-gray-600 text-sm space-y-2">
          <p>Créé avec ❤️ pour aider les freelances à récupérer leurs paiements</p>
          <div className="flex justify-center gap-4 text-xs">
            <a href="#" className="hover:text-emerald-600">Politique de confidentialité</a>
            <span>•</span>
            <a href="#" className="hover:text-emerald-600">Conditions d'utilisation</a>
            <span>•</span>
            <a href={'mailto:' + (process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@helprelance.com')} className="hover:text-emerald-600">
              Contact
            </a>
          </div>
        </footer>
      </div>

      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />
    </>
  );
}
