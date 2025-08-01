// avatar-system-realistic.js - STILE SKETCH MINIMALISTA
// Template pulito e professionale come Avataaars/Sketch

// === CONFIGURAZIONE SKETCH MINIMALISTA ===
const SketchConfig = {
    skinTones: ['#F2D7C0', '#E8B895', '#D5A785', '#C89067', '#B07854', '#8B5A3C', '#6D4426'],
    hairColors: ['#2C1B18', '#8B4513', '#D2691E', '#DEB887', '#FFD700', '#FF6347', '#8A2BE2'],
    eyeColors: ['#8B4513', '#0066CC', '#228B22', '#4B0082', '#DC143C', '#FF8C00'],
    
    hair: {
        male: ['buzz', 'short', 'caesar', 'curly', 'fade', 'long', 'bald'],
        female: ['bob', 'long', 'curly', 'ponytail', 'bun', 'wavy', 'pixie']
    },
    
    accessories: {
        glasses: ['none', 'clear', 'sunglasses', 'round'],
        facial: ['none', 'stubble', 'mustache', 'goatee', 'beard']
    },
    
    expressions: ['neutral', 'smile', 'happy', 'wink']
};

// === GENERATORE SKETCH SVG ===
class SketchAvatarGenerator {
    static generate(config) {
        return `
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
        ${this.generateGradients(config)}
        <filter id="soft-shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.15"/>
        </filter>
    </defs>
    
    <!-- Background Circle -->
    <circle cx="100" cy="100" r="95" fill="#F8F9FA" stroke="#E9ECEF" stroke-width="2"/>
    
    <!-- Shoulders -->
    ${this.generateShoulders(config)}
    
    <!-- Face -->
    ${this.generateFace(config)}
    
    <!-- Hair Back Layer -->
    ${this.generateHair(config, 'back')}
    
    <!-- Eyes -->
    ${this.generateEyes(config)}
    
    <!-- Nose -->
    ${this.generateNose(config)}
    
    <!-- Mouth -->
    ${this.generateMouth(config)}
    
    <!-- Hair Front Layer -->
    ${this.generateHair(config, 'front')}
    
    <!-- Accessories -->
    ${this.generateAccessories(config)}
</svg>`;
    }
    
    static generateGradients(config) {
        return `
            <radialGradient id="face-gradient" cx="0.4" cy="0.3" r="0.8">
                <stop offset="0%" stop-color="${this.lighten(config.skinTone, 15)}"/>
                <stop offset="100%" stop-color="${config.skinTone}"/>
            </radialGradient>
            <linearGradient id="hair-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="${this.lighten(config.hairColor, 25)}"/>
                <stop offset="100%" stop-color="${config.hairColor}"/>
            </linearGradient>
        `;
    }
    
    static generateShoulders(config) {
        const shoulderWidth = config.gender === 'male' ? 65 : 55;
        return `
            <ellipse cx="100" cy="185" rx="${shoulderWidth}" ry="25" 
                     fill="url(#face-gradient)" filter="url(#soft-shadow)"/>
        `;
    }
    
    static generateFace(config) {
        return `
            <ellipse cx="100" cy="120" rx="45" ry="55" 
                     fill="url(#face-gradient)" 
                     filter="url(#soft-shadow)"/>
        `;
    }
    
