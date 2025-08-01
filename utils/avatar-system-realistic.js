// avatar-system-realistic.js - VISI REALISTICI FOTOGRAFICI
// Sistema per generare solo visi che sembrano foto vere

// === CONFIGURAZIONE REALISTICA ===
const RealisticFaceConfig = {
    skinTones: [
        '#FDBCB4', '#F7B5A8', '#F1A894', '#E8B895', '#E5A889', 
        '#D5A785', '#C89067', '#B07854', '#9B6B47', '#8B5A3C'
    ],
    
    hairColors: [
        '#2C1B18', '#3E2723', '#5D4037', '#6D4C41', '#795548',
        '#8D6E63', '#A1887F', '#BCAAA4', '#D7CCC8', '#EFEBE9',
        '#FFD54F', '#FFC107', '#FF8F00', '#FF6F00', '#8B4513'
    ],
    
    eyeColors: [
        '#8B4513', '#A0522D', '#CD853F', '#DEB887',
        '#0066CC', '#4169E1', '#1E90FF', '#87CEEB',
        '#228B22', '#32CD32', '#9ACD32', '#6B8E23',
        '#8B008B', '#9370DB', '#BA55D3', '#4B0082'
    ],
    
    ages: ['young', 'adult', 'mature'],
    genders: ['male', 'female'],
    expressions: ['neutral', 'smile', 'slight_smile', 'serious'],
    
    hairStyles: {
        male: ['short', 'buzz', 'wavy', 'curly', 'bald', 'receding'],
        female: ['long', 'shoulder', 'bob', 'curly', 'wavy', 'pixie']
    },
    
    features: {
        eyeShape: ['almond', 'round', 'narrow', 'wide'],
        noseShape: ['straight', 'button', 'aquiline', 'wide'],
        faceShape: ['oval', 'round', 'square', 'heart'],
        jawline: ['soft', 'defined', 'strong', 'rounded']
    }
};

// === GENERATORE VISI REALISTICI ===
class RealisticFaceGenerator {
    static generate(config) {
        const faceId = `face_${Date.now()}`;
        
        return `
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
        ${this.generateRealisticGradients(config, faceId)}
        ${this.generateFilters(faceId)}
    </defs>
    
    <!-- Sfondo Naturale -->
    <circle cx="100" cy="100" r="95" fill="url(#bg-gradient-${faceId})" />
    
    <!-- Collo (solo parte superiore) -->
    ${this.generateNeck(config, faceId)}
    
    <!-- Forma del Viso -->
    ${this.generateFaceShape(config, faceId)}
    
    <!-- Capelli Retro -->
    ${this.generateHairBack(config, faceId)}
    
    <!-- Orecchie -->
    ${this.generateEars(config, faceId)}
    
    <!-- Sopracciglia -->
    ${this.generateEyebrows(config, faceId)}
    
    <!-- Occhi Realistici -->
    ${this.generateRealisticEyes(config, faceId)}
    
    <!-- Naso Realistico -->
    ${this.generateRealisticNose(config, faceId)}
    
    <!-- Bocca Realistica -->
    ${this.generateRealisticMouth(config, faceId)}
    
    <!-- Capelli Fronte -->
    ${this.generateHairFront(config, faceId)}
    
    <!-- Dettagli di Età -->
    ${this.generateAgeDetails(config, faceId)}
    
    <!-- Texture Pelle -->
    ${this.generateSkinTexture(config, faceId)}
</svg>`;
    }
    
    static generateRealisticGradients(config, faceId) {
        const baseSkin = config.skinTone;
        const lightSkin = this.adjustColor(baseSkin, 20);
        const darkSkin = this.adjustColor(baseSkin, -15);
        const shadowSkin = this.adjustColor(baseSkin, -30);
        
        return `
            <!-- Gradiente Sfondo -->
            <radialGradient id="bg-gradient-${faceId}" cx="0.5" cy="0.3" r="0.8">
                <stop offset="0%" stop-color="#F0F4F8"/>
                <stop offset="100%" stop-color="#E2E8F0"/>
            </radialGradient>
            
            <!-- Gradiente Viso Principale -->
            <radialGradient id="face-main-${faceId}" cx="0.35" cy="0.25" r="0.9">
                <stop offset="0%" stop-color="${lightSkin}"/>
                <stop offset="40%" stop-color="${baseSkin}"/>
                <stop offset="85%" stop-color="${darkSkin}"/>
                <stop offset="100%" stop-color="${shadowSkin}"/>
            </radialGradient>
            
            <!-- Gradiente Ombre Viso -->
            <linearGradient id="face-shadow-${faceId}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${baseSkin}" stop-opacity="0"/>
                <stop offset="70%" stop-color="${shadowSkin}" stop-opacity="0.4"/>
                <stop offset="100%" stop-color="${shadowSkin}" stop-opacity="0.7"/>
            </linearGradient>
            
            <!-- Gradiente Capelli -->
            <radialGradient id="hair-gradient-${faceId}" cx="0.3" cy="0.2" r="0.8">
                <stop offset="0%" stop-color="${this.adjustColor(config.hairColor, 30)}"/>
                <stop offset="60%" stop-color="${config.hairColor}"/>
                <stop offset="100%" stop-color="${this.adjustColor(config.hairColor, -40)}"/>
            </radialGradient>
            
            <!-- Gradiente Labbra -->
            <radialGradient id="lips-gradient-${faceId}" cx="0.5" cy="0.3" r="0.7">
                <stop offset="0%" stop-color="#FFB6C1"/>
                <stop offset="70%" stop-color="#FF69B4"/>
                <stop offset="100%" stop-color="#DC143C"/>
            </radialGradient>
        `;
    }
    
