// ==========================================================================
// USER MANAGEMENT - LIFESTYLEFITNESSCODE ADMIN
// ==========================================================================

import { 
    firebaseData, 
    updateUserNotes, 
    markCoachingStarted as firebaseMarkCoachingStarted, 
    addUserTag as firebaseAddUserTag,
    formatDate,
    formatDateTime,
    daysBetween
} from './firebase-admin.js';

// Get dashboard state from window (since no export available)
const getDashboardState = () => window.dashboardCore?.dashboardState || { selectedUsers: new Set() };

// ==========================================================================
// GLOBAL STATE
// ==========================================================================
let currentUser = null;
let modalHistory = [];

// ==========================================================================
// INITIALIZATION
// ==========================================================================

/**
 * Inizializza user management
 */
export function initializeUserManagement() {
    console.log('👥 Inizializzazione User Management...');
    
    setupModalEventListeners();
    setupBulkActionsListeners();
    
    console.log('✅ User Management inizializzato');
}

/**
 * Setup modal event listeners
 */
function setupModalEventListeners() {
    // User modal close buttons
    const userModalClose = document.getElementById('modalClose');
    const bulkModalClose = document.getElementById('bulkModalClose');
    
    if (userModalClose) {
        userModalClose.addEventListener('click', closeUserModal);
    }
    
    if (bulkModalClose) {
        bulkModalClose.addEventListener('click', closeBulkModal);
    }
    
    // Modal backdrop clicks
    const userModal = document.getElementById('userModal');
    const bulkModal = document.getElementById('bulkModal');
    
    if (userModal) {
        userModal.addEventListener('click', (e) => {
            if (e.target === userModal) closeUserModal();
        });
    }
    
    if (bulkModal) {
        bulkModal.addEventListener('click', (e) => {
            if (e.target === bulkModal) closeBulkModal();
        });
    }
}

/**
 * Setup bulk actions listeners
 */
function setupBulkActionsListeners() {
    const bulkExport = document.getElementById('bulkExport');
    const bulkMarkCoaching = document.getElementById('bulkMarkCoaching');
    const bulkWhatsApp = document.getElementById('bulkWhatsApp');
    
    if (bulkExport) {
        bulkExport.addEventListener('click', handleBulkExport);
    }
    
    if (bulkMarkCoaching) {
        bulkMarkCoaching.addEventListener('click', handleBulkMarkCoaching);
    }
    
    if (bulkWhatsApp) {
        bulkWhatsApp.addEventListener('click', handleBulkWhatsApp);
    }
}

// ==========================================================================
// USER MODAL FUNCTIONS
// ==========================================================================

/**
 * Mostra dettagli completi utente
 */
export function showUserDetails(userId) {
    currentUser = firebaseData.allUsers.find(user => user.id === userId);
    if (!currentUser) {
        showNotification('Utente non trovato', 'error');
        return;
    }
    
    console.log('👁️ Apertura dettagli utente:', currentUser.name);
    
    // Update modal title
    const modalTitle = document.getElementById('modalUserName');
    if (modalTitle) {
        modalTitle.textContent = `👤 ${currentUser.name}`;
    }
    
    // Generate modal content
    const modalBody = document.getElementById('modalBody');
    if (modalBody) {
        modalBody.innerHTML = generateUserModalContent(currentUser);
    }
    
    // Show modal
    const userModal = document.getElementById('userModal');
    if (userModal) {
        userModal.classList.add('active');
        modalHistory.push('user');
    }
    
    // Setup modal-specific event listeners
    setupModalSpecificListeners(userId);
}

/**
 * Genera contenuto completo modal utente
 */