    static generateHair(config, layer) {
        if (config.hairStyle === 'bald') return '';
        
        const hairPaths = {
            // MALE STYLES
            buzz: {
                back: `<path d="M60 85 Q100 55 140 85 L135 105 Q100 75 65 105 Z" 
                             fill="url(#hair-gradient)" filter="url(#soft-shadow)"/>`,
                front: ''
            },
            short: {
                back: `<path d="M55 85 Q100 50 145 85 L140 110 Q100 70 60 110 Z" 
                             fill="url(#hair-gradient)" filter="url(#soft-shadow)"/>`,
                front: `<path d="M70 95 Q100 80 130 95" stroke="url(#hair-gradient)" 
                              stroke-width="3" fill="none" stroke-linecap="round"/>`
            },
            caesar: {
                back: `<path d="M58 88 Q100 58 142 88 L138 112 Q100 72 62 112 Z" 
                             fill="url(#hair-gradient)" filter="url(#soft-shadow)"/>`,
                front: `<rect x="75" y="85" width="50" height="8" rx="4" 
                              fill="url(#hair-gradient)" opacity="0.8"/>`
            },
            curly: {
                back: `<circle cx="80" cy="80" r="12" fill="url(#hair-gradient)" filter="url(#soft-shadow)"/>
                       <circle cx="100" cy="70" r="15" fill="url(#hair-gradient)" filter="url(#soft-shadow)"/>
                       <circle cx="120" cy="80" r="12" fill="url(#hair-gradient)" filter="url(#soft-shadow)"/>`,
                front: `<circle cx="85" cy="95" r="8" fill="url(#hair-gradient)" opacity="0.7"/>
                        <circle cx="115" cy="95" r="8" fill="url(#hair-gradient)" opacity="0.7"/>`
            },
            fade: {
                back: `<path d="M65 90 Q100 60 135 90 L130 108 Q100 78 70 108 Z" 
                             fill="url(#hair-gradient)" filter="url(#soft-shadow)"/>
                       <path d="M70 108 Q100 88 130 108" stroke="${config.skinTone}" 
                             stroke-width="2" fill="none" opacity="0.5"/>`,
                front: ''
            },
            long: {
                back: `<path d="M50 85 Q100 45 150 85 L150 125 Q100 85 50 125 Z" 
                             fill="url(#hair-gradient)" filter="url(#soft-shadow)"/>`,
                front: `<path d="M60 115 Q80 105 100 115 Q120 105 140 115" 
                              stroke="url(#hair-gradient)" stroke-width="4" fill="none"/>`
            },
            
            // FEMALE STYLES
            bob: {
                back: `<path d="M50 85 Q100 50 150 85 L150 115 Q100 85 50 115 Z" 
                             fill="url(#hair-gradient)" filter="url(#soft-shadow)"/>`,
                front: `<path d="M52 110 Q100 90 148 110" stroke="url(#hair-gradient)" 
                              stroke-width="5" fill="none" stroke-linecap="round"/>`
            },
            long: {
                back: `<path d="M45 85 Q100 40 155 85 L155 140 Q100 100 45 140 Z" 
                             fill="url(#hair-gradient)" filter="url(#soft-shadow)"/>`,
                front: `<path d="M47 135 L47 145 M153 135 L153 145" stroke="url(#hair-gradient)" 
                              stroke-width="6" stroke-linecap="round"/>`
            },
            curly: {
                back: `<circle cx="70" cy="80" r="15" fill="url(#hair-gradient)" filter="url(#soft-shadow)"/>
                       <circle cx="100" cy="65" r="20" fill="url(#hair-gradient)" filter="url(#soft-shadow)"/>
                       <circle cx="130" cy="80" r="15" fill="url(#hair-gradient)" filter="url(#soft-shadow)"/>
                       <circle cx="85" cy="110" r="12" fill="url(#hair-gradient)" filter="url(#soft-shadow)"/>
                       <circle cx="115" cy="110" r="12" fill="url(#hair-gradient)" filter="url(#soft-shadow)"/>`,
                front: ''
            },
            ponytail: {
                back: `<path d="M55 85 Q100 55 145 85 L140 105 Q100 75 60 105 Z" 
                             fill="url(#hair-gradient)" filter="url(#soft-shadow)"/>
                       <ellipse cx="145" cy="110" rx="8" ry="30" fill="url(#hair-gradient)" 
                                filter="url(#soft-shadow)"/>`,
                front: ''
            },
            bun: {
                back: `<path d="M60 85 Q100 60 140 85 L135 100 Q100 75 65 100 Z" 
                             fill="url(#hair-gradient)" filter="url(#soft-shadow)"/>
                       <circle cx="100" cy="65" r="20" fill="url(#hair-gradient)" 
                               filter="url(#soft-shadow)"/>`,
                front: ''
            },
            wavy: {
                back: `<path d="M50 85 Q70 70 90 85 Q110 70 130 85 Q150 70 150 85 L150 120 
                             Q130 110 110 120 Q90 110 70 120 Q50 110 50 120 Z" 
                             fill="url(#hair-gradient)" filter="url(#soft-shadow)"/>`,
                front: `<path d="M52 115 Q72 105 92 115 Q112 105 132 115 Q148 105 148 115" 
                              stroke="url(#hair-gradient)" stroke-width="3" fill="none"/>`
            },
            pixie: {
                back: `<path d="M65 85 Q100 65 135 85 L130 100 Q100 80 70 100 Z" 
                             fill="url(#hair-gradient)" filter="url(#soft-shadow)"/>`,
                front: `<path d="M75 90 Q90 85 105 90" stroke="url(#hair-gradient)" 
                              stroke-width="4" fill="none" stroke-linecap="round"/>`
            }
        };
        
        const style = hairPaths[config.hairStyle] || hairPaths.short;
        return style[layer] || '';
    }
    
