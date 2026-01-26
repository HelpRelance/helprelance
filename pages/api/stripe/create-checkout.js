import Stripe from 'stripe';

export default async function handler(req, res) {
  console.log('=== API STRIPE APPELEE ===');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, userId, userEmail } = req.body;
    
    console.log('Donnees recues:', { priceId, userId, userEmail });

    if (!priceId || !userId || !userEmail) {
      return res.status(400).json({ error: 'Donnees manquantes' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    console.log('Creation session Stripe...');

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: appUrl + '/dashboard?success=true',
      cancel_url: appUrl + '/dashboard?canceled=true',
      customer_email: userEmail,
      client_reference_id: userId,
      metadata: { userId },
    });

    console.log('Session creee avec succes:', session.id);
    return res.status(200).json({ sessionId: session.id, url: session.url });
    
  } catch (error) {
    console.error('ERREUR STRIPE:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
