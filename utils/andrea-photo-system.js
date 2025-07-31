// andrea-photo-system.js - Sistema Foto Reali Andrea con Rotazione Casuale
// Gestione dinamica delle foto del coach con ottimizzazione e fallback

// === 📸 CONFIGURAZIONE FOTO ANDREA ===
const ANDREA_PHOTOS = {
    photo1: {
        id: 'outdoor_green',
        name: 'Andrea Outdoor',
        description: 'Foto naturale all\'aperto con maglietta verde',
        // Base64 encoding della tua prima foto (da sostituire con foto reale)
        base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAyADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2aiiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q==',
        webp: 'assets/images/andrea/andrea-outdoor.webp',
        jpg: 'assets/images/andrea/andrea-outdoor.jpg',
        contexts: ['casual', 'motivational', 'outdoor', 'natural']
    },
    photo2: {
        id: 'beach_professional',
        name: 'Andrea Professional',
        description: 'Foto professionale al mare con maglietta nera',
        base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAyADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2aiiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q==',
        webp: 'assets/images/andrea/andrea-beach.webp',
        jpg: 'assets/images/andrea/andrea-beach.jpg',
        contexts: ['professional', 'coaching', 'welcoming', 'confident']
    },
    photo3: {
        id: 'city_leader',
        name: 'Andrea Leader',
        description: 'Foto determinata in città con braccia incrociate',
        base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAyADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAxQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2aiiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q==',
        webp: 'assets/images/andrea/andrea-city.webp',
        jpg: 'assets/images/andrea/andrea-city.jpg',
        contexts: ['leadership', 'determination', 'authority', 'focused']
    }
};

// === 🎲 SISTEMA ROTAZIONE ===
class AndreaPhotoManager {
    constructor() {
        this.currentPhoto = null;
        this.sessionPhoto = null;
        this.loadAttempts = {};
        this.isInitialized = false;
        
        console.log('📸 AndreaPhotoManager inizializzato');
    }

    // Inizializza il sistema foto
    initialize() {
        try {
            // Seleziona foto per questa sessione
            this.selectSessionPhoto();
            
            // Precarica tutte le foto
            this.preloadPhotos();
            
            this.isInitialized = true;
            console.log('✅ Sistema foto Andrea inizializzato');
            
            return true;
        } catch (error) {
            console.error('❌ Errore inizializzazione foto Andrea:', error);
            return false;
        }
    }

    // Seleziona foto casuale per la sessione
    selectSessionPhoto() {
        const sessionKey = 'andrea_session_photo';
        
        // Controlla se c'è già una foto per questa sessione
        let savedPhoto = sessionStorage.getItem(sessionKey);
        
        if (savedPhoto && ANDREA_PHOTOS[savedPhoto]) {
            this.sessionPhoto = ANDREA_PHOTOS[savedPhoto];
            console.log(`📸 Foto sessione esistente: ${this.sessionPhoto.name}`);
        } else {
            // Seleziona casualmente
            const photoKeys = Object.keys(ANDREA_PHOTOS);
            const randomIndex = Math.floor(Math.random() * photoKeys.length);
            const selectedKey = photoKeys[randomIndex];
            
            this.sessionPhoto = ANDREA_PHOTOS[selectedKey];
            sessionStorage.setItem(sessionKey, selectedKey);
            
            console.log(`🎲 Nuova foto selezionata: ${this.sessionPhoto.name}`);
        }
        
        this.currentPhoto = this.sessionPhoto;
    }

    // Ottieni foto corrente
    getCurrentPhoto() {
        return this.currentPhoto || ANDREA_PHOTOS.photo2; // Default alla foto beach
    }

    // Ottieni URL foto ottimizzato
    getPhotoUrl(size = 'medium', format = 'auto') {
        const photo = this.getCurrentPhoto();
        
        // Logica formato automatico
        if (format === 'auto') {
            format = this.supportsWebP() ? 'webp' : 'jpg';
        }
        
        // Restituisce URL appropriato
        if (format === 'webp' && photo.webp) {
            return photo.webp;
        } else if (format === 'jpg' && photo.jpg) {
            return photo.jpg;
        } else {
            // Fallback a base64
            return photo.base64;
        }
    }

