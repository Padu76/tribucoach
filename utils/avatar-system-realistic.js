// avatar-system-realistic.js - VISI CSS FOTOGRAFICI
// Sistema per generare visi realistici con CSS puro - ZERO SVG CARTOON

// === CONFIGURAZIONE FOTOGRAFICA ===
const PhotorealisticConfig = {
    skinTones: [
        { name: 'Very Light', base: '#FDBCB4', shadow: '#F1A894', highlight: '#FFFFFF' },
        { name: 'Light', base: '#F7B5A8', shadow: '#E8B895', highlight: '#FFEEE6' },
        { name: 'Medium Light', base: '#E8B895', shadow: '#D5A785', highlight: '#F5E6D3' },
        { name: 'Medium', base: '#D5A785', shadow: '#C89067', highlight: '#E8D5C4' },
        { name: 'Medium Dark', base: '#C89067', shadow: '#B07854', highlight: '#DCC4A8' },
        { name: 'Dark', base: '#B07854', shadow: '#9B6B47', highlight: '#C89067' },
        { name: 'Very Dark', base: '#8B5A3C', shadow: '#6D4426', highlight: '#A0522D' }
    ],
    
    hairColors: [
        { name: 'Black', base: '#2C1B18', highlight: '#3E2723' },
        { name: 'Dark Brown', base: '#5D4037', highlight: '#795548' },
        { name: 'Brown', base: '#8D6E63', highlight: '#A1887F' },
        { name: 'Light Brown', base: '#A1887F', highlight: '#BCAAA4' },
        { name: 'Blonde', base: '#FFD54F', highlight: '#FFF176' },
        { name: 'Auburn', base: '#FF6F00', highlight: '#FF8F00' },
        { name: 'Red', base: '#D84315', highlight: '#FF5722' },
        { name: 'Gray', base: '#9E9E9E', highlight: '#BDBDBD' }
    ],
    
    eyeColors: [
        { name: 'Brown', iris: '#8B4513', pupil: '#2C1B18' },
        { name: 'Hazel', iris: '#CD853F', pupil: '#8B4513' },
        { name: 'Blue', iris: '#4169E1', pupil: '#1E3A8A' },
        { name: 'Green', iris: '#228B22', pupil: '#1B5E20' },
        { name: 'Gray', iris: '#708090', pupil: '#2F4F4F' },
        { name: 'Amber', iris: '#FF8C00', pupil: '#E65100' }
    ],
    
    ages: [
        { value: 'young', label: 'Giovane (18-25)' },
        { value: 'adult', label: 'Adulto (26-45)' },
        { value: 'mature', label: 'Maturo (45+)' }
    ],
    
    genders: [
        { value: 'male', label: 'Uomo' },
        { value: 'female', label: 'Donna' }
    ],
    
    expressions: [
        { value: 'neutral', label: 'Neutrale' },
        { value: 'smile', label: 'Sorriso' },
        { value: 'gentle', label: 'Dolce' },
        { value: 'serious', label: 'Serio' }
    ]
};

