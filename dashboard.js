// dashboard.js
import * as firebaseAPI from './firebase-api.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log("🚀 Inizializzazione Dashboard TribuCoach...");
  const connStatus = document.getElementById('connection-status');
  updateConnectionStatus('🔄 Connessione a Firebase...', 'status-connecting');

  try {
    // Carica i quiz
    console.log("📡 Caricamento dati quiz...");
    const quizResults = await firebaseAPI.getAllQuizResults();
    console.log(`📊 Quiz caricati: ${quizResults.length}`);
    updateMetric('total-quizzes', quizResults.length);
    populateQuizTable(quizResults);

    // Carica i leads
    console.log("📡 Caricamento dati leads...");
    const leads = await firebaseAPI.getUsers();
    console.log(`👥 Leads caricati: ${leads.length}`);
    updateMetric('total-leads', leads.length);

    // Carica le conversazioni chatbot
    console.log("📡 Caricamento conversazioni chatbot...");
    const conversations = await firebaseAPI.getChatbotConversations();
    console.log(`💬 Conversazioni caricate: ${conversations.length}`);
    updateMetric('total-conversations', conversations.length);
    populateChatbotTable(conversations);

    updateConnectionStatus('✅ Connessione stabilita', 'status-connected');

  } catch (error) {
    console.error("❌ Errore durante il caricamento dati:", error);
    updateConnectionStatus('❌ Errore connessione Firebase', 'status-error');
  }
});

// Aggiorna connessione
function updateConnectionStatus(message, className) {
  const el = document.getElementById('connection-status');
  if (!el) return;
  el.className = `connection-status ${className}`;
  el.textContent = message;
}

// Aggiorna metrica numerica
function updateMetric(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// Popola tabella quiz
function populateQuizTable(quizResults) {
  const tbody = document.querySelector('.dashboard-section:nth-of-type(1) tbody');
  if (!tbody) return;
  if (quizResults.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="no-data">Nessun quiz disponibile</td></tr>';
    return;
  }
  tbody.innerHTML = quizResults.map(q => `
    <tr>
      <td>${q.name || '-'}</td>
      <td>${q.whatsapp || q.email || '-'}</td>
      <td>${q.age || '-'}</td>
      <td>${q.city || '-'}</td>
      <td>${q.gender || '-'}</td>
      <td>${q.profile || '-'}</td>
      <td>${q.score || '-'}</td>
      <td>${formatDate(q.timestamp)}</td>
    </tr>
  `).join('');
}

// Popola tabella chatbot
function populateChatbotTable(conversations) {
  const tbody = document.querySelector('.dashboard-section:nth-of-type(2) tbody');
  if (!tbody) return;
  if (conversations.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="no-data">Nessuna conversazione disponibile</td></tr>';
    return;
  }
  tbody.innerHTML = conversations.map(c => `
    <tr>
      <td>${c.total || '-'}</td>
      <td>${c.active || '-'}</td>
      <td>${c.avgDuration || '-'}</td>
      <td>${c.interests || '-'}</td>
      <td>${c.needs || '-'}</td>
    </tr>
  `).join('');
}

// Format timestamp
function formatDate(ts) {
  if (!ts) return '-';
  const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  return d.toLocaleString('it-IT');
}
