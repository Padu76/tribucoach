// avatar-system-realistic.js - Sistema Avatar Pulito (Solo Realistico + Foto)
// Elimina il cartoon orribile - mantiene solo quello che funziona

// === 🎨 CONFIGURAZIONE AVATAR SYSTEM ===
const AVATAR_CONFIG = {
    version: '4.0',
    modes: ['realistic', 'photo'], // Solo realistico e foto
    
    // Generi
    genders: {
        male: { label: 'Uomo', icon: '👨' },
        female: { label: 'Donna', icon: '👩' }
    },
    
    // Forme viso
    faceShapes: {
        oval: 'Ovale',
        round: 'Rotondo', 
        square: 'Quadrato',
        heart: 'Cuore',
        diamond: 'Diamante',
        long: 'Allungato'
    },
    
    // Tonalità pelle (naturali)
    skinTones: [
        '#FDBCB4', '#F1C9A3', '#E8B895', '#D5A785', 
        '#C4956B', '#A67C52', '#8B5A3C', '#6B4226'
    ],
    
    // Stili capelli per genere
    hairStyles: {
        male: [
            'short_neat', 'short_messy', 'crew_cut', 'pompadour',
            'medium_side', 'long_wavy', 'curly', 'bald'
        ],
        female: [
            'bob_short', 'bob_medium', 'long_straight', 'long_wavy',
            'curly_short', 'curly_long', 'ponytail', 'bun'
        ]
    },
    
    // Lunghezze capelli
    hairLengths: {
        short: 'Corti',
        medium: 'Medi', 
        long: 'Lunghi'
    },
    
    // Colori capelli (naturali)
    hairColors: [
        '#2C1B18', '#4A312C', '#8B4513', '#D2691E',
        '#DEB887', '#F4A460', '#FFD700', '#B22222',
        '#8A2BE2', '#708090', '#A9A9A9', '#FFFFFF'
    ],
    
    // Forme occhi
    eyeShapes: [
        'normal', 'round', 'almond', 'narrow', 'wide', 'asian'
    ],
    
    // Colori occhi (naturali)
    eyeColors: [
        '#8B4513', '#654321', '#228B22', '#0000FF',
        '#808080', '#90EE90', '#006400', '#4169E1'
    ],
    
    // Forme naso
    noseShapes: [
        'small', 'medium', 'large', 'pointed', 'wide', 'narrow'
    ],
    
    // Espressioni bocca
    mouthExpressions: [
        'neutral', 'smile', 'happy', 'laugh', 'serious', 'sad'
    ],
    
    // Accessori
    accessories: {
        glasses: [
            'none', 'round', 'square', 'aviator', 'reading', 'sunglasses'
        ],
        facialHair: {
            male: ['none', 'mustache', 'goatee', 'beard_short', 'beard_full', 'stubble'],
            female: ['none']
        },
        earrings: [
            'none', 'studs', 'hoops', 'drops'
        ],
        piercings: [
            'none', 'nose', 'eyebrow', 'lip'
        ]
    }
};

// === 🎨 SVG GENERATOR - SOLO REALISTICO ===
class RealisticSVGGenerator {
    
    static generateRealisticAvatar(config) {
        const { gender, faceShape, skinTone, hairStyle, hairColor, hairLength, 
                eyeShape, eyeColor, noseShape, mouthExpression, accessories } = config;
        
        return `
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <!-- Gradienti realistici -->
                <radialGradient id="faceGradient" cx="0.3" cy="0.3" r="0.8">
                    <stop offset="0%" stop-color="${this.lightenColor(skinTone, 25)}"/>
                    <stop offset="60%" stop-color="${skinTone}"/>
                    <stop offset="100%" stop-color="${this.darkenColor(skinTone, 15)}"/>
                </radialGradient>
                <linearGradient id="hairGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="${this.lightenColor(hairColor, 35)}"/>
                    <stop offset="50%" stop-color="${hairColor}"/>
                    <stop offset="100%" stop-color="${this.darkenColor(hairColor, 20)}"/>
                </linearGradient>
                <radialGradient id="eyeGradient" cx="0.3" cy="0.3" r="0.7">
                    <stop offset="0%" stop-color="${this.lightenColor(eyeColor, 30)}"/>
                    <stop offset="100%" stop-color="${this.darkenColor(eyeColor, 20)}"/>
                </radialGradient>
                <!-- Ombre -->
                <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="2" dy="3" stdDeviation="2" flood-opacity="0.2"/>
                </filter>
                <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="1" dy="1" stdDeviation="1" flood-opacity="0.15"/>
                </filter>
            </defs>
            
            <!-- Sfondo -->
            <circle cx="100" cy="100" r="90" fill="#f8f9fa" stroke="#e9ecef" stroke-width="1"/>
            
            <!-- Collo -->
            ${this.generateNeck(skinTone, gender)}
            
            <!-- Viso -->
            ${this.generateRealisticFace(faceShape, skinTone, gender)}
            
            <!-- Capelli (dietro) -->
            ${this.generateRealisticHair(hairStyle, hairColor, hairLength, gender, 'back')}
            
            <!-- Occhi -->
            ${this.generateRealisticEyes(eyeShape, eyeColor, gender)}
            
            <!-- Sopracciglia -->
            ${this.generateEyebrows(hairColor, gender)}
            
            <!-- Naso -->
            ${this.generateRealisticNose(noseShape, skinTone, gender)}
            
            <!-- Bocca -->
            ${this.generateRealisticMouth(mouthExpression, gender)}
            
            <!-- Capelli (davanti) -->
            ${this.generateRealisticHair(hairStyle, hairColor, hairLength, gender, 'front')}
            
            <!-- Accessori -->
            ${this.generateRealisticAccessories(accessories, gender)}
        </svg>`;
    }
    
    // === COMPONENTI REALISTICI ===
    
    static generateNeck(skinTone, gender) {
        const neckWidth = gender === 'male' ? 25 : 20;
        return `
            <ellipse cx="100" cy="175" rx="${neckWidth}" ry="20" 
                     fill="url(#faceGradient)" 
                     filter="url(#innerShadow)"/>
        `;
    }
    
    static generateRealisticFace(shape, skinTone, gender) {
        const shapes = {
            oval: `<ellipse cx="100" cy="110" rx="42" ry="52" fill="url(#faceGradient)" stroke="${this.darkenColor(skinTone, 10)}" stroke-width="0.5" filter="url(#softShadow)"/>`,
            round: `<circle cx="100" cy="110" r="47" fill="url(#faceGradient)" stroke="${this.darkenColor(skinTone, 10)}" stroke-width="0.5" filter="url(#softShadow)"/>`,
            square: `<rect x="58" y="68" width="84" height="84" rx="12" fill="url(#faceGradient)" stroke="${this.darkenColor(skinTone, 10)}" stroke-width="0.5" filter="url(#softShadow)"/>`,
            heart: `<path d="M100 68 C115 68, 132 80, 132 105 L132 135 C132 150, 120 160, 100 160 C80 160, 68 150, 68 135 L68 105 C68 80, 85 68, 100 68 Z" fill="url(#faceGradient)" stroke="${this.darkenColor(skinTone, 10)}" stroke-width="0.5" filter="url(#softShadow)"/>`,
            diamond: `<path d="M100 72 L122 100 L100 155 L78 100 Z" fill="url(#faceGradient)" stroke="${this.darkenColor(skinTone, 10)}" stroke-width="0.5" filter="url(#softShadow)"/>`,
            long: `<ellipse cx="100" cy="115" rx="38" ry="58" fill="url(#faceGradient)" stroke="${this.darkenColor(skinTone, 10)}" stroke-width="0.5" filter="url(#softShadow)"/>`
        };
        
        // Aggiungi definizione mascella per uomini
        let jaw = '';
        if (gender === 'male') {
            jaw = `<path d="M75 135 Q100 145 125 135" stroke="${this.darkenColor(skinTone, 20)}" stroke-width="1" fill="none" opacity="0.3"/>`;
        }
        
        return (shapes[shape] || shapes.oval) + jaw;
    }
    