    static generateEyes(config) {
        const eyeExpressions = {
            neutral: `
                <!-- Left Eye -->
                <ellipse cx="85" cy="105" rx="12" ry="8" fill="white" stroke="#DDD" stroke-width="1"/>
                <circle cx="85" cy="105" r="6" fill="${config.eyeColor}"/>
                <circle cx="85" cy="105" r="3" fill="#2C3E50"/>
                <circle cx="86.5" cy="103" r="2" fill="white"/>
                
                <!-- Right Eye -->
                <ellipse cx="115" cy="105" rx="12" ry="8" fill="white" stroke="#DDD" stroke-width="1"/>
                <circle cx="115" cy="105" r="6" fill="${config.eyeColor}"/>
                <circle cx="115" cy="105" r="3" fill="#2C3E50"/>
                <circle cx="116.5" cy="103" r="2" fill="white"/>
                
                <!-- Eyebrows -->
                <path d="M73 95 Q85 92 97 95" stroke="${this.darken(config.hairColor, 30)}" 
                      stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M103 95 Q115 92 127 95" stroke="${this.darken(config.hairColor, 30)}" 
                      stroke-width="3" fill="none" stroke-linecap="round"/>
            `,
            smile: `
                <!-- Left Eye -->
                <path d="M73 105 Q85 100 97 105 Q85 110 73 105" fill="white" stroke="#DDD" stroke-width="1"/>
                <circle cx="85" cy="105" r="5" fill="${config.eyeColor}"/>
                <circle cx="85" cy="105" r="2.5" fill="#2C3E50"/>
                <circle cx="86" cy="103.5" r="1.5" fill="white"/>
                
                <!-- Right Eye -->
                <path d="M103 105 Q115 100 127 105 Q115 110 103 105" fill="white" stroke="#DDD" stroke-width="1"/>
                <circle cx="115" cy="105" r="5" fill="${config.eyeColor}"/>
                <circle cx="115" cy="105" r="2.5" fill="#2C3E50"/>
                <circle cx="116" cy="103.5" r="1.5" fill="white"/>
                
                <!-- Eyebrows -->
                <path d="M73 95 Q85 90 97 95" stroke="${this.darken(config.hairColor, 30)}" 
                      stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M103 95 Q115 90 127 95" stroke="${this.darken(config.hairColor, 30)}" 
                      stroke-width="3" fill="none" stroke-linecap="round"/>
            `,
            happy: `
                <!-- Left Eye -->
                <path d="M73 100 Q85 95 97 100 Q85 110 73 100" fill="white" stroke="#DDD" stroke-width="1"/>
                <circle cx="85" cy="102" r="4" fill="${config.eyeColor}"/>
                <circle cx="85" cy="102" r="2" fill="#2C3E50"/>
                <circle cx="86" cy="101" r="1" fill="white"/>
                
                <!-- Right Eye -->
                <path d="M103 100 Q115 95 127 100 Q115 110 103 100" fill="white" stroke="#DDD" stroke-width="1"/>
                <circle cx="115" cy="102" r="4" fill="${config.eyeColor}"/>
                <circle cx="115" cy="102" r="2" fill="#2C3E50"/>
                <circle cx="116" cy="101" r="1" fill="white"/>
                
                <!-- Eyebrows -->
                <path d="M73 92 Q85 87 97 92" stroke="${this.darken(config.hairColor, 30)}" 
                      stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M103 92 Q115 87 127 92" stroke="${this.darken(config.hairColor, 30)}" 
                      stroke-width="3" fill="none" stroke-linecap="round"/>
            `,
            wink: `
                <!-- Left Eye (closed) -->
                <path d="M73 105 Q85 100 97 105" stroke="#2C3E50" 
                      stroke-width="3" fill="none" stroke-linecap="round"/>
                
                <!-- Right Eye -->
                <ellipse cx="115" cy="105" rx="12" ry="8" fill="white" stroke="#DDD" stroke-width="1"/>
                <circle cx="115" cy="105" r="6" fill="${config.eyeColor}"/>
                <circle cx="115" cy="105" r="3" fill="#2C3E50"/>
                <circle cx="116.5" cy="103" r="2" fill="white"/>
                
                <!-- Eyebrows -->
                <path d="M73 95 Q85 90 97 95" stroke="${this.darken(config.hairColor, 30)}" 
                      stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M103 95 Q115 92 127 95" stroke="${this.darken(config.hairColor, 30)}" 
                      stroke-width="3" fill="none" stroke-linecap="round"/>
            `
        };
        
        return eyeExpressions[config.expression] || eyeExpressions.neutral;
    }
    
