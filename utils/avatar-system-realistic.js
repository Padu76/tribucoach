// avatar-system-realistic.js - SISTEMA AVATAR SOLO FOTO
// Sistema semplice e funzionale per foto personali

// === CONFIGURAZIONE SISTEMA FOTO ===
const PhotoAvatarConfig = {
    // Colori placeholder casuali
    placeholderColors: [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
        '#F8C471', '#82E0AA', '#AED6F1', '#D7BDE2', '#F9E79F',
        '#F1948A', '#85C1E9', '#F8C471', '#D5A6BD', '#AED6F1'
    ],
    
    // Emoji casuali per placeholder
    placeholderEmojis: [
        '😊', '🙂', '😄', '😁', '🤗', '😎', '🤓', '😇', 
        '🙃', '😌', '🤔', '😋', '😉', '🥳', '🤠', '🤩'
    ],
    
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
};

// === MANAGER AVATAR FOTO ===
class PhotoAvatarManager {
    constructor(userId, userName = '') {
        this.userId = userId;
        this.userName = userName;
        this.photoUrl = null;
        this.placeholderData = this.generatePlaceholder();
        this.loadFromStorage();
        
        console.log(`🎨 Photo Avatar Manager inizializzato per: ${userId}`);
    }
    
    generatePlaceholder() {
        const colors = PhotoAvatarConfig.placeholderColors;
        const emojis = PhotoAvatarConfig.placeholderEmojis;
        
        return {
            color: colors[Math.floor(Math.random() * colors.length)],
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            initials: this.getInitials()
        };
    }
    
    getInitials() {
        if (!this.userName) return 'U';
        
        const words = this.userName.trim().split(' ');
        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
        }
        
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    }
    
    setPhoto(file) {
        return new Promise((resolve, reject) => {
            // Validazione file
            if (!this.validateFile(file)) {
                reject(new Error('File non valido'));
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                this.photoUrl = e.target.result;
                this.saveToStorage();
                console.log('📸 Foto avatar caricata con successo');
                resolve(this.photoUrl);
            };
            reader.onerror = () => reject(new Error('Errore lettura file'));
            reader.readAsDataURL(file);
        });
    }
    
    validateFile(file) {
        // Controlla tipo
        if (!PhotoAvatarConfig.allowedTypes.includes(file.type)) {
            console.error('❌ Tipo file non supportato:', file.type);
            return false;
        }
        
        // Controlla dimensione
        if (file.size > PhotoAvatarConfig.maxFileSize) {
            console.error('❌ File troppo grande:', file.size);
            return false;
        }
        
        return true;
    }
    
    removePhoto() {
        this.photoUrl = null;
        this.placeholderData = this.generatePlaceholder();
        this.saveToStorage();
        console.log('🗑️ Foto avatar rimossa');
    }
    
    hasPhoto() {
        return !!this.photoUrl;
    }
    
    getDisplayHTML(size = 200) {
        if (this.photoUrl) {
            return `
                <div class="photo-avatar" style="width: ${size}px; height: ${size}px;">
                    <img src="${this.photoUrl}" 
                         alt="Avatar Photo" 
                         style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />
                    <div class="photo-overlay">
                        <button class="remove-photo-btn" onclick="window.photoAvatarManager.removePhoto(); window.photoAvatarUI.updateDisplay();" title="Rimuovi foto">
                            ✕
                        </button>
                    </div>
                </div>
            `;
        } else {
            return this.getPlaceholderHTML(size);
        }
    }
    
    getPlaceholderHTML(size = 200) {
        const fontSize = Math.round(size * 0.4);
        const emojiSize = Math.round(size * 0.25);
        
        return `
            <div class="placeholder-avatar" 
                 style="width: ${size}px; height: ${size}px; background: ${this.placeholderData.color};">
                <div class="placeholder-content">
                    <div class="placeholder-emoji" style="font-size: ${emojiSize}px;">
                        ${this.placeholderData.emoji}
                    </div>
                    <div class="placeholder-initials" style="font-size: ${fontSize}px;">
                        ${this.placeholderData.initials}
                    </div>
                </div>
            </div>
        `;
    }
    
    regeneratePlaceholder() {
        this.placeholderData = this.generatePlaceholder();
        this.saveToStorage();
        console.log('🎲 Placeholder rigenerato');
    }
    
    saveToStorage() {
        try {
            const data = {
                photoUrl: this.photoUrl,
                placeholderData: this.placeholderData,
                timestamp: Date.now()
            };
            
            if (!window.avatarStorage) window.avatarStorage = {};
            window.avatarStorage[this.userId] = data;
            
            console.log('💾 Avatar foto salvato');
        } catch (e) {
            console.error('❌ Errore salvataggio avatar:', e);
        }
    }
    
    loadFromStorage() {
        try {
            if (window.avatarStorage && window.avatarStorage[this.userId]) {
                const data = window.avatarStorage[this.userId];
                this.photoUrl = data.photoUrl || null;
                this.placeholderData = data.placeholderData || this.generatePlaceholder();
                console.log('📂 Avatar foto caricato da storage');
            }
        } catch (e) {
            console.error('❌ Errore caricamento avatar:', e);
        }
    }
}