    static generateRealisticHair(style, color, length, gender, layer) {
        // Layer 'back' per capelli dietro la testa, 'front' per ciuffi davanti
        const hairStyles = {
            // MASCHI
            short_neat: {
                back: `<path d="M75 85 Q100 70 125 85 L120 95 Q100 80 80 95 Z" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 25)}" stroke-width="0.5" filter="url(#innerShadow)"/>`,
                front: ``
            },
            short_messy: {
                back: `<path d="M70 80 Q80 65 90 75 Q100 60 110 70 Q120 55 130 75 L125 90 Q100 75 75 90 Z" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 25)}" stroke-width="0.5"/>`,
                front: `<path d="M85 75 Q95 65 105 75" stroke="url(#hairGradient)" stroke-width="3" fill="none" stroke-linecap="round"/>`
            },
            crew_cut: {
                back: `<path d="M78 88 Q100 75 122 88 L118 92 Q100 82 82 92 Z" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 25)}" stroke-width="0.5"/>`,
                front: ``
            },
            pompadour: {
                back: `<path d="M75 90 Q85 60 100 65 Q115 60 125 90 L120 95 Q100 80 80 95 Z" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 25)}" stroke-width="0.5"/>`,
                front: `<ellipse cx="100" cy="70" rx="15" ry="8" fill="url(#hairGradient)" filter="url(#softShadow)"/>`
            },
            medium_side: {
                back: `<path d="M68 85 Q75 70 88 75 Q100 70 112 75 Q125 70 132 85 L127 100 Q100 85 73 100 Z" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 25)}" stroke-width="0.5"/>`,
                front: `<path d="M70 85 Q85 75 100 85" stroke="url(#hairGradient)" stroke-width="4" fill="none" stroke-linecap="round"/>`
            },
            long_wavy: {
                back: `<path d="M65 85 Q70 65 85 70 Q100 60 115 70 Q130 60 135 85 L135 110 Q120 100 105 110 Q90 100 75 110 L65 100 Z" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 25)}" stroke-width="0.5"/>`,
                front: `<path d="M75 95 Q85 85 95 95 Q105 85 115 95" stroke="url(#hairGradient)" stroke-width="3" fill="none" stroke-linecap="round"/>`
            },
            curly: {
                back: `<circle cx="85" cy="80" r="10" fill="url(#hairGradient)" filter="url(#softShadow)"/><circle cx="100" cy="75" r="12" fill="url(#hairGradient)" filter="url(#softShadow)"/><circle cx="115" cy="80" r="10" fill="url(#hairGradient)" filter="url(#softShadow)"/>`,
                front: `<circle cx="90" cy="85" r="6" fill="url(#hairGradient)" opacity="0.8"/><circle cx="110" cy="85" r="6" fill="url(#hairGradient)" opacity="0.8"/>`
            },
            bald: {
                back: ``,
                front: ``
            },
            
            // FEMMINE  
            bob_short: {
                back: `<path d="M68 85 Q100 70 132 85 L132 105 Q100 95 68 105 Z" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 25)}" stroke-width="0.5" filter="url(#innerShadow)"/>`,
                front: `<path d="M70 95 Q85 90 100 95 Q115 90 130 95" stroke="url(#hairGradient)" stroke-width="2" fill="none" stroke-linecap="round"/>`
            },
            bob_medium: {
                back: `<path d="M65 85 Q100 65 135 85 L135 115 Q100 100 65 115 Z" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 25)}" stroke-width="0.5" filter="url(#innerShadow)"/>`,
                front: `<path d="M68 105 Q100 95 132 105" stroke="url(#hairGradient)" stroke-width="3" fill="none" stroke-linecap="round"/>`
            },
            long_straight: {
                back: `<path d="M68 85 Q100 70 132 85 L132 140 Q100 130 68 140 Z" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 25)}" stroke-width="0.5" filter="url(#innerShadow)"/>`,
                front: `<path d="M70 130 L70 140 M130 130 L130 140" stroke="url(#hairGradient)" stroke-width="4" stroke-linecap="round"/>`
            },
            long_wavy: {
                back: `<path d="M65 85 Q100 65 135 85 Q140 100 130 115 Q135 130 125 145 Q75 145 65 130 Q60 115 70 100 Q65 90 65 85 Z" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 25)}" stroke-width="0.5" filter="url(#innerShadow)"/>`,
                front: `<path d="M68 110 Q75 100 82 110 Q88 100 95 110" stroke="url(#hairGradient)" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M105 110 Q112 100 118 110 Q125 100 132 110" stroke="url(#hairGradient)" stroke-width="3" fill="none" stroke-linecap="round"/>`
            },
            curly_short: {
                back: `<circle cx="80" cy="80" r="12" fill="url(#hairGradient)" filter="url(#softShadow)"/><circle cx="100" cy="75" r="15" fill="url(#hairGradient)" filter="url(#softShadow)"/><circle cx="120" cy="80" r="12" fill="url(#hairGradient)" filter="url(#softShadow)"/>`,
                front: `<circle cx="85" cy="90" r="8" fill="url(#hairGradient)" opacity="0.9"/><circle cx="115" cy="90" r="8" fill="url(#hairGradient)" opacity="0.9"/>`
            },
            curly_long: {
                back: `<circle cx="75" cy="85" r="15" fill="url(#hairGradient)" filter="url(#softShadow)"/><circle cx="100" cy="75" r="18" fill="url(#hairGradient)" filter="url(#softShadow)"/><circle cx="125" cy="85" r="15" fill="url(#hairGradient)" filter="url(#softShadow)"/><circle cx="85" cy="110" r="12" fill="url(#hairGradient)" filter="url(#softShadow)"/><circle cx="115" cy="110" r="12" fill="url(#hairGradient)" filter="url(#softShadow)"/>`,
                front: `<circle cx="80" cy="100" r="9" fill="url(#hairGradient)" opacity="0.8"/><circle cx="120" cy="100" r="9" fill="url(#hairGradient)" opacity="0.8"/>`
            },
            ponytail: {
                back: `<path d="M75 85 Q100 70 125 85 L120 95 Q100 80 80 95 Z" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 25)}" stroke-width="0.5"/><ellipse cx="125" cy="100" rx="6" ry="25" fill="url(#hairGradient)" filter="url(#softShadow)"/>`,
                front: ``
            },
            bun: {
                back: `<path d="M75 85 Q100 70 125 85 L120 95 Q100 80 80 95 Z" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 25)}" stroke-width="0.5"/><circle cx="100" cy="75" r="18" fill="url(#hairGradient)" filter="url(#softShadow)"/>`,
                front: ``
            }
        };
        
        const hairStyle = hairStyles[style] || hairStyles[gender === 'male' ? 'short_neat' : 'bob_short'];
        return hairStyle[layer] || '';
    }
    
    static generateEyebrows(hairColor, gender) {
        const browColor = this.darkenColor(hairColor, 30);
        const thickness = gender === 'male' ? 3 : 2;
        
        return `
            <path d="M78 95 Q85 92 92 95" stroke="${browColor}" stroke-width="${thickness}" fill="none" stroke-linecap="round"/>
            <path d="M108 95 Q115 92 122 95" stroke="${browColor}" stroke-width="${thickness}" fill="none" stroke-linecap="round"/>
        `;
    }
    
