// andrea-photo-system.js - Sistema Foto Reali Andrea con Path Dinamici
// Gestione dinamica delle foto del coach con ottimizzazione e fallback

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

// === 📸 CONFIGURAZIONE FOTO ANDREA CON PATH DINAMICI ===
function getAndreaPhotosConfig() {
    const basePath = getBasePath();
    
    console.log('📸 Base path rilevato:', basePath);
    
    return {
        photo1: {
            id: 'outdoor_green',
            name: 'Andrea Outdoor',
            description: 'Foto naturale all\'aperto con maglietta verde',
            // Base64 minimo per fallback immediato
            base64: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ1IiBmaWxsPSJ1cmwoI2dyYWQxKSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMykiIHN0cm9rZS13aWR0aD0iMyIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkMSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjZiMzU7c3RvcC1vcGFjaXR5OjEiIC8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2YzOWMxMjtzdG9wLW9wYWNpdHk6MSIgLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8dGV4dCB4PSI1MCIgeT0iNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCI+QVA8L3RleHQ+Cjwvc3ZnPgo=',
            webp: `${basePath}andrea-outdoor.webp`,
            jpg: `${basePath}andrea-outdoor.jpg`,
            contexts: ['casual', 'motivational', 'outdoor', 'natural']
        },
        photo2: {
            id: 'beach_professional',
            name: 'Andrea Professional',
            description: 'Foto professionale al mare con maglietta nera',
            base64: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ1IiBmaWxsPSJ1cmwoI2dyYWQxKSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMykiIHN0cm9rZS13aWR0aD0iMyIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkMSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjZiMzU7c3RvcC1vcGFjaXR5OjEiIC8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2YzOWMxMjtzdG9wLW9wYWNpdHk6MSIgLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8dGV4dCB4PSI1MCIgeT0iNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCI+QVA8L3RleHQ+Cjwvc3ZnPgo=',
            webp: `${basePath}andrea-beach.webp`,
            jpg: `${basePath}andrea-beach.jpg`,
            contexts: ['professional', 'coaching', 'welcoming', 'confident']
        },
        photo3: {
            id: 'city_leader',
            name: 'Andrea Leader',
            description: 'Foto determinata in città con braccia incrociate',
            base64: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ1IiBmaWxsPSJ1cmwoI2dyYWQxKSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMykiIHN0cm9rZS13aWR0aD0iMyIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkMSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjZiMzU7c3RvcC1vcGFjaXR5OjEiIC8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2YzOWMxMjtzdG9wLW9wYWNpdHk6MSIgLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8dGV4dCB4PSI1MCIgeT0iNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCI+QVA8L3RleHQ+Cjwvc3ZnPgo=',
            webp: `${basePath}andrea-city.webp`,
            jpg: `${basePath}andrea-city.jpg`,
            contexts: ['leadership', 'determination', 'authority', 'focused']
        }
    };
}