function generateUserModalContent(user) {
    const completedWeeks = user.completedWeeks ? user.completedWeeks.length : 0;
    const progressPercentage = Math.round((completedWeeks / 7) * 100);
    const daysSinceRegistration = daysBetween(user.registrationDate, new Date());
    const daysSinceActivity = daysBetween(user.lastActivity, new Date());
    
    return `
        <div class="user-detail-grid">
            <!-- INFORMAZIONI GENERALI -->
            <div class="detail-section">
                <h4 class="detail-title">📋 Informazioni Generali</h4>
                <div class="detail-rows">
                    <div class="detail-row">
                        <span class="label">Nome Completo:</span>
                        <span class="value">${user.name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Email:</span>
                        <span class="value">${user.email}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Telefono:</span>
                        <span class="value">${user.phone || 'Non fornito'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Età:</span>
                        <span class="value">${user.age || 'Non fornita'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Città:</span>
                        <span class="value">${user.city || 'Non fornita'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Registrazione:</span>
                        <span class="value">${formatDate(user.registrationDate)} (${daysSinceRegistration} giorni fa)</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Ultima Attività:</span>
                        <span class="value">${formatDateTime(user.lastActivity)} (${daysSinceActivity} giorni fa)</span>
                    </div>
                </div>
            </div>

            <!-- PROFILO COACHING -->
            <div class="detail-section">
                <h4 class="detail-title">🎯 Profilo Coaching</h4>
                <div class="detail-rows">
                    <div class="detail-row">
                        <span class="label">Lead Score:</span>
                        <span class="value lead-score ${getLeadScoreClass(user.leadScore)}">${Math.round(user.leadScore || 0)}%</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Quadrante:</span>
                        <span class="value">${getProfileIcon(user.profileQuadrant)} ${user.profileQuadrant}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Descrizione:</span>
                        <span class="value">${getQuadrantDescription(user.profileQuadrant)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Livello Coscienza:</span>
                        <span class="value">${user.consciousnessLevel}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Approccio:</span>
                        <span class="value">${getConsciousnessDescription(user.consciousnessLevel)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Coaching Iniziato:</span>
                        <span class="value">${user.hasStartedCoaching ? '✅ Sì' : '❌ No'}</span>
                    </div>
                </div>
            </div>

            <!-- PROGRESSO COACHING -->
            <div class="detail-section full-width">
                <h4 class="detail-title">📊 Progresso Coaching</h4>
                <div class="progress-overview">
                    <div class="progress-summary">
                        <div class="progress-item">
                            <span class="progress-label">Settimana Corrente:</span>
                            <span class="progress-value">${user.currentWeek || 1} / 7</span>
                        </div>
                        <div class="progress-item">
                            <span class="progress-label">Completamento:</span>
                            <span class="progress-value">${progressPercentage}%</span>
                        </div>
                        <div class="progress-item">
                            <span class="progress-label">Sessioni Totali:</span>
                            <span class="progress-value">${user.totalSessions || 0}</span>
                        </div>
                    </div>
                    
                    <div class="week-progress-grid">
                        ${generateWeekProgressGrid(user)}
                    </div>
                </div>
            </div>

            <!-- DATI FITNESS -->
            <div class="detail-section">
                <h4 class="detail-title">🏋️ Dati Fitness</h4>
                <div class="detail-rows">
                    <div class="detail-row">
                        <span class="label">Esperienza:</span>
                        <span class="value">${user.experience || 'Non specificata'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Livello Attività:</span>
                        <span class="value">${user.activityLevel || 'Non specificato'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Motivazione (1-5):</span>
                        <span class="value">${generateStarRating(user.readinessLevel)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Impegno (1-5):</span>
                        <span class="value">${generateStarRating(user.commitmentLevel)}</span>
                    </div>
                </div>
            </div>

            <!-- OBIETTIVI E SFIDE -->
            <div class="detail-section">
                <h4 class="detail-title">🎯 Obiettivi</h4>
                <div class="goals-container">
                    ${generateGoalsTags(user.goals)}
                </div>
                
                <h4 class="detail-title" style="margin-top: 1rem;">⚠️ Sfide</h4>
                <div class="challenges-container">
                    ${generateChallengesTags(user.challenges)}
                </div>
            </div>

            <!-- NOTE COACHING -->
            <div class="detail-section full-width">
                <h4 class="detail-title">📝 Note Coaching Private</h4>
                <textarea class="notes-textarea" id="userNotes" placeholder="Aggiungi note private su questo utente...">${user.notes || ''}</textarea>
                <div class="notes-actions">
                    <button class="action-btn primary" onclick="window.userManagement.saveUserNotes('${user.id}')">
                        💾 Salva Note
                    </button>
                    <button class="action-btn secondary" onclick="window.userManagement.addUserTag('${user.id}')">
                        🏷️ Aggiungi Tag
                    </button>
                </div>
            </div>

            <!-- AZIONI RAPIDE -->
            <div class="detail-section full-width">
                <h4 class="detail-title">⚡ Azioni Rapide</h4>
                <div class="quick-actions">
                    ${user.phone ? `
                        <button class="action-btn whatsapp large" onclick="window.userManagement.openWhatsApp('${user.phone}')">
                            📱 Contatta WhatsApp
                        </button>
                    ` : ''}
                    <button class="action-btn primary large" onclick="window.open('mailto:${user.email}?subject=LifestyleFitnessCoach - Supporto Coaching', '_blank')">
                        📧 Invia Email
                    </button>
                    ${!user.hasStartedCoaching ? `
                        <button class="action-btn secondary large" onclick="window.userManagement.markCoachingStartedSingle('${user.id}')">
                            🚀 Segna Coaching Iniziato
                        </button>
                    ` : ''}
                    <button class="action-btn secondary large" onclick="window.userManagement.showQuizData('${user.id}')">
                        📋 Dati Quiz Completi
                    </button>
                    <button class="action-btn secondary large" onclick="window.userManagement.generateUserReport('${user.id}')">
                        📊 Genera Report
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Genera griglia progresso settimane
 */
function generateWeekProgressGrid(user) {
    let html = '';
    
    for (let week = 1; week <= 7; week++) {
        const isCompleted = user.completedWeeks && user.completedWeeks.includes(week);
        const isCurrent = user.currentWeek === week;
        const isAccessible = week <= (user.currentWeek || 1);
        
        let statusClass = 'not-started';
        let statusIcon = '⭕';
        let statusText = 'Non iniziata';
        
        if (isCompleted) {
            statusClass = 'completed';
            statusIcon = '✅';
            statusText = 'Completata';
        } else if (isCurrent) {
            statusClass = 'current';
            statusIcon = '⏳';
            statusText = 'In corso';
        } else if (isAccessible) {
            statusClass = 'accessible';
            statusIcon = '🔓';
            statusText = 'Disponibile';
        }
        
        html += `
            <div class="week-progress-item ${statusClass}">
                <div class="week-number">W${week}</div>
                <div class="week-status">${statusIcon}</div>
                <div class="week-label">${statusText}</div>
            </div>
        `;
    }
    
    return html;
}

/**
 * Genera stelle per rating
 */
function generateStarRating(rating) {
    if (!rating || isNaN(rating)) return 'N/A';
    
    const stars = Math.max(1, Math.min(5, parseInt(rating)));
    const fullStars = '⭐'.repeat(stars);
    const emptyStars = '☆'.repeat(5 - stars);
    
    return `${fullStars}${emptyStars} (${rating}/5)`;
}

/**
 * Genera tags obiettivi
 */
function generateGoalsTags(goals) {
    if (!Array.isArray(goals) || goals.length === 0) {
        return '<span class="no-data">Nessun obiettivo specificato</span>';
    }
    
    return goals.map(goal => 
        `<span class="goal-tag">${goal}</span>`
    ).join('');
}

/**
 * Genera tags sfide
 */
function generateChallengesTags(challenges) {
    if (!Array.isArray(challenges) || challenges.length === 0) {
        return '<span class="no-data">Nessuna sfida dichiarata</span>';
    }
    
    return challenges.map(challenge => 
        `<span class="challenge-tag">${challenge}</span>`
    ).join('');
}

/**
 * Setup listeners specifici per modal
 */
function setupModalSpecificListeners(userId) {
    // Auto-save notes on blur
    const notesTextarea = document.getElementById('userNotes');
    if (notesTextarea) {
        notesTextarea.addEventListener('blur', () => {
            if (notesTextarea.value !== (currentUser.notes || '')) {
                saveUserNotes(userId, false); // Silent save
            }
        });
    }
}

// ==========================================================================
// USER ACTIONS
// ==========================================================================

/**
 * Salva note utente
 */
export async function saveUserNotes(userId, showFeedback = true) {
    const notesTextarea = document.getElementById('userNotes');
    if (!notesTextarea) return;
    
    const notes = notesTextarea.value.trim();
    
    try {
        await updateUserNotes(userId, notes);
        
        // Update local data
        if (currentUser && currentUser.id === userId) {
            currentUser.notes = notes;
        }
        
        if (showFeedback) {
            showNotification('Note salvate con successo', 'success');
            
            // Visual feedback on button
            const saveBtn = document.querySelector('.notes-actions .action-btn.primary');
            if (saveBtn) {
                const originalText = saveBtn.textContent;
                saveBtn.textContent = '✅ Salvato!';
                saveBtn.classList.add('bg-success');
                
                setTimeout(() => {
                    saveBtn.textContent = originalText;
                    saveBtn.classList.remove('bg-success');
                }, 2000);
            }
        }
        
    } catch (error) {
        console.error('Errore salvataggio note:', error);
        if (showFeedback) {
            showNotification('Errore salvataggio note', 'error');
        }
    }
}

/**
 * Segna coaching come iniziato per singolo utente
 */
export async function markCoachingStartedSingle(userId) {
    if (!confirm('Segnare questo utente come "Coaching Iniziato"?')) {
        return;
    }
    
    try {
        await firebaseMarkCoachingStarted(userId);
        
        // Update local data
        const user = firebaseData.allUsers.find(u => u.id === userId);
        if (user) {
            user.hasStartedCoaching = true;
            user.currentWeek = 1;
        }
        
        // Update current modal if open
        if (currentUser && currentUser.id === userId) {
            currentUser.hasStartedCoaching = true;
            currentUser.currentWeek = 1;
            
            // Refresh modal content
            showUserDetails(userId);
        }
        
        // Trigger dashboard refresh
        window.dispatchEvent(new CustomEvent('userDataChanged'));
        
        showNotification('Coaching segnato come iniziato', 'success');
        
    } catch (error) {
        console.error('Errore aggiornamento coaching:', error);
        showNotification('Errore aggiornamento stato coaching', 'error');
    }
}

/**
 * Aggiungi tag utente
 */
export async function addUserTag(userId) {
    const tag = prompt('Inserisci nuovo tag:');
    if (!tag || !tag.trim()) return;
    
    try {
        const success = await firebaseAddUserTag(userId, tag.trim());
        
        if (success) {
            showNotification(`Tag "${tag}" aggiunto`, 'success');
            
            // Refresh modal if open
            if (currentUser && currentUser.id === userId) {
                showUserDetails(userId);
            }
        } else {
            showNotification('Tag già presente', 'warning');
        }
        
    } catch (error) {
        console.error('Errore aggiunta tag:', error);
        showNotification('Errore aggiunta tag', 'error');
    }
}

/**
 * Apri WhatsApp
 */
export function openWhatsApp(phone) {
    if (!phone) {
        showNotification('Numero di telefono non disponibile', 'warning');
        return;
    }
    
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(
        'Ciao! Ti contatto per il percorso LifestyleFitnessCoach. Come posso aiutarti?'
    );
    
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    showNotification('WhatsApp aperto', 'success');
}

/**
 * Mostra dati quiz completi
 */
export function showQuizData(userId) {
    const user = firebaseData.allUsers.find(u => u.id === userId);
    if (!user || !user.quizData) {
        showNotification('Dati quiz non disponibili', 'warning');
        return;
    }
    
    // Create quiz data modal content
    const quizDataHTML = generateQuizDataModal(user);
    
    // Update modal content
    const modalBody = document.getElementById('modalBody');
    if (modalBody) {
        modalBody.innerHTML = quizDataHTML;
    }
    
    // Update modal title
    const modalTitle = document.getElementById('modalUserName');
    if (modalTitle) {
        modalTitle.textContent = `📋 Dati Quiz - ${user.name}`;
    }
}

/**
 * Genera contenuto modal dati quiz
 */
function generateQuizDataModal(user) {
    const quizData = user.quizData;
    
    return `
        <div class="quiz-data-container">
            <div class="quiz-section">
                <h4>📊 Analisi Automatica</h4>
                <div class="analysis-summary">
                    <div class="analysis-item">
                        <span class="analysis-label">Lead Score:</span>
                        <span class="analysis-value lead-score ${getLeadScoreClass(user.leadScore)}">
                            ${Math.round(user.leadScore || 0)}%
                        </span>
                    </div>
                    <div class="analysis-item">
                        <span class="analysis-label">Quadrante:</span>
                        <span class="analysis-value">${getProfileIcon(user.profileQuadrant)} ${user.profileQuadrant}</span>
                    </div>
                    <div class="analysis-item">
                        <span class="analysis-label">Livello Coscienza:</span>
                        <span class="analysis-value">${user.consciousnessLevel}</span>
                    </div>
                </div>
            </div>
            
            <div class="quiz-section">
                <h4>📝 Risposte Complete</h4>
                <div class="quiz-responses">
                    ${generateQuizResponses(quizData)}
                </div>
            </div>
            
            <div class="quiz-actions">
                <button class="action-btn primary" onclick="window.userManagement.showUserDetails('${user.id}')">
                    ← Torna ai Dettagli
                </button>
                <button class="action-btn secondary" onclick="window.userManagement.exportQuizData('${user.id}')">
                    📥 Esporta Quiz
                </button>
            </div>
        </div>
    `;
}

/**
 * Genera risposte quiz
 */
function generateQuizResponses(quizData) {
    const relevantFields = {
        'name': 'Nome',
        'email': 'Email',
        'phone': 'Telefono',
        'whatsapp': 'WhatsApp',
        'age': 'Età',
        'city': 'Città',
        'experience': 'Esperienza',
        'activity_level': 'Livello Attività',
        'goals': 'Obiettivi',
        'challenges': 'Sfide',
        'obstacles': 'Ostacoli',
        'readiness_level': 'Livello Motivazione',
        'commitment_level': 'Livello Impegno',
        'training_style': 'Stile Allenamento',
        'diet': 'Alimentazione',
        'sleep': 'Sonno',
        'stress': 'Gestione Stress',
        'budget': 'Budget',
        'time_availability': 'Disponibilità Tempo',
        'previous_experience': 'Esperienza Precedente',
        'health_conditions': 'Condizioni Salute',
        'motivation': 'Motivazione'
    };
    
    let html = '<div class="quiz-responses-grid">';
    
    Object.entries(relevantFields).forEach(([key, label]) => {
        if (quizData[key] !== undefined && quizData[key] !== null && quizData[key] !== '') {
            let value = quizData[key];
            
            if (Array.isArray(value)) {
                value = value.join(', ');
            } else if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            
            html += `
                <div class="quiz-response-item">
                    <strong class="response-label">${label}:</strong>
                    <span class="response-value">${value}</span>
                </div>
            `;
        }
    });
    
    html += '</div>';
    return html;
}

/**
 * Genera report utente
 */
export function generateUserReport(userId) {
    const user = firebaseData.allUsers.find(u => u.id === userId);
    if (!user) {
        showNotification('Utente non trovato', 'error');
        return;
    }
    
    // Generate comprehensive report
    const reportData = {
        user: user,
        sessions: firebaseData.allSessions.filter(s => s.userId === userId),
        conversations: firebaseData.allAIConversations.filter(c => c.userId === userId),
        generatedAt: new Date()
    };
    
    const reportHTML = generateReportHTML(reportData);
    
    // Open in new window for printing
    const reportWindow = window.open('', '_blank');
    reportWindow.document.write(reportHTML);
    reportWindow.document.close();
    
    showNotification('Report generato', 'success');
}

// ==========================================================================
// BULK ACTIONS
// ==========================================================================

/**
 * Handle bulk export
 */
async function handleBulkExport() {
    const dashboardState = getDashboardState();
    const selectedUsers = Array.from(dashboardState.selectedUsers).map(id => 
        firebaseData.allUsers.find(u => u.id === id)
    ).filter(Boolean);
    
    if (selectedUsers.length === 0) {
        showNotification('Nessun utente selezionato', 'warning');
        return;
    }
    
    try {
        const csvContent = window.firebaseAdmin.generateUsersCSV(selectedUsers);
        const filename = `utenti_selezionati_${new Date().toISOString().split('T')[0]}.csv`;
        
        downloadCSV(csvContent, filename);
        showNotification(`${selectedUsers.length} utenti esportati`, 'success');
        closeBulkModal();
        
    } catch (error) {
        console.error('Errore bulk export:', error);
        showNotification('Errore durante export', 'error');
    }
}

/**
 * Handle bulk mark coaching
 */
async function handleBulkMarkCoaching() {
    const dashboardState = getDashboardState();
    const selectedUserIds = Array.from(dashboardState.selectedUsers);
    const eligibleUsers = selectedUserIds.filter(id => {
        const user = firebaseData.allUsers.find(u => u.id === id);
        return user && !user.hasStartedCoaching;
    });
    
    if (eligibleUsers.length === 0) {
        showNotification('Nessun utente idoneo (coaching già iniziato)', 'warning');
        return;
    }
    
    if (!confirm(`Segnare ${eligibleUsers.length} utenti come "Coaching Iniziato"?`)) {
        return;
    }
    
    try {
        let successCount = 0;
        
        for (const userId of eligibleUsers) {
            try {
                await firebaseMarkCoachingStarted(userId);
                successCount++;
            } catch (error) {
                console.error('Errore per utente:', userId, error);
            }
        }
        
        showNotification(`${successCount}/${eligibleUsers.length} utenti aggiornati`, 'success');
        closeBulkModal();
        
        // Trigger dashboard refresh
        window.dispatchEvent(new CustomEvent('userDataChanged'));
        
    } catch (error) {
        console.error('Errore bulk coaching:', error);
        showNotification('Errore durante aggiornamento bulk', 'error');
    }
}

/**
 * Handle bulk WhatsApp
 */
function handleBulkWhatsApp() {
    const dashboardState = getDashboardState();
    const selectedUsers = Array.from(dashboardState.selectedUsers).map(id => 
        firebaseData.allUsers.find(u => u.id === id)
    ).filter(u => u && u.phone);
    
    if (selectedUsers.length === 0) {
        showNotification('Nessun utente con numero di telefono', 'warning');
        return;
    }
    
    // Generate WhatsApp contacts list
    const contacts = selectedUsers.map(user => 
        `${user.name}: ${user.phone}`
    ).join('\n');
    
    // Copy to clipboard
    navigator.clipboard.writeText(contacts).then(() => {
        showNotification(`${selectedUsers.length} contatti copiati negli appunti`, 'success');
        closeBulkModal();
    });
}

// ==========================================================================
// MODAL MANAGEMENT
// ==========================================================================

/**
 * Chiudi modal utente
 */
export function closeUserModal() {
    const userModal = document.getElementById('userModal');
    if (userModal) {
        userModal.classList.remove('active');
    }
    
    currentUser = null;
    modalHistory = modalHistory.filter(m => m !== 'user');
}

/**
 * Chiudi modal bulk
 */
function closeBulkModal() {
    const bulkModal = document.getElementById('bulkModal');
    if (bulkModal) {
        bulkModal.classList.remove('active');
    }
    
    modalHistory = modalHistory.filter(m => m !== 'bulk');
}

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

/**
 * Get lead score class
 */
function getLeadScoreClass(score) {
    if (!score) return 'low';
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
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
 * Get quadrant description
 */
function getQuadrantDescription(quadrant) {
    const descriptions = {
        'Q1': 'Atleta in Crescita - Competente e Motivato',
        'Q2': 'Esploratore Motivato - Forte ma Inesperto',
        'Q3': 'Esperto Demotivato - Competente ma Demotivato',
        'Q4': 'Guerriero Determinato - Principiante Totale'
    };
    return descriptions[quadrant] || 'Profilo non definito';
}

/**
 * Get consciousness description
 */
function getConsciousnessDescription(level) {
    const descriptions = {
        'Opportunista': 'Focus su risultati immediati e benefici tangibili',
        'Conformista': 'Struttura chiara, regole e sicurezza',
        'Achiever': 'Performance, successo e competizione',
        'Pluralista': 'Crescita personale, benessere olistico'
    };
    return descriptions[level] || 'Livello non definito';
}

/**
 * Download CSV
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
 * Generate report HTML
 */
function generateReportHTML(reportData) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Report Utente - ${reportData.user.name}</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 20px; 
                    color: #333;
                }
                .header { 
                    border-bottom: 2px solid #ea580c; 
                    padding-bottom: 10px; 
                    margin-bottom: 20px;
                }
                .section { 
                    margin: 20px 0; 
                    padding: 15px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                }
                .data-grid { 
                    display: grid; 
                    grid-template-columns: repeat(2, 1fr); 
                    gap: 10px; 
                    margin: 10px 0;
                }
                .data-item { 
                    padding: 8px; 
                    border: 1px solid #eee; 
                    border-radius: 4px;
                    background: #f9f9f9;
                }
                .highlight {
                    background: #fff3cd;
                    padding: 10px;
                    border-radius: 4px;
                    border-left: 4px solid #ea580c;
                }
                @media print { 
                    body { margin: 0; }
                    .section { break-inside: avoid; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📊 Report Utente Completo</h1>
                <h2>${reportData.user.name}</h2>
                <p><strong>Generato il:</strong> ${formatDateTime(reportData.generatedAt)}</p>
            </div>
            
            <div class="section">
                <h3>📋 Informazioni Generali</h3>
                <div class="data-grid">
                    <div class="data-item"><strong>Email:</strong> ${reportData.user.email}</div>
                    <div class="data-item"><strong>Telefono:</strong> ${reportData.user.phone || 'N/A'}</div>
                    <div class="data-item"><strong>Città:</strong> ${reportData.user.city || 'N/A'}</div>
                    <div class="data-item"><strong>Età:</strong> ${reportData.user.age || 'N/A'}</div>
                    <div class="data-item"><strong>Registrazione:</strong> ${formatDate(reportData.user.registrationDate)}</div>
                    <div class="data-item"><strong>Ultima Attività:</strong> ${formatDate(reportData.user.lastActivity)}</div>
                </div>
            </div>
            
            <div class="section">
                <h3>🎯 Profilo Coaching</h3>
                <div class="highlight">
                    <p><strong>Lead Score:</strong> ${Math.round(reportData.user.leadScore || 0)}%</p>
                    <p><strong>Quadrante:</strong> ${reportData.user.profileQuadrant} - ${getQuadrantDescription(reportData.user.profileQuadrant)}</p>
                    <p><strong>Livello Coscienza:</strong> ${reportData.user.consciousnessLevel}</p>
                </div>
                <div class="data-grid" style="margin-top: 15px;">
                    <div class="data-item"><strong>Esperienza:</strong> ${reportData.user.experience || 'N/A'}</div>
                    <div class="data-item"><strong>Livello Attività:</strong> ${reportData.user.activityLevel || 'N/A'}</div>
                    <div class="data-item"><strong>Motivazione:</strong> ${reportData.user.readinessLevel || 'N/A'}/5</div>
                    <div class="data-item"><strong>Impegno:</strong> ${reportData.user.commitmentLevel || 'N/A'}/5</div>
                </div>
            </div>
            
            <div class="section">
                <h3>📊 Progresso Coaching</h3>
                <div class="data-grid">
                    <div class="data-item"><strong>Coaching Iniziato:</strong> ${reportData.user.hasStartedCoaching ? 'Sì' : 'No'}</div>
                    <div class="data-item"><strong>Settimana Corrente:</strong> ${reportData.user.currentWeek || 1}/7</div>
                    <div class="data-item"><strong>Settimane Completate:</strong> ${reportData.user.completedWeeks ? reportData.user.completedWeeks.length : 0}</div>
                    <div class="data-item"><strong>Sessioni Totali:</strong> ${reportData.user.totalSessions || 0}</div>
                </div>
            </div>
            
            ${reportData.user.goals && reportData.user.goals.length > 0 ? `
                <div class="section">
                    <h3>🎯 Obiettivi Dichiarati</h3>
                    <ul>
                        ${reportData.user.goals.map(goal => `<li>${goal}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${reportData.user.challenges && reportData.user.challenges.length > 0 ? `
                <div class="section">
                    <h3>⚠️ Sfide e Ostacoli</h3>
                    <ul>
                        ${reportData.user.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${reportData.sessions.length > 0 ? `
                <div class="section">
                    <h3>📋 Cronologia Sessioni</h3>
                    <p><strong>Totale sessioni registrate:</strong> ${reportData.sessions.length}</p>
                    ${reportData.sessions.slice(0, 5).map(session => `
                        <div class="data-item" style="margin: 5px 0;">
                            <strong>Settimana ${session.weekNumber}</strong> - ${formatDateTime(session.timestamp)}
                            ${session.duration ? ` (${session.duration} min)` : ''}
                        </div>
                    `).join('')}
                    ${reportData.sessions.length > 5 ? `<p><em>... e altre ${reportData.sessions.length - 5} sessioni</em></p>` : ''}
                </div>
            ` : ''}
            
            ${reportData.user.notes ? `
                <div class="section">
                    <h3>📝 Note Coaching</h3>
                    <p>${reportData.user.notes}</p>
                </div>
            ` : ''}
            
            <div class="section">
                <h3>📈 Raccomandazioni</h3>
                <div class="highlight">
                    ${generateRecommendations(reportData.user)}
                </div>
            </div>
        </body>
        </html>
    `;
}

/**
 * Generate recommendations based on user profile
 */
function generateRecommendations(user) {
    let recommendations = [];
    
    const leadScore = user.leadScore || 0;
    const quadrant = user.profileQuadrant;
    const hasStarted = user.hasStartedCoaching;
    
    if (leadScore >= 70) {
        recommendations.push('✅ <strong>Utente qualificato</strong> - Priorità alta per follow-up personalizzato');
    } else if (leadScore >= 40) {
        recommendations.push('⚠️ <strong>Potenziale medio</strong> - Necessita nurturing per aumentare engagement');
    } else {
        recommendations.push('🔄 <strong>Lead da sviluppare</strong> - Focus su educazione e costruzione fiducia');
    }
    
    if (!hasStarted) {
        recommendations.push('🚀 <strong>Coaching non iniziato</strong> - Programmare call di benvenuto');
    }
    
    switch (quadrant) {
        case 'Q1':
            recommendations.push('🏆 <strong>Atleta in Crescita</strong> - Approccio collaborativo, sfide progressive');
            break;
        case 'Q2':
            recommendations.push('💪 <strong>Esploratore Motivato</strong> - Fornire struttura e guidance tecnica');
            break;
        case 'Q3':
            recommendations.push('🎯 <strong>Esperto Demotivato</strong> - Focus su motivazione e obiettivi personali');
            break;
        case 'Q4':
            recommendations.push('🌱 <strong>Guerriero Determinato</strong> - Supporto completo e incoraggiamento costante');
            break;
    }
    
    const daysSinceActivity = daysBetween(user.lastActivity, new Date());
    if (daysSinceActivity > 7) {
        recommendations.push('📞 <strong>Follow-up necessario</strong> - Utente inattivo da più di 7 giorni');
    }
    
    return recommendations.map(rec => `<p>${rec}</p>`).join('');
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
    
    /* Modal Styles */
    .user-detail-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-bottom: 1rem;
    }
    
    .detail-section {
        background: rgba(15, 23, 42, 0.5);
        padding: 1.5rem;
        border-radius: 12px;
        border: 1px solid #334155;
    }
    
    .detail-section.full-width {
        grid-column: 1 / -1;
    }
    
    .detail-title {
        color: #ea580c;
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 1rem;
        border-bottom: 1px solid #334155;
        padding-bottom: 0.5rem;
    }
    
    .detail-rows {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .detail-row:last-child {
        border-bottom: none;
    }
    
    .detail-row .label {
        color: #94a3b8;
        font-weight: 500;
        min-width: 140px;
    }
    
    .detail-row .value {
        color: #f8fafc;
        text-align: right;
        flex: 1;
    }
    
    .progress-overview {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .progress-summary {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
    }
    
    .progress-item {
        text-align: center;
        padding: 0.75rem;
        background: rgba(15, 23, 42, 0.7);
        border-radius: 8px;
        border: 1px solid #334155;
    }
    
    .progress-label {
        display: block;
        color: #94a3b8;
        font-size: 0.8rem;
        margin-bottom: 0.25rem;
    }
    
    .progress-value {
        display: block;
        color: #ea580c;
        font-size: 1.2rem;
        font-weight: bold;
    }
    
    .week-progress-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 0.5rem;
    }
    
    .week-progress-item {
        text-align: center;
        padding: 0.75rem 0.5rem;
        border-radius: 8px;
        border: 1px solid #334155;
        background: rgba(15, 23, 42, 0.7);
    }
    
    .week-progress-item.completed {
        background: rgba(34, 197, 94, 0.2);
        border-color: #22c55e;
    }
    
    .week-progress-item.current {
        background: rgba(251, 191, 36, 0.2);
        border-color: #fbbf24;
    }
    
    .week-progress-item.accessible {
        background: rgba(59, 130, 246, 0.2);
        border-color: #3b82f6;
    }
    
    .week-number {
        font-weight: bold;
        color: #f8fafc;
    }
    
    .week-status {
        font-size: 1rem;
        margin: 0.25rem 0;
    }
    
    .week-label {
        font-size: 0.7rem;
        color: #94a3b8;
    }
    
    .goals-container, .challenges-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }
    
    .goal-tag {
        background: rgba(34, 197, 94, 0.2);
        color: #86efac;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        border: 1px solid rgba(34, 197, 94, 0.3);
    }
    
    .challenge-tag {
        background: rgba(239, 68, 68, 0.2);
        color: #fca5a5;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        border: 1px solid rgba(239, 68, 68, 0.3);
    }
    
    .no-data {
        color: #94a3b8;
        font-style: italic;
        font-size: 0.9rem;
    }
    
    .notes-textarea {
        width: 100%;
        min-height: 100px;
        background: rgba(15, 23, 42, 0.7);
        border: 1px solid #475569;
        color: #f8fafc;
        padding: 1rem;
        border-radius: 8px;
        resize: vertical;
        font-family: inherit;
        font-size: 0.9rem;
    }
    
    .notes-textarea:focus {
        outline: none;
        border-color: #ea580c;
        box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
    }
    
    .notes-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .quick-actions {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }
    
    .action-btn.large {
        padding: 1rem 1.5rem;
        font-size: 0.9rem;
    }
    
    .quiz-data-container {
        max-width: 100%;
    }
    
    .quiz-section {
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: rgba(15, 23, 42, 0.5);
        border-radius: 12px;
        border: 1px solid #334155;
    }
    
    .analysis-summary {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .analysis-item {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem;
        background: rgba(15, 23, 42, 0.7);
        border-radius: 8px;
        border: 1px solid #334155;
    }
    
    .analysis-label {
        color: #94a3b8;
        font-weight: 500;
    }
    
    .analysis-value {
        color: #f8fafc;
        font-weight: 600;
    }
    
    .quiz-responses-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
    }
    
    .quiz-response-item {
        padding: 0.75rem;
        background: rgba(15, 23, 42, 0.7);
        border-radius: 8px;
        border: 1px solid #334155;
    }
    
    .response-label {
        color: #ea580c;
        display: block;
        margin-bottom: 0.25rem;
        font-size: 0.9rem;
    }
    
    .response-value {
        color: #f8fafc;
        font-size: 0.9rem;
    }
    
    .quiz-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid #334155;
    }
    
    @media (max-width: 768px) {
        .user-detail-grid {
            grid-template-columns: 1fr;
        }
        
        .progress-summary {
            grid-template-columns: 1fr;
        }
        
        .week-progress-grid {
            grid-template-columns: repeat(4, 1fr);
        }
        
        .quick-actions {
            grid-template-columns: 1fr;
        }
        
        .analysis-summary,
        .quiz-responses-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);

// ==========================================================================
// EXPORTS
// ==========================================================================

// Export for window access
window.userManagement = {
    initializeUserManagement,
    showUserDetails,
    saveUserNotes,
    markCoachingStartedSingle,
    addUserTag,
    openWhatsApp,
    showQuizData,
    generateUserReport,
    closeUserModal,
    currentUser: () => currentUser
};

console.log('👥 User Management module caricato');