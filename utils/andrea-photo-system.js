// andrea-photo-system.js - Sistema Foto Reali Andrea - SOLO JPG
// Versione semplificata che usa solo file JPG per massima compatibilità

// === 🔧 RILEVAMENTO PATH DINAMICO ===
function getBasePath() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/pages/')) {
        // Siamo in una sottodirectory pages/
        return '../assets/images/andrea/';
    } else if (currentPath.includes('/modules/')) {
        // Siamo in una sottodirectory modules/  
        return '../assets/images/andrea/';
    } else if (currentPath.includes('/admin/')) {
        // Siamo in admin dashboard
        return '../../assets/images/andrea/';
    } else {
        // Siamo nella root
        return 'assets/images/andrea/';
    }
}

// === 📸 CONFIGURAZIONE FOTO ANDREA - SOLO JPG ===
function getAndreaPhotosConfig() {
    const basePath = getBasePath();
    
    console.log('📸 Base path rilevato:', basePath);
    
    return {
        photo1: {
            id: 'outdoor_green',
            name: 'Andrea Outdoor',
            description: 'Foto naturale all\'aperto con maglietta verde',
            jpg: `${basePath}andrea-outdoor.jpg`,
            contexts: ['casual', 'motivational', 'outdoor', 'natural']
        },
        photo2: {
            id: 'beach_professional',
            name: 'Andrea Professional',
            description: 'Foto professionale al mare con maglietta nera',
            jpg: `${basePath}andrea-beach.jpg`,
            contexts: ['professional', 'coaching', 'welcoming', 'confident']
        },
        photo3: {
            id: 'city_leader',
            name: 'Andrea Leader',
            description: 'Foto determinata in città con braccia incrociate',
            jpg: `${basePath}andrea-city.jpg`,
            contexts: ['leadership', 'determination', 'authority', 'focused']
        }
    };
}

// === 🎲 SISTEMA ROTAZIONE SEMPLIFICATO ===
class AndreaPhotoManager {
    constructor() {
        this.currentPhoto = null;
        this.sessionPhoto = null;
        this.loadAttempts = {};
        this.isInitialized = false;
        this.debugMode = true;
        this.ANDREA_PHOTOS = getAndreaPhotosConfig();
        
        this.log('📸 AndreaPhotoManager inizializzato - SOLO JPG');
        this.log('📁 Base path:', getBasePath());
        this.log('🖼️ Foto configurate:', Object.keys(this.ANDREA_PHOTOS));
    }

    log(...args) {
        if (this.debugMode) {
            console.log('📸 Andrea Photos:', ...args);
        }
    }

    // Inizializza il sistema foto
    initialize() {
        try {
            this.log('🚀 Avvio inizializzazione SOLO JPG...');
            
            // Aggiorna configurazione foto con path correnti
            this.ANDREA_PHOTOS = getAndreaPhotosConfig();
            
            // Seleziona foto per questa sessione
            this.selectSessionPhoto();
            
            // Precarica tutte le foto JPG
            this.preloadPhotos();
            
            // Test connettività immagini JPG
            this.testImageConnectivity();
            
            this.isInitialized = true;
            this.log('✅ Sistema foto Andrea inizializzato - SOLO JPG');
            
            return true;
        } catch (error) {
            console.error('❌ Errore inizializzazione foto Andrea:', error);
            return false;
        }
    }

    // Test connettività immagini - SOLO JPG
    async testImageConnectivity() {
        this.log('🔍 Test connettività immagini JPG...');
        
        for (const [key, photo] of Object.entries(this.ANDREA_PHOTOS)) {
            try {
                const response = await fetch(photo.jpg, { method: 'HEAD' });
                if (response.ok) {
                    this.log(`✅ ${photo.name} JPG - OK`);
                } else {
                    this.log(`❌ ${photo.name} JPG - ${response.status}`);
                }
            } catch (error) {
                this.log(`❌ ${photo.name} JPG - Network Error:`, error.message);
            }
        }
    }

