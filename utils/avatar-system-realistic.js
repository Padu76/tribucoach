// avatar-system-realistic.js - SISTEMA AVATAR MODULARE PERSONALIZZABILE
// Basato sulle immagini professionali fornite - Componenti combinabili

// === CONFIGURAZIONE AVATAR MODULARE ===
const ModularAvatarConfig = {
    // Tonalità pelle realistiche
    skinTones: [
        { name: 'Molto Chiara', base: '#FDBCB4', shadow: '#F1A894', highlight: '#FFFFFF' },
        { name: 'Chiara', base: '#F7B5A8', shadow: '#E8A584', highlight: '#FFEEE6' },
        { name: 'Media Chiara', base: '#E8B895', shadow: '#D5A785', highlight: '#F5E6D3' },
        { name: 'Media', base: '#DEB887', shadow: '#C8A882', highlight: '#F0E6D2' },
        { name: 'Media Scura', base: '#C8A882', shadow: '#B07854', highlight: '#E0D4C8' },
        { name: 'Scura', base: '#A0522D', shadow: '#8B4513', highlight: '#CD853F' },
        { name: 'Molto Scura', base: '#6D4426', shadow: '#4A2C17', highlight: '#8B5A3C' }
    ],
    
    // Colori capelli
    hairColors: [
        { name: 'Nero', color: '#2C1B18', highlight: '#4A2C17' },
        { name: 'Castano Scuro', color: '#4A2C17', highlight: '#654321' },
        { name: 'Castano', color: '#654321', highlight: '#8B4513' },
        { name: 'Castano Chiaro', color: '#8B4513', highlight: '#A0522D' },
        { name: 'Biondo Scuro', color: '#B8860B', highlight: '#DAA520' },
        { name: 'Biondo', color: '#DAA520', highlight: '#FFD700' },
        { name: 'Biondo Platino', color: '#F5DEB3', highlight: '#FFFACD' },
        { name: 'Rosso', color: '#D2691E', highlight: '#FF6347' },
        { name: 'Grigio', color: '#808080', highlight: '#A9A9A9' },
        { name: 'Bianco', color: '#F5F5F5', highlight: '#FFFFFF' }
    ],
    
    // Stili capelli maschili
    maleHairStyles: [
        { name: 'Corto Classico', value: 'short_classic' },
        { name: 'Buzz Cut', value: 'buzz' },
        { name: 'Moderno Corto', value: 'modern_short' },
        { name: 'Ondulato', value: 'wavy' },
        { name: 'Riccio', value: 'curly' },
        { name: 'Lungo', value: 'long' },
        { name: 'Calvo', value: 'bald' },
        { name: 'Fade', value: 'fade' }
    ],
    
    // Stili capelli femminili
    femaleHairStyles: [
        { name: 'Lungo Liscio', value: 'long_straight' },
        { name: 'Bob', value: 'bob' },
        { name: 'Pixie', value: 'pixie' },
        { name: 'Ondulato Medio', value: 'wavy_medium' },
        { name: 'Riccio', value: 'curly' },
        { name: 'Coda', value: 'ponytail' },
        { name: 'Chignon', value: 'bun' },
        { name: 'Caschetto', value: 'shoulder_length' }
    ],
    
    // Accessori
    accessories: [
        { name: 'Nessuno', value: 'none' },
        { name: 'Occhiali Classici', value: 'glasses_classic' },
        { name: 'Occhiali Moderni', value: 'glasses_modern' },
        { name: 'Occhiali Rotondi', value: 'glasses_round' },
        { name: 'Occhiali da Sole', value: 'sunglasses' }
    ],
    
    // Barba e baffi (solo maschi)
    facialHair: [
        { name: 'Nessuna', value: 'none' },
        { name: 'Barba Corta', value: 'beard_short' },
        { name: 'Barba Media', value: 'beard_medium' },
        { name: 'Barba Lunga', value: 'beard_long' },
        { name: 'Baffi', value: 'mustache' },
        { name: 'Pizzetto', value: 'goatee' },
        { name: 'Stubble', value: 'stubble' }
    ],
    
    // Colori vestiti
    clothingColors: [
        { name: 'Blu Navy', color: '#2C5282' },
        { name: 'Azzurro', color: '#4A90E2' },
        { name: 'Rosso', color: '#E53E3E' },
        { name: 'Verde', color: '#38A169' },
        { name: 'Viola', color: '#805AD5' },
        { name: 'Grigio', color: '#718096' },
        { name: 'Nero', color: '#2D3748' },
        { name: 'Bianco', color: '#FFFFFF' },
        { name: 'Giallo', color: '#F6E05E' },
        { name: 'Rosa', color: '#ED64A6' }
    ]
};

