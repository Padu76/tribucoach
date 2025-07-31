// avatar-system.js - Sistema Avatar Completo per LifestyleFitnessCoach
// Logica avanzata, helper functions e integrazione UI

// === 🎨 CONFIGURAZIONE AVATAR SYSTEM ===
const AVATAR_CONFIG = {
    version: '1.0',
    defaultAvatarId: 'avatar_1',
    maxCustomAvatars: 50,
    avatarImageSize: 100,
    animationDuration: 300,
    autoSaveDelay: 1000
};

// Avatar predefiniti con personalità e caratteristiche
const EXTENDED_AVATAR_DATA = {
    'avatar_1': {
        id: 'avatar_1',
        name: 'Determinato',
        emoji: '💪',
        personality: 'Forte e deciso',
        traits: ['Resiliente', 'Motivato', 'Focusato'],
        colors: { primary: '#3b82f6', secondary: '#1e40af' },
        description: 'Per chi affronta le sfide a testa alta',
        coachingStyle: 'Diretto e pratico'
    },
    'avatar_2': {
        id: 'avatar_2',
        name: 'Motivato',
        emoji: '🚀',
        personality: 'Energico e proattivo',
        traits: ['Entusiasta', 'Innovativo', 'Veloce'],
        colors: { primary: '#10b981', secondary: '#059669' },
        description: 'Per chi vuole raggiungere le stelle',
        coachingStyle: 'Dinamico e ispirante'
    },
    'avatar_3': {
        id: 'avatar_3',
        name: 'Energico',
        emoji: '⚡',
        personality: 'Vivace e elettrizzante',
        traits: ['Veloce', 'Reattivo', 'Intenso'],
        colors: { primary: '#f59e0b', secondary: '#d97706' },
        description: 'Per chi ha energia da vendere',
        coachingStyle: 'Rapido e coinvolgente'
    },
    'avatar_4': {
        id: 'avatar_4',
        name: 'Positivo',
        emoji: '🌟',
        personality: 'Ottimista e luminoso',
        traits: ['Solare', 'Ispirante', 'Carismatico'],
        colors: { primary: '#8b5cf6', secondary: '#7c3aed' },
        description: 'Per chi illumina la strada degli altri',
        coachingStyle: 'Incoraggiante e positivo'
    },
    'avatar_5': {
        id: 'avatar_5',
        name: 'Guerriero',
        emoji: '🏆',
        personality: 'Competitivo e vincente',
        traits: ['Ambizioso', 'Strategico', 'Tenace'],
        colors: { primary: '#ef4444', secondary: '#dc2626' },
        description: 'Per chi punta sempre alla vittoria',
        coachingStyle: 'Sfidante e orientato ai risultati'
    },
    'avatar_6': {
        id: 'avatar_6',
        name: 'Zen',
        emoji: '🧘',
        personality: 'Calmo e equilibrato',
        traits: ['Paziente', 'Riflessivo', 'Equilibrato'],
        colors: { primary: '#06b6d4', secondary: '#0891b2' },
        description: 'Per chi cerca pace interiore',
        coachingStyle: 'Meditativo e graduale'
    },
    'avatar_7': {
        id: 'avatar_7',
        name: 'Esploratore',
        emoji: '🗺️',
        personality: 'Curioso e avventuroso',
        traits: ['Curioso', 'Adattabile', 'Coraggioso'],
        colors: { primary: '#84cc16', secondary: '#65a30d' },
        description: 'Per chi ama scoprire nuovi territori',
        coachingStyle: 'Esplorativo e flessibile'
    },
    'avatar_8': {
        id: 'avatar_8',
        name: 'Creativo',
        emoji: '🎨',
        personality: 'Artistico e immaginativo',
        traits: ['Innovativo', 'Espressivo', 'Originale'],
        colors: { primary: '#ec4899', secondary: '#db2777' },
        description: 'Per chi dipinge la propria vita',
        coachingStyle: 'Creativo e personalizzato'
    },
    'avatar_9': {
        id: 'avatar_9',
        name: 'Leader',
        emoji: '👑',
        personality: 'Autoritario e carismatico',
        traits: ['Influente', 'Visionario', 'Decisivo'],
        colors: { primary: '#f97316', secondary: '#ea580c' },
        description: 'Per chi guida il cambiamento',
        coachingStyle: 'Autorevole e visionario'
    },
    'avatar_10': {
        id: 'avatar_10',
        name: 'Equilibrato',
        emoji: '⚖️',
        personality: 'Bilanciato e armonioso',
        traits: ['Stabile', 'Razionale', 'Moderato'],
        colors: { primary: '#6366f1', secondary: '#4f46e5' },
        description: 'Per chi cerca l\'armonia perfetta',
        coachingStyle: 'Bilanciato e olistico'
    }
};

