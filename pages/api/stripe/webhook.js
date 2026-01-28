import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
  api: {
    bodyParser: false,
  },
};

const buffer = (req) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Webhook reçu:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id;
        const customerEmail = session.customer_email;

        console.log('Paiement réussi pour:', customerEmail);

        // Récupérer la subscription
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        const priceId = subscription.items.data[0].price.id;

        console.log('Price ID:', priceId);

        // Déterminer le type d'abonnement
        let updateData = {
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
        };

        if (priceId === process.env.STRIPE_PRICE_PRO) {
          // Pro
          updateData.is_premium = false;
          updateData.remaining_uses = 50;
          updateData.subscription_type = 'pro';
          console.log('Mise à jour vers Pro');
        } else if (priceId === process.env.STRIPE_PRICE_PREMIUM) {
          // Premium
          updateData.is_premium = true;
          updateData.remaining_uses = null;
          updateData.subscription_type = 'premium';
          console.log('Mise à jour vers Premium');
        } else if (priceId === 'price_1Su56vAfNQgXJOqEhuqkoXkd') {
          // Extension historique
          updateData.history_extension = true;
          console.log('Activation extension historique');
        }

        // Mettre à jour Supabase
        const { data, error } = await supabase
          .from('users')
          .update(updateData)
          .eq('email', customerEmail);

        if (error) {
          console.error('Erreur mise à jour Supabase:', error);
          throw error;
        }

        console.log('Utilisateur mis à jour avec succès');
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        console.log('Abonnement annulé pour:', customerId);

        // Réinitialiser l'utilisateur
        const { error } = await supabase
          .from('users')
          .update({
            is_premium: false,
            remaining_uses: 0,
            subscription_type: null,
            history_extension: false,
            stripe_subscription_id: null,
          })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Erreur réinitialisation Supabase:', error);
          throw error;
        }

        console.log('Utilisateur réinitialisé avec succès');
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        const priceId = invoice.lines.data[0]?.price?.id;

        console.log('Renouvellement pour:', customerId);

        // Renouveler les crédits Pro
        if (priceId === process.env.STRIPE_PRICE_PRO) {
          const { error } = await supabase
            .from('users')
            .update({ remaining_uses: 50 })
            .eq('stripe_customer_id', customerId);

          if (error) {
            console.error('Erreur renouvellement:', error);
            throw error;
          }

          console.log('Crédits Pro renouvelés');
        }
        break;
      }

      default:
        console.log('Événement non géré:', event.type);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Erreur webhook:', error);
    res.status(500).json({ error: error.message });
  }
}