    // Ottieni foto per contesto specifico
    getPhotoForContext(context) {
        const contextPhotos = Object.values(ANDREA_PHOTOS).filter(photo => 
            photo.contexts.includes(context)
        );
        
        if (contextPhotos.length > 0) {
            const randomPhoto = contextPhotos[Math.floor(Math.random() * contextPhotos.length)];
            return randomPhoto;
        }
        
        return this.getCurrentPhoto();
    }

    // Applica foto a elemento DOM
    applyPhotoToElement(element, options = {}) {
        if (!element) return false;
        
        const {
            size = 'medium',
            format = 'auto',
            context = null,
            fallback = true,
            circular = true,
            animate = true
        } = options;
        
        try {
            const photo = context ? this.getPhotoForContext(context) : this.getCurrentPhoto();
            const photoUrl = this.getPhotoUrl(size, format);
            
            // Applica foto
            if (element.tagName === 'IMG') {
                element.src = photoUrl;
                element.alt = `${photo.name} - Andrea Padoan Coach`;
            } else {
                element.style.backgroundImage = `url('${photoUrl}')`;
                element.style.backgroundSize = 'cover';
                element.style.backgroundPosition = 'center';
            }
            
            // Styling opzionale
            if (circular) {
                element.style.borderRadius = '50%';
            }
            
            if (animate) {
                element.style.transition = 'all 0.3s ease';
            }
            
            // Gestione errori di caricamento
            if (fallback && element.tagName === 'IMG') {
                element.onerror = () => this.handlePhotoError(element, photo);
            }
            
            console.log(`✅ Foto applicata: ${photo.name}`);
            return true;
            
        } catch (error) {
            console.error('❌ Errore applicazione foto:', error);
            return false;
        }
    }

    // Gestione errori caricamento foto
    handlePhotoError(element, photo) {
        console.warn(`⚠️ Errore caricamento foto: ${photo.name}`);
        
        // Incrementa tentativi
        this.loadAttempts[photo.id] = (this.loadAttempts[photo.id] || 0) + 1;
        
        // Prova fallback se disponibile
        if (this.loadAttempts[photo.id] === 1 && photo.base64) {
            element.src = photo.base64;
            console.log(`🔄 Fallback a base64 per: ${photo.name}`);
        } else {
            // Fallback definitivo - SVG generato
            element.src = this.generateFallbackSVG();
            console.log(`🔄 Fallback SVG applicato`);
        }
    }