    static generateFilters(faceId) {
        return `
            <filter id="soft-shadow-${faceId}" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="2" dy="3" stdDeviation="4" flood-opacity="0.3"/>
            </filter>
            
            <filter id="inner-shadow-${faceId}" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="-1" dy="-1" stdDeviation="2" flood-opacity="0.2"/>
            </filter>
            
            <filter id="glow-${faceId}" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="white" flood-opacity="0.5"/>
            </filter>
        `;
    }
    
    static generateNeck(config, faceId) {
        return `
            <ellipse cx="100" cy="185" rx="25" ry="18" 
                     fill="url(#face-main-${faceId})" 
                     filter="url(#soft-shadow-${faceId})"/>
        `;
    }
    
    static generateFaceShape(config, faceId) {
        const shapes = {
            oval: { rx: 38, ry: 52, cy: 110 },
            round: { rx: 42, ry: 48, cy: 112 },
            square: { rx: 40, ry: 50, cy: 110 },
            heart: { rx: 36, ry: 54, cy: 108 }
        };
        
        const shape = shapes[config.faceShape] || shapes.oval;
        
        return `
            <!-- Viso Base -->
            <ellipse cx="100" cy="${shape.cy}" rx="${shape.rx}" ry="${shape.ry}" 
                     fill="url(#face-main-${faceId})" 
                     filter="url(#soft-shadow-${faceId})"/>
            
            <!-- Ombre Naturali -->
            <ellipse cx="85" cy="${shape.cy + 15}" rx="8" ry="12" 
                     fill="url(#face-shadow-${faceId})" opacity="0.3"/>
            <ellipse cx="115" cy="${shape.cy + 15}" rx="8" ry="12" 
                     fill="url(#face-shadow-${faceId})" opacity="0.3"/>
            
            <!-- Evidenziature -->
            <ellipse cx="95" cy="${shape.cy - 15}" rx="12" ry="8" 
                     fill="white" opacity="0.2"/>
            <ellipse cx="105" cy="${shape.cy - 15}" rx="12" ry="8" 
                     fill="white" opacity="0.15"/>
        `;
    }
    
    static generateHairBack(config, faceId) {
        if (config.hairStyle === 'bald') return '';
        
        const hairStyles = {
            // MASCHILI
            short: `
                <path d="M65 75 Q100 50 135 75 L140 95 Q100 70 60 95 Z" 
                      fill="url(#hair-gradient-${faceId})" 
                      filter="url(#soft-shadow-${faceId})"/>
            `,
            buzz: `
                <path d="M70 80 Q100 60 130 80 L125 90 Q100 75 75 90 Z" 
                      fill="url(#hair-gradient-${faceId})" 
                      filter="url(#soft-shadow-${faceId})"/>
            `,
            wavy: `
                <path d="M60 78 Q80 65 100 78 Q120 65 140 78 L135 100 Q100 75 65 100 Z" 
                      fill="url(#hair-gradient-${faceId})" 
                      filter="url(#soft-shadow-${faceId})"/>
            `,
            curly: `
                <circle cx="85" cy="75" r="12" fill="url(#hair-gradient-${faceId})" opacity="0.9"/>
                <circle cx="100" cy="68" r="15" fill="url(#hair-gradient-${faceId})"/>
                <circle cx="115" cy="75" r="12" fill="url(#hair-gradient-${faceId})" opacity="0.9"/>
                <circle cx="75" cy="85" r="10" fill="url(#hair-gradient-${faceId})" opacity="0.8"/>
                <circle cx="125" cy="85" r="10" fill="url(#hair-gradient-${faceId})" opacity="0.8"/>
            `,
            receding: `
                <path d="M75 85 Q100 65 125 85 L120 95 Q100 80 80 95 Z" 
                      fill="url(#hair-gradient-${faceId})" 
                      filter="url(#soft-shadow-${faceId})"/>
            `,
            
            // FEMMINILI
            long: `
                <path d="M55 75 Q100 45 145 75 L150 130 Q100 90 50 130 Z" 
                      fill="url(#hair-gradient-${faceId})" 
                      filter="url(#soft-shadow-${faceId})"/>
            `,
            shoulder: `
                <path d="M60 75 Q100 50 140 75 L145 110 Q100 80 55 110 Z" 
                      fill="url(#hair-gradient-${faceId})" 
                      filter="url(#soft-shadow-${faceId})"/>
            `,
            bob: `
                <path d="M65 75 Q100 55 135 75 L140 105 Q100 80 60 105 Z" 
                      fill="url(#hair-gradient-${faceId})" 
                      filter="url(#soft-shadow-${faceId})"/>
            `,
            pixie: `
                <path d="M70 80 Q100 65 130 80 L125 95 Q100 80 75 95 Z" 
                      fill="url(#hair-gradient-${faceId})" 
                      filter="url(#soft-shadow-${faceId})"/>
            `
        };
        
        return hairStyles[config.hairStyle] || hairStyles.short;
    }
    
