import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email et code requis' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('verification_code', code)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Code invalide ou expiré' });
    }

    await supabase
      .from('users')
      .update({ 
        email_verified: true,
        verification_code: null
      })
      .eq('email', email);

    return res.status(200).json({ 
      success: true,
      user: {
        email: user.email,
        remaining_uses: user.remaining_uses,
        is_premium: user.is_premium,
      }
    });

  } catch (error) {
    console.error('Error verifying code:', error);
    return res.status(500).json({ 
      error: 'Erreur lors de la vérification' 
    });
  }
}
