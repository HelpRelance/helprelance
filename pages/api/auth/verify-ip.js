import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function getClientIP(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress;
  return ip || 'unknown';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const clientIP = getClientIP(req);

    const { data: ipUsers, error: ipError } = await supabase
      .from('users')
      .select('*')
      .eq('ip_address', clientIP);

    if (ipError && ipError.code !== 'PGRST116') {
      console.error('Erreur vérification IP:', ipError);
      throw ipError;
    }

    const totalUsesFromIP = ipUsers ? ipUsers.reduce((sum, u) => sum + (1 - u.remaining_uses), 0) : 0;

    if (totalUsesFromIP >= 1) {
      return res.status(429).json({ 
        error: 'Vous avez déjà utilisé votre essai gratuit. Passez à Premium pour continuer !' 
      });
    }

    const fakeEmail = 'ip-' + clientIP.replace(/\./g, '-') + '@helprelance.local';

    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', fakeEmail)
      .single();

    let user;

    if (existingUser) {
      user = existingUser;
    } else {
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({ 
          email: fakeEmail,
          email_verified: true, 
          remaining_uses: 1,
          ip_address: clientIP
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('Erreur INSERT:', insertError);
        throw insertError;
      }
      
      user = newUser;
    }

    return res.status(200).json({ 
      success: true,
      user: {
        email: user.email,
        remaining_uses: user.remaining_uses,
        is_premium: user.is_premium,
      }
    });

  } catch (error) {
    console.error('Erreur complète:', error);
    return res.status(500).json({ 
      error: 'Erreur lors de la vérification' 
    });
  }
}
