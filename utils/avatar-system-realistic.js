// avatar-system-realistic.js - Sistema Avatar Doppia Modalità (Cartoon + Realistico)
// Mantiene la semplicità del vecchio sistema con tantissime opzioni di personalizzazione

// === 🎨 CONFIGURAZIONE AVATAR SYSTEM ===
const AVATAR_CONFIG = {
    version: '2.0',
    defaultMode: 'cartoon', // 'cartoon' o 'realistic'
    defaultAvatarId: 'avatar_1',
    maxCustomAvatars: 50,
    avatarImageSize: 120,
    animationDuration: 300,
    autoSaveDelay: 1000
};

// === 🎭 OPZIONI PERSONALIZZAZIONE AVANZATE ===

// Forme viso - 6 tipi
const FACE_SHAPES = {
    cartoon: {
        oval: { rx: 50, ry: 55, path: null },
        round: { rx: 55, ry: 55, path: null },
        square: { rx: 45, ry: 50, path: null },
        triangular: { rx: 48, ry: 52, path: null },
        diamond: { rx: 46, ry: 58, path: null },
        long: { rx: 42, ry: 62, path: null }
    },
    realistic: {
        oval: { path: "M70 90 Q70 70 85 60 Q100 55 115 60 Q130 70 130 90 L130 130 Q130 150 115 155 Q100 160 85 155 Q70 150 70 130 Z" },
        round: { path: "M75 85 Q75 65 90 60 Q100 55 110 60 Q125 65 125 85 L125 125 Q125 145 110 150 Q100 155 90 150 Q75 145 75 125 Z" },
        square: { path: "M72 88 L72 68 Q72 58 82 58 L118 58 Q128 58 128 68 L128 88 L128 128 Q128 148 118 148 L82 148 Q72 148 72 138 Z" },
        triangular: { path: "M80 85 Q80 65 95 60 Q100 55 105 60 Q120 65 120 85 L125 130 Q120 150 105 155 Q100 160 95 155 Q80 150 75 130 Z" },
        diamond: { path: "M85 80 Q85 60 100 55 Q115 60 115 80 L120 100 L115 135 Q115 155 100 160 Q85 155 85 135 L80 100 Z" },
        long: { path: "M78 85 Q78 60 93 55 Q100 50 107 55 Q122 60 122 85 L122 140 Q122 165 107 170 Q100 175 93 170 Q78 165 78 140 Z" }
    }
};

// Stili capelli - 8 stili con varianti realistiche
const HAIR_STYLES = {
    cartoon: {
        short: "M50 80 Q100 50 150 80 Q150 90 140 100 Q100 70 60 100 Q50 90 50 80",
        medium: "M45 75 Q100 45 155 75 Q155 95 145 110 Q100 65 55 110 Q45 95 45 75",
        long: "M40 70 Q100 35 160 70 Q160 100 150 120 Q100 60 50 120 Q40 100 40 70",
        curly: "M50 85 Q70 50 100 70 Q130 50 150 85 Q140 95 130 100 Q110 85 100 90 Q90 85 70 100 Q60 95 50 85",
        buzz: "M60 85 Q100 70 140 85 Q135 90 125 95 Q100 80 75 95 Q65 90 60 85",
        mohawk: "M85 75 Q100 45 115 75 Q115 85 110 95 Q100 80 90 95 Q85 85 85 75",
        wavy: "M48 78 Q75 48 100 65 Q125 48 152 78 Q148 88 140 98 Q115 75 100 85 Q85 75 60 98 Q52 88 48 78",
        bald: "M70 88 Q100 78 130 88"
    },
    realistic: {
        short: "M72 82 Q100 58 128 82 Q128 88 125 95 Q115 85 100 88 Q85 85 75 95 Q72 88 72 82",
        medium: "M68 78 Q100 52 132 78 Q132 92 128 105 Q118 88 100 92 Q82 88 72 105 Q68 92 68 78",
        long: "M65 75 Q100 45 135 75 Q135 98 130 118 Q120 95 100 100 Q80 95 70 118 Q65 98 65 75",
        curly: "M70 82 Q85 58 100 75 Q115 58 130 82 Q128 90 125 98 Q115 88 100 92 Q85 88 75 98 Q72 90 70 82",
        buzz: "M75 88 Q100 78 125 88 Q123 92 120 96 Q110 90 100 92 Q90 90 80 96 Q77 92 75 88",
        mohawk: "M90 78 Q100 52 110 78 Q110 85 108 92 Q100 85 95 90 Q92 85 90 78",
        wavy: "M70 80 Q85 60 100 72 Q115 60 130 80 Q128 86 125 94 Q115 84 100 88 Q85 84 75 94 Q72 86 70 80",
        bald: "M75 90 Q100 82 125 90"
    }
};

// Colori capelli - 12 colori
const HAIR_COLORS = [
    '#2F1B14', // Nero
    '#4A3C1D', // Castano scuro
    '#8B4513', // Castano
    '#CD853F', // Castano chiaro
    '#DEB887', // Biondo scuro
    '#F0E68C', // Biondo
    '#FFD700', // Biondo platino
    '#B22222', // Rosso
    '#DC143C', // Rosso intenso
    '#708090', // Grigio
    '#A9A9A9', // Grigio chiaro
    '#FFFFFF'  // Bianco
];