    static generateHairFront(config, faceId) {
        if (config.hairStyle === 'bald') return '';
        
        const frontHair = {
            short: `<path d="M75 85 Q100 80 125 85" stroke="url(#hair-gradient-${faceId})" stroke-width="3" fill="none"/>`,
            wavy: `<path d="M70 88 Q90 83 110 88 Q125 83 130 88" stroke="url(#hair-gradient-${faceId})" stroke-width="2" fill="none"/>`,
            long: `<path d="M55 105 L55 115 M145 105 L145 115" stroke="url(#hair-gradient-${faceId})" stroke-width="4"/>`,
            bob: `<path d="M60 100 Q100 95 140 100" stroke="url(#hair-gradient-${faceId})" stroke-width="3" fill="none"/>`
        };
        
        return frontHair[config.hairStyle] || '';
    }
    
    static generateEars(config, faceId) {
        return `
            <!-- Orecchio Sinistro -->
            <ellipse cx="65" cy="110" rx="8" ry="15" 
                     fill="url(#face-main-${faceId})" 
                     filter="url(#inner-shadow-${faceId})"/>
            <ellipse cx="67" cy="110" rx="4" ry="8" 
                     fill="${this.adjustColor(config.skinTone, -10)}" opacity="0.6"/>
            
            <!-- Orecchio Destro -->
            <ellipse cx="135" cy="110" rx="8" ry="15" 
                     fill="url(#face-main-${faceId})" 
                     filter="url(#inner-shadow-${faceId})"/>
            <ellipse cx="133" cy="110" rx="4" ry="8" 
                     fill="${this.adjustColor(config.skinTone, -10)}" opacity="0.6"/>
        `;
    }
    
    static generateEyebrows(config, faceId) {
        const browColor = this.adjustColor(config.hairColor, -20);
        const thickness = config.gender === 'male' ? 4 : 3;
        
        return `
            <!-- Sopracciglio Sinistro -->
            <path d="M75 92 Q85 89 95 92" 
                  stroke="${browColor}" stroke-width="${thickness}" 
                  fill="none" stroke-linecap="round"/>
            
            <!-- Sopracciglio Destro -->
            <path d="M105 92 Q115 89 125 92" 
                  stroke="${browColor}" stroke-width="${thickness}" 
                  fill="none" stroke-linecap="round"/>
        `;
    }
    
