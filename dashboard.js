// dashboard.js - Script principale per la Dashboard TribuCoach
import { 
    getAllQuizResults,
    getLeads,
    getMetrics,
    setupQuizListener,
    setupLeadsListener,
    setupMetricsListener,
    formatDateTime,
    calculateTrend,
    getProfileIcon,
    calculateLeadScore,
    testConnection
} from './firebase-functions.js';

// Variabili globali
let currentQuizData = [];
let currentLeadsData = [];
let currentMetricsData = [];
let listeners = [];

// === INIZIALIZZAZIONE ===
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Inizializzazione Dashboard TribuCoach...');
    
    // Test connessione Firebase
    const isConnected = await testConnection();
    updateConnectionStatus(isConnected);
    
    if (isConnected) {
        // Carica dati iniziali
        await loadInitialData();
        
        // Attiva listeners real-time
        setupRealTimeListeners();
        
        // Aggiorna display
        updateDashboard();
    } else {
        console.error('❌ Impossibile connettersi a Firebase');
        updateConnectionStatus(false);
    }
});

// === CARICAMENTO DATI INIZIALI ===
async function loadInitialData() {
    console.log('📊 Caricamento dati iniziali...');
    
    try {
        // Carica tutti i dati in parallelo
        const [quizResults, leads, metrics] = await Promise.all([
            getAllQuizResults(),
            getLeads(),
            getMetrics()
        ]);
        
        currentQuizData = quizResults || [];
        currentLeadsData = leads || [];
        currentMetricsData = metrics || [];
        
        console.log(`📊 Dati caricati: ${currentQuizData.length} quiz, ${currentLeadsData.length} leads, ${currentMetricsData.length} metrics`);
        
        updateLastUpdateTime();
        
    } catch (error) {
        console.error('❌ Errore caricamento dati iniziali:', error);
    }
}

// === LISTENERS REAL-TIME ===
function setupRealTimeListeners() {
    console.log('🔄 Configurazione listeners real-time...');
    
    // Listener Quiz
    const quizListener = setupQuizListener((results) => {
        console.log(`📊 Quiz aggiornati: ${results.length} documenti`);
        currentQuizData = results;
        updateQuizTable();
        updateMetrics();
        updateCharts();
    });
    
    // Listener Leads
    const leadsListener = setupLeadsListener((results) => {
        console.log(`👥 Leads aggiornati: ${results.length} documenti`);
        currentLeadsData = results;
        updateLeadsTable();
        updateMetrics();
        updateCharts();
    });
    
    // Listener Metrics
    const metricsListener = setupMetricsListener((results) => {
        console.log(`📈 Metrics aggiornati: ${results.length} documenti`);
        currentMetricsData = results;
        updateMetrics();
    });
    
    // Salva listeners per cleanup
    listeners = [quizListener, leadsListener, metricsListener];
    
    console.log('✅ Listeners real-time attivi');
}

// === AGGIORNAMENTO DASHBOARD ===
function updateDashboard() {
    console.log('🔄 Aggiornamento dashboard...');
    updateMetrics();
    updateQuizTable();
    updateLeadsTable();
    updateCharts();
    updateBusinessOpportunities();
}

// === AGGIORNAMENTO METRICHE ===
function updateMetrics() {
    // Calcola metriche principali
    const totalQuizzes = currentQuizData.length;
    const totalLeads = currentLeadsData.length;
    const avgLeadScore = currentQuizData.length > 0 ? 
        (currentQuizData.reduce((sum, quiz) => sum + (quiz.score || quiz.lead_score || 0), 0) / currentQuizData.length).toFixed(1) : 0;
    
    // Nuovi lead oggi
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newLeadsToday = currentQuizData.filter(quiz => {
        const quizDate = quiz.timestamp || new Date();
        return quizDate >= today;
    }).length;
    
    // Aggiorna DOM
    updateElement('total-quizzes', totalQuizzes);
    updateElement('total-leads', totalLeads);
    updateElement('avg-lead-score', avgLeadScore);
    updateElement('new-leads-today', newLeadsToday);
    
    console.log(`📊 Metriche aggiornate: ${totalQuizzes} quiz, ${totalLeads} leads, ${avgLeadScore} avg score, ${newLeadsToday} oggi`);
}