// Forme occhi - 5 forme
const EYE_SHAPES = {
    cartoon: {
        normal: { leftEye: "M77 98 Q85 94 93 98 Q85 102 77 98", rightEye: "M107 98 Q115 94 123 98 Q115 102 107 98" },
        large: { leftEye: "M75 98 Q85 92 95 98 Q85 104 75 98", rightEye: "M105 98 Q115 92 125 98 Q115 104 105 98" },
        small: { leftEye: "M79 98 Q85 96 91 98 Q85 100 79 98", rightEye: "M109 98 Q115 96 121 98 Q115 100 109 98" },
        almond: { leftEye: "M77 98 Q85 95 93 98 Q85 101 77 98", rightEye: "M107 98 Q115 95 123 98 Q115 101 107 98" },
        round: { leftEye: "M78 98 Q85 93 92 98 Q85 103 78 98", rightEye: "M108 98 Q115 93 122 98 Q115 103 108 98" }
    },
    realistic: {
        normal: { leftEye: "M78 100 Q85 96 92 100 Q85 104 78 100", rightEye: "M108 100 Q115 96 122 100 Q115 104 108 100" },
        large: { leftEye: "M76 100 Q85 94 94 100 Q85 106 76 100", rightEye: "M106 100 Q115 94 124 100 Q115 106 106 100" },
        small: { leftEye: "M80 100 Q85 98 90 100 Q85 102 80 100", rightEye: "M110 100 Q115 98 120 100 Q115 102 110 100" },
        almond: { leftEye: "M77 100 Q85 97 93 100 Q85 103 77 100", rightEye: "M107 100 Q115 97 123 100 Q115 103 107 100" },
        round: { leftEye: "M79 100 Q85 95 91 100 Q85 105 79 100", rightEye: "M109 100 Q115 95 121 100 Q115 105 109 100" }
    }
};

// Colori occhi - 8 colori
const EYE_COLORS = [
    '#8B4513', // Marrone
    '#4169E1', // Blu
    '#228B22', // Verde
    '#708090', // Grigio
    '#2F4F4F', // Verde scuro
    '#800080', // Viola
    '#000080', // Blu scuro
    '#006400'  // Verde intenso
];

// Forme naso - 4 tipi
const NOSE_SHAPES = {
    cartoon: {
        small: { path: "M98 112 Q100 114 102 112", size: "small" },
        medium: { path: "M97 112 Q100 115 103 112", size: "medium" },
        large: { path: "M96 112 Q100 116 104 112", size: "large" },
        pointed: { path: "M98 111 Q100 114 102 111", size: "pointed" }
    },
    realistic: {
        small: { path: "M98 115 Q100 117 102 115 Q100 119 98 115", size: "small" },
        medium: { path: "M97 115 Q100 118 103 115 Q100 120 97 115", size: "medium" },
        large: { path: "M96 115 Q100 119 104 115 Q100 122 96 115", size: "large" },
        pointed: { path: "M98 114 Q100 117 102 114 Q100 118 98 114", size: "pointed" }
    }
};

// Forme bocca - 6 forme + espressioni
const MOUTH_SHAPES = {
    cartoon: {
        happy: "M90 130 Q100 140 110 130",
        neutral: "M92 135 Q100 135 108 135", 
        smile: "M88 132 Q100 142 112 132",
        laugh: "M87 130 Q100 145 113 130",
        serious: "M90 138 Q100 138 110 138",
        pout: "M92 132 Q100 138 108 132"
    },
    realistic: {
        happy: "M92 135 Q100 142 108 135",
        neutral: "M94 138 Q100 138 106 138",
        smile: "M90 136 Q100 144 110 136", 
        laugh: "M88 134 Q100 147 112 134",
        serious: "M92 140 Q100 140 108 140",
        pout: "M94 136 Q100 140 106 136"
    }
};

// Tonalità pelle - 8 tonalità
const SKIN_TONES = [
    '#FDBCBC', // Rosa chiaro
    '#F1C27D', // Beige
    '#E0AC69', // Dorato
    '#C68642', // Bronzo
    '#8D5524', // Marrone chiaro
    '#654321', // Marrone
    '#3C1810', // Marrone scuro
    '#FFE4C4'  // Pesca
];