    static generateRealisticEyes(shape, color, gender) {
        const eyeSize = gender === 'male' ? { rx: 8, ry: 6 } : { rx: 9, ry: 7 };
        
        const baseEye = `
            <!-- Occhio sinistro -->
            <ellipse cx="85" cy="105" rx="${eyeSize.rx}" ry="${eyeSize.ry}" fill="white" stroke="#00000020" stroke-width="0.5" filter="url(#softShadow)"/>
            <circle cx="85" cy="105" r="4.5" fill="url(#eyeGradient)"/>
            <circle cx="85" cy="105" r="2" fill="${this.darkenColor(color, 40)}"/>
            <circle cx="86" cy="103" r="1.5" fill="white" opacity="0.9"/>
            
            <!-- Occhio destro -->
            <ellipse cx="115" cy="105" rx="${eyeSize.rx}" ry="${eyeSize.ry}" fill="white" stroke="#00000020" stroke-width="0.5" filter="url(#softShadow)"/>
            <circle cx="115" cy="105" r="4.5" fill="url(#eyeGradient)"/>
            <circle cx="115" cy="105" r="2" fill="${this.darkenColor(color, 40)}"/>
            <circle cx="116" cy="103" r="1.5" fill="white" opacity="0.9"/>
            
            <!-- Ciglia -->
            <path d="M77 100 Q85 98 93 100" stroke="#00000040" stroke-width="1" fill="none" stroke-linecap="round"/>
            <path d="M107 100 Q115 98 123 100" stroke="#00000040" stroke-width="1" fill="none" stroke-linecap="round"/>
        `;
        
        // Forme specifiche
        const shapes = {
            normal: baseEye,
            round: baseEye.replace(/ry="[0-9]"/g, `ry="${eyeSize.rx}"`),
            almond: `
                <ellipse cx="85" cy="105" rx="10" ry="5" fill="white" stroke="#00000020" stroke-width="0.5" filter="url(#softShadow)"/>
                <ellipse cx="115" cy="105" rx="10" ry="5" fill="white" stroke="#00000020" stroke-width="0.5" filter="url(#softShadow)"/>
                <circle cx="85" cy="105" r="3.5" fill="url(#eyeGradient)"/>
                <circle cx="115" cy="105" r="3.5" fill="url(#eyeGradient)"/>
                <circle cx="85" cy="105" r="1.5" fill="${this.darkenColor(color, 40)}"/>
                <circle cx="115" cy="105" r="1.5" fill="${this.darkenColor(color, 40)}"/>
                <circle cx="86" cy="103" r="1" fill="white"/>
                <circle cx="116" cy="103" r="1" fill="white"/>
                <path d="M75 102 Q85 100 95 102" stroke="#00000040" stroke-width="1" fill="none" stroke-linecap="round"/>
                <path d="M105 102 Q115 100 125 102" stroke="#00000040" stroke-width="1" fill="none" stroke-linecap="round"/>
            `,
            narrow: baseEye.replace(/ry="[0-9]"/g, 'ry="4"'),
            wide: baseEye.replace(/rx="[0-9]"/g, 'rx="10"'),
            asian: `
                <path d="M77 105 Q85 102 93 105 Q85 108 77 105" fill="white" stroke="#00000020" stroke-width="0.5" filter="url(#softShadow)"/>
                <path d="M107 105 Q115 102 123 105 Q115 108 107 105" fill="white" stroke="#00000020" stroke-width="0.5" filter="url(#softShadow)"/>
                <circle cx="85" cy="105" r="3" fill="url(#eyeGradient)"/>
                <circle cx="115" cy="105" r="3" fill="url(#eyeGradient)"/>
                <circle cx="85" cy="105" r="1.5" fill="${this.darkenColor(color, 40)}"/>
                <circle cx="115" cy="105" r="1.5" fill="${this.darkenColor(color, 40)}"/>
                <circle cx="86" cy="103" r="0.8" fill="white"/>
                <circle cx="116" cy="103" r="0.8" fill="white"/>
            `
        };
        
        return shapes[shape] || shapes.normal;
    }
    
    static generateRealisticNose(shape, skinTone, gender) {
        const noseColor = this.darkenColor(skinTone, 15);
        const nostrilColor = this.darkenColor(skinTone, 25);
        
        const noses = {
            small: `
                <ellipse cx="100" cy="115" rx="2.5" ry="4" fill="${noseColor}" opacity="0.6"/>
                <path d="M98 116 L102 116" stroke="${nostrilColor}" stroke-width="0.8" opacity="0.7"/>
            `,
            medium: `
                <ellipse cx="100" cy="115" rx="3.5" ry="5" fill="${noseColor}" opacity="0.6" filter="url(#innerShadow)"/>
                <path d="M97 116 L103 116" stroke="${nostrilColor}" stroke-width="1" opacity="0.7"/>
                <ellipse cx="98" cy="117" rx="1" ry="1.5" fill="${nostrilColor}" opacity="0.4"/>
                <ellipse cx="102" cy="117" rx="1" ry="1.5" fill="${nostrilColor}" opacity="0.4"/>
            `,
            large: `
                <ellipse cx="100" cy="115" rx="4.5" ry="6" fill="${noseColor}" opacity="0.6" filter="url(#innerShadow)"/>
                <path d="M96 117 L104 117" stroke="${nostrilColor}" stroke-width="1.2" opacity="0.7"/>
                <ellipse cx="97" cy="118" rx="1.5" ry="2" fill="${nostrilColor}" opacity="0.5"/>
                <ellipse cx="103" cy="118" rx="1.5" ry="2" fill="${nostrilColor}" opacity="0.5"/>
            `,
            pointed: `
                <path d="M100 110 L103 118 L100 120 L97 118 Z" fill="${noseColor}" opacity="0.6" filter="url(#innerShadow)"/>
                <path d="M98 118 L102 118" stroke="${nostrilColor}" stroke-width="0.8" opacity="0.7"/>
            `,
            wide: `
                <ellipse cx="100" cy="115" rx="5" ry="4" fill="${noseColor}" opacity="0.6" filter="url(#innerShadow)"/>
                <path d="M95 116 L105 116" stroke="${nostrilColor}" stroke-width="1" opacity="0.7"/>
                <ellipse cx="97" cy="117" rx="1.5" ry="1" fill="${nostrilColor}" opacity="0.4"/>
                <ellipse cx="103" cy="117" rx="1.5" ry="1" fill="${nostrilColor}" opacity="0.4"/>
            `,
            narrow: `
                <ellipse cx="100" cy="115" rx="2" ry="6" fill="${noseColor}" opacity="0.6"/>
                <path d="M99 117 L101 117" stroke="${nostrilColor}" stroke-width="0.6" opacity="0.7"/>
            `
        };
        return noses[shape] || noses.medium;
    }
    