    static generateRealisticEyes(config, faceId) {
        const eyeShapes = {
            almond: { rx: 12, ry: 7 },
            round: { rx: 10, ry: 10 },
            narrow: { rx: 14, ry: 6 },
            wide: { rx: 13, ry: 9 }
        };
        
        const shape = eyeShapes[config.eyeShape] || eyeShapes.almond;
        
        const expressions = {
            neutral: {
                leftEye: `<ellipse cx="85" cy="105" rx="${shape.rx}" ry="${shape.ry}" fill="white" stroke="#DDD" stroke-width="0.5"/>`,
                rightEye: `<ellipse cx="115" cy="105" rx="${shape.rx}" ry="${shape.ry}" fill="white" stroke="#DDD" stroke-width="0.5"/>`
            },
            smile: {
                leftEye: `<path d="M73 105 Q85 100 97 105 Q85 108 73 105" fill="white" stroke="#DDD" stroke-width="0.5"/>`,
                rightEye: `<path d="M103 105 Q115 100 127 105 Q115 108 103 105" fill="white" stroke="#DDD" stroke-width="0.5"/>`
            },
            slight_smile: {
                leftEye: `<ellipse cx="85" cy="105" rx="${shape.rx}" ry="${shape.ry - 1}" fill="white" stroke="#DDD" stroke-width="0.5"/>`,
                rightEye: `<ellipse cx="115" cy="105" rx="${shape.rx}" ry="${shape.ry - 1}" fill="white" stroke="#DDD" stroke-width="0.5"/>`
            },
            serious: {
                leftEye: `<ellipse cx="85" cy="105" rx="${shape.rx}" ry="${shape.ry}" fill="white" stroke="#DDD" stroke-width="0.5"/>`,
                rightEye: `<ellipse cx="115" cy="105" rx="${shape.rx}" ry="${shape.ry}" fill="white" stroke="#DDD" stroke-width="0.5"/>`
            }
        };
        
        const eyeExpr = expressions[config.expression] || expressions.neutral;
        
        return `
            <!-- Occhi Base -->
            ${eyeExpr.leftEye}
            ${eyeExpr.rightEye}
            
            <!-- Iridi -->
            <circle cx="85" cy="105" r="6" fill="${config.eyeColor}"/>
            <circle cx="115" cy="105" r="6" fill="${config.eyeColor}"/>
            
            <!-- Pupille -->
            <circle cx="85" cy="105" r="3" fill="#2C3E50"/>
            <circle cx="115" cy="105" r="3" fill="#2C3E50"/>
            
            <!-- Riflessi -->
            <circle cx="86.5" cy="102.5" r="2" fill="white" opacity="0.8"/>
            <circle cx="116.5" cy="102.5" r="2" fill="white" opacity="0.8"/>
            <circle cx="87.5" cy="106" r="1" fill="white" opacity="0.6"/>
            <circle cx="117.5" cy="106" r="1" fill="white" opacity="0.6"/>
            
            <!-- Ciglia -->
            <path d="M73 100 Q85 98 97 100" stroke="#2C3E50" stroke-width="1.5" fill="none" opacity="0.7"/>
            <path d="M103 100 Q115 98 127 100" stroke="#2C3E50" stroke-width="1.5" fill="none" opacity="0.7"/>
            
            <!-- Borse sotto gli occhi (età) -->
            ${config.age !== 'young' ? `
                <ellipse cx="85" cy="112" rx="10" ry="3" fill="${this.adjustColor(config.skinTone, -8)}" opacity="0.3"/>
                <ellipse cx="115" cy="112" rx="10" ry="3" fill="${this.adjustColor(config.skinTone, -8)}" opacity="0.3"/>
            ` : ''}
        `;
    }
    
    static generateRealisticNose(config, faceId) {
        const noseShapes = {
            straight: {
                bridge: `<ellipse cx="100" cy="115" rx="2.5" ry="8" fill="${this.adjustColor(config.skinTone, -5)}" opacity="0.4"/>`,
                tip: `<ellipse cx="100" cy="120" rx="4" ry="3" fill="${this.adjustColor(config.skinTone, -8)}" opacity="0.6"/>`,
                nostrils: `
                    <ellipse cx="97" cy="122" rx="1.5" ry="2" fill="${this.adjustColor(config.skinTone, -25)}" opacity="0.8"/>
                    <ellipse cx="103" cy="122" rx="1.5" ry="2" fill="${this.adjustColor(config.skinTone, -25)}" opacity="0.8"/>
                `
            },
            button: {
                bridge: `<ellipse cx="100" cy="115" rx="2" ry="6" fill="${this.adjustColor(config.skinTone, -5)}" opacity="0.4"/>`,
                tip: `<circle cx="100" cy="119" r="4" fill="${this.adjustColor(config.skinTone, -8)}" opacity="0.6"/>`,
                nostrils: `
                    <ellipse cx="97.5" cy="121" rx="1" ry="1.5" fill="${this.adjustColor(config.skinTone, -25)}" opacity="0.8"/>
                    <ellipse cx="102.5" cy="121" rx="1" ry="1.5" fill="${this.adjustColor(config.skinTone, -25)}" opacity="0.8"/>
                `
            },
            aquiline: {
                bridge: `<path d="M100 110 Q102 115 100 120" stroke="${this.adjustColor(config.skinTone, -10)}" stroke-width="2" fill="none"/>`,
                tip: `<ellipse cx="100" cy="121" rx="4.5" ry="3.5" fill="${this.adjustColor(config.skinTone, -8)}" opacity="0.6"/>`,
                nostrils: `
                    <ellipse cx="96.5" cy="123" rx="1.8" ry="2.2" fill="${this.adjustColor(config.skinTone, -25)}" opacity="0.8"/>
                    <ellipse cx="103.5" cy="123" rx="1.8" ry="2.2" fill="${this.adjustColor(config.skinTone, -25)}" opacity="0.8"/>
                `
            },
            wide: {
                bridge: `<ellipse cx="100" cy="115" rx="3" ry="7" fill="${this.adjustColor(config.skinTone, -5)}" opacity="0.4"/>`,
                tip: `<ellipse cx="100" cy="120" rx="5" ry="3.5" fill="${this.adjustColor(config.skinTone, -8)}" opacity="0.6"/>`,
                nostrils: `
                    <ellipse cx="96" cy="122" rx="2" ry="2.5" fill="${this.adjustColor(config.skinTone, -25)}" opacity="0.8"/>
                    <ellipse cx="104" cy="122" rx="2" ry="2.5" fill="${this.adjustColor(config.skinTone, -25)}" opacity="0.8"/>
                `
            }
        };
        
        const nose = noseShapes[config.noseShape] || noseShapes.straight;
        
        return `
            <!-- Ponte del naso -->
            ${nose.bridge}
            
            <!-- Punta del naso -->
            ${nose.tip}
            
            <!-- Evidenziatura -->
            <ellipse cx="100" cy="117" rx="1.5" ry="4" fill="white" opacity="0.3"/>
            
            <!-- Narici -->
            ${nose.nostrils}
            
            <!-- Ombra sotto il naso -->
            <ellipse cx="100" cy="125" rx="6" ry="2" fill="${this.adjustColor(config.skinTone, -15)}" opacity="0.3"/>
        `;
    }
    
