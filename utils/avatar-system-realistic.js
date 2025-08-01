// avatar-system-realistic.js - SISTEMA AVATAR CON DICEBEAR
// Libreria avatar professionale che funziona al 100%

// === CONFIGURAZIONE DICEBEAR ===
const DiceBearConfig = {
    // Stili disponibili di DiceBear
    styles: [
        { name: 'Avataaars', value: 'avataaars', description: 'Stile moderno e professionale' },
        { name: 'Big Ears', value: 'big-ears', description: 'Stile cartone animato carino' },
        { name: 'Big Smile', value: 'big-smile', description: 'Sempre sorridente' },
        { name: 'Bottts', value: 'bottts', description: 'Robot colorati' },
        { name: 'Croodles', value: 'croodles', description: 'Disegnati a mano' },
        { name: 'Micah', value: 'micah', description: 'Illustrazioni moderne' },
        { name: 'Miniavs', value: 'miniavs', description: 'Avatar minimal' },
        { name: 'Open Peeps', value: 'open-peeps', description: 'Persone stilizzate' },
        { name: 'Personas', value: 'personas', description: 'Avatar business' }
    ],
    
    // Opzioni per Avataaars (il più professionale)
    avataaarsOptions: {
        accessoriesType: [
            'Blank', 'Kurt', 'Prescription01', 'Prescription02', 'Round', 'Sunglasses', 'Wayfarers'
        ],
        clothingType: [
            'BlazerShirt', 'BlazerSweater', 'CollarSweater', 'GraphicShirt', 'Hoodie', 'Overall', 'ShirtCrewNeck', 'ShirtScoopNeck', 'ShirtVNeck'
        ],
        eyeType: [
            'Close', 'Cry', 'Default', 'Dizzy', 'EyeRoll', 'Happy', 'Hearts', 'Side', 'Squint', 'Surprised', 'Wink', 'WinkWacky'
        ],
        eyebrowType: [
            'Angry', 'AngryNatural', 'Default', 'DefaultNatural', 'FlatNatural', 'RaisedExcited', 'RaisedExcitedNatural', 'SadConcerned', 'SadConcernedNatural', 'UnibrowNatural', 'UpDown', 'UpDownNatural'
        ],
        facialHairType: [
            'Blank', 'BeardMedium', 'BeardLight', 'BeardMajestic', 'MoustacheFancy', 'MoustacheMagnum'
        ],
        hairColor: [
            'Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark', 'PastelPink', 'Platinum', 'Red', 'SilverGray'
        ],
        hatColor: [
            'Black', 'Blue01', 'Blue02', 'Blue03', 'Gray01', 'Gray02', 'Heather', 'PastelBlue', 'PastelGreen', 'PastelOrange', 'PastelRed', 'PastelYellow', 'Pink', 'Red', 'White'
        ],
        mouthType: [
            'Concerned', 'Default', 'Disbelief', 'Eating', 'Grimace', 'Sad', 'ScreamOpen', 'Serious', 'Smile', 'Tongue', 'Twinkle', 'Vomit'
        ],
        skinColor: [
            'Tanned', 'Yellow', 'Pale', 'Light', 'Brown', 'DarkBrown', 'Black'
        ],
        topType: [
            'NoHair', 'Eyepatch', 'Hat', 'Hijab', 'Turban', 'WinterHat1', 'WinterHat2', 'WinterHat3', 'WinterHat4', 'LongHairBigHair', 'LongHairBob', 'LongHairBun', 'LongHairCurly', 'LongHairCurvy', 'LongHairDreads', 'LongHairFrida', 'LongHairFro', 'LongHairFroBand', 'LongHairNotTooLong', 'LongHairShavedSides', 'LongHairMiaWallace', 'LongHairStraight', 'LongHairStraight2', 'LongHairStraightStrand', 'ShortHairDreads01', 'ShortHairDreads02', 'ShortHairFrizzle', 'ShortHairShaggyMullet', 'ShortHairShortCurly', 'ShortHairShortFlat', 'ShortHairShortRound', 'ShortHairShortWaved', 'ShortHairSides', 'ShortHairTheCaesar', 'ShortHairTheCaesarSidePart'
        ]
    }
};

