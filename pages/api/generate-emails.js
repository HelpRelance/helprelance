import Anthropic from '@anthropic-ai/sdk';
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
    const { formData, userEmail } = req.body;

    if (!formData || !userEmail) {
      return res.status(400).json({ error: 'Données manquantes' });
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', userEmail)
      .eq('email_verified', true)
      .single();

    if (userError || !user) {
      return res.status(401).json({ error: 'Utilisateur non vérifié' });
    }

    if (!user.is_premium && user.remaining_uses <= 0) {
      return res.status(429).json({ 
        error: 'Plus d\'essais gratuits disponibles. Passez à Premium !' 
      });
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const promptParts = [
      'Tu es un expert en communication freelance. Génère 3 emails de relance professionnels basés sur ces informations :',
      '',
      '- Service proposé : ' + formData.serviceType,
      '- Type de relance : ' + formData.relanceType,
      '- Délai sans réponse : ' + formData.delayTime,
      '- Nombre de relances déjà faites : ' + formData.previousFollowups,
      '- Ton souhaité : ' + formData.tone,
    ];

    if (formData.clientName) {
      promptParts.push('- Prénom du client : ' + formData.clientName);
    }
    if (formData.detail) {
      promptParts.push('- Détail à mentionner : ' + formData.detail);
    }

    promptParts.push('');
    promptParts.push('INSTRUCTIONS IMPORTANTES :');
    promptParts.push('1. Génère exactement 3 emails : un court (3-4 lignes), un standard (6-8 lignes), et un détaillé (10-12 lignes)');
    promptParts.push('2. Pour chaque email, fournis OBLIGATOIREMENT :');
    promptParts.push('   - Un objet d\'email accrocheur et personnalisé');
    promptParts.push('   - Le corps du message');
    promptParts.push('3. Utilise ce format EXACT (respecte bien les balises) :');
    promptParts.push('');
    promptParts.push('EMAIL 1 - COURT');
    promptParts.push('OBJET: [ton objet ici]');
    promptParts.push('CORPS:');
    promptParts.push('[ton message ici]');
    promptParts.push('');
    promptParts.push('EMAIL 2 - STANDARD');
    promptParts.push('OBJET: [ton objet ici]');
    promptParts.push('CORPS:');
    promptParts.push('[ton message ici]');
    promptParts.push('');
    promptParts.push('EMAIL 3 - DÉTAILLÉ');
    promptParts.push('OBJET: [ton objet ici]');
    promptParts.push('CORPS:');
    promptParts.push('[ton message ici]');
    promptParts.push('');
    promptParts.push('RÈGLES POUR LES EMAILS :');
    promptParts.push('- Sois poli mais confiant, jamais suppliant');
    promptParts.push('- Crée un léger sentiment d\'urgence sans être agressif');
    promptParts.push('- Offre une porte de sortie au client ("Si ce n\'est plus d\'actualité...")');
    promptParts.push('- Reste professionnel même avec un ton amical');
    promptParts.push('- Utilise le prénom du client si fourni');
    promptParts.push('- Mentionne le détail spécifique si fourni');
    promptParts.push('- Adapte le niveau d\'insistance selon le nombre de relances précédentes');
    promptParts.push('- Pour les factures impayées, reste ferme mais courtois');
    promptParts.push('');
    promptParts.push('Génère maintenant les 3 emails en respectant strictement le format ci-dessus.');

    const prompt = promptParts.join('\n');

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const emailsText = message.content[0].text;

    if (!user.is_premium) {
      await supabase
        .from('users')
        .update({ 
          remaining_uses: user.remaining_uses - 1,
          last_used_at: new Date().toISOString()
        })
        .eq('email', userEmail);
    }

    return res.status(200).json({
      success: true,
      emailsText,
      remainingUses: user.is_premium ? 999 : user.remaining_uses - 1,
    });

  } catch (error) {
    console.error('Error generating emails:', error);
    
    if (error.status === 401) {
      return res.status(401).json({ error: 'Clé API invalide' });
    }
    
    if (error.status === 400) {
      return res.status(400).json({ error: 'Crédit insuffisant. Ajoutez des crédits sur console.anthropic.com' });
    }
    
    return res.status(500).json({ error: 'Erreur lors de la génération' });
  }
}
