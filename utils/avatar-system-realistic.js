// avatar-system-realistic.js - GALLERIA AVATAR PREIMPOSTATI
// Sistema con avatar fotografici già pronti - ZERO GENERAZIONE FALLIMENTARE

// === GALLERIA AVATAR REALISTICI ===
const AvatarGallery = {
    // Avatar Maschili
    male: [
        {
            id: 'male_1',
            name: 'Marco - Professionale',
            emoji: '👨‍💼',
            svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="skin1" cx="0.4" cy="0.3" r="0.8">
                        <stop offset="0%" stop-color="#FFE4C4"/>
                        <stop offset="100%" stop-color="#DEB887"/>
                    </radialGradient>
                    <linearGradient id="hair1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#8B4513"/>
                        <stop offset="100%" stop-color="#654321"/>
                    </linearGradient>
                </defs>
                <!-- Background -->
                <circle cx="100" cy="100" r="95" fill="#f8f9fa"/>
                <!-- Face -->
                <ellipse cx="100" cy="120" rx="45" ry="55" fill="url(#skin1)"/>
                <!-- Hair -->
                <path d="M55 85 Q100 50 145 85 L140 110 Q100 70 60 110 Z" fill="url(#hair1)"/>
                <!-- Eyes -->
                <ellipse cx="85" cy="105" rx="8" ry="6" fill="white"/>
                <ellipse cx="115" cy="105" rx="8" ry="6" fill="white"/>
                <circle cx="85" cy="105" r="4" fill="#4682B4"/>
                <circle cx="115" cy="105" r="4" fill="#4682B4"/>
                <circle cx="85" cy="105" r="2" fill="#000"/>
                <circle cx="115" cy="105" r="2" fill="#000"/>
                <!-- Eyebrows -->
                <path d="M77 98 Q85 95 93 98" stroke="#654321" stroke-width="3" fill="none"/>
                <path d="M107 98 Q115 95 123 98" stroke="#654321" stroke-width="3" fill="none"/>
                <!-- Nose -->
                <ellipse cx="100" cy="115" rx="3" ry="6" fill="#DDB887" opacity="0.7"/>
                <!-- Mouth -->
                <path d="M92 130 Q100 135 108 130" stroke="#CD5C5C" stroke-width="3" fill="none"/>
            </svg>`
        },
        {
            id: 'male_2',
            name: 'Alessandro - Sportivo',
            emoji: '🏃‍♂️',
            svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="skin2" cx="0.4" cy="0.3" r="0.8">
                        <stop offset="0%" stop-color="#F4C2A1"/>
                        <stop offset="100%" stop-color="#D2B48C"/>
                    </radialGradient>
                    <linearGradient id="hair2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#2F1B14"/>
                        <stop offset="100%" stop-color="#1A0F0A"/>
                    </linearGradient>
                </defs>
                <!-- Background -->
                <circle cx="100" cy="100" r="95" fill="#f8f9fa"/>
                <!-- Face -->
                <ellipse cx="100" cy="118" rx="42" ry="52" fill="url(#skin2)"/>
                <!-- Hair -->
                <path d="M58 88 Q100 55 142 88 L138 105 Q100 75 62 105 Z" fill="url(#hair2)"/>
                <!-- Eyes -->
                <ellipse cx="87" cy="108" rx="9" ry="7" fill="white"/>
                <ellipse cx="113" cy="108" rx="9" ry="7" fill="white"/>
                <circle cx="87" cy="108" r="4.5" fill="#228B22"/>
                <circle cx="113" cy="108" r="4.5" fill="#228B22"/>
                <circle cx="87" cy="108" r="2.5" fill="#000"/>
                <circle cx="113" cy="108" r="2.5" fill="#000"/>
                <!-- Eyebrows -->
                <path d="M78 100 Q87 97 96 100" stroke="#1A0F0A" stroke-width="3.5" fill="none"/>
                <path d="M104 100 Q113 97 122 100" stroke="#1A0F0A" stroke-width="3.5" fill="none"/>
                <!-- Nose -->
                <ellipse cx="100" cy="118" rx="3.5" ry="7" fill="#C8A882" opacity="0.8"/>
                <!-- Mouth -->
                <path d="M90 133 Q100 140 110 133" stroke="#CD5C5C" stroke-width="4" fill="none"/>
                <!-- Jawline -->
                <path d="M70 140 Q100 155 130 140" stroke="#C8A882" stroke-width="2" fill="none" opacity="0.5"/>
            </svg>`
        },
        {
            id: 'male_3',
            name: 'Luca - Creativo',
            emoji: '🎨',
            svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="skin3" cx="0.4" cy="0.3" r="0.8">
                        <stop offset="0%" stop-color="#FDBCB4"/>
                        <stop offset="100%" stop-color="#E8A584"/>
                    </radialGradient>
                    <linearGradient id="hair3" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#B8860B"/>
                        <stop offset="100%" stop-color="#996600"/>
                    </linearGradient>
                </defs>
                <!-- Background -->
                <circle cx="100" cy="100" r="95" fill="#f8f9fa"/>
                <!-- Face -->
                <ellipse cx="100" cy="115" rx="40" ry="50" fill="url(#skin3)"/>
                <!-- Hair -->
                <path d="M60 85 Q100 45 140 85 L135 115 Q100 75 65 115 Z" fill="url(#hair3)"/>
                <!-- Eyes -->
                <ellipse cx="88" cy="110" rx="10" ry="8" fill="white"/>
                <ellipse cx="112" cy="110" rx="10" ry="8" fill="white"/>
                <circle cx="88" cy="110" r="5" fill="#8B4513"/>
                <circle cx="112" cy="110" r="5" fill="#8B4513"/>
                <circle cx="88" cy="110" r="3" fill="#000"/>
                <circle cx="112" cy="110" r="3" fill="#000"/>
                <!-- Eyebrows -->
                <path d="M78 102 Q88 98 98 102" stroke="#996600" stroke-width="3" fill="none"/>
                <path d="M102 102 Q112 98 122 102" stroke="#996600" stroke-width="3" fill="none"/>
                <!-- Nose -->
                <ellipse cx="100" cy="120" rx="4" ry="8" fill="#D49A6A" opacity="0.6"/>
                <!-- Mouth -->
                <path d="M88 135 Q100 142 112 135" stroke="#FF69B4" stroke-width="3.5" fill="none"/>
                <!-- Beard -->
                <ellipse cx="100" cy="145" rx="15" ry="8" fill="#996600" opacity="0.7"/>
            </svg>`
        }
    ],
    
    // Avatar Femminili
    female: [
        {
            id: 'female_1',
            name: 'Sofia - Elegante',
            emoji: '👩‍💼',
            svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="skin4" cx="0.4" cy="0.3" r="0.8">
                        <stop offset="0%" stop-color="#FFE4E1"/>
                        <stop offset="100%" stop-color="#F5DEB3"/>
                    </radialGradient>
                    <linearGradient id="hair4" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#654321"/>
                        <stop offset="100%" stop-color="#4A2C17"/>
                    </linearGradient>
                </defs>
                <!-- Background -->
                <circle cx="100" cy="100" r="95" fill="#f8f9fa"/>
                <!-- Face -->
                <ellipse cx="100" cy="118" rx="38" ry="48" fill="url(#skin4)"/>
                <!-- Hair -->
                <path d="M55 80 Q100 45 145 80 L150 125 Q100 85 50 125 Z" fill="url(#hair4)"/>
                <!-- Eyes -->
                <ellipse cx="87" cy="108" rx="9" ry="7" fill="white"/>
                <ellipse cx="113" cy="108" rx="9" ry="7" fill="white"/>
                <circle cx="87" cy="108" r="4" fill="#4169E1"/>
                <circle cx="113" cy="108" r="4" fill="#4169E1"/>
                <circle cx="87" cy="108" r="2" fill="#000"/>
                <circle cx="113" cy="108" r="2" fill="#000"/>
                <!-- Eyelashes -->
                <path d="M78 104 Q87 102 96 104" stroke="#000" stroke-width="1.5" fill="none"/>
                <path d="M104 104 Q113 102 122 104" stroke="#000" stroke-width="1.5" fill="none"/>
                <!-- Eyebrows -->
                <path d="M79 100 Q87 97 95 100" stroke="#4A2C17" stroke-width="2.5" fill="none"/>
                <path d="M105 100 Q113 97 121 100" stroke="#4A2C17" stroke-width="2.5" fill="none"/>
                <!-- Nose -->
                <ellipse cx="100" cy="118" rx="2.5" ry="5" fill="#E6D3B7" opacity="0.6"/>
                <!-- Mouth -->
                <ellipse cx="100" cy="132" rx="8" ry="4" fill="#FF1493"/>
                <ellipse cx="100" cy="131" rx="6" ry="2" fill="#FFB6C1"/>
                <!-- Cheeks -->
                <ellipse cx="75" cy="120" rx="8" ry="6" fill="#FFB6C1" opacity="0.4"/>
                <ellipse cx="125" cy="120" rx="8" ry="6" fill="#FFB6C1" opacity="0.4"/>
            </svg>`
        },
        {
            id: 'female_2',
            name: 'Giulia - Dolce',
            emoji: '🌸',
            svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="skin5" cx="0.4" cy="0.3" r="0.8">
                        <stop offset="0%" stop-color="#FFEEE6"/>
                        <stop offset="100%" stop-color="#F0D0A0"/>
                    </radialGradient>
                    <linearGradient id="hair5" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#DAA520"/>
                        <stop offset="100%" stop-color="#B8860B"/>
                    </linearGradient>
                </defs>
                <!-- Background -->
                <circle cx="100" cy="100" r="95" fill="#f8f9fa"/>
                <!-- Face -->
                <ellipse cx="100" cy="115" rx="36" ry="46" fill="url(#skin5)"/>
                <!-- Hair -->
                <path d="M50 75 Q100 40 150 75 L155 120 Q100 80 45 120 Z" fill="url(#hair5)"/>
                <!-- Hair sides -->
                <ellipse cx="65" cy="100" rx="12" ry="25" fill="url(#hair5)"/>
                <ellipse cx="135" cy="100" rx="12" ry="25" fill="url(#hair5)"/>
                <!-- Eyes -->
                <ellipse cx="88" cy="110" rx="8" ry="6" fill="white"/>
                <ellipse cx="112" cy="110" rx="8" ry="6" fill="white"/>
                <circle cx="88" cy="110" r="3.5" fill="#32CD32"/>
                <circle cx="112" cy="110" r="3.5" fill="#32CD32"/>
                <circle cx="88" cy="110" r="2" fill="#000"/>
                <circle cx="112" cy="110" r="2" fill="#000"/>
                <!-- Eyebrows -->
                <path d="M80 103 Q88 100 96 103" stroke="#B8860B" stroke-width="2" fill="none"/>
                <path d="M104 103 Q112 100 120 103" stroke="#B8860B" stroke-width="2" fill="none"/>
                <!-- Nose -->
                <ellipse cx="100" cy="118" rx="2" ry="4" fill="#E6C078" opacity="0.5"/>
                <!-- Mouth -->
                <path d="M92 128 Q100 134 108 128" stroke="#FF69B4" stroke-width="3" fill="none"/>
                <!-- Dimples -->
                <ellipse cx="82" cy="125" rx="3" ry="2" fill="#E6C078" opacity="0.3"/>
                <ellipse cx="118" cy="125" rx="3" ry="2" fill="#E6C078" opacity="0.3"/>
            </svg>`
        },
        {
            id: 'female_3',
            name: 'Martina - Moderna',
            emoji: '💄',
            svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="skin6" cx="0.4" cy="0.3" r="0.8">
                        <stop offset="0%" stop-color="#F7E7CE"/>
                        <stop offset="100%" stop-color="#DEB887"/>
                    </radialGradient>
                    <linearGradient id="hair6" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#2F1B14"/>
                        <stop offset="100%" stop-color="#1C1C1C"/>
                    </linearGradient>
                </defs>
                <!-- Background -->
                <circle cx="100" cy="100" r="95" fill="#f8f9fa"/>
                <!-- Face -->
                <ellipse cx="100" cy="120" rx="40" ry="50" fill="url(#skin6)"/>
                <!-- Hair -->
                <path d="M60 85 Q100 50 140 85 L135 100 Q100 70 65 100 Z" fill="url(#hair6)"/>
                <!-- Eyes -->
                <ellipse cx="85" cy="112" rx="10" ry="8" fill="white"/>
                <ellipse cx="115" cy="112" rx="10" ry="8" fill="white"/>
                <circle cx="85" cy="112" r="5" fill="#800080"/>
                <circle cx="115" cy="112" r="5" fill="#800080"/>
                <circle cx="85" cy="112" r="3" fill="#000"/>
                <circle cx="115" cy="112" r="3" fill="#000"/>
                <!-- Eye makeup -->
                <path d="M75 108 Q85 105 95 108" stroke="#4B0082" stroke-width="2" fill="none"/>
                <path d="M105 108 Q115 105 125 108" stroke="#4B0082" stroke-width="2" fill="none"/>
                <!-- Eyebrows -->
                <path d="M76 104 Q85 101 94 104" stroke="#1C1C1C" stroke-width="3" fill="none"/>
                <path d="M106 104 Q115 101 124 104" stroke="#1C1C1C" stroke-width="3" fill="none"/>
                <!-- Nose -->
                <ellipse cx="100" cy="122" rx="3" ry="6" fill="#D49A6A" opacity="0.7"/>
                <!-- Mouth -->
                <ellipse cx="100" cy="138" rx="10" ry="5" fill="#DC143C"/>
                <ellipse cx="100" cy="137" rx="8" ry="3" fill="#FF69B4"/>
                <!-- Contouring -->
                <path d="M70 125 Q85 135 100 125" stroke="#D49A6A" stroke-width="1" fill="none" opacity="0.4"/>
                <path d="M100 125 Q115 135 130 125" stroke="#D49A6A" stroke-width="1" fill="none" opacity="0.4"/>
            </svg>`
        }
    ]
};