// === GENERATORE AVATAR MODULARE ===
class ModularAvatarGenerator {
    static generate(config) {
        const avatarId = `avatar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Colori personalizzati
        const skinTone = config.skinTone;
        const hairColor = config.hairColor;
        const clothingColor = config.clothingColor;
        
        return `
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
        ${this.generateGradients(config, avatarId)}
        ${this.generateFilters(avatarId)}
    </defs>
    
    <!-- Background Circle (colorato casuale) -->
    <circle cx="100" cy="100" r="95" fill="${this.getRandomBackgroundColor()}"/>
    
    <!-- Corpo/Spalle -->
    ${this.generateBody(config, avatarId)}
    
    <!-- Collo -->
    ${this.generateNeck(config, avatarId)}
    
    <!-- Viso Base -->
    ${this.generateFace(config, avatarId)}
    
    <!-- Orecchie -->
    ${this.generateEars(config, avatarId)}
    
    <!-- Capelli (dietro) -->
    ${this.generateHairBack(config, avatarId)}
    
    <!-- Sopracciglia -->
    ${this.generateEyebrows(config, avatarId)}
    
    <!-- Occhi -->
    ${this.generateEyes(config, avatarId)}
    
    <!-- Naso -->
    ${this.generateNose(config, avatarId)}
    
    <!-- Bocca -->
    ${this.generateMouth(config, avatarId)}
    
    <!-- Barba/Baffi -->
    ${config.gender === 'male' ? this.generateFacialHair(config, avatarId) : ''}
    
    <!-- Capelli (davanti) -->
    ${this.generateHairFront(config, avatarId)}
    
    <!-- Accessori -->
    ${this.generateAccessories(config, avatarId)}
    
    <!-- Ombre e luci finali -->
    ${this.generateFinalShading(config, avatarId)}
</svg>`;
    }
    
    static generateGradients(config, avatarId) {
        const skin = config.skinTone;
        const hair = config.hairColor;
        
        return `
            <!-- Gradiente viso -->
            <radialGradient id="faceGrad${avatarId}" cx="0.3" cy="0.2" r="0.9">
                <stop offset="0%" stop-color="${skin.highlight}"/>
                <stop offset="40%" stop-color="${skin.base}"/>
                <stop offset="100%" stop-color="${skin.shadow}"/>
            </radialGradient>
            
            <!-- Gradiente capelli -->
            <radialGradient id="hairGrad${avatarId}" cx="0.3" cy="0.2" r="0.8">
                <stop offset="0%" stop-color="${hair.highlight}"/>
                <stop offset="100%" stop-color="${hair.color}"/>
            </radialGradient>
            
            <!-- Gradiente corpo -->
            <linearGradient id="bodyGrad${avatarId}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="${config.clothingColor.color}"/>
                <stop offset="100%" stop-color="${this.darkenColor(config.clothingColor.color, 20)}"/>
            </linearGradient>
        `;
    }
    
    static generateFilters(avatarId) {
        return `
            <filter id="softShadow${avatarId}">
                <feDropShadow dx="2" dy="3" stdDeviation="4" flood-opacity="0.2"/>
            </filter>
            <filter id="innerShadow${avatarId}">
                <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.15"/>
            </filter>
        `;
    }
    
    static generateBody(config, avatarId) {
        return `
            <!-- Spalle/Corpo -->
            <ellipse cx="100" cy="190" rx="50" ry="25" fill="url(#bodyGrad${avatarId})" filter="url(#softShadow${avatarId})"/>
            
            <!-- Colletto/Dettagli vestito -->
            <path d="M75 175 L100 165 L125 175 L125 185 L100 175 L75 185 Z" 
                  fill="${this.lightenColor(config.clothingColor.color, 20)}" opacity="0.8"/>
        `;
    }
    
    static generateNeck(config, avatarId) {
        return `
            <ellipse cx="100" cy="170" rx="18" ry="22" fill="url(#faceGrad${avatarId})"/>
        `;
    }
    
    static generateFace(config, avatarId) {
        // Forma viso basata sul genere
        const faceWidth = config.gender === 'male' ? 42 : 38;
        const faceHeight = config.gender === 'male' ? 52 : 48;
        
        return `
            <!-- Viso principale -->
            <ellipse cx="100" cy="120" rx="${faceWidth}" ry="${faceHeight}" 
                     fill="url(#faceGrad${avatarId})" filter="url(#softShadow${avatarId})"/>
            
            <!-- Ombre naturali guance -->
            <ellipse cx="78" cy="130" rx="8" ry="6" fill="${config.skinTone.shadow}" opacity="0.15"/>
            <ellipse cx="122" cy="130" rx="8" ry="6" fill="${config.skinTone.shadow}" opacity="0.15"/>
            
            <!-- Evidenziature -->
            <ellipse cx="90" cy="105" rx="12" ry="8" fill="${config.skinTone.highlight}" opacity="0.3"/>
            <ellipse cx="110" cy="105" rx="12" ry="8" fill="${config.skinTone.highlight}" opacity="0.3"/>
        `;
    }
    
    static generateEars(config, avatarId) {
        return `
            <!-- Orecchio sinistro -->
            <ellipse cx="60" cy="120" rx="8" ry="16" fill="${config.skinTone.base}" filter="url(#innerShadow${avatarId})"/>
            <ellipse cx="62" cy="120" rx="4" ry="10" fill="${config.skinTone.shadow}" opacity="0.6"/>
            
            <!-- Orecchio destro -->
            <ellipse cx="140" cy="120" rx="8" ry="16" fill="${config.skinTone.base}" filter="url(#innerShadow${avatarId})"/>
            <ellipse cx="138" cy="120" rx="4" ry="10" fill="${config.skinTone.shadow}" opacity="0.6"/>
        `;
    }
    
    static generateHairBack(config, avatarId) {
        if (config.hairStyle === 'bald') return '';
        
        const hairStyles = {
            // STILI MASCHILI
            short_classic: `
                <path d="M58 85 Q100 60 142 85 L138 110 Q100 75 62 110 Z" 
                      fill="url(#hairGrad${avatarId})" filter="url(#softShadow${avatarId})"/>
            `,
            buzz: `
                <path d="M65 88 Q100 70 135 88 L130 105 Q100 80 70 105 Z" 
                      fill="url(#hairGrad${avatarId})" filter="url(#softShadow${avatarId})"/>
            `,
            modern_short: `
                <path d="M55 82 Q100 55 145 82 L140 108 Q100 72 60 108 Z" 
                      fill="url(#hairGrad${avatarId})" filter="url(#softShadow${avatarId})"/>
            `,
            wavy: `
                <path d="M50 85 Q75 70 100 85 Q125 70 150 85 L145 112 Q100 78 55 112 Z" 
                      fill="url(#hairGrad${avatarId})" filter="url(#softShadow${avatarId})"/>
            `,
            curly: `
                <circle cx="80" cy="78" r="15" fill="url(#hairGrad${avatarId})" filter="url(#softShadow${avatarId})"/>
                <circle cx="100" cy="70" r="18" fill="url(#hairGrad${avatarId})" filter="url(#softShadow${avatarId})"/>
                <circle cx="120" cy="78" r="15" fill="url(#hairGrad${avatarId})" filter="url(#softShadow${avatarId})"/>
                <circle cx="85" cy="100" r="12" fill="url(#hairGrad${avatarId})" filter="url(#softShadow${avatarId})"/>
                <circle cx="115" cy="100" r="12" fill="url(#hairGrad${avatarId})" filter="url(#softShadow${avatarId})"/>
            `,
            long: `
                <path d="M45 82 Q100 50 155 82 L160 130 Q100 90 40 130 Z" 
                      fill="url(#hairGrad${avatarId})" filter="url(#softShadow${avatarId})"/>
            `,
            fade: `
                <path d="M62 90 Q100 68 138 90 L133 108 Q100 83 67 108 Z" 
                      fill="url(#hairGrad${avatarId})" filter="url(#softShadow${avatarId})"/>
                <path d="M70 108 Q100 93 130 108" stroke="${config.skinTone.base}" stroke-width="3" fill="none" opacity="0.4"/>
            `,
            
            // STILI FEMMINILI
            long_straight: `
                <path d="M40 80 Q100 45 160 80 L165 140 Q100 95 35 140 Z" 
                      fill="url(#hairGrad${avatarId})" filter="url(#softShadow${avatarId})"/>
                <ellipse cx="45" cy="120" rx="12" ry="30" fill="url(#hairGrad${avatarId})"/>
                <ellipse cx="155" cy="120" rx="12" ry="30" fill="url(#hairGrad${avatarId})"/>
            `,
            bob: `
                <path d="M50 78 Q100 50 150 78 L155 115 Q100 85 45 115 Z" 
                      fill="url(#hairGrad${avatarId})" filter="url(#softShadow${avatarId})"/>
            `,
            pixie: `
                <path d="M65 82 Q100 65 135 82 L130 105 Q100 80 70 105 Z" 
                      fill="url(#hairGrad${avatarId})" filter="url(#softShadow${avatarId})"/>
            `,
            wavy_medium: `
                <path d="M45 78 Q70 65 95 78 Q125 65 155 78 L160 125 Q100 90 40 125 Z" 
                      fill="url(#hairGrad${avatarId})" filter="url(#softShadow${avatarId})"/>
            `,
            ponytail: `
                <path d="M55 82 Q100 58 145 82 L140 108 Q100 75 60 108 Z" 
                      fill="url(#hairGrad${avatarId})" filter="url(#softShadow${avatarId})"/>
                <ellipse cx="150" cy="115" rx="10" ry="28" fill="url(#hairGrad${avatarId})" filter="url(#softShadow${avatarId})"/>
            `,
            bun: `
                <path d="M58 85 Q100 62 142 85 L138 105 Q100 78 62 105 Z" 
                      fill="url(#hairGrad${avatarId})" filter="url(#softShadow${avatarId})"/>
                <circle cx="100" cy="68" r="20" fill="url(#hairGrad${avatarId})" filter="url(#softShadow${avatarId})"/>
            `,
            shoulder_length: `
                <path d="M48 80 Q100 50 152 80 L157 128 Q100 88 43 128 Z" 
                      fill="url(#hairGrad${avatarId})" filter="url(#softShadow${avatarId})"/>
            `
        };
        
        return hairStyles[config.hairStyle] || hairStyles.short_classic;
    }
    
    static generateHairFront(config, avatarId) {
        if (config.hairStyle === 'bald') return '';
        
        // Dettagli frontali per alcuni stili
        const frontDetails = {
            modern_short: `<path d="M75 90 Q100 85 125 90" stroke="url(#hairGrad${avatarId})" stroke-width="2" fill="none"/>`,
            long_straight: `<path d="M55 110 L55 125 M145 110 L145 125" stroke="url(#hairGrad${avatarId})" stroke-width="6"/>`,
            shoulder_length: `<path d="M48 125 L48 135 M152 125 L152 135" stroke="url(#hairGrad${avatarId})" stroke-width="5"/>`
        };
        
        return frontDetails[config.hairStyle] || '';
    }
    
    static generateEyebrows(config, avatarId) {
        const browColor = this.darkenColor(config.hairColor.color, 30);
        const thickness = config.gender === 'male' ? 4 : 3;
        
        return `
            <!-- Sopracciglio sinistro -->
            <path d="M75 100 Q85 97 95 100" stroke="${browColor}" stroke-width="${thickness}" 
                  fill="none" stroke-linecap="round" filter="url(#innerShadow${avatarId})"/>
            
            <!-- Sopracciglio destro -->
            <path d="M105 100 Q115 97 125 100" stroke="${browColor}" stroke-width="${thickness}" 
                  fill="none" stroke-linecap="round" filter="url(#innerShadow${avatarId})"/>
        `;
    }
    
    static generateEyes(config, avatarId) {
        return `
            <!-- Occhio sinistro -->
            <ellipse cx="85" cy="112" rx="10" ry="7" fill="white" filter="url(#innerShadow${avatarId})"/>
            <circle cx="85" cy="112" r="5" fill="#4169E1"/>
            <circle cx="85" cy="112" r="3" fill="#1a1a1a"/>
            <circle cx="86.5" cy="110.5" r="1.5" fill="white"/>
            
            <!-- Occhio destro -->
            <ellipse cx="115" cy="112" rx="10" ry="7" fill="white" filter="url(#innerShadow${avatarId})"/>
            <circle cx="115" cy="112" r="5" fill="#4169E1"/>
            <circle cx="115" cy="112" r="3" fill="#1a1a1a"/>
            <circle cx="116.5" cy="110.5" r="1.5" fill="white"/>
            
            <!-- Ciglia -->
            <path d="M75 108 Q85 106 95 108" stroke="#000" stroke-width="1.5" fill="none" opacity="0.6"/>
            <path d="M105 108 Q115 106 125 108" stroke="#000" stroke-width="1.5" fill="none" opacity="0.6"/>
        `;
    }
    
    static generateNose(config, avatarId) {
        return `
            <!-- Ponte del naso -->
            <ellipse cx="100" cy="122" rx="2.5" ry="8" fill="${config.skinTone.shadow}" opacity="0.4"/>
            
            <!-- Punta del naso -->
            <ellipse cx="100" cy="127" rx="4" ry="3" fill="${config.skinTone.base}" filter="url(#innerShadow${avatarId})"/>
            
            <!-- Narici -->
            <ellipse cx="97.5" cy="129" rx="1.5" ry="2" fill="${config.skinTone.shadow}" opacity="0.8"/>
            <ellipse cx="102.5" cy="129" rx="1.5" ry="2" fill="${config.skinTone.shadow}" opacity="0.8"/>
            
            <!-- Evidenziatura -->
            <ellipse cx="100" cy="124" rx="1.5" ry="4" fill="${config.skinTone.highlight}" opacity="0.5"/>
        `;
    }
    
    static generateMouth(config, avatarId) {
        return `
            <!-- Labbra -->
            <ellipse cx="100" cy="142" rx="12" ry="5" fill="#E74C3C" filter="url(#innerShadow${avatarId})"/>
            <ellipse cx="100" cy="141" rx="10" ry="3" fill="#FF69B4" opacity="0.8"/>
            
            <!-- Evidenziatura labbra -->
            <ellipse cx="100" cy="140" rx="6" ry="1.5" fill="white" opacity="0.4"/>
            
            <!-- Sorriso -->
            <path d="M88 145 Q100 150 112 145" stroke="#CD5C5C" stroke-width="1" fill="none" opacity="0.6"/>
        `;
    }
    
    static generateFacialHair(config, avatarId) {
        if (config.facialHair === 'none') return '';
        
        const hairColor = config.hairColor.color;
        
        const facialHairStyles = {
            beard_short: `
                <ellipse cx="100" cy="150" rx="20" ry="12" fill="${hairColor}" opacity="0.8" filter="url(#innerShadow${avatarId})"/>
            `,
            beard_medium: `
                <path d="M80 145 Q100 165 120 145 Q120 158 100 168 Q80 158 80 145" 
                      fill="${hairColor}" filter="url(#softShadow${avatarId})"/>
            `,
            beard_long: `
                <path d="M75 140 Q100 175 125 140 Q125 165 100 180 Q75 165 75 140" 
                      fill="${hairColor}" filter="url(#softShadow${avatarId})"/>
            `,
            mustache: `
                <ellipse cx="100" cy="135" rx="14" ry="4" fill="${hairColor}" filter="url(#innerShadow${avatarId})"/>
            `,
            goatee: `
                <ellipse cx="100" cy="155" rx="10" ry="15" fill="${hairColor}" filter="url(#innerShadow${avatarId})"/>
            `,
            stubble: `
                <ellipse cx="100" cy="148" rx="22" ry="18" fill="${hairColor}" opacity="0.3"/>
                <circle cx="92" cy="145" r="0.5" fill="${hairColor}" opacity="0.7"/>
                <circle cx="108" cy="145" r="0.5" fill="${hairColor}" opacity="0.7"/>
                <circle cx="88" cy="155" r="0.5" fill="${hairColor}" opacity="0.7"/>
                <circle cx="112" cy="155" r="0.5" fill="${hairColor}" opacity="0.7"/>
                <circle cx="100" cy="160" r="0.5" fill="${hairColor}" opacity="0.7"/>
            `
        };
        
        return facialHairStyles[config.facialHair] || '';
    }
    
    static generateAccessories(config, avatarId) {
        if (config.accessories === 'none') return '';
        
        const accessoryStyles = {
            glasses_classic: `
                <ellipse cx="85" cy="112" rx="16" ry="12" fill="none" stroke="#2C3E50" stroke-width="3"/>
                <ellipse cx="115" cy="112" rx="16" ry="12" fill="none" stroke="#2C3E50" stroke-width="3"/>
                <line x1="101" y1="112" x2="99" y2="112" stroke="#2C3E50" stroke-width="3"/>
                <ellipse cx="82" cy="107" rx="4" ry="8" fill="white" opacity="0.6"/>
                <ellipse cx="112" cy="107" rx="4" ry="8" fill="white" opacity="0.6"/>
            `,
            glasses_modern: `
                <rect x="69" y="106" width="32" height="12" rx="6" fill="none" stroke="#2C3E50" stroke-width="3"/>
                <rect x="99" y="106" width="32" height="12" rx="6" fill="none" stroke="#2C3E50" stroke-width="3"/>
                <line x1="101" y1="112" x2="99" y2="112" stroke="#2C3E50" stroke-width="3"/>
                <ellipse cx="82" cy="107" rx="3" ry="6" fill="white" opacity="0.6"/>
                <ellipse cx="112" cy="107" rx="3" ry="6" fill="white" opacity="0.6"/>
            `,
            glasses_round: `
                <circle cx="85" cy="112" r="16" fill="none" stroke="#2C3E50" stroke-width="3"/>
                <circle cx="115" cy="112" r="16" fill="none" stroke="#2C3E50" stroke-width="3"/>
                <line x1="101" y1="112" x2="99" y2="112" stroke="#2C3E50" stroke-width="3"/>
                <circle cx="82" cy="107" r="4" fill="white" opacity="0.6"/>
                <circle cx="112" cy="107" r="4" fill="white" opacity="0.6"/>
            `,
            sunglasses: `
                <ellipse cx="85" cy="112" rx="16" ry="12" fill="#1a1a1a" stroke="#2C3E50" stroke-width="2"/>
                <ellipse cx="115" cy="112" rx="16" ry="12" fill="#1a1a1a" stroke="#2C3E50" stroke-width="2"/>
                <line x1="101" y1="112" x2="99" y2="112" stroke="#2C3E50" stroke-width="3"/>
                <ellipse cx="82" cy="107" rx="2" ry="4" fill="white" opacity="0.3"/>
                <ellipse cx="112" cy="107" rx="2" ry="4" fill="white" opacity="0.3"/>
            `
        };
        
        return accessoryStyles[config.accessories] || '';
    }
    
    static generateFinalShading(config, avatarId) {
        return `
            <!-- Ombra generale viso -->
            <ellipse cx="108" cy="135" rx="35" ry="40" fill="${config.skinTone.shadow}" 
                     opacity="0.1" transform="rotate(15 108 135)"/>
            
            <!-- Evidenziatura generale -->
            <ellipse cx="92" cy="105" rx="25" ry="30" fill="${config.skinTone.highlight}" 
                     opacity="0.2" transform="rotate(-10 92 105)"/>
        `;
    }
    
    static getRandomBackgroundColor() {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#AED6F1', '#D7BDE2', '#F9E79F'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Utility functions
    static lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
    }
    
    static darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
    }
}

// === MANAGER AVATAR MODULARE ===
class ModularAvatarManager {
    constructor(userId) {
        this.userId = userId;
        this.config = this.getDefaultConfig();
        this.mode = 'avatar';
        this.photoUrl = null;
        this.loadFromStorage();
    }
    
    getDefaultConfig() {
        return {
            gender: 'male',
            skinTone: ModularAvatarConfig.skinTones[2],
            hairColor: ModularAvatarConfig.hairColors[2],
            hairStyle: 'short_classic',
            accessories: 'none',
            facialHair: 'none',
            clothingColor: ModularAvatarConfig.clothingColors[0]
        };
    }
    
    updateConfig(property, value) {
        this.config[property] = value;
        
        // Auto-update when gender changes
        if (property === 'gender') {
            if (value === 'female') {
                this.config.facialHair = 'none';
                this.config.hairStyle = 'long_straight';
            } else {
                this.config.hairStyle = 'short_classic';
            }
        }
        
        this.saveToStorage();
        return this.config;
    }
    
    setMode(mode) {
        if (['avatar', 'photo'].includes(mode)) {
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
    
    generateAvatar() {
        return ModularAvatarGenerator.generate(this.config);
    }
    
    getDisplayHTML() {
        if (this.mode === 'photo' && this.photoUrl) {
            return `<img src="${this.photoUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" alt="Avatar Photo">`;
        } else {
            return this.generateAvatar();
        }
    }
    
    randomize() {
        const gender = Math.random() > 0.5 ? 'male' : 'female';
        
        this.config = {
            gender: gender,
            skinTone: ModularAvatarConfig.skinTones[Math.floor(Math.random() * ModularAvatarConfig.skinTones.length)],
            hairColor: ModularAvatarConfig.hairColors[Math.floor(Math.random() * ModularAvatarConfig.hairColors.length)],
            hairStyle: gender === 'male' ? 
                ModularAvatarConfig.maleHairStyles[Math.floor(Math.random() * ModularAvatarConfig.maleHairStyles.length)].value :
                ModularAvatarConfig.femaleHairStyles[Math.floor(Math.random() * ModularAvatarConfig.femaleHairStyles.length)].value,
            accessories: ModularAvatarConfig.accessories[Math.floor(Math.random() * ModularAvatarConfig.accessories.length)].value,
            facialHair: gender === 'male' ? 
                ModularAvatarConfig.facialHair[Math.floor(Math.random() * ModularAvatarConfig.facialHair.length)].value : 'none',
            clothingColor: ModularAvatarConfig.clothingColors[Math.floor(Math.random() * ModularAvatarConfig.clothingColors.length)]
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
            console.log('💾 Avatar modulare salvato');
        } catch (e) {
            console.error('Errore salvataggio avatar:', e);
        }
    }
    
    loadFromStorage() {
        try {
            if (window.avatarStorage && window.avatarStorage[this.userId]) {
                const data = window.avatarStorage[this.userId];
                this.config = { ...this.getDefaultConfig(), ...data.config };
                this.mode = data.mode || 'avatar';
                this.photoUrl = data.photoUrl || null;
                console.log('📂 Avatar modulare caricato');
            }
        } catch (e) {
            console.error('Errore caricamento avatar:', e);
        }
    }
}

// === UI AVATAR MODULARE ===
class ModularAvatarUI {
    constructor(containerId, manager) {
        this.container = document.getElementById(containerId);
        this.manager = manager;
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="modular-avatar-ui">
                <div class="mode-selector">
                    <button class="mode-btn ${this.manager.mode === 'avatar' ? 'active' : ''}" data-mode="avatar">
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
                    ${this.manager.mode === 'avatar' ? this.buildAvatarControls() : this.buildPhotoControls()}
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
    
    buildAvatarControls() {
        const config = this.manager.config;
        const hairStyles = config.gender === 'male' ? ModularAvatarConfig.maleHairStyles : ModularAvatarConfig.femaleHairStyles;
        
        return `
            <div class="control-section">
                <!-- Genere -->
                <div class="control-group">
                    <label>👤 Genere</label>
                    <div class="button-group">
                        <button class="option-btn ${config.gender === 'male' ? 'active' : ''}" 
                                data-property="gender" data-value="male">🙂 Uomo</button>
                        <button class="option-btn ${config.gender === 'female' ? 'active' : ''}" 
                                data-property="gender" data-value="female">😊 Donna</button>
                    </div>
                </div>
                
                <!-- Tonalità Pelle -->
                <div class="control-group">
                    <label>🎨 Tonalità Pelle</label>
                    <div class="color-grid">
                        ${ModularAvatarConfig.skinTones.map((tone, index) => 
                            `<div class="color-swatch ${JSON.stringify(config.skinTone) === JSON.stringify(tone) ? 'active' : ''}" 
                                  data-property="skinTone" data-index="${index}"
                                  style="background: linear-gradient(135deg, ${tone.highlight}, ${tone.base});" 
                                  title="${tone.name}"></div>`
                        ).join('')}
                    </div>
                </div>
                
                <!-- Colore Capelli -->
                <div class="control-group">
                    <label>💇 Colore Capelli</label>
                    <div class="color-grid">
                        ${ModularAvatarConfig.hairColors.map((hair, index) => 
                            `<div class="color-swatch ${JSON.stringify(config.hairColor) === JSON.stringify(hair) ? 'active' : ''}" 
                                  data-property="hairColor" data-index="${index}"
                                  style="background: linear-gradient(135deg, ${hair.highlight}, ${hair.color});" 
                                  title="${hair.name}"></div>`
                        ).join('')}
                    </div>
                </div>
                
                <!-- Stile Capelli -->
                <div class="control-group">
                    <label>✂️ Stile Capelli</label>
                    <div class="button-group hair-styles">
                        ${hairStyles.map(style => 
                            `<button class="option-btn ${config.hairStyle === style.value ? 'active' : ''}" 
                                    data-property="hairStyle" data-value="${style.value}">
                                ${style.name}
                            </button>`
                        ).join('')}
                    </div>
                </div>
                
                <!-- Accessori -->
                <div class="control-group">
                    <label>👓 Accessori</label>
                    <div class="button-group">
                        ${ModularAvatarConfig.accessories.map(acc => 
                            `<button class="option-btn ${config.accessories === acc.value ? 'active' : ''}" 
                                    data-property="accessories" data-value="${acc.value}">
                                ${acc.name}
                            </button>`
                        ).join('')}
                    </div>
                </div>
                
                ${config.gender === 'male' ? `
                <!-- Barba/Baffi -->
                <div class="control-group">
                    <label>🧔 Barba e Baffi</label>
                    <div class="button-group">
                        ${ModularAvatarConfig.facialHair.map(fh => 
                            `<button class="option-btn ${config.facialHair === fh.value ? 'active' : ''}" 
                                    data-property="facialHair" data-value="${fh.value}">
                                ${fh.name}
                            </button>`
                        ).join('')}
                    </div>
                </div>
                ` : ''}
                
                <!-- Colore Vestiti -->
                <div class="control-group">
                    <label>👕 Colore Vestiti</label>
                    <div class="color-grid">
                        ${ModularAvatarConfig.clothingColors.map((cloth, index) => 
                            `<div class="color-swatch ${JSON.stringify(config.clothingColor) === JSON.stringify(cloth) ? 'active' : ''}" 
                                  data-property="clothingColor" data-index="${index}"
                                  style="background: ${cloth.color};" 
                                  title="${cloth.name}"></div>`
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
                value = ModularAvatarConfig.skinTones[index];
                break;
            case 'hairColor':
                value = ModularAvatarConfig.hairColors[index];
                break;
            case 'clothingColor':
                value = ModularAvatarConfig.clothingColors[index];
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
        controlsContainer.innerHTML = this.manager.mode === 'avatar' ? 
            this.buildAvatarControls() : this.buildPhotoControls();
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
        if (document.getElementById('modular-avatar-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'modular-avatar-styles';
        styles.textContent = `
            .modular-avatar-ui {
                max-width: 800px;
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
                width: 200px;
                height: 200px;
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
            }
            
            .preview-container:hover {
                transform: scale(1.08) rotate(2deg);
            }
            
            .control-section {
                background: rgba(255,255,255,0.12);
                border-radius: 20px;
                padding: 25px;
                margin-bottom: 25px;
                backdrop-filter: blur(15px);
                max-height: 450px;
                overflow-y: auto;
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
                text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            }
            
            .button-group {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
                gap: 10px;
            }
            
            .button-group.hair-styles {
                grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
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
                text-align: center;
            }
            
            .option-btn:hover {
                background: rgba(255,255,255,0.2);
                transform: translateY(-1px);
                box-shadow: 0 4px 15px rgba(255,255,255,0.1);
            }
            
            .option-btn.active {
                border-color: #F39C12;
                background: rgba(243, 156, 18, 0.3);
                box-shadow: 0 6px 20px rgba(243, 156, 18, 0.5);
                transform: translateY(-2px);
            }
            
            .color-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
                gap: 12px;
                max-width: 500px;
            }
            
            .color-swatch {
                width: 40px;
                height: 40px;
                border-radius: 12px;
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
                font-size: 16px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
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
                font-size: 50px;
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
                padding: 20px;
                border: 3px solid rgba(255,255,255,0.4);
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
                box-shadow: 0 12px 40px rgba(255,255,255,0.2);
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
            
            /* Scrollbar personalizzata */
            .control-section::-webkit-scrollbar {
                width: 8px;
            }
            
            .control-section::-webkit-scrollbar-track {
                background: rgba(255,255,255,0.1);
                border-radius: 10px;
            }
            
            .control-section::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.3);
                border-radius: 10px;
            }
            
            .control-section::-webkit-scrollbar-thumb:hover {
                background: rgba(255,255,255,0.5);
            }
            
            @media (max-width: 700px) {
                .modular-avatar-ui {
                    padding: 25px;
                    margin: 15px;
                }
                
                .preview-container {
                    width: 160px;
                    height: 160px;
                }
                
                .button-group, .button-group.hair-styles {
                    grid-template-columns: 1fr;
                }
                
                .color-grid {
                    grid-template-columns: repeat(5, 1fr);
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
        console.log('🎨 Sistema Avatar Modulare inizializzato per:', userId);
        const manager = new ModularAvatarManager(userId);
        return manager;
    }
    
    static createUI(containerId, manager) {
        console.log('🎭 Creazione UI Avatar Modulare per container:', containerId);
        const ui = new ModularAvatarUI(containerId, manager);
        // Store reference globally for button actions
        window.avatarUI = ui;
        return ui;
    }
}

// === ESPOSIZIONE GLOBALE ===
window.RealisticAvatarSystem = RealisticAvatarSystem;
window.ModularAvatarManager = ModularAvatarManager;
window.ModularAvatarUI = ModularAvatarUI;

console.log('✅ Sistema Avatar Modulare caricato - PERSONALIZZAZIONE COMPLETA!');