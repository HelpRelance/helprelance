import { useState, useEffect } from 'react';
import Head from 'next/head';
import { createClient } from '@supabase/supabase-js';
import TopBanner from '../components/TopBanner';
import Header from '../components/Header';
import HowItWorks from '../components/HowItWorks';
import WhyFreelancesLoveIt from '../components/WhyFreelancesLoveIt';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import PricingModal from '../components/PricingModal';
import EmailForm from '../components/EmailForm';
import EmailResults from '../components/EmailResults';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [user, setUser] = useState(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [emails, setEmails] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUser(user);
        
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single();
        
        if (userData && (userData.is_premium || (userData.remaining_uses && userData.remaining_uses > 0))) {
          setHasSubscription(true);
        }
      }
    };

    checkUser();
  }, []);

  const handleEmailsGenerated = (emailsText, formData, newRemainingUses) => {
    const parsedEmails = parseEmails(emailsText);
    setEmails(parsedEmails);

    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const parseEmails = (text) => {
    const emails = [];
    
    for (let i = 1; i <= 3; i++) {
      const emailPattern = 'EMAIL ' + i;
      const nextEmailPattern = 'EMAIL ' + (i + 1);
      
      const patterns = [
        new RegExp(emailPattern + '[^\\n]*\\nOBJET:\\s*([^\\n]+)\\nCORPS:\\s*([\\s\\S]*?)(?=' + nextEmailPattern + '|$)', 'i'),
        new RegExp(emailPattern + '[^\\n]*\\nOBJET:\\s*([^\\n]+)\\s+CORPS:\\s*([\\s\\S]*?)(?=' + nextEmailPattern + '|$)', 'i')
      ];
      
      let email = null;
      for (let pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
          email = {
            subject: match[1].trim(),
            body: match[2].trim().replace(/\n{3,}/g, '\n\n')
          };
          break;
        }
      }
      
      if (email) {
        emails.push(email);
      }
    }
    
    return emails.length === 3 ? emails : null;
  };

  const handleSaveToHistory = () => {
    if (!emails) return;
    
    let history = JSON.parse(localStorage.getItem('helprelance_history') || '[]');
    history.unshift({
      emails,
      timestamp: new Date().toISOString()
    });
    
    if (history.length > 10) {
      history = history.slice(0, 10);
    }
    
    localStorage.setItem('helprelance_history', JSON.stringify(history));
    alert('💾 Email sauvegardé dans votre historique !');
  };

  const handleReset = () => {
    setEmails(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>HelpRelance - Générez vos emails de relance professionnels</title>
        <meta
          name="description"
          content="Générez des emails de relance professionnels en 30 secondes avec l'IA. 85% de taux de réponse garanti."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <TopBanner onShowPricing={() => setShowPricingModal(true)} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Header />
          
          {user && hasSubscription ? (
            <>
              {!emails && (
                <EmailForm
                  userEmail={user.email}
                  remainingUses={999}
                  onGenerate={handleEmailsGenerated}
                  onShowPricing={() => setShowPricingModal(true)}
                />
              )}

              {emails && (
                <div id="results">
                  <EmailResults
                    emails={emails}
                    onReset={handleReset}
                    onSave={handleSaveToHistory}
                    onShowHistory={() => alert('Fonctionnalité bientôt disponible !')}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <HowItWorks />

              <section className="mb-20">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                    Un formulaire simple et intuitif
                  </h2>
                  <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Remplissez quelques informations et l'IA génère 3 versions d'emails personnalisés
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto border border-slate-200">
                  <div className="space-y-6 opacity-75 pointer-events-none">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Type de service
                      </label>
                      <input
                        type="text"
                        value="Design graphique"
                        readOnly
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Type de relance
                      </label>
                      <input
                        type="text"
                        value="Facture impayée"
                        readOnly
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg bg-slate-50"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Délai sans réponse
                        </label>
                        <select className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg bg-slate-50">
                          <option>2 semaines</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Ton de l'email
                        </label>
                        <select className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg bg-slate-50">
                          <option>Professionnel et neutre</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Prénom du client
                      </label>
                      <input
                        type="text"
                        value="Marie"
                        readOnly
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Détail à mentionner
                      </label>
                      <textarea
                        value="la facture n°1234 de 850€ pour le logo de sa boutique"
                        readOnly
                        rows="2"
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg bg-slate-50 resize-none"
                      />
                    </div>

                    <button
                      disabled
                      className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold py-4 px-6 rounded-xl opacity-50 cursor-not-allowed"
                    >
                      💰 Générer mes emails de relance
                    </button>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500">
                      ⚡ En 30 secondes, vous obtenez 3 versions adaptées à votre situation
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl p-12 mb-16 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Prêt à relancer vos clients efficacement ?
                  </h2>
                  <p className="text-slate-300 mb-8 text-lg max-w-2xl mx-auto">
                    Rejoignez les centaines de freelances qui génèrent leurs emails de relance avec HelpRelance
                  </p>
                  <button
                    onClick={() => setShowPricingModal(true)}
                    className="bg-amber-500 text-slate-900 font-bold py-4 px-10 rounded-xl hover:bg-amber-400 transform hover:scale-105 transition duration-300 shadow-xl text-lg inline-flex items-center gap-2"
                  >
                    Voir les formules
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </section>

              <WhyFreelancesLoveIt />
              <Testimonials />
              <FAQ />
            </>
          )}

          <footer className="text-center mt-16 pt-8 border-t border-slate-200 text-slate-600 text-sm space-y-3">
            <p className="font-medium">Créé avec passion pour aider les freelances à suivre leurs factures impayées</p>
            <div className="flex justify-center gap-6 text-xs">
              <a href="#" className="hover:text-amber-500 transition">Politique de confidentialité</a>
              <span className="text-slate-300">•</span>
              <a href="#" className="hover:text-amber-500 transition">Conditions d'utilisation</a>
              <span className="text-slate-300">•</span>
              <a href={'mailto:' + (process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@helprelance.com')} className="hover:text-amber-500 transition">
                Contact
              </a>
            </div>
            <p className="text-xs text-slate-400 pt-2">© 2026 HelpRelance. Tous droits réservés.</p>
          </footer>
        </div>
      </div>

      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />
    </>
  );
}
