import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Email invalide' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Erreur Supabase SELECT:', selectError);
      throw selectError;
    }

    if (existingUser) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ verification_code: verificationCode })
        .eq('email', email);
      
      if (updateError) {
        console.error('Erreur Supabase UPDATE:', updateError);
        throw updateError;
      }
    } else {
      const { error: insertError } = await supabase
        .from('users')
        .insert({ email, verification_code: verificationCode, remaining_uses: 3 });
      
      if (insertError) {
        console.error('Erreur Supabase INSERT:', insertError);
        throw insertError;
      }
    }

    console.log('');
    console.log('========================================');
    console.log('📧 EMAIL:', email);
    console.log('🔑 CODE:', verificationCode);
    console.log('========================================');
    console.log('');

    const htmlContent = '<h1>Bienvenue sur HelpRelance !</h1>' +
      '<p>Votre code de vérification est :</p>' +
      '<h2 style="font-size: 32px; letter-spacing: 5px; color: #10b981;">' + verificationCode + '</h2>' +
      '<p>Ce code est valable pendant 10 minutes.</p>';

    const emailData = await resend.emails.send({
      from: 'HelpRelance <onboarding@resend.dev>',
      to: email,
      subject: 'Votre code de vérification HelpRelance',
      html: htmlContent,
    });

    console.log('✅ Email envoyé avec succès:', emailData);

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('❌ ERREUR COMPLÈTE:', error);
    return res.status(500).json({ error: 'Erreur: ' + error.message });
  }
}