    // Genera SVG di fallback
    generateFallbackSVG() {
        const svg = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:%23ff6b35;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:%23f39c12;stop-opacity:1" />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="url(%23grad1)" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
            <text x="50" y="60" text-anchor="middle" fill="white" font-size="24" font-weight="bold">AP</text>
        </svg>`;
        
        return svg;
    }

    // Precarica tutte le foto
    preloadPhotos() {
        Object.values(ANDREA_PHOTOS).forEach(photo => {
            if (photo.jpg) {
                const img = new Image();
                img.src = photo.jpg;
            }
            if (photo.webp) {
                const img = new Image();
                img.src = photo.webp;
            }
        });
        
        console.log('🔄 Precaricamento foto avviato');
    }

    // Controlla supporto WebP
    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    // Ottieni info foto corrente
    getCurrentPhotoInfo() {
        const photo = this.getCurrentPhoto();
        return {
            id: photo.id,
            name: photo.name,
            description: photo.description,
            contexts: photo.contexts,
            isSessionPhoto: photo.id === this.sessionPhoto?.id
        };
    }

    // Cambia foto manualmente (per testing)
    changePhoto(photoId) {
        if (ANDREA_PHOTOS[photoId]) {
            this.currentPhoto = ANDREA_PHOTOS[photoId];
            sessionStorage.setItem('andrea_session_photo', photoId);
            console.log(`📸 Foto cambiata manualmente: ${this.currentPhoto.name}`);
            return true;
        }
        return false;
    }

    // Ottieni statistiche sistema
    getPhotoStats() {
        return {
            totalPhotos: Object.keys(ANDREA_PHOTOS).length,
            currentPhoto: this.getCurrentPhotoInfo(),
            loadAttempts: { ...this.loadAttempts },
            webpSupported: this.supportsWebP(),
            isInitialized: this.isInitialized
        };
    }
}

// === 🔧 HELPER FUNCTIONS ===

// Applica foto Andrea a tutti gli elementi della pagina
function applyAndreaPhotosToPage() {
    const photoManager = getAndreaPhotoManager();
    
    // Dashboard avatar
    const dashboardAvatar = document.getElementById('andreaPhoto');
    if (dashboardAvatar) {
        photoManager.applyPhotoToElement(dashboardAvatar, {
            context: 'professional',
            size: 'medium'
        });
    }
    
    // Chat header avatar
    const chatAvatar = document.querySelector('.andrea-avatar');
    if (chatAvatar) {
        photoManager.applyPhotoToElement(chatAvatar, {
            context: 'coaching',
            size: 'small'
        });
    }
    
    // Message avatars
    const messageAvatars = document.querySelectorAll('.message.andrea .message-avatar');
    messageAvatars.forEach(avatar => {
        photoManager.applyPhotoToElement(avatar, {
            context: 'coaching',
            size: 'small'
        });
    });
    
    console.log('✅ Foto Andrea applicate a tutti gli elementi');
}

// Setup automatico quando DOM è pronto
function setupAndreaPhotos() {
    const photoManager = getAndreaPhotoManager();
    
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
                        node.id === 'andreaPhoto') {
                        photoManager.applyPhotoToElement(node, {
                            context: 'coaching',
                            size: 'medium'
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
    
    console.log('🔄 Observer foto Andrea attivato');
}

// === 📱 CSS INJECTION PER FOTO ===
function injectPhotoStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Andrea Photo System Styles */
        .andrea-photo {
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
        }
        
        .andrea-photo.loading {
            background: linear-gradient(45deg, #ff6b35, #f39c12) !important;
            animation: photoLoading 1.5s ease-in-out infinite;
        }
        
        @keyframes photoLoading {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
        }
        
        .andrea-photo.error {
            background: linear-gradient(45deg, #ff6b35, #f39c12) !important;
            position: relative;
        }
        
        .andrea-photo.error::after {
            content: 'AP';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-weight: bold;
            font-size: 1.2em;
        }
    `;
    
    document.head.appendChild(style);
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
    console.log('📸 Inizializzazione sistema foto Andrea...');
    
    // Inject styles
    injectPhotoStyles();
    
    // Setup photos
    setupAndreaPhotos();
    
    return getAndreaPhotoManager();
}

// === EXPORTS ===
export {
    AndreaPhotoManager,
    ANDREA_PHOTOS,
    getAndreaPhotoManager,
    initializeAndreaPhotoSystem,
    applyAndreaPhotosToPage,
    setupAndreaPhotos
};

// === COMPATIBILITÀ WINDOW ===
if (typeof window !== 'undefined') {
    window.AndreaPhotoSystem = {
        AndreaPhotoManager,
        getAndreaPhotoManager,
        initializeAndreaPhotoSystem,
        applyAndreaPhotosToPage,
        ANDREA_PHOTOS
    };
    
    // Auto-inizializzazione se DOM già pronto
    if (document.readyState !== 'loading') {
        setTimeout(initializeAndreaPhotoSystem, 100);
    } else {
        document.addEventListener('DOMContentLoaded', initializeAndreaPhotoSystem);
    }
}

console.log('📸 Sistema Foto Andrea caricato - Rotazione casuale attiva!');