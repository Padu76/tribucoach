import { auth, db } from './firebase.js';
// TUTTI GLI IMPORT DA GSTATIC DEVONO USARE LA STESSA VERSIONE (es. 9.23.0)
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { collection, query, onSnapshot, orderBy, limit } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

// Funzione per aggiornare lo stato della connessione
function updateConnectionStatus(isConnected) {
    const statusElement = document.getElementById('connection-status');
    if (statusElement) {
        if (isConnected) {
            statusElement.className = 'connection-status status-connected';
            statusElement.textContent = '✅ Connesso a Firebase!';
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 3000); // Nasconde dopo 3 secondi
        } else {
            statusElement.className = 'connection-status status-error';
            statusElement.textContent = '❌ Errore di connessione a Firebase.';
            statusElement.style.display = 'block';
        }
    }
}

// Listener per lo stato di autenticazione Firebase (opzionale, se serve autenticazione)
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Utente Firebase autenticato:", user.uid);
        updateConnectionStatus(true);
        // Avvia i listener del database solo dopo l'autenticazione riuscita
        initFirebaseListeners();
    } else {
        console.log("Nessun utente Firebase autenticato.");
        updateConnectionStatus(false);
        // Reindirizza o mostra messaggio di accesso se necessario
    }
});


// --- Funzioni di Rendering per i Dati ---

// Renderizza i risultati dei quiz
function renderQuizResults(docs) {
    const quizTableBody = document.querySelector('#quizzes-table-body');
    if (!quizTableBody) {
        console.error("Elemento #quizzes-table-body non trovato!");
        return;
    }
    quizTableBody.innerHTML = ''; // Pulisci la tabella

    if (docs.length === 0) {
        quizTableBody.innerHTML = '<tr><td colspan="6" class="no-data">Nessun dato quiz disponibile.</td></tr>';
        return;
    }

    docs.forEach(doc => {
        const data = doc.data();
        const row = quizTableBody.insertRow();
        row.innerHTML = `
            <td>${data.name || 'N/A'}</td>
            <td>${data.email || 'N/A'}</td>
            <td>${data.profile || 'N/A'}</td>
            <td><span class="lead-score ${getLeadScoreClass(data.leadScore)}">${data.leadScore || 'N/A'}</span></td>
            <td>${data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString() : 'N/A'}</td>
            <td><button class="action-btn" onclick="viewQuizDetails('${doc.id}')">Dettagli</button></td>
        `;
    });
    updateLastUpdateTimestamp();
    console.log(`📊 Dati quiz ricevuti: ${docs.length} documenti`);
}

// Renderizza i dati dei lead
function renderLeads(docs) {
    const leadsTableBody = document.querySelector('#leads-table-body');
    if (!leadsTableBody) {
        console.error("Elemento #leads-table-body non trovato!");
        return;
    }
    leadsTableBody.innerHTML = ''; // Pulisci la tabella

    if (docs.length === 0) {
        leadsTableBody.innerHTML = '<tr><td colspan="8" class="no-data">Nessun lead disponibile.</td></tr>';
        return;
    }

    docs.forEach(doc => {
        const data = doc.data();
        const row = leadsTableBody.insertRow();
        row.innerHTML = `
            <td><span class="profile-icon">👤</span>${data.name || 'N/A'}</td>
            <td>${data.email || 'N/A'}</td>
            <td>${data.city || 'N/A'}</td>
            <td>${data.goals ? data.goals.join(', ') : 'N/A'}</td>
            <td>${data.profile || 'N/A'}</td>
            <td><span class="lead-score ${getLeadScoreClass(data.leadScore)}">${data.leadScore || 'N/A'}</span></td>
            <td>${data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString() : 'N/A'}</td>
            <td><button class="action-btn" onclick="contactLead('${doc.id}')">Contatta</button></td>
        `;
    });
    updateLastUpdateTimestamp();
    console.log(`👥 Dati leads ricevuti: ${docs.length} documenti`);
}