    static generateRealisticMouth(expression, gender) {
        const lipColor = gender === 'female' ? '#FF6B9D' : '#CC5577';
        const lipGradient = `
            <defs>
                <linearGradient id="lipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="${this.lightenColor(lipColor, 20)}"/>
                    <stop offset="100%" stop-color="${this.darkenColor(lipColor, 10)}"/>
                </linearGradient>
            </defs>
        `;
        
        const mouths = {
            neutral: `
                ${lipGradient}
                <ellipse cx="100" cy="130" rx="8" ry="3" fill="url(#lipGradient)" filter="url(#softShadow)"/>
                <ellipse cx="100" cy="129" rx="6" ry="2" fill="${this.lightenColor(lipColor, 30)}" opacity="0.7"/>
            `,
            smile: `
                ${lipGradient}
                <path d="M92 130 Q100 138 108 130" stroke="url(#lipGradient)" stroke-width="4" fill="none" stroke-linecap="round" filter="url(#softShadow)"/>
                <path d="M94 131 Q100 136 106 131" stroke="${this.lightenColor(lipColor, 30)}" stroke-width="2" fill="none" stroke-linecap="round"/>
            `,
            happy: `
                ${lipGradient}
                <path d="M90 128 Q100 140 110 128" stroke="url(#lipGradient)" stroke-width="5" fill="none" stroke-linecap="round" filter="url(#softShadow)"/>
                <ellipse cx="100" cy="132" rx="8" ry="4" fill="${this.lightenColor(lipColor, 20)}" opacity="0.8"/>
            `,
            laugh: `
                ${lipGradient}
                <ellipse cx="100" cy="132" rx="12" ry="8" fill="url(#lipGradient)" filter="url(#softShadow)"/>
                <ellipse cx="100" cy="130" rx="10" ry="6" fill="${this.lightenColor(lipColor, 25)}"/>
                <rect x="95" y="128" width="10" height="3" fill="white" opacity="0.9"/>
            `,
            serious: `
                ${lipGradient}
                <line x1="92" y1="130" x2="108" y2="130" stroke="url(#lipGradient)" stroke-width="3" stroke-linecap="round" filter="url(#softShadow)"/>
                <line x1="94" y1="129" x2="106" y2="129" stroke="${this.lightenColor(lipColor, 20)}" stroke-width="1"/>
            `,
            sad: `
                ${lipGradient}
                <path d="M92 132 Q100 125 108 132" stroke="url(#lipGradient)" stroke-width="4" fill="none" stroke-linecap="round" filter="url(#softShadow)"/>
                <path d="M94 131 Q100 127 106 131" stroke="${this.lightenColor(lipColor, 30)}" stroke-width="2" fill="none" stroke-linecap="round"/>
            `
        };
        return mouths[expression] || mouths.neutral;
    }
    
    static generateRealisticAccessories(accessories, gender) {
        let result = '';
        
        // Occhiali con riflessi realistici
        if (accessories.glasses && accessories.glasses !== 'none') {
            const glassesColor = '#333333';
            const glasses = {
                round: `
                    <circle cx="85" cy="105" r="12" fill="none" stroke="${glassesColor}" stroke-width="2.5" filter="url(#softShadow)"/>
                    <circle cx="115" cy="105" r="12" fill="none" stroke="${glassesColor}" stroke-width="2.5" filter="url(#softShadow)"/>
                    <line x1="97" y1="105" x2="103" y2="105" stroke="${glassesColor}" stroke-width="2.5"/>
                    <!-- Riflessi -->
                    <ellipse cx="82" cy="102" rx="3" ry="6" fill="white" opacity="0.3"/>
                    <ellipse cx="112" cy="102" rx="3" ry="6" fill="white" opacity="0.3"/>
                `,
                square: `
                    <rect x="73" y="93" width="24" height="24" rx="2" fill="none" stroke="${glassesColor}" stroke-width="2.5" filter="url(#softShadow)"/>
                    <rect x="103" y="93" width="24" height="24" rx="2" fill="none" stroke="${glassesColor}" stroke-width="2.5" filter="url(#softShadow)"/>
                    <line x1="97" y1="105" x2="103" y2="105" stroke="${glassesColor}" stroke-width="2.5"/>
                    <!-- Riflessi -->
                    <rect x="76" y="98" width="4" height="8" fill="white" opacity="0.3"/>
                    <rect x="106" y="98" width="4" height="8" fill="white" opacity="0.3"/>
                `,
                aviator: `
                    <ellipse cx="85" cy="105" rx="15" ry="12" fill="none" stroke="${glassesColor}" stroke-width="2.5" filter="url(#softShadow)"/>
                    <ellipse cx="115" cy="105" rx="15" ry="12" fill="none" stroke="${glassesColor}" stroke-width="2.5" filter="url(#softShadow)"/>
                    <line x1="100" y1="105" x2="100" y2="105" stroke="${glassesColor}" stroke-width="2.5"/>
                    <!-- Riflessi -->
                    <ellipse cx="80" cy="100" rx="4" ry="8" fill="white" opacity="0.3"/>
                    <ellipse cx="110" cy="100" rx="4" ry="8" fill="white" opacity="0.3"/>
                `,
                reading: `
                    <rect x="75" y="100" width="20" height="15" rx="2" fill="none" stroke="${glassesColor}" stroke-width="2" filter="url(#softShadow)"/>
                    <rect x="105" y="100" width="20" height="15" rx="2" fill="none" stroke="${glassesColor}" stroke-width="2" filter="url(#softShadow)"/>
                    <line x1="95" y1="107" x2="105" y2="107" stroke="${glassesColor}" stroke-width="2"/>
                    <!-- Riflessi -->
                    <rect x="77" y="103" width="3" height="6" fill="white" opacity="0.3"/>
                    <rect x="107" y="103" width="3" height="6" fill="white" opacity="0.3"/>
                `,
                sunglasses: `
                    <ellipse cx="85" cy="105" rx="12" ry="10" fill="#1a1a1a" stroke="${glassesColor}" stroke-width="2.5" filter="url(#softShadow)"/>
                    <ellipse cx="115" cy="105" rx="12" ry="10" fill="#1a1a1a" stroke="${glassesColor}" stroke-width="2.5" filter="url(#softShadow)"/>
                    <line x1="97" y1="105" x2="103" y2="105" stroke="${glassesColor}" stroke-width="3"/>
                    <!-- Riflessi -->
                    <ellipse cx="82" cy="102" rx="2" ry="4" fill="white" opacity="0.4"/>
                    <ellipse cx="112" cy="102" rx="2" ry="4" fill="white" opacity="0.4"/>
                `
            };
            result += glasses[accessories.glasses] || '';
        }
        
        // Peli facciali realistici (solo maschi)
        if (gender === 'male' && accessories.facialHair && accessories.facialHair !== 'none') {
            const hairColor = '#4A4A4A';
            const facialHair = {
                mustache: `
                    <ellipse cx="100" cy="122" rx="9" ry="3" fill="${hairColor}" filter="url(#innerShadow)"/>
                    <path d="M91 122 Q100 120 109 122" stroke="${this.darkenColor(hairColor, 20)}" stroke-width="0.8"/>
                `,
                goatee: `
                    <ellipse cx="100" cy="140" rx="7" ry="10" fill="${hairColor}" filter="url(#innerShadow)"/>
                    <ellipse cx="100" cy="138" rx="5" ry="8" fill="${this.lightenColor(hairColor, 10)}" opacity="0.6"/>
                `,
                beard_short: `
                    <path d="M85 125 Q100 145 115 125 Q115 140 100 145 Q85 140 85 125" fill="${hairColor}" filter="url(#innerShadow)"/>
                    <path d="M87 128 Q100 142 113 128" stroke="${this.darkenColor(hairColor, 20)}" stroke-width="1"/>
                `,
                beard_full: `
                    <path d="M80 120 Q100 150 120 120 Q120 145 100 155 Q80 145 80 120" fill="${hairColor}" filter="url(#innerShadow)"/>
                    <path d="M82 125 Q100 147 118 125" stroke="${this.darkenColor(hairColor, 20)}" stroke-width="1.2"/>
                    <ellipse cx="100" cy="135" rx="15" ry="8" fill="${this.lightenColor(hairColor, 15)}" opacity="0.4"/>
                `,
                stubble: `
                    <ellipse cx="100" cy="130" rx="18" ry="15" fill="${hairColor}" opacity="0.3" filter="url(#innerShadow)"/>
                    <circle cx="95" cy="125" r="0.5" fill="${hairColor}" opacity="0.6"/>
                    <circle cx="105" cy="125" r="0.5" fill="${hairColor}" opacity="0.6"/>
                    <circle cx="92" cy="135" r="0.5" fill="${hairColor}" opacity="0.6"/>
                    <circle cx="108" cy="135" r="0.5" fill="${hairColor}" opacity="0.6"/>
                `
            };
            result += facialHair[accessories.facialHair] || '';
        }
        
        // Orecchini realistici
        if (accessories.earrings && accessories.earrings !== 'none') {
            const earringColor = '#FFD700';
            const earrings = {
                studs: `
                    <circle cx="70" cy="110" r="2.5" fill="${earringColor}" filter="url(#softShadow)"/>
                    <circle cx="130" cy="110" r="2.5" fill="${earringColor}" filter="url(#softShadow)"/>
                    <circle cx="70" cy="110" r="1" fill="${this.lightenColor(earringColor, 30)}"/>
                    <circle cx="130" cy="110" r="1" fill="${this.lightenColor(earringColor, 30)}"/>
                `,
                hoops: `
                    <circle cx="70" cy="110" r="5" fill="none" stroke="${earringColor}" stroke-width="2.5" filter="url(#softShadow)"/>
                    <circle cx="130" cy="110" r="5" fill="none" stroke="${earringColor}" stroke-width="2.5" filter="url(#softShadow)"/>
                    <ellipse cx="68" cy="107" rx="1" ry="2" fill="white" opacity="0.6"/>
                    <ellipse cx="128" cy="107" rx="1" ry="2" fill="white" opacity="0.6"/>
                `,
                drops: `
                    <ellipse cx="70" cy="115" rx="2.5" ry="6" fill="${earringColor}" filter="url(#softShadow)"/>
                    <ellipse cx="130" cy="115" rx="2.5" ry="6" fill="${earringColor}" filter="url(#softShadow)"/>
                    <ellipse cx="69" cy="112" rx="1" ry="3" fill="${this.lightenColor(earringColor, 30)}"/>
                    <ellipse cx="129" cy="112" rx="1" ry="3" fill="${this.lightenColor(earringColor, 30)}"/>
                `
            };
            result += earrings[accessories.earrings] || '';
        }
        
        return result;
    }
    