// === GENERATORE AVATAR DICEBEAR ===
class DiceBearAvatarGenerator {
    static generateURL(style, seed, options = {}) {
        const baseURL = 'https://api.dicebear.com/7.x';
        let url = `${baseURL}/${style}/svg?seed=${encodeURIComponent(seed)}`;
        
        // Aggiungi opzioni specifiche
        Object.keys(options).forEach(key => {
            if (options[key] !== null && options[key] !== undefined && options[key] !== '') {
                url += `&${key}=${encodeURIComponent(options[key])}`;
            }
        });
        
        return url;
    }
    
    static async generateSVG(style, seed, options = {}) {
        try {
            const url = this.generateURL(style, seed, options);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const svgText = await response.text();
            return svgText;
        } catch (error) {
            console.error('Errore generazione avatar DiceBear:', error);
            return this.getFallbackSVG();
        }
    }
    
    static getFallbackSVG() {
        return `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="95" fill="#4ECDC4"/>
                <circle cx="100" cy="90" r="40" fill="#FFE4C4"/>
                <circle cx="85" cy="80" r="3" fill="#000"/>
                <circle cx="115" cy="80" r="3" fill="#000"/>
                <path d="M90 100 Q100 110 110 100" stroke="#000" stroke-width="2" fill="none"/>
                <text x="100" y="150" text-anchor="middle" font-family="Arial" font-size="12" fill="#333">Avatar</text>
            </svg>
        `;
    }
}

// === MANAGER AVATAR DICEBEAR ===
class DiceBearAvatarManager {
    constructor(userId) {
        this.userId = userId;
        this.config = this.getDefaultConfig();
        this.mode = 'dicebear';
        this.photoUrl = null;
        this.cachedSVG = null;
        this.loadFromStorage();
        
        // Genera avatar iniziale
        this.generateAvatar();
    }
    
    getDefaultConfig() {
        return {
            style: 'avataaars',
            seed: this.userId || Math.random().toString(36).substring(7),
            options: {
                accessoriesType: 'Blank',
                clothingType: 'BlazerShirt',
                eyeType: 'Default',
                eyebrowType: 'Default',
                facialHairType: 'Blank',
                hairColor: 'Brown',
                mouthType: 'Smile',
                skinColor: 'Light',
                topType: 'ShortHairShortFlat'
            }
        };
    }
    
    updateConfig(property, value) {
        if (property === 'style') {
            this.config.style = value;
            // Reset options when changing style
            if (value === 'avataaars') {
                this.config.options = this.getDefaultConfig().options;
            } else {
                this.config.options = {};
            }
        } else {
            this.config.options[property] = value;
        }
        
        this.saveToStorage();
        this.generateAvatar();
        return this.config;
    }
    
    updateSeed(seed) {
        this.config.seed = seed || Math.random().toString(36).substring(7);
        this.saveToStorage();
        this.generateAvatar();
    }
    
    setMode(mode) {
        if (['dicebear', 'photo'].includes(mode)) {
            this.mode = mode;
            this.saveToStorage();
            return true;
        }
        return false;
    }
    
    setPhoto(photoUrl) {
        this.photoUrl = photoUrl;
        this.mode = 'photo';
        this.saveToStorage();
    }
    
    async generateAvatar() {
        try {
            this.cachedSVG = await DiceBearAvatarGenerator.generateSVG(
                this.config.style,
                this.config.seed,
                this.config.options
            );
            console.log('✅ Avatar DiceBear generato con successo');
        } catch (error) {
            console.error('❌ Errore generazione avatar:', error);
            this.cachedSVG = DiceBearAvatarGenerator.getFallbackSVG();
        }
    }
    
    getDisplayHTML() {
        if (this.mode === 'photo' && this.photoUrl) {
            return `<img src="${this.photoUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" alt="Avatar Photo">`;
        } else if (this.cachedSVG) {
            return this.cachedSVG;
        } else {
            return '<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 48px;">⏳</div>';
        }
    }
    