    // Seleziona foto casuale per la sessione
    selectSessionPhoto() {
        const sessionKey = 'andrea_session_photo';
        
        // Controlla se c'è già una foto per questa sessione
        let savedPhoto = sessionStorage.getItem(sessionKey);
        
        if (savedPhoto && this.ANDREA_PHOTOS[savedPhoto]) {
            this.sessionPhoto = this.ANDREA_PHOTOS[savedPhoto];
            this.log(`📸 Foto sessione esistente: ${this.sessionPhoto.name}`);
        } else {
            // Seleziona casualmente
            const photoKeys = Object.keys(this.ANDREA_PHOTOS);
            const randomIndex = Math.floor(Math.random() * photoKeys.length);
            const selectedKey = photoKeys[randomIndex];
            
            this.sessionPhoto = this.ANDREA_PHOTOS[selectedKey];
            sessionStorage.setItem(sessionKey, selectedKey);
            
            this.log(`🎲 Nuova foto selezionata: ${this.sessionPhoto.name}`);
        }
        
        this.currentPhoto = this.sessionPhoto;
    }

    // Ottieni foto corrente
    getCurrentPhoto() {
        return this.currentPhoto || this.ANDREA_PHOTOS.photo2; // Default alla foto beach
    }

    // Ottieni URL foto - SEMPRE JPG
    getPhotoUrl() {
        const photo = this.getCurrentPhoto();
        const photoUrl = photo.jpg;
        
        this.log(`📸 URL foto JPG selezionato: ${photoUrl}`);
        return photoUrl;
    }

    // Ottieni foto per contesto specifico
    getPhotoForContext(context) {
        const contextPhotos = Object.values(this.ANDREA_PHOTOS).filter(photo => 
            photo.contexts.includes(context)
        );
        
        if (contextPhotos.length > 0) {
            const randomPhoto = contextPhotos[Math.floor(Math.random() * contextPhotos.length)];
            this.log(`🎯 Foto per contesto "${context}": ${randomPhoto.name}`);
            return randomPhoto;
        }
        
        this.log(`⚠️ Nessuna foto per contesto "${context}", usando default`);
        return this.getCurrentPhoto();
    }

    // Applica foto a elemento DOM - SEMPLIFICATO
    async applyPhotoToElement(element, options = {}) {
        if (!element) {
            this.log('❌ Elemento non valido per applicazione foto');
            return false;
        }
        
        const {
            context = null,
            circular = true,
            animate = true
        } = options;
        
        try {
            const photo = context ? this.getPhotoForContext(context) : this.getCurrentPhoto();
            const photoUrl = photo.jpg; // SEMPRE JPG
            
            this.log(`🎨 Applicando foto ${photo.name} (JPG) a elemento:`, element);
            
            // Applica foto direttamente
            const success = await this.loadPhotoUrl(element, photoUrl);
            
            if (success) {
                // Styling opzionale
                if (circular) {
                    element.style.borderRadius = '50%';
                }
                
                if (animate) {
                    element.style.transition = 'all 0.3s ease';
                }
                
                // Rimuovi classe loading se presente
                element.classList.remove('loading');
                
                this.log(`✅ Foto JPG applicata con successo: ${photo.name}`);
                return true;
            } else {
                // Fallback a SVG se JPG fallisce
                this.handlePhotoError(element, photo);
                return false;
            }
            
        } catch (error) {
            console.error('❌ Errore applicazione foto:', error);
            return false;
        }
    }

    // Carica URL JPG specifico
    loadPhotoUrl(element, photoUrl) {
        return new Promise((resolve) => {
            if (element.tagName === 'IMG') {
                const tempImg = new Image();
                
                tempImg.onload = () => {
                    element.src = photoUrl;
                    element.alt = `Andrea Padoan Coach`;
                    resolve(true);
                };
                
                tempImg.onerror = () => {
                    this.log(`❌ Errore caricamento JPG: ${photoUrl}`);
                    resolve(false);
                };
                
                tempImg.src = photoUrl;
                
            } else {
                // Per elementi div con background
                element.style.backgroundImage = `url('${photoUrl}')`;
                element.style.backgroundSize = 'cover';
                element.style.backgroundPosition = 'center';
                element.style.backgroundRepeat = 'no-repeat';
                
                // Assume successo per background images
                resolve(true);
            }
        });
    }

    // Gestione errori caricamento foto - SVG fallback
    handlePhotoError(element, photo) {
        this.log(`⚠️ Gestione errore per: ${photo.name} - Usando SVG fallback`);
        
        // Incrementa tentativi
        this.loadAttempts[photo.id] = (this.loadAttempts[photo.id] || 0) + 1;
        
        // Applica fallback SVG definitivo
        const fallbackSvg = this.generateFallbackSVG(photo.name);
        
        if (element.tagName === 'IMG') {
            element.src = fallbackSvg;
        } else {
            element.style.backgroundImage = `url('${fallbackSvg}')`;
            element.style.backgroundSize = 'cover';
            element.style.backgroundPosition = 'center';
        }
        
        // Aggiungi classe error per styling
        element.classList.add('andrea-photo-error');
        
        this.log(`🔄 Fallback SVG applicato per: ${photo.name}`);
    }