    // === UTILITY FUNCTIONS ===
    
    static lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    
    static darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
            (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
            (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
    }
}

// === 🎨 AVATAR MANAGER ===
class AvatarManager {
    constructor(userId) {
        this.userId = userId;
        this.currentAvatar = this.getDefaultAvatar();
        this.avatarHistory = [];
        this.currentMode = 'realistic'; // Solo realistico per default
        this.photoFile = null;
    }
    
    getDefaultAvatar() {
        return {
            mode: 'realistic',
            gender: 'male',
            faceShape: 'oval',
            skinTone: '#FDBCB4',
            hairStyle: 'short_neat',
            hairColor: '#2C1B18',
            hairLength: 'short',
            eyeShape: 'normal',
            eyeColor: '#8B4513',
            noseShape: 'medium',
            mouthExpression: 'smile',
            accessories: {
                glasses: 'none',
                facialHair: 'none',
                earrings: 'none',
                piercings: 'none'
            }
        };
    }
    
    updateAvatar(changes) {
        this.avatarHistory.push({...this.currentAvatar});
        this.currentAvatar = {...this.currentAvatar, ...changes};
        this.saveAvatar();
        return this.currentAvatar;
    }
    
    setMode(mode) {
        if (['realistic', 'photo'].includes(mode)) {
            this.currentMode = mode;
            this.currentAvatar.mode = mode;
            this.saveAvatar();
            return true;
        }
        return false;
    }
    
    setPhoto(photoDataUrl) {
        this.photoFile = photoDataUrl;
        this.setMode('photo');
    }
    
    generateAvatarSVG() {
        if (this.currentMode === 'realistic') {
            return RealisticSVGGenerator.generateRealisticAvatar(this.currentAvatar);
        }
        return null; // Photo mode non genera SVG
    }
    
    saveAvatar() {
        try {
            const avatarData = {
                userId: this.userId,
                avatar: this.currentAvatar,
                photoFile: this.photoFile,
                timestamp: Date.now()
            };
            
            // Save in memory (since localStorage not available)
            if (!window.avatarStorage) window.avatarStorage = {};
            window.avatarStorage[this.userId] = avatarData;
            
            console.log('🎨 Avatar salvato:', avatarData);
            return true;
        } catch (error) {
            console.error('❌ Errore salvataggio avatar:', error);
            return false;
        }
    }
    
    loadAvatar() {
        try {
            if (window.avatarStorage && window.avatarStorage[this.userId]) {
                const saved = window.avatarStorage[this.userId];
                this.currentAvatar = saved.avatar;
                this.currentMode = saved.avatar.mode || 'realistic';
                this.photoFile = saved.photoFile || null;
                console.log('✅ Avatar caricato:', saved);
                return true;
            }
        } catch (error) {
            console.error('❌ Errore caricamento avatar:', error);
        }
        return false;
    }
    
    randomizeAvatar() {
        const genders = Object.keys(AVATAR_CONFIG.genders);
        const selectedGender = genders[Math.floor(Math.random() * genders.length)];
        
        const randomAvatar = {
            mode: 'realistic',
            gender: selectedGender,
            faceShape: Object.keys(AVATAR_CONFIG.faceShapes)[Math.floor(Math.random() * Object.keys(AVATAR_CONFIG.faceShapes).length)],
            skinTone: AVATAR_CONFIG.skinTones[Math.floor(Math.random() * AVATAR_CONFIG.skinTones.length)],
            hairStyle: AVATAR_CONFIG.hairStyles[selectedGender][Math.floor(Math.random() * AVATAR_CONFIG.hairStyles[selectedGender].length)],
            hairColor: AVATAR_CONFIG.hairColors[Math.floor(Math.random() * AVATAR_CONFIG.hairColors.length)],
            hairLength: Object.keys(AVATAR_CONFIG.hairLengths)[Math.floor(Math.random() * Object.keys(AVATAR_CONFIG.hairLengths).length)],
            eyeShape: AVATAR_CONFIG.eyeShapes[Math.floor(Math.random() * AVATAR_CONFIG.eyeShapes.length)],
            eyeColor: AVATAR_CONFIG.eyeColors[Math.floor(Math.random() * AVATAR_CONFIG.eyeColors.length)],
            noseShape: AVATAR_CONFIG.noseShapes[Math.floor(Math.random() * AVATAR_CONFIG.noseShapes.length)],
            mouthExpression: AVATAR_CONFIG.mouthExpressions[Math.floor(Math.random() * AVATAR_CONFIG.mouthExpressions.length)],
            accessories: {
                glasses: AVATAR_CONFIG.accessories.glasses[Math.floor(Math.random() * AVATAR_CONFIG.accessories.glasses.length)],
                facialHair: selectedGender === 'male' ? 
                    AVATAR_CONFIG.accessories.facialHair.male[Math.floor(Math.random() * AVATAR_CONFIG.accessories.facialHair.male.length)] : 
                    'none',
                earrings: AVATAR_CONFIG.accessories.earrings[Math.floor(Math.random() * AVATAR_CONFIG.accessories.earrings.length)],
                piercings: AVATAR_CONFIG.accessories.piercings[Math.floor(Math.random() * AVATAR_CONFIG.accessories.piercings.length)]
            }
        };
        
        this.updateAvatar(randomAvatar);
        return this.currentAvatar;
    }
    