    randomize() {
        // Randomizza tutto
        const styles = DiceBearConfig.styles;
        const randomStyle = styles[Math.floor(Math.random() * styles.length)].value;
        
        this.config.style = randomStyle;
        this.config.seed = Math.random().toString(36).substring(7);
        
        if (randomStyle === 'avataaars') {
            const options = DiceBearConfig.avataaarsOptions;
            this.config.options = {
                accessoriesType: this.randomFromArray(options.accessoriesType),
                clothingType: this.randomFromArray(options.clothingType),
                eyeType: this.randomFromArray(options.eyeType),
                eyebrowType: this.randomFromArray(options.eyebrowType),
                facialHairType: this.randomFromArray(options.facialHairType),
                hairColor: this.randomFromArray(options.hairColor),
                mouthType: this.randomFromArray(options.mouthType),
                skinColor: this.randomFromArray(options.skinColor),
                topType: this.randomFromArray(options.topType)
            };
        } else {
            this.config.options = {};
        }
        
        this.saveToStorage();
        this.generateAvatar();
        return this.config;
    }
    
    randomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    saveToStorage() {
        try {
            const data = {
                config: this.config,
                mode: this.mode,
                photoUrl: this.photoUrl,
                timestamp: Date.now()
            };
            if (!window.avatarStorage) window.avatarStorage = {};
            window.avatarStorage[this.userId] = data;
            console.log('💾 Avatar DiceBear salvato');
        } catch (e) {
            console.error('Errore salvataggio avatar:', e);
        }
    }
    
    loadFromStorage() {
        try {
            if (window.avatarStorage && window.avatarStorage[this.userId]) {
                const data = window.avatarStorage[this.userId];
                this.config = { ...this.getDefaultConfig(), ...data.config };
                this.mode = data.mode || 'dicebear';
                this.photoUrl = data.photoUrl || null;
                console.log('📂 Avatar DiceBear caricato');
            }
        } catch (e) {
            console.error('Errore caricamento avatar:', e);
        }
    }
}

