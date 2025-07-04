// api/chat.js - Backend completo per TribuCoach
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  // CORS Headers - FONDAMENTALI per permettere richieste dal frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Gestisci preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Solo POST ammessi
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method Not Allowed' 
    });
  }

  try {
    const { messages, conversationId, customerName, customerPhone, customerEmail } = req.body;

    console.log('📨 Richiesta ricevuta:', {
      messagesCount: messages?.length,
      conversationId,
      customerInfo: { customerName, customerPhone, customerEmail }
    });

    // Validazione input
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Messages array required' 
      });
    }

    // Prepara il prompt di sistema per Andrea Padoan
    const systemPrompt = `Sei Andrea Padoan, un personal trainer professionista di Verona specializzato in coaching personalizzato. 

🎯 LA TUA PERSONALITÀ:
- Professionale ma amichevole e motivante
- Esperto in fitness, alimentazione e motivazione
- Parli sempre in italiano con un tono caldo e coinvolgente
- Usi emoji per rendere i messaggi più vivaci
- Sei diretto e pratico nei consigli

🏋️ LE TUE COMPETENZE:
- Allenamenti personalizzati (casa, palestra, calisthenics)
- Piani alimentari su misura
- Motivazione e coaching mentale
- Ricomposizione corporea
- Rehabilitation e prevenzione infortuni

📞 I TUOI SERVIZI:
- Personal Training 1:1 a Verona
- Coaching online
- Consulenze alimentari
- Piani di allenamento personalizzati
- Ebook fitness e nutrizione

💡 COME RISPONDI:
- Fai sempre domande per personalizzare i consigli
- Offri soluzioni pratiche e immediate
- Motiva sempre l'utente
- Se appropriato, menziona i tuoi servizi professionali
- Mantieni un tono professionale ma amichevole

🚫 NON FARE MAI:
- Non sostituire mai il parere medico
- Non dare consigli medici specifici
- Non promettere risultati impossibili

Rispondi sempre come Andrea Padoan, il personal trainer di Verona.`;

    // Prepara i messaggi per Claude
    const claudeMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }));

    console.log('🤖 Invio a Claude:', {
      systemPrompt: systemPrompt.substring(0, 100) + '...',
      messagesCount: claudeMessages.length
    });

    // Chiamata a Claude
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      temperature: 0.7,
      system: systemPrompt,
      messages: claudeMessages
    });

    console.log('✅ Risposta da Claude ricevuta:', {
      responseLength: response.content[0]?.text?.length,
      usage: response.usage
    });

    const reply = response.content[0]?.text || 'Mi dispiace, non sono riuscito a elaborare una risposta. Riprova!';

    // Risposta di successo
    return res.status(200).json({
      success: true,
      reply: reply,
      conversationId: conversationId,
      customerName: customerName,
      customerPhone: customerPhone,
      customerEmail: customerEmail,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Errore backend:', error);
    
    // Gestione errori specifici
    let errorMessage = 'Errore interno del server';
    
    if (error.status === 401) {
      errorMessage = 'Errore di autenticazione con Claude';
    } else if (error.status === 429) {
      errorMessage = 'Troppi request, riprova tra poco';
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'Errore di connessione';
    }

    return res.status(500).json({
      success: false,
      reply: `Mi dispiace, c'è stato un problema tecnico. ${errorMessage} 🔧`,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}
