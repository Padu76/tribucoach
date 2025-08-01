// avatar-system-realistic.js - GALLERIA AVATAR FLAT DESIGN PROFESSIONALE
// Sistema con avatar moderni come nelle immagini di riferimento

// === CONFIGURAZIONE PERSONALIZZAZIONI ===
const AvatarCustomization = {
    skinTones: [
        { name: 'Molto Chiara', color: '#FDBCB4', shadow: '#F1A894' },
        { name: 'Chiara', color: '#F7B5A8', shadow: '#E8A584' },
        { name: 'Media Chiara', color: '#E8B895', shadow: '#D5A785' },
        { name: 'Media', color: '#D5A785', shadow: '#C89067' },
        { name: 'Media Scura', color: '#C89067', shadow: '#B07854' },
        { name: 'Scura', color: '#B07854', shadow: '#9B6B47' },
        { name: 'Molto Scura', color: '#8B5A3C', shadow: '#6D4426' }
    ],
    
    hairColors: [
        { name: 'Nero', color: '#2C1B18' },
        { name: 'Castano Scuro', color: '#4A2C17' },
        { name: 'Castano', color: '#654321' },
        { name: 'Castano Chiaro', color: '#8B4513' },
        { name: 'Biondo Scuro', color: '#B8860B' },
        { name: 'Biondo', color: '#DAA520' },
        { name: 'Biondo Chiaro', color: '#F4A460' },
        { name: 'Rosso', color: '#D2691E' },
        { name: 'Grigio', color: '#808080' },
        { name: 'Argento', color: '#C0C0C0' }
    ],
    
    hairStyles: {
        male: [
            'short', 'buzz', 'curly', 'wavy', 'fade', 'pompadour', 'messy', 'slicked', 'afro', 'bald'
        ],
        female: [
            'long', 'bob', 'pixie', 'curly', 'wavy', 'ponytail', 'bun', 'shoulder', 'bangs', 'afro'
        ]
    },
    
    eyeColors: [
        { name: 'Marroni Scuri', color: '#654321' },
        { name: 'Marroni', color: '#8B4513' },
        { name: 'Nocciola', color: '#CD853F' },
        { name: 'Verdi', color: '#228B22' },
        { name: 'Azzurri', color: '#4169E1' },
        { name: 'Blu Scuri', color: '#191970' },
        { name: 'Grigi', color: '#708090' },
        { name: 'Ambra', color: '#FF8C00' }
    ],
    
    expressions: [
        { name: 'Sorriso', value: 'smile' },
        { name: 'Neutrale', value: 'neutral' },
        { name: 'Felice', value: 'happy' },
        { name: 'Serio', value: 'serious' },
        { name: 'Rilassato', value: 'relaxed' }
    ],
    
    accessories: [
        { name: 'Nessuno', value: 'none' },
        { name: 'Occhiali', value: 'glasses' },
        { name: 'Occhiali da Sole', value: 'sunglasses' },
        { name: 'Occhiali Rotondi', value: 'round_glasses' }
    ],
    
    facialHair: [
        { name: 'Nessuno', value: 'none' },
        { name: 'Barba Corta', value: 'short_beard' },
        { name: 'Barba Lunga', value: 'long_beard' },
        { name: 'Baffi', value: 'mustache' },
        { name: 'Pizzetto', value: 'goatee' },
        { name: 'Stubble', value: 'stubble' }
    ]
};