// === PERSONALIZZAZIONI DISPONIBILI ===
const CustomizationOptions = {
    skinTones: [
        { name: 'Molto Chiara', color: '#FFEEE6' },
        { name: 'Chiara', color: '#F7E7CE' },
        { name: 'Media Chiara', color: '#F4C2A1' },
        { name: 'Media', color: '#DEB887' },
        { name: 'Media Scura', color: '#D2B48C' },
        { name: 'Scura', color: '#C8A882' },
        { name: 'Molto Scura', color: '#8B5A3C' }
    ],
    
    hairColors: [
        { name: 'Nero', color: '#1C1C1C' },
        { name: 'Castano Scuro', color: '#4A2C17' },
        { name: 'Castano', color: '#654321' },
        { name: 'Castano Chiaro', color: '#996600' },
        { name: 'Biondo Scuro', color: '#B8860B' },
        { name: 'Biondo', color: '#DAA520' },
        { name: 'Biondo Chiaro', color: '#F4A460' },
        { name: 'Rosso', color: '#B22222' },
        { name: 'Grigio', color: '#808080' }
    ],
    
    eyeColors: [
        { name: 'Marroni', color: '#8B4513' },
        { name: 'Azzurri', color: '#4169E1' },
        { name: 'Verdi', color: '#228B22' },
        { name: 'Nocciola', color: '#CD853F' },
        { name: 'Grigi', color: '#708090' },
        { name: 'Viola', color: '#800080' }
    ]
};

