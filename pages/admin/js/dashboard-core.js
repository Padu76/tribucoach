// ==========================================================================
// DASHBOARD CORE - LIFESTYLEFITNESSCODE ADMIN
// ==========================================================================

import { 
    firebaseData, 
    loadAllFirebaseData, 
    calculateDashboardKPIs, 
    calculateWeekAnalytics, 
    calculateAIMetrics,
    calculateAvatarMetrics,
    generateUsersCSV,
    generateUsersCSVAdvanced,
    formatDate,
    formatDateTime,
    daysBetween
} from './firebase-admin.js';

// ==========================================================================
// GLOBAL STATE MANAGEMENT
// ==========================================================================
export let dashboardState = {
    filteredUsers: [],
    selectedUsers: new Set(),
    currentFilters: {
        progress: '',
        activity: '',
        score: '',
        search: ''
    },
    sessionsFilter: 'today', // NUOVO: Filtro sessioni
    isLoading: false,
    lastRefresh: null
};

// ==========================================================================
// INITIALIZATION
// ==========================================================================

/**
 * Inizializza dashboard core
 */
export function initializeDashboardCore() {
    console.log('⚡ Inizializzazione Dashboard Core...');
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup Firebase data listener
    setupFirebaseListener();
    
    // Setup auto-update timer
    setupAutoUpdate();
    
    console.log('✅ Dashboard Core inizializzato');
}

/**
 * Setup event listeners per elementi UI
 */
function setupEventListeners() {
    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', handleRefreshClick);
    }
    
    // Filters
    const progressFilter = document.getElementById('progressFilter');
    const activityFilter = document.getElementById('activityFilter');
    const scoreFilter = document.getElementById('scoreFilter');
    const searchFilter = document.getElementById('searchFilter');
    
    if (progressFilter) progressFilter.addEventListener('change', handleFiltersChange);
    if (activityFilter) activityFilter.addEventListener('change', handleFiltersChange);
    if (scoreFilter) scoreFilter.addEventListener('change', handleFiltersChange);
    if (searchFilter) searchFilter.addEventListener('input', debounce(handleFiltersChange, 300));
    
    // NUOVO: Sessions filter
    const sessionsFilterSelect = document.getElementById('sessionsFilter');
    if (sessionsFilterSelect) {
        sessionsFilterSelect.addEventListener('change', handleSessionsFilterChange);
    }
    
    // Select all checkbox
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', handleSelectAllChange);
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', handleExportClick);
    }
    
    // Bulk actions button
    const bulkActionBtn = document.getElementById('bulkActionBtn');
    if (bulkActionBtn) {
        bulkActionBtn.addEventListener('click', handleBulkActionClick);
    }
    
    // Reload button (in no data state)
    const reloadBtn = document.getElementById('reloadBtn');
    if (reloadBtn) {
        reloadBtn.addEventListener('click', handleRefreshClick);
    }
}

/**
 * Setup listener per dati Firebase
 */
function setupFirebaseListener() {
    window.addEventListener('firebaseDataLoaded', handleFirebaseDataLoaded);
    window.addEventListener('firebaseError', handleFirebaseError);
}

/**
 * Setup auto-update timer
 */
function setupAutoUpdate() {
    // Update time display every 5 seconds
    setInterval(updateTimeDisplay, 5000);
    updateTimeDisplay(); // Initial call
}

// ==========================================================================
// EVENT HANDLERS
// ==========================================================================

/**
 * Handle refresh button click
 */
async function handleRefreshClick(event) {
    const btn = event.target;
    const originalText = btn.textContent;
    
    try {
        btn.textContent = '🔄 Aggiornando...';
        btn.disabled = true;
        dashboardState.isLoading = true;
        
        await loadAllFirebaseData();
        
        // Show success feedback
        btn.textContent = '✅ Aggiornato!';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Errore refresh:', error);
        btn.textContent = '❌ Errore';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 3000);
    }
    
    dashboardState.isLoading = false;
}

/**
 * Handle filters change
 */
function handleFiltersChange() {
    // Get current filter values
    const progressFilter = document.getElementById('progressFilter');
    const activityFilter = document.getElementById('activityFilter');
    const scoreFilter = document.getElementById('scoreFilter');
    const searchFilter = document.getElementById('searchFilter');
    
    dashboardState.currentFilters = {
        progress: progressFilter?.value || '',
        activity: activityFilter?.value || '',
        score: scoreFilter?.value || '',
        search: searchFilter?.value.toLowerCase().trim() || ''
    };
    
    // Apply filters
    applyFilters();
    
    // Update table
    updateUsersTable();
}

/**
 * NUOVO: Handle sessions filter change
 */
