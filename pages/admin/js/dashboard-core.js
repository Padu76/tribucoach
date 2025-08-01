// ==========================================================================
// DASHBOARD CORE - LIFESTYLEFITNESSCODE ADMIN
// ==========================================================================

import { 
    firebaseData, 
    loadAllFirebaseData, 
    calculateDashboardKPIs, 
    calculateWeekAnalytics, 
    calculateAIMetrics,
    generateUsersCSV,
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
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
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
        
        return `
            <tr class="${isSelected ? 'selected' : ''}" data-user-id="${user.id}">
                <td>
                    <input type="checkbox" class="user-checkbox" 
                           ${isSelected ? 'checked' : ''} 
                           onchange="window.dashboardCore.toggleUserSelection('${user.id}')">
                </td>
                <td>
                    <div class="user-info">
                        <div class="user-avatar">${initials}</div>
                        <div class="user-details">
                            <div class="user-name">${user.name}</div>
                            <div class="user-email">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="profile-badge">
                        ${getProfileIcon(user.profileQuadrant)} ${user.profileQuadrant}
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
 * Update sessions list
 */
function updateSessionsList() {
    const container = document.getElementById('sessionsList');
    if (!container) return;
    
    const sessions = firebaseData.allSessions
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10);
    
    if (sessions.length === 0) {
        container.innerHTML = `
            <div class="no-data">
                <div class="no-data-icon">📋</div>
                <h3>Nessuna Sessione</h3>
                <p>Le sessioni di coaching appariranno qui.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = sessions.map(session => {
        const user = firebaseData.allUsers.find(u => u.id === session.userId);
        const userName = user ? user.name : 'Utente sconosciuto';
        const duration = formatDuration(session.duration || 0);
        const timestamp = formatDateTime(session.timestamp);
        
        return `
            <div class="session-item">
                <div class="session-info">
                    <div class="session-user">👤 ${userName}</div>
                    <div class="session-details">
                        <span>📝 Settimana ${session.weekNumber}</span>
                        <span>⏱️ ${duration}</span>
                        <span>💬 ${session.aiResponsesGenerated || 0} AI responses</span>
                    </div>
                </div>
                <div class="session-meta">
                    <span class="session-date">${timestamp}</span>
                    <button class="action-btn" onclick="showSessionDetails('${session.id}')">
                        👁️ Dettagli
                    </button>
                </div>
            </div>
        `;
    }).join('');
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
// UTILITY FUNCTIONS
// ==========================================================================

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
// ANIMATION STYLES
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
`;
document.head.appendChild(style);

// ==========================================================================
// EXPORTS
// ==========================================================================
export { 
    dashboardState,
    toggleUserSelection
};

// Export for window access
window.dashboardCore = {
    initializeDashboardCore,
    toggleUserSelection,
    handleRefreshClick: () => handleRefreshClick({ target: document.getElementById('refreshBtn') }),
    dashboardState
};

console.log('⚡ Dashboard Core module caricato');