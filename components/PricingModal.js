import { useState } from 'react';

export default function PricingModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-4xl mx-4 shadow-2xl animate-fadeIn relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold z-10"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-emerald-900 mb-2 text-center">
          💰 Choisissez votre formule
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          Récupérez vos paiements avec des emails de relance professionnels générés par IA
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-2 border-emerald-200 rounded-xl p-6 hover:border-emerald-400 transition">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Pro</h3>
              <div className="text-4xl font-bold text-emerald-600 mb-1">7€</div>
              <div className="text-gray-500 text-sm">par mois</div>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">✓</span>
                <span className="text-gray-700"><strong>50 emails</strong> de relance par mois</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">✓</span>
                <span className="text-gray-700">3 versions par email (court, standard, détaillé)</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">✓</span>
                <span className="text-gray-700">Personnalisation du ton</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">✓</span>
                <span className="text-gray-700">Historique de vos emails</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">✓</span>
                <span className="text-gray-700">Support par email</span>
              </li>
            </ul>

            <button className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition">
              Commencer - 7€/mois
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">Annulation à tout moment</p>
          </div>

          <div className="border-4 border-emerald-600 rounded-xl p-6 relative transform hover:scale-105 transition shadow-xl">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-bold">
              RECOMMANDÉ
            </div>

            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Premium</h3>
              <div className="text-4xl font-bold text-emerald-600 mb-1">19€</div>
              <div className="text-gray-500 text-sm">par mois</div>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">✓</span>
                <span className="text-gray-700"><strong>Emails illimités</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">✓</span>
                <span className="text-gray-700">3 versions par email (court, standard, détaillé)</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">✓</span>
                <span className="text-gray-700">Personnalisation avancée</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">✓</span>
                <span className="text-gray-700">Historique illimité</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">✓</span>
                <span className="text-gray-700">Templates exclusifs</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">✓</span>
                <span className="text-gray-700">Support prioritaire</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">✓</span>
                <span className="text-gray-700">Nouvelles fonctionnalités en avant-première</span>
              </li>
            </ul>

            <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition shadow-lg">
              Commencer - 19€/mois
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">Annulation à tout moment</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">
            💳 Paiement sécurisé par Stripe • 🔒 Satisfait ou remboursé sous 14 jours
          </p>
          <p className="text-xs text-gray-500">
            En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
          </p>
        </div>
      </div>
    </div>
  );
}
