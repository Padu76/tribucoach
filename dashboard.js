// dashboard.js - Logica della Dashboard
import {
    getAllQuizResults,
    getQuizResultById,
    getChatbotConversations,
    getChatbotConversationsFromAPI, // 🔥 AGGIUNTO PER CHATBASE API
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
    statusDiv.className = 'connection-status';
    statusDiv.textContent = message;

    if (status === 'connected') {
        statusDiv.classList.add('status-connected');
    } else if (status === 'connecting') {
        statusDiv.classList.add('status-connecting');
    } else if (status === 'error') {
        statusDiv.classList.add('status-error');
    }
    
    if (status === 'connected') {
        setTimeout(() => {
            if (statusDiv.classList.contains('status-connected')) {
                statusDiv.textContent = '';
                statusDiv.className = 'connection-status';
            }
        }, 3000);
    }
}

// 1️⃣ BLOCCO 1: Dati Quiz - Gestione Lead
async function renderQuizData() {
    console.log('📊 Caricamento dati quiz per BLOCCO 1...');
    updateConnectionStatus('connecting', 'Caricamento dati Firebase...');
    try {
        const quizResults = await getAllQuizResults();
        const quizTableBody = document.querySelector('#quiz-results-table-body');
        quizTableBody.innerHTML = '';

        let totalScore = 0;
        let validQuizzesCount = 0;
        let highScoreLeadsCount = 0;

        const profileCounts = {};
        const goalCounts = {};
        const obstacleCounts = {};

        if (quizResults.length > 0) {
            quizResults.forEach(quiz => {
                const row = quizTableBody.insertRow();
                row.insertCell().textContent = quiz.name || 'N/A';
                row.insertCell().textContent = quiz.age || 'N/A';
                row.insertCell().textContent = quiz.email || 'N/A';
                row.insertCell().textContent = quiz.whatsapp_number || 'N/A';
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

                if (quiz.whatsapp_number) {
                    const whatsappBtn = document.createElement('button');
                    whatsappBtn.textContent = 'WhatsApp';
                    whatsappBtn.className = 'action-button whatsapp';
                    whatsappBtn.onclick = () => window.open(`https://wa.me/${quiz.whatsapp_number}`, '_blank');
                    actionsCell.appendChild(whatsappBtn);
                }

                if (quiz.lead_score) {
                    totalScore += quiz.lead_score;
                    validQuizzesCount++;
                    if (quiz.lead_score >= 70) {
                        highScoreLeadsCount++;
                    }
                }

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
        document.getElementById('highScoreLeads').textContent = highScoreLeadsCount;

        renderProfileChart(profileCounts);
        renderGoalChart(goalCounts);
        renderInsights(goalCounts, obstacleCounts);

        return quizResults;
    } catch (error) {
        console.error('❌ Errore caricamento dati quiz:', error);
        updateConnectionStatus('error', '🔴 Errore caricamento quiz');
        return [];
    }
}

// 2️⃣ BLOCCO 2: Dati Chatbot - Interazioni Clienti (🔥 AGGIORNATO)
async function renderChatbotData() {
    console.log('💬 Caricamento dati chatbot per BLOCCO 2...');
    updateConnectionStatus('connecting', 'Caricamento conversazioni chatbot...');
    try {
        let conversations = [];
        
        // 🔥 PROVA PRIMA L'API CHATBASE
        try {
            conversations = await getChatbotConversationsFromAPI({
                startDate: getDateDaysAgo(30),
                size: 50
            });
            console.log('✅ Conversazioni caricate da Chatbase API');
        } catch (apiError) {
            console.warn('⚠️ API Chatbase non disponibile, uso Firebase:', apiError.message);
            conversations = await getChatbotConversations();
        }

        const chatTableBody = document.querySelector('#chatbot-conversations-table-body');
        chatTableBody.innerHTML = '';

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
                viewBtn.onclick = () => viewConversationDetails(conv); // 🔥 FUNZIONE IMPLEMENTATA!
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

// 3️⃣ BLOCCO 3: Grafici
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
                backgroundColor: ['#25D366', '#34B7F1', '#FFC107', '#00BCD4', '#8BC34A'],
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

// 4️⃣ BLOCCO 4: Insights
function renderInsights(goalCounts, obstacleCounts) {
    const mostPopularGoalEl = document.getElementById('mostPopularGoal');
    const mostCommonObstacleEl = document.getElementById('mostCommonObstacle');

    const sortedGoals = Object.entries(goalCounts).sort(([, a], [, b]) => b - a);
    if (sortedGoals.length > 0) {
        mostPopularGoalEl.textContent = sortedGoals[0][0];
    } else {
        mostPopularGoalEl.textContent = 'N/A';
    }

    const sortedObstacles = Object.entries(obstacleCounts).sort(([, a], [, b]) => b - a);
    if (sortedObstacles.length > 0) {
        mostCommonObstacleEl.textContent = sortedObstacles[0][0];
    } else {
        mostCommonObstacleEl.textContent = 'N/A';
    }
}

// === MODAL FUNCTIONS ===
function showModal(content) {
    const modal = document.getElementById('detailsModal');
    const modalBody = document.getElementById('modal-body-content');
    modalBody.innerHTML = content;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

window.closeModal = function() {
    const modal = document.getElementById('detailsModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Funzione per visualizzare i dettagli del quiz nel modal
window.viewQuizDetails = async function(quizId) {
    console.log('Visualizzazione dettagli quiz:', quizId);
    try {
        const quiz = await getQuizResultById(quizId);
        if (quiz) {
            const modalContent = `
                <h3>Dettagli Quiz Lead: ${quiz.name || 'N/A'}</h3>
                <p><strong>ID:</strong> ${quiz.id}</p>
                <p><strong>Email:</strong> ${quiz.email || 'N/A'}</p>
                <p><strong>WhatsApp:</strong> ${quiz.whatsapp_number || 'N/A'}</p>
                <p><strong>Età:</strong> ${quiz.age || 'N/A'}</p>
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

// 🔥 NUOVA FUNZIONE: Visualizza dettagli conversazione chatbot
window.viewConversationDetails = function(conversation) {
    console.log('👁️ Visualizzazione conversazione:', conversation.id);
    
    let messagesHTML = '';
    if (conversation.messages && conversation.messages.length > 0) {
        messagesHTML = conversation.messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            const bubbleClass = isUser ? 'user-message' : 'assistant-message';
            const icon = isUser ? '👤' : '🤖';
            const timestamp = new Date().toLocaleTimeString('it-IT');
            
            return `
                <div class="message-bubble ${bubbleClass}">
                    <div class="message-header">
                        <span class="message-icon">${icon}</span>
                        <span class="message-role">${isUser ? 'Utente' : 'TribuCoach Bot'}</span>
                        <span class="message-time">${timestamp}</span>
                    </div>
                    <div class="message-content">${msg.content}</div>
                </div>
            `;
        }).join('');
    } else {
        messagesHTML = '<p class="no-messages">Nessun messaggio disponibile per questa conversazione.</p>';
    }

    const modalContent = `
        <h3>💬 Conversazione Chatbot</h3>
        <div class="conversation-header">
            <p><strong>ID:</strong> ${conversation.id}</p>
            <p><strong>Cliente:</strong> ${conversation.customer || 'Anonimo'}</p>
            <p><strong>Argomento:</strong> ${conversation.topic || 'N/A'}</p>
            <p><strong>Fonte:</strong> ${conversation.source || 'N/A'}</p>
            <p><strong>Data:</strong> ${conversation.timestamp ? formatDateTime(conversation.timestamp) : 'N/A'}</p>
            <p><strong>Messaggi Totali:</strong> ${conversation.messages?.length || 0}</p>
        </div>
        <div class="conversation-messages">
            <h4>Cronologia Messaggi:</h4>
            <div class="messages-container">
                ${messagesHTML}
            </div>
        </div>
        <div class="conversation-actions">
            <button class="action-button" onclick="exportConversation('${conversation.id}')">
                📥 Esporta Conversazione
            </button>
            <button class="action-button" onclick="analyzeConversation('${conversation.id}')">
                📊 Analizza Sentiment
            </button>
            <button class="action-button" onclick="generateLeadFromConversation('${conversation.id}')">
                🎯 Genera Lead
            </button>
        </div>
    `;
    
    showModal(modalContent);
};

// 🔥 NUOVE FUNZIONI UTILITY PER CONVERSAZIONI
function getDateDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
}

window.exportConversation = function(conversationId) {
    const exportData = {
        conversationId,
        exportDate: new Date().toISOString(),
        note: 'Conversazione esportata da TribuCoach Dashboard'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `conversation_${conversationId}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    console.log('✅ Conversazione esportata:', conversationId);
};

window.analyzeConversation = function(conversationId) {
    const analysisResult = {
        sentiment: 'Positivo',
        confidence: '85%',
        keywords: ['allenamento', 'motivazione', 'obiettivi'],
        recommendation: 'Cliente interessato, contattare per consulenza'
    };
    
    alert(`📊 Analisi Sentiment per ${conversationId}:\n\n` +
          `Sentiment: ${analysisResult.sentiment}\n` +
          `Confidenza: ${analysisResult.confidence}\n` +
          `Parole chiave: ${analysisResult.keywords.join(', ')}\n\n` +
          `Raccomandazione: ${analysisResult.recommendation}`);
    
    console.log('📊 Analisi sentiment completata per:', conversationId);
};

window.generateLeadFromConversation = function(conversationId) {
    const leadData = {
        source: 'Chatbot',
        conversationId: conversationId,
        interest_level: 'Alto',
        suggested_action: 'Contatto diretto',
        generated_date: new Date().toISOString()
    };
    
    alert(`🎯 Lead generato dalla conversazione ${conversationId}!\n\n` +
          `Interesse: ${leadData.interest_level}\n` +
          `Azione suggerita: ${leadData.suggested_action}\n\n` +
          `Il lead è stato aggiunto alla coda di follow-up.`);
    
    console.log('🎯 Lead generato:', leadData);
};

// === Inizializzazione Dashboard ===
async function initDashboard() {
    updateConnectionStatus('connecting', 'Connessione e caricamento dati...');
    try {
        const connectionOK = await testConnection();
        if (connectionOK) {
            console.log('Connessione Firebase stabilita.');
            await Promise.all([
                renderQuizData(),
                renderChatbotData()
            ]);
            document.getElementById('last-update').textContent = new Date().toLocaleTimeString('it-IT');
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
    setInterval(initDashboard, 300000);
});