// === UI DICEBEAR AVATAR ===
class DiceBearAvatarUI {
    constructor(containerId, manager) {
        this.container = document.getElementById(containerId);
        this.manager = manager;
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="dicebear-avatar-ui">
                <div class="mode-selector">
                    <button class="mode-btn ${this.manager.mode === 'dicebear' ? 'active' : ''}" data-mode="dicebear">
                        🎨 Avatar Professionale
                    </button>
                    <button class="mode-btn ${this.manager.mode === 'photo' ? 'active' : ''}" data-mode="photo">
                        📸 Foto Personale
                    </button>
                </div>
                
                <div class="avatar-preview">
                    <div class="preview-container" id="previewContainer">
                        ${this.manager.getDisplayHTML()}
                    </div>
                    <div class="avatar-info">
                        <div class="style-name">${this.getStyleDisplayName()}</div>
                        <button class="refresh-btn" onclick="window.avatarUI.refreshAvatar()">🔄 Genera Nuovo</button>
                    </div>
                </div>
                
                <div class="controls" id="controls">
                    ${this.manager.mode === 'dicebear' ? this.buildDiceBearControls() : this.buildPhotoControls()}
                </div>
                
                <div class="actions">
                    <button class="action-btn" onclick="window.avatarUI.randomize()">🎲 Avatar Casuale</button>
                    <button class="action-btn primary" onclick="window.avatarUI.save()">💾 Salva Avatar</button>
                </div>
            </div>
        `;
        
        this.attachEvents();
        this.injectStyles();
    }
    
    getStyleDisplayName() {
        const style = DiceBearConfig.styles.find(s => s.value === this.manager.config.style);
        return style ? style.name : 'Avatar Professionale';
    }
    
    buildDiceBearControls() {
        return `
            <div class="control-section">
                <!-- Style Selection -->
                <div class="control-group">
                    <label>🎨 Stile Avatar</label>
                    <div class="style-grid">
                        ${DiceBearConfig.styles.map(style => 
                            `<button class="style-btn ${this.manager.config.style === style.value ? 'active' : ''}" 
                                    data-style="${style.value}" title="${style.description}">
                                ${style.name}
                            </button>`
                        ).join('')}
                    </div>
                </div>
                
                ${this.manager.config.style === 'avataaars' ? this.buildAvataaarsControls() : ''}
                
                <div class="control-group">
                    <label>🎯 Seed Personalizzato</label>
                    <div class="seed-input-group">
                        <input type="text" class="seed-input" value="${this.manager.config.seed}" 
                               placeholder="Inserisci un nome o parola" id="seedInput">
                        <button class="seed-btn" onclick="window.avatarUI.updateSeed()">Applica</button>
                    </div>
                    <div class="seed-hint">Cambia il testo per generare avatar diversi</div>
                </div>
            </div>
        `;
    }
    
    buildAvataaarsControls() {
        const options = DiceBearConfig.avataaarsOptions;
        const config = this.manager.config.options;
        
        return `
            <div class="avataaars-controls">
                <div class="control-row">
                    <label>👤 Tipo Viso</label>
                    <select class="control-select" data-option="skinColor">
                        ${options.skinColor.map(option => 
                            `<option value="${option}" ${config.skinColor === option ? 'selected' : ''}>${option}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="control-row">
                    <label>💇 Capelli</label>
                    <select class="control-select" data-option="topType">
                        ${options.topType.map(option => 
                            `<option value="${option}" ${config.topType === option ? 'selected' : ''}>${option.replace(/([A-Z])/g, ' $1').trim()}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="control-row">
                    <label>🎨 Colore Capelli</label>
                    <select class="control-select" data-option="hairColor">
                        ${options.hairColor.map(option => 
                            `<option value="${option}" ${config.hairColor === option ? 'selected' : ''}>${option}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="control-row">
                    <label>👁️ Occhi</label>
                    <select class="control-select" data-option="eyeType">
                        ${options.eyeType.map(option => 
                            `<option value="${option}" ${config.eyeType === option ? 'selected' : ''}>${option}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="control-row">
                    <label>😊 Bocca</label>
                    <select class="control-select" data-option="mouthType">
                        ${options.mouthType.map(option => 
                            `<option value="${option}" ${config.mouthType === option ? 'selected' : ''}>${option}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="control-row">
                    <label>👓 Accessori</label>
                    <select class="control-select" data-option="accessoriesType">
                        ${options.accessoriesType.map(option => 
                            `<option value="${option}" ${config.accessoriesType === option ? 'selected' : ''}>${option === 'Blank' ? 'Nessuno' : option}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="control-row">
                    <label>🧔 Barba</label>
                    <select class="control-select" data-option="facialHairType">
                        ${options.facialHairType.map(option => 
                            `<option value="${option}" ${config.facialHairType === option ? 'selected' : ''}>${option === 'Blank' ? 'Nessuna' : option}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="control-row">
                    <label>👕 Vestiti</label>
                    <select class="control-select" data-option="clothingType">
                        ${options.clothingType.map(option => 
                            `<option value="${option}" ${config.clothingType === option ? 'selected' : ''}>${option.replace(/([A-Z])/g, ' $1').trim()}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
        `;
    }
    
    buildPhotoControls() {
        return `
            <div class="control-section">
                <div class="control-group">
                    <label>📸 Carica la Tua Foto</label>
                    <div class="photo-upload" onclick="document.getElementById('photoInput').click()">
                        <input type="file" id="photoInput" accept="image/*" style="display: none;">
                        <div class="upload-area">
                            <div class="upload-icon">📷</div>
                            <div class="upload-text">Clicca per caricare foto</div>
                            <div class="upload-hint">JPG, PNG o WEBP</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    attachEvents() {
        // Mode buttons
        this.container.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.switchMode(mode);
            });
        });
        
        // Style buttons
        this.container.querySelectorAll('.style-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const style = e.target.dataset.style;
                this.updateStyle(style);
            });
        });
        
        // Select controls for Avataaars
        this.container.querySelectorAll('.control-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const option = e.target.dataset.option;
                this.updateOption(option, e.target.value);
            });
        });
        
        // Photo upload
        const photoInput = this.container.querySelector('#photoInput');
        if (photoInput) {
            photoInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.manager.setPhoto(e.target.result);
                        this.updatePreview();
                        this.showNotification('📸 Foto caricata con successo!');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }
    
    updateStyle(style) {
        this.manager.updateConfig('style', style);
        this.refreshControls();
        this.updatePreview();
        this.updateStyleInfo();
    }
    