// === GENERATORE CSS FOTOGRAFICO ===
class PhotorealisticFaceGenerator {
    static generate(config) {
        const faceId = `face_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        return `
            <div class="photorealistic-face" data-face-id="${faceId}">
                ${this.generateFaceStructure(config, faceId)}
                ${this.generateInlineStyles(config, faceId)}
            </div>
        `;
    }
    
    static generateFaceStructure(config, faceId) {
        return `
            <div class="face-container-${faceId}">
                <!-- Cranio e forma base -->
                <div class="skull-${faceId}"></div>
                
                <!-- Collo -->
                <div class="neck-${faceId}"></div>
                
                <!-- Viso principale -->
                <div class="face-main-${faceId}">
                    <!-- Zona fronte -->
                    <div class="forehead-${faceId}"></div>
                    
                    <!-- Sopracciglia -->
                    <div class="eyebrow-left-${faceId}"></div>
                    <div class="eyebrow-right-${faceId}"></div>
                    
                    <!-- Occhi -->
                    <div class="eye-socket-left-${faceId}">
                        <div class="eyeball-left-${faceId}">
                            <div class="iris-left-${faceId}">
                                <div class="pupil-left-${faceId}"></div>
                                <div class="light-reflection-left-${faceId}"></div>
                            </div>
                        </div>
                        <div class="eyelid-upper-left-${faceId}"></div>
                        <div class="eyelid-lower-left-${faceId}"></div>
                    </div>
                    
                    <div class="eye-socket-right-${faceId}">
                        <div class="eyeball-right-${faceId}">
                            <div class="iris-right-${faceId}">
                                <div class="pupil-right-${faceId}"></div>
                                <div class="light-reflection-right-${faceId}"></div>
                            </div>
                        </div>
                        <div class="eyelid-upper-right-${faceId}"></div>
                        <div class="eyelid-lower-right-${faceId}"></div>
                    </div>
                    
                    <!-- Naso -->
                    <div class="nose-bridge-${faceId}"></div>
                    <div class="nose-tip-${faceId}"></div>
                    <div class="nostril-left-${faceId}"></div>
                    <div class="nostril-right-${faceId}"></div>
                    <div class="nose-shadow-${faceId}"></div>
                    
                    <!-- Bocca -->
                    <div class="mouth-${faceId}">
                        <div class="upper-lip-${faceId}"></div>
                        <div class="lower-lip-${faceId}"></div>
                        <div class="lip-line-${faceId}"></div>
                    </div>
                    
                    <!-- Guanci e struttura -->
                    <div class="cheek-left-${faceId}"></div>
                    <div class="cheek-right-${faceId}"></div>
                    <div class="jaw-left-${faceId}"></div>
                    <div class="jaw-right-${faceId}"></div>
                    
                    <!-- Capelli -->
                    <div class="hair-back-${faceId}"></div>
                    <div class="hair-front-${faceId}"></div>
                    <div class="hair-sides-${faceId}"></div>
                    
                    <!-- Dettagli di età -->
                    ${config.age !== 'young' ? this.generateAgeLines(faceId) : ''}
                    
                    <!-- Texture pelle -->
                    <div class="skin-texture-${faceId}"></div>
                </div>
            </div>
        `;
    }
    
    static generateAgeLines(faceId) {
        return `
            <div class="crow-feet-left-${faceId}"></div>
            <div class="crow-feet-right-${faceId}"></div>
            <div class="forehead-lines-${faceId}"></div>
            <div class="nasolabial-fold-left-${faceId}"></div>
            <div class="nasolabial-fold-right-${faceId}"></div>
        `;
    }
    
    static generateInlineStyles(config, faceId) {
        const skin = config.skinTone;
        const hair = config.hairColor;
        const eye = config.eyeColor;
        
        return `
            <style>
                .face-container-${faceId} {
                    position: relative;
                    width: 180px;
                    height: 180px;
                    margin: 0 auto;
                    background: radial-gradient(circle at 30% 20%, ${skin.highlight}, ${skin.base});
                    border-radius: 50%;
                    overflow: hidden;
                    box-shadow: 
                        inset 0 0 60px rgba(0,0,0,0.1),
                        inset -20px -20px 40px rgba(0,0,0,0.1),
                        0 8px 32px rgba(0,0,0,0.2);
                }
                
                .skull-${faceId} {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    right: 10px;
                    height: 120px;
                    background: radial-gradient(ellipse at 40% 30%, 
                        ${skin.highlight} 0%, 
                        ${skin.base} 40%, 
                        ${skin.shadow} 100%);
                    border-radius: 50% 50% 45% 45%;
                    box-shadow: inset 0 10px 20px rgba(0,0,0,0.05);
                }
                
                .neck-${faceId} {
                    position: absolute;
                    bottom: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 40px;
                    height: 35px;
                    background: linear-gradient(180deg, ${skin.base}, ${skin.shadow});
                    border-radius: 20px 20px 0 0;
                    box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
                }
                
                .face-main-${faceId} {
                    position: absolute;
                    top: 15px;
                    left: 15px;
                    right: 15px;
                    bottom: 15px;
                    border-radius: 50%;
                }
                
                /* === SOPRACCIGLIA === */
                .eyebrow-left-${faceId}, .eyebrow-right-${faceId} {
                    position: absolute;
                    top: 45px;
                    width: 25px;
                    height: 6px;
                    background: linear-gradient(90deg, transparent 0%, ${hair.base} 20%, ${hair.base} 80%, transparent 100%);
                    border-radius: 3px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                }
                
                .eyebrow-left-${faceId} {
                    left: 35px;
                    transform: rotate(-5deg);
                }
                
                .eyebrow-right-${faceId} {
                    right: 35px;
                    transform: rotate(5deg);
                }
                
                /* === OCCHI === */
                .eye-socket-left-${faceId}, .eye-socket-right-${faceId} {
                    position: absolute;
                    top: 55px;
                    width: 32px;
                    height: 20px;
                    background: radial-gradient(ellipse, rgba(0,0,0,0.05) 0%, transparent 70%);
                    border-radius: 50%;
                }
                
                .eye-socket-left-${faceId} { left: 32px; }
                .eye-socket-right-${faceId} { right: 32px; }
                
                .eyeball-left-${faceId}, .eyeball-right-${faceId} {
                    position: absolute;
                    top: 3px;
                    left: 3px;
                    width: 26px;
                    height: 14px;
                    background: radial-gradient(ellipse, #ffffff 0%, #f5f5f5 100%);
                    border-radius: 50%;
                    box-shadow: 
                        inset 0 -2px 4px rgba(0,0,0,0.1),
                        0 1px 3px rgba(0,0,0,0.15);
                }
                
                .iris-left-${faceId}, .iris-right-${faceId} {
                    position: absolute;
                    top: 2px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 12px;
                    height: 12px;
                    background: radial-gradient(circle at 30% 30%, 
                        ${eye.iris} 0%, 
                        ${this.darkenColor(eye.iris, 20)} 70%, 
                        ${this.darkenColor(eye.iris, 40)} 100%);
                    border-radius: 50%;
                    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
                }
                
                .pupil-left-${faceId}, .pupil-right-${faceId} {
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    width: 8px;
                    height: 8px;
                    background: radial-gradient(circle at 30% 30%, #1a1a1a 0%, #000000 100%);
                    border-radius: 50%;
                }
                
                .light-reflection-left-${faceId}, .light-reflection-right-${faceId} {
                    position: absolute;
                    top: 1px;
                    right: 1px;
                    width: 3px;
                    height: 3px;
                    background: radial-gradient(circle, #ffffff 0%, rgba(255,255,255,0.8) 100%);
                    border-radius: 50%;
                }
                
                .eyelid-upper-left-${faceId}, .eyelid-upper-right-${faceId} {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 8px;
                    background: linear-gradient(180deg, ${skin.base} 0%, rgba(${this.hexToRgb(skin.base)}, 0.8) 100%);
                    border-radius: 50% 50% 0 0;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                }
                
                .eyelid-lower-left-${faceId}, .eyelid-lower-right-${faceId} {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(0deg, ${skin.shadow} 0%, rgba(${this.hexToRgb(skin.base)}, 0.5) 100%);
                    border-radius: 0 0 50% 50%;
                }
                
                /* === NASO === */
                .nose-bridge-${faceId} {
                    position: absolute;
                    top: 70px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 8px;
                    height: 25px;
                    background: linear-gradient(180deg, 
                        rgba(${this.hexToRgb(skin.shadow)}, 0.3) 0%, 
                        rgba(${this.hexToRgb(skin.shadow)}, 0.6) 100%);
                    border-radius: 4px;
                    box-shadow: 
                        -1px 0 3px rgba(0,0,0,0.1),
                        1px 0 3px rgba(255,255,255,0.3);
                }
                
                .nose-tip-${faceId} {
                    position: absolute;
                    top: 92px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 14px;
                    height: 10px;
                    background: radial-gradient(ellipse at 50% 30%, 
                        ${skin.highlight} 0%, 
                        ${skin.base} 50%, 
                        ${skin.shadow} 100%);
                    border-radius: 50%;
                    box-shadow: 
                        0 2px 4px rgba(0,0,0,0.1),
                        inset 0 1px 2px rgba(255,255,255,0.3);
                }
                
                .nostril-left-${faceId}, .nostril-right-${faceId} {
                    position: absolute;
                    top: 98px;
                    width: 3px;
                    height: 6px;
                    background: radial-gradient(ellipse, #000000 0%, rgba(0,0,0,0.8) 70%, transparent 100%);
                    border-radius: 50%;
                    box-shadow: inset 0 0 2px rgba(0,0,0,0.5);
                }
                
                .nostril-left-${faceId} { left: 82px; transform: rotate(-15deg); }
                .nostril-right-${faceId} { right: 82px; transform: rotate(15deg); }
                
                .nose-shadow-${faceId} {
                    position: absolute;
                    top: 100px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 20px;
                    height: 8px;
                    background: radial-gradient(ellipse, rgba(0,0,0,0.15) 0%, transparent 70%);
                    border-radius: 50%;
                }
                
                /* === BOCCA === */
                .mouth-${faceId} {
                    position: absolute;
                    top: 115px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 32px;
                    height: 18px;
                }
                
                .upper-lip-${faceId} {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 8px;
                    background: linear-gradient(180deg, 
                        #ff9eb5 0%, 
                        #ff6b9d 50%, 
                        #e74c7c 100%);
                    border-radius: 50% 50% 0 0;
                    ${this.getMouthShape(config.expression, 'upper')}
                }
                
                .lower-lip-${faceId} {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 10px;
                    background: linear-gradient(0deg, 
                        #e74c7c 0%, 
                        #ff6b9d 50%, 
                        #ffb6c1 100%);
                    border-radius: 0 0 50% 50%;
                    box-shadow: 
                        inset 0 1px 3px rgba(255,255,255,0.4),
                        0 1px 2px rgba(0,0,0,0.1);
                    ${this.getMouthShape(config.expression, 'lower')}
                }
                
                .lip-line-${faceId} {
                    position: absolute;
                    top: 7px;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, 
                        transparent 0%, 
                        rgba(0,0,0,0.2) 20%, 
                        rgba(0,0,0,0.3) 50%, 
                        rgba(0,0,0,0.2) 80%, 
                        transparent 100%);
                    ${this.getMouthShape(config.expression, 'line')}
                }
                
                /* === GUANCI === */
                .cheek-left-${faceId}, .cheek-right-${faceId} {
                    position: absolute;
                    top: 80px;
                    width: 25px;
                    height: 25px;
                    background: radial-gradient(circle, rgba(255,182,193,0.3) 0%, transparent 70%);
                    border-radius: 50%;
                }
                
                .cheek-left-${faceId} { left: 20px; }
                .cheek-right-${faceId} { right: 20px; }
                
                /* === CAPELLI === */
                .hair-back-${faceId} {
                    position: absolute;
                    top: -10px;
                    left: 5px;
                    right: 5px;
                    height: 80px;
                    background: radial-gradient(ellipse at 50% 20%, 
                        ${hair.highlight} 0%, 
                        ${hair.base} 60%, 
                        ${this.darkenColor(hair.base, 30)} 100%);
                    border-radius: 50% 50% 30% 30%;
                    box-shadow: 
                        0 4px 15px rgba(0,0,0,0.2),
                        inset 0 5px 15px rgba(255,255,255,0.1);
                }
                
                .hair-front-${faceId} {
                    position: absolute;
                    top: 15px;
                    left: 25px;
                    right: 25px;
                    height: 25px;
                    background: linear-gradient(180deg, 
                        ${hair.base} 0%, 
                        rgba(${this.hexToRgb(hair.base)}, 0.8) 100%);
                    border-radius: 0 0 20px 20px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                }
                
                .hair-sides-${faceId} {
                    position: absolute;
                    top: 20px;
                    left: 8px;
                    width: 15px;
                    height: 40px;
                    background: linear-gradient(90deg, 
                        ${hair.base} 0%, 
                        rgba(${this.hexToRgb(hair.base)}, 0.6) 100%);
                    border-radius: 0 15px 15px 0;
                    box-shadow: 2px 0 8px rgba(0,0,0,0.1);
                }
                
                .hair-sides-${faceId}::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    right: -142px;
                    width: 15px;
                    height: 40px;
                    background: linear-gradient(-90deg, 
                        ${hair.base} 0%, 
                        rgba(${this.hexToRgb(hair.base)}, 0.6) 100%);
                    border-radius: 15px 0 0 15px;
                    box-shadow: -2px 0 8px rgba(0,0,0,0.1);
                }
                
                /* === TEXTURE PELLE === */
                .skin-texture-${faceId} {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: 
                        radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 1px, transparent 1px),
                        radial-gradient(circle at 80% 70%, rgba(0,0,0,0.05) 1px, transparent 1px),
                        radial-gradient(circle at 60% 20%, rgba(255,255,255,0.08) 1px, transparent 1px);
                    background-size: 20px 20px, 15px 15px, 25px 25px;
                    opacity: 0.6;
                    border-radius: 50%;
                }
                
                /* === RUGHE DI ETÀ === */
                ${config.age !== 'young' ? this.generateAgeStyles(faceId, skin) : ''}
                
                /* === ESPRESSIONI === */
                ${this.getExpressionStyles(config.expression, faceId)}
            </style>
        `;
    }
    
    static getMouthShape(expression, part) {
        const shapes = {
            neutral: {
                upper: '',
                lower: '',
                line: ''
            },
            smile: {
                upper: 'transform: translateY(-1px); border-radius: 60% 60% 40% 40%;',
                lower: 'transform: translateY(1px); border-radius: 40% 40% 60% 60%;',
                line: 'border-radius: 50px; transform: translateY(-1px);'
            },
            gentle: {
                upper: 'border-radius: 55% 55% 35% 35%;',
                lower: 'border-radius: 35% 35% 55% 55%;',
                line: 'border-radius: 30px;'
            },
            serious: {
                upper: 'border-radius: 30% 30% 0 0;',
                lower: 'border-radius: 0 0 30% 30%;',
                line: 'border-radius: 0;'
            }
        };
        
        return shapes[expression]?.[part] || '';
    }
    
    static getExpressionStyles(expression, faceId) {
        if (expression === 'smile') {
            return `
                .cheek-left-${faceId}, .cheek-right-${faceId} {
                    background: radial-gradient(circle, rgba(255,182,193,0.5) 0%, transparent 70%);
                }
                
                .eyebrow-left-${faceId} { transform: rotate(-3deg) translateY(-1px); }
                .eyebrow-right-${faceId} { transform: rotate(3deg) translateY(-1px); }
            `;
        }
        return '';
    }
    
    static generateAgeStyles(faceId, skin) {
        return `
            .crow-feet-left-${faceId}, .crow-feet-right-${faceId} {
                position: absolute;
                top: 58px;
                width: 12px;
                height: 8px;
                background: linear-gradient(45deg, 
                    transparent 0%, 
                    rgba(0,0,0,0.1) 30%, 
                    transparent 60%);
            }
            
            .crow-feet-left-${faceId} { left: 25px; }
            .crow-feet-right-${faceId} { right: 25px; transform: scaleX(-1); }
            
            .forehead-lines-${faceId} {
                position: absolute;
                top: 35px;
                left: 30px;
                right: 30px;
                height: 2px;
                background: linear-gradient(90deg, 
                    transparent 0%, 
                    rgba(0,0,0,0.08) 50%, 
                    transparent 100%);
                border-radius: 1px;
            }
            
            .nasolabial-fold-left-${faceId}, .nasolabial-fold-right-${faceId} {
                position: absolute;
                top: 85px;
                width: 2px;
                height: 25px;
                background: linear-gradient(180deg, 
                    transparent 0%, 
                    rgba(0,0,0,0.1) 50%, 
                    transparent 100%);
                border-radius: 1px;
                transform: rotate(15deg);
            }
            
            .nasolabial-fold-left-${faceId} { left: 70px; }
            .nasolabial-fold-right-${faceId} { right: 70px; transform: rotate(-15deg); }
        `;
    }
    
    // Utility functions
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
            '0, 0, 0';
    }
    
    static darkenColor(hex, percent) {
        const num = parseInt(hex.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
    }
}

// === MANAGER FOTOGRAFICO ===
class PhotorealisticFaceManager {
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
            age: 'adult',
            skinTone: PhotorealisticConfig.skinTones[0],
            hairColor: PhotorealisticConfig.hairColors[0],
            eyeColor: PhotorealisticConfig.eyeColors[0],
            expression: 'gentle'
        };
    }
    
    updateConfig(property, value) {
        this.config[property] = value;
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
    
    generateHTML() {
        if (this.mode === 'realistic') {
            return PhotorealisticFaceGenerator.generate(this.config);
        }
        return null;
    }
    
    getDisplayHTML() {
        if (this.mode === 'photo' && this.photoUrl) {
            return `<img src="${this.photoUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" alt="Avatar Photo">`;
        } else {
            return this.generateHTML();
        }
    }
    
    randomize() {
        this.config = {
            gender: Math.random() > 0.5 ? 'male' : 'female',
            age: PhotorealisticConfig.ages[Math.floor(Math.random() * PhotorealisticConfig.ages.length)].value,
            skinTone: PhotorealisticConfig.skinTones[Math.floor(Math.random() * PhotorealisticConfig.skinTones.length)],
            hairColor: PhotorealisticConfig.hairColors[Math.floor(Math.random() * PhotorealisticConfig.hairColors.length)],
            eyeColor: PhotorealisticConfig.eyeColors[Math.floor(Math.random() * PhotorealisticConfig.eyeColors.length)],
            expression: PhotorealisticConfig.expressions[Math.floor(Math.random() * PhotorealisticConfig.expressions.length)].value
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
            console.log('💾 Avatar fotografico salvato:', this.config);
        } catch (e) {
            console.error('Errore salvataggio avatar:', e);
        }
    }
    
    loadFromStorage() {
        try {
            if (window.avatarStorage && window.avatarStorage[this.userId]) {
                const data = window.avatarStorage[this.userId];
                this.config = { ...this.getDefaultConfig(), ...data.config };
                this.mode = data.mode || 'realistic';
                this.photoUrl = data.photoUrl || null;
                console.log('📂 Avatar fotografico caricato:', this.config);
            }
        } catch (e) {
            console.error('Errore caricamento avatar:', e);
        }
    }
}

// === UI FOTOGRAFICA ===
class PhotorealisticFaceUI {
    constructor(containerId, manager) {
        this.container = document.getElementById(containerId);
        this.manager = manager;
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="photorealistic-ui">
                <div class="mode-selector">
                    <button class="mode-btn ${this.manager.mode === 'realistic' ? 'active' : ''}" data-mode="realistic">
                        👤 Viso Fotografico
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
                    ${this.manager.mode === 'realistic' ? this.buildPhotorealisticControls() : this.buildPhotoControls()}
                </div>
                
                <div class="actions">
                    <button class="action-btn" onclick="window.avatarUI.randomize()">🎲 Volto Casuale</button>
                    <button class="action-btn primary" onclick="window.avatarUI.save()">💾 Salva Avatar</button>
                </div>
            </div>
        `;
        
        this.attachEvents();
        this.injectStyles();
    }
    
    buildPhotorealisticControls() {
        return `
            <div class="control-section">
                <div class="control-group">
                    <label>👤 Genere</label>
                    <div class="button-group">
                        ${PhotorealisticConfig.genders.map(gender => 
                            `<button class="option-btn ${this.manager.config.gender === gender.value ? 'active' : ''}" 
                                    data-property="gender" data-value="${gender.value}">
                                ${gender.label}
                            </button>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="control-group">
                    <label>🎂 Età</label>
                    <div class="button-group">
                        ${PhotorealisticConfig.ages.map(age => 
                            `<button class="option-btn ${this.manager.config.age === age.value ? 'active' : ''}" 
                                    data-property="age" data-value="${age.value}">
                                ${age.label}
                            </button>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="control-group">
                    <label>🎨 Tonalità Pelle</label>
                    <div class="color-grid">
                        ${PhotorealisticConfig.skinTones.map((tone, index) => 
                            `<div class="color-swatch ${this.manager.config.skinTone === tone ? 'active' : ''}" 
                                  data-property="skinTone" data-value="${index}" 
                                  style="background: linear-gradient(45deg, ${tone.base}, ${tone.highlight});" 
                                  title="${tone.name}"></div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="control-group">
                    <label>💇 Colore Capelli</label>
                    <div class="color-grid">
                        ${PhotorealisticConfig.hairColors.map((hair, index) => 
                            `<div class="color-swatch ${this.manager.config.hairColor === hair ? 'active' : ''}" 
                                  data-property="hairColor" data-value="${index}" 
                                  style="background: linear-gradient(45deg, ${hair.base}, ${hair.highlight});" 
                                  title="${hair.name}"></div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="control-group">
                    <label>👁️ Colore Occhi</label>
                    <div class="color-grid">
                        ${PhotorealisticConfig.eyeColors.map((eye, index) => 
                            `<div class="color-swatch ${this.manager.config.eyeColor === eye ? 'active' : ''}" 
                                  data-property="eyeColor" data-value="${index}" 
                                  style="background: radial-gradient(circle, ${eye.iris}, ${eye.pupil});" 
                                  title="${eye.name}"></div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="control-group">
                    <label>😊 Espressione</label>
                    <div class="button-group">
                        ${PhotorealisticConfig.expressions.map(expr => 
                            `<button class="option-btn ${this.manager.config.expression === expr.value ? 'active' : ''}" 
                                    data-property="expression" data-value="${expr.value}">
                                ${expr.label}
                            </button>`
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
                const index = parseInt(e.target.dataset.value);
                this.updateColorProperty(property, index);
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
                value = PhotorealisticConfig.skinTones[index];
                break;
            case 'hairColor':
                value = PhotorealisticConfig.hairColors[index];
                break;
            case 'eyeColor':
                value = PhotorealisticConfig.eyeColors[index];
                break;
        }
        
        this.manager.updateConfig(property, value);
        this.updatePreview();
        this.updateColorSwatches();
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
            this.buildPhotorealisticControls() : this.buildPhotoControls();
        this.attachEvents();
    }
    
    updatePreview() {
        const preview = this.container.querySelector('#previewContainer');
        preview.innerHTML = this.manager.getDisplayHTML();
    }
    
    updateColorSwatches() {
        this.container.querySelectorAll('.color-swatch').forEach(swatch => {
            const property = swatch.dataset.property;
            const index = parseInt(swatch.dataset.value);
            
            let isActive = false;
            switch(property) {
                case 'skinTone':
                    isActive = this.manager.config.skinTone === PhotorealisticConfig.skinTones[index];
                    break;
                case 'hairColor':
                    isActive = this.manager.config.hairColor === PhotorealisticConfig.hairColors[index];
                    break;
                case 'eyeColor':
                    isActive = this.manager.config.eyeColor === PhotorealisticConfig.eyeColors[index];
                    break;
            }
            
            swatch.classList.toggle('active', isActive);
        });
    }
    
    randomize() {
        this.manager.randomize();
        this.refreshControls();
        this.updatePreview();
        this.showNotification('🎲 Volto randomizzato!');
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
        if (document.getElementById('photorealistic-face-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'photorealistic-face-styles';
        styles.textContent = `
            .photorealistic-ui {
                max-width: 650px;
                margin: 0 auto;
                padding: 35px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 30px;
                box-shadow: 0 30px 100px rgba(0,0,0,0.4);
                color: white;
                position: relative;
                overflow: hidden;
            }
            
            .photorealistic-ui::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);
                pointer-events: none;
            }
            
            .mode-selector {
                display: flex;
                gap: 18px;
                margin-bottom: 35px;
                background: rgba(255,255,255,0.12);
                padding: 12px;
                border-radius: 20px;
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255,255,255,0.2);
            }
            
            .mode-btn {
                flex: 1;
                padding: 20px;
                border: none;
                background: transparent;
                color: white;
                border-radius: 15px;
                cursor: pointer;
                font-weight: 800;
                font-size: 16px;
                transition: all 0.4s ease;
                position: relative;
                overflow: hidden;
            }
            
            .mode-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.6s;
            }
            
            .mode-btn:hover::before {
                left: 100%;
            }
            
            .mode-btn.active {
                background: rgba(255,255,255,0.3);
                box-shadow: 0 8px 25px rgba(255,255,255,0.2);
                transform: translateY(-3px);
            }
            
            .mode-btn:hover:not(.active) {
                background: rgba(255,255,255,0.18);
                transform: translateY(-1px);
            }
            
            .avatar-preview {
                text-align: center;
                margin-bottom: 40px;
            }
            
            .preview-container {
                width: 200px;
                height: 200px;
                margin: 0 auto;
                border: 6px solid rgba(255,255,255,0.5);
                border-radius: 50%;
                overflow: hidden;
                background: white;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 
                    0 25px 80px rgba(0,0,0,0.4),
                    inset 0 0 0 2px rgba(255,255,255,0.3);
                transition: transform 0.5s ease;
                position: relative;
            }
            
            .preview-container:hover {
                transform: scale(1.1) rotate(5deg);
                box-shadow: 
                    0 35px 100px rgba(0,0,0,0.5),
                    inset 0 0 0 2px rgba(255,255,255,0.5);
            }
            
            .control-section {
                background: rgba(255,255,255,0.15);
                border-radius: 25px;
                padding: 30px;
                margin-bottom: 35px;
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255,255,255,0.25);
                box-shadow: inset 0 1px 1px rgba(255,255,255,0.2);
            }
            
            .control-group {
                margin-bottom: 30px;
            }
            
            .control-group:last-child {
                margin-bottom: 0;
            }
            
            .control-group label {
                display: block;
                font-weight: 900;
                margin-bottom: 18px;
                color: white;
                font-size: 18px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                letter-spacing: 0.5px;
            }
            
            .button-group {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
            }
            
            .option-btn {
                flex: 1;
                min-width: 120px;
                padding: 18px;
                border: 3px solid rgba(255,255,255,0.4);
                background: rgba(255,255,255,0.15);
                color: white;
                border-radius: 15px;
                cursor: pointer;
                font-weight: 800;
                transition: all 0.4s ease;
                font-size: 15px;
                position: relative;
                overflow: hidden;
            }
            
            .option-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                transition: left 0.5s;
            }
            
            .option-btn:hover::before {
                left: 100%;
            }
            
            .option-btn.active {
                background: rgba(255,255,255,0.35);
                border-color: rgba(255,255,255,0.8);
                box-shadow: 0 8px 30px rgba(255,255,255,0.2);
                transform: translateY(-3px);
            }
            
            .option-btn:hover:not(.active) {
                background: rgba(255,255,255,0.25);
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(255,255,255,0.15);
            }
            
            .color-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(55px, 1fr));
                gap: 15px;
            }
            
            .color-swatch {
                width: 55px;
                height: 55px;
                border-radius: 18px;
                cursor: pointer;
                border: 4px solid rgba(255,255,255,0.5);
                transition: all 0.4s ease;
                position: relative;
                box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            }
            
            .color-swatch:hover {
                transform: scale(1.2) rotate(8deg);
                border-color: rgba(255,255,255,0.9);
                box-shadow: 0 10px 35px rgba(0,0,0,0.4);
            }
            
            .color-swatch.active {
                border-color: #F39C12;
                transform: scale(1.25);
                box-shadow: 0 12px 40px rgba(243, 156, 18, 0.8);
            }
            
            .color-swatch.active::after {
                content: '✓';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-weight: bold;
                font-size: 20px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            }
            
            .photo-upload {
                border: 4px dashed rgba(255,255,255,0.6);
                border-radius: 25px;
                padding: 50px 40px;
                text-align: center;
                cursor: pointer;
                transition: all 0.4s ease;
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(15px);
            }
            
            .photo-upload:hover {
                border-color: rgba(255,255,255,0.9);
                background: rgba(255,255,255,0.2);
                transform: translateY(-5px);
                box-shadow: 0 15px 40px rgba(0,0,0,0.3);
            }
            
            .upload-icon {
                font-size: 60px;
                margin-bottom: 25px;
            }
            
            .upload-text {
                font-size: 20px;
                font-weight: 800;
                margin-bottom: 12px;
            }
            
            .upload-hint {
                font-size: 15px;
                opacity: 0.9;
                font-weight: 600;
            }
            
            .actions {
                display: flex;
                gap: 20px;
            }
            
            .action-btn {
                flex: 1;
                padding: 22px;
                border: 3px solid rgba(255,255,255,0.5);
                background: rgba(255,255,255,0.2);
                color: white;
                border-radius: 18px;
                cursor: pointer;
                font-weight: 900;
                font-size: 16px;
                transition: all 0.4s ease;
                backdrop-filter: blur(15px);
                position: relative;
                overflow: hidden;
            }
            
            .action-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                transition: left 0.6s;
            }
            
            .action-btn:hover::before {
                left: 100%;
            }
            
            .action-btn:hover {
                transform: translateY(-4px);
                box-shadow: 0 15px 50px rgba(255,255,255,0.2);
                background: rgba(255,255,255,0.3);
            }
            
            .action-btn.primary {
                background: linear-gradient(135deg, #F39C12, #E67E22);
                border-color: #F39C12;
                box-shadow: 0 10px 35px rgba(243, 156, 18, 0.5);
            }
            
            .action-btn.primary:hover {
                box-shadow: 0 18px 60px rgba(243, 156, 18, 0.7);
                transform: translateY(-6px);
            }
            
            @media (max-width: 750px) {
                .photorealistic-ui {
                    padding: 25px;
                    margin: 20px;
                }
                
                .preview-container {
                    width: 170px;
                    height: 170px;
                }
                
                .color-grid {
                    grid-template-columns: repeat(4, 1fr);
                }
                
                .color-swatch {
                    width: 50px;
                    height: 50px;
                }
                
                .actions {
                    flex-direction: column;
                }
                
                .button-group {
                    flex-direction: column;
                }
                
                .option-btn {
                    min-width: auto;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// === SISTEMA PRINCIPALE ===
class RealisticAvatarSystem {
    static init(userId) {
        console.log('🎨 Sistema Avatar CSS Fotografico inizializzato per:', userId);
        const manager = new PhotorealisticFaceManager(userId);
        return manager;
    }
    
    static createUI(containerId, manager) {
        console.log('📸 Creazione UI Avatar CSS Fotografico per container:', containerId);
        const ui = new PhotorealisticFaceUI(containerId, manager);
        // Store reference globally for button actions
        window.avatarUI = ui;
        return ui;
    }
}

// === ESPOSIZIONE GLOBALE ===
window.RealisticAvatarSystem = RealisticAvatarSystem;
window.PhotorealisticFaceManager = PhotorealisticFaceManager;
window.PhotorealisticFaceUI = PhotorealisticFaceUI;

console.log('✅ Sistema Avatar CSS FOTOGRAFICO caricato - ZERO SVG CARTOON!');