// === GENERATORE AVATAR FLAT DESIGN ===
class FlatDesignAvatarGenerator {
    static generate(config) {
        const avatarId = `avatar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        return `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="background: ${this.getBackgroundColor(config)}; border-radius: 50%;">
    <defs>
        ${this.generateGradients(config, avatarId)}
    </defs>
    
    <!-- Background Circle -->
    <circle cx="100" cy="100" r="95" fill="${this.getBackgroundColor(config)}"/>
    
    <!-- Neck -->
    ${this.generateNeck(config)}
    
    <!-- Face -->
    ${this.generateFace(config, avatarId)}
    
    <!-- Hair Back -->
    ${this.generateHairBack(config)}
    
    <!-- Ears -->
    ${this.generateEars(config)}
    
    <!-- Face Details -->
    ${this.generateFaceDetails(config)}
    
    <!-- Eyes -->
    ${this.generateEyes(config)}
    
    <!-- Nose -->
    ${this.generateNose(config)}
    
    <!-- Mouth -->
    ${this.generateMouth(config)}
    
    <!-- Hair Front -->
    ${this.generateHairFront(config)}
    
    <!-- Facial Hair -->
    ${config.gender === 'male' ? this.generateFacialHair(config) : ''}
    
    <!-- Accessories -->
    ${this.generateAccessories(config)}
</svg>`;
    }
    
    static getBackgroundColor(config) {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    static generateGradients(config, avatarId) {
        const skin = config.skinTone;
        return `
            <radialGradient id="faceGradient${avatarId}" cx="0.3" cy="0.3" r="0.8">
                <stop offset="0%" stop-color="${skin.color}"/>
                <stop offset="100%" stop-color="${skin.shadow}"/>
            </radialGradient>
        `;
    }
    
    static generateNeck(config) {
        return `<ellipse cx="100" cy="185" rx="20" ry="18" fill="${config.skinTone.color}"/>`;
    }
    
    static generateFace(config, avatarId) {
        return `
            <ellipse cx="100" cy="120" rx="45" ry="55" fill="url(#faceGradient${avatarId})" stroke="${config.skinTone.shadow}" stroke-width="0.5"/>
        `;
    }
    
    static generateEars(config) {
        return `
            <ellipse cx="65" cy="115" rx="8" ry="15" fill="${config.skinTone.color}"/>
            <ellipse cx="135" cy="115" rx="8" ry="15" fill="${config.skinTone.color}"/>
        `;
    }
    
    static generateFaceDetails(config) {
        return `
            <!-- Cheek highlights -->
            <ellipse cx="78" cy="125" rx="6" ry="4" fill="#FFB6C1" opacity="0.3"/>
            <ellipse cx="122" cy="125" rx="6" ry="4" fill="#FFB6C1" opacity="0.3"/>
        `;
    }
    
    static generateHairBack(config) {
        const hairColor = config.hairColor.color;
        const hairStyle = config.hairStyle;
        
        const maleHairStyles = {
            short: `<path d="M55 85 Q100 50 145 85 L140 110 Q100 70 60 110 Z" fill="${hairColor}"/>`,
            buzz: `<path d="M65 80 Q100 60 135 80 L130 95 Q100 75 70 95 Z" fill="${hairColor}"/>`,
            curly: `
                <circle cx="85" cy="75" r="12" fill="${hairColor}"/>
                <circle cx="100" cy="68" r="15" fill="${hairColor}"/>
                <circle cx="115" cy="75" r="12" fill="${hairColor}"/>
                <circle cx="75" cy="90" r="10" fill="${hairColor}"/>
                <circle cx="125" cy="90" r="10" fill="${hairColor}"/>
            `,
            wavy: `<path d="M50 78 Q75 65 100 78 Q125 65 150 78 L145 105 Q100 75 55 105 Z" fill="${hairColor}"/>`,
            fade: `<path d="M60 88 Q100 65 140 88 L135 105 Q100 80 65 105 Z" fill="${hairColor}"/>`,
            pompadour: `<path d="M55 85 Q100 45 145 85 Q130 70 100 65 Q70 70 55 85 Z" fill="${hairColor}"/>`,
            messy: `<path d="M50 82 Q80 60 100 75 Q120 60 150 82 L145 108 Q100 78 55 108 Z" fill="${hairColor}"/>`,
            slicked: `<path d="M55 85 Q100 55 145 85 L140 105 Q100 75 60 105 Z" fill="${hairColor}"/>`,
            afro: `
                <circle cx="70" cy="80" r="18" fill="${hairColor}"/>
                <circle cx="100" cy="70" r="22" fill="${hairColor}"/>
                <circle cx="130" cy="80" r="18" fill="${hairColor}"/>
                <circle cx="85" cy="95" r="15" fill="${hairColor}"/>
                <circle cx="115" cy="95" r="15" fill="${hairColor}"/>
            `,
            bald: ``
        };
        
        const femaleHairStyles = {
            long: `<path d="M45 75 Q100 40 155 75 L160 140 Q100 100 40 140 Z" fill="${hairColor}"/>`,
            bob: `<path d="M55 80 Q100 55 145 80 L150 115 Q100 90 50 115 Z" fill="${hairColor}"/>`,
            pixie: `<path d="M65 85 Q100 65 135 85 L130 100 Q100 80 70 100 Z" fill="${hairColor}"/>`,
            curly: `
                <circle cx="75" cy="78" r="15" fill="${hairColor}"/>
                <circle cx="100" cy="65" r="20" fill="${hairColor}"/>
                <circle cx="125" cy="78" r="15" fill="${hairColor}"/>
                <circle cx="85" cy="105" r="12" fill="${hairColor}"/>
                <circle cx="115" cy="105" r="12" fill="${hairColor}"/>
            `,
            wavy: `<path d="M45 75 Q70 65 95 75 Q120 65 145 75 Q155 90 150 120 Q100 95 50 120 Q45 90 45 75 Z" fill="${hairColor}"/>`,
            ponytail: `
                <path d="M55 85 Q100 55 145 85 L140 105 Q100 75 60 105 Z" fill="${hairColor}"/>
                <ellipse cx="150" cy="110" rx="8" ry="25" fill="${hairColor}"/>
            `,
            bun: `
                <path d="M60 85 Q100 60 140 85 L135 100 Q100 75 65 100 Z" fill="${hairColor}"/>
                <circle cx="100" cy="65" r="18" fill="${hairColor}"/>
            `,
            shoulder: `<path d="M50 75 Q100 45 150 75 L155 125 Q100 95 45 125 Z" fill="${hairColor}"/>`,
            bangs: `
                <path d="M45 75 Q100 40 155 75 L160 130 Q100 95 40 130 Z" fill="${hairColor}"/>
                <rect x="70" y="75" width="60" height="12" rx="6" fill="${hairColor}"/>
            `,
            afro: `
                <circle cx="70" cy="75" r="20" fill="${hairColor}"/>
                <circle cx="100" cy="65" r="25" fill="${hairColor}"/>
                <circle cx="130" cy="75" r="20" fill="${hairColor}"/>
                <circle cx="80" cy="100" r="16" fill="${hairColor}"/>
                <circle cx="120" cy="100" r="16" fill="${hairColor}"/>
            `
        };
        
        const styles = config.gender === 'male' ? maleHairStyles : femaleHairStyles;
        return styles[hairStyle] || styles[Object.keys(styles)[0]];
    }
    
    static generateHairFront(config) {
        // Dettagli frontali per alcuni stili
        if (config.hairStyle === 'bangs' && config.gender === 'female') {
            return `<path d="M70 85 Q100 80 130 85" stroke="${config.hairColor.color}" stroke-width="2" fill="none"/>`;
        }
        return '';
    }
    
    static generateEyes(config) {
        const eyeColor = config.eyeColor.color;
        const expression = config.expression;
        
        const expressions = {
            smile: {
                leftEye: `<ellipse cx="85" cy="105" rx="8" ry="6" fill="white"/>`,
                rightEye: `<ellipse cx="115" cy="105" rx="8" ry="6" fill="white"/>`,
                leftIris: `<circle cx="85" cy="105" r="4" fill="${eyeColor}"/>`,
                rightIris: `<circle cx="115" cy="105" r="4" fill="${eyeColor}"/>`,
                leftPupil: `<circle cx="85" cy="105" r="2" fill="#000"/>`,
                rightPupil: `<circle cx="115" cy="105" r="2" fill="#000"/>`,
                leftHighlight: `<circle cx="86" cy="103" r="1" fill="white"/>`,
                rightHighlight: `<circle cx="116" cy="103" r="1" fill="white"/>`
            },
            happy: {
                leftEye: `<path d="M77 105 Q85 100 93 105 Q85 108 77 105" fill="white"/>`,
                rightEye: `<path d="M107 105 Q115 100 123 105 Q115 108 107 105" fill="white"/>`,
                leftIris: `<circle cx="85" cy="105" r="3" fill="${eyeColor}"/>`,
                rightIris: `<circle cx="115" cy="105" r="3" fill="${eyeColor}"/>`,
                leftPupil: `<circle cx="85" cy="105" r="1.5" fill="#000"/>`,
                rightPupil: `<circle cx="115" cy="105" r="1.5" fill="#000"/>`,
                leftHighlight: `<circle cx="86" cy="104" r="0.8" fill="white"/>`,
                rightHighlight: `<circle cx="116" cy="104" r="0.8" fill="white"/>`
            },
            neutral: {
                leftEye: `<ellipse cx="85" cy="105" rx="8" ry="7" fill="white"/>`,
                rightEye: `<ellipse cx="115" cy="105" rx="8" ry="7" fill="white"/>`,
                leftIris: `<circle cx="85" cy="105" r="4" fill="${eyeColor}"/>`,
                rightIris: `<circle cx="115" cy="105" r="4" fill="${eyeColor}"/>`,
                leftPupil: `<circle cx="85" cy="105" r="2" fill="#000"/>`,
                rightPupil: `<circle cx="115" cy="105" r="2" fill="#000"/>`,
                leftHighlight: `<circle cx="86" cy="103" r="1" fill="white"/>`,
                rightHighlight: `<circle cx="116" cy="103" r="1" fill="white"/>`
            },
            serious: {
                leftEye: `<ellipse cx="85" cy="105" rx="8" ry="5" fill="white"/>`,
                rightEye: `<ellipse cx="115" cy="105" rx="8" ry="5" fill="white"/>`,
                leftIris: `<circle cx="85" cy="105" r="4" fill="${eyeColor}"/>`,
                rightIris: `<circle cx="115" cy="105" r="4" fill="${eyeColor}"/>`,
                leftPupil: `<circle cx="85" cy="105" r="2" fill="#000"/>`,
                rightPupil: `<circle cx="115" cy="105" r="2" fill="#000"/>`,
                leftHighlight: `<circle cx="86" cy="103" r="1" fill="white"/>`,
                rightHighlight: `<circle cx="116" cy="103" r="1" fill="white"/>`
            },
            relaxed: {
                leftEye: `<ellipse cx="85" cy="105" rx="8" ry="6" fill="white"/>`,
                rightEye: `<ellipse cx="115" cy="105" rx="8" ry="6" fill="white"/>`,
                leftIris: `<circle cx="85" cy="105" r="4" fill="${eyeColor}"/>`,
                rightIris: `<circle cx="115" cy="105" r="4" fill="${eyeColor}"/>`,
                leftPupil: `<circle cx="85" cy="105" r="2" fill="#000"/>`,
                rightPupil: `<circle cx="115" cy="105" r="2" fill="#000"/>`,
                leftHighlight: `<circle cx="86" cy="103" r="1" fill="white"/>`,
                rightHighlight: `<circle cx="116" cy="103" r="1" fill="white"/>`
            }
        };
        
        const eye = expressions[expression] || expressions.neutral;
        
        return `
            <!-- Left Eye -->
            ${eye.leftEye}
            ${eye.leftIris}
            ${eye.leftPupil}
            ${eye.leftHighlight}
            
            <!-- Right Eye -->
            ${eye.rightEye}
            ${eye.rightIris}
            ${eye.rightPupil}
            ${eye.rightHighlight}
            
            <!-- Eyebrows -->
            <path d="M77 98 Q85 95 93 98" stroke="${config.hairColor.color}" stroke-width="3" fill="none" stroke-linecap="round"/>
            <path d="M107 98 Q115 95 123 98" stroke="${config.hairColor.color}" stroke-width="3" fill="none" stroke-linecap="round"/>
        `;
    }
    
    static generateNose(config) {
        return `
            <ellipse cx="100" cy="115" rx="2" ry="4" fill="${config.skinTone.shadow}" opacity="0.6"/>
            <ellipse cx="98" cy="117" rx="1" ry="1.5" fill="${config.skinTone.shadow}" opacity="0.8"/>
            <ellipse cx="102" cy="117" rx="1" ry="1.5" fill="${config.skinTone.shadow}" opacity="0.8"/>
        `;
    }
    
    static generateMouth(config) {
        const expressions = {
            smile: `<path d="M90 130 Q100 138 110 130" stroke="#E74C3C" stroke-width="4" fill="none" stroke-linecap="round"/>`,
            happy: `<ellipse cx="100" cy="133" rx="12" ry="6" fill="#E74C3C"/>
                   <ellipse cx="100" cy="131" rx="10" ry="4" fill="#FF69B4"/>`,
            neutral: `<ellipse cx="100" cy="132" rx="8" ry="3" fill="#E74C3C"/>`,
            serious: `<rect x="92" y="130" width="16" height="3" rx="1.5" fill="#CD5C5C"/>`,
            relaxed: `<path d="M92 132 Q100 136 108 132" stroke="#E74C3C" stroke-width="3" fill="none" stroke-linecap="round"/>`
        };
        
        return expressions[config.expression] || expressions.neutral;
    }
    
    static generateFacialHair(config) {
        if (config.facialHair === 'none') return '';
        
        const hairColor = config.hairColor.color;
        
        const facialHairStyles = {
            short_beard: `<ellipse cx="100" cy="145" rx="18" ry="12" fill="${hairColor}" opacity="0.8"/>`,
            long_beard: `<path d="M82 140 Q100 160 118 140 Q118 155 100 165 Q82 155 82 140" fill="${hairColor}"/>`,
            mustache: `<ellipse cx="100" cy="125" rx="12" ry="4" fill="${hairColor}"/>`,
            goatee: `<ellipse cx="100" cy="145" rx="8" ry="10" fill="${hairColor}"/>`,
            stubble: `
                <ellipse cx="100" cy="140" rx="20" ry="15" fill="${hairColor}" opacity="0.3"/>
                <circle cx="95" cy="135" r="0.5" fill="${hairColor}" opacity="0.6"/>
                <circle cx="105" cy="135" r="0.5" fill="${hairColor}" opacity="0.6"/>
                <circle cx="90" cy="145" r="0.5" fill="${hairColor}" opacity="0.6"/>
                <circle cx="110" cy="145" r="0.5" fill="${hairColor}" opacity="0.6"/>
            `
        };
        
        return facialHairStyles[config.facialHair] || '';
    }
    
    static generateAccessories(config) {
        if (config.accessories === 'none') return '';
        
        const accessoryStyles = {
            glasses: `
                <ellipse cx="85" cy="105" rx="15" ry="12" fill="none" stroke="#2C3E50" stroke-width="3"/>
                <ellipse cx="115" cy="105" rx="15" ry="12" fill="none" stroke="#2C3E50" stroke-width="3"/>
                <line x1="100" y1="105" x2="100" y2="105" stroke="#2C3E50" stroke-width="3"/>
                <ellipse cx="82" cy="100" rx="3" ry="6" fill="white" opacity="0.7"/>
                <ellipse cx="112" cy="100" rx="3" ry="6" fill="white" opacity="0.7"/>
            `,
            sunglasses: `
                <ellipse cx="85" cy="105" rx="15" ry="12" fill="#2C3E50" stroke="#34495E" stroke-width="2"/>
                <ellipse cx="115" cy="105" rx="15" ry="12" fill="#2C3E50" stroke="#34495E" stroke-width="2"/>
                <line x1="100" y1="105" x2="100" y2="105" stroke="#34495E" stroke-width="3"/>
                <ellipse cx="82" cy="100" rx="2" ry="4" fill="white" opacity="0.3"/>
                <ellipse cx="112" cy="100" rx="2" ry="4" fill="white" opacity="0.3"/>
            `,
            round_glasses: `
                <circle cx="85" cy="105" r="15" fill="none" stroke="#2C3E50" stroke-width="3"/>
                <circle cx="115" cy="105" r="15" fill="none" stroke="#2C3E50" stroke-width="3"/>
                <line x1="100" y1="105" x2="100" y2="105" stroke="#2C3E50" stroke-width="3"/>
                <circle cx="82" cy="100" r="3" fill="white" opacity="0.7"/>
                <circle cx="112" cy="100" r="3" fill="white" opacity="0.7"/>
            `
        };
        
        return accessoryStyles[config.accessories] || '';
    }
}

// === MANAGER AVATAR FLAT DESIGN ===
class FlatDesignAvatarManager {
    constructor(userId) {
        this.userId = userId;
        this.config = this.getDefaultConfig();
        this.mode = 'gallery';
        this.photoUrl = null;
        this.loadFromStorage();
    }
    
    getDefaultConfig() {
        return {
            gender: 'male',
            skinTone: AvatarCustomization.skinTones[2],
            hairColor: AvatarCustomization.hairColors[2],
            hairStyle: 'short',
            eyeColor: AvatarCustomization.eyeColors[1],
            expression: 'smile',
            accessories: 'none',
            facialHair: 'none'
        };
    }
    
    updateConfig(property, value) {
        this.config[property] = value;
        
        // Auto-update hair style when gender changes
        if (property === 'gender') {
            const availableStyles = AvatarCustomization.hairStyles[value];
            if (!availableStyles.includes(this.config.hairStyle)) {
                this.config.hairStyle = availableStyles[0];
            }
        }
        
        this.saveToStorage();
        return this.config;
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
    
    generateSVG() {
        return FlatDesignAvatarGenerator.generate(this.config);
    }
    
    getDisplayHTML() {
        if (this.mode === 'photo' && this.photoUrl) {
            return `<img src="${this.photoUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" alt="Avatar Photo">`;
        } else {
            return this.generateSVG();
        }
    }
    
    randomize() {
        const gender = Math.random() > 0.5 ? 'male' : 'female';
        
        this.config = {
            gender: gender,
            skinTone: AvatarCustomization.skinTones[Math.floor(Math.random() * AvatarCustomization.skinTones.length)],
            hairColor: AvatarCustomization.hairColors[Math.floor(Math.random() * AvatarCustomization.hairColors.length)],
            hairStyle: AvatarCustomization.hairStyles[gender][Math.floor(Math.random() * AvatarCustomization.hairStyles[gender].length)],
            eyeColor: AvatarCustomization.eyeColors[Math.floor(Math.random() * AvatarCustomization.eyeColors.length)],
            expression: AvatarCustomization.expressions[Math.floor(Math.random() * AvatarCustomization.expressions.length)].value,
            accessories: AvatarCustomization.accessories[Math.floor(Math.random() * AvatarCustomization.accessories.length)].value,
            facialHair: gender === 'male' ? 
                AvatarCustomization.facialHair[Math.floor(Math.random() * AvatarCustomization.facialHair.length)].value : 'none'
        };
        
        this.saveToStorage();
        return this.config;
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
            console.log('💾 Avatar flat design salvato');
        } catch (e) {
            console.error('Errore salvataggio avatar:', e);
        }
    }
    
    loadFromStorage() {
        try {
            if (window.avatarStorage && window.avatarStorage[this.userId]) {
                const data = window.avatarStorage[this.userId];
                this.config = { ...this.getDefaultConfig(), ...data.config };
                this.mode = data.mode || 'gallery';
                this.photoUrl = data.photoUrl || null;
                console.log('📂 Avatar flat design caricato');
            }
        } catch (e) {
            console.error('Errore caricamento avatar:', e);
        }
    }
}

// === UI FLAT DESIGN AVATAR ===
class FlatDesignAvatarUI {
    constructor(containerId, manager) {
        this.container = document.getElementById(containerId);
        this.manager = manager;
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="flat-avatar-ui">
                <div class="mode-selector">
                    <button class="mode-btn ${this.manager.mode === 'gallery' ? 'active' : ''}" data-mode="gallery">
                        🎨 Crea Avatar
                    </button>
                    <button class="mode-btn ${this.manager.mode === 'photo' ? 'active' : ''}" data-mode="photo">
                        📸 Foto Personale
                    </button>
                </div>
                
                <div class="avatar-preview">
                    <div class="preview-container" id="previewContainer">
                        ${this.manager.getDisplayHTML()}
                    </div>
                </div>
                
                <div class="controls" id="controls">
                    ${this.manager.mode === 'gallery' ? this.buildCustomizationControls() : this.buildPhotoControls()}
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
    
    buildCustomizationControls() {
        return `
            <div class="control-section">
                <!-- Gender -->
                <div class="control-group">
                    <label>👤 Genere</label>
                    <div class="button-group">
                        <button class="option-btn ${this.manager.config.gender === 'male' ? 'active' : ''}" 
                                data-property="gender" data-value="male">🙂 Uomo</button>
                        <button class="option-btn ${this.manager.config.gender === 'female' ? 'active' : ''}" 
                                data-property="gender" data-value="female">😊 Donna</button>
                    </div>
                </div>
                
                <!-- Skin Tone -->
                <div class="control-group">
                    <label>🎨 Tonalità Pelle</label>
                    <div class="color-grid">
                        ${AvatarCustomization.skinTones.map((tone, index) => 
                            `<div class="color-swatch ${JSON.stringify(this.manager.config.skinTone) === JSON.stringify(tone) ? 'active' : ''}" 
                                  data-property="skinTone" data-index="${index}"
                                  style="background: linear-gradient(135deg, ${tone.color}, ${tone.shadow});" 
                                  title="${tone.name}"></div>`
                        ).join('')}
                    </div>
                </div>
                
                <!-- Hair Color -->
                <div class="control-group">
                    <label>💇 Colore Capelli</label>
                    <div class="color-grid">
                        ${AvatarCustomization.hairColors.map((hair, index) => 
                            `<div class="color-swatch ${JSON.stringify(this.manager.config.hairColor) === JSON.stringify(hair) ? 'active' : ''}" 
                                  data-property="hairColor" data-index="${index}"
                                  style="background: ${hair.color};" 
                                  title="${hair.name}"></div>`
                        ).join('')}
                    </div>
                </div>
                
                <!-- Hair Style -->
                <div class="control-group">
                    <label>✂️ Stile Capelli</label>
                    <div class="select-group">
                        <select class="control-select" data-property="hairStyle">
                            ${AvatarCustomization.hairStyles[this.manager.config.gender].map(style => 
                                `<option value="${style}" ${this.manager.config.hairStyle === style ? 'selected' : ''}>${style}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
                
                <!-- Eye Color -->
                <div class="control-group">
                    <label>👁️ Colore Occhi</label>
                    <div class="color-grid">
                        ${AvatarCustomization.eyeColors.map((eye, index) => 
                            `<div class="color-swatch ${JSON.stringify(this.manager.config.eyeColor) === JSON.stringify(eye) ? 'active' : ''}" 
                                  data-property="eyeColor" data-index="${index}"
                                  style="background: ${eye.color};" 
                                  title="${eye.name}"></div>`
                        ).join('')}
                    </div>
                </div>
                
                <!-- Expression -->
                <div class="control-group">
                    <label>😊 Espressione</label>
                    <div class="button-group">
                        ${AvatarCustomization.expressions.map(expr => 
                            `<button class="option-btn ${this.manager.config.expression === expr.value ? 'active' : ''}" 
                                    data-property="expression" data-value="${expr.value}">
                                ${expr.name}
                            </button>`
                        ).join('')}
                    </div>
                </div>
                
                <!-- Accessories -->
                <div class="control-group">
                    <label>👓 Accessori</label>
                    <div class="button-group">
                        ${AvatarCustomization.accessories.map(acc => 
                            `<button class="option-btn ${this.manager.config.accessories === acc.value ? 'active' : ''}" 
                                    data-property="accessories" data-value="${acc.value}">
                                ${acc.name}
                            </button>`
                        ).join('')}
                    </div>
                </div>
                
                ${this.manager.config.gender === 'male' ? `
                <!-- Facial Hair -->
                <div class="control-group">
                    <label>🧔 Peli Facciali</label>
                    <div class="button-group">
                        ${AvatarCustomization.facialHair.map(fh => 
                            `<button class="option-btn ${this.manager.config.facialHair === fh.value ? 'active' : ''}" 
                                    data-property="facialHair" data-value="${fh.value}">
                                ${fh.name}
                            </button>`
                        ).join('')}
                    </div>
                </div>
                ` : ''}
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
        
        // Option buttons
        this.container.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const property = e.target.dataset.property;
                const value = e.target.dataset.value;
                this.updateProperty(property, value);
            });
        });
        
        // Color swatches
        this.container.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                const property = e.target.dataset.property;
                const index = parseInt(e.target.dataset.index);
                this.updateColorProperty(property, index);
            });
        });
        
        // Select controls
        this.container.querySelectorAll('.control-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const property = e.target.dataset.property;
                this.updateProperty(property, e.target.value);
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
    
    updateProperty(property, value) {
        this.manager.updateConfig(property, value);
        this.refreshControls();
        this.updatePreview();
    }
    
    updateColorProperty(property, index) {
        let value;
        switch(property) {
            case 'skinTone':
                value = AvatarCustomization.skinTones[index];
                break;
            case 'hairColor':
                value = AvatarCustomization.hairColors[index];
                break;
            case 'eyeColor':
                value = AvatarCustomization.eyeColors[index];
                break;
        }
        
        this.manager.updateConfig(property, value);
        this.updatePreview();
        this.updateActiveStates();
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
            this.buildCustomizationControls() : this.buildPhotoControls();
        this.attachEvents();
    }
    
    updatePreview() {
        const preview = this.container.querySelector('#previewContainer');
        preview.innerHTML = this.manager.getDisplayHTML();
    }
    
    updateActiveStates() {
        // Update color swatches
        this.container.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.classList.remove('active');
        });
        
        // Update option buttons
        this.container.querySelectorAll('.option-btn').forEach(btn => {
            const property = btn.dataset.property;
            const value = btn.dataset.value;
            btn.classList.toggle('active', this.manager.config[property] === value);
        });
    }
    
    randomize() {
        this.manager.randomize();
        this.refreshControls();
        this.updatePreview();
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
        if (document.getElementById('flat-avatar-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'flat-avatar-styles';
        styles.textContent = `
            .flat-avatar-ui {
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
                margin: 0 auto;
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
            
            .button-group {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                gap: 10px;
            }
            
            .option-btn {
                padding: 12px;
                border: 2px solid rgba(255,255,255,0.3);
                background: rgba(255,255,255,0.1);
                color: white;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                font-size: 13px;
            }
            
            .option-btn:hover {
                background: rgba(255,255,255,0.2);
                transform: translateY(-1px);
            }
            
            .option-btn.active {
                border-color: #F39C12;
                background: rgba(243, 156, 18, 0.3);
                box-shadow: 0 4px 15px rgba(243, 156, 18, 0.4);
            }
            
            .color-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
                gap: 10px;
                max-width: 400px;
            }
            
            .color-swatch {
                width: 40px;
                height: 40px;
                border-radius: 12px;
                cursor: pointer;
                border: 3px solid rgba(255,255,255,0.3);
                transition: all 0.3s ease;
                position: relative;
            }
            
            .color-swatch:hover {
                transform: scale(1.1);
                border-color: rgba(255,255,255,0.7);
            }
            
            .color-swatch.active {
                border-color: #F39C12;
                transform: scale(1.15);
                box-shadow: 0 4px 15px rgba(243, 156, 18, 0.5);
            }
            
            .color-swatch.active::after {
                content: '✓';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-weight: bold;
                font-size: 16px;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
            }
            
            .control-select {
                width: 100%;
                padding: 12px;
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 10px;
                background: rgba(255,255,255,0.1);
                color: white;
                font-weight: 600;
                font-size: 14px;
            }
            
            .control-select option {
                background: #2C3E50;
                color: white;
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
                .flat-avatar-ui {
                    padding: 20px;
                    margin: 10px;
                }
                
                .preview-container {
                    width: 150px;
                    height: 150px;
                }
                
                .button-group {
                    grid-template-columns: 1fr;
                }
                
                .color-grid {
                    grid-template-columns: repeat(6, 1fr);
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
        console.log('🎨 Sistema Avatar Flat Design inizializzato per:', userId);
        const manager = new FlatDesignAvatarManager(userId);
        return manager;
    }
    
    static createUI(containerId, manager) {
        console.log('🎭 Creazione UI Avatar Flat Design per container:', containerId);
        const ui = new FlatDesignAvatarUI(containerId, manager);
        // Store reference globally for button actions
        window.avatarUI = ui;
        return ui;
    }
}

// === ESPOSIZIONE GLOBALE ===
window.RealisticAvatarSystem = RealisticAvatarSystem;
window.FlatDesignAvatarManager = FlatDesignAvatarManager;
window.FlatDesignAvatarUI = FlatDesignAvatarUI;

console.log('✅ Sistema Avatar Flat Design caricato - STILE PROFESSIONALE MODERNO!');