    static generateNose(config) {
        return `
            <ellipse cx="100" cy="118" rx="3" ry="5" fill="${this.darken(config.skinTone, 10)}" opacity="0.6"/>
            <ellipse cx="98" cy="120" rx="1.5" ry="2" fill="${this.darken(config.skinTone, 20)}" opacity="0.5"/>
            <ellipse cx="102" cy="120" rx="1.5" ry="2" fill="${this.darken(config.skinTone, 20)}" opacity="0.5"/>
        `;
    }
    
    static generateMouth(config) {
        const mouthExpressions = {
            neutral: `<ellipse cx="100" cy="135" rx="10" ry="4" fill="#E74C3C" opacity="0.8"/>`,
            smile: `<path d="M88 135 Q100 145 112 135" stroke="#E74C3C" stroke-width="4" 
                          fill="none" stroke-linecap="round"/>`,
            happy: `
                <ellipse cx="100" cy="138" rx="15" ry="10" fill="#E74C3C"/>
                <ellipse cx="100" cy="136" rx="12" ry="8" fill="#F39C12" opacity="0.8"/>
                <rect x="92" y="134" width="16" height="4" rx="2" fill="white"/>
            `,
            wink: `<path d="M90 135 Q100 142 110 135" stroke="#E74C3C" stroke-width="3" 
                         fill="none" stroke-linecap="round"/>`
        };
        
        return mouthExpressions[config.expression] || mouthExpressions.smile;
    }
    
    static generateAccessories(config) {
        let accessories = '';
        
        // Glasses
        if (config.glasses && config.glasses !== 'none') {
            const glassesStyles = {
                clear: `
                    <ellipse cx="85" cy="105" rx="15" ry="12" fill="none" stroke="#2C3E50" stroke-width="2"/>
                    <ellipse cx="115" cy="105" rx="15" ry="12" fill="none" stroke="#2C3E50" stroke-width="2"/>
                    <line x1="100" y1="105" x2="100" y2="105" stroke="#2C3E50" stroke-width="2"/>
                    <ellipse cx="82" cy="100" rx="3" ry="6" fill="white" opacity="0.6"/>
                    <ellipse cx="112" cy="100" rx="3" ry="6" fill="white" opacity="0.6"/>
                `,
                sunglasses: `
                    <ellipse cx="85" cy="105" rx="15" ry="12" fill="#2C3E50" stroke="#34495E" stroke-width="2"/>
                    <ellipse cx="115" cy="105" rx="15" ry="12" fill="#2C3E50" stroke="#34495E" stroke-width="2"/>
                    <line x1="100" y1="105" x2="100" y2="105" stroke="#34495E" stroke-width="3"/>
                    <ellipse cx="82" cy="100" rx="2" ry="4" fill="white" opacity="0.3"/>
                    <ellipse cx="112" cy="100" rx="2" ry="4" fill="white" opacity="0.3"/>
                `,
                round: `
                    <circle cx="85" cy="105" r="15" fill="none" stroke="#2C3E50" stroke-width="2"/>
                    <circle cx="115" cy="105" r="15" fill="none" stroke="#2C3E50" stroke-width="2"/>
                    <line x1="100" y1="105" x2="100" y2="105" stroke="#2C3E50" stroke-width="2"/>
                    <circle cx="82" cy="100" r="3" fill="white" opacity="0.6"/>
                    <circle cx="112" cy="100" r="3" fill="white" opacity="0.6"/>
                `
            };
            accessories += glassesStyles[config.glasses] || '';
        }
        
        // Facial Hair (only for males)
        if (config.gender === 'male' && config.facialHair && config.facialHair !== 'none') {
            const facialHairColor = this.darken(config.hairColor, 20);
            const facialHairStyles = {
                stubble: `
                    <ellipse cx="100" cy="130" rx="20" ry="15" fill="${facialHairColor}" opacity="0.3"/>
                    <circle cx="95" cy="125" r="0.5" fill="${facialHairColor}" opacity="0.6"/>
                    <circle cx="105" cy="125" r="0.5" fill="${facialHairColor}" opacity="0.6"/>
                    <circle cx="90" cy="135" r="0.5" fill="${facialHairColor}" opacity="0.6"/>
                    <circle cx="110" cy="135" r="0.5" fill="${facialHairColor}" opacity="0.6"/>
                `,
                mustache: `
                    <ellipse cx="100" cy="128" rx="12" ry="4" fill="${facialHairColor}"/>
                `,
                goatee: `
                    <ellipse cx="100" cy="145" rx="8" ry="12" fill="${facialHairColor}"/>
                `,
                beard: `
                    <path d="M80 130 Q100 155 120 130 Q120 150 100 160 Q80 150 80 130" 
                          fill="${facialHairColor}"/>
                `
            };
            accessories += facialHairStyles[config.facialHair] || '';
        }
        
        return accessories;
    }
    