// === AGGIORNAMENTO TABELLA QUIZ ===
function updateQuizTable() {
    const tbody = document.getElementById('quizzes-table-body');
    if (!tbody) return;
    
    if (currentQuizData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">Nessun quiz completato ancora</td></tr>';
        return;
    }
    
    const rows = currentQuizData.slice(0, 20).map(quiz => {
        const score = quiz.score || quiz.lead_score || 0;
        const scoreClass = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
        const icon = getProfileIcon(quiz.profile);
        
        return `
            <tr>
                <td>${quiz.name || 'N/A'}</td>
                <td>${quiz.email || 'N/A'}</td>
                <td>${icon} ${quiz.profile || 'N/A'}</td>
                <td><span class="lead-score ${scoreClass}">${score}</span></td>
                <td>${formatDateTime(quiz.timestamp)}</td>
                <td><button class="action-btn" onclick="viewQuizDetails('${quiz.id}')">Dettagli</button></td>
            </tr>
        `;
    }).join('');
    
    tbody.innerHTML = rows;
}

// === AGGIORNAMENTO TABELLA LEADS ===
function updateLeadsTable() {
    const tbody = document.getElementById('leads-table-body');
    if (!tbody) return;
    
    if (currentLeadsData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="no-data">Nessun lead ancora</td></tr>';
        return;
    }
    
    const rows = currentLeadsData.slice(0, 20).map(lead => {
        const score = calculateLeadScore(lead);
        const scoreClass = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
        const icon = getProfileIcon(lead.profile);
        
        return `
            <tr>
                <td>${lead.name || 'N/A'}</td>
                <td>${lead.email || 'N/A'}</td>
                <td>${lead.city || 'N/A'}</td>
                <td>${Array.isArray(lead.goals) ? lead.goals.join(', ') : (lead.goals || 'N/A')}</td>
                <td>${icon} ${lead.profile || 'N/A'}</td>
                <td><span class="lead-score ${scoreClass}">${score}</span></td>
                <td>${formatDateTime(lead.timestamp)}</td>
                <td><button class="action-btn" onclick="contactLead('${lead.id}')">Contatta</button></td>
            </tr>
        `;
    }).join('');
    
    tbody.innerHTML = rows;
}

// === AGGIORNAMENTO GRAFICI ===
function updateCharts() {
    updateGoalsChart();
    updateChallengesChart();
    updateBudgetAnalysis();
    updateTimeAnalysis();
    updateFrequencyAnalysis();
    updateLocationAnalysis();
}