    // Genera SVG di fallback personalizzato
    generateFallbackSVG(photoName = 'Andrea') {
        const initials = photoName.split(' ').map(word => word[0]).join('').toUpperCase();
        
        const svg = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:%23ff6b35;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:%23f39c12;stop-opacity:1" />
                </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="55" fill="url(%23grad1)" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
            <text x="60" y="75" text-anchor="middle" fill="white" font-size="28" font-weight="bold" font-family="Arial, sans-serif">${initials}</text>
        </svg>`;
        
        return svg;
    }

    // Precarica tutte le foto JPG
    preloadPhotos() {
        this.log('🔄 Avvio precaricamento foto JPG...');
        
        Object.values(this.ANDREA_PHOTOS).forEach(photo => {
            const img = new Image();
            img.onload = () => this.log(`✅ Precaricato: ${photo.name} (JPG)`);
            img.onerror = () => this.log(`❌ Errore precaricamento: ${photo.name} (JPG)`);
            img.src = photo.jpg;
        });
    }

    // Ottieni info foto corrente
    getCurrentPhotoInfo() {
        const photo = this.getCurrentPhoto();
        return {
            id: photo.id,
            name: photo.name,
            description: photo.description,
            contexts: photo.contexts,
            isSessionPhoto: photo.id === this.sessionPhoto?.id,
            url: photo.jpg
        };
    }

    // Cambia foto manualmente (per testing)
    changePhoto(photoId) {
        if (this.ANDREA_PHOTOS[photoId]) {
            this.currentPhoto = this.ANDREA_PHOTOS[photoId];
            sessionStorage.setItem('andrea_session_photo', photoId);
            this.log(`📸 Foto cambiata manualmente: ${this.currentPhoto.name}`);
            return true;
        }
        this.log(`❌ Foto non trovata: ${photoId}`);
        return false;
    }

    // Ottieni statistiche sistema
    getPhotoStats() {
        return {
            totalPhotos: Object.keys(this.ANDREA_PHOTOS).length,
            currentPhoto: this.getCurrentPhotoInfo(),
            loadAttempts: { ...this.loadAttempts },
            isInitialized: this.isInitialized,
            basePath: getBasePath(),
            debugMode: this.debugMode,
            availablePhotos: Object.keys(this.ANDREA_PHOTOS),
            format: 'JPG_ONLY'
        };
    }

    // Debug info completo
    debugInfo() {
        console.group('📸 Andrea Photo System Debug - JPG ONLY');
        console.log('Config:', this.getPhotoStats());
        console.log('Current Path:', window.location.pathname);
        console.log('Base Path:', getBasePath());
        console.log('Photos Config:', this.ANDREA_PHOTOS);
        console.groupEnd();
    }
}

// === 🔧 HELPER FUNCTIONS ===

// Applica foto Andrea a tutti gli elementi della pagina
async function applyAndreaPhotosToPage() {
    const photoManager = getAndreaPhotoManager();
    
    console.log('🎨 Applicando foto Andrea JPG a tutti gli elementi...');
    
    // Dashboard avatar
    const dashboardAvatar = document.getElementById('andreaPhoto');
    if (dashboardAvatar) {
        console.log('📱 Trovato dashboard avatar');
        await photoManager.applyPhotoToElement(dashboardAvatar, {
            context: 'professional'
        });
    }
    
    // Chat header avatar
    const chatAvatar = document.querySelector('.andrea-avatar');
    if (chatAvatar) {
        console.log('💬 Trovato chat avatar');
        await photoManager.applyPhotoToElement(chatAvatar, {
            context: 'coaching'
        });
    }
    
    // Message avatars
    const messageAvatars = document.querySelectorAll('.message.andrea .message-avatar');
    if (messageAvatars.length > 0) {
        console.log(`💬 Trovati ${messageAvatars.length} message avatar`);
        for (const avatar of messageAvatars) {
            await photoManager.applyPhotoToElement(avatar, {
                context: 'coaching'
            });
        }
    }
    
    // Andrea photo class generica
    const andreaPhotos = document.querySelectorAll('.andrea-photo');
    if (andreaPhotos.length > 0) {
        console.log(`📸 Trovati ${andreaPhotos.length} elementi .andrea-photo`);
        for (const photo of andreaPhotos) {
            await photoManager.applyPhotoToElement(photo, {
                context: 'professional'
            });
        }
    }
    
    console.log('✅ Foto Andrea JPG applicate a tutti gli elementi trovati');
}

// Setup automatico quando DOM è pronto
function setupAndreaPhotos() {
    const photoManager = getAndreaPhotoManager();
    
    console.log('🚀 Setup sistema foto Andrea - SOLO JPG...');
    
    if (!photoManager.isInitialized) {
        photoManager.initialize();
    }
    
    // Applica foto alla pagina
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyAndreaPhotosToPage);
    } else {
        applyAndreaPhotosToPage();
    }
    
    // Observer per nuovi elementi
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    // Controlla se è un avatar Andrea
                    if (node.classList?.contains('andrea-avatar') || 
                        node.classList?.contains('message-avatar') ||
                        node.classList?.contains('andrea-photo') ||
                        node.id === 'andreaPhoto') {
                        
                        console.log('🔍 Nuovo elemento Andrea rilevato:', node);
                        photoManager.applyPhotoToElement(node, {
                            context: 'coaching'
                        });
                    }
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('👁️ Observer foto Andrea attivato');
}

// === 📱 CSS INJECTION PER FOTO ===
function injectPhotoStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Andrea Photo System Styles - JPG ONLY */
        .andrea-photo {
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
        }
        
        .andrea-photo.loading {
            background: linear-gradient(45deg, #ff6b35, #f39c12) !important;
            animation: photoLoading 1.5s ease-in-out infinite;
            position: relative;
        }
        
        .andrea-photo.loading::before {
            content: 'AP';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-weight: bold;
            font-size: 1.2em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        @keyframes photoLoading {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
        }
        
        .andrea-photo-error {
            background: linear-gradient(45deg, #ff6b35, #f39c12) !important;
            position: relative;
        }
        
        /* Loading animation migliorata per dashboard */
        #andreaPhoto.loading {
            background: linear-gradient(45deg, #ff6b35, #f39c12) !important;
            animation: photoLoading 1.5s ease-in-out infinite;
        }
        
        #andreaPhoto.loading::before {
            content: 'AP';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 2rem;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
    `;
    
    document.head.appendChild(style);
    console.log('🎨 Stili foto Andrea JPG iniettati');
}

// === 🌐 ISTANZA GLOBALE ===
let globalAndreaPhotoManager = null;

// Ottieni manager globale
function getAndreaPhotoManager() {
    if (!globalAndreaPhotoManager) {
        globalAndreaPhotoManager = new AndreaPhotoManager();
    }
    return globalAndreaPhotoManager;
}

// Inizializza sistema foto automaticamente
function initializeAndreaPhotoSystem() {
    console.log('📸 Inizializzazione sistema foto Andrea - SOLO JPG...');
    
    // Inject styles
    injectPhotoStyles();
    
    // Setup photos
    setupAndreaPhotos();
    
    // Debug info
    setTimeout(() => {
        const manager = getAndreaPhotoManager();
        manager.debugInfo();
    }, 2000);
    
    return getAndreaPhotoManager();
}

// === EXPORTS ===
export {
    AndreaPhotoManager,
    getAndreaPhotoManager,
    initializeAndreaPhotoSystem,
    applyAndreaPhotosToPage,
    setupAndreaPhotos,
    getBasePath,
    getAndreaPhotosConfig
};

// === COMPATIBILITÀ WINDOW ===
if (typeof window !== 'undefined') {
    window.AndreaPhotoSystem = {
        AndreaPhotoManager,
        getAndreaPhotoManager,
        initializeAndreaPhotoSystem,
        applyAndreaPhotosToPage,
        getBasePath,
        getAndreaPhotosConfig
    };
    
    // Auto-inizializzazione se DOM già pronto
    if (document.readyState !== 'loading') {
        setTimeout(initializeAndreaPhotoSystem, 100);
    } else {
        document.addEventListener('DOMContentLoaded', initializeAndreaPhotoSystem);
    }
}

console.log('📸 Sistema Foto Andrea caricato - SOLO JPG attivo!');