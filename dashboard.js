// dashboard.js - Logica della Dashboard
import {
    getAllQuizResults,
    getQuizResultById, // Assicurati sia importata per la funzione viewQuizDetails
    getChatbotConversations,
    testConnection
} from './firebase-api.js';

// Utilità per la formattazione e icone
function formatDateTime(timestamp) {
    if (!timestamp || !timestamp.toDate) return 'N/A';
    const date = timestamp.toDate();
    return date.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getProfileIcon(profile) {
    const icons = {
        "Guerriero della Forza": '💪',
        "Scolpitore del Corpo": '✨',
        "Esploratore della Resistenza": '🏃‍♂️',
        "Maestro dell'Equilibrio": '🧘‍♀️'
    };
    return icons[profile] || '❓';
}

// Stato della connessione Firebase
function updateConnectionStatus(status, message) {
    const statusDiv = document.getElementById('connection-status');
    statusDiv.className = 'connection-status'; // Reset classes
    statusDiv.textContent = message;

    if (status === 'connected') {
        statusDiv.classList.add('status-connected');
    } else if (status === 'connecting') {
        statusDiv.classList.add('status-connecting');
    } else if (status === 'error') {
        statusDiv.classList.add('status-error');
    }
    // Rimuovi lo status dopo un po' se è "connected"
    if (status === 'connected') {
        setTimeout(() => {
            if (statusDiv.classList.contains('status-connected')) { // Evita di rimuovere se è cambiato stato
                statusDiv.textContent = '';
                statusDiv.className = 'connection-status';
            }
        }, 3000); // Rimuovi il messaggio dopo 3 secondi
    }
}

// 0️⃣ BLOCCO 0: Panoramica KPI (Aggiornato tramite renderQuizData)
// Questi KPI vengono aggiornati quando renderQuizData e renderChatbotData vengono chiamate

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
        let highScoreLeadsCount = 0; // Contatore per lead ad alto punteggio

        const profileCounts = {};
        const goalCounts = {};
        const obstacleCounts = {};
        // const cityCounts = {}; // Rimosso o non usato più per città

        if (quizResults.length > 0) {
            quizResults.forEach(quiz => {
                const row = quizTableBody.insertRow();
                row.insertCell().textContent = quiz.name || 'N/A';
                row.insertCell().textContent = quiz.age || 'N/A';
                row.insertCell().textContent = quiz.email || 'N/A';
                row.insertCell().textContent = quiz.whatsapp_number || 'N/A'; // *** QUI: Cambiato da quiz.city a quiz.whatsapp_number ***
                row.insertCell().textContent = quiz.gender || 'N/A';
                row.insertCell().innerHTML = `${getProfileIcon(quiz.profile)} ${quiz.profile || 'N/A'}`;
                row.insertCell().textContent = (quiz.goals && quiz.goals.length > 0) ? quiz.goals.join(', ') : 'N/A';
                row.insertCell().textContent = quiz.activity_level || 'N/A';
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

                // *** NUOVO: Aggiungi pulsante WhatsApp se il numero è disponibile ***
                if (quiz.whatsapp_number) {
                    const whatsappBtn = document.createElement('button');
                    whatsappBtn.textContent = 'WhatsApp';
                    whatsappBtn.className = 'action-button whatsapp'; // Aggiungi una classe 'whatsapp' per lo stile
                    whatsappBtn.onclick = () => window.open(`https://wa.me/${quiz.whatsapp_number}`, '_blank');
                    actionsCell.appendChild(whatsappBtn);
                }

                if (quiz.lead_score) {
                    totalScore += quiz.lead_score;
                    validQuizzesCount++;
                    if (quiz.lead_score >= 70) {
                        highScoreLeadsCount++; // Incrementa contatore lead alto punteggio
                    }
                }

                // Per i grafici di distribuzione
                if (quiz.profile) {
                    profileCounts[quiz.profile] = (profileCounts[quiz.profile] || 0) + 1;
                }
                if (quiz.goals) {
                    quiz.goals.forEach(goal => {
                        goalCounts[goal] = (goalCounts[goal] || 0) + 1;
                    });
                }
                if (quiz.obstacles) {
                    quiz.obstacles.forEach(obstacle => {
                        obstacleCounts[obstacle] = (obstacleCounts[obstacle] || 0) + 1;
                    });
                }
                // Rimosso l'uso di cityCounts
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
        document.getElementById('kpiTotalQuizzes').textContent = quizResults.length;
        document.getElementById('highScoreLeads').textContent = highScoreLeadsCount; // Aggiorna KPI lead alto punteggio

        renderProfileChart(profileCounts);
        renderGoalChart(goalCounts);
        renderInsights(goalCounts, obstacleCounts); // Passa i conteggi agli insight

        return quizResults; // Restituisce i dati per altre funzioni
    } catch (error) {
        console.error('❌ Errore caricamento dati quiz:', error);
        updateConnectionStatus('error', '🔴 Errore caricamento quiz');
        return [];
    }
}

// 2️⃣ BLOCCO 2: Dati Chatbot - Interazioni Clienti
async function renderChatbotData() {
    console.log('💬 Caricamento dati chatbot per BLOCCO 2...');
    updateConnectionStatus('connecting', 'Caricamento conversazioni chatbot...');
    try {
        const conversations = await getChatbotConversations();
        const chatTableBody = document.querySelector('#chatbot-conversations-table-body');
        chatTableBody.innerHTML = ''; // Pulisce la tabella

        const topicCounts = {};

        if (conversations.length > 0) {
            conversations.forEach(conv => {
                const row = chatTableBody.insertRow();
                row.insertCell().textContent = conv.id ? conv.id.substring(0, 8) + '...' : 'N/A';
                row.insertCell().textContent = conv.lastMessageSnippet || 'N/A';
                row.insertCell().textContent = conv.topic || 'N/A';
                row.insertCell().textContent = conv.timestamp ? formatDateTime(conv.timestamp) : 'N/A';

                const actionsCell = row.insertCell();
                const viewBtn = document.createElement('button');
                viewBtn.textContent = 'Vedi Conversazione';
                viewBtn.className = 'action-button';
                viewBtn.onclick = () => alert('Funzione "Vedi Conversazione" non implementata per il chatbot.'); // Placeholder
                actionsCell.appendChild(viewBtn);

                if (conv.topic) {
                    topicCounts[conv.topic] = (topicCounts[conv.topic] || 0) + 1;
                }
            });
            updateConnectionStatus('connected', `✅ Conversazioni caricate: ${conversations.length}`);
        } else {
            const row = chatTableBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 5;
            cell.className = 'no-data';
            cell.textContent = 'Nessuna conversazione chatbot trovata.';
            updateConnectionStatus('connected', '✅ Conversazioni caricate: Nessuna trovata');
        }
        document.getElementById('totalChatConversations').textContent = conversations.length;
        document.getElementById('kpiTotalChatConversations').textContent = conversations.length;
        renderChatTopicChart(topicCounts);
        return conversations;
    } catch (error) {
        console.error('❌ Errore caricamento dati chatbot:', error);
        updateConnectionStatus('error', '🔴 Errore caricamento conversazioni');
        return [];
    }
}

// 3️⃣ BLOCCO 3: Riepilogo Attività & Performance - Funzioni Grafici
let profileChartInstance = null;
function renderProfileChart(profileCounts) {
    if (profileChartInstance) {
        profileChartInstance.destroy();
    }
    const ctx = document.getElementById('profileChart').getContext('2d');
    profileChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(profileCounts),
            datasets: [{
                data: Object.values(profileCounts),
                backgroundColor: ['#ff6600', '#ff9933', '#ffa500', '#cc5200', '#b34700'],
                borderColor: '#2a2a2a',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                },
                title: {
                    display: true,
                    text: 'Distribuzione Profili Fitness',
                    color: '#ff6600'
                }
            }
        }
    });
}