// === 🎲 SISTEMA ROTAZIONE CON DEBUG AVANZATO ===
class AndreaPhotoManager {
    constructor() {
        this.currentPhoto = null;
        this.sessionPhoto = null;
        this.loadAttempts = {};
        this.isInitialized = false;
        this.debugMode = true;
        this.ANDREA_PHOTOS = getAndreaPhotosConfig();
        
        this.log('📸 AndreaPhotoManager inizializzato');
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
            this.log('🚀 Avvio inizializzazione...');
            
            // Aggiorna configurazione foto con path correnti
            this.ANDREA_PHOTOS = getAndreaPhotosConfig();
            
            // Seleziona foto per questa sessione
            this.selectSessionPhoto();
            
            // Precarica tutte le foto
            this.preloadPhotos();
            
            // Test connettività immagini
            this.testImageConnectivity();
            
            this.isInitialized = true;
            this.log('✅ Sistema foto Andrea inizializzato');
            
            return true;
        } catch (error) {
            console.error('❌ Errore inizializzazione foto Andrea:', error);
            return false;
        }
    }

    // Test connettività immagini
    async testImageConnectivity() {
        this.log('🔍 Test connettività immagini...');
        
        for (const [key, photo] of Object.entries(this.ANDREA_PHOTOS)) {
            // Test JPG
            if (photo.jpg) {
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
            
            // Test WebP
            if (photo.webp && this.supportsWebP()) {
                try {
                    const response = await fetch(photo.webp, { method: 'HEAD' });
                    if (response.ok) {
                        this.log(`✅ ${photo.name} WebP - OK`);
                    } else {
                        this.log(`❌ ${photo.name} WebP - ${response.status}`);
                    }
                } catch (error) {
                    this.log(`❌ ${photo.name} WebP - Network Error:`, error.message);
                }
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

    // Ottieni URL foto ottimizzato con fallback intelligente
    getPhotoUrl(size = 'medium', format = 'auto') {
        const photo = this.getCurrentPhoto();
        
        // Logica formato automatico
        if (format === 'auto') {
            format = this.supportsWebP() ? 'webp' : 'jpg';
        }
        
        let photoUrl;
        
        // Prova prima il formato preferito
        if (format === 'webp' && photo.webp) {
            photoUrl = photo.webp;
        } else if (format === 'jpg' && photo.jpg) {
            photoUrl = photo.jpg;
        } else {
            // Fallback a base64
            photoUrl = photo.base64;
            this.log(`🔄 Usando fallback base64 per: ${photo.name}`);
        }
        
        this.log(`📸 URL foto selezionato: ${photoUrl}`);
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

    // Applica foto a elemento DOM con retry automatico
    async applyPhotoToElement(element, options = {}) {
        if (!element) {
            this.log('❌ Elemento non valido per applicazione foto');
            return false;
        }
        
        const {
            size = 'medium',
            format = 'auto',
            context = null,
            fallback = true,
            circular = true,
            animate = true,
            retries = 2
        } = options;
        
        try {
            const photo = context ? this.getPhotoForContext(context) : this.getCurrentPhoto();
            
            this.log(`🎨 Applicando foto ${photo.name} a elemento:`, element);
            
            // Prova caricamento con retry
            const success = await this.loadPhotoWithRetry(element, photo, { size, format, fallback, retries });
            
            // Styling opzionale
            if (success) {
                if (circular) {
                    element.style.borderRadius = '50%';
                }
                
                if (animate) {
                    element.style.transition = 'all 0.3s ease';
                }
                
                // Rimuovi classe loading se presente
                element.classList.remove('loading');
                
                this.log(`✅ Foto applicata con successo: ${photo.name}`);
                return true;
            }
            
            return false;
            
        } catch (error) {
            console.error('❌ Errore applicazione foto:', error);
            return false;
        }
    }

    // Caricamento foto con retry automatico
    async loadPhotoWithRetry(element, photo, options = {}) {
        const { size, format, fallback, retries } = options;
        let attempts = 0;
        const maxAttempts = retries + 1;
        
        while (attempts < maxAttempts) {
            try {
                attempts++;
                this.log(`🔄 Tentativo ${attempts}/${maxAttempts} per ${photo.name}`);
                
                let photoUrl;
                
                if (attempts === 1) {
                    // Primo tentativo: formato preferito
                    photoUrl = this.getPhotoUrl(size, format);
                } else if (attempts === 2 && format === 'webp') {
                    // Secondo tentativo: JPG se prima era WebP
                    photoUrl = photo.jpg || photo.base64;
                } else {
                    // Ultimo tentativo: base64
                    photoUrl = photo.base64;
                }
                
                // Prova caricamento
                const success = await this.loadPhotoUrl(element, photoUrl);
                
                if (success) {
                    this.log(`✅ Caricamento riuscito al tentativo ${attempts}`);
                    return true;
                }
                
            } catch (error) {
                this.log(`❌ Tentativo ${attempts} fallito:`, error.message);
            }
        }
        
        // Tutti i tentativi falliti
        this.log(`❌ Tutti i tentativi falliti per ${photo.name}`);
        this.handlePhotoError(element, photo);
        return false;
    }

    // Carica URL specifico
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
                    resolve(false);
                };
                
                tempImg.src = photoUrl;
                
            } else {
                // Per elementi div con background
                element.style.backgroundImage = `url('${photoUrl}')`;
                element.style.backgroundSize = 'cover';
                element.style.backgroundPosition = 'center';
                element.style.backgroundRepeat = 'no-repeat';
                
                // Non possiamo testare il caricamento del background, assumiamo successo
                resolve(true);
            }
        });
    }

    // Gestione errori caricamento foto avanzata
    handlePhotoError(element, photo) {
        this.log(`⚠️ Gestione errore per: ${photo.name}`);
        
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

    // Precarica tutte le foto con feedback
    preloadPhotos() {
        this.log('🔄 Avvio precaricamento foto...');
        
        Object.values(this.ANDREA_PHOTOS).forEach(photo => {
            // Precarica JPG
            if (photo.jpg) {
                const img = new Image();
                img.onload = () => this.log(`✅ Precaricato: ${photo.name} (JPG)`);
                img.onerror = () => this.log(`❌ Errore precaricamento: ${photo.name} (JPG)`);
                img.src = photo.jpg;
            }
            
            // Precarica WebP se supportato
            if (photo.webp && this.supportsWebP()) {
                const img = new Image();
                img.onload = () => this.log(`✅ Precaricato: ${photo.name} (WebP)`);
                img.onerror = () => this.log(`❌ Errore precaricamento: ${photo.name} (WebP)`);
                img.src = photo.webp;
            }
        });
    }

    // Controlla supporto WebP
    supportsWebP() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            const supported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
            this.log(`🔍 Supporto WebP: ${supported ? 'SÌ' : 'NO'}`);
            return supported;
        } catch (error) {
            this.log(`❌ Errore test WebP:`, error);
            return false;
        }
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
            urls: {
                webp: photo.webp,
                jpg: photo.jpg,
                base64: photo.base64.length > 100 ? photo.base64.substring(0, 100) + '...' : photo.base64
            }
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

    // Ottieni statistiche sistema complete
    getPhotoStats() {
        return {
            totalPhotos: Object.keys(this.ANDREA_PHOTOS).length,
            currentPhoto: this.getCurrentPhotoInfo(),
            loadAttempts: { ...this.loadAttempts },
            webpSupported: this.supportsWebP(),
            isInitialized: this.isInitialized,
            basePath: getBasePath(),
            debugMode: this.debugMode,
            availablePhotos: Object.keys(this.ANDREA_PHOTOS)
        };
    }

    // Debug info completo
    debugInfo() {
        console.group('📸 Andrea Photo System Debug');
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
    
    console.log('🎨 Applicando foto Andrea a tutti gli elementi...');
    
    // Dashboard avatar
    const dashboardAvatar = document.getElementById('andreaPhoto');
    if (dashboardAvatar) {
        console.log('📱 Trovato dashboard avatar');
        await photoManager.applyPhotoToElement(dashboardAvatar, {
            context: 'professional',
            size: 'medium'
        });
    }
    
    // Chat header avatar
    const chatAvatar = document.querySelector('.andrea-avatar');
    if (chatAvatar) {
        console.log('💬 Trovato chat avatar');
        await photoManager.applyPhotoToElement(chatAvatar, {
            context: 'coaching',
            size: 'small'
        });
    }
    
    // Message avatars
    const messageAvatars = document.querySelectorAll('.message.andrea .message-avatar');
    if (messageAvatars.length > 0) {
        console.log(`💬 Trovati ${messageAvatars.length} message avatar`);
        for (const avatar of messageAvatars) {
            await photoManager.applyPhotoToElement(avatar, {
                context: 'coaching',
                size: 'small'
            });
        }
    }
    
    // Andrea photo class generica
    const andreaPhotos = document.querySelectorAll('.andrea-photo');
    if (andreaPhotos.length > 0) {
        console.log(`📸 Trovati ${andreaPhotos.length} elementi .andrea-photo`);
        for (const photo of andreaPhotos) {
            await photoManager.applyPhotoToElement(photo, {
                context: 'professional',
                size: 'medium'
            });
        }
    }
    
    console.log('✅ Foto Andrea applicate a tutti gli elementi trovati');
}

// Setup automatico quando DOM è pronto
function setupAndreaPhotos() {
    const photoManager = getAndreaPhotoManager();
    
    console.log('🚀 Setup sistema foto Andrea...');
    
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
    
    console.log('👁️ Observer foto Andrea attivato');
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
        
        .andrea-photo-error::after {
            content: '📸';
            position: absolute;
            bottom: 2px;
            right: 2px;
            background: rgba(0,0,0,0.7);
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
        }
        
        /* Loading animation migliorata */
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
    console.log('🎨 Stili foto Andrea iniettati');
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

console.log('📸 Sistema Foto Andrea caricato - Path dinamici attivi!');