// === MANAGER GALLERIA AVATAR ===
class AvatarGalleryManager {
    constructor(userId) {
        this.userId = userId;
        this.selectedAvatar = null;
        this.customizations = {};
        this.mode = 'gallery';
        this.photoUrl = null;
        this.loadFromStorage();
        
        // Set default avatar if none selected
        if (!this.selectedAvatar) {
            this.selectedAvatar = AvatarGallery.male[0];
        }
    }
    
    selectAvatar(avatarId) {
        const allAvatars = [...AvatarGallery.male, ...AvatarGallery.female];
        this.selectedAvatar = allAvatars.find(av => av.id === avatarId);
        this.customizations = {}; // Reset customizations
        this.saveToStorage();
        return this.selectedAvatar;
    }
    
    updateCustomization(property, colorIndex) {
        this.customizations[property] = colorIndex;
        this.saveToStorage();
        return this.customizations;
    }
    
    setMode(mode) {
        if (['gallery', 'photo'].includes(mode)) {
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
    
    getDisplayHTML() {
        if (this.mode === 'photo' && this.photoUrl) {
            return `<img src="${this.photoUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" alt="Avatar Photo">`;
        } else if (this.selectedAvatar) {
            return this.getCustomizedSVG();
        }
        return '<div style="font-size: 48px;">👤</div>';
    }
    
    getCustomizedSVG() {
        if (!this.selectedAvatar) return '';
        
        let svg = this.selectedAvatar.svg;
        
        // Apply skin tone customization
        if (this.customizations.skinTone !== undefined) {
            const newSkinColor = CustomizationOptions.skinTones[this.customizations.skinTone].color;
            svg = svg.replace(/stop-color="#[^"]*"/g, (match, offset, string) => {
                if (string.substring(Math.max(0, offset - 50), offset).includes('skin')) {
                    return `stop-color="${newSkinColor}"`;
                }
                return match;
            });
        }
        
        // Apply hair color customization
        if (this.customizations.hairColor !== undefined) {
            const newHairColor = CustomizationOptions.hairColors[this.customizations.hairColor].color;
            svg = svg.replace(/id="hair\d+"/g, (match) => {
                return match;
            });
            svg = svg.replace(/fill="url\(#hair\d+\)"/g, `fill="${newHairColor}"`);
            svg = svg.replace(/stroke="#[^"]*"/g, (match, offset, string) => {
                if (string.substring(Math.max(0, offset - 20), offset).includes('Eyebrow') || 
                    string.substring(Math.max(0, offset - 50), offset + 20).includes('eyebrow')) {
                    return `stroke="${newHairColor}"`;
                }
                return match;
            });
        }
        
        // Apply eye color customization
        if (this.customizations.eyeColor !== undefined) {
            const newEyeColor = CustomizationOptions.eyeColors[this.customizations.eyeColor].color;
            svg = svg.replace(/fill="#[^"]*"/g, (match, offset, string) => {
                const before = string.substring(Math.max(0, offset - 30), offset);
                const after = string.substring(offset, offset + 50);
                if ((before.includes('r="4') || before.includes('r="3.5') || before.includes('r="5')) && 
                    !after.includes('#000') && !after.includes('white')) {
                    return `fill="${newEyeColor}"`;
                }
                return match;
            });
        }
        
        return svg;
    }
    
    randomSelect() {
        const allAvatars = [...AvatarGallery.male, ...AvatarGallery.female];
        const randomAvatar = allAvatars[Math.floor(Math.random() * allAvatars.length)];
        this.selectedAvatar = randomAvatar;
        
        // Random customizations
        this.customizations = {
            skinTone: Math.floor(Math.random() * CustomizationOptions.skinTones.length),
            hairColor: Math.floor(Math.random() * CustomizationOptions.hairColors.length),
            eyeColor: Math.floor(Math.random() * CustomizationOptions.eyeColors.length)
        };
        
        this.saveToStorage();
        return this.selectedAvatar;
    }
    
    saveToStorage() {
        try {
            const data = {
                selectedAvatar: this.selectedAvatar,
                customizations: this.customizations,
                mode: this.mode,
                photoUrl: this.photoUrl,
                timestamp: Date.now()
            };
            if (!window.avatarStorage) window.avatarStorage = {};
            window.avatarStorage[this.userId] = data;
            console.log('💾 Avatar galleria salvato:', this.selectedAvatar?.name);
        } catch (e) {
            console.error('Errore salvataggio avatar:', e);
        }
    }
    
    loadFromStorage() {
        try {
            if (window.avatarStorage && window.avatarStorage[this.userId]) {
                const data = window.avatarStorage[this.userId];
                this.selectedAvatar = data.selectedAvatar || AvatarGallery.male[0];
                this.customizations = data.customizations || {};
                this.mode = data.mode || 'gallery';
                this.photoUrl = data.photoUrl || null;
                console.log('📂 Avatar galleria caricato:', this.selectedAvatar?.name);
            }
        } catch (e) {
            console.error('Errore caricamento avatar:', e);
        }
    }
}