// Accessori - Tantissime opzioni
const ACCESSORIES = {
    glasses: {
        none: null,
        regular: { path: "M78 100 Q85 96 92 100 M108 100 Q115 96 122 100 M92 100 L108 100", color: "#333" },
        sunglasses: { path: "M78 100 Q85 96 92 100 M108 100 Q115 96 122 100 M92 100 L108 100", color: "#000", tint: "rgba(0,0,0,0.6)" },
        reading: { path: "M78 100 Q85 96 92 100 M108 100 Q115 96 122 100 M92 100 L108 100", color: "#666" },
        fashionable: { path: "M76 100 Q85 94 94 100 M106 100 Q115 94 124 100 M94 100 L106 100", color: "#8B4513" }
    },
    facial_hair: {
        none: null,
        mustache: { path: "M88 125 Q100 128 112 125", color: null },
        goatee: { path: "M92 140 Q100 148 108 140 Q108 145 100 150 Q92 145 92 140", color: null },
        full_beard: { path: "M75 135 Q100 150 125 135 Q125 145 100 155 Q75 145 75 135", color: null },
        stubble: { path: "M80 135 Q100 145 120 135", color: null, opacity: 0.3 }
    },
    earrings: {
        none: null,
        simple: { left: "M72 105 Q70 107 72 109", right: "M128 105 Q130 107 128 109", color: "#FFD700" },
        hoops: { left: "M70 105 Q68 110 70 115", right: "M130 105 Q132 110 130 115", color: "#C0C0C0" }
    },
    hats: {
        none: null,
        cap: { path: "M65 75 Q100 40 135 75 L140 80 Q100 65 60 80 Z", color: "#FF0000" },
        beanie: { path: "M70 75 Q100 45 130 75 Q130 70 125 65 Q100 50 75 65 Q70 70 70 75", color: "#333" },
        fedora: { path: "M60 80 Q100 35 140 80 L145 85 Q100 70 55 85 Z M75 82 L125 82", color: "#8B4513" }
    }
};

// Abbigliamento - Maglie e colori
const CLOTHING = {
    shirts: {
        none: null,
        tshirt: { path: "M75 160 L75 180 Q75 190 85 190 L115 190 Q125 190 125 180 L125 160", neckline: "basic" },
        polo: { path: "M75 160 L75 180 Q75 190 85 190 L115 190 Q125 190 125 180 L125 160 M95 165 L105 165", neckline: "polo" },
        hoodie: { path: "M70 160 L70 180 Q70 195 85 195 L115 195 Q130 195 130 180 L130 160 M85 155 Q100 150 115 155", neckline: "hood" }
    },
    colors: [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ]
};

// === 🎨 AVATAR MANAGER CLASS AGGIORNATO ===
class AvatarManagerRealistic {
    constructor() {
        this.currentUserId = null;
        this.currentConfig = this.getDefaultConfig();
        this.currentMode = AVATAR_CONFIG.defaultMode;
        this.photoMode = false;
        this.uploadedPhoto = null;
        this.isInitialized = false;
        
        console.log('🎨 AvatarManagerRealistic inizializzato');
    }

    // Configurazione default completa
    getDefaultConfig() {
        return {
            // Base
            mode: 'cartoon', // 'cartoon' o 'realistic'
            photoMode: false,
            
            // Caratteristiche fisiche
            faceShape: 'oval',
            skinTone: '#FDBCBC',
            
            // Capelli
            hairStyle: 'short',
            hairColor: '#8B4513',
            
            // Occhi
            eyeShape: 'normal',
            eyeColor: '#8B4513',
            
            // Naso e bocca
            noseShape: 'medium',
            mouthShape: 'happy',
            
            // Accessori
            glasses: 'none',
            facialHair: 'none',
            earrings: 'none',
            hat: 'none',
            
            // Abbigliamento
            shirt: 'tshirt',
            shirtColor: '#4ECDC4',
            
            // Foto (se photoMode = true)
            photoUrl: null,
            photoFilter: 'none',
            photoFrame: 'circle'
        };
    }

    // Inizializzazione del sistema
    async initialize(userId = null) {
        try {
            this.currentUserId = userId || this.generateGuestId();
            
            // Carica configurazione esistente
            await this.loadUserConfig();
            
            this.isInitialized = true;
            console.log('✅ AvatarManagerRealistic inizializzato per utente:', this.currentUserId);
            
            return true;
        } catch (error) {
            console.error('❌ Errore inizializzazione AvatarManagerRealistic:', error);
            return false;
        }
    }

    // Genera ID guest temporaneo
    generateGuestId() {
        return 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Carica configurazione utente
    async loadUserConfig() {
        try {
            const savedConfig = localStorage.getItem(`avatar_config_${this.currentUserId}`);
            
            if (savedConfig) {
                const config = JSON.parse(savedConfig);
                this.currentConfig = { ...this.getDefaultConfig(), ...config };
                this.currentMode = this.currentConfig.mode;
                this.photoMode = this.currentConfig.photoMode;
                
                console.log('✅ Configurazione avatar caricata');
            }
            
            return this.currentConfig;
            
        } catch (error) {
            console.error('❌ Errore caricamento configurazione:', error);
            this.currentConfig = this.getDefaultConfig();
            return this.currentConfig;
        }
    }

    // Salva configurazione utente
    async saveUserConfig() {
        try {
            const configToSave = {
                ...this.currentConfig,
                lastUpdated: new Date().toISOString()
            };

            localStorage.setItem(`avatar_config_${this.currentUserId}`, JSON.stringify(configToSave));
            
            console.log('✅ Configurazione avatar salvata');
            return true;
            
        } catch (error) {
            console.error('❌ Errore salvataggio configurazione:', error);
            return false;
        }
    }

    // Aggiorna singola proprietà
    updateConfig(property, value) {
        this.currentConfig[property] = value;
        
        // Auto-save con debounce
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            this.saveUserConfig();
        }, AVATAR_CONFIG.autoSaveDelay);
        