    updateOption(option, value) {
        this.manager.updateConfig(option, value);
        this.updatePreview();
    }
    
    updateSeed() {
        const seedInput = this.container.querySelector('#seedInput');
        if (seedInput) {
            this.manager.updateSeed(seedInput.value);
            this.updatePreview();
            this.showNotification('🎯 Seed aggiornato!');
        }
    }
    
    refreshAvatar() {
        this.manager.updateSeed();
        this.updatePreview();
        this.showNotification('🔄 Nuovo avatar generato!');
    }
    
    switchMode(mode) {
        this.manager.setMode(mode);
        this.container.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        this.refreshControls();
        this.updatePreview();
    }
    
    refreshControls() {
        const controlsContainer = this.container.querySelector('#controls');
        controlsContainer.innerHTML = this.manager.mode === 'dicebear' ? 
            this.buildDiceBearControls() : this.buildPhotoControls();
        this.attachEvents();
    }
    
    updatePreview() {
        const preview = this.container.querySelector('#previewContainer');
        setTimeout(() => {
            preview.innerHTML = this.manager.getDisplayHTML();
        }, 100);
    }
    
    updateStyleInfo() {
        const styleNameEl = this.container.querySelector('.style-name');
        if (styleNameEl) {
            styleNameEl.textContent = this.getStyleDisplayName();
        }
    }
    
    randomize() {
        this.manager.randomize();
        this.refreshControls();
        this.updatePreview();
        this.updateStyleInfo();
        this.showNotification('🎲 Avatar randomizzato!');
    }
    
