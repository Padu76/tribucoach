// avatar-system-realistic.js - Sistema Avatar 3 Modalità (Cartoon Pulito + Realistico + Foto)
// Stile professionale come immagini allegate - NO proporzioni esagerate

// === 🎨 CONFIGURAZIONE AVATAR SYSTEM ===
const AVATAR_CONFIG = {
    version: '3.0',
    modes: ['cartoon', 'realistic', 'photo'],
    
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
    
    // Tonalità pelle
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
    
    // Colori capelli
    hairColors: [
        '#2C1B18', '#4A312C', '#8B4513', '#D2691E',
        '#DEB887', '#F4A460', '#FFD700', '#FF6347',
        '#8A2BE2', '#FF1493', '#00CED1', '#32CD32'
    ],
    
    // Forme occhi
    eyeShapes: [
        'normal', 'round', 'almond', 'narrow', 'wide', 'asian'
    ],
    
    // Colori occhi
    eyeColors: [
        '#8B4513', '#654321', '#228B22', '#0000FF',
        '#808080', '#90EE90', '#FFA500', '#800080'
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

// === 🎨 SVG GENERATORS ===
class SVGAvatarGenerator {
    
    // CARTOON STYLE - Pulito e professionale come immagini
    static generateCartoonAvatar(config) {
        const { gender, faceShape, skinTone, hairStyle, hairColor, hairLength, 
                eyeShape, eyeColor, noseShape, mouthExpression, accessories } = config;
        
        return `
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <!-- Sfondo -->
            <circle cx="100" cy="100" r="90" fill="#f8f9fa" stroke="#e9ecef" stroke-width="2"/>
            
            <!-- Viso -->
            ${this.generateCartoonFace(faceShape, skinTone, gender)}
            
            <!-- Capelli -->
            ${this.generateCartoonHair(hairStyle, hairColor, hairLength, gender)}
            
            <!-- Occhi -->
            ${this.generateCartoonEyes(eyeShape, eyeColor, gender)}
            
            <!-- Naso -->
            ${this.generateCartoonNose(noseShape, gender)}
            
            <!-- Bocca -->
            ${this.generateCartoonMouth(mouthExpression, gender)}
            
            <!-- Accessori -->
            ${this.generateCartoonAccessories(accessories, gender)}
        </svg>`;
    }
    
    // REALISTIC STYLE - Versione più dettagliata
    static generateRealisticAvatar(config) {
        const { gender, faceShape, skinTone, hairStyle, hairColor, hairLength, 
                eyeShape, eyeColor, noseShape, mouthExpression, accessories } = config;
        
        return `
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <!-- Gradienti per realismo -->
                <radialGradient id="faceGradient" cx="0.3" cy="0.3" r="0.8">
                    <stop offset="0%" stop-color="${this.lightenColor(skinTone, 20)}"/>
                    <stop offset="100%" stop-color="${skinTone}"/>
                </radialGradient>
                <linearGradient id="hairGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="${this.lightenColor(hairColor, 30)}"/>
                    <stop offset="100%" stop-color="${hairColor}"/>
                </linearGradient>
            </defs>
            
            <!-- Sfondo -->
            <circle cx="100" cy="100" r="90" fill="#f1f3f4" stroke="#dadce0" stroke-width="1"/>
            
            <!-- Viso -->
            ${this.generateRealisticFace(faceShape, skinTone, gender)}
            
            <!-- Capelli -->
            ${this.generateRealisticHair(hairStyle, hairColor, hairLength, gender)}
            
            <!-- Occhi -->
            ${this.generateRealisticEyes(eyeShape, eyeColor, gender)}
            
            <!-- Naso -->
            ${this.generateRealisticNose(noseShape, gender)}
            
            <!-- Bocca -->
            ${this.generateRealisticMouth(mouthExpression, gender)}
            
            <!-- Accessori -->
            ${this.generateRealisticAccessories(accessories, gender)}
        </svg>`;
    }
    
    // === CARTOON COMPONENTS ===
    
    static generateCartoonFace(shape, skinTone, gender) {
        const shapes = {
            oval: `<ellipse cx="100" cy="110" rx="45" ry="55" fill="${skinTone}" stroke="#00000020" stroke-width="1"/>`,
            round: `<circle cx="100" cy="110" r="50" fill="${skinTone}" stroke="#00000020" stroke-width="1"/>`,
            square: `<rect x="55" y="65" width="90" height="90" rx="15" fill="${skinTone}" stroke="#00000020" stroke-width="1"/>`,
            heart: `<path d="M100 65 C120 65, 140 85, 140 110 L140 140 C140 155, 125 165, 100 165 C75 165, 60 155, 60 140 L60 110 C60 85, 80 65, 100 65 Z" fill="${skinTone}" stroke="#00000020" stroke-width="1"/>`,
            diamond: `<path d="M100 70 L125 100 L100 160 L75 100 Z" fill="${skinTone}" stroke="#00000020" stroke-width="1"/>`,
            long: `<ellipse cx="100" cy="115" rx="40" ry="60" fill="${skinTone}" stroke="#00000020" stroke-width="1"/>`
        };
        return shapes[shape] || shapes.oval;
    }
    
    static generateCartoonHair(style, color, length, gender) {
        const hairStyles = {
            // MASCHI
            short_neat: `<path d="M70 85 Q100 70 130 85 L125 95 Q100 80 75 95 Z" fill="${color}"/>`,
            short_messy: `<path d="M65 80 Q75 65 85 75 Q95 60 105 70 Q115 55 125 70 Q135 65 135 85 L130 90 Q100 75 70 90 Z" fill="${color}"/>`,
            crew_cut: `<path d="M75 88 Q100 75 125 88 L120 92 Q100 82 80 92 Z" fill="${color}"/>`,
            pompadour: `<path d="M70 90 Q80 60 100 65 Q120 60 130 90 L125 95 Q100 80 75 95 Z" fill="${color}"/>`,
            medium_side: `<path d="M65 85 Q70 70 85 75 Q100 70 115 75 Q130 70 135 85 L130 100 Q100 85 70 100 Z" fill="${color}"/>`,
            long_wavy: `<path d="M60 85 Q65 65 80 70 Q95 60 110 70 Q125 60 140 85 L135 110 Q120 100 105 110 Q90 100 75 110 L65 100 Z" fill="${color}"/>`,
            curly: `<circle cx="85" cy="80" r="8" fill="${color}"/><circle cx="100" cy="75" r="10" fill="${color}"/><circle cx="115" cy="80" r="8" fill="${color}"/>`,
            bald: ``,
            
            // FEMMINE  
            bob_short: `<path d="M65 85 Q100 70 135 85 L135 105 Q100 95 65 105 Z" fill="${color}"/>`,
            bob_medium: `<path d="M60 85 Q100 65 140 85 L140 115 Q100 100 60 115 Z" fill="${color}"/>`,
            long_straight: `<path d="M65 85 Q100 70 135 85 L135 140 Q100 130 65 140 Z" fill="${color}"/>`,
            long_wavy: `<path d="M60 85 Q100 65 140 85 Q145 100 135 115 Q140 130 130 145 Q70 145 60 130 Q55 115 65 100 Q60 90 60 85 Z" fill="${color}"/>`,
            curly_short: `<circle cx="80" cy="80" r="10" fill="${color}"/><circle cx="100" cy="75" r="12" fill="${color}"/><circle cx="120" cy="80" r="10" fill="${color}"/>`,
            curly_long: `<circle cx="75" cy="85" r="12" fill="${color}"/><circle cx="100" cy="75" r="15" fill="${color}"/><circle cx="125" cy="85" r="12" fill="${color}"/><circle cx="85" cy="110" r="10" fill="${color}"/><circle cx="115" cy="110" r="10" fill="${color}"/>`,
            ponytail: `<path d="M70 85 Q100 70 130 85 L125 95 Q100 80 75 95 Z" fill="${color}"/><ellipse cx="130" cy="100" rx="8" ry="20" fill="${color}"/>`,
            bun: `<path d="M70 85 Q100 70 130 85 L125 95 Q100 80 75 95 Z" fill="${color}"/><circle cx="100" cy="75" r="15" fill="${color}"/>`
        };
        
        return hairStyles[style] || hairStyles[gender === 'male' ? 'short_neat' : 'bob_short'];
    }
    
    static generateCartoonEyes(shape, color, gender) {
        const baseEye = `
            <ellipse cx="85" cy="105" rx="8" ry="6" fill="white" stroke="#00000030" stroke-width="1"/>
            <ellipse cx="115" cy="105" rx="8" ry="6" fill="white" stroke="#00000030" stroke-width="1"/>
            <circle cx="85" cy="105" r="4" fill="${color}"/>
            <circle cx="115" cy="105" r="4" fill="${color}"/>
            <circle cx="86" cy="103" r="1.5" fill="white"/>
            <circle cx="116" cy="103" r="1.5" fill="white"/>
        `;
        
        const shapes = {
            normal: baseEye,
            round: baseEye.replace(/rx="8" ry="6"/g, 'rx="7" ry="7"'),
            almond: `
                <ellipse cx="85" cy="105" rx="10" ry="5" fill="white" stroke="#00000030" stroke-width="1"/>
                <ellipse cx="115" cy="105" rx="10" ry="5" fill="white" stroke="#00000030" stroke-width="1"/>
                <circle cx="85" cy="105" r="3" fill="${color}"/>
                <circle cx="115" cy="105" r="3" fill="${color}"/>
                <circle cx="86" cy="103" r="1" fill="white"/>
                <circle cx="116" cy="103" r="1" fill="white"/>
            `,
            narrow: baseEye.replace(/ry="6"/g, 'ry="4"'),
            wide: baseEye.replace(/rx="8"/g, 'rx="10"'),
            asian: `
                <path d="M77 105 Q85 102 93 105 Q85 108 77 105" fill="white" stroke="#00000030" stroke-width="1"/>
                <path d="M107 105 Q115 102 123 105 Q115 108 107 105" fill="white" stroke="#00000030" stroke-width="1"/>
                <circle cx="85" cy="105" r="3" fill="${color}"/>
                <circle cx="115" cy="105" r="3" fill="${color}"/>
            `
        };
        
        return shapes[shape] || shapes.normal;
    }
    
    static generateCartoonNose(shape, gender) {
        const noses = {
            small: `<ellipse cx="100" cy="115" rx="2" ry="3" fill="#00000015"/>`,
            medium: `<ellipse cx="100" cy="115" rx="3" ry="4" fill="#00000020"/>`,
            large: `<ellipse cx="100" cy="115" rx="4" ry="5" fill="#00000025"/>`,
            pointed: `<path d="M100 110 L105 120 L100 118 L95 120 Z" fill="#00000020"/>`,
            wide: `<ellipse cx="100" cy="115" rx="5" ry="3" fill="#00000020"/>`,
            narrow: `<ellipse cx="100" cy="115" rx="2" ry="5" fill="#00000015"/>`
        };
        return noses[shape] || noses.medium;
    }
    
    static generateCartoonMouth(expression, gender) {
        const mouths = {
            neutral: `<ellipse cx="100" cy="130" rx="8" ry="3" fill="#FF6B6B"/>`,
            smile: `<path d="M92 130 Q100 138 108 130" stroke="#FF6B6B" stroke-width="3" fill="none"/>`,
            happy: `<path d="M90 128 Q100 140 110 128" stroke="#FF6B6B" stroke-width="4" fill="none"/>`,
            laugh: `<ellipse cx="100" cy="132" rx="12" ry="8" fill="#FF6B6B"/><ellipse cx="100" cy="130" rx="10" ry="6" fill="#FFB6C1"/>`,
            serious: `<line x1="92" y1="130" x2="108" y2="130" stroke="#FF6B6B" stroke-width="3"/>`,
            sad: `<path d="M92 132 Q100 125 108 132" stroke="#FF6B6B" stroke-width="3" fill="none"/>`
        };
        return mouths[expression] || mouths.neutral;
    }
    
    static generateCartoonAccessories(accessories, gender) {
        let result = '';
        
        // Occhiali
        if (accessories.glasses && accessories.glasses !== 'none') {
            const glasses = {
                round: `<circle cx="85" cy="105" r="12" fill="none" stroke="#333" stroke-width="2"/><circle cx="115" cy="105" r="12" fill="none" stroke="#333" stroke-width="2"/><line x1="97" y1="105" x2="103" y2="105" stroke="#333" stroke-width="2"/>`,
                square: `<rect x="73" y="93" width="24" height="24" rx="2" fill="none" stroke="#333" stroke-width="2"/><rect x="103" y="93" width="24" height="24" rx="2" fill="none" stroke="#333" stroke-width="2"/><line x1="97" y1="105" x2="103" y2="105" stroke="#333" stroke-width="2"/>`,
                aviator: `<ellipse cx="85" cy="105" rx="15" ry="12" fill="none" stroke="#333" stroke-width="2"/><ellipse cx="115" cy="105" rx="15" ry="12" fill="none" stroke="#333" stroke-width="2"/><line x1="100" y1="105" x2="100" y2="105" stroke="#333" stroke-width="2"/>`,
                reading: `<rect x="75" y="100" width="20" height="15" rx="2" fill="none" stroke="#333" stroke-width="2"/><rect x="105" y="100" width="20" height="15" rx="2" fill="none" stroke="#333" stroke-width="2"/><line x1="95" y1="107" x2="105" y2="107" stroke="#333" stroke-width="2"/>`,
                sunglasses: `<ellipse cx="85" cy="105" rx="12" ry="10" fill="#333"/><ellipse cx="115" cy="105" rx="12" ry="10" fill="#333"/><line x1="97" y1="105" x2="103" y2="105" stroke="#333" stroke-width="3"/>`
            };
            result += glasses[accessories.glasses] || '';
        }
        
        // Peli facciali (solo maschi)
        if (gender === 'male' && accessories.facialHair && accessories.facialHair !== 'none') {
            const facialHair = {
                mustache: `<ellipse cx="100" cy="122" rx="8" ry="2" fill="#4A4A4A"/>`,
                goatee: `<ellipse cx="100" cy="140" rx="6" ry="8" fill="#4A4A4A"/>`,
                beard_short: `<path d="M85 125 Q100 145 115 125 Q115 140 100 145 Q85 140 85 125" fill="#4A4A4A"/>`,
                beard_full: `<path d="M80 120 Q100 150 120 120 Q120 145 100 155 Q80 145 80 120" fill="#4A4A4A"/>`,
                stubble: `<ellipse cx="100" cy="130" rx="15" ry="12" fill="#4A4A4A" opacity="0.3"/>`
            };
            result += facialHair[accessories.facialHair] || '';
        }
        
        // Orecchini
        if (accessories.earrings && accessories.earrings !== 'none') {
            const earrings = {
                studs: `<circle cx="70" cy="110" r="2" fill="#FFD700"/><circle cx="130" cy="110" r="2" fill="#FFD700"/>`,
                hoops: `<circle cx="70" cy="110" r="4" fill="none" stroke="#FFD700" stroke-width="2"/><circle cx="130" cy="110" r="4" fill="none" stroke="#FFD700" stroke-width="2"/>`,
                drops: `<ellipse cx="70" cy="115" rx="2" ry="5" fill="#FFD700"/><ellipse cx="130" cy="115" rx="2" ry="5" fill="#FFD700"/>`
            };
            result += earrings[accessories.earrings] || '';
        }
        
        return result;
    }
    
    // === REALISTIC COMPONENTS ===
    
    static generateRealisticFace(shape, skinTone, gender) {
        const shapes = {
            oval: `<ellipse cx="100" cy="110" rx="45" ry="55" fill="url(#faceGradient)" stroke="#00000010" stroke-width="1"/>`,
            round: `<circle cx="100" cy="110" r="50" fill="url(#faceGradient)" stroke="#00000010" stroke-width="1"/>`,
            square: `<rect x="55" y="65" width="90" height="90" rx="15" fill="url(#faceGradient)" stroke="#00000010" stroke-width="1"/>`,
            heart: `<path d="M100 65 C120 65, 140 85, 140 110 L140 140 C140 155, 125 165, 100 165 C75 165, 60 155, 60 140 L60 110 C60 85, 80 65, 100 65 Z" fill="url(#faceGradient)" stroke="#00000010" stroke-width="1"/>`,
            diamond: `<path d="M100 70 L125 100 L100 160 L75 100 Z" fill="url(#faceGradient)" stroke="#00000010" stroke-width="1"/>`,
            long: `<ellipse cx="100" cy="115" rx="40" ry="60" fill="url(#faceGradient)" stroke="#00000010" stroke-width="1"/>`
        };
        return shapes[shape] || shapes.oval;
    }
    
    static generateRealisticHair(style, color, length, gender) {
        // Versione più dettagliata dei capelli cartoon con gradienti
        const hairStyles = {
            // MASCHI
            short_neat: `<path d="M70 85 Q100 70 130 85 L125 95 Q100 80 75 95 Z" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/>`,
            short_messy: `<path d="M65 80 Q75 65 85 75 Q95 60 105 70 Q115 55 125 70 Q135 65 135 85 L130 90 Q100 75 70 90 Z" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/>`,
            crew_cut: `<path d="M75 88 Q100 75 125 88 L120 92 Q100 82 80 92 Z" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/>`,
            pompadour: `<path d="M70 90 Q80 60 100 65 Q120 60 130 90 L125 95 Q100 80 75 95 Z" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/>`,
            medium_side: `<path d="M65 85 Q70 70 85 75 Q100 70 115 75 Q130 70 135 85 L130 100 Q100 85 70 100 Z" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/>`,
            long_wavy: `<path d="M60 85 Q65 65 80 70 Q95 60 110 70 Q125 60 140 85 L135 110 Q120 100 105 110 Q90 100 75 110 L65 100 Z" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/>`,
            curly: `<circle cx="85" cy="80" r="8" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/><circle cx="100" cy="75" r="10" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/><circle cx="115" cy="80" r="8" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/>`,
            bald: ``,
            
            // FEMMINE  
            bob_short: `<path d="M65 85 Q100 70 135 85 L135 105 Q100 95 65 105 Z" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/>`,
            bob_medium: `<path d="M60 85 Q100 65 140 85 L140 115 Q100 100 60 115 Z" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/>`,
            long_straight: `<path d="M65 85 Q100 70 135 85 L135 140 Q100 130 65 140 Z" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/>`,
            long_wavy: `<path d="M60 85 Q100 65 140 85 Q145 100 135 115 Q140 130 130 145 Q70 145 60 130 Q55 115 65 100 Q60 90 60 85 Z" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/>`,
            curly_short: `<circle cx="80" cy="80" r="10" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/><circle cx="100" cy="75" r="12" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/><circle cx="120" cy="80" r="10" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/>`,
            curly_long: `<circle cx="75" cy="85" r="12" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/><circle cx="100" cy="75" r="15" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/><circle cx="125" cy="85" r="12" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/><circle cx="85" cy="110" r="10" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/><circle cx="115" cy="110" r="10" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/>`,
            ponytail: `<path d="M70 85 Q100 70 130 85 L125 95 Q100 80 75 95 Z" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/><ellipse cx="130" cy="100" rx="8" ry="20" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/>`,
            bun: `<path d="M70 85 Q100 70 130 85 L125 95 Q100 80 75 95 Z" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/><circle cx="100" cy="75" r="15" fill="url(#hairGradient)" stroke="${this.darkenColor(color, 20)}" stroke-width="0.5"/>`
        };
        
        return hairStyles[style] || hairStyles[gender === 'male' ? 'short_neat' : 'bob_short'];
    }
    
    static generateRealisticEyes(shape, color, gender) {
        const baseEye = `
            <ellipse cx="85" cy="105" rx="8" ry="6" fill="white" stroke="#00000020" stroke-width="0.5"/>
            <ellipse cx="115" cy="105" rx="8" ry="6" fill="white" stroke="#00000020" stroke-width="0.5"/>
            <circle cx="85" cy="105" r="4" fill="${color}"/>
            <circle cx="115" cy="105" r="4" fill="${color}"/>
            <circle cx="85" cy="105" r="2" fill="${this.darkenColor(color, 30)}"/>
            <circle cx="115" cy="105" r="2" fill="${this.darkenColor(color, 30)}"/>
            <circle cx="86" cy="103" r="1.5" fill="white"/>
            <circle cx="116" cy="103" r="1.5" fill="white"/>
            <!-- Ciglia -->
            <path d="M77 100 Q85 98 93 100" stroke="#333" stroke-width="0.8" fill="none"/>
            <path d="M107 100 Q115 98 123 100" stroke="#333" stroke-width="0.8" fill="none"/>
        `;
        
        return baseEye; // Versione più dettagliata per il realistico
    }
    
    static generateRealisticNose(shape, gender) {
        const noses = {
            small: `<ellipse cx="100" cy="115" rx="2" ry="3" fill="#00000010"/><path d="M98 113 L102 113" stroke="#00000020" stroke-width="0.5"/>`,
            medium: `<ellipse cx="100" cy="115" rx="3" ry="4" fill="#00000015"/><path d="M97 112 L103 112" stroke="#00000025" stroke-width="0.8"/>`,
            large: `<ellipse cx="100" cy="115" rx="4" ry="5" fill="#00000020"/><path d="M96 111 L104 111" stroke="#00000030" stroke-width="1"/>`,
            pointed: `<path d="M100 110 L105 120 L100 118 L95 120 Z" fill="#00000015"/><path d="M98 112 L102 112" stroke="#00000025" stroke-width="0.5"/>`,
            wide: `<ellipse cx="100" cy="115" rx="5" ry="3" fill="#00000015"/><path d="M95 114 L105 114" stroke="#00000025" stroke-width="0.8"/>`,
            narrow: `<ellipse cx="100" cy="115" rx="2" ry="5" fill="#00000010"/><path d="M99 110 L101 110" stroke="#00000020" stroke-width="0.5"/>`
        };
        return noses[shape] || noses.medium;
    }
    
    static generateRealisticMouth(expression, gender) {
        const mouths = {
            neutral: `<ellipse cx="100" cy="130" rx="8" ry="3" fill="#FF6B6B"/><ellipse cx="100" cy="129" rx="6" ry="2" fill="#FFB6C1"/>`,
            smile: `<path d="M92 130 Q100 138 108 130" stroke="#FF6B6B" stroke-width="3" fill="none"/><path d="M94 131 Q100 136 106 131" stroke="#FFB6C1" stroke-width="1.5" fill="none"/>`,
            happy: `<path d="M90 128 Q100 140 110 128" stroke="#FF6B6B" stroke-width="4" fill="none"/><ellipse cx="100" cy="132" rx="8" ry="4" fill="#FFB6C1"/>`,
            laugh: `<ellipse cx="100" cy="132" rx="12" ry="8" fill="#FF6B6B"/><ellipse cx="100" cy="130" rx="10" ry="6" fill="#FFB6C1"/><rect x="95" y="128" width="10" height="3" fill="white"/>`,
            serious: `<line x1="92" y1="130" x2="108" y2="130" stroke="#FF6B6B" stroke-width="3"/><line x1="94" y1="129" x2="106" y2="129" stroke="#FFB6C1" stroke-width="1"/>`,
            sad: `<path d="M92 132 Q100 125 108 132" stroke="#FF6B6B" stroke-width="3" fill="none"/><path d="M94 131 Q100 127 106 131" stroke="#FFB6C1" stroke-width="1.5" fill="none"/>`
        };
        return mouths[expression] || mouths.neutral;
    }
    
    static generateRealisticAccessories(accessories, gender) {
        // Versione più dettagliata degli accessori cartoon
        return this.generateCartoonAccessories(accessories, gender); // Per ora usa la stessa logica ma più dettagliata
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
        this.currentMode = 'cartoon'; // cartoon, realistic, photo
    }
    
    getDefaultAvatar() {
        return {
            mode: 'cartoon',
            gender: 'male',
            faceShape: 'oval',
            skinTone: '#FDBCB4',
            hairStyle: 'short_neat',
            hairColor: '#2C1B18',
            hairLength: 'short',
            eyeShape: 'normal',
            eyeColor: '#8B4513',
            noseShape: 'medium',
            mouthExpression: 'neutral',
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
        if (['cartoon', 'realistic', 'photo'].includes(mode)) {
            this.currentMode = mode;
            this.currentAvatar.mode = mode;
            this.saveAvatar();
            return true;
        }
        return false;
    }
    
    generateAvatarSVG() {
        if (this.currentMode === 'cartoon') {
            return SVGAvatarGenerator.generateCartoonAvatar(this.currentAvatar);
        } else if (this.currentMode === 'realistic') {
            return SVGAvatarGenerator.generateRealisticAvatar(this.currentAvatar);
        }
        return null; // Photo mode non genera SVG
    }
    
    saveAvatar() {
        try {
            const avatarData = {
                userId: this.userId,
                avatar: this.currentAvatar,
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
                this.currentMode = saved.avatar.mode || 'cartoon';
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
            mode: this.currentMode,
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

// === 🎨 UI BUILDER ===
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
            <div class="avatar-builder-v3">
                <!-- Header con modalità -->
                <div class="avatar-modes">
                    <button class="mode-btn active" data-mode="cartoon">
                        🎨 Cartoon
                    </button>
                    <button class="mode-btn" data-mode="realistic">
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
        const photoUpload = this.container.querySelector('#photoUpload');
        const uploadArea = this.container.querySelector('#uploadArea');
        
        if (photoUpload && uploadArea) {
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
                alert('✅ Avatar salvato!');
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
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = `<img src="${e.target.result}" alt="Avatar Photo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
            };
            reader.readAsDataURL(this.photoFile);
        } else if (this.avatarManager.currentMode !== 'photo') {
            // Display SVG avatar
            const svg = this.avatarManager.generateAvatarSVG();
            if (svg) {
                preview.innerHTML = svg;
            }
        } else {
            // Placeholder for photo mode
            preview.innerHTML = '<div class="photo-placeholder">📸<br>Carica una foto</div>';
        }
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
    
    handlePhotoUpload(file) {
        if (file && file.type.startsWith('image/')) {
            this.photoFile = file;
            this.updateAvatarDisplay();
            console.log('📸 Foto caricata:', file.name);
        } else {
            alert('❌ Seleziona un file immagine valido');
        }
    }
}

// === 🎨 MAIN AVATAR SYSTEM ===
class RealisticAvatarSystem {
    static async initializeRealisticAvatarSystem(userId) {
        console.log('🚀 Inizializzazione Sistema Avatar Realistico v3.0...');
        
        // Inject CSS
        this.injectCSS();
        
        // Create avatar manager
        const avatarManager = new AvatarManager(userId);
        
        // Load existing avatar
        avatarManager.loadAvatar();
        
        console.log('✅ Sistema Avatar Realistico inizializzato per utente:', userId);
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
                .avatar-builder-v3 {
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
                    .avatar-builder-v3 {
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
                
                /* Hide scrollbars but keep functionality */
                .avatar-builder-v3 {
                    scrollbar-width: thin;
                    scrollbar-color: #ccc transparent;
                }
                
                .avatar-builder-v3::-webkit-scrollbar {
                    width: 6px;
                }
                
                .avatar-builder-v3::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .avatar-builder-v3::-webkit-scrollbar-thumb {
                    background-color: #ccc;
                    border-radius: 3px;
                }
                
                .avatar-builder-v3::-webkit-scrollbar-thumb:hover {
                    background-color: #999;
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
        if (config.mode === 'cartoon') {
            return SVGAvatarGenerator.generateCartoonAvatar(config);
        } else if (config.mode === 'realistic') {
            return SVGAvatarGenerator.generateRealisticAvatar(config);
        }
        return null;
    }
}

// === 🌐 GLOBAL EXPOSURE ===
// Expose to window for browser compatibility
window.RealisticAvatarSystem = RealisticAvatarSystem;
window.AvatarManager = AvatarManager;
window.AvatarUIBuilder = AvatarUIBuilder;
window.SVGAvatarGenerator = SVGAvatarGenerator;
window.AVATAR_CONFIG = AVATAR_CONFIG;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🎨 Realistic Avatar System Ready!');
    });
} else {
    console.log('🎨 Realistic Avatar System Ready!');
}

console.log('✅ Avatar System Realistic v3.0 caricato completamente!');