// === 🎭 AVATAR MANAGER CLASS ===
class AvatarManager {
    constructor() {
        this.currentUserId = null;
        this.currentAvatar = null;
        this.availableAvatars = Object.values(EXTENDED_AVATAR_DATA);
        this.isInitialized = false;
        this.saveTimeout = null;
        
        console.log('🎨 AvatarManager inizializzato');
    }

    // Inizializzazione del sistema
    async initialize(userId = null) {
        try {
            this.currentUserId = userId || this.generateGuestId();
            
            // Carica avatar utente esistente
            await this.loadUserAvatar();
            
            // Setup event listeners
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('✅ AvatarManager inizializzato per utente:', this.currentUserId);
            
            return true;
        } catch (error) {
            console.error('❌ Errore inizializzazione AvatarManager:', error);
            return false;
        }
    }

    // Genera ID guest temporaneo
    generateGuestId() {
        return 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Carica avatar utente
    async loadUserAvatar() {
        try {
            // Simula caricamento da Firebase (sostituire con vera chiamata)
            const savedAvatar = this.loadFromLocalStorage();
            
            if (savedAvatar && EXTENDED_AVATAR_DATA[savedAvatar.avatarId]) {
                this.currentAvatar = {
                    ...EXTENDED_AVATAR_DATA[savedAvatar.avatarId],
                    customizations: savedAvatar.customizations || {},
                    lastUpdated: savedAvatar.lastUpdated || new Date()
                };
            } else {
                // Avatar di default
                this.currentAvatar = EXTENDED_AVATAR_DATA[AVATAR_CONFIG.defaultAvatarId];
            }
            
            console.log('✅ Avatar caricato:', this.currentAvatar.name);
            return this.currentAvatar;
            
        } catch (error) {
            console.error('❌ Errore caricamento avatar:', error);
            this.currentAvatar = EXTENDED_AVATAR_DATA[AVATAR_CONFIG.defaultAvatarId];
            return this.currentAvatar;
        }
    }

    // Salva avatar utente
    async saveUserAvatar(avatarId, customizations = {}) {
        try {
            const avatarData = {
                userId: this.currentUserId,
                avatarId: avatarId,
                customizations: customizations,
                lastUpdated: new Date().toISOString()
            };

            // Salva in localStorage (temporaneo)
            this.saveToLocalStorage(avatarData);
            
            // Aggiorna avatar corrente
            if (EXTENDED_AVATAR_DATA[avatarId]) {
                this.currentAvatar = {
                    ...EXTENDED_AVATAR_DATA[avatarId],
                    customizations: customizations,
                    lastUpdated: new Date()
                };
            }

            console.log('✅ Avatar salvato:', avatarId);
            
            // Emetti evento
            this.emitAvatarChanged();
            
            return true;
            
        } catch (error) {
            console.error('❌ Errore salvataggio avatar:', error);
            return false;
        }
    }

    // Ottieni avatar corrente
    getCurrentAvatar() {
        return this.currentAvatar || EXTENDED_AVATAR_DATA[AVATAR_CONFIG.defaultAvatarId];
    }

    // Ottieni tutti gli avatar disponibili
    getAvailableAvatars() {
        return this.availableAvatars.map(avatar => ({
            ...avatar,
            preview: this.generateAvatarPreview(avatar),
            isSelected: this.currentAvatar?.id === avatar.id
        }));
    }

    // Genera preview avatar
    generateAvatarPreview(avatar) {
        return {
            emoji: avatar.emoji,
            name: avatar.name,
            primaryColor: avatar.colors.primary,
            secondaryColor: avatar.colors.secondary,
            style: `background: linear-gradient(135deg, ${avatar.colors.primary} 0%, ${avatar.colors.secondary} 100%)`,
            description: avatar.description
        };
    }

    // Ottieni avatar per ID
    getAvatarById(avatarId) {
        return EXTENDED_AVATAR_DATA[avatarId] || null;
    }

    // Ottieni avatar consigliati basati su personalità
    getRecommendedAvatars(userTraits = []) {
        const recommendations = [];
        
        this.availableAvatars.forEach(avatar => {
            let score = 0;
            
            // Calcola compatibilità
            userTraits.forEach(trait => {
                if (avatar.traits.includes(trait)) {
                    score += 10;
                }
            });
            
            if (score > 0) {
                recommendations.push({
                    ...avatar,
                    compatibilityScore: score,
                    reason: `Compatibile con: ${avatar.traits.filter(t => userTraits.includes(t)).join(', ')}`
                });
            }
        });
        
        return recommendations.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    }

    // Genera statistiche avatar
    async getAvatarStatistics() {
        try {
            const stats = {
                totalUsers: 0,
                avatarDistribution: {},
                mostPopular: null,
                recentChanges: 0,
                personalityDistribution: {}
            };

            // Simula dati (sostituire con chiamata Firebase reale)
            const mockData = this.generateMockStatistics();
            
            return { ...stats, ...mockData };
            
        } catch (error) {
            console.error('❌ Errore statistiche avatar:', error);
            return null;
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Auto-save su cambiamenti
        document.addEventListener('avatarChanged', (event) => {
            console.log('🔄 Avatar cambiato:', event.detail);
        });

        // Cleanup su unload
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    // Emetti evento cambio avatar
    emitAvatarChanged() {
        const event = new CustomEvent('avatarChanged', {
            detail: {
                userId: this.currentUserId,
                avatar: this.currentAvatar,
                timestamp: new Date()
            }
        });
        document.dispatchEvent(event);
    }

    // Local Storage helpers (backup)
    saveToLocalStorage(avatarData) {
        try {
            localStorage.setItem(`avatar_${this.currentUserId}`, JSON.stringify(avatarData));
        } catch (error) {
            console.warn('⚠️ Impossibile salvare avatar in localStorage:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem(`avatar_${this.currentUserId}`);
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.warn('⚠️ Impossibile caricare avatar da localStorage:', error);
            return null;
        }
    }

    // Genera dati mock per demo
    generateMockStatistics() {
        const avatarIds = Object.keys(EXTENDED_AVATAR_DATA);
        const distribution = {};
        const personalityDist = {};

        avatarIds.forEach(id => {
            distribution[id] = Math.floor(Math.random() * 100) + 10;
            const avatar = EXTENDED_AVATAR_DATA[id];
            personalityDist[avatar.personality] = (personalityDist[avatar.personality] || 0) + distribution[id];
        });

        const mostPopular = Object.entries(distribution)
            .sort(([,a], [,b]) => b - a)[0][0];

        return {
            totalUsers: Object.values(distribution).reduce((a, b) => a + b, 0),
            avatarDistribution: distribution,
            mostPopular: mostPopular,
            recentChanges: Math.floor(Math.random() * 20) + 5,
            personalityDistribution: personalityDist
        };
    }

    // Cleanup
    cleanup() {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }
    }
}

// === 🎨 AVATAR UI HELPER FUNCTIONS ===

// Crea elemento avatar display
function createAvatarDisplay(avatar, size = 100, clickable = false) {
    const element = document.createElement('div');
    element.className = `avatar-display ${clickable ? 'clickable' : ''}`;
    element.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${size * 0.4}px;
        ${avatar.preview?.style || avatar.colors ? `background: linear-gradient(135deg, ${avatar.colors.primary} 0%, ${avatar.colors.secondary} 100%)` : ''};
        border: 3px solid rgba(255,255,255,0.3);
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        cursor: ${clickable ? 'pointer' : 'default'};
    `;
    
    element.textContent = avatar.emoji;
    
    if (clickable) {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.05)';
            element.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
            element.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        });
    }
    
    return element;
}

// Crea card informativa avatar
function createAvatarInfoCard(avatar) {
    const card = document.createElement('div');
    card.className = 'avatar-info-card';
    card.style.cssText = `
        background: white;
        border-radius: 15px;
        padding: 1.5rem;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        margin: 1rem 0;
        border-left: 4px solid ${avatar.colors.primary};
    `;
    
    card.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <div style="font-size: 2rem;">${avatar.emoji}</div>
            <div>
                <h3 style="margin: 0; color: #2c3e50;">${avatar.name}</h3>
                <p style="margin: 0; color: #666; font-style: italic;">${avatar.personality}</p>
            </div>
        </div>
        <p style="color: #555; margin-bottom: 1rem;">${avatar.description}</p>
        <div style="margin-bottom: 1rem;">
            <strong style="color: #2c3e50;">Caratteristiche:</strong>
            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap;">
                ${avatar.traits.map(trait => 
                    `<span style="background: ${avatar.colors.primary}20; color: ${avatar.colors.primary}; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.8rem;">${trait}</span>`
                ).join('')}
            </div>
        </div>
        <p style="color: #666; font-size: 0.9rem; margin: 0;">
            <strong>Stile coaching:</strong> ${avatar.coachingStyle}
        </p>
    `;
    
    return card;
}

// Anima transizione avatar
function animateAvatarTransition(fromElement, toAvatar, duration = 500) {
    return new Promise((resolve) => {
        // Animazione fade out
        fromElement.style.opacity = '0';
        fromElement.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            // Aggiorna contenuto
            fromElement.textContent = toAvatar.emoji;
            fromElement.style.background = `linear-gradient(135deg, ${toAvatar.colors.primary} 0%, ${toAvatar.colors.secondary} 100%)`;
            
            // Animazione fade in
            fromElement.style.opacity = '1';
            fromElement.style.transform = 'scale(1)';
            
            resolve();
        }, duration / 2);
    });
}

// Crea tooltip informativo
function createAvatarTooltip(avatar) {
    const tooltip = document.createElement('div');
    tooltip.className = 'avatar-tooltip';
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 0.75rem;
        border-radius: 8px;
        font-size: 0.8rem;
        max-width: 200px;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
    `;
    
    tooltip.innerHTML = `
        <strong>${avatar.name}</strong><br>
        ${avatar.description}<br>
        <em>${avatar.coachingStyle}</em>
    `;
    
    return tooltip;
}

// === 📊 AVATAR ANALYTICS ===
class AvatarAnalytics {
    constructor(avatarManager) {
        this.avatarManager = avatarManager;
        this.events = [];
    }

    // Traccia evento avatar
    trackEvent(eventType, data = {}) {
        const event = {
            type: eventType,
            timestamp: new Date(),
            userId: this.avatarManager.currentUserId,
            avatar: this.avatarManager.currentAvatar?.id,
            data: data
        };
        
        this.events.push(event);
        console.log('📊 Avatar event tracked:', eventType, data);
        
        // Mantieni solo ultimi 100 eventi
        if (this.events.length > 100) {
            this.events = this.events.slice(-100);
        }
    }

    // Ottieni statistiche utilizzo
    getUsageStats() {
        const now = new Date();
        const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
        const recentEvents = this.events.filter(e => e.timestamp > hourAgo);
        const dailyEvents = this.events.filter(e => e.timestamp > dayAgo);
        
        const eventTypes = {};
        this.events.forEach(event => {
            eventTypes[event.type] = (eventTypes[event.type] || 0) + 1;
        });
        
        return {
            totalEvents: this.events.length,
            recentActivity: recentEvents.length,
            dailyActivity: dailyEvents.length,
            eventTypes: eventTypes,
            lastActivity: this.events.length > 0 ? this.events[this.events.length - 1].timestamp : null
        };
    }
}

// === 🔧 UTILITY FUNCTIONS ===

// Genera colore casuale per avatar personalizzato
function generateRandomColor() {
    const colors = [
        '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444',
        '#06b6d4', '#84cc16', '#ec4899', '#f97316', '#6366f1'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Valida configurazione avatar
function validateAvatarConfig(config) {
    const required = ['id', 'name', 'emoji', 'colors'];
    return required.every(field => config.hasOwnProperty(field));
}

// Genera gradiente CSS da colori
function generateGradientStyle(primaryColor, secondaryColor, direction = '135deg') {
    return `background: linear-gradient(${direction}, ${primaryColor} 0%, ${secondaryColor} 100%)`;
}

// Ottieni contrasto colore per testo
function getTextColor(backgroundColor) {
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
}

// === 🎯 EXPORT PRINCIPALE ===

// Istanza globale avatar manager
let globalAvatarManager = null;

// Inizializza sistema avatar
async function initializeAvatarSystem(userId = null) {
    if (!globalAvatarManager) {
        globalAvatarManager = new AvatarManager();
    }
    
    return await globalAvatarManager.initialize(userId);
}

// Ottieni manager globale
function getAvatarManager() {
    return globalAvatarManager;
}

// === EXPORTS ===
export {
    AvatarManager,
    AvatarAnalytics,
    EXTENDED_AVATAR_DATA,
    AVATAR_CONFIG,
    initializeAvatarSystem,
    getAvatarManager,
    createAvatarDisplay,
    createAvatarInfoCard,
    animateAvatarTransition,
    createAvatarTooltip,
    generateRandomColor,
    validateAvatarConfig,
    generateGradientStyle,
    getTextColor
};

// Compatibilità window per uso diretto
if (typeof window !== 'undefined') {
    window.AvatarSystem = {
        AvatarManager,
        AvatarAnalytics,
        initializeAvatarSystem,
        getAvatarManager,
        createAvatarDisplay,
        createAvatarInfoCard,
        animateAvatarTransition,
        EXTENDED_AVATAR_DATA,
        AVATAR_CONFIG
    };
}

console.log('🎨 Avatar System Utils caricato - Sistema completo disponibile!');