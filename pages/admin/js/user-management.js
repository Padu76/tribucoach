// ==========================================================================
// USER MANAGEMENT - LIFESTYLEFITNESSCODE ADMIN
// ==========================================================================

import { 
    firebaseData, 
    updateUserNotes, 
    markCoachingStarted, 
    addUserTag,
    formatDate,
    formatDateTime,
    daysBetween
} from './firebase-admin.js';

import { dashboardState } from './dashboard-core.js';

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
        await markCoachingStarted(userId);
        
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
        const success = await addUserTag(userId, tag.trim());
        
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
                await markCoachingStarted(userId);
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
    // Reuse the notification system from dashboard-core
    const event = new CustomEvent('showNotification', {
        detail: { message, type }
    });
    window.dispatchEvent(event);
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
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { border-bottom: 2px solid #ea580c; padding-bottom: 10px; }
                .section { margin: 20px 0; }
                .data-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
                .data-item { padding: 8px; border: 1px solid #ddd; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Report Utente Completo</h1>
                <h2>${reportData.user.name}</h2>
                <p>Generato il: ${formatDateTime(reportData.generatedAt)}</p>
            </div>
            
            <div class="section">
                <h3>Informazioni Generali</h3>
                <div class="data-grid">
                    <div class="data-item"><strong>Email:</strong> ${reportData.user.email}</div>
                    <div class="data-item"><strong>Telefono:</strong> ${reportData.user.phone || 'N/A'}</div>
                    <div class="data-item"><strong>Lead Score:</strong> ${Math.round(reportData.user.leadScore || 0)}%</div>
                    <div class="data-item"><strong>Quadrante:</strong> ${reportData.user.profileQuadrant}</div>
                </div>
            </div>
            
            <div class="section">
                <h3>Progresso Coaching</h3>
                <p><strong>Coaching Iniziato:</strong> ${reportData.user.hasStartedCoaching ? 'Sì' : 'No'}</p>
                <p><strong>Settimana Corrente:</strong> ${reportData.user.currentWeek || 1}/7</p>
                <p><strong>Sessioni Completate:</strong> ${reportData.sessions.length}</p>
            </div>
            
            ${reportData.user.notes ? `
                <div class="section">
                    <h3>Note Coaching</h3>
                    <p>${reportData.user.notes}</p>
                </div>
            ` : ''}
        </body>
        </html>
    `;
}

// ==========================================================================
// EXPORTS
// ==========================================================================
export {
    closeUserModal,
    currentUser
};

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