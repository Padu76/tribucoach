// dashboard.js - Logica della Dashboard TribuCoach

import { getAllQuizResults, getChatbotConversations, saveQuizResult, getQuizResultById } from './firebase-api.js';

// --- UTILITIES ---
function formatDateTime(timestamp) {
    if (!timestamp) return 'N/A';
    // Firebase Timestamps hanno un metodo toDate()
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleString('it-IT', options);
}

function formatDuration(seconds) {
    if (typeof seconds !== 'number' || isNaN(seconds)) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

function getProfileIcon(profile) {
    switch (profile) {
        case 'Guerriero': return '⚔️';
        case 'Atleta': return '💪';
        case 'Nuovo Esploratore': return '🧭';
        default: return '👤';
    }
}

function updateConnectionStatus(status, message) {
    const statusDiv = document.getElementById('connection-status');
    statusDiv.textContent = message;
    statusDiv.className = `connection-status status-${status}`; // status-connected, status-error, status-connecting
}

// --- RENDERING FUNCTIONS ---

// 1️⃣ BLOCCO 1: Dati Quiz - Gestione Lead
async function renderQuizData() {
    console.log('📊 Caricamento dati quiz per BLOCCO 1...');
    updateConnectionStatus('connecting', 'Caricamento dati Firebase...');
    try {
        const quizResults = await getAllQuizResults();
        const quizTableBody = document.querySelector('#quiz-results-table-body');
        quizTableBody.innerHTML = ''; // Pulisce la tabella

        let totalScore = 0;
        let validQuizzesCount = 0;

        if (quizResults.length > 0) {
            quizResults.forEach(quiz => {
                const row = quizTableBody.insertRow();
                row.insertCell().textContent = quiz.name || 'N/A';
                row.insertCell().textContent = quiz.age || 'N/A';
                row.insertCell().textContent = quiz.email || 'N/A'; // Email, o Telefono/WhatsApp se hai il campo
                row.insertCell().textContent = quiz.city || 'N/A';
                row.insertCell().textContent = quiz.gender || 'N/A';
                row.insertCell().innerHTML = `${getProfileIcon(quiz.profile)} ${quiz.profile || 'N/A'}`;
                row.insertCell().textContent = (quiz.goals && quiz.goals.length > 0) ? quiz.goals.join(', ') : 'N/A';
                row.insertCell().textContent = quiz.activity_level || 'N/A'; // Tipo di allenamento / Livello attività
                row.insertCell().textContent = (quiz.obstacles && quiz.obstacles.length > 0) ? quiz.obstacles.join(', ') : 'N/A';
                row.insertCell().textContent = quiz.lead_score ? `${quiz.lead_score}%` : '0%';

                const dateCell = row.insertCell();
                dateCell.textContent = quiz.timestamp ? formatDateTime(quiz.timestamp) : 'N/A';

                const actionsCell = row.insertCell();
                const viewBtn = document.createElement('button');
                viewBtn.textContent = 'Dettagli';
                viewBtn.className = 'action-button';
                viewBtn.onclick = () => viewQuizDetails(quiz.id);
                actionsCell.appendChild(viewBtn);

                if (quiz.lead_score) {
                    totalScore += quiz.lead_score;
                    validQuizzesCount++;
                }
            });
            updateConnectionStatus('connected', `✅ Dati caricati: ${quizResults.length} quiz`);
        } else {
            const row = quizTableBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 12;
            cell.className = 'no-data';
            cell.textContent = 'Nessun risultato quiz trovato.';
            updateConnectionStatus('connected', '✅ Dati caricati: Nessun quiz trovato');
        }

        document.getElementById('totalQuizzes').textContent = quizResults.length;
        document.getElementById('avgQuizScore').textContent = validQuizzesCount > 0 ? `${(totalScore / validQuizzesCount).toFixed(1)}%` : '0%';
        document.getElementById('kpiTotalQuizzes').textContent = quizResults.length; // Per BLOCCO 3

        return quizResults; // Restituisce i dati per altre funzioni
    } catch (error) {
        console.error('❌ Errore caricamento dati quiz:', error);
        updateConnectionStatus('error', '🔴 Errore caricamento quiz');
        return []; // Restituisce un array vuoto in caso di errore
    }
}


// 2️⃣ BLOCCO 2: Dati Chatbot - Analisi Interazioni
async function renderChatbotData(allQuizResults) {
    console.log('💬 Caricamento dati chatbot per BLOCCO 2...');
    try {
        const conversations = await getChatbotConversations();
        const chatTableBody = document.querySelector('#chatbot-conversations-table-body');
        chatTableBody.innerHTML = '';

        let totalDuration = 0;
        const topicCounts = {};
        const outcomeCounts = {};
        const uniqueChatUsers = new Set(); // Per il tasso di conversione

        if (conversations.length > 0) {
            conversations.forEach(chat => {
                const row = chatTableBody.insertRow();
                row.insertCell().textContent = chat.conversationId ? (chat.conversationId.substring(0, 8) + '...') : 'N/A';
                row.insertCell().textContent = chat.userId || 'N/A';
                row.insertCell().textContent = chat.startTime ? formatDateTime(chat.startTime) : 'N/A';
                row.insertCell().textContent = chat.endTime ? formatDateTime(chat.endTime) : 'N/A';
                row.insertCell().textContent = chat.duration ? formatDuration(chat.duration) : 'N/A';
                row.insertCell().textContent = chat.messageCount || 'N/A';
                row.insertCell().textContent = chat.lastMessageSnippet || 'N/A';
                row.insertCell().textContent = chat.topic || 'N/A';
                row.insertCell().textContent = chat.outcome || 'N/A';

                const actionsCell = row.insertCell();
                const viewBtn = document.createElement('button');
                viewBtn.textContent = 'Dettagli';
                viewBtn.className = 'action-button';
                viewBtn.onclick = () => viewConversationDetails(chat.id); // Funzione da implementare se necessaria
                actionsCell.appendChild(viewBtn);

                if (chat.duration) totalDuration += chat.duration;
                if (chat.topic) topicCounts[chat.topic] = (topicCounts[chat.topic] || 0) + 1;
                if (chat.outcome) outcomeCounts[chat.outcome] = (outcomeCounts[chat.outcome] || 0) + 1;
                if (chat.userId) uniqueChatUsers.add(chat.userId);
            });
        } else {
            const row = chatTableBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 10;
            cell.className = 'no-data';
            cell.textContent = 'Nessuna conversazione chatbot trovata.';
        }

        // Aggiorna KPI di riepilogo chatbot
        document.getElementById('chatbotTotalConversations').textContent = conversations.length;
        document.getElementById('totalConversations').textContent = conversations.length; // KPI generale
        document.getElementById('kpiTotalChats').textContent = conversations.length; // Per BLOCCO 3
        
        const avgDuration = conversations.length > 0 ? (totalDuration / conversations.length) : 0;
        document.getElementById('chatbotAvgDuration').textContent = formatDuration(Math.round(avgDuration));

        // Popola Interessi Emersi (Top Topics)
        const sortedTopics = Object.entries(topicCounts).sort(([, a], [, b]) => b - a);
        const topTopicsDiv = document.getElementById('topTopics');
        topTopicsDiv.innerHTML = '';
        if (sortedTopics.length > 0) {
            sortedTopics.slice(0, 5).forEach(([topic, count]) => { // Mostra i top 5
                const tag = document.createElement('span');
                tag.className = 'tag';
                tag.textContent = `${topic} (${count})`;
                topTopicsDiv.appendChild(tag);
            });
        } else {
            topTopicsDiv.textContent = 'N/A';
        }

        // Popola Esigenze Più Comuni (Top Outcomes)
        const sortedOutcomes = Object.entries(outcomeCounts).sort(([, a], [, b]) => b - a);
        const topOutcomesDiv = document.getElementById('topOutcomes');
        topOutcomesDiv.innerHTML = '';
        if (sortedOutcomes.length > 0) {
            sortedOutcomes.slice(0, 5).forEach(([outcome, count]) => { // Mostra i top 5
                const tag = document.createElement('span');
                tag.className = 'tag';
                tag.textContent = `${outcome} (${count})`;
                topOutcomesDiv.appendChild(tag);
            });
        } else {
            topOutcomesDiv.textContent = 'N/A';
        }

        return { conversations, uniqueChatUsers }; // Restituisce i dati per altre funzioni
    } catch (error) {
        console.error('❌ Errore caricamento dati chatbot:', error);
        return { conversations: [], uniqueChatUsers: new Set() };
    }
}


// 3️⃣ BLOCCO 3: Riepilogo Attività & Performance
function renderActivitySummary(allQuizResults, uniqueChatUsers) {
    console.log('📈 Calcolo riepilogo attività per BLOCCO 3...');

    // Distribuzione Geografica Lead
    const geoDistribution = {};
    const highScoreLeadsByCity = {}; // Per analisi geografica lead caldi
    allQuizResults.forEach(quiz => {
        if (quiz.city) {
            geoDistribution[quiz.city] = (geoDistribution[quiz.city] || 0) + 1;
            if (quiz.lead_score && quiz.lead_score > 70) { // Lead caldi (score > 70%)
                highScoreLeadsByCity[quiz.city] = (highScoreLeadsByCity[quiz.city] || 0) + 1;
            }
        }
    });

    const geoList = document.getElementById('geo-list');
    geoList.innerHTML = '';
    const sortedGeo = Object.entries(geoDistribution).sort(([, a], [, b]) => b - a);
    if (sortedGeo.length > 0) {
        sortedGeo.forEach(([city, count]) => {
            const li = document.createElement('li');
            li.textContent = `${city}: ${count} lead`;
            geoList.appendChild(li);
        });
    } else {
        geoList.innerHTML = '<li class="no-data">Nessun dato geografico disponibile.</li>';
    }

    // Tasso di Conversione Quiz -> Chat
    let convertedLeadsCount = 0;
    const uniqueQuizUsers = new Set();

    allQuizResults.forEach(quiz => {
        // Usa l'email (o un altro identificatore univoco) per collegare quiz e chat
        if (quiz.email) {
            uniqueQuizUsers.add(quiz.email);
            if (uniqueChatUsers.has(quiz.email)) { // Assumendo che userId in chat sia l'email
                convertedLeadsCount++;
            }
        }
    });

    const quizUsersCount = uniqueQuizUsers.size;
    const conversionRate = quizUsersCount > 0 ? (convertedLeadsCount / quizUsersCount) * 100 : 0;
    document.getElementById('kpiQuizToChatConversion').textContent = `${conversionRate.toFixed(1)}%`;


    // Per BLOCCO 4: Analisi Geografica Lead Caldi
    const hotGeoAreasList = document.getElementById('hotGeoAreas');
    hotGeoAreasList.innerHTML = '';
    const sortedHotGeo = Object.entries(highScoreLeadsByCity).sort(([, a], [, b]) => b - a);
    if (sortedHotGeo.length > 0) {
        sortedHotGeo.slice(0, 3).forEach(([city, count]) => { // Mostra le top 3 aree
            const li = document.createElement('li');
            li.textContent = `${city}: ${count} lead ad alto punteggio`;
            hotGeoAreasList.appendChild(li);
        });
    } else {
        hotGeoAreasList.innerHTML = '<li>Nessuna area calda identificata.</li>';
    }
}


// 4️⃣ BLOCCO 4: Opportunità Business & Insights
function renderBusinessOpportunities(allQuizResults, allChatConversations) {
    console.log('💰 Calcolo opportunità business per BLOCCO 4...');

    // Lead ad alto punteggio non ancora contattati (semplificato)
    const highScoreLeads = allQuizResults.filter(quiz => quiz.lead_score && quiz.lead_score > 70);
    const highScoreLeadsCountElem = document.getElementById('highScoreLeadsCount');
    highScoreLeadsCountElem.textContent = highScoreLeads.length;

    const highScoreLeadsListElem = document.getElementById('highScoreLeadsList');
    highScoreLeadsListElem.innerHTML = '';
    if (highScoreLeads.length > 0) {
        highScoreLeads.slice(0, 5).forEach(lead => { // Mostra i top 5
            const li = document.createElement('li');
            li.textContent = `${lead.name || 'N/A'} (${lead.city || 'N/A'}) - Score: ${lead.lead_score}%`;
            highScoreLeadsListElem.appendChild(li);
        });
    } else {
        highScoreLeadsListElem.innerHTML = '<li>Nessun lead ad alto punteggio trovato.</li>';
    }


    // Segmentazione per obiettivi comuni (Dai Quiz)
    const goalCounts = {};
    allQuizResults.forEach(quiz => {
        if (quiz.goals && Array.isArray(quiz.goals)) {
            quiz.goals.forEach(goal => {
                goalCounts[goal] = (goalCounts[goal] || 0) + 1;
            });
        }
    });
    const sortedGoals = Object.entries(goalCounts).sort(([, a], [, b]) => b - a);
    const commonGoalsDiv = document.getElementById('commonGoals');
    commonGoalsDiv.innerHTML = '';
    if (sortedGoals.length > 0) {
        sortedGoals.slice(0, 5).forEach(([goal, count]) => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = `${goal} (${count})`;
            commonGoalsDiv.appendChild(tag);
        });
    } else {
        commonGoalsDiv.textContent = 'N/A';
    }

    // Trend dalle chat (Richieste frequenti per argomento)
    const chatTopicCounts = {};
    allChatConversations.forEach(chat => {
        if (chat.topic) {
            chatTopicCounts[chat.topic] = (chatTopicCounts[chat.topic] || 0) + 1;
        }
    });
    const sortedChatTopics = Object.entries(chatTopicCounts).sort(([, a], [, b]) => b - a);
    const chatTrendsDiv = document.getElementById('chatTrends');
    chatTrendsDiv.innerHTML = '';
    if (sortedChatTopics.length > 0) {
        sortedChatTopics.slice(0, 5).forEach(([topic, count]) => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = `${topic} (${count})`;
            chatTrendsDiv.appendChild(tag);
        });
    } else {
        chatTrendsDiv.textContent = 'N/A';
    }

    // Raccomandazioni Automatiche (Esempio descrittivo) - Gestito in HTML
}


