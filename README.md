# 🚀 HelpRelance - Application Next.js

Générateur d'emails de relance professionnels pour freelances, construit avec Next.js, React et Tailwind CSS.

## ✨ Fonctionnalités

- ✅ **Backend sécurisé** : Clé API Claude cachée côté serveur
- ✅ **Interface moderne** : Design Tailwind CSS professionnel
- ✅ **Statistiques en temps réel** : Animations et compteurs dynamiques
- ✅ **Collecte d'emails** : Modal pour débloquer les essais gratuits
- ✅ **Système de pricing** : Plans gratuit, Pro et Premium
- ✅ **3 versions d'emails** : Court, standard et détaillé
- ✅ **Historique** : Sauvegarde locale des emails générés
- ✅ **FAQ complète** : Répond à toutes les objections
- ✅ **Témoignages** : Preuve sociale intégrée
- ✅ **Responsive** : Fonctionne parfaitement sur mobile

---

## 📦 Installation

### 1. Prérequis

- Node.js 18+ installé sur votre machine
- npm ou yarn
- Une clé API Claude (Anthropic)

### 2. Installation des dépendances

```bash
cd helprelance-nextjs
npm install
```

Cela installera automatiquement :
- Next.js
- React
- Tailwind CSS
- Anthropic SDK
- Et toutes les dépendances nécessaires

---

## ⚙️ Configuration

### 1. Variables d'environnement

Ouvrez le fichier `.env.local` et remplacez les valeurs :

```env
# OBLIGATOIRE : Votre clé API Claude
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxx

# OPTIONNEL : Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# OPTIONNEL : Email de contact
NEXT_PUBLIC_CONTACT_EMAIL=contact@helprelance.com
```

**Comment obtenir une clé API Claude :**
1. Allez sur https://console.anthropic.com
2. Créez un compte (gratuit)
3. Allez dans "API Keys"
4. Cliquez "Create Key"
5. Copiez la clé et collez-la dans `.env.local`

---

## 🚀 Lancement en développement

```bash
npm run dev
```

L'application sera accessible sur **http://localhost:3000**

---

## 🏗️ Build pour la production

```bash
npm run build
npm start
```

---

## 🌐 Déploiement sur Vercel (RECOMMANDÉ)

Vercel est la plateforme créée par l'équipe de Next.js. C'est **gratuit** et ultra-simple :

### Méthode 1 : Déploiement automatique avec GitHub

1. Créez un compte sur https://vercel.com
2. Connectez votre compte GitHub
3. Uploadez ce projet sur GitHub
4. Dans Vercel, cliquez "New Project"
5. Importez votre repo GitHub
6. **IMPORTANT** : Ajoutez vos variables d'environnement :
   - `ANTHROPIC_API_KEY` : Votre clé API
   - `NEXT_PUBLIC_GA_ID` : Votre ID Google Analytics (optionnel)
   - `NEXT_PUBLIC_CONTACT_EMAIL` : Votre email
7. Cliquez "Deploy"
8. **C'est tout ! Votre site est en ligne** 🎉

### Méthode 2 : Déploiement CLI

```bash
npm install -g vercel
vercel login
vercel
```

Suivez les instructions et ajoutez vos variables d'environnement quand demandé.

### ⚠️ IMPORTANT : Variables d'environnement sur Vercel

Dans Vercel Dashboard → Settings → Environment Variables, ajoutez :
- `ANTHROPIC_API_KEY` (Production + Preview + Development)
- Autres variables si nécessaire

---

## 📁 Structure du projet

```
helprelance-nextjs/
├── components/           # Composants React réutilisables
│   ├── Header.js        # En-tête avec stats
│   ├── HowItWorks.js    # Section "Comment ça marche"
│   ├── EmailForm.js     # Formulaire principal
│   ├── EmailResults.js  # Affichage des résultats
│   ├── PricingModal.js  # Modal de pricing
│   └── ...
├── pages/
│   ├── api/
│   │   └── generate-emails.js  # API route sécurisée
│   ├── _app.js          # Configuration Next.js
│   └── index.js         # Page principale
├── styles/
│   └── globals.css      # Styles globaux + Tailwind
├── .env.local           # Variables d'environnement (À NE PAS COMMITER)
├── package.json         # Dépendances
├── next.config.js       # Config Next.js
└── tailwind.config.js   # Config Tailwind CSS
```