let goalChartInstance = null;
function renderGoalChart(goalCounts) {
    if (goalChartInstance) {
        goalChartInstance.destroy();
    }
    const ctx = document.getElementById('goalChart').getContext('2d');
    goalChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(goalCounts),
            datasets: [{
                label: 'Numero di Leads',
                data: Object.values(goalCounts),
                backgroundColor: '#ff6600',
                borderColor: '#ff9933',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                },
                title: {
                    display: true,
                    text: 'Obiettivi Principali',
                    color: '#ff6600'
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#fff'
                    },
                    grid: {
                        color: '#444'
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#fff'
                    },
                    grid: {
                        color: '#444'
                    }
                }
            }
        }
    });
}

let chatTopicChartInstance = null;
function renderChatTopicChart(topicCounts) {
    if (chatTopicChartInstance) {
        chatTopicChartInstance.destroy();
    }
    const ctx = document.getElementById('chatTopicChart').getContext('2d');
    chatTopicChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(topicCounts),
            datasets: [{
                data: Object.values(topicCounts),
                backgroundColor: ['#25D366', '#34B7F1', '#FFC107', '#00BCD4', '#8BC34A'], // Colori diversi
                borderColor: '#2a2a2a',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                },
                title: {
                    display: true,
                    text: 'Argomenti Chatbot',
                    color: '#ff6600'
                }
            }
        }
    });
}

