// ==========================================================================
// SESSION DETAILS MODAL - EXTENSION PER USER-MANAGEMENT.JS
// ==========================================================================

/**
 * Mostra dettagli completi della sessione in modal popup
 */
window.showSessionDetails = function(sessionId) {
    console.log('🔍 Apertura dettagli sessione:', sessionId);
    
    // Find session data
    const session = window.firebaseAdmin.firebaseData.allSessions.find(s => s.id === sessionId);
    if (!session) {
        console.error('❌ Sessione non trovata:', sessionId);
        showNotification('Sessione non trovata', 'error');
        return;
    }
    
    // Find user data
    const user = window.firebaseAdmin.firebaseData.allUsers.find(u => 
        u.id === session.userId || u.email === session.userId || u.name === session.userId
    );
    
    // Create modal
    createSessionDetailsModal(session, user);
};

/**
 * Crea e mostra il modal con dettagli sessione
 */
function createSessionDetailsModal(session, user) {
    // Remove existing modal if present
    const existingModal = document.getElementById('sessionDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Format data
    const userName = user ? user.name : session.userId || 'Utente Sconosciuto';
    const userEmail = user ? user.email : session.customerEmail || 'N/A';
    const timestamp = formatDateTime(session.timestamp);
    const duration = formatDuration(session.duration || 0);
    
    // Get session type info
    const sessionTypeInfo = getSessionTypeInfo(session);
    
    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay active" id="sessionDetailsModal">
            <div class="modal-content session-modal">
                <div class="modal-header">
                    <h2>📋 Dettagli Sessione</h2>
                    <button class="close-modal" onclick="closeSessionDetails()">×</button>
                </div>
                
                <div class="modal-body">
                    <!-- Session Overview -->
                    <div class="session-overview">
                        <div class="session-header-info">
                            <div class="session-user-info">
                                <div class="user-avatar-mini" style="${getUserAvatarStyle(user)}">
                                    ${getUserAvatarContent(user)}
                                </div>
                                <div class="user-details-mini">
                                    <div class="user-name-mini">${userName}</div>
                                    <div class="user-email-mini">${userEmail}</div>
                                </div>
                            </div>
                            <div class="session-time-info">
                                <div class="session-date">${timestamp}</div>
                                <div class="session-duration">${duration}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Session Details Grid -->
                    <div class="session-details-grid">
                        <!-- Basic Info -->
                        <div class="detail-card">
                            <h4>📊 Informazioni Base</h4>
                            <div class="detail-items">
                                <div class="detail-item">
                                    <span class="detail-label">Tipo:</span>
                                    <span class="detail-value">
                                        ${sessionTypeInfo.icon} ${sessionTypeInfo.name}
                                    </span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Source:</span>
                                    <span class="detail-value">${session.source || 'N/A'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">ID Sessione:</span>
                                    <span class="detail-value session-id">${session.id}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Completata:</span>
                                    <span class="detail-value ${session.completed ? 'completed' : 'incomplete'}">
                                        ${session.completed ? '✅ Sì' : '⏳ No'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Activity Metrics -->
                        <div class="detail-card">
                            <h4>🎯 Metriche Attività</h4>
                            <div class="detail-items">
                                <div class="detail-item">
                                    <span class="detail-label">Durata:</span>
                                    <span class="detail-value">${duration}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Settimana:</span>
                                    <span class="detail-value">${session.weekNumber || 'N/A'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Domande:</span>
                                    <span class="detail-value">${session.questionsAnswered || 0}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">AI Responses:</span>
                                    <span class="detail-value">${session.aiResponsesGenerated || 0}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Chat Specific (if applicable) -->
                        ${session.source === 'chatbase_conversations' ? `
                        <div class="detail-card">
                            <h4>💬 Dettagli Chat</h4>
                            <div class="detail-items">
                                <div class="detail-item">
                                    <span class="detail-label">Conversation ID:</span>
                                    <span class="detail-value session-id">${session.conversationId || 'N/A'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Messaggi:</span>
                                    <span class="detail-value">${session.messageCount || 0}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Status:</span>
                                    <span class="detail-value">${session.status || 'N/A'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Sistema ML:</span>
                                    <span class="detail-value">${session.hasMLSystem ? '✅ Attivo' : '❌ Inattivo'}</span>
                                </div>
                            </div>
                        </div>` : ''}

                        <!-- Analytics Specific (if applicable) -->
                        ${session.source === 'analytics_events' ? `
                        <div class="detail-card">
                            <h4>📈 Dettagli Analytics</h4>
                            <div class="detail-items">
                                <div class="detail-item">
                                    <span class="detail-label">Evento:</span>
                                    <span class="detail-value">${session.eventType || 'N/A'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Pagina:</span>
                                    <span class="detail-value">${session.eventData?.page || 'N/A'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Secondi:</span>
                                    <span class="detail-value">${session.eventData?.seconds || 0}s</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">URL:</span>
                                    <span class="detail-value session-url">${session.pageUrl || 'N/A'}</span>
                                </div>
                            </div>
                        </div>` : ''}

                        <!-- Technical Info -->
                        <div class="detail-card">
                            <h4>🔧 Info Tecniche</h4>
                            <div class="detail-items">
                                <div class="detail-item">
                                    <span class="detail-label">User Agent:</span>
                                    <span class="detail-value technical-info">${getUserAgentSummary(session.userAgent)}</span>
                                </div>
                                ${session.deviceInfo ? `
                                <div class="detail-item">
                                    <span class="detail-label">Device:</span>
                                    <span class="detail-value">${session.deviceInfo.screen || 'N/A'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Lingua:</span>
                                    <span class="detail-value">${session.deviceInfo.language || 'N/A'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Timezone:</span>
                                    <span class="detail-value">${session.deviceInfo.timezone || 'N/A'}</span>
                                </div>` : ''}
                            </div>
                        </div>

                        <!-- User Profile (if available) -->
                        ${user ? `
                        <div class="detail-card">
                            <h4>👤 Profilo Utente</h4>
                            <div class="detail-items">
                                <div class="detail-item">
                                    <span class="detail-label">Profilo:</span>
                                    <span class="detail-value">${user.profileType || 'N/A'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Quadrante:</span>
                                    <span class="detail-value">${getProfileIcon(user.profileQuadrant)} ${user.profileQuadrant || 'N/A'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Lead Score:</span>
                                    <span class="detail-value">${Math.round(user.leadScore || 0)}%</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Quiz Score:</span>
                                    <span class="detail-value">${user.quizScore || 0}%</span>
                                </div>
                            </div>
                        </div>` : ''}

                        <!-- Notes -->
                        <div class="detail-card notes-card">
                            <h4>📝 Note</h4>
                            <div class="session-notes">
                                ${session.notes || 'Nessuna nota disponibile'}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-actions">
                    <button class="modal-btn btn-primary" onclick="exportSessionData('${session.id}')">
                        📊 Esporta Dati
                    </button>
                    ${user ? `
                    <button class="modal-btn btn-secondary" onclick="viewUserProfile('${user.id}')">
                        👤 Vedi Profilo Utente
                    </button>` : ''}
                    <button class="modal-btn btn-cancel" onclick="closeSessionDetails()">
                        ✖️ Chiudi
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add styles
    addSessionModalStyles();
    
    console.log('✅ Modal dettagli sessione creato');
}

/**
 * Chiudi modal dettagli sessione
 */
window.closeSessionDetails = function() {
    const modal = document.getElementById('sessionDetailsModal');
    if (modal) {
        modal.remove();
    }
};

/**
 * Esporta dati sessione
 */
window.exportSessionData = function(sessionId) {
    const session = window.firebaseAdmin.firebaseData.allSessions.find(s => s.id === sessionId);
    if (!session) return;
    
    const user = window.firebaseAdmin.firebaseData.allUsers.find(u => 
        u.id === session.userId || u.email === session.userId
    );
    
    const exportData = {
        session: session,
        user: user,
        exportTime: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `session_${sessionId}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    showNotification('Dati sessione esportati', 'success');
};

/**
 * Vedi profilo utente
 */
window.viewUserProfile = function(userId) {
    closeSessionDetails();
    // Assume this function exists in user-management.js
    if (window.userManagement && window.userManagement.showUserDetails) {
        window.userManagement.showUserDetails(userId);
    } else {
        showNotification('Apertura profilo utente...', 'info');
    }
};

// ==========================================================================
// HELPER FUNCTIONS
// ==========================================================================

/**
 * Get session type info
 */
function getSessionTypeInfo(session) {
    const typeMap = {
        'chat': { icon: '💬', name: 'Chat Conversazione' },
        'analytics': { icon: '📈', name: 'Analytics Event' },
        'dashboard': { icon: '📊', name: 'Dashboard Session' },
        'coaching': { icon: '🎯', name: 'Coaching Session' }
    };
    
    return typeMap[session.sessionType] || { icon: '📋', name: session.sessionType || 'Sessione' };
}

/**
 * Get user avatar style
 */
function getUserAvatarStyle(user) {
    if (!user || !user.avatar) {
        return 'background: linear-gradient(135deg, #6b7280, #4b5563); color: white;';
    }
    
    return `background: linear-gradient(135deg, ${user.avatar.backgroundColor || '#6b7280'}, ${user.avatar.accentColor || '#4b5563'}); color: white;`;
}

/**
 * Get user avatar content
 */
function getUserAvatarContent(user) {
    if (!user) return '👤';
    
    if (user.avatar && user.avatar.emoji) {
        return user.avatar.emoji;
    }
    
    const initials = user.name ? user.name.substring(0, 2).toUpperCase() : '??';
    return initials;
}

/**
 * Get profile icon
 */
function getProfileIcon(quadrant) {
    const icons = {
        'Q1': '🏆',
        'Q2': '💪', 
        'Q3': '🎯',
        'Q4': '🌱'
    };
    return icons[quadrant] || '👤';
}

/**
 * Get user agent summary
 */
function getUserAgentSummary(userAgent) {
    if (!userAgent) return 'N/A';
    
    // Extract browser and OS info
    let browser = 'Unknown';
    let os = 'Unknown';
    
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'Mac';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';
    
    return `${browser} su ${os}`;
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
 * Format date time
 */
function formatDateTime(date) {
    if (!date) return 'N/A';
    
    return new Date(date).toLocaleString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
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
        z-index: 10001; 
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
 * Add session modal styles
 */
function addSessionModalStyles() {
    if (document.getElementById('sessionModalStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'sessionModalStyles';
    style.textContent = `
        .session-modal {
            max-width: 900px;
            width: 95%;
            max-height: 90vh;
        }
        
        .session-overview {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            border: 1px solid #475569;
        }
        
        .session-header-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .session-user-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .user-avatar-mini {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            font-weight: bold;
            border: 2px solid rgba(255,255,255,0.2);
        }
        
        .user-name-mini {
            font-size: 1.1rem;
            font-weight: 600;
            color: white;
        }
        
        .user-email-mini {
            font-size: 0.9rem;
            color: rgba(255,255,255,0.7);
        }
        
        .session-time-info {
            text-align: right;
        }
        
        .session-date {
            font-size: 1rem;
            color: white;
            font-weight: 500;
        }
        
        .session-duration {
            font-size: 0.9rem;
            color: #ea580c;
            font-weight: 600;
        }
        
        .session-details-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
        }
        
        .detail-card {
            background: #0f172a;
            border: 1px solid #334155;
            border-radius: 8px;
            padding: 1rem;
        }
        
        .detail-card h4 {
            color: #ea580c;
            font-size: 1rem;
            margin-bottom: 1rem;
            font-weight: 600;
        }
        
        .detail-items {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }
        
        .detail-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .detail-item:last-child {
            border-bottom: none;
        }
        
        .detail-label {
            color: #94a3b8;
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .detail-value {
            color: white;
            font-size: 0.9rem;
            font-weight: 600;
            text-align: right;
            max-width: 60%;
            word-break: break-word;
        }
        
        .detail-value.completed {
            color: #22c55e;
        }
        
        .detail-value.incomplete {
            color: #f59e0b;
        }
        
        .session-id, .session-url {
            font-family: monospace;
            font-size: 0.8rem;
            background: rgba(255,255,255,0.1);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .technical-info {
            font-size: 0.8rem;
            max-width: 150px;
        }
        
        .notes-card {
            grid-column: 1 / -1;
        }
        
        .session-notes {
            background: rgba(255,255,255,0.05);
            border-radius: 6px;
            padding: 1rem;
            color: #e2e8f0;
            font-size: 0.9rem;
            line-height: 1.5;
            min-height: 60px;
        }
        
        .modal-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            margin-top: 1.5rem;
            flex-wrap: wrap;
        }
        
        .modal-btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 6px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #ea580c, #f97316);
            color: white;
        }
        
        .btn-secondary {
            background: linear-gradient(135deg, #2563eb, #3b82f6);
            color: white;
        }
        
        .btn-cancel {
            background: #374151;
            color: #d1d5db;
        }
        
        .modal-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @media (max-width: 768px) {
            .session-modal {
                width: 98%;
                margin: 1rem;
            }
            
            .session-header-info {
                flex-direction: column;
                text-align: center;
            }
            
            .session-details-grid {
                grid-template-columns: 1fr;
            }
            
            .modal-actions {
                flex-direction: column;
            }
            
            .detail-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.25rem;
            }
            
            .detail-value {
                max-width: 100%;
                text-align: left;
            }
        }
    `;
    
    document.head.appendChild(style);
}

console.log('📋 Session Details Modal caricato');