function handleSessionsFilterChange(event) {
    dashboardState.sessionsFilter = event.target.value;
    updateSessionsList();
}

/**
 * Handle select all checkbox
 */
function handleSelectAllChange(event) {
    const isChecked = event.target.checked;
    const userCheckboxes = document.querySelectorAll('.user-checkbox');
    
    if (isChecked) {
        // Select all visible users
        dashboardState.filteredUsers.forEach(user => {
            dashboardState.selectedUsers.add(user.id);
        });
    } else {
        // Deselect all
        dashboardState.selectedUsers.clear();
    }
    
    // Update checkboxes
    userCheckboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
    });
    
    // Update UI
    updateSelectionUI();
}

/**
 * Handle export button click
 */
function handleExportClick() {
    try {
        const usersToExport = dashboardState.selectedUsers.size > 0 ? 
            dashboardState.filteredUsers.filter(u => dashboardState.selectedUsers.has(u.id)) :
            dashboardState.filteredUsers;
        
        if (usersToExport.length === 0) {
            showNotification('Nessun utente da esportare', 'warning');
            return;
        }
        
        const csvContent = generateUsersCSV(usersToExport);
        downloadCSV(csvContent, `utenti_coaching_${new Date().toISOString().split('T')[0]}.csv`);
        
        showNotification(`${usersToExport.length} utenti esportati in CSV`, 'success');
        
    } catch (error) {
        console.error('Errore export CSV:', error);
        showNotification('Errore durante export CSV', 'error');
    }
}

/**
 * Handle bulk actions button
 */
function handleBulkActionClick() {
    if (dashboardState.selectedUsers.size === 0) {
        showNotification('Seleziona almeno un utente', 'warning');
        return;
    }
    
    // Update bulk modal count
    const bulkCount = document.getElementById('bulkCount');
    if (bulkCount) {
        bulkCount.textContent = dashboardState.selectedUsers.size;
    }
    
    // Show bulk modal
    const bulkModal = document.getElementById('bulkModal');
    if (bulkModal) {
        bulkModal.classList.add('active');
    }
}

/**
 * Handle Firebase data loaded
 */
function handleFirebaseDataLoaded(event) {
    console.log('📊 Dati Firebase ricevuti, aggiornamento dashboard...');
    
    dashboardState.lastRefresh = new Date();
    
    // Apply current filters
    applyFilters();
    
    // Update all dashboard sections
    updateDashboard();
    
    showNotification('Dashboard aggiornata con successo', 'success');
}

/**
 * Handle Firebase error
 */
function handleFirebaseError(event) {
    console.error('Firebase error:', event.detail);
    showNotification('Errore connessione Firebase', 'error');
    
    // Show error state in table
    showTableErrorState();
}

// ==========================================================================
// FILTERS MANAGEMENT
// ==========================================================================

/**
 * Applica filtri agli utenti
 */
function applyFilters() {
    let filtered = [...firebaseData.allUsers];
    const filters = dashboardState.currentFilters;
    
    // Progress filter
    if (filters.progress) {
        filtered = filtered.filter(user => {
            const completedWeeks = user.completedWeeks ? user.completedWeeks.length : 0;
            
            switch (filters.progress) {
                case 'not-started':
                    return !user.hasStartedCoaching && completedWeeks === 0;
                case 'in-progress':
                    return user.hasStartedCoaching && completedWeeks < 7;
                case 'completed':
                    return completedWeeks >= 7;
                default:
                    return true;
            }
        });
    }
    
    // Activity filter
    if (filters.activity) {
        const now = new Date();
        filtered = filtered.filter(user => {
            const daysSinceActivity = daysBetween(user.lastActivity, now);
            
            switch (filters.activity) {
                case 'today':
                    return daysSinceActivity === 0;
                case 'week':
                    return daysSinceActivity <= 7;
                case 'month':
                    return daysSinceActivity <= 30;
                case 'inactive':
                    return daysSinceActivity > 30;
                default:
                    return true;
            }
        });
    }
    
    // Score filter
    if (filters.score) {
        filtered = filtered.filter(user => {
            const score = user.leadScore || 0;
            
            switch (filters.score) {
                case 'high':
                    return score >= 70;
                case 'medium':
                    return score >= 40 && score < 70;
                case 'low':
                    return score < 40;
                default:
                    return true;
            }
        });
    }
    
    // Search filter
    if (filters.search) {
        filtered = filtered.filter(user => 
            user.name.toLowerCase().includes(filters.search) ||
            user.email.toLowerCase().includes(filters.search)
        );
    }
    
    dashboardState.filteredUsers = filtered;
    
    // Update counters
    updateFilterCounters();
}