// 4️⃣ BLOCCO 4: Opportunità Business & Insights
function renderInsights(goalCounts, obstacleCounts) {
    const mostPopularGoalEl = document.getElementById('mostPopularGoal');
    const mostCommonObstacleEl = document.getElementById('mostCommonObstacle');

    // Obiettivo più popolare
    const sortedGoals = Object.entries(goalCounts).sort(([, a], [, b]) => b - a);
    if (sortedGoals.length > 0) {
        mostPopularGoalEl.textContent = sortedGoals[0][0];
    } else {
        mostPopularGoalEl.textContent = 'N/A';
    }

    // Ostacolo più comune
    const sortedObstacles = Object.entries(obstacleCounts).sort(([, a], [, b]) => b - a);
    if (sortedObstacles.length > 0) {
        mostCommonObstacleEl.textContent = sortedObstacles[0][0];
    } else {
        mostCommonObstacleEl.textContent = 'N/A';
    }
}

// === Modal Functions ===
function showModal(content) {
    const modal = document.getElementById('detailsModal');
    const modalBody = document.getElementById('modal-body-content');
    modalBody.innerHTML = content;
    modal.style.display = 'flex'; // Usa flex per centrare
    document.body.style.overflow = 'hidden'; // Impedisce lo scroll del body
}

window.closeModal = function() {
    const modal = document.getElementById('detailsModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Ripristina lo scroll del body
}

// Funzione per visualizzare i dettagli del quiz nel modal (AGGIORNATA per WhatsApp)
window.viewQuizDetails = async function(quizId) {
    console.log('Visualizzazione dettagli quiz:', quizId);
    try {
        const quiz = await getQuizResultById(quizId);
        if (quiz) {
            const modalContent = `
                <h3>Dettagli Quiz Lead: ${quiz.name || 'N/A'}</h3>
                <p><strong>ID:</strong> ${quiz.id}</p>
                <p><strong>Email:</strong> ${quiz.email || 'N/A'}</p>
                <p><strong>WhatsApp:</strong> ${quiz.whatsapp_number || 'N/A'}</p> <p><strong>Età:</strong> ${quiz.age || 'N/A'}</p>
                <p><strong>Genere:</strong> ${quiz.gender || 'N/A'}</p>
                <p><strong>Profilo:</strong> ${getProfileIcon(quiz.profile)} ${quiz.profile || 'N/A'}</p>
                <p><strong>Obiettivi:</strong> ${(quiz.goals && quiz.goals.length > 0) ? quiz.goals.join(', ') : 'N/A'}</p>
                <p><strong>Tipo di Allenamento:</strong> ${quiz.activity_level || 'N/A'}</p>
                <p><strong>Ostacoli:</strong> ${(quiz.obstacles && quiz.obstacles.length > 0) ? quiz.obstacles.join(', ') : 'N/A'}</p>
                <p><strong>Score Lead:</strong> ${quiz.lead_score ? `${quiz.lead_score}%` : '0%'}</p>
                <p><strong>Data Completamento:</strong> ${quiz.timestamp ? formatDateTime(quiz.timestamp) : 'N/A'}</p>
                ${quiz.whatsapp_number ? `<p><a href="https://wa.me/${quiz.whatsapp_number}" target="_blank" style="display:inline-block; margin-top:15px; padding:10px 20px; background-color:#25D366; color:white; text-decoration:none; border-radius:5px;">Chatta su WhatsApp</a></p>` : ''}
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


// === Inizializzazione Dashboard ===
async function initDashboard() {
    updateConnectionStatus('connecting', 'Connessione e caricamento dati...');
    try {
        const connectionOK = await testConnection();
        if (connectionOK) {
            console.log('Connessione Firebase stabilita.');
            // Carica tutti i dati in parallelo
            await Promise.all([
                renderQuizData(),
                renderChatbotData()
            ]);
            document.getElementById('last-update').textContent = new Date().toLocaleTimeString('it-IT'); // Aggiorna l'ora dell'ultimo aggiornamento
            updateConnectionStatus('connected', '✅ Dati Dashboard aggiornati!');
        } else {
            console.error('Connessione Firebase fallita.');
            updateConnectionStatus('error', '🔴 Errore connessione Firebase!');
        }
    } catch (error) {
        console.error('Errore durante l\'inizializzazione della dashboard:', error);
        updateConnectionStatus('error', '🔴 Errore durante l\'inizializzazione!');
    }
}

// Carica la dashboard all'apertura della pagina
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    // Imposta un intervallo per ricaricare i dati ogni 5 minuti (300000 ms)
    setInterval(initDashboard, 300000);
});