// Renderizza i dati delle metriche chiave
function renderMetrics(docs) {
    const metrics = docs.reduce((acc, doc) => {
        const data = doc.data();
        acc[data.id] = data.value;
        return acc;
    }, {});

    const totalLeadsElement = document.getElementById('total-leads');
    const totalQuizzesElement = document.getElementById('total-quizzes');
    const avgLeadScoreElement = document.getElementById('avg-lead-score');
    const newLeadsTodayElement = document.getElementById('new-leads-today');

    if (totalLeadsElement) totalLeadsElement.innerHTML = metrics['totalLeads'] !== undefined ? metrics['totalLeads'] : '-';
    if (totalQuizzesElement) totalQuizzesElement.innerHTML = metrics['totalQuizzes'] !== undefined ? metrics['totalQuizzes'] : '-';
    if (avgLeadScoreElement) avgLeadScoreElement.innerHTML = metrics['avgLeadScore'] !== undefined ? metrics['avgLeadScore'].toFixed(1) : '-';
    if (newLeadsTodayElement) newLeadsTodayElement.innerHTML = metrics['newLeadsToday'] !== undefined ? metrics['newLeadsToday'] : '-';

    const leadsTrendElement = document.getElementById('leads-trend');
    if (leadsTrendElement) leadsTrendElement.querySelector('.percentage').textContent = '+5%';
    const quizzesTrendElement = document.getElementById('quizzes-trend');
    if (quizzesTrendElement) quizzesTrendElement.querySelector('.percentage').textContent = '+8%';
    const scoreTrendElement = document.getElementById('score-trend');
    if (scoreTrendElement) scoreTrendElement.querySelector('.percentage').textContent = '+1.2%';
    const newLeadsTrendElement = document.getElementById('new-leads-trend');
    if (newLeadsTrendElement) newLeadsTrendElement.querySelector('.percentage').textContent = '+15%';


    updateLastUpdateTimestamp();
    console.log(`📈 Dati metrics ricevuti: ${docs.length} documenti`);
}


// Funzione helper per la classe CSS del punteggio lead
function getLeadScoreClass(score) {
    if (score >= 80) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
}

// Aggiorna il timestamp dell'ultimo aggiornamento
function updateLastUpdateTimestamp() {
    const lastUpdateElement = document.getElementById('last-update');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = new Date().toLocaleString();
    }
}

// Funzione placeholder per i dettagli del quiz (da implementare)
window.viewQuizDetails = function(quizId) {
    alert('Visualizza dettagli quiz per ID: ' + quizId);
};

// Funzione placeholder per contattare il lead (da implementare)
window.contactLead = function(leadId) {
    alert('Contatta lead con ID: ' + leadId);
};

// Funzione per il refresh dei dati
window.refreshData = function() {
    console.log("Ricaricando i dati...");
    updateLastUpdateTimestamp();
};

// --- Inizializzazione Listener Firebase ---
function initFirebaseListeners() {
    console.log("Attivazione listener Firebase...");

    // Listener per 'quiz_results'
    const quizResultsCol = collection(db, 'quiz_results');
    const qQuiz = query(quizResultsCol, orderBy('timestamp', 'desc'), limit(10));
    onSnapshot(qQuiz, (snapshot) => {
        renderQuizResults(snapshot.docs);
        console.log("🔄 Attivando listener per quiz_results...");
    }, (error) => {
        console.error("Errore nel listener quiz_results:", error);
        updateConnectionStatus(false);
    });

    // Listener per 'leads'
    const leadsCol = collection(db, 'leads');
    const qLeads = query(leadsCol, orderBy('timestamp', 'desc'), limit(20));
    onSnapshot(qLeads, (snapshot) => {
        renderLeads(snapshot.docs);
        console.log("🔄 Attivando listener per leads...");
    }, (error) => {
        console.error("Errore nel listener leads:", error);
        updateConnectionStatus(false);
    });

    // Listener per 'metrics'
    const metricsCol = collection(db, 'metrics');
    onSnapshot(metricsCol, (snapshot) => {
        renderMetrics(snapshot.docs);
        console.log("🔄 Attivando listener per metrics...");
    }, (error) => {
        console.error("Errore nel listener metrics:", error);
        updateConnectionStatus(false);
    });
}

// Avvia i listener una volta che il DOM è completamente caricato
document.addEventListener('DOMContentLoaded', () => {
    // initFirebaseListeners è ora chiamato dopo l'autenticazione in onAuthStateChanged
    // Se non usi l'autenticazione, puoi chiamarlo direttamente qui:
    initFirebaseListeners(); // Rimosso il commento qui, assumendo che tu voglia avviare i listener subito
});