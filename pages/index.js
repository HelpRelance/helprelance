import { useState, useEffect } from 'react';
import Head from 'next/head';
import TopBanner from '../components/TopBanner';
import Header from '../components/Header';
import HowItWorks from '../components/HowItWorks';
import WhyFreelancesLoveIt from '../components/WhyFreelancesLoveIt';
import UsageCounter from '../components/UsageCounter';
import EmailForm from '../components/EmailForm';
import EmailResults from '../components/EmailResults';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import PricingModal from '../components/PricingModal';

export default function Home() {
  const [remainingUses, setRemainingUses] = useState(1);
  const [emails, setEmails] = useState(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifyIP = async () => {
      try {
        const response = await fetch('/api/auth/verify-ip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (response.ok) {
          setUserEmail(data.user.email);
          setIsVerified(true);
          setRemainingUses(data.user.remaining_uses);
        } else {
          setRemainingUses(0);
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    verifyIP();
  }, []);

  const handleEmailsGenerated = (emailsText, formData, newRemainingUses) => {
    const parsedEmails = parseEmails(emailsText);
    setEmails(parsedEmails);
    setRemainingUses(newRemainingUses);

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
        <title>HelpRelance - Récupérez vos factures impayées en 24h</title>
        <meta
          name="description"
          content="Générez des emails de relance professionnels en 30 secondes. 85% de taux de réponse garanti."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <TopBanner onShowPricing={() => setShowPricingModal(true)} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Header />
          <HowItWorks />

          <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl p-12 mb-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Prêt à récupérer vos paiements ?
              </h2>
              <p className="text-slate-300 mb-8 text-lg max-w-2xl mx-auto">
                Rejoignez les centaines de freelances qui ont déjà récupéré leurs factures impayées grâce à HelpRelance
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
          
          {isVerified && (
            <UsageCounter
              remainingUses={remainingUses}
            />
          )}

          {!emails && isVerified && (
            <EmailForm
              userEmail={userEmail}
              remainingUses={remainingUses}
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

          <Testimonials />
          <FAQ />

          <footer className="text-center mt-16 pt-8 border-t border-slate-200 text-slate-600 text-sm space-y-3">
            <p className="font-medium">Créé avec passion pour aider les freelances à récupérer leurs paiements</p>
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