// === UI AVATAR FOTO ===
class PhotoAvatarUI {
    constructor(containerId, manager) {
        this.container = document.getElementById(containerId);
        this.manager = manager;
        this.isDragging = false;
        
        if (!this.container) {
            console.error('❌ Container non trovato:', containerId);
            return;
        }
        
        this.init();
        console.log('🎭 Photo Avatar UI inizializzata');
    }
    
    init() {
        this.container.innerHTML = `
            <div class="photo-avatar-ui">
                <div class="avatar-preview-section">
                    <div class="preview-container" id="avatarPreview">
                        ${this.manager.getDisplayHTML(180)}
                    </div>
                    
                    <div class="avatar-info">
                        <h3>${this.manager.hasPhoto() ? '📸 La tua foto' : '👤 Avatar placeholder'}</h3>
                        <p>${this.manager.hasPhoto() ? 'Foto personalizzata caricata' : 'Carica una tua foto per personalizzare'}</p>
                    </div>
                </div>
                
                <div class="upload-section">
                    <div class="upload-area ${this.manager.hasPhoto() ? 'has-photo' : ''}" 
                         id="uploadArea">
                        <input type="file" 
                               id="photoFileInput" 
                               accept="image/*" 
                               style="display: none;">
                        
                        <div class="upload-content">
                            <div class="upload-icon">📷</div>
                            <div class="upload-title">
                                ${this.manager.hasPhoto() ? 'Cambia foto' : 'Carica la tua foto'}
                            </div>
                            <div class="upload-subtitle">
                                Trascina qui un'immagine o clicca per selezionare
                            </div>
                            <div class="upload-specs">
                                JPG, PNG o WEBP • Max 5MB
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="actions-section">
                    ${!this.manager.hasPhoto() ? `
                        <button class="action-btn secondary" onclick="window.photoAvatarManager.regeneratePlaceholder(); window.photoAvatarUI.updateDisplay();">
                            🎲 Cambia placeholder
                        </button>
                    ` : ''}
                    
                    <button class="action-btn primary" onclick="window.photoAvatarUI.save();">
                        💾 Salva avatar
                    </button>
                </div>
                
                <div class="loading-overlay" id="loadingOverlay" style="display: none;">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">Caricamento foto...</div>
                </div>
            </div>
        `;
        
        this.attachEvents();
        this.injectStyles();
    }
    