function updateGoalsChart() {
    const goalsCount = {};
    
    currentQuizData.forEach(quiz => {
        if (quiz.goals && Array.isArray(quiz.goals)) {
            quiz.goals.forEach(goal => {
                goalsCount[goal] = (goalsCount[goal] || 0) + 1;
            });
        }
    });
    
    const sortedGoals = Object.entries(goalsCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
    
    const maxCount = sortedGoals.length > 0 ? sortedGoals[0][1] : 1;
    
    const chartHTML = sortedGoals.map(([goal, count]) => `
        <div class="chart-bar">
            <div class="chart-label">${goal}</div>
            <div class="chart-progress">
                <div class="chart-fill" style="width: ${(count / maxCount) * 100}%"></div>
            </div>
            <div class="chart-value">${count}</div>
        </div>
    `).join('');
    
    updateElement('goals-chart', chartHTML || '<div class="no-data">Nessun dato disponibile</div>');
}

function updateChallengesChart() {
    const challengesCount = {};
    
    currentQuizData.forEach(quiz => {
        if (quiz.obstacles && Array.isArray(quiz.obstacles)) {
            quiz.obstacles.forEach(obstacle => {
                challengesCount[obstacle] = (challengesCount[obstacle] || 0) + 1;
            });
        }
    });
    
    const sortedChallenges = Object.entries(challengesCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
    
    const maxCount = sortedChallenges.length > 0 ? sortedChallenges[0][1] : 1;
    
    const chartHTML = sortedChallenges.map(([challenge, count]) => `
        <div class="chart-bar">
            <div class="chart-label">${challenge}</div>
            <div class="chart-progress">
                <div class="chart-fill" style="width: ${(count / maxCount) * 100}%"></div>
            </div>
            <div class="chart-value">${count}</div>
        </div>
    `).join('');
    
    updateElement('challenges-chart', chartHTML || '<div class="no-data">Nessun dato disponibile</div>');
}

function updateBudgetAnalysis() {
    const budgetCount = {};
    
    currentQuizData.forEach(quiz => {
        const budget = quiz.budget || 'Non specificato';
        budgetCount[budget] = (budgetCount[budget] || 0) + 1;
    });
    
    const chartHTML = Object.entries(budgetCount).map(([budget, count]) => `
        <div class="chart-bar">
            <div class="chart-label">${budget}</div>
            <div class="chart-progress">
                <div class="chart-fill" style="width: ${(count / Math.max(...Object.values(budgetCount))) * 100}%"></div>
            </div>
            <div class="chart-value">${count}</div>
        </div>
    `).join('');
    
    updateElement('budget-analysis', chartHTML || '<div class="no-data">Nessun dato disponibile</div>');
}

function updateTimeAnalysis() {
    const timeCount = {};
    
    currentQuizData.forEach(quiz => {
        const time = quiz.timeAvailability || quiz.workout_duration || 'Non specificato';
        timeCount[time] = (timeCount[time] || 0) + 1;
    });
    
    const chartHTML = Object.entries(timeCount).map(([time, count]) => `
        <div class="chart-bar">
            <div class="chart-label">${time}</div>
            <div class="chart-progress">
                <div class="chart-fill" style="width: ${(count / Math.max(...Object.values(timeCount))) * 100}%"></div>
            </div>
            <div class="chart-value">${count}</div>
        </div>
    `).join('');
    
    updateElement('time-analysis', chartHTML || '<div class="no-data">Nessun dato disponibile</div>');
}

function updateFrequencyAnalysis() {
    const freqCount = {};
    
    currentQuizData.forEach(quiz => {
        const freq = quiz.activity_level || quiz.frequency || 'Non specificato';
        freqCount[freq] = (freqCount[freq] || 0) + 1;
    });
    
    const chartHTML = Object.entries(freqCount).map(([freq, count]) => `
        <div class="chart-bar">
            <div class="chart-label">${freq}</div>
            <div class="chart-progress">
                <div class="chart-fill" style="width: ${(count / Math.max(...Object.values(freqCount))) * 100}%"></div>
            </div>
            <div class="chart-value">${count}</div>
        </div>
    `).join('');
    
    updateElement('frequency-analysis', chartHTML || '<div class="no-data">Nessun dato disponibile</div>');
}

function updateLocationAnalysis() {
    const locationCount = {};
    
    currentQuizData.forEach(quiz => {
        const location = quiz.city || quiz.location || 'Non specificato';
        locationCount[location] = (locationCount[location] || 0) + 1;
    });
    
    const chartHTML = Object.entries(locationCount).map(([location, count]) => `
        <div class="chart-bar">
            <div class="chart-label">${location}</div>
            <div class="chart-progress">
                <div class="chart-fill" style="width: ${(count / Math.max(...Object.values(locationCount))) * 100}%"></div>
            </div>
            <div class="chart-value">${count}</div>
        </div>
    `).join('');
    
    updateElement('location-analysis', chartHTML || '<div class="no-data">Nessun dato disponibile</div>');
}

// === OPPORTUNITÀ BUSINESS ===
function updateBusinessOpportunities() {
    const opportunities = [];
    
    // Analizza lead ad alto punteggio
    const highScoreLeads = currentQuizData.filter(quiz => (quiz.score || quiz.lead_score || 0) >= 70);
    if (highScoreLeads.length > 0) {
        opportunities.push({
            title: `${highScoreLeads.length} Lead ad Alto Potenziale`,
            description: 'Lead con punteggio superiore a 70 - pronti per il contatto',
            priority: 'high'
        });
    }
    
    // Analizza obiettivi comuni
    const commonGoals = {};
    currentQuizData.forEach(quiz => {
        if (quiz.goals && Array.isArray(quiz.goals)) {
            quiz.goals.forEach(goal => {
                commonGoals[goal] = (commonGoals[goal] || 0) + 1;
            });
        }
    });
    
    const topGoal = Object.entries(commonGoals).sort(([,a], [,b]) => b - a)[0];
    if (topGoal && topGoal[1] > 3) {
        opportunities.push({
            title: `Focus su "${topGoal[0]}"`,
            description: `${topGoal[1]} clienti interessati - opportunità per programma specializzato`,
            priority: 'medium'
        });
    }
    
    const opportunitiesHTML = opportunities.map(opp => `
        <div class="opportunity-card">
            <h4>${opp.title}<span class="priority ${opp.priority}">${opp.priority.toUpperCase()}</span></h4>
            <p>${opp.description}</p>
        </div>
    `).join('');
    
    updateElement('business-opportunities', opportunitiesHTML || '<div class="no-data">Nessuna opportunità identificata</div>');
}

// === UTILITY FUNCTIONS ===
function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
        element.innerHTML = content;
    }
}