---

## 🔒 Sécurité

### La clé API est SÉCURISÉE

Contrairement à la version HTML, votre clé API Claude est **cachée côté serveur** :

- ✅ Le navigateur ne voit jamais la clé
- ✅ Impossible de la voler en inspectant le code
- ✅ Les requêtes passent par votre backend (`/api/generate-emails`)
- ✅ Seul votre serveur communique avec l'API Claude

### Protection supplémentaire

Le fichier `.gitignore` empêche `.env.local` d'être commité sur GitHub.

---

## 💰 Coûts

### Hébergement
- **Vercel** : GRATUIT jusqu'à 100GB de bande passante/mois
- Largement suffisant pour démarrer

### API Claude
- **5$ GRATUITS** offerts par Anthropic
- Après : ~0,003$ par email généré
- Avec 5$ → ~1600 emails générés

### Total pour démarrer
**0€** (tout est gratuit au début)

---

## 🎨 Personnalisation

### Changer les couleurs

Modifiez `tailwind.config.js` :

```javascript
theme: {
  extend: {
    colors: {
      primary: '#10b981',  // Vert actuel
      // Changez en bleu : '#3b82f6'
      // Changez en violet : '#8b5cf6'
    }
  }
}
```

Puis dans les composants, remplacez :
- `emerald` par `blue` ou `purple`
- `teal` par `cyan` ou `violet`

### Modifier les textes

Tous les textes sont dans les composants :
- Slogan : `components/Header.js`
- FAQ : `components/FAQ.js`
- Témoignages : `components/Testimonials.js`

---

## 📊 Analytics (Optionnel)

### Google Analytics

1. Créez un compte sur https://analytics.google.com
2. Créez une propriété "HelpRelance"
3. Copiez votre ID (G-XXXXXXXXXX)
4. Ajoutez-le dans `.env.local` :
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

### Ajouter le script GA

Dans `pages/_app.js`, ajoutez :

```javascript
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* Google Analytics */}
      {process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}
          </Script>
        </>
      )}
      <Component {...pageProps} />
    </>
  );
}
```

---

## 🐛 Débogage

### L'API ne fonctionne pas

1. Vérifiez que `ANTHROPIC_API_KEY` est bien dans `.env.local`
2. Redémarrez le serveur : `Ctrl+C` puis `npm run dev`
3. Vérifiez les logs dans le terminal
4. Testez votre clé API sur https://console.anthropic.com

### Les emails ne se génèrent pas

1. Ouvrez la console du navigateur (F12)
2. Regardez les erreurs réseau
3. Vérifiez que l'API route répond : http://localhost:3000/api/generate-emails

### Erreur "Module not found"

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

---

## 📝 TODO / Améliorations futures

- [ ] Intégration Stripe pour les paiements
- [ ] Système d'historique complet avec modal
- [ ] Email automation (séquences)
- [ ] Export PDF des emails
- [ ] Multilingue (EN/FR)
- [ ] Dashboard utilisateur
- [ ] Blog SEO

---

## 🤝 Support

Des questions ? Contactez-nous :
- Email : contact@helprelance.com
- GitHub Issues : (lien vers votre repo)

---

## 📄 Licence

MIT License - Utilisez librement pour vos projets

---

## 🎉 Félicitations !

Vous avez maintenant une application Next.js professionnelle, sécurisée et prête à lancer !

**Prochaines étapes :**
1. Configurez votre `.env.local`
2. Lancez `npm run dev` pour tester
3. Déployez sur Vercel
4. Partagez sur les réseaux sociaux
5. Collectez vos premiers emails !

Bon lancement ! 🚀