    static generateRealisticMouth(config, faceId) {
        const expressions = {
            neutral: `
                <ellipse cx="100" cy="138" rx="12" ry="4" fill="url(#lips-gradient-${faceId})" opacity="0.8"/>
                <ellipse cx="100" cy="137" rx="10" ry="2" fill="#FFB6C1" opacity="0.6"/>
            `,
            smile: `
                <path d="M88 138 Q100 148 112 138" stroke="url(#lips-gradient-${faceId})" 
                      stroke-width="6" fill="none" stroke-linecap="round"/>
                <path d="M90 139 Q100 146 110 139" stroke="#FFB6C1" 
                      stroke-width="3" fill="none" stroke-linecap="round"/>
            `,
            slight_smile: `
                <path d="M92 138 Q100 143 108 138" stroke="url(#lips-gradient-${faceId})" 
                      stroke-width="5" fill="none" stroke-linecap="round"/>
                <path d="M93 139 Q100 142 107 139" stroke="#FFB6C1" 
                      stroke-width="2" fill="none" stroke-linecap="round"/>
            `,
            serious: `
                <rect x="88" y="136" width="24" height="4" rx="2" fill="url(#lips-gradient-${faceId})" opacity="0.8"/>
                <rect x="90" y="136.5" width="20" height="2" rx="1" fill="#FFB6C1" opacity="0.6"/>
            `
        };
        
        return `
            ${expressions[config.expression] || expressions.neutral}
            
            <!-- Solco naso-labiale -->
            <path d="M88 128 Q92 138 88 148" stroke="${this.adjustColor(config.skinTone, -12)}" 
                  stroke-width="1" fill="none" opacity="0.4"/>
            <path d="M112 128 Q108 138 112 148" stroke="${this.adjustColor(config.skinTone, -12)}" 
                  stroke-width="1" fill="none" opacity="0.4"/>
        `;
    }
    
    static generateAgeDetails(config, faceId) {
        if (config.age === 'young') return '';
        
        const ageLines = {
            adult: `
                <!-- Piccole rughe agli occhi -->
                <path d="M95 102 L98 104" stroke="${this.adjustColor(config.skinTone, -20)}" stroke-width="0.5" opacity="0.4"/>
                <path d="M105 104 L102 102" stroke="${this.adjustColor(config.skinTone, -20)}" stroke-width="0.5" opacity="0.4"/>
            `,
            mature: `
                <!-- Rughe agli occhi -->
                <path d="M95 102 L98 104 L95 106" stroke="${this.adjustColor(config.skinTone, -20)}" stroke-width="0.8" opacity="0.5" fill="none"/>
                <path d="M105 104 L102 102 L105 106" stroke="${this.adjustColor(config.skinTone, -20)}" stroke-width="0.8" opacity="0.5" fill="none"/>
                
                <!-- Linee fronte -->
                <path d="M85 85 Q100 88 115 85" stroke="${this.adjustColor(config.skinTone, -15)}" stroke-width="0.6" opacity="0.3" fill="none"/>
                
                <!-- Solchi naso-labiali più marcati -->
                <path d="M88 125 Q92 138 88 150" stroke="${this.adjustColor(config.skinTone, -18)}" stroke-width="1.5" fill="none" opacity="0.6"/>
                <path d="M112 125 Q108 138 112 150" stroke="${this.adjustColor(config.skinTone, -18)}" stroke-width="1.5" fill="none" opacity="0.6"/>
            `
        };
        
        return ageLines[config.age] || '';
    }
    
    static generateSkinTexture(config, faceId) {
        return `
            <!-- Texture sottile della pelle -->
            <circle cx="90" cy="100" r="0.5" fill="${this.adjustColor(config.skinTone, 10)}" opacity="0.3"/>
            <circle cx="110" cy="95" r="0.5" fill="${this.adjustColor(config.skinTone, 10)}" opacity="0.3"/>
            <circle cx="95" cy="125" r="0.5" fill="${this.adjustColor(config.skinTone, -5)}" opacity="0.2"/>
            <circle cx="105" cy="130" r="0.5" fill="${this.adjustColor(config.skinTone, -5)}" opacity="0.2"/>
            
            <!-- Nei piccoli (occasionali) -->
            ${Math.random() > 0.7 ? `<circle cx="${85 + Math.random() * 30}" cy="${100 + Math.random() * 30}" r="0.8" fill="#8B4513" opacity="0.6"/>` : ''}
        `;
    }
    