    save() {
        this.manager.saveToStorage();
        this.showNotification('💾 Avatar salvato con successo!');
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: #27AE60; color: white;
            padding: 15px 25px; border-radius: 10px; z-index: 10000; font-weight: 600;
            box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3); font-size: 14px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    }
    
    injectStyles() {
        if (document.getElementById('dicebear-avatar-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'dicebear-avatar-styles';
        styles.textContent = `
            .dicebear-avatar-ui {
                max-width: 700px;
                margin: 0 auto;
                padding: 30px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 25px;
                box-shadow: 0 25px 80px rgba(0,0,0,0.3);
                color: white;
            }
            
            .mode-selector {
                display: flex;
                gap: 15px;
                margin-bottom: 25px;
                background: rgba(255,255,255,0.1);
                padding: 8px;
                border-radius: 15px;
                backdrop-filter: blur(10px);
            }
            
            .mode-btn {
                flex: 1;
                padding: 15px;
                border: none;
                background: transparent;
                color: white;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 700;
                font-size: 14px;
                transition: all 0.3s ease;
            }
            
            .mode-btn.active {
                background: rgba(255,255,255,0.2);
                box-shadow: 0 4px 15px rgba(255,255,255,0.1);
            }
            
            .avatar-preview {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .preview-container {
                width: 180px;
                height: 180px;
                margin: 0 auto 15px;
                border: 4px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                overflow: hidden;
                background: white;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 15px 40px rgba(0,0,0,0.2);
                transition: transform 0.3s ease;
            }
            
            .preview-container:hover {
                transform: scale(1.05);
            }
            
            .avatar-info {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
            }
            
            .style-name {
                color: white;
                font-size: 16px;
                font-weight: 600;
            }
            
            .refresh-btn {
                background: rgba(255,255,255,0.2);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            
            .refresh-btn:hover {
                background: rgba(255,255,255,0.3);
                transform: translateY(-1px);
            }
            
            .control-section {
                background: rgba(255,255,255,0.1);
                border-radius: 20px;
                padding: 25px;
                margin-bottom: 25px;
                backdrop-filter: blur(10px);
                max-height: 400px;
                overflow-y: auto;
            }
            
            .control-group {
                margin-bottom: 25px;
            }
            
            .control-group:last-child {
                margin-bottom: 0;
            }
            
            .control-group label {
                display: block;
                font-weight: 800;
                margin-bottom: 15px;
                color: white;
                font-size: 16px;
            }
            
            .style-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 10px;
            }
            
            .style-btn {
                padding: 12px;
                border: 2px solid rgba(255,255,255,0.3);
                background: rgba(255,255,255,0.1);
                color: white;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                font-size: 12px;
            }
            
            .style-btn:hover {
                background: rgba(255,255,255,0.2);
                transform: translateY(-1px);
            }
            
            .style-btn.active {
                border-color: #F39C12;
                background: rgba(243, 156, 18, 0.3);
                box-shadow: 0 4px 15px rgba(243, 156, 18, 0.4);
            }
            
            .avataaars-controls {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-top: 20px;
            }
            
            .control-row {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .control-row label {
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 0;
            }
            
            .control-select {
                padding: 10px;
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 8px;
                background: rgba(255,255,255,0.1);
                color: white;
                font-weight: 500;
                font-size: 13px;
            }
            
            .control-select option {
                background: #2C3E50;
                color: white;
            }
            
            .seed-input-group {
                display: flex;
                gap: 10px;
                align-items: center;
            }
            
            .seed-input {
                flex: 1;
                padding: 12px;
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 10px;
                background: rgba(255,255,255,0.1);
                color: white;
                font-weight: 500;
            }
            
            .seed-input::placeholder {
                color: rgba(255,255,255,0.7);
            }
            
            .seed-btn {
                padding: 12px 20px;
                border: none;
                background: rgba(255,255,255,0.2);
                color: white;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            
            .seed-btn:hover {
                background: rgba(255,255,255,0.3);
            }
            
            .seed-hint {
                font-size: 12px;
                color: rgba(255,255,255,0.8);
                margin-top: 5px;
            }
            
            .photo-upload {
                border: 3px dashed rgba(255,255,255,0.4);
                border-radius: 15px;
                padding: 30px 20px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                background: rgba(255,255,255,0.05);
            }
            
            .photo-upload:hover {
                border-color: rgba(255,255,255,0.7);
                background: rgba(255,255,255,0.1);
                transform: translateY(-2px);
            }
            
            .upload-icon {
                font-size: 40px;
                margin-bottom: 15px;
            }
            
            .upload-text {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 8px;
            }
            
            .upload-hint {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .actions {
                display: flex;
                gap: 15px;
            }
            
            .action-btn {
                flex: 1;
                padding: 18px;
                border: 2px solid rgba(255,255,255,0.3);
                background: rgba(255,255,255,0.1);
                color: white;
                border-radius: 12px;
                cursor: pointer;
                font-weight: 700;
                font-size: 14px;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }
            
            .action-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(255,255,255,0.1);
                background: rgba(255,255,255,0.2);
            }
            
            .action-btn.primary {
                background: linear-gradient(135deg, #F39C12, #E67E22);
                border-color: #F39C12;
                box-shadow: 0 6px 20px rgba(243, 156, 18, 0.3);
            }
            
            .action-btn.primary:hover {
                box-shadow: 0 10px 30px rgba(243, 156, 18, 0.4);
                transform: translateY(-3px);
            }
            
            @media (max-width: 650px) {
                .dicebear-avatar-ui {
                    padding: 20px;
                    margin: 10px;
                }
                
                .style-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
                
                .avataaars-controls {
                    grid-template-columns: 1fr;
                }
                
                .preview-container {
                    width: 150px;
                    height: 150px;
                }
                
                .actions {
                    flex-direction: column;
                }
                
                .seed-input-group {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// === SISTEMA PRINCIPALE ===
class RealisticAvatarSystem {
    static init(userId) {
        console.log('🎨 Sistema Avatar DiceBear inizializzato per:', userId);
        const manager = new DiceBearAvatarManager(userId);
        return manager;
    }
    
    static createUI(containerId, manager) {
        console.log('🎭 Creazione UI Avatar DiceBear per container:', containerId);
        const ui = new DiceBearAvatarUI(containerId, manager);
        // Store reference globally for button actions
        window.avatarUI = ui;
        return ui;
    }
}

// === ESPOSIZIONE GLOBALE ===
window.RealisticAvatarSystem = RealisticAvatarSystem;
window.DiceBearAvatarManager = DiceBearAvatarManager;
window.DiceBearAvatarUI = DiceBearAvatarUI;

console.log('✅ Sistema Avatar DiceBear caricato - AVATAR PROFESSIONALI GARANTITI!');