        console.log('🔄 Configurazione aggiornata:', property, '=', value);
    }

    // Cambia modalità (cartoon/realistic)
    setMode(mode) {
        if (['cartoon', 'realistic'].includes(mode)) {
            this.currentMode = mode;
            this.currentConfig.mode = mode;
            this.saveUserConfig();
            console.log('🎭 Modalità cambiata:', mode);
        }
    }

    // Attiva/disattiva modalità foto
    togglePhotoMode(enabled, photoUrl = null) {
        this.photoMode = enabled;
        this.currentConfig.photoMode = enabled;
        
        if (enabled && photoUrl) {
            this.currentConfig.photoUrl = photoUrl;
            this.uploadedPhoto = photoUrl;
        }
        
        this.saveUserConfig();
        console.log('📸 Modalità foto:', enabled ? 'attivata' : 'disattivata');
    }

    // Genera SVG avatar
    generateAvatarSVG(size = 200) {
        if (this.photoMode && this.currentConfig.photoUrl) {
            return this.generatePhotoAvatar(size);
        }
        
        return this.generateSVGAvatar(size);
    }

    // Genera SVG tradizionale
    generateSVGAvatar(size = 200) {
        const config = this.currentConfig;
        const mode = config.mode;
        const scale = size / 200;
        
        let svg = `<svg viewBox="0 0 200 200" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`;
        
        // Background circle
        svg += `<circle cx="100" cy="100" r="95" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>`;
        
        // Abbigliamento (sotto tutto)
        if (config.shirt && config.shirt !== 'none') {
            const shirt = CLOTHING.shirts[config.shirt];
            if (shirt) {
                svg += `<path d="${shirt.path}" fill="${config.shirtColor}" stroke="#666" stroke-width="1"/>`;
            }
        }
        
        // Viso
        const faceShape = FACE_SHAPES[mode][config.faceShape];
        if (mode === 'cartoon') {
            svg += `<ellipse cx="100" cy="110" rx="${faceShape.rx}" ry="${faceShape.ry}" fill="${config.skinTone}"/>`;
        } else {
            svg += `<path d="${faceShape.path}" fill="${config.skinTone}"/>`;
        }
        
        // Capelli (dietro la testa)
        if (config.hairStyle !== 'bald') {
            const hairPath = HAIR_STYLES[mode][config.hairStyle];
            svg += `<path d="${hairPath}" fill="${config.hairColor}"/>`;
        }
        
        // Cappello (sopra i capelli)
        if (config.hat && config.hat !== 'none') {
            const hat = ACCESSORIES.hats[config.hat];
            if (hat) {
                svg += `<path d="${hat.path}" fill="${hat.color}"/>`;
            }
        }
        
        // Occhi
        const eyeShape = EYE_SHAPES[mode][config.eyeShape];
        // Occhio sinistro (bianco)
        svg += `<ellipse cx="85" cy="100" rx="8" ry="6" fill="white"/>`;
        // Pupilla sinistra
        svg += `<circle cx="85" cy="100" r="4" fill="${config.eyeColor}"/>`;
        // Riflesso sinistro
        svg += `<circle cx="83" cy="98" r="1.5" fill="white" opacity="0.8"/>`;
        
        // Occhio destro (bianco)
        svg += `<ellipse cx="115" cy="100" rx="8" ry="6" fill="white"/>`;
        // Pupilla destra
        svg += `<circle cx="115" cy="100" r="4" fill="${config.eyeColor}"/>`;
        // Riflesso destro
        svg += `<circle cx="113" cy="98" r="1.5" fill="white" opacity="0.8"/>`;
        
        // Ciglia (per occhi più espressivi)
        svg += `<path d="M77 96 Q85 94 93 96" stroke="#333" stroke-width="1" fill="none"/>`;
        svg += `<path d="M107 96 Q115 94 123 96" stroke="#333" stroke-width="1" fill="none"/>`;
        
        // Naso
        const noseShape = NOSE_SHAPES[mode][config.noseShape];
        const noseShadow = mode === 'realistic' ? '#00000020' : 'transparent';
        svg += `<path d="${noseShape.path}" stroke="${noseShadow}" stroke-width="1" fill="none"/>`;
        
        // Bocca
        const mouthPath = MOUTH_SHAPES[mode][config.mouthShape];
        svg += `<path d="${mouthPath}" stroke="#d97706" stroke-width="3" fill="none" stroke-linecap="round"/>`;
        
        // Occhiali
        if (config.glasses && config.glasses !== 'none') {
            const glasses = ACCESSORIES.glasses[config.glasses];
            if (glasses) {
                svg += `<path d="${glasses.path}" stroke="${glasses.color}" stroke-width="2" fill="${glasses.tint || 'none'}"/>`;
            }
        }
        
        // Peli facciali
        if (config.facialHair && config.facialHair !== 'none') {
            const facialHair = ACCESSORIES.facial_hair[config.facialHair];
            if (facialHair) {
                const hairColor = facialHair.color || config.hairColor;
                const opacity = facialHair.opacity || 1;
                svg += `<path d="${facialHair.path}" fill="${hairColor}" opacity="${opacity}"/>`;
            }
        }
        
        // Orecchini
        if (config.earrings && config.earrings !== 'none') {
            const earrings = ACCESSORIES.earrings[config.earrings];
            if (earrings) {
                svg += `<path d="${earrings.left}" fill="${earrings.color}"/>`;
                svg += `<path d="${earrings.right}" fill="${earrings.color}"/>`;
            }
        }
        
        svg += `</svg>`;
        
        return svg;
    }

    // Genera avatar con foto
    generatePhotoAvatar(size = 200) {
        const config = this.currentConfig;
        
        let element = `<div style="
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background-image: url('${config.photoUrl}');
            background-size: cover;
            background-position: center;
            border: 3px solid rgba(255,255,255,0.4);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            position: relative;
            overflow: hidden;
        ">`;
        
        // Filtri foto
        if (config.photoFilter && config.photoFilter !== 'none') {
            const filters = {
                sepia: 'sepia(100%)',
                grayscale: 'grayscale(100%)',
                vintage: 'sepia(50%) contrast(120%) brightness(110%)',
                warm: 'hue-rotate(15deg) saturate(120%)',
                cool: 'hue-rotate(-15deg) saturate(110%)'
            };
            
            if (filters[config.photoFilter]) {
                element = element.replace('>', `filter: ${filters[config.photoFilter]};">`);
            }
        }
        
        element += `</div>`;
        
        return element;
    }

    // Randomizza configurazione
    randomizeConfig() {
        const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
        
        this.currentConfig = {
            ...this.currentConfig,
            faceShape: random(Object.keys(FACE_SHAPES.cartoon)),
            skinTone: random(SKIN_TONES),
            hairStyle: random(Object.keys(HAIR_STYLES.cartoon)),
            hairColor: random(HAIR_COLORS),
            eyeShape: random(Object.keys(EYE_SHAPES.cartoon)),
            eyeColor: random(EYE_COLORS),
            noseShape: random(Object.keys(NOSE_SHAPES.cartoon)),
            mouthShape: random(Object.keys(MOUTH_SHAPES.cartoon)),
            glasses: random(['none', ...Object.keys(ACCESSORIES.glasses).filter(k => k !== 'none')]),
            facialHair: random(['none', ...Object.keys(ACCESSORIES.facial_hair).filter(k => k !== 'none')]),
            shirtColor: random(CLOTHING.colors)
        };
        
        this.saveUserConfig();
        console.log('🎲 Avatar randomizzato!');
    }

    // Ottieni opzioni disponibili
    getAvailableOptions() {
        return {
            modes: ['cartoon', 'realistic'],
            faceShapes: Object.keys(FACE_SHAPES.cartoon),
            skinTones: SKIN_TONES,
            hairStyles: Object.keys(HAIR_STYLES.cartoon),
            hairColors: HAIR_COLORS,
            eyeShapes: Object.keys(EYE_SHAPES.cartoon),
            eyeColors: EYE_COLORS,
            noseShapes: Object.keys(NOSE_SHAPES.cartoon),
            mouthShapes: Object.keys(MOUTH_SHAPES.cartoon),
            accessories: {
                glasses: Object.keys(ACCESSORIES.glasses),
                facialHair: Object.keys(ACCESSORIES.facial_hair),
                earrings: Object.keys(ACCESSORIES.earrings),
                hats: Object.keys(ACCESSORIES.hats)
            },
            clothing: {
                shirts: Object.keys(CLOTHING.shirts),
                colors: CLOTHING.colors
            }
        };
    }

    // Ottieni configurazione corrente
    getCurrentConfig() {
        return { ...this.currentConfig };
    }
}

