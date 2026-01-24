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
import EmailVerificationModal from '../components/EmailVerificationModal';
import PricingModal from '../components/PricingModal';

export default function Home() {
  const [remainingUses, setRemainingUses] = useState(0);
  const [emails, setEmails] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('helprelance_email');
    const verified = localStorage.getItem('helprelance_verified');

    if (storedEmail && verified === 'true') {
      setUserEmail(storedEmail);
      setIsVerified(true);
    } else {
      setTimeout(() => {
        setShowEmailModal(true);
      }, 2000);
    }
  }, []);

  const handleEmailVerified = (user) => {
    setUserEmail(user.email);
    setIsVerified(true);
    setRemainingUses(user.remaining_uses);
    setShowEmailModal(false);
    alert('✅ Email vérifié ! Vous avez ' + user.remaining_uses + ' essais gratuits.');
  };

  const handleEmailModalClose = () => {
    setShowEmailModal(false);
    setTimeout(() => {
      setShowPricingModal(true);
    }, 500);
  };

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

  const handleReopenEmailModal = () => {
    setShowPricingModal(false);
    setShowEmailModal(true);
  };

  return (
    <>
      <Head>
        <title>HelpRelance - Récupérez vos factures impayées en 24h</title>
        <meta
          name="description"
          content="Générez des emails de relance professionnels en 30 secondes. 85% de taux de réponse garanti. Essai gratuit !"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <TopBanner onShowPricing={() => setShowPricingModal(true)} />

      <div className="container mx-auto px-4 py-8 max-w-4xl bg-gradient-to-br from-emerald-50 to-teal-100 min-h-screen">
        <Header />
        <HowItWorks />
        <WhyFreelancesLoveIt />
        
        {isVerified && (
          <UsageCounter
            remainingUses={remainingUses}
            onShowPricing={() => setShowPricingModal(true)}
          />
        )}

        {!emails && (
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

      <EmailVerificationModal
        isOpen={showEmailModal}
        onClose={handleEmailModalClose}
        onVerified={handleEmailVerified}
      />

      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        onReopenEmailModal={handleReopenEmailModal}
      />
    </>
  );
}