/**
 * Update filter counters
 */
function updateFilterCounters() {
    const visibleUsers = document.getElementById('visibleUsers');
    const totalUsersCount = document.getElementById('totalUsersCount');
    
    if (visibleUsers) {
        visibleUsers.textContent = dashboardState.filteredUsers.length;
    }
    
    if (totalUsersCount) {
        totalUsersCount.textContent = firebaseData.allUsers.length;
    }
}

// ==========================================================================
// DASHBOARD UPDATE FUNCTIONS
// ==========================================================================

/**
 * Update complete dashboard
 */
function updateDashboard() {
    updateKPICards();
    updateUsersTable();
    updateWeekAnalytics();
    updateAIMetrics();
    updateAvatarAnalytics();
    updateSessionsList();
    updateTimeDisplay();
}

/**
 * Update KPI cards
 */
function updateKPICards() {
    const kpis = calculateDashboardKPIs();
    
    // Update KPI values
    const elements = {
        totalUsers: document.getElementById('totalUsers'),
        qualifiedLeads: document.getElementById('qualifiedLeads'),
        activeCoaching: document.getElementById('activeCoaching'),
        conversionRate: document.getElementById('conversionRate'),
        todaySessions: document.getElementById('todaySessions'),
        aiConversations: document.getElementById('aiConversations')
    };
    
    if (elements.totalUsers) elements.totalUsers.textContent = kpis.totalUsers;
    if (elements.qualifiedLeads) elements.qualifiedLeads.textContent = kpis.qualifiedLeads;
    if (elements.activeCoaching) elements.activeCoaching.textContent = kpis.activeCoaching;
    if (elements.conversionRate) elements.conversionRate.textContent = kpis.conversionRate + '%';
    if (elements.todaySessions) elements.todaySessions.textContent = kpis.todaySessions;
    if (elements.aiConversations) elements.aiConversations.textContent = kpis.totalConversations;
    
    // Update change indicators
    const usersChange = document.getElementById('usersChange');
    const activeChange = document.getElementById('activeChange');
    
    if (usersChange) {
        usersChange.textContent = `+${Math.round(kpis.totalUsers * 0.15)} questa settimana`;
    }
    
    if (activeChange) {
        activeChange.textContent = `${kpis.activeCoaching}/${kpis.totalUsers} attivi`;
    }
}

/**
 * Update users table
 */
function updateUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    const noUsersMessage = document.getElementById('noUsersMessage');
    const usersTable = document.getElementById('usersTable');
    
    if (!tbody) return;
    
    // Show/hide no data message
    if (dashboardState.filteredUsers.length === 0) {
        if (usersTable) usersTable.style.display = 'none';
        if (noUsersMessage) noUsersMessage.style.display = 'block';
        return;
    }
    
    if (usersTable) usersTable.style.display = 'table';
    if (noUsersMessage) noUsersMessage.style.display = 'none';
    
    // Generate table rows
    tbody.innerHTML = dashboardState.filteredUsers.map(user => {
        const completedWeeks = user.completedWeeks ? user.completedWeeks.length : 0;
        const progressPercentage = Math.round((completedWeeks / 7) * 100);
        const lastActivityFormatted = formatDate(user.lastActivity);
        const daysSinceActivity = daysBetween(user.lastActivity, new Date());
        
        // Determine status classes
        const activityStatus = daysSinceActivity > 30 ? 'inactive' : 
                              daysSinceActivity > 7 ? 'partial' : 'active';
        
        const sessionStatus = completedWeeks >= 7 ? 'completed' :
                             user.hasStartedCoaching ? 'partial' : 'not-started';
        
        const leadScoreClass = (user.leadScore || 0) >= 70 ? 'high' : 
                              (user.leadScore || 0) >= 40 ? 'medium' : 'low';
        
        const isSelected = dashboardState.selectedUsers.has(user.id);
        
        // Avatar rendering
        const avatar = user.avatar || {};
        const avatarStyle = `background: linear-gradient(135deg, ${avatar.backgroundColor || '#ea580c'}, ${avatar.accentColor || '#f97316'})`;
        const avatarContent = avatar.emoji ? 
            `<span class="avatar-emoji">${avatar.emoji}</span>` : 
            `<span class="avatar-initials">${avatar.initials || user.name.substring(0, 2).toUpperCase()}</span>`;
        
        return `
            <tr class="${isSelected ? 'selected' : ''}" data-user-id="${user.id}">
                <td>
                    <input type="checkbox" class="user-checkbox" 
                           ${isSelected ? 'checked' : ''} 
                           onchange="window.dashboardCore.toggleUserSelection('${user.id}')">
                </td>
                <td>
                    <div class="user-info">
                        <div class="user-avatar-advanced" style="${avatarStyle}" title="${avatar.style || 'Auto-generated'}">
                            ${avatarContent}
                            ${avatar.activity ? `<span class="avatar-activity">${avatar.activity}</span>` : ''}
                        </div>
                        <div class="user-details">
                            <div class="user-name">${user.name}</div>
                            <div class="user-email">${user.email}</div>
                            ${user.quizScore ? `<div class="quiz-score">Quiz: ${user.quizScore}%</div>` : ''}
                        </div>
                    </div>
                </td>
                <td>
                    <div class="profile-badge">
                        ${getProfileIcon(user.profileQuadrant)} ${user.profileQuadrant}
                        <div class="profile-meta">${user.consciousnessLevel}</div>
                    </div>
                </td>
                <td>
                    <div class="lead-score ${leadScoreClass}">
                        ${Math.round(user.leadScore || 0)}%
                    </div>
                </td>
                <td>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                        </div>
                        <div class="progress-text">${completedWeeks}/7 settimane</div>
                    </div>
                </td>
                <td>
                    <span class="status-badge status-${sessionStatus}">
                        ${getStatusText(sessionStatus)}
                    </span>
                </td>
                <td>
                    <div class="last-activity">
                        <div class="activity-date">${lastActivityFormatted}</div>
                        <div class="activity-time status-badge status-${activityStatus}">
                            ${getActivityText(daysSinceActivity)}
                        </div>
                    </div>
                </td>
                <td>
                    <button class="action-btn primary" 
                            onclick="window.userManagement.showUserDetails('${user.id}')">
                        👁️ Dettagli
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    // Update select all checkbox
    updateSelectAllCheckbox();
}

/**
 * Update week analytics
 */
function updateWeekAnalytics() {
    const weekStats = calculateWeekAnalytics();
    const container = document.getElementById('weekAnalytics');
    
    if (!container) return;
    
    container.innerHTML = Object.entries(weekStats).map(([week, stats]) => {
        const completionRateClass = stats.completionRate >= 70 ? 'high' :
                                   stats.completionRate >= 40 ? 'medium' : 'low';
        
        return `
            <div class="week-card">
                <div class="week-header">
                    <h4 class="week-title">Settimana ${week}</h4>
                    <div class="completion-rate ${completionRateClass}">
                        ${stats.completionRate}%
                    </div>
                </div>
                <div class="week-stats">
                    <div class="stat-item">
                        <span class="stat-label">▶️ Iniziate:</span>
                        <span class="stat-value">${stats.started}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">✅ Completate:</span>
                        <span class="stat-value">${stats.completed}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">⏱️ Durata Media:</span>
                        <span class="stat-value">${stats.avgDuration}min</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Update AI metrics
 */
function updateAIMetrics() {
    const aiMetrics = calculateAIMetrics();
    
    const elements = {
        totalConversations: document.getElementById('totalConversations'),
        todayConversations: document.getElementById('todayConversations'),
        homeworkGenerated: document.getElementById('homeworkGenerated'),
        avgMessages: document.getElementById('avgMessages')
    };
    
    if (elements.totalConversations) elements.totalConversations.textContent = aiMetrics.totalConversations;
    if (elements.todayConversations) elements.todayConversations.textContent = aiMetrics.todayConversations;
    if (elements.homeworkGenerated) elements.homeworkGenerated.textContent = aiMetrics.homeworkGenerated;
    if (elements.avgMessages) elements.avgMessages.textContent = aiMetrics.avgMessages;
}

/**
 * Update avatar analytics
 */
function updateAvatarAnalytics() {
    const avatarMetrics = calculateAvatarMetrics();
    
    // Se non c'è una sezione avatar, la creiamo dinamicamente
    let avatarSection = document.getElementById('avatarAnalytics');
    if (!avatarSection) {
        // Inserisci dopo la sezione AI
        const aiSection = document.querySelector('.ai-section');
        if (aiSection) {
            avatarSection = document.createElement('section');
            avatarSection.className = 'analytics-section';
            avatarSection.id = 'avatarAnalytics';
            avatarSection.innerHTML = `
                <h3 class="section-title">🎨 Analytics Avatar & Quiz</h3>
                <div class="avatar-analytics-grid" id="avatarAnalyticsGrid"></div>
            `;
            aiSection.parentNode.insertBefore(avatarSection, aiSection.nextSibling);
        }
    }
    
    const container = document.getElementById('avatarAnalyticsGrid');
    if (!container) return;
    
    container.innerHTML = `
        <!-- Distribuzione Quadranti -->
        <div class="avatar-metric-card">
            <h4>📊 Distribuzione Quadranti</h4>
            <div class="quadrant-distribution">
                <div class="quadrant-item">
                    <span class="quadrant-icon">🏆</span>
                    <span class="quadrant-label">Q1</span>
                    <span class="quadrant-value">${avatarMetrics.quadrantDistribution.Q1}</span>
                </div>
                <div class="quadrant-item">
                    <span class="quadrant-icon">💪</span>
                    <span class="quadrant-label">Q2</span>
                    <span class="quadrant-value">${avatarMetrics.quadrantDistribution.Q2}</span>
                </div>
                <div class="quadrant-item">
                    <span class="quadrant-icon">🎯</span>
                    <span class="quadrant-label">Q3</span>
                    <span class="quadrant-value">${avatarMetrics.quadrantDistribution.Q3}</span>
                </div>
                <div class="quadrant-item">
                    <span class="quadrant-icon">🌱</span>
                    <span class="quadrant-label">Q4</span>
                    <span class="quadrant-value">${avatarMetrics.quadrantDistribution.Q4}</span>
                </div>
            </div>
        </div>
        
        <!-- Quiz Completeness -->
        <div class="avatar-metric-card">
            <h4>📝 Completezza Quiz Media</h4>
            <div class="completion-circle">
                <div class="completion-value">${avatarMetrics.avgQuizCompleteness}%</div>
                <div class="completion-label">Media Completezza</div>
            </div>
        </div>
        
        <!-- Profile Distribution -->
        <div class="avatar-metric-card">
            <h4>👥 Distribuzione Profili</h4>
            <div class="profile-distribution">
                ${Object.entries(avatarMetrics.profileDistribution || {}).map(([profile, count]) => `
                    <div class="profile-item">
                        <span class="profile-label">${getProfileEmoji(profile)} ${getProfileDisplayName(profile)}</span>
                        <span class="profile-value">${count}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- Score Medi -->
        <div class="avatar-metric-card">
            <h4>📈 Score Medi</h4>
            <div class="avg-scores">
                <div class="score-item">
                    <span class="score-label">💪 Salute</span>
                    <span class="score-value">${avatarMetrics.avgScores?.health || 0}</span>
                </div>
                <div class="score-item">
                    <span class="score-label">💼 Professionale</span>
                    <span class="score-value">${avatarMetrics.avgScores?.professional || 0}</span>
                </div>
                <div class="score-item">
                    <span class="score-label">👥 Sociale</span>
                    <span class="score-value">${avatarMetrics.avgScores?.social || 0}</span>
                </div>
                <div class="score-item">
                    <span class="score-label">🌟 Benessere</span>
                    <span class="score-value">${avatarMetrics.avgScores?.wellbeing || 0}</span>
                </div>
            </div>
        </div>
        
        <!-- Avatar Styles Popular -->
        <div class="avatar-metric-card">
            <h4>🎨 Stili Avatar Popolari</h4>
            <div class="avatar-styles">
                ${Object.entries(avatarMetrics.avatarStyles || {}).map(([style, count]) => `
                    <div class="style-item">
                        <span class="style-label">${getStyleEmoji(style)} ${getStyleName(style)}</span>
                        <span class="style-value">${count}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * MODIFICATA: Update sessions list con filtri
 */
function updateSessionsList() {
    const container = document.getElementById('sessionsList');
    if (!container) return;
    
    // Filtra sessioni in base al filtro selezionato
    const filteredSessions = getFilteredSessions();
    
    // Crea header con filtri se non esiste
    ensureSessionsHeader();
    
    // Aggiorna counter
    updateSessionsCounter(filteredSessions.length);
    
    if (filteredSessions.length === 0) {
        container.innerHTML = `
            <div class="no-data sessions-no-data">
                <div class="no-data-icon">📋</div>
                <h3>Nessuna Sessione</h3>
                <p>Non ci sono sessioni per il periodo selezionato.</p>
                <button class="action-btn secondary" onclick="window.dashboardCore.changeSessionsFilter('all')">
                    📅 Mostra Tutte
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredSessions.map(session => {
        const user = firebaseData.allUsers.find(u => u.id === session.userId || u.email === session.userId);
        const userName = user ? user.name : session.userId || 'Utente sconosciuto';
        const duration = formatDuration(session.duration || 0);
        const timestamp = formatDateTime(session.timestamp);
        
        // Status indicator per sessione
        const statusClass = session.completed ? 'completed' : 'in-progress';
        const statusIcon = session.completed ? '✅' : '⏳';
        
        return `
            <div class="session-item">
                <div class="session-info">
                    <div class="session-user">
                        <span class="session-avatar">${getUserInitials(userName)}</span>
                        <span class="session-name">${userName}</span>
                        <span class="session-status ${statusClass}">${statusIcon}</span>
                    </div>
                    <div class="session-details">
                        <span class="session-detail">📝 ${session.sessionType || 'Sessione'}</span>
                        <span class="session-detail">⏱️ ${duration}</span>
                        <span class="session-detail">💬 ${session.aiResponsesGenerated || 0} AI</span>
                        <span class="session-detail">📊 ${session.source || 'unknown'}</span>
                    </div>
                </div>
                <div class="session-meta">
                    <span class="session-date">${timestamp}</span>
                    <button class="action-btn session-details-btn" onclick="showSessionDetails('${session.id}')" title="Vedi dettagli sessione">
                        👁️ Dettagli
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * NUOVA: Filtra sessioni in base al filtro selezionato
 */
function getFilteredSessions() {
    const sessions = [...firebaseData.allSessions].sort((a, b) => b.timestamp - a.timestamp);
    const now = new Date();
    
    switch (dashboardState.sessionsFilter) {
        case 'today':
            return sessions.filter(session => {
                const sessionDate = new Date(session.timestamp);
                return sessionDate.toDateString() === now.toDateString();
            });
            
        case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return sessions.filter(session => 
                new Date(session.timestamp) >= weekAgo
            );
            
        case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return sessions.filter(session => 
                new Date(session.timestamp) >= monthAgo
            );
            
        case 'all':
            return sessions.slice(0, 50); // Limite per performance
            
        default:
            return sessions.filter(session => {
                const sessionDate = new Date(session.timestamp);
                return sessionDate.toDateString() === now.toDateString();
            });
    }
}

/**
 * NUOVA: Assicura che l'header con filtri esista
 */
function ensureSessionsHeader() {
    const sessionsSection = document.querySelector('.sessions-section');
    if (!sessionsSection) return;
    
    let header = sessionsSection.querySelector('.sessions-header');
    if (!header) {
        header = document.createElement('div');
        header.className = 'sessions-header';
        header.innerHTML = `
            <div class="sessions-title-row">
                <h3 class="section-title">📋 Sessioni Recenti</h3>
                <div class="sessions-controls">
                    <select id="sessionsFilter" class="sessions-filter">
                        <option value="today">📅 Oggi</option>
                        <option value="week">📅 Ultima Settimana</option>
                        <option value="month">📅 Ultimo Mese</option>
                        <option value="all">📅 Tutte</option>
                    </select>
                    <span class="sessions-count" id="sessionsCount">0 sessioni</span>
                </div>
            </div>
        `;
        
        // Inserisci all'inizio della sezione
        const sessionsList = document.getElementById('sessionsList');
        if (sessionsList) {
            sessionsSection.insertBefore(header, sessionsList);
        }
        
        // Setup event listener per il nuovo filtro
        const newFilter = header.querySelector('#sessionsFilter');
        if (newFilter) {
            newFilter.value = dashboardState.sessionsFilter;
            newFilter.addEventListener('change', handleSessionsFilterChange);
        }
    }
}

/**
 * NUOVA: Aggiorna counter sessioni
 */
function updateSessionsCounter(count) {
    const counter = document.getElementById('sessionsCount');
    if (counter) {
        const filterText = getFilterDisplayText(dashboardState.sessionsFilter);
        counter.textContent = `${count} ${filterText}`;
    }
}

/**
 * NUOVA: Ottieni testo display per filtro
 */
function getFilterDisplayText(filter) {
    const texts = {
        'today': 'oggi',
        'week': 'questa settimana', 
        'month': 'questo mese',
        'all': 'totali'
    };
    return `sessioni ${texts[filter] || 'filtrate'}`;
}

/**
 * NUOVA: Cambia filtro sessioni (esposta pubblicamente)
 */
export function changeSessionsFilter(filter) {
    dashboardState.sessionsFilter = filter;
    
    // Aggiorna select se esiste
    const filterSelect = document.getElementById('sessionsFilter');
    if (filterSelect) {
        filterSelect.value = filter;
    }
    
    updateSessionsList();
}

/**
 * NUOVA: Ottieni iniziali utente per avatar mini
 */
function getUserInitials(name) {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

/**
 * Update time display
 */
function updateTimeDisplay() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('it-IT', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    
    const timeElement = document.getElementById('lastUpdate');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// ==========================================================================
// SELECTION MANAGEMENT
// ==========================================================================

/**
 * Toggle user selection
 */
export function toggleUserSelection(userId) {
    if (dashboardState.selectedUsers.has(userId)) {
        dashboardState.selectedUsers.delete(userId);
    } else {
        dashboardState.selectedUsers.add(userId);
    }
    
    updateSelectionUI();
}

/**
 * Update selection UI elements
 */
function updateSelectionUI() {
    const selectedCount = dashboardState.selectedUsers.size;
    
    // Update counter
    const counter = document.getElementById('selectedCount');
    if (counter) {
        counter.textContent = `${selectedCount} selezionati`;
    }
    
    // Show/hide bulk actions button
    const bulkActionBtn = document.getElementById('bulkActionBtn');
    if (bulkActionBtn) {
        bulkActionBtn.style.display = selectedCount > 0 ? 'inline-block' : 'none';
    }
    
    // Update select all checkbox
    updateSelectAllCheckbox();
    
    // Update row highlighting
    const rows = document.querySelectorAll('[data-user-id]');
    rows.forEach(row => {
        const userId = row.dataset.userId;
        if (dashboardState.selectedUsers.has(userId)) {
            row.classList.add('selected');
        } else {
            row.classList.remove('selected');
        }
    });
}

/**
 * Update select all checkbox state
 */
function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('selectAll');
    if (!selectAllCheckbox) return;
    
    const totalVisible = dashboardState.filteredUsers.length;
    const selectedVisible = dashboardState.filteredUsers.filter(u => 
        dashboardState.selectedUsers.has(u.id)
    ).length;
    
    if (selectedVisible === 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    } else if (selectedVisible === totalVisible) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
    } else {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
    }
}

// ==========================================================================
// ERROR HANDLING
// ==========================================================================

/**
 * Show table error state
 */
function showTableErrorState() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = `
        <tr>
            <td colspan="8" class="loading-row">
                <div class="loading-content">
                    <span style="color: #ef4444;">❌ Errore caricamento dati</span>
                    <button class="reload-btn" onclick="window.dashboardCore.handleRefreshClick">
                        🔄 Riprova
                    </button>
                </div>
            </td>
        </tr>
    `;
}

// ==========================================================================
// UTILITY FUNCTIONS - AGGIUNTE LE FUNZIONI MANCANTI
// ==========================================================================

/**
 * Get style emoji for avatar analytics
 */
function getStyleEmoji(style) {
    const styleEmojis = {
        'athletic': '🏃‍♂️',
        'active': '🚶‍♂️', 
        'beginner': '🧘‍♂️',
        'energetic': '⚡',
        'tired': '😴',
        'focused': '🎯',
        'experienced': '🏆'
    };
    return styleEmojis[style] || '👤';
}

/**
 * Get style name for avatar analytics
 */
function getStyleName(style) {
    const styleNames = {
        'athletic': 'Atletico',
        'active': 'Attivo',
        'beginner': 'Principiante',
        'energetic': 'Energico',
        'tired': 'Stanco',
        'focused': 'Concentrato',
        'experienced': 'Esperto'
    };
    return styleNames[style] || style;
}

/**
 * Get profile emoji for display
 */
function getProfileEmoji(profileType) {
    const profileEmojis = {
        'motivato_inconsistente': '🎢',
        'stressato_esaurito': '😰',
        'perfezionista_bloccato': '🔒',
        'equilibrato_avanzato': '⚖️',
        'principiante_entusiasta': '🌟',
        'esperto_demotivato': '😐'
    };
    return profileEmojis[profileType] || '👤';
}

/**
 * Get profile display name
 */
function getProfileDisplayName(profileType) {
    const profileNames = {
        'motivato_inconsistente': 'Motivato Inconsistente',
        'stressato_esaurito': 'Stressato Esaurito',
        'perfezionista_bloccato': 'Perfezionista Bloccato',
        'equilibrato_avanzato': 'Equilibrato Avanzato',
        'principiante_entusiasta': 'Principiante Entusiasta',
        'esperto_demotivato': 'Esperto Demotivato'
    };
    return profileNames[profileType] || profileType;
}

/**
 * Get profile icon
 */
function getProfileIcon(quadrant) {
    const icons = {
        'Q1': '🏆', // Atleta in Crescita
        'Q2': '💪', // Esploratore Motivato
        'Q3': '🎯', // Esperto Demotivato
        'Q4': '🌱'  // Guerriero Determinato
    };
    return icons[quadrant] || '👤';
}

/**
 * Get status text
 */
function getStatusText(status) {
    const texts = {
        'completed': '✅ Completato',
        'partial': '⏳ In corso',
        'not-started': '⭕ Non iniziato'
    };
    return texts[status] || status;
}

/**
 * Get activity text
 */
function getActivityText(days) {
    if (days === 0) return 'Oggi';
    if (days === 1) return 'Ieri';
    if (days <= 7) return `${days}g fa`;
    if (days <= 30) return `${days}g fa`;
    return `${days}g fa`;
}

/**
 * Format duration
 */
function formatDuration(minutes) {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
}

/**
 * Download CSV file
 */
function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; 
        top: 80px; 
        right: 20px; 
        padding: 15px 20px; 
        border-radius: 12px; 
        font-weight: bold; 
        z-index: 10000; 
        box-shadow: 0 8px 25px rgba(0,0,0,0.4); 
        max-width: 350px;
        animation: slideInRight 0.3s ease-out;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 0.9rem;
    `;
    
    switch (type) {
        case 'success':
            toast.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            toast.style.color = 'white';
            toast.innerHTML = `✅ ${message}`;
            break;
        case 'error':
            toast.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            toast.style.color = 'white';
            toast.innerHTML = `❌ ${message}`;
            break;
        case 'warning':
            toast.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
            toast.style.color = 'white';
            toast.innerHTML = `⚠️ ${message}`;
            break;
        default:
            toast.style.background = 'linear-gradient(135deg, #ea580c, #f97316)';
            toast.style.color = 'white';
            toast.innerHTML = `🔔 ${message}`;
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }, 4000);
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==========================================================================
// ANIMATION STYLES + NUOVI STILI SESSIONI
// ==========================================================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .profile-distribution, .avatar-styles, .avg-scores {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .profile-item, .score-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        background: rgba(15, 23, 42, 0.7);
        border-radius: 6px;
        border: 1px solid #334155;
    }
    
    .profile-label, .score-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #f8fafc;
        font-size: 0.8rem;
    }
    
    .profile-value, .score-value {
        color: #ea580c;
        font-weight: bold;
        font-size: 0.9rem;
    }

    /* NUOVI STILI PER SESSIONI */
    .sessions-header {
        margin-bottom: 1rem;
    }
    
    .sessions-title-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .sessions-controls {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .sessions-filter {
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid #475569;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.9rem;
        cursor: pointer;
    }
    
    .sessions-filter:focus {
        outline: none;
        border-color: #ea580c;
        box-shadow: 0 0 0 2px rgba(234, 88, 12, 0.2);
    }
    
    .sessions-count {
        color: #94a3b8;
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .session-item {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid #334155;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 0.75rem;
        transition: all 0.3s ease;
    }
    
    .session-item:hover {
        background: rgba(15, 23, 42, 0.8);
        border-color: #475569;
        transform: translateY(-1px);
    }
    
    .session-info {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
    }
    
    .session-user {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .session-avatar {
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #ea580c, #f97316);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 0.8rem;
        font-weight: bold;
    }
    
    .session-name {
        color: white;
        font-weight: 600;
        font-size: 0.95rem;
    }
    
    .session-status {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .session-status.completed {
        background: rgba(34, 197, 94, 0.2);
        color: #86efac;
        border: 1px solid rgba(34, 197, 94, 0.3);
    }
    
    .session-status.in-progress {
        background: rgba(251, 191, 36, 0.2);
        color: #fde047;
        border: 1px solid rgba(251, 191, 36, 0.3);
    }
    
    .session-details {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }
    
    .session-detail {
        color: #94a3b8;
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .session-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 0.75rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .session-date {
        color: #94a3b8;
        font-size: 0.85rem;
    }
    
    .session-details-btn {
        background: linear-gradient(135deg, #2563eb, #3b82f6) !important;
        color: white !important;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
    }
    
    .session-details-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
    
    .sessions-no-data {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid #334155;
        border-radius: 12px;
        padding: 2rem;
        text-align: center;
    }
    
    .sessions-no-data .no-data-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    .sessions-no-data h3 {
        color: white;
        margin-bottom: 0.5rem;
    }
    
    .sessions-no-data p {
        color: #94a3b8;
        margin-bottom: 1.5rem;
    }
    
    @media (max-width: 768px) {
        .sessions-title-row {
            flex-direction: column;
            align-items: stretch;
        }
        
        .sessions-controls {
            justify-content: space-between;
        }
        
        .session-details {
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .session-meta {
            flex-direction: column;
            gap: 0.75rem;
            align-items: stretch;
        }
    }
`;
document.head.appendChild(style);

// ==========================================================================
// EXPORTS
// ==========================================================================

// Export for window access
window.dashboardCore = {
    initializeDashboardCore,
    toggleUserSelection,
    changeSessionsFilter,
    dashboardState
};

console.log('⚡ Dashboard Core module caricato');