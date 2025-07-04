export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages } = req.body;

    // Chiamata diretta a Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        system: `Sei Andrea Padoan, personal trainer di Verona. Rispondi in italiano, sii motivante e professionale. Offri consigli su fitness, alimentazione e motivazione.`,
        messages: messages || [{ role: 'user', content: 'Ciao!' }]
      })
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'Ciao! Come posso aiutarti con il tuo allenamento?';

    return res.status(200).json({
      success: true,
      reply: reply
    });

  } catch (error) {
    console.error('Errore:', error);
    return res.status(500).json({
      success: false,
      reply: 'Mi dispiace, c\'è stato un problema tecnico. Riprova!'
    });
  }
}