// --- DETAIL MODALS (PLACEHOLDERS) ---
window.viewQuizDetails = async function(quizId) {
    console.log('Visualizzazione dettagli quiz:', quizId);
    try {
        const quiz = await getQuizResultById(quizId);
        if (quiz) {
            const modalContent = `
                <h3>Dettagli Quiz Lead: ${quiz.name || 'N/A'}</h3>
                <p><strong>ID:</strong> ${quiz.id}</p>
                <p><strong>Email:</strong> ${quiz.email || 'N/A'}</p>
                <p><strong>Età:</strong> ${quiz.age || 'N/A'}</p>
                <p><strong>Città:</strong> ${quiz.city || 'N/A'}</p>
                <p><strong>Genere:</strong> ${quiz.gender || 'N/A'}</p>
                <p><strong>Profilo:</strong> ${getProfileIcon(quiz.profile)} ${quiz.profile || 'N/A'}</p>
                <p><strong>Obiettivi:</strong> ${(quiz.goals && quiz.goals.length > 0) ? quiz.goals.join(', ') : 'N/A'}</p>
                <p><strong>Tipo di Allenamento:</strong> ${quiz.activity_level || 'N/A'}</p>
                <p><strong>Ostacoli:</strong> ${(quiz.obstacles && quiz.obstacles.length > 0) ? quiz.obstacles.join(', ') : 'N/A'}</p>
                <p><strong>Score Lead:</strong> ${quiz.lead_score ? `${quiz.lead_score}%` : '0%'}</p>
                <p><strong>Data Completamento:</strong> ${quiz.timestamp ? formatDateTime(quiz.timestamp) : 'N/A'}</p>
            `;
            showModal(modalContent);
        } else {
            alert('Dettagli quiz non trovati.');
        }
    } catch (error) {
        console.error('Errore nel recupero dettagli quiz:', error);
        alert('Impossibile caricare i dettagli del quiz.');
    }
};