    // Utility functions
    static lighten(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
    }
    
    static darken(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
    }
}

// === AVATAR MANAGER ===
class SketchAvatarManager {
    constructor(userId) {
        this.userId = userId;
        this.config = this.getDefaultConfig();
        this.mode = 'realistic';
        this.photoUrl = null;
        this.loadFromStorage();
    }
    
    getDefaultConfig() {
        return {
            gender: 'male',
            skinTone: '#F2D7C0',
            hairColor: '#2C1B18',
            hairStyle: 'short',
            eyeColor: '#8B4513',
            expression: 'smile',
            glasses: 'none',
            facialHair: 'none'
        };
    }
    
    updateConfig(property, value) {
        this.config[property] = value;
        
        // Update hair styles based on gender
        if (property === 'gender') {
            const availableStyles = SketchConfig.hair[value];
            if (!availableStyles.includes(this.config.hairStyle)) {
                this.config.hairStyle = availableStyles[0];
            }
        }
        
        this.saveToStorage();
        return this.config;
    }
    
    setMode(mode) {
        if (['realistic', 'photo'].includes(mode)) {
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
        if (this.mode === 'realistic') {
            return SketchAvatarGenerator.generate(this.config);
        }
        return null;
    }
    
    getDisplayHTML() {
        if (this.mode === 'photo' && this.photoUrl) {
            return `<img src="${this.photoUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        } else {
            return this.generateSVG();
        }
    }
    
    randomize() {
        const gender = SketchConfig.hair[Math.random() > 0.5 ? 'male' : 'female'];
        const genderKey = gender === SketchConfig.hair.male ? 'male' : 'female';
        
        this.config = {
            gender: genderKey,
            skinTone: SketchConfig.skinTones[Math.floor(Math.random() * SketchConfig.skinTones.length)],
            hairColor: SketchConfig.hairColors[Math.floor(Math.random() * SketchConfig.hairColors.length)],
            hairStyle: gender[Math.floor(Math.random() * gender.length)],
            eyeColor: SketchConfig.eyeColors[Math.floor(Math.random() * SketchConfig.eyeColors.length)],
            expression: SketchConfig.expressions[Math.floor(Math.random() * SketchConfig.expressions.length)],
            glasses: SketchConfig.accessories.glasses[Math.floor(Math.random() * SketchConfig.accessories.glasses.length)],
            facialHair: genderKey === 'male' ? 
                SketchConfig.accessories.facial[Math.floor(Math.random() * SketchConfig.accessories.facial.length)] : 'none'
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
            console.log('💾 Avatar sketch salvato');
        } catch (e) {
            console.error('Errore salvataggio:', e);
        }
    }
    
    loadFromStorage() {
        try {
            if (window.avatarStorage && window.avatarStorage[this.userId]) {
                const data = window.avatarStorage[this.userId];
                this.config = data.config || this.getDefaultConfig();
                this.mode = data.mode || 'realistic';
                this.photoUrl = data.photoUrl || null;
                console.log('📂 Avatar sketch caricato');
            }
        } catch (e) {
            console.error('Errore caricamento:', e);
        }
    }
}

// === UI BUILDER SKETCH ===
class SketchAvatarUI {
    constructor(containerId, manager) {
        this.container = document.getElementById(containerId);
        this.manager = manager;
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="sketch-avatar-ui">
                <div class="mode-selector">
                    <button class="mode-btn ${this.manager.mode === 'realistic' ? 'active' : ''}" data-mode="realistic">
                        ✨ Sketch Avatar
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
                    ${this.manager.mode === 'realistic' ? this.buildSketchControls() : this.buildPhotoControls()}
                </div>
                
                <div class="actions">
                    <button class="action-btn" onclick="avatarUI.randomize()">🎲 Randomizza</button>
                    <button class="action-btn primary" onclick="avatarUI.save()">💾 Salva Avatar</button>
                </div>
            </div>
        `;
        
        this.attachEvents();
        this.injectStyles();
    }
    
    buildSketchControls() {
        return `
            <div class="control-section">
                <div class="control-group">
                    <label>👤 Genere</label>
                    <div class="gender-buttons">
                        <button class="gender-btn ${this.manager.config.gender === 'male' ? 'active' : ''}" 
                                data-value="male">🙂 Uomo</button>
                        <button class="gender-btn ${this.manager.config.gender === 'female' ? 'active' : ''}" 
                                data-value="female">😊 Donna</button>
                    </div>
                </div>
                
                <div class="control-group">
                    <label>🎨 Tonalità Pelle</label>
                    <div class="color-grid">
                        ${SketchConfig.skinTones.map(color => 
                            `<div class="color-swatch ${this.manager.config.skinTone === color ? 'active' : ''}" 
                                  data-property="skinTone" data-value="${color}" 
                                  style="background: ${color}"></div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="control-group">
                    <label>💇 Capelli</label>
                    <select id="hairStyle" class="control-select">
                        ${SketchConfig.hair[this.manager.config.gender].map(style => 
                            `<option value="${style}" ${this.manager.config.hairStyle === style ? 'selected' : ''}>${style}</option>`
                        ).join('')}
                    </select>
                    <div class="color-grid">
                        ${SketchConfig.hairColors.map(color => 
                            `<div class="color-swatch ${this.manager.config.hairColor === color ? 'active' : ''}" 
                                  data-property="hairColor" data-value="${color}" 
                                  style="background: ${color}"></div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="control-group">
                    <label>👁️ Occhi</label>
                    <div class="color-grid">
                        ${SketchConfig.eyeColors.map(color => 
                            `<div class="color-swatch ${this.manager.config.eyeColor === color ? 'active' : ''}" 
                                  data-property="eyeColor" data-value="${color}" 
                                  style="background: ${color}"></div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="control-group">
                    <label>😊 Espressione</label>
                    <select id="expression" class="control-select">
                        ${SketchConfig.expressions.map(expr => 
                            `<option value="${expr}" ${this.manager.config.expression === expr ? 'selected' : ''}>${expr}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="control-group">
                    <label>👓 Occhiali</label>
                    <select id="glasses" class="control-select">
                        ${SketchConfig.accessories.glasses.map(type => 
                            `<option value="${type}" ${this.manager.config.glasses === type ? 'selected' : ''}>${type === 'none' ? 'Nessuno' : type}</option>`
                        ).join('')}
                    </select>
                </div>
                
                ${this.manager.config.gender === 'male' ? `
                <div class="control-group">
                    <label>🧔 Peli Facciali</label>
                    <select id="facialHair" class="control-select">
                        ${SketchConfig.accessories.facial.map(type => 
                            `<option value="${type}" ${this.manager.config.facialHair === type ? 'selected' : ''}>${type === 'none' ? 'Nessuno' : type}</option>`
                        ).join('')}
                    </select>
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
                    <div class="photo-upload" id="photoUpload">
                        <input type="file" id="photoInput" accept="image/*" style="display: none;">
                        <div class="upload-area" onclick="document.getElementById('photoInput').click()">
                            <div class="upload-icon">📷</div>
                            <div class="upload-text">Clicca per selezionare</div>
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
        
        // Gender buttons
        this.container.querySelectorAll('.gender-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const gender = e.target.dataset.value;
                this.manager.updateConfig('gender', gender);
                this.refreshControls();
                this.updatePreview();
            });
        });
        
        // Select controls
        this.container.querySelectorAll('select').forEach(select => {
            select.addEventListener('change', (e) => {
                this.manager.updateConfig(e.target.id, e.target.value);
                this.updatePreview();
            });
        });
        
        // Color swatches
        this.container.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                const property = e.target.dataset.property;
                const value = e.target.dataset.value;
                this.manager.updateConfig(property, value);
                this.updatePreview();
                this.updateColorSwatches();
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
        controlsContainer.innerHTML = this.manager.mode === 'realistic' ? 
            this.buildSketchControls() : this.buildPhotoControls();
        this.attachEvents();
    }
    
    updatePreview() {
        const preview = this.container.querySelector('#previewContainer');
        preview.innerHTML = this.manager.getDisplayHTML();
    }
    
    updateColorSwatches() {
        this.container.querySelectorAll('.color-swatch').forEach(swatch => {
            const property = swatch.dataset.property;
            const value = swatch.dataset.value;
            swatch.classList.toggle('active', this.manager.config[property] === value);
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
        if (document.getElementById('sketch-avatar-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'sketch-avatar-styles';
        styles.textContent = `
            .sketch-avatar-ui {
                max-width: 520px;
                margin: 0 auto;
                padding: 25px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.2);
                color: white;
            }
            
            .mode-selector {
                display: flex;
                gap: 12px;
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
                font-weight: 600;
                font-size: 14px;
                transition: all 0.3s ease;
            }
            
            .mode-btn.active {
                background: rgba(255,255,255,0.2);
                box-shadow: 0 4px 15px rgba(255,255,255,0.1);
            }
            
            .mode-btn:hover:not(.active) {
                background: rgba(255,255,255,0.1);
            }
            
            .avatar-preview {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .preview-container {
                width: 160px;
                height: 160px;
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
                border-radius: 15px;
                padding: 20px;
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
                font-weight: 700;
                margin-bottom: 12px;
                color: white;
                font-size: 15px;
            }
            
            .gender-buttons {
                display: flex;
                gap: 10px;
            }
            
            .gender-btn {
                flex: 1;
                padding: 12px;
                border: 2px solid rgba(255,255,255,0.3);
                background: rgba(255,255,255,0.1);
                color: white;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                font-size: 14px;
            }
            
            .gender-btn.active {
                background: rgba(255,255,255,0.2);
                border-color: rgba(255,255,255,0.6);
                box-shadow: 0 4px 15px rgba(255,255,255,0.1);
            }
            
            .control-select {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 10px;
                font-size: 14px;
                background: rgba(255,255,255,0.1);
                color: white;
                font-weight: 500;
                backdrop-filter: blur(10px);
                margin-bottom: 15px;
            }
            
            .control-select:focus {
                outline: none;
                border-color: rgba(255,255,255,0.6);
                box-shadow: 0 0 20px rgba(255,255,255,0.1);
            }
            
            .control-select option {
                background: #2C3E50;
                color: white;
            }
            
            .color-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(45px, 1fr));
                gap: 10px;
            }
            
            .color-swatch {
                width: 45px;
                height: 45px;
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
                box-shadow: 0 4px 20px rgba(243, 156, 18, 0.4);
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
                font-size: 13px;
                opacity: 0.8;
            }
            
            .actions {
                display: flex;
                gap: 15px;
            }
            
            .action-btn {
                flex: 1;
                padding: 15px;
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
            
            @media (max-width: 600px) {
                .sketch-avatar-ui {
                    padding: 20px;
                    margin: 10px;
                }
                
                .preview-container {
                    width: 140px;
                    height: 140px;
                }
                
                .color-grid {
                    grid-template-columns: repeat(4, 1fr);
                }
                
                .color-swatch {
                    width: 40px;
                    height: 40px;
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
        console.log('🚀 Sistema Avatar Sketch Minimalista inizializzato');
        const manager = new SketchAvatarManager(userId);
        return manager;
    }
    
    static createUI(containerId, manager) {
        console.log('🎨 Creazione UI Avatar Sketch');
        return new SketchAvatarUI(containerId, manager);
    }
}

// === ESPOSIZIONE GLOBALE ===
window.RealisticAvatarSystem = RealisticAvatarSystem;
window.SketchAvatarManager = SketchAvatarManager;
window.SketchAvatarUI = SketchAvatarUI;

// Global variable for UI access
window.avatarUI = null;

console.log('✅ Sistema Avatar Sketch Minimalista caricato - PERFETTO!');