// === 🎨 UI BUILDER CLASS ===
class AvatarUIBuilder {
    constructor(avatarManager) {
        this.avatarManager = avatarManager;
        this.container = null;
        this.previewElement = null;
    }

    // Crea interfaccia completa
    createAvatarBuilder(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('❌ Container non trovato:', containerId);
            return false;
        }

        this.container = container;
        
        // HTML dell'interfaccia
        container.innerHTML = `
            <div class="avatar-builder-realistic">
                <div class="avatar-controls-section">
                    <div class="mode-selector">
                        <h3>🎭 Modalità Avatar</h3>
                        <div class="mode-buttons">
                            <button class="mode-btn active" data-mode="cartoon">🎨 Cartoon</button>
                            <button class="mode-btn" data-mode="realistic">👤 Realistico</button>
                            <button class="mode-btn" data-mode="photo">📸 Foto</button>
                        </div>
                    </div>

                    <div class="avatar-preview-section">
                        <div class="avatar-preview-container">
                            <div id="avatarPreview" class="avatar-preview"></div>
                        </div>
                        <div class="avatar-actions">
                            <button id="saveAvatarBtn" class="action-btn primary">💾 Salva</button>
                            <button id="randomizeBtn" class="action-btn secondary">🎲 Randomizza</button>
                            <button id="resetBtn" class="action-btn tertiary">🔄 Reset</button>
                        </div>
                    </div>

                    <div class="customization-panels">
                        <!-- Panel Foto -->
                        <div class="control-panel" id="photoPanel" style="display: none;">
                            <h4>📸 Carica Foto</h4>
                            <div class="photo-upload">
                                <input type="file" id="photoUpload" accept="image/*" style="display: none;">
                                <div class="upload-area" id="uploadArea">
                                    <p>📷 Clicca o trascina la tua foto</p>
                                </div>
                            </div>
                            <div class="photo-filters">
                                <label>Filtro:</label>
                                <select id="photoFilter">
                                    <option value="none">Nessuno</option>
                                    <option value="sepia">Seppia</option>
                                    <option value="grayscale">Bianco e Nero</option>
                                    <option value="vintage">Vintage</option>
                                    <option value="warm">Caldo</option>
                                    <option value="cool">Freddo</option>
                                </select>
                            </div>
                        </div>

                        <!-- Panel SVG -->
                        <div class="control-panel" id="svgPanel">
                            <!-- Forma Viso -->
                            <div class="control-group">
                                <h4>👤 Forma Viso</h4>
                                <div class="control-options" data-control="faceShape">
                                    <button class="option-btn active" data-value="oval">Ovale</button>
                                    <button class="option-btn" data-value="round">Rotondo</button>
                                    <button class="option-btn" data-value="square">Quadrato</button>
                                    <button class="option-btn" data-value="triangular">Triangolare</button>
                                    <button class="option-btn" data-value="diamond">Diamante</button>
                                    <button class="option-btn" data-value="long">Allungato</button>
                                </div>
                            </div>

                            <!-- Pelle -->
                            <div class="control-group">
                                <h4>🎨 Tonalità Pelle</h4>
                                <div class="color-options" data-control="skinTone">
                                    ${SKIN_TONES.map(color => 
                                        `<button class="color-btn ${color === '#FDBCBC' ? 'active' : ''}" data-value="${color}" style="background: ${color}"></button>`
                                    ).join('')}
                                </div>
                            </div>

                            <!-- Capelli -->
                            <div class="control-group">
                                <h4>💇 Stile Capelli</h4>
                                <div class="control-options" data-control="hairStyle">
                                    <button class="option-btn active" data-value="short">Corti</button>
                                    <button class="option-btn" data-value="medium">Medi</button>
                                    <button class="option-btn" data-value="long">Lunghi</button>
                                    <button class="option-btn" data-value="curly">Ricci</button>
                                    <button class="option-btn" data-value="buzz">Rasati</button>
                                    <button class="option-btn" data-value="mohawk">Mohawk</button>
                                    <button class="option-btn" data-value="wavy">Mossi</button>
                                    <button class="option-btn" data-value="bald">Calvo</button>
                                </div>
                            </div>

                            <!-- Colore Capelli -->
                            <div class="control-group">
                                <h4>🎨 Colore Capelli</h4>
                                <div class="color-options" data-control="hairColor">
                                    ${HAIR_COLORS.map(color => 
                                        `<button class="color-btn ${color === '#8B4513' ? 'active' : ''}" data-value="${color}" style="background: ${color}"></button>`
                                    ).join('')}
                                </div>
                            </div>

                            <!-- Occhi -->
                            <div class="control-group">
                                <h4>👀 Forma Occhi</h4>
                                <div class="control-options" data-control="eyeShape">
                                    <button class="option-btn active" data-value="normal">Normali</button>
                                    <button class="option-btn" data-value="large">Grandi</button>
                                    <button class="option-btn" data-value="small">Piccoli</button>
                                    <button class="option-btn" data-value="almond">Mandorla</button>
                                    <button class="option-btn" data-value="round">Rotondi</button>
                                </div>
                            </div>

                            <!-- Colore Occhi -->
                            <div class="control-group">
                                <h4>👁️ Colore Occhi</h4>
                                <div class="color-options" data-control="eyeColor">
                                    ${EYE_COLORS.map(color => 
                                        `<button class="color-btn ${color === '#8B4513' ? 'active' : ''}" data-value="${color}" style="background: ${color}"></button>`
                                    ).join('')}
                                </div>
                            </div>

                            <!-- Naso -->
                            <div class="control-group">
                                <h4>👃 Forma Naso</h4>
                                <div class="control-options" data-control="noseShape">
                                    <button class="option-btn" data-value="small">Piccolo</button>
                                    <button class="option-btn active" data-value="medium">Medio</button>
                                    <button class="option-btn" data-value="large">Grande</button>
                                    <button class="option-btn" data-value="pointed">Appuntito</button>
                                </div>
                            </div>

                            <!-- Bocca -->
                            <div class="control-group">
                                <h4>👄 Espressione</h4>
                                <div class="control-options" data-control="mouthShape">
                                    <button class="option-btn active" data-value="happy">😊 Felice</button>
                                    <button class="option-btn" data-value="neutral">😐 Neutro</button>
                                    <button class="option-btn" data-value="smile">🙂 Sorriso</button>
                                    <button class="option-btn" data-value="laugh">😄 Risata</button>
                                    <button class="option-btn" data-value="serious">😤 Serio</button>
                                    <button class="option-btn" data-value="pout">😗 Broncio</button>
                                </div>
                            </div>

                            <!-- Occhiali -->
                            <div class="control-group">
                                <h4>👓 Occhiali</h4>
                                <div class="control-options" data-control="glasses">
                                    <button class="option-btn active" data-value="none">Nessuno</button>
                                    <button class="option-btn" data-value="regular">Normali</button>
                                    <button class="option-btn" data-value="sunglasses">Da Sole</button>
                                    <button class="option-btn" data-value="reading">Da Lettura</button>
                                    <button class="option-btn" data-value="fashionable">Fashion</button>
                                </div>
                            </div>

                            <!-- Peli Facciali -->
                            <div class="control-group">
                                <h4>🧔 Peli Facciali</h4>
                                <div class="control-options" data-control="facialHair">
                                    <button class="option-btn active" data-value="none">Nessuno</button>
                                    <button class="option-btn" data-value="mustache">Baffi</button>
                                    <button class="option-btn" data-value="goatee">Pizzetto</button>
                                    <button class="option-btn" data-value="full_beard">Barba</button>
                                    <button class="option-btn" data-value="stubble">Barba Corta</button>
                                </div>
                            </div>

                            <!-- Orecchini -->
                            <div class="control-group">
                                <h4>💎 Orecchini</h4>
                                <div class="control-options" data-control="earrings">
                                    <button class="option-btn active" data-value="none">Nessuno</button>
                                    <button class="option-btn" data-value="simple">Semplici</button>
                                    <button class="option-btn" data-value="hoops">Cerchi</button>
                                </div>
                            </div>

                            <!-- Cappelli -->
                            <div class="control-group">
                                <h4>🧢 Cappelli</h4>
                                <div class="control-options" data-control="hat">
                                    <button class="option-btn active" data-value="none">Nessuno</button>
                                    <button class="option-btn" data-value="cap">Cappello</button>
                                    <button class="option-btn" data-value="beanie">Berretta</button>
                                    <button class="option-btn" data-value="fedora">Fedora</button>
                                </div>
                            </div>

                            <!-- Magliette -->
                            <div class="control-group">
                                <h4>👕 Abbigliamento</h4>
                                <div class="control-options" data-control="shirt">
                                    <button class="option-btn" data-value="none">Nessuno</button>
                                    <button class="option-btn active" data-value="tshirt">T-Shirt</button>
                                    <button class="option-btn" data-value="polo">Polo</button>
                                    <button class="option-btn" data-value="hoodie">Felpa</button>
                                </div>
                            </div>

                            <!-- Colore Abbigliamento -->
                            <div class="control-group">
                                <h4>🎨 Colore Abbigliamento</h4>
                                <div class="color-options" data-control="shirtColor">
                                    ${CLOTHING.colors.map(color => 
                                        `<button class="color-btn ${color === '#4ECDC4' ? 'active' : ''}" data-value="${color}" style="background: ${color}"></button>`
                                    ).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Inizializza eventi
        this.setupEventListeners();
        
        // Prima anteprima
        this.updatePreview();
        
        return true;
    }

    // Setup eventi
    setupEventListeners() {
        if (!this.container) return;

        // Mode selector
        this.container.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.switchMode(mode);
            });
        });

        // Control options
        this.container.querySelectorAll('.option-btn, .color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleOptionClick(e.target);
            });
        });

        // Action buttons
        const saveBtn = this.container.querySelector('#saveAvatarBtn');
        const randomBtn = this.container.querySelector('#randomizeBtn');
        const resetBtn = this.container.querySelector('#resetBtn');

        if (saveBtn) saveBtn.addEventListener('click', () => this.saveAvatar());
        if (randomBtn) randomBtn.addEventListener('click', () => this.randomizeAvatar());
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetAvatar());

        // Photo upload
        this.setupPhotoUpload();
    }

    // Setup photo upload
    setupPhotoUpload() {
        const uploadArea = this.container.querySelector('#uploadArea');
        const photoUpload = this.container.querySelector('#photoUpload');
        const photoFilter = this.container.querySelector('#photoFilter');

        if (uploadArea && photoUpload) {
            uploadArea.addEventListener('click', () => photoUpload.click());
            
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.background = '#f0f9ff';
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.style.background = '';
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.background = '';
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

        if (photoFilter) {
            photoFilter.addEventListener('change', (e) => {
                this.avatarManager.updateConfig('photoFilter', e.target.value);
                this.updatePreview();
            });
        }
    }

    // Handle photo upload
    handlePhotoUpload(file) {
        if (!file.type.startsWith('image/')) {
            alert('Per favore seleziona un file immagine valido');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const photoUrl = e.target.result;
            this.avatarManager.togglePhotoMode(true, photoUrl);
            this.updatePreview();
            
            const uploadArea = this.container.querySelector('#uploadArea');
            if (uploadArea) {
                uploadArea.innerHTML = '<p>✅ Foto caricata con successo!</p>';
            }
        };
        reader.readAsDataURL(file);
    }

    // Switch mode
    switchMode(mode) {
        // Update UI
        this.container.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Show/hide panels
        const photoPanel = this.container.querySelector('#photoPanel');
        const svgPanel = this.container.querySelector('#svgPanel');

        if (mode === 'photo') {
            if (photoPanel) photoPanel.style.display = 'block';
            if (svgPanel) svgPanel.style.display = 'none';
        } else {
            if (photoPanel) photoPanel.style.display = 'none';
            if (svgPanel) svgPanel.style.display = 'block';
            
            // Update avatar manager mode
            this.avatarManager.setMode(mode);
            this.avatarManager.togglePhotoMode(false);
        }

        this.updatePreview();
    }

    // Handle option click
    handleOptionClick(button) {
        const controlGroup = button.closest('.control-options, .color-options');
        if (!controlGroup) return;

        const control = controlGroup.dataset.control;
        const value = button.dataset.value;

        if (!control || !value) return;

        // Update UI
        controlGroup.querySelectorAll('.option-btn, .color-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        // Update avatar
        this.avatarManager.updateConfig(control, value);
        this.updatePreview();
    }

    // Update preview
    updatePreview() {
        const preview = this.container.querySelector('#avatarPreview');
        if (!preview) return;

        const avatarHTML = this.avatarManager.generateAvatarSVG(150);
        preview.innerHTML = avatarHTML;
    }

    // Save avatar
    saveAvatar() {
        this.avatarManager.saveUserConfig();
        this.showNotification('💾 Avatar salvato con successo!', 'success');
    }

    // Randomize avatar
    randomizeAvatar() {
        this.avatarManager.randomizeConfig();
        this.updateUIFromConfig();
        this.updatePreview();
        this.showNotification('🎲 Avatar randomizzato!', 'info');
    }

    // Reset avatar
    resetAvatar() {
        this.avatarManager.currentConfig = this.avatarManager.getDefaultConfig();
        this.updateUIFromConfig();
        this.updatePreview();
        this.showNotification('🔄 Avatar ripristinato!', 'info');
    }

    // Update UI from config
    updateUIFromConfig() {
        const config = this.avatarManager.getCurrentConfig();
        
        Object.entries(config).forEach(([key, value]) => {
            const controlGroup = this.container.querySelector(`[data-control="${key}"]`);
            if (controlGroup) {
                // Remove all active states
                controlGroup.querySelectorAll('.option-btn, .color-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active to current value
                const activeBtn = controlGroup.querySelector(`[data-value="${value}"]`);
                if (activeBtn) {
                    activeBtn.classList.add('active');
                }
            }
        });
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `avatar-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// === 🎯 SISTEMA PRINCIPALE ===

// Instance globale
let globalAvatarManagerRealistic = null;
let globalAvatarUIBuilder = null;

// Inizializza sistema completo
async function initializeRealisticAvatarSystem(userId = null) {
    try {
        if (!globalAvatarManagerRealistic) {
            globalAvatarManagerRealistic = new AvatarManagerRealistic();
        }
        
        const success = await globalAvatarManagerRealistic.initialize(userId);
        
        if (success) {
            console.log('✅ Sistema Avatar Realistico inizializzato');
            return globalAvatarManagerRealistic;
        }
        
        return null;
        
    } catch (error) {
        console.error('❌ Errore inizializzazione sistema avatar realistico:', error);
        return null;
    }
}

// Crea UI Builder
function createAvatarUI(containerId, avatarManager = null) {
    try {
        const manager = avatarManager || globalAvatarManagerRealistic;
        
        if (!manager) {
            console.error('❌ Avatar Manager non inizializzato');
            return null;
        }
        
        globalAvatarUIBuilder = new AvatarUIBuilder(manager);
        const success = globalAvatarUIBuilder.createAvatarBuilder(containerId);
        
        if (success) {
            console.log('✅ Avatar UI Builder creato');
            return globalAvatarUIBuilder;
        }
        
        return null;
        
    } catch (error) {
        console.error('❌ Errore creazione Avatar UI Builder:', error);
        return null;
    }
}

// Ottieni avatar manager
function getRealisticAvatarManager() {
    return globalAvatarManagerRealistic;
}

// Ottieni UI builder
function getAvatarUIBuilder() {
    return globalAvatarUIBuilder;
}

// Compatibilità window per uso diretto nel browser
if (typeof window !== 'undefined') {
    window.RealisticAvatarSystem = {
        AvatarManagerRealistic,
        AvatarUIBuilder,
        initializeRealisticAvatarSystem,
        createAvatarUI,
        getRealisticAvatarManager,
        getAvatarUIBuilder,
        AVATAR_CONFIG
    };
}

console.log('🎨 Avatar System Realistic caricato - Doppia modalità con tantissime opzioni!');