    undoLastChange() {
        if (this.avatarHistory.length > 0) {
            this.currentAvatar = this.avatarHistory.pop();
            this.saveAvatar();
            return this.currentAvatar;
        }
        return null;
    }
}

// === 🎨 UI BUILDER SEMPLIFICATO ===
class AvatarUIBuilder {
    constructor(containerId, avatarManager) {
        this.container = document.getElementById(containerId);
        this.avatarManager = avatarManager;
        this.photoFile = null;
        
        if (!this.container) {
            console.error('❌ Container avatar non trovato:', containerId);
            return;
        }
        
        this.init();
    }
    
    init() {
        this.container.innerHTML = '';
        this.createUI();
        this.updateAvatarDisplay();
        console.log('✅ Avatar UI Builder inizializzato');
    }
    
    createUI() {
        this.container.innerHTML = `
            <div class="avatar-builder-simple">
                <!-- Header con modalità -->
                <div class="avatar-modes">
                    <button class="mode-btn active" data-mode="realistic">
                        👤 Realistico
                    </button>
                    <button class="mode-btn" data-mode="photo">
                        📸 Foto
                    </button>
                </div>
                
                <!-- Display Avatar -->
                <div class="avatar-display">
                    <div id="avatarPreview" class="avatar-preview"></div>
                </div>
                
                <!-- Controls -->
                <div class="avatar-controls">
                    <!-- Genere -->
                    <div class="control-group">
                        <label>👤 Genere</label>
                        <div class="gender-selector">
                            <button class="gender-btn active" data-gender="male">🙂 Uomo</button>
                            <button class="gender-btn" data-gender="female">😊 Donna</button>
                        </div>
                    </div>
                    
                    <!-- Forma Viso -->
                    <div class="control-group">
                        <label>😊 Forma Viso</label>
                        <select id="faceShape" class="avatar-select">
                            ${Object.entries(AVATAR_CONFIG.faceShapes).map(([key, label]) => 
                                `<option value="${key}">${label}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <!-- Tonalità Pelle -->
                    <div class="control-group">
                        <label>🎨 Tonalità Pelle</label>
                        <div class="color-palette">
                            ${AVATAR_CONFIG.skinTones.map(color => 
                                `<div class="color-swatch ${color === '#FDBCB4' ? 'active' : ''}" 
                                     data-color="${color}" 
                                     style="background-color: ${color}"></div>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <!-- Capelli -->
                    <div class="control-group">
                        <label>💇 Capelli</label>
                        <div class="hair-controls">
                            <select id="hairStyle" class="avatar-select">
                                <!-- Dinamico basato su genere -->
                            </select>
                            <select id="hairLength" class="avatar-select">
                                ${Object.entries(AVATAR_CONFIG.hairLengths).map(([key, label]) => 
                                    `<option value="${key}">${label}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="color-palette">
                            ${AVATAR_CONFIG.hairColors.map(color => 
                                `<div class="color-swatch ${color === '#2C1B18' ? 'active' : ''}" 
                                     data-type="hair" 
                                     data-color="${color}" 
                                     style="background-color: ${color}"></div>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <!-- Occhi -->
                    <div class="control-group">
                        <label>👁️ Occhi</label>
                        <div class="eye-controls">
                            <select id="eyeShape" class="avatar-select">
                                ${AVATAR_CONFIG.eyeShapes.map(shape => 
                                    `<option value="${shape}">${shape}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="color-palette">
                            ${AVATAR_CONFIG.eyeColors.map(color => 
                                `<div class="color-swatch ${color === '#8B4513' ? 'active' : ''}" 
                                     data-type="eye" 
                                     data-color="${color}" 
                                     style="background-color: ${color}"></div>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <!-- Naso -->
                    <div class="control-group">
                        <label>👃 Naso</label>
                        <select id="noseShape" class="avatar-select">
                            ${AVATAR_CONFIG.noseShapes.map(shape => 
                                `<option value="${shape}">${shape}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <!-- Bocca -->
                    <div class="control-group">
                        <label>👄 Espressione</label>
                        <select id="mouthExpression" class="avatar-select">
                            ${AVATAR_CONFIG.mouthExpressions.map(expr => 
                                `<option value="${expr}">${expr}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <!-- Accessori -->
                    <div class="control-group">
                        <label>👓 Accessori</label>
                        <div class="accessory-controls">
                            <select id="glasses" class="avatar-select">
                                <option value="none">Nessun occhiale</option>
                                ${AVATAR_CONFIG.accessories.glasses.slice(1).map(type => 
                                    `<option value="${type}">${type}</option>`
                                ).join('')}
                            </select>
                            
                            <select id="facialHair" class="avatar-select">
                                <!-- Dinamico basato su genere -->
                            </select>
                            
                            <select id="earrings" class="avatar-select">
                                <option value="none">Nessun orecchino</option>
                                ${AVATAR_CONFIG.accessories.earrings.slice(1).map(type => 
                                    `<option value="${type}">${type}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <!-- Upload Foto (solo per modalità photo) -->
                    <div class="control-group photo-only" style="display: none;">
                        <label>📸 Carica Foto</label>
                        <div class="photo-upload">
                            <input type="file" id="photoUpload" accept="image/*" style="display: none;">
                            <div class="upload-area" id="uploadArea">
                                <p>📁 Trascina qui la tua foto o clicca per selezionare</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Azioni -->
                    <div class="avatar-actions">
                        <button class="btn-action" id="randomizeBtn">🎲 Casuale</button>
                        <button class="btn-action" id="undoBtn">↶ Annulla</button>
                        <button class="btn-action primary" id="saveBtn">💾 Salva</button>
                    </div>
                </div>
            </div>
        `;
        
        this.attachEventListeners();
        this.updateGenderSpecificControls();
    }
    
    attachEventListeners() {
        // Modalità
        this.container.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.switchMode(mode);
            });
        });
        
        // Genere
        this.container.querySelectorAll('.gender-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const gender = e.target.dataset.gender;
                this.updateGender(gender);
            });
        });
        
        // Selettori
        ['faceShape', 'hairStyle', 'hairLength', 'eyeShape', 'noseShape', 'mouthExpression', 'glasses', 'facialHair', 'earrings'].forEach(id => {
            const element = this.container.querySelector(`#${id}`);
            if (element) {
                element.addEventListener('change', (e) => {
                    this.updateAvatarProperty(id, e.target.value);
                });
            }
        });
        
        // Palette colori
        this.container.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                const color = e.target.dataset.color;
                const type = e.target.dataset.type;
                
                if (type === 'hair') {
                    this.updateAvatarProperty('hairColor', color);
                } else if (type === 'eye') {
                    this.updateAvatarProperty('eyeColor', color);
                } else {
                    this.updateAvatarProperty('skinTone', color);
                }
                
                // Update active state
                e.target.parentElement.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
        
        // Upload foto
        this.setupPhotoUpload();
        
        // Azioni
        const randomizeBtn = this.container.querySelector('#randomizeBtn');
        const undoBtn = this.container.querySelector('#undoBtn');
        const saveBtn = this.container.querySelector('#saveBtn');
        
        if (randomizeBtn) {
            randomizeBtn.addEventListener('click', () => {
                this.avatarManager.randomizeAvatar();
                this.updateAvatarDisplay();
                this.updateControls();
            });
        }
        
        if (undoBtn) {
            undoBtn.addEventListener('click', () => {
                const reverted = this.avatarManager.undoLastChange();
                if (reverted) {
                    this.updateAvatarDisplay();
                    this.updateControls();
                }
            });
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.avatarManager.saveAvatar();
                this.showNotification('✅ Avatar salvato!');
            });
        }
    }
    
    switchMode(mode) {
        // Update UI
        this.container.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        // Show/hide controls
        const photoControls = this.container.querySelector('.photo-only');
        const avatarControls = this.container.querySelectorAll('.control-group:not(.photo-only)');
        
        if (mode === 'photo') {
            photoControls.style.display = 'block';
            avatarControls.forEach(control => control.style.display = 'none');
        } else {
            photoControls.style.display = 'none';
            avatarControls.forEach(control => control.style.display = 'block');
        }
        
        // Update avatar manager
        this.avatarManager.setMode(mode);
        this.updateAvatarDisplay();
    }
    
    updateGender(gender) {
        // Update UI
        this.container.querySelectorAll('.gender-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.gender === gender);
        });
        
        // Update avatar
        this.updateAvatarProperty('gender', gender);
        this.updateGenderSpecificControls();
    }
    
    updateGenderSpecificControls() {
        const currentGender = this.avatarManager.currentAvatar.gender;
        
        // Update hair styles
        const hairStyleSelect = this.container.querySelector('#hairStyle');
        if (hairStyleSelect) {
            hairStyleSelect.innerHTML = AVATAR_CONFIG.hairStyles[currentGender].map(style => 
                `<option value="${style}" ${style === this.avatarManager.currentAvatar.hairStyle ? 'selected' : ''}>${style}</option>`
            ).join('');
        }
        
        // Update facial hair
        const facialHairSelect = this.container.querySelector('#facialHair');
        if (facialHairSelect) {
            facialHairSelect.innerHTML = AVATAR_CONFIG.accessories.facialHair[currentGender].map(type => 
                `<option value="${type}" ${type === this.avatarManager.currentAvatar.accessories.facialHair ? 'selected' : ''}>${type === 'none' ? 'Nessuno' : type}</option>`
            ).join('');
        }
    }
    
    updateAvatarProperty(property, value) {
        if (property.includes('.')) {
            // Nested property (accessories)
            const [parent, child] = property.split('.');
            this.avatarManager.updateAvatar({
                [parent]: {
                    ...this.avatarManager.currentAvatar[parent],
                    [child]: value
                }
            });
        } else {
            this.avatarManager.updateAvatar({ [property]: value });
        }
        
        this.updateAvatarDisplay();
    }
    
    updateAvatarDisplay() {
        const preview = this.container.querySelector('#avatarPreview');
        if (!preview) return;
        
        if (this.avatarManager.currentMode === 'photo' && this.photoFile) {
            // Display uploaded photo
            preview.innerHTML = `<img src="${this.photoFile}" alt="Avatar Photo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        } else if (this.avatarManager.currentMode === 'realistic') {
            // Display realistic SVG avatar
            const svg = this.avatarManager.generateAvatarSVG();
            if (svg) {
                preview.innerHTML = svg;
            } else {
                // Fallback realistic avatar
                preview.innerHTML = this.generateFallbackRealisticAvatar();
            }
        } else {
            // Force realistic mode
            this.avatarManager.setMode('realistic');
            const svg = this.avatarManager.generateAvatarSVG();
            if (svg) {
                preview.innerHTML = svg;
            } else {
                preview.innerHTML = this.generateFallbackRealisticAvatar();
            }
        }
    }
    
    generateFallbackRealisticAvatar() {
        return `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="fallbackFaceGradient" cx="0.3" cy="0.3" r="0.8">
                        <stop offset="0%" stop-color="#FFD1C4"/>
                        <stop offset="60%" stop-color="#FDBCB4"/>
                        <stop offset="100%" stop-color="#F1A894"/>
                    </radialGradient>
                    <linearGradient id="fallbackHairGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#5D4037"/>
                        <stop offset="50%" stop-color="#3E2723"/>
                        <stop offset="100%" stop-color="#2C1B18"/>
                    </linearGradient>
                </defs>
                
                <!-- Sfondo -->
                <circle cx="100" cy="100" r="90" fill="#f8f9fa" stroke="#e9ecef" stroke-width="1"/>
                
                <!-- Collo -->
                <ellipse cx="100" cy="175" rx="22" ry="18" fill="url(#fallbackFaceGradient)"/>
                
                <!-- Viso -->
                <ellipse cx="100" cy="110" rx="42" ry="52" fill="url(#fallbackFaceGradient)" stroke="#E8A484" stroke-width="0.5"/>
                
                <!-- Capelli -->
                <path d="M75 85 Q100 70 125 85 L120 95 Q100 80 80 95 Z" fill="url(#fallbackHairGradient)" stroke="#1A0E0A" stroke-width="0.5"/>
                
                <!-- Sopracciglia -->
                <path d="M78 95 Q85 92 92 95" stroke="#2C1B18" stroke-width="2" fill="none" stroke-linecap="round"/>
                <path d="M108 95 Q115 92 122 95" stroke="#2C1B18" stroke-width="2" fill="none" stroke-linecap="round"/>
                
                <!-- Occhi -->
                <ellipse cx="85" cy="105" rx="8" ry="6" fill="white" stroke="#00000020" stroke-width="0.5"/>
                <ellipse cx="115" cy="105" rx="8" ry="6" fill="white" stroke="#00000020" stroke-width="0.5"/>
                <circle cx="85" cy="105" r="4" fill="#8B4513"/>
                <circle cx="115" cy="105" r="4" fill="#8B4513"/>
                <circle cx="85" cy="105" r="2" fill="#5D4037"/>
                <circle cx="115" cy="105" r="2" fill="#5D4037"/>
                <circle cx="86" cy="103" r="1.5" fill="white"/>
                <circle cx="116" cy="103" r="1.5" fill="white"/>
                
                <!-- Ciglia -->
                <path d="M77 100 Q85 98 93 100" stroke="#00000040" stroke-width="1" fill="none" stroke-linecap="round"/>
                <path d="M107 100 Q115 98 123 100" stroke="#00000040" stroke-width="1" fill="none" stroke-linecap="round"/>
                
                <!-- Naso -->
                <ellipse cx="100" cy="115" rx="3.5" ry="5" fill="#E8A484" opacity="0.6"/>
                <path d="M97 116 L103 116" stroke="#D89A7A" stroke-width="1" opacity="0.7"/>
                <ellipse cx="98" cy="117" rx="1" ry="1.5" fill="#D89A7A" opacity="0.4"/>
                <ellipse cx="102" cy="117" rx="1" ry="1.5" fill="#D89A7A" opacity="0.4"/>
                
                <!-- Bocca -->
                <path d="M92 130 Q100 138 108 130" stroke="#FF6B9D" stroke-width="4" fill="none" stroke-linecap="round"/>
                <path d="M94 131 Q100 136 106 131" stroke="#FFB6C1" stroke-width="2" fill="none" stroke-linecap="round"/>
            </svg>
        `;
    }
    
    updateControls() {
        const avatar = this.avatarManager.currentAvatar;
        
        // Update selects
        ['faceShape', 'hairStyle', 'hairLength', 'eyeShape', 'noseShape', 'mouthExpression', 'glasses', 'facialHair', 'earrings'].forEach(id => {
            const element = this.container.querySelector(`#${id}`);
            if (element) {
                if (id === 'facialHair') {
                    element.value = avatar.accessories.facialHair;
                } else if (id === 'glasses') {
                    element.value = avatar.accessories.glasses;
                } else if (id === 'earrings') {
                    element.value = avatar.accessories.earrings;
                } else {
                    element.value = avatar[id];
                }
            }
        });
        
        // Update gender buttons
        this.container.querySelectorAll('.gender-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.gender === avatar.gender);
        });
        
        // Update color swatches
        this.container.querySelectorAll('.color-swatch').forEach(swatch => {
            const color = swatch.dataset.color;
            const type = swatch.dataset.type;
            
            if (type === 'hair') {
                swatch.classList.toggle('active', color === avatar.hairColor);
            } else if (type === 'eye') {
                swatch.classList.toggle('active', color === avatar.eyeColor);
            } else {
                swatch.classList.toggle('active', color === avatar.skinTone);
            }
        });
    }
    
    setupPhotoUpload() {
        const uploadArea = this.container.querySelector('#uploadArea');
        const photoUpload = this.container.querySelector('#photoUpload');
        
        if (uploadArea && photoUpload) {
            uploadArea.addEventListener('click', () => photoUpload.click());
            
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handlePhotoUpload(files[0]);
                }
            });
            
