// dashboard.js - Logica Completa della Dashboard TribuCoach BI
import {
    getAllQuizResults,
    getQuizResultById,
    getChatbotConversations,
    getChatbotConversationsFromAPI,
    getChatbotStats,
    testConnection,
    config
} from './firebase-api.js';

// === UTILITÀ PER FORMATTAZIONE E ICONE ===
function formatDateTime(timestamp) {
    if (!timestamp || !timestamp.toDate) {
        // Se è già un oggetto Date
        if (timestamp instanceof Date) {
            return timestamp.toLocaleDateString('it-IT', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        return 'N/A';
    }
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

// === GESTIONE STATUS CONNESSIONE ===
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

// === BLOCCO 1: DATI QUIZ - GESTIONE LEAD ===
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

        // Aggiorna KPI
        document.getElementById('totalQuizzes').textContent = quizResults.length;
        document.getElementById('avgQuizScore').textContent = validQuizzesCount > 0 ? `${(totalScore / validQuizzesCount).toFixed(1)}%` : '0%';
        document.getElementById('kpiTotalQuizzes').textContent = quizResults.length;
        document.getElementById('highScoreLeads').textContent = highScoreLeadsCount;
        document.getElementById('qualifiedLeadsCount').textContent = highScoreLeadsCount;

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

// === BLOCCO 2: DATI CHATBOT - INTERAZIONI CLIENTI (AGGIORNATO) ===
async function renderChatbotData() {
    console.log('💬 Caricamento dati chatbot per BLOCCO 2...');
    updateConnectionStatus('connecting', 'Caricamento conversazioni chatbot...');
    try {
        let conversations = [];
        let dataSource = 'Firebase';
        
        // Prova prima l'API Chatbase se configurata
        if (config.hasValidChatbaseConfig) {
            try {
                conversations = await getChatbotConversationsFromAPI({
                    startDate: getDateDaysAgo(30),
                    size: 100
                });
                dataSource = 'Chatbase API';
                console.log('✅ Dati caricati da API Chatbase');
            } catch (apiError) {
                console.warn('⚠️ API Chatbase non disponibile, uso dati Firebase:', apiError.message);
                conversations = await getChatbotConversations();
                dataSource = 'Firebase (fallback)';
            }
        } else {
            console.log('⚠️ Credenziali Chatbase non configurate, uso Firebase');
            conversations = await getChatbotConversations();
        }

        const chatTableBody = document.querySelector('#chatbot-conversations-table-body');
        chatTableBody.innerHTML = '';

        const topicCounts = {};

        if (conversations.length > 0) {
            conversations.forEach((conv, index) => {
                const row = chatTableBody.insertRow();
                row.insertCell().textContent = conv.id ? conv.id.substring(0, 8) + '...' : `Conv-${index + 1}`;
                row.insertCell().textContent = conv.lastMessageSnippet || 'N/A';
                row.insertCell().textContent = conv.topic || 'N/A';
                row.insertCell().textContent = conv.timestamp ? formatDateTime(conv.timestamp) : 'N/A';

                const actionsCell = row.insertCell();
                const viewBtn = document.createElement('button');
                viewBtn.textContent = 'Vedi Conversazione';
                viewBtn.className = 'action-button';
                viewBtn.onclick = () => viewConversationDetails(conv); // 🔥 IMPLEMENTATA!
                actionsCell.appendChild(viewBtn);

                if (conv.topic) {
                    topicCounts[conv.topic] = (topicCounts[conv.topic] || 0) + 1;
                }
            });
            updateConnectionStatus('connected', `✅ Conversazioni caricate da ${dataSource}: ${conversations.length}`);
        } else {
            const row = chatTableBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 5;
            cell.className = 'no-data';
            cell.textContent = `Nessuna conversazione trovata (fonte: ${dataSource}).`;
            updateConnectionStatus('connected', `✅ Conversazioni caricate da ${dataSource}: Nessuna trovata`);
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

// === BLOCCO 3: GRAFICI E PERFORMANCE ===
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