function updateConnectionStatus(isConnected) {
    const statusElement = document.getElementById('connection-status');
    if (statusElement) {
        if (isConnected) {
            statusElement.className = 'connection-status status-connected';
            statusElement.innerHTML = '✅ Connesso a Firebase';
        } else {
            statusElement.className = 'connection-status status-error';
            statusElement.innerHTML = '❌ Errore connessione Firebase';
        }
    }
}

function updateLastUpdateTime() {
    const now = new Date().toLocaleTimeString('it-IT');
    updateElement('last-update', now);
}

// === FUNZIONI GLOBALI ===
window.refreshData = async function() {
    console.log('🔄 Refresh manuale dati...');
    await loadInitialData();
    updateDashboard();
    updateLastUpdateTime();
};

window.viewQuizDetails = function(quizId) {
    const quiz = currentQuizData.find(q => q.id === quizId);
    if (quiz) {
        const details = `
Profilo: ${quiz.profile || 'N/A'}
Punteggio: ${quiz.score || quiz.lead_score || 0}
Obiettivi: ${Array.isArray(quiz.goals) ? quiz.goals.join(', ') : (quiz.goals || 'N/A')}
Livello Attività: ${quiz.activity_level || 'N/A'}
Alimentazione: ${quiz.diet || 'N/A'}
Ostacoli: ${Array.isArray(quiz.obstacles) ? quiz.obstacles.join(', ') : (quiz.obstacles || 'N/A')}
        `;
        alert(`Dettagli Quiz - ${quiz.name}\n\n${details}`);
    }
};

window.contactLead = function(leadId) {
    const lead = currentLeadsData.find(l => l.id === leadId);
    if (lead && lead.email) {
        const subject = encodeURIComponent(`Ciao ${lead.name}, il tuo profilo TribuCoach`);
        const body = encodeURIComponent(`Ciao ${lead.name},\n\nHo visto che hai completato il nostro quiz fitness. Il tuo profilo "${lead.profile}" mostra un grande potenziale!\n\nVorresti una consulenza gratuita per parlare dei tuoi obiettivi?\n\nA presto!`);
        window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`);
    } else {
        alert('Email non disponibile per questo lead');
    }
};

// === CLEANUP ===
window.addEventListener('beforeunload', function() {
    // Disconnetti i listeners quando la pagina viene chiusa
    listeners.forEach(unsubscribe => {
        if (typeof unsubscribe === 'function') {
            unsubscribe();
        }
    });
});

console.log('📊 Dashboard script caricato');