    attachEvents() {
        const uploadArea = this.container.querySelector('#uploadArea');
        const fileInput = this.container.querySelector('#photoFileInput');
        
        // Click per aprire file selector
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFileUpload(file);
            }
        });
        
        // Drag and drop events
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.setDragState(true);
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            this.setDragState(false);
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.setDragState(false);
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileUpload(files[0]);
            }
        });
    }
    
    setDragState(isDragging) {
        const uploadArea = this.container.querySelector('#uploadArea');
        uploadArea.classList.toggle('dragging', isDragging);
    }
    
    async handleFileUpload(file) {
        this.showLoading(true);
        
        try {
            await this.manager.setPhoto(file);
            this.updateDisplay();
            this.showNotification('✅ Foto caricata con successo!', 'success');
        } catch (error) {
            console.error('❌ Errore upload foto:', error);
            this.showNotification('❌ Errore nel caricamento della foto', 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    updateDisplay() {
        // Aggiorna preview
        const preview = this.container.querySelector('#avatarPreview');
        preview.innerHTML = this.manager.getDisplayHTML(180);
        
        // Aggiorna info
        const info = this.container.querySelector('.avatar-info h3');
        const description = this.container.querySelector('.avatar-info p');
        
        if (this.manager.hasPhoto()) {
            info.textContent = '📸 La tua foto';
            description.textContent = 'Foto personalizzata caricata';
        } else {
            info.textContent = '👤 Avatar placeholder';
            description.textContent = 'Carica una tua foto per personalizzare';
        }
        
        // Aggiorna upload area
        const uploadArea = this.container.querySelector('#uploadArea');
        const uploadTitle = this.container.querySelector('.upload-title');
        
        uploadArea.classList.toggle('has-photo', this.manager.hasPhoto());
        uploadTitle.textContent = this.manager.hasPhoto() ? 'Cambia foto' : 'Carica la tua foto';
        
        // Aggiorna azioni
        this.refreshActions();
    }
    
    refreshActions() {
        const actionsSection = this.container.querySelector('.actions-section');
        actionsSection.innerHTML = `
            ${!this.manager.hasPhoto() ? `
                <button class="action-btn secondary" onclick="window.photoAvatarManager.regeneratePlaceholder(); window.photoAvatarUI.updateDisplay();">
                    🎲 Cambia placeholder
                </button>
            ` : ''}
            
            <button class="action-btn primary" onclick="window.photoAvatarUI.save();">
                💾 Salva avatar
            </button>
        `;
    }
    
    showLoading(show) {
        const loadingOverlay = this.container.querySelector('#loadingOverlay');
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }
    
    save() {
        this.manager.saveToStorage();
        this.showNotification('💾 Avatar salvato con successo!', 'success');
    }
    
    showNotification(message, type = 'info') {
        const colors = {
            success: '#27AE60',
            error: '#E74C3C',
            info: '#3498DB'
        };
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            background: ${colors[type]}; color: white; padding: 15px 25px;
            border-radius: 12px; font-weight: 600; font-size: 14px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    injectStyles() {
        if (document.getElementById('photo-avatar-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'photo-avatar-styles';
        styles.textContent = `
            .photo-avatar-ui {
                max-width: 600px;
                margin: 0 auto;
                padding: 40px 30px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 25px;
                box-shadow: 0 25px 80px rgba(0,0,0,0.3);
                color: white;
                position: relative;
                overflow: hidden;
            }
            
            .photo-avatar-ui::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.03)"/><circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.02)"/><circle cx="40" cy="80" r="1" fill="rgba(255,255,255,0.03)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                pointer-events: none;
            }
            
            .avatar-preview-section {
                text-align: center;
                margin-bottom: 35px;
                position: relative;
                z-index: 1;
            }
            
            .preview-container {
                display: inline-block;
                margin-bottom: 25px;
                transition: transform 0.4s ease;
            }
            
            .preview-container:hover {
                transform: scale(1.05) rotate(1deg);
            }
            
            .photo-avatar {
                position: relative;
                border-radius: 50%;
                overflow: hidden;
                border: 4px solid rgba(255,255,255,0.4);
                box-shadow: 0 20px 60px rgba(0,0,0,0.4);
            }
            
            .photo-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.6);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .photo-avatar:hover .photo-overlay {
                opacity: 1;
            }
            
            .remove-photo-btn {
                background: #E74C3C;
                color: white;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
            }
            
            .remove-photo-btn:hover {
                background: #C0392B;
                transform: scale(1.1);
            }
            
            .placeholder-avatar {
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 4px solid rgba(255,255,255,0.4);
                box-shadow: 0 20px 60px rgba(0,0,0,0.4);
                position: relative;
                overflow: hidden;
            }
            
            .placeholder-avatar::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
            }
            
            .placeholder-content {
                text-align: center;
                position: relative;
                z-index: 1;
            }
            
            .placeholder-emoji {
                margin-bottom: 8px;
            }
            
            .placeholder-initials {
                color: white;
                font-weight: 900;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                font-family: 'Segoe UI', sans-serif;
            }
            
            .avatar-info h3 {
                margin: 0 0 8px 0;
                font-size: 22px;
                font-weight: 800;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            }
            
            .avatar-info p {
                margin: 0;
                font-size: 16px;
                opacity: 0.9;
                font-weight: 500;
            }
            
            .upload-section {
                margin-bottom: 30px;
                position: relative;
                z-index: 1;
            }
            
            .upload-area {
                border: 3px dashed rgba(255,255,255,0.5);
                border-radius: 20px;
                padding: 50px 30px;
                text-align: center;
                cursor: pointer;
                transition: all 0.4s ease;
                background: rgba(255,255,255,0.08);
                backdrop-filter: blur(15px);
                position: relative;
                overflow: hidden;
            }
            
            .upload-area::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%);
                transform: translateX(-100%);
                transition: transform 0.6s ease;
            }
            
            .upload-area:hover::before {
                transform: translateX(100%);
            }
            
            .upload-area:hover {
                border-color: rgba(255,255,255,0.8);
                background: rgba(255,255,255,0.15);
                transform: translateY(-3px);
                box-shadow: 0 15px 50px rgba(0,0,0,0.3);
            }
            
            .upload-area.dragging {
                border-color: #F39C12;
                background: rgba(243, 156, 18, 0.2);
                transform: scale(1.02);
                box-shadow: 0 20px 60px rgba(243, 156, 18, 0.4);
            }
            
            .upload-area.has-photo {
                border-style: solid;
                background: rgba(255,255,255,0.12);
            }
            
            .upload-content {
                position: relative;
                z-index: 1;
            }
            
            .upload-icon {
                font-size: 60px;
                margin-bottom: 20px;
                display: block;
                filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
            }
            
            .upload-title {
                font-size: 20px;
                font-weight: 800;
                margin-bottom: 12px;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            }
            
            .upload-subtitle {
                font-size: 16px;
                margin-bottom: 15px;
                opacity: 0.9;
                font-weight: 600;
            }
            
            .upload-specs {
                font-size: 14px;
                opacity: 0.7;
                font-weight: 500;
                background: rgba(255,255,255,0.1);
                padding: 8px 16px;
                border-radius: 20px;
                display: inline-block;
            }
            
            .actions-section {
                display: flex;
                gap: 15px;
                position: relative;
                z-index: 1;
            }
            
            .action-btn {
                flex: 1;
                padding: 18px 25px;
                border: 3px solid rgba(255,255,255,0.4);
                background: rgba(255,255,255,0.15);
                color: white;
                border-radius: 15px;
                cursor: pointer;
                font-weight: 800;
                font-size: 15px;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                position: relative;
                overflow: hidden;
            }
            
            .action-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
                transform: translateX(-100%);
                transition: transform 0.5s ease;
            }
            
            .action-btn:hover::before {
                transform: translateX(100%);
            }
            
            .action-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 12px 40px rgba(255,255,255,0.25);
                background: rgba(255,255,255,0.25);
            }
            
            .action-btn.primary {
                background: linear-gradient(135deg, #F39C12, #E67E22);
                border-color: #F39C12;
                box-shadow: 0 10px 35px rgba(243, 156, 18, 0.5);
            }
            
            .action-btn.primary:hover {
                box-shadow: 0 15px 50px rgba(243, 156, 18, 0.7);
                transform: translateY(-4px);
            }
            
            .action-btn.secondary {
                background: rgba(52, 152, 219, 0.3);
                border-color: #3498DB;
            }
            
            .action-btn.secondary:hover {
                background: rgba(52, 152, 219, 0.5);
                box-shadow: 0 12px 40px rgba(52, 152, 219, 0.4);
            }
            
            .loading-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.8);
                backdrop-filter: blur(10px);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                border-radius: 25px;
            }
            
            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 4px solid rgba(255,255,255,0.3);
                border-top: 4px solid #F39C12;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
            }
            
            .loading-text {
                font-size: 16px;
                font-weight: 600;
                color: white;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            @media (max-width: 600px) {
                .photo-avatar-ui {
                    padding: 30px 20px;
                    margin: 15px;
                }
                
                .upload-area {
                    padding: 40px 20px;
                }
                
                .upload-icon {
                    font-size: 50px;
                }
                
                .actions-section {
                    flex-direction: column;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
}

// === SISTEMA PRINCIPALE ===
class PhotoAvatarSystem {
    static init(userId, userName = '') {
        console.log('📸 Sistema Avatar Foto inizializzato per:', userId);
        const manager = new PhotoAvatarManager(userId, userName);
        
        // Esposizione globale per facilitare l'uso
        window.photoAvatarManager = manager;
        
        return manager;
    }
    
    static createUI(containerId, manager) {
        console.log('🎭 Creazione UI Avatar Foto per container:', containerId);
        const ui = new PhotoAvatarUI(containerId, manager);
        
        // Esposizione globale per facilitare l'uso
        window.photoAvatarUI = ui;
        
        return ui;
    }
}

// === ESPOSIZIONE GLOBALE ===
window.PhotoAvatarSystem = PhotoAvatarSystem;
window.PhotoAvatarManager = PhotoAvatarManager;
window.PhotoAvatarUI = PhotoAvatarUI;

console.log('✅ Sistema Avatar Solo Foto caricato - SEMPLICE E FUNZIONALE!');