    // Utility per regolare colori
    static adjustColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, Math.min(255, (num >> 16) + amt));
        const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
        const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
        return "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
    }
}

// === MANAGER AVATAR REALISTICO ===
class RealisticFaceManager {
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
            skinTone: '#FDBCB4',
            hairColor: '#2C1B18',
            hairStyle: 'short',
            eyeColor: '#8B4513',
            expression: 'slight_smile',
            eyeShape: 'almond',
            noseShape: 'straight',
            faceShape: 'oval',
            jawline: 'soft'
        };
    }
    
    updateConfig(property, value) {
        this.config[property] = value;
        
        // Aggiorna stili disponibili in base al genere
        if (property === 'gender') {
            const availableHairStyles = RealisticFaceConfig.hairStyles[value];
            if (!availableHairStyles.includes(this.config.hairStyle)) {
                this.config.hairStyle = availableHairStyles[0];
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
            return RealisticFaceGenerator.generate(this.config);
        }
        return null;
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
            age: RealisticFaceConfig.ages[Math.floor(Math.random() * RealisticFaceConfig.ages.length)],
            skinTone: RealisticFaceConfig.skinTones[Math.floor(Math.random() * RealisticFaceConfig.skinTones.length)],
            hairColor: RealisticFaceConfig.hairColors[Math.floor(Math.random() * RealisticFaceConfig.hairColors.length)],
            hairStyle: RealisticFaceConfig.hairStyles[gender][Math.floor(Math.random() * RealisticFaceConfig.hairStyles[gender].length)],
            eyeColor: RealisticFaceConfig.eyeColors[Math.floor(Math.random() * RealisticFaceConfig.eyeColors.length)],
            expression: RealisticFaceConfig.expressions[Math.floor(Math.random() * RealisticFaceConfig.expressions.length)],
            eyeShape: RealisticFaceConfig.features.eyeShape[Math.floor(Math.random() * RealisticFaceConfig.features.eyeShape.length)],
            noseShape: RealisticFaceConfig.features.noseShape[Math.floor(Math.random() * RealisticFaceConfig.features.noseShape.length)],
            faceShape: RealisticFaceConfig.features.faceShape[Math.floor(Math.random() * RealisticFaceConfig.features.faceShape.length)],
            jawline: RealisticFaceConfig.features.jawline[Math.floor(Math.random() * RealisticFaceConfig.features.jawline.length)]
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
            console.log('💾 Avatar realistico salvato:', this.config);
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
                console.log('📂 Avatar realistico caricato:', this.config);
            }
        } catch (e) {
            console.error('Errore caricamento avatar:', e);
        }
    }
}