window.viewConversationDetails = function(conversationId) {
    console.log('Visualizzazione dettagli conversazione:', conversationId);
    // Qui potresti implementare una funzione simile a viewQuizDetails
    // per caricare e mostrare i dettagli completi di una conversazione specifica.
    alert('Funzione per dettagli conversazione da implementare. ID: ' + conversationId);
};


function showModal(content) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center;
        z-index: 1000;
    `;
    modal.innerHTML = `
        <div style="background: #2a2a2a; padding: 30px; border-radius: 10px; max-width: 600px;
                    width: 90%; box-shadow: 0 5px 15px rgba(0,0,0,0.5); color: white;
                    border: 1px solid #ff6600;">
            <button style="float: right; background: none; border: none; color: #ff6600;
                           font-size: 1.5rem; cursor: pointer;">&times;</button>
            ${content}
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden'; // Impedisce lo scrolling del body

    modal.querySelector('button').onclick = () => {
        modal.remove();
        document.body.style.overflow = 'auto';
    };
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    };
}


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Inizializzazione Dashboard TribuCoach...');
    updateConnectionStatus('connecting', 'Caricamento dati Firebase...');

    try {
        const quizResults = await renderQuizData(); // Carica e renderizza i dati del quiz
        const { conversations, uniqueChatUsers } = await renderChatbotData(quizResults); // Carica e renderizza i dati del chatbot

        renderActivitySummary(quizResults, uniqueChatUsers); // Renderizza BLOCCO 3
        renderBusinessOpportunities(quizResults, conversations); // Renderizza BLOCCO 4

        updateConnectionStatus('connected', `✅ Dashboard inizializzata e dati caricati. Ultimo aggiornamento: ${new Date().toLocaleTimeString('it-IT')}`);
    } catch (error) {
        console.error('Errore critico durante l\'inizializzazione della dashboard:', error);
        updateConnectionStatus('error', '🔴 Errore durante il caricamento dei dati.');
    }
});