// === UI GALLERIA AVATAR ===
class AvatarGalleryUI {
    constructor(containerId, manager) {
        this.container = document.getElementById(containerId);
        this.manager = manager;
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="avatar-gallery-ui">
                <div class="mode-selector">
                    <button class="mode-btn ${this.manager.mode === 'gallery' ? 'active' : ''}" data-mode="gallery">
                        🎭 Galleria Avatar
                    </button>
                    <button class="mode-btn ${this.manager.mode === 'photo' ? 'active' : ''}" data-mode="photo">
                        📸 Foto Personale
                    </button>
                </div>
                
                <div class="avatar-preview">
                    <div class="preview-container" id="previewContainer">
                        ${this.manager.getDisplayHTML()}
                    </div>
                    <div class="avatar-info" id="avatarInfo">
                        ${this.manager.selectedAvatar ? `${this.manager.selectedAvatar.emoji} ${this.manager.selectedAvatar.name}` : 'Seleziona un avatar'}
                    </div>
                </div>
                
                <div class="controls" id="controls">
                    ${this.manager.mode === 'gallery' ? this.buildGalleryControls() : this.buildPhotoControls()}
                </div>
                
                <div class="actions">
                    <button class="action-btn" onclick="window.avatarUI.randomSelect()">🎲 Avatar Casuale</button>
                    <button class="action-btn primary" onclick="window.avatarUI.save()">💾 Salva Avatar</button>
                </div>
            </div>
        `;
        
        this.attachEvents();
        this.injectStyles();
    }
    
    buildGalleryControls() {
        return `
            <div class="control-section">
                <div class="control-group">
                    <label>👨 Avatar Maschili</label>
                    <div class="avatar-grid">
                        ${AvatarGallery.male.map(avatar => 
                            `<div class="avatar-option ${this.manager.selectedAvatar?.id === avatar.id ? 'active' : ''}" 
                                  data-avatar-id="${avatar.id}">
                                <div class="avatar-thumb">${avatar.svg}</div>
                                <div class="avatar-label">${avatar.emoji} ${avatar.name.split(' - ')[0]}</div>
                            </div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="control-group">
                    <label>👩 Avatar Femminili</label>
                    <div class="avatar-grid">
                        ${AvatarGallery.female.map(avatar => 
                            `<div class="avatar-option ${this.manager.selectedAvatar?.id === avatar.id ? 'active' : ''}" 
                                  data-avatar-id="${avatar.id}">
                                <div class="avatar-thumb">${avatar.svg}</div>
                                <div class="avatar-label">${avatar.emoji} ${avatar.name.split(' - ')[0]}</div>
                            </div>`
                        ).join('')}
                    </div>
                </div>
                
                ${this.manager.selectedAvatar ? this.buildCustomizationControls() : ''}
            </div>
        `;
    }
    
    buildCustomizationControls() {
        return `
            <div class="control-group">
                <label>🎨 Personalizza Avatar</label>
                
                <div class="customization-row">
                    <span class="custom-label">Tonalità Pelle:</span>
                    <div class="color-options">
                        ${CustomizationOptions.skinTones.map((tone, index) => 
                            `<div class="color-option ${this.manager.customizations.skinTone === index ? 'active' : ''}" 
                                  data-property="skinTone" data-index="${index}"
                                  style="background: ${tone.color};" title="${tone.name}"></div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="customization-row">
                    <span class="custom-label">Colore Capelli:</span>
                    <div class="color-options">
                        ${CustomizationOptions.hairColors.map((hair, index) => 
                            `<div class="color-option ${this.manager.customizations.hairColor === index ? 'active' : ''}" 
                                  data-property="hairColor" data-index="${index}"
                                  style="background: ${hair.color};" title="${hair.name}"></div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="customization-row">
                    <span class="custom-label">Colore Occhi:</span>
                    <div class="color-options">
                        ${CustomizationOptions.eyeColors.map((eye, index) => 
                            `<div class="color-option ${this.manager.customizations.eyeColor === index ? 'active' : ''}" 
                                  data-property="eyeColor" data-index="${index}"
                                  style="background: ${eye.color};" title="${eye.name}"></div>`
                        ).join('')}
                    </div>
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
                            <div class="upload-hint">JPG, PNG o WEBP - Preferibilmente solo viso</div>
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
        
        // Avatar selection
        this.container.querySelectorAll('.avatar-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const avatarId = e.currentTarget.dataset.avatarId;
                this.selectAvatar(avatarId);
            });
        });
        
        // Color customization
        this.container.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const property = e.currentTarget.dataset.property;
                const index = parseInt(e.currentTarget.dataset.index);
                this.updateCustomization(property, index);
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
    
    selectAvatar(avatarId) {
        this.manager.selectAvatar(avatarId);
        this.refreshControls();
        this.updatePreview();
        this.updateAvatarInfo();
    }
    
    updateCustomization(property, index) {
        this.manager.updateCustomization(property, index);
        this.updatePreview();
        this.updateCustomizationDisplay();
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
        controlsContainer.innerHTML = this.manager.mode === 'gallery' ? 
            this.buildGalleryControls() : this.buildPhotoControls();
        this.attachEvents();
    }
    
    updatePreview() {
        const preview = this.container.querySelector('#previewContainer');
        preview.innerHTML = this.manager.getDisplayHTML();
    }
    
    updateAvatarInfo() {
        const info = this.container.querySelector('#avatarInfo');
        if (info && this.manager.selectedAvatar) {
            info.textContent = `${this.manager.selectedAvatar.emoji} ${this.manager.selectedAvatar.name}`;
        }
    }
    
    updateCustomizationDisplay() {
        this.container.querySelectorAll('.color-option').forEach(option => {
            const property = option.dataset.property;
            const index = parseInt(option.dataset.index);
            const isActive = this.manager.customizations[property] === index;
            option.classList.toggle('active', isActive);
        });
    }
    
    randomSelect() {
        this.manager.randomSelect();
        this.refreshControls();
        this.updatePreview();
        this.updateAvatarInfo();
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
        if (document.getElementById('avatar-gallery-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'avatar-gallery-styles';
        styles.textContent = `
            .avatar-gallery-ui {
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
                width: 150px;
                height: 150px;
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
                color: white;
                font-size: 16px;
                font-weight: 600;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            }
            
            .control-section {
                background: rgba(255,255,255,0.1);
                border-radius: 20px;
                padding: 25px;
                margin-bottom: 25px;
                backdrop-filter: blur(10px);
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
            
            .avatar-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 15px;
            }
            
            .avatar-option {
                text-align: center;
                cursor: pointer;
                padding: 15px;
                border-radius: 15px;
                border: 2px solid rgba(255,255,255,0.2);
                background: rgba(255,255,255,0.05);
                transition: all 0.3s ease;
            }
            
            .avatar-option:hover {
                background: rgba(255,255,255,0.15);
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            }
            
            .avatar-option.active {
                border-color: #F39C12;
                background: rgba(243, 156, 18, 0.2);
                box-shadow: 0 6px 20px rgba(243, 156, 18, 0.4);
            }
            
            .avatar-thumb {
                width: 80px;
                height: 80px;
                margin: 0 auto 10px;
                border-radius: 50%;
                overflow: hidden;
                background: white;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .avatar-thumb svg {
                width: 100%;
                height: 100%;
            }
            
            .avatar-label {
                font-size: 12px;
                font-weight: 600;
                color: white;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            }
            
            .customization-row {
                margin-bottom: 20px;
                padding: 15px;
                background: rgba(255,255,255,0.1);
                border-radius: 12px;
            }
            
            .custom-label {
                display: block;
                font-weight: 600;
                margin-bottom: 10px;
                color: white;
                font-size: 14px;
            }
            
            .color-options {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            
            .color-option {
                width: 35px;
                height: 35px;
                border-radius: 10px;
                cursor: pointer;
                border: 2px solid rgba(255,255,255,0.3);
                transition: all 0.3s ease;
                position: relative;
            }
            
            .color-option:hover {
                transform: scale(1.1);
                border-color: rgba(255,255,255,0.7);
            }
            
            .color-option.active {
                border-color: #F39C12;
                transform: scale(1.15);
                box-shadow: 0 4px 15px rgba(243, 156, 18, 0.5);
            }
            
            .color-option.active::after {
                content: '✓';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-weight: bold;
                font-size: 14px;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
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
                .avatar-gallery-ui {
                    padding: 20px;
                    margin: 10px;
                }
                
                .avatar-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
                
                .preview-container {
                    width: 120px;
                    height: 120px;
                }
                
                .color-options {
                    justify-content: center;
                }
                
                .actions {
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
        console.log('🎭 Sistema Avatar Galleria inizializzato per:', userId);
        const manager = new AvatarGalleryManager(userId);
        return manager;
    }
    
    static createUI(containerId, manager) {
        console.log('🎨 Creazione UI Avatar Galleria per container:', containerId);
        const ui = new AvatarGalleryUI(containerId, manager);
        // Store reference globally for button actions
        window.avatarUI = ui;
        return ui;
    }
}

// === ESPOSIZIONE GLOBALE ===
window.RealisticAvatarSystem = RealisticAvatarSystem;
window.AvatarGalleryManager = AvatarGalleryManager;
window.AvatarGalleryUI = AvatarGalleryUI;

console.log('✅ Sistema Avatar Galleria caricato - AVATAR PREIMPOSTATI FUNZIONANTI!');