// === UI BUILDER REALISTICO ===
class RealisticFaceUI {
    constructor(containerId, manager) {
        this.container = document.getElementById(containerId);
        this.manager = manager;
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="realistic-face-ui">
                <div class="mode-selector">
                    <button class="mode-btn ${this.manager.mode === 'realistic' ? 'active' : ''}" data-mode="realistic">
                        👤 Viso Realistico
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
                    ${this.manager.mode === 'realistic' ? this.buildRealisticControls() : this.buildPhotoControls()}
                </div>
                
                <div class="actions">
                    <button class="action-btn" onclick="window.avatarUI.randomize()">🎲 Viso Casuale</button>
                    <button class="action-btn primary" onclick="window.avatarUI.save()">💾 Salva Avatar</button>
                </div>
            </div>
        `;
        
        this.attachEvents();
        this.injectStyles();
    }
    
    buildRealisticControls() {
        return `
            <div class="control-section">
                <div class="control-group">
                    <label>👤 Genere</label>
                    <div class="button-group">
                        <button class="option-btn ${this.manager.config.gender === 'male' ? 'active' : ''}" 
                                data-property="gender" data-value="male">🙂 Uomo</button>
                        <button class="option-btn ${this.manager.config.gender === 'female' ? 'active' : ''}" 
                                data-property="gender" data-value="female">😊 Donna</button>
                    </div>
                </div>
                
                <div class="control-group">
                    <label>🎂 Età</label>
                    <div class="button-group">
                        <button class="option-btn ${this.manager.config.age === 'young' ? 'active' : ''}" 
                                data-property="age" data-value="young">Giovane</button>
                        <button class="option-btn ${this.manager.config.age === 'adult' ? 'active' : ''}" 
                                data-property="age" data-value="adult">Adulto</button>
                        <button class="option-btn ${this.manager.config.age === 'mature' ? 'active' : ''}" 
                                data-property="age" data-value="mature">Maturo</button>
                    </div>
                </div>
                
                <div class="control-group">
                    <label>🎨 Tonalità Pelle</label>
                    <div class="color-grid">
                        ${RealisticFaceConfig.skinTones.map(color => 
                            `<div class="color-swatch ${this.manager.config.skinTone === color ? 'active' : ''}" 
                                  data-property="skinTone" data-value="${color}" 
                                  style="background: ${color};" title="${color}"></div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="control-group">
                    <label>💇 Capelli</label>
                    <select class="control-select" data-property="hairStyle">
                        ${RealisticFaceConfig.hairStyles[this.manager.config.gender].map(style => 
                            `<option value="${style}" ${this.manager.config.hairStyle === style ? 'selected' : ''}>${style}</option>`
                        ).join('')}
                    </select>
                    <div class="color-grid">
                        ${RealisticFaceConfig.hairColors.map(color => 
                            `<div class="color-swatch ${this.manager.config.hairColor === color ? 'active' : ''}" 
                                  data-property="hairColor" data-value="${color}" 
                                  style="background: ${color};" title="${color}"></div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="control-group">
                    <label>👁️ Occhi</label>
                    <select class="control-select" data-property="eyeShape">
                        ${RealisticFaceConfig.features.eyeShape.map(shape => 
                            `<option value="${shape}" ${this.manager.config.eyeShape === shape ? 'selected' : ''}>${shape}</option>`
                        ).join('')}
                    </select>
                    <div class="color-grid">
                        ${RealisticFaceConfig.eyeColors.map(color => 
                            `<div class="color-swatch ${this.manager.config.eyeColor === color ? 'active' : ''}" 
                                  data-property="eyeColor" data-value="${color}" 
                                  style="background: ${color};" title="${color}"></div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="control-group">
                    <label>👃 Naso</label>
                    <select class="control-select" data-property="noseShape">
                        ${RealisticFaceConfig.features.noseShape.map(shape => 
                            `<option value="${shape}" ${this.manager.config.noseShape === shape ? 'selected' : ''}>${shape}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="control-group">
                    <label>😊 Espressione</label>
                    <select class="control-select" data-property="expression">
                        ${RealisticFaceConfig.expressions.map(expr => 
                            `<option value="${expr}" ${this.manager.config.expression === expr ? 'selected' : ''}>${expr}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="control-group">
                    <label>👤 Forma Viso</label>
                    <select class="control-select" data-property="faceShape">
                        ${RealisticFaceConfig.features.faceShape.map(shape => 
                            `<option value="${shape}" ${this.manager.config.faceShape === shape ? 'selected' : ''}>${shape}</option>`
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
                            <div class="upload-hint">JPG, PNG o WEBP - Solo viso</div>
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
                this.manager.updateConfig(property, value);
                this.refreshControls();
                this.updatePreview();
            });
        });
        
        // Select controls
        this.container.querySelectorAll('.control-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const property = e.target.dataset.property;
                this.manager.updateConfig(property, e.target.value);
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
            this.buildRealisticControls() : this.buildPhotoControls();
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
        this.showNotification('🎲 Viso randomizzato!');
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
        if (document.getElementById('realistic-face-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'realistic-face-styles';
        styles.textContent = `
            .realistic-face-ui {
                max-width: 600px;
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
                margin-bottom: 30px;
                background: rgba(255,255,255,0.1);
                padding: 10px;
                border-radius: 18px;
                backdrop-filter: blur(15px);
            }
            
            .mode-btn {
                flex: 1;
                padding: 18px;
                border: none;
                background: transparent;
                color: white;
                border-radius: 12px;
                cursor: pointer;
                font-weight: 700;
                font-size: 15px;
                transition: all 0.3s ease;
            }
            
            .mode-btn.active {
                background: rgba(255,255,255,0.25);
                box-shadow: 0 6px 20px rgba(255,255,255,0.15);
                transform: translateY(-2px);
            }
            
            .mode-btn:hover:not(.active) {
                background: rgba(255,255,255,0.15);
            }
            
            .avatar-preview {
                text-align: center;
                margin-bottom: 35px;
            }
            
            .preview-container {
                width: 180px;
                height: 180px;
                margin: 0 auto;
                border: 5px solid rgba(255,255,255,0.4);
                border-radius: 50%;
                overflow: hidden;
                background: white;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                transition: transform 0.4s ease;
                position: relative;
            }
            
            .preview-container:hover {
                transform: scale(1.08) rotate(2deg);
                box-shadow: 0 30px 80px rgba(0,0,0,0.4);
            }
            
            .control-section {
                background: rgba(255,255,255,0.12);
                border-radius: 20px;
                padding: 25px;
                margin-bottom: 30px;
                backdrop-filter: blur(15px);
                border: 1px solid rgba(255,255,255,0.2);
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
                text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
            }
            
            .button-group {
                display: flex;
                gap: 12px;
            }
            
            .option-btn {
                flex: 1;
                padding: 15px;
                border: 2px solid rgba(255,255,255,0.3);
                background: rgba(255,255,255,0.1);
                color: white;
                border-radius: 12px;
                cursor: pointer;
                font-weight: 700;
                transition: all 0.3s ease;
                font-size: 14px;
            }
            
            .option-btn.active {
                background: rgba(255,255,255,0.25);
                border-color: rgba(255,255,255,0.7);
                box-shadow: 0 6px 20px rgba(255,255,255,0.15);
                transform: translateY(-2px);
            }
            
            .option-btn:hover:not(.active) {
                background: rgba(255,255,255,0.18);
                transform: translateY(-1px);
            }
            
            .control-select {
                width: 100%;
                padding: 15px 20px;
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 12px;
                font-size: 15px;
                background: rgba(255,255,255,0.15);
                color: white;
                font-weight: 600;
                backdrop-filter: blur(10px);
                margin-bottom: 18px;
                cursor: pointer;
            }
            
            .control-select:focus {
                outline: none;
                border-color: rgba(255,255,255,0.7);
                box-shadow: 0 0 25px rgba(255,255,255,0.15);
            }
            
            .control-select option {
                background: #2C3E50;
                color: white;
                font-weight: 600;
            }
            
            .color-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
                gap: 12px;
            }
            
            .color-swatch {
                width: 50px;
                height: 50px;
                border-radius: 15px;
                cursor: pointer;
                border: 3px solid rgba(255,255,255,0.4);
                transition: all 0.3s ease;
                position: relative;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            }
            
            .color-swatch:hover {
                transform: scale(1.15) rotate(5deg);
                border-color: rgba(255,255,255,0.8);
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            }
            
            .color-swatch.active {
                border-color: #F39C12;
                transform: scale(1.2);
                box-shadow: 0 8px 30px rgba(243, 156, 18, 0.6);
            }
            
            .color-swatch.active::after {
                content: '✓';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-weight: bold;
                font-size: 18px;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
            }
            
            .photo-upload {
                border: 3px dashed rgba(255,255,255,0.5);
                border-radius: 20px;
                padding: 40px 30px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                background: rgba(255,255,255,0.08);
                backdrop-filter: blur(10px);
            }
            
            .photo-upload:hover {
                border-color: rgba(255,255,255,0.8);
                background: rgba(255,255,255,0.15);
                transform: translateY(-3px);
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
            
            .upload-icon {
                font-size: 48px;
                margin-bottom: 20px;
            }
            
            .upload-text {
                font-size: 18px;
                font-weight: 700;
                margin-bottom: 10px;
            }
            
            .upload-hint {
                font-size: 14px;
                opacity: 0.8;
                font-weight: 500;
            }
            
            .actions {
                display: flex;
                gap: 18px;
            }
            
            .action-btn {
                flex: 1;
                padding: 18px;
                border: 2px solid rgba(255,255,255,0.4);
                background: rgba(255,255,255,0.15);
                color: white;
                border-radius: 15px;
                cursor: pointer;
                font-weight: 800;
                font-size: 15px;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }
            
            .action-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 35px rgba(255,255,255,0.15);
                background: rgba(255,255,255,0.25);
            }
            
            .action-btn.primary {
                background: linear-gradient(135deg, #F39C12, #E67E22);
                border-color: #F39C12;
                box-shadow: 0 8px 25px rgba(243, 156, 18, 0.4);
            }
            
            .action-btn.primary:hover {
                box-shadow: 0 12px 40px rgba(243, 156, 18, 0.6);
                transform: translateY(-4px);
            }
            
            @media (max-width: 700px) {
                .realistic-face-ui {
                    padding: 25px;
                    margin: 15px;
                }
                
                .preview-container {
                    width: 160px;
                    height: 160px;
                }
                
                .color-grid {
                    grid-template-columns: repeat(5, 1fr);
                }
                
                .color-swatch {
                    width: 45px;
                    height: 45px;
                }
                
                .actions {
                    flex-direction: column;
                }
                
                .button-group {
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
        console.log('🎨 Sistema Visi Realistici inizializzato per:', userId);
        const manager = new RealisticFaceManager(userId);
        return manager;
    }
    
    static createUI(containerId, manager) {
        console.log('🎭 Creazione UI Visi Realistici per container:', containerId);
        const ui = new RealisticFaceUI(containerId, manager);
        // Store reference globally for button actions
        window.avatarUI = ui;
        return ui;
    }
}

// === ESPOSIZIONE GLOBALE ===
window.RealisticAvatarSystem = RealisticAvatarSystem;
window.RealisticFaceManager = RealisticFaceManager;
window.RealisticFaceUI = RealisticFaceUI;

console.log('✅ Sistema Avatar Visi Realistici caricato - FOTOGRAFICO AL 100%!');