            photoUpload.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handlePhotoUpload(e.target.files[0]);
                }
            });
        }
    }
    
    handlePhotoUpload(file) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.photoFile = e.target.result;
                this.avatarManager.setPhoto(e.target.result);
                this.updateAvatarDisplay();
                this.showNotification('📸 Foto caricata con successo!');
            };
            reader.readAsDataURL(file);
        } else {
            this.showNotification('❌ Seleziona un file immagine valido');
        }
    }
    
    showNotification(message) {
        // Simple notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// === 🎨 MAIN AVATAR SYSTEM ===
class RealisticAvatarSystem {
    static async initializeRealisticAvatarSystem(userId) {
        console.log('🚀 Inizializzazione Sistema Avatar Realistico v4.0...');
        
        // Inject CSS
        this.injectCSS();
        
        // Create avatar manager
        const avatarManager = new AvatarManager(userId);
        
        // Load existing avatar
        avatarManager.loadAvatar();
        
        // Force generate realistic avatar immediately
        avatarManager.setMode('realistic');
        
        console.log('✅ Sistema Avatar Realistico inizializzato per utente:', userId);
        console.log('🎨 Avatar realistico generato:', avatarManager.currentAvatar);
        return avatarManager;
    }
    
    static createAvatarUI(containerId, avatarManager) {
        console.log('🎨 Creazione UI Avatar per container:', containerId);
        return new AvatarUIBuilder(containerId, avatarManager);
    }
    
    static injectCSS() {
        if (document.getElementById('realistic-avatar-styles')) return;
        
        const styles = `
            <style id="realistic-avatar-styles">
                .avatar-builder-simple {
                    max-width: 500px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: #ffffff;
                    border-radius: 15px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                }
                
                .avatar-modes {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                
                .mode-btn {
                    flex: 1;
                    padding: 12px;
                    border: 2px solid #e0e0e0;
                    background: white;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 500;
                }
                
                .mode-btn.active {
                    background: #4CAF50;
                    color: white;
                    border-color: #4CAF50;
                }
                
                .mode-btn:hover {
                    background: #f5f5f5;
                    border-color: #4CAF50;
                }
                
                .mode-btn.active:hover {
                    background: #45a049;
                }
                
                .avatar-display {
                    text-align: center;
                    margin-bottom: 25px;
                }
                
                .avatar-preview {
                    width: 150px;
                    height: 150px;
                    margin: 0 auto;
                    border: 3px solid #e0e0e0;
                    border-radius: 50%;
                    overflow: hidden;
                    background: #f9f9f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .avatar-preview svg {
                    width: 100%;
                    height: 100%;
                }
                
                .photo-placeholder {
                    color: #999;
                    font-size: 16px;
                    text-align: center;
                    line-height: 1.4;
                }
                
                .avatar-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                
                .control-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .control-group label {
                    font-weight: 600;
                    color: #333;
                    font-size: 14px;
                }
                
                .gender-selector {
                    display: flex;
                    gap: 10px;
                }
                
                .gender-btn {
                    flex: 1;
                    padding: 10px;
                    border: 2px solid #e0e0e0;
                    background: white;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 14px;
                }
                
                .gender-btn.active {
                    background: #2196F3;
                    color: white;
                    border-color: #2196F3;
                }
                
                .gender-btn:hover {
                    border-color: #2196F3;
                }
                
                .avatar-select {
                    padding: 10px;
                    border: 2px solid #e0e0e0;
                    border-radius: 6px;
                    background: white;
                    font-size: 14px;
                    cursor: pointer;
                    transition: border-color 0.3s ease;
                }
                
                .avatar-select:focus {
                    outline: none;
                    border-color: #4CAF50;
                }
                
                .color-palette {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                
                .color-swatch {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    border: 3px solid transparent;
                    transition: all 0.3s ease;
                }
                
                .color-swatch:hover {
                    transform: scale(1.1);
                    border-color: #333;
                }
                
                .color-swatch.active {
                    border-color: #4CAF50;
                    transform: scale(1.15);
                    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
                }
                
                .hair-controls {
                    display: flex;
                    gap: 10px;
                }
                
                .hair-controls select {
                    flex: 1;
                }
                
                .eye-controls {
                    display: flex;
                    gap: 10px;
                }
                
                .eye-controls select {
                    flex: 1;
                }
                
                .accessory-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .photo-upload {
                    border: 2px dashed #ccc;
                    border-radius: 8px;
                    padding: 20px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .photo-upload:hover {
                    border-color: #4CAF50;
                    background: #f9f9f9;
                }
                
                .photo-upload.dragover {
                    border-color: #4CAF50;
                    background: #e8f5e8;
                }
                
                .upload-area p {
                    margin: 0;
                    color: #666;
                    font-size: 14px;
                }
                
                .avatar-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 10px;
                }
                
                .btn-action {
                    flex: 1;
                    padding: 12px;
                    border: 2px solid #e0e0e0;
                    background: white;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    font-size: 14px;
                }
                
                .btn-action:hover {
                    background: #f5f5f5;
                    border-color: #ccc;
                }
                
                .btn-action.primary {
                    background: #4CAF50;
                    color: white;
                    border-color: #4CAF50;
                }
                
                .btn-action.primary:hover {
                    background: #45a049;
                    border-color: #45a049;
                }
                
                /* Responsive */
                @media (max-width: 600px) {
                    .avatar-builder-simple {
                        padding: 15px;
                    }
                    
                    .avatar-preview {
                        width: 120px;
                        height: 120px;
                    }
                    
                    .color-swatch {
                        width: 25px;
                        height: 25px;
                    }
                    
                    .hair-controls,
                    .eye-controls {
                        flex-direction: column;
                    }
                    
                    .avatar-actions {
                        flex-direction: column;
                    }
                }
                
                /* Animations */
                @keyframes avatarUpdate {
                    0% { opacity: 0.7; transform: scale(0.95); }
                    100% { opacity: 1; transform: scale(1); }
                }
                
                .avatar-preview svg {
                    animation: avatarUpdate 0.3s ease;
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
        console.log('🎨 Stili Avatar System iniettati');
    }
    
    // Public API methods
    static getAvatarConfig() {
        return AVATAR_CONFIG;
    }
    
    static createStandaloneAvatar(config) {
        if (config.mode === 'realistic') {
            return RealisticSVGGenerator.generateRealisticAvatar(config);
        }
        return null;
    }
}

// === 🌐 GLOBAL EXPOSURE ===
// Expose to window for browser compatibility
window.RealisticAvatarSystem = RealisticAvatarSystem;
window.AvatarManager = AvatarManager;
window.AvatarUIBuilder = AvatarUIBuilder;
window.RealisticSVGGenerator = RealisticSVGGenerator;
window.AVATAR_CONFIG = AVATAR_CONFIG;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🎨 Realistic Avatar System Ready!');
    });
} else {
    console.log('🎨 Realistic Avatar System Ready!');
}

console.log('✅ Avatar System Realistic v4.0 caricato completamente!');