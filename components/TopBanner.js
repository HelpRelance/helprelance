import { useState, useEffect } from 'react';

export default function TopBanner({ onShowPricing }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('banner-dismissed');
    if (dismissed) {
      setVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem('banner-dismissed', 'true');
  };

  if (!visible) return null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-3 px-4 relative">
      <div className="container mx-auto text-center">
        <p className="text-sm md:text-base font-medium">
          🎉 <strong>Nouveau :</strong> Générez vos emails de relance en 30 secondes avec l'IA
          <button
            onClick={onShowPricing}
            className="ml-4 bg-amber-500 text-slate-900 px-4 py-1 rounded-full text-sm font-bold hover:bg-amber-400 transition inline-block"
          >
            Découvrir
          </button>
        </p>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
      >
        ✕
      </button>
    </div>
  );
}
