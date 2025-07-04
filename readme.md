# TribuCoach Backend

Backend API per la chat di TribuCoach - Il coach virtuale di Andrea Padoan powered by Claude AI.

## 🚀 Setup Rapido

### 1. Carica su GitHub

1. Crea un nuovo repository su GitHub chiamato `tribucoach-backend`
2. Carica questi file:
   - `api/chat.js`
   - `package.json`
   - `vercel.json`
   - `README.md`

### 2. Collega a Vercel

1. Vai su [vercel.com](https://vercel.com)
2. Clicca "Import Project"
3. Seleziona il repository `tribucoach-backend`
4. Deploy automatico!

### 3. Environment Variables

Aggiungi su Vercel queste variabili:

```
ANTHROPIC_API_KEY=your_claude_api_key_here
```

## 📁 Struttura Progetto

```
tribucoach-backend/
├── api/
│   └── chat.js          # Endpoint principale
├── package.json         # Dipendenze
├── vercel.json         # Config Vercel
└── README.md           # Questo file
```

## 🔧 Endpoint API

### POST /api/chat

Endpoint principale per la chat con Andrea Padoan (Claude AI).

**Request:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Ciao Andrea, mi serve un allenamento",
      "timestamp": "2024-01-XX"
    }
  ],
  "conversationId": "conv_123456",
  "customerName": "Mario",
  "customerPhone": "+39123456789",
  "customerEmail": "mario@email.com"
}
```

**Response:**
```json
{
  "success": true,
  "reply": "Ciao Mario! 👋 Dimmi, che tipo di allenamento stai cercando?",
  "conversationId": "conv_123456",
  "timestamp": "2024-01-XX"
}
```

## ✅ Features

- ✅ CORS configurato per Netlify
- ✅ Gestione errori avanzata
- ✅ Logging per debug
- ✅ Personalità Andrea Padoan
- ✅ Rate limiting gestito da Vercel
- ✅ Responses ottimizzate per fitness/coaching

## 🛡️ Sicurezza

- API key protetta tramite environment variables
- CORS configurato specificamente
- Input validation
- Error handling sicuro

## 📞 Support

Per problemi tecnici, contatta Andrea Padoan:
- Email: andrea.padoan@gmail.com
- Tel: +39 347 888 1515
- Web: personaltrainerverona.it

---

**Made with ❤️ by Andrea Padoan - Personal Trainer Verona**