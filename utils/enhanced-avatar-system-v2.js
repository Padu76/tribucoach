// enhanced-avatar-system-v2.js - Sistema Avatar V2.0 Completo
// Integrazione AI v2.0 + Doppia modalità (Cartoon/Foto) + Progressione Coaching

// === 🎨 CONFIGURAZIONE AVATAR SYSTEM V2.0 ===
const AVATAR_V2_CONFIG = {
    version: '2.0',
    modes: {
        CARTOON: 'cartoon',
        PHOTO: 'photo'
    },
    maxPhotoSize: 5 * 1024 * 1024, // 5MB
    supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    cartoonStyles: ['realistic', 'stylized', 'minimal', 'artistic'],
    progressionLevels: 10,
    aiSuggestionEnabled: true
};

// === 🧠 PROFILI LIFESTYLE AI V2.0 INTEGRATION ===
const LIFESTYLE_AVATAR_PROFILES = {
    'stressato_esaurito': {
        name: 'Stressato Esaurito',
        colors: {
            primary: '#6366f1',
            secondary: '#8b5cf6',
            accent: '#a855f7'
        },
        cartoonTraits: {
            expression: 'calm',
            eyeStyle: 'gentle',
            posture: 'relaxed',
            aura: 'peaceful'
        },
        photoFilters: {
            saturation: 0.8,
            brightness: 1.1,
            warmth: 1.2,
            blur: 0.5
        },
        progressionTheme: 'serenity',
        aiSuggestions: [
            'Colori rilassanti per ridurre stress visivo',
            'Espressione calma per influenza psicologica positiva',
            'Elementi zen per supporto mentale'
        ]
    },
    'procrastinatore': {
        name: 'Procrastinatore',
        colors: {
            primary: '#ef4444',
            secondary: '#f97316',
            accent: '#fbbf24'
        },
        cartoonTraits: {
            expression: 'determined',
            eyeStyle: 'focused',
            posture: 'dynamic',
            aura: 'energetic'
        },
        photoFilters: {
            saturation: 1.3,
            brightness: 1.2,
            contrast: 1.1,
            sharpness: 1.2
        },
        progressionTheme: 'action',
        aiSuggestions: [
            'Colori energici per stimolare azione',
            'Espressione determinata per motivazione',
            'Elementi dinamici per spinta all\'azione'
        ]
    },
    'perfezionista': {
        name: 'Perfezionista',
        colors: {
            primary: '#0ea5e9',
            secondary: '#06b6d4',
            accent: '#22d3ee'
        },
        cartoonTraits: {
            expression: 'confident',
            eyeStyle: 'sharp',
            posture: 'precise',
            aura: 'polished'
        },
        photoFilters: {
            saturation: 1.0,
            brightness: 1.0,
            contrast: 1.2,
            clarity: 1.3
        },
        progressionTheme: 'excellence',
        aiSuggestions: [
            'Design pulito e preciso per soddisfare standard elevati',
            'Dettagli curati per rispecchiare personalità',
            'Simmetria perfetta per equilibrio visivo'
        ]
    },
    'dispersivo': {
        name: 'Dispersivo',
        colors: {
            primary: '#8b5cf6',
            secondary: '#a855f7',
            accent: '#c084fc'
        },
        cartoonTraits: {
            expression: 'creative',
            eyeStyle: 'bright',
            posture: 'fluid',
            aura: 'colorful'
        },
        photoFilters: {
            saturation: 1.4,
            brightness: 1.1,
            vibrance: 1.3,
            rainbow: 0.2
        },
        progressionTheme: 'creativity',
        aiSuggestions: [
            'Palette variegata per stimolare creatività',
            'Elementi dinamici per mantenere interesse',
            'Design flessibile per adattarsi ai cambiamenti'
        ]
    },
    'inconsistente': {
        name: 'Inconsistente',
        colors: {
            primary: '#10b981',
            secondary: '#059669',
            accent: '#34d399'
        },
        cartoonTraits: {
            expression: 'stable',
            eyeStyle: 'steady',
            posture: 'grounded',
            aura: 'consistent'
        },
        photoFilters: {
            saturation: 1.0,
            brightness: 1.0,
            stability: 1.5,
            balance: 1.2
        },
        progressionTheme: 'stability',
        aiSuggestions: [
            'Colori stabili per trasmettere costanza',
            'Design equilibrato per supportare coerenza',
            'Elementi fissi per costruire routine visiva'
        ]
    },
    'ottimizzatore': {
        name: 'Ottimizzatore',
        colors: {
            primary: '#f59e0b',
            secondary: '#d97706',
            accent: '#fbbf24'
        },
        cartoonTraits: {
            expression: 'analytical',
            eyeStyle: 'precise',
            posture: 'efficient',
            aura: 'optimized'
        },
        photoFilters: {
            saturation: 1.1,
            brightness: 1.0,
            contrast: 1.1,
            precision: 1.4
        },
        progressionTheme: 'optimization',
        aiSuggestions: [
            'Design funzionale per massima efficienza',
            'Elementi misurabili per tracking progressi',
            'Interfaccia ottimizzata per performance'
        ]
    }
};

// === 🎭 CARTOON AVATAR V2.0 - SISTEMA EVOLUTO ===
const CARTOON_AVATAR_COMPONENTS = {
    faceShapes: {
        oval: { path: 'M50,60 Q50,40 70,40 Q90,40 90,60 Q90,80 70,80 Q50,80 50,60', realistic: true },
        round: { path: 'M50,60 Q50,35 70,35 Q90,35 90,60 Q90,85 70,85 Q50,85 50,60', realistic: true },
        square: { path: 'M50,45 L50,75 Q50,80 55,80 L85,80 Q90,80 90,75 L90,45 Q90,40 85,40 L55,40 Q50,40 50,45', realistic: true },
        heart: { path: 'M50,65 Q50,45 60,40 Q70,35 75,40 Q80,35 90,40 Q90,50 85,60 Q80,70 70,75 Q60,70 50,65', realistic: true },
        diamond: { path: 'M70,35 Q85,50 90,65 Q85,80 70,85 Q55,80 50,65 Q55,50 70,35', realistic: true }
    },
    
    hairStyles: {
        short_modern: {
            path: 'M45,50 Q50,30 70,25 Q90,30 95,50 Q90,45 80,45 Q70,40 60,45 Q50,45 45,50',
            realistic: true,
            style: 'modern'
        },
        medium_layered: {
            path: 'M40,45 Q45,25 70,20 Q95,25 100,45 Q95,50 85,55 Q70,50 55,55 Q45,50 40,45',
            realistic: true,
            style: 'layered'
        },
        long_flowing: {
            path: 'M35,40 Q40,20 70,15 Q100,20 105,40 Q100,60 90,75 Q70,80 50,75 Q40,60 35,40',
            realistic: true,
            style: 'flowing'
        },
        curly_natural: {
            path: 'M40,45 Q45,25 55,30 Q60,20 70,25 Q80,20 85,30 Q95,25 100,45 Q95,55 85,50 Q75,60 70,55 Q65,60 55,50 Q45,55 40,45',
            realistic: true,
            style: 'curly'
        },
        buzz_cut: {
            path: 'M50,45 Q55,35 70,35 Q85,35 90,45 Q85,40 70,40 Q55,40 50,45',
            realistic: true,
            style: 'minimal'
        },
        professional: {
            path: 'M45,45 Q50,30 70,28 Q90,30 95,45 Q90,42 80,42 Q70,38 60,42 Q50,42 45,45',
            realistic: true,
            style: 'professional'
        }
    },
    
    eyeStyles: {
        natural: {
            shape: 'M75,55 Q85,52 95,55 Q85,58 75,55',
            pupil: 'circle',
            size: 'medium',
            realistic: true
        },
        expressive: {
            shape: 'M75,54 Q85,50 95,54 Q85,60 75,54',
            pupil: 'oval',
            size: 'large',
            realistic: true
        },
        gentle: {
            shape: 'M76,55 Q85,53 94,55 Q85,57 76,55',
            pupil: 'soft-circle',
            size: 'medium',
            realistic: true
        },
        focused: {
            shape: 'M75,55 Q85,53 95,55 Q85,56 75,55',
            pupil: 'sharp-circle',
            size: 'small',
            realistic: true
        },
        bright: {
            shape: 'M74,54 Q85,50 96,54 Q85,60 74,54',
            pupil: 'bright-circle',
            size: 'large',
            realistic: true
        }
    },
    
    noseStyles: {
        subtle: { path: 'M70,65 Q72,67 70,69 Q68,67 70,65', realistic: true },
        defined: { path: 'M70,64 Q73,66 70,70 Q67,66 70,64', realistic: true },
        soft: { path: 'M70,65 Q71,66 70,67 Q69,66 70,65', realistic: true },
        strong: { path: 'M70,63 Q74,66 70,71 Q66,66 70,63', realistic: true }
    },
    
    mouthExpressions: {
        calm: { path: 'M65,75 Q70,77 75,75', emotion: 'peaceful' },
        determined: { path: 'M64,74 Q70,76 76,74', emotion: 'strong' },
        confident: { path: 'M65,75 Q70,78 75,75', emotion: 'assured' },
        creative: { path: 'M64,75 Q70,79 76,75', emotion: 'inspired' },
        stable: { path: 'M65,75 Q70,76 75,75', emotion: 'grounded' },
        analytical: { path: 'M65,74 Q70,75 75,74', emotion: 'thoughtful' },
        happy: { path: 'M63,74 Q70,80 77,74', emotion: 'joyful' },
        focused: { path: 'M65,74 Q70,75 75,74', emotion: 'concentrated' }
    },
    
    accessories: {
        glasses_modern: {
            path: 'M60,55 Q65,53 70,55 Q75,53 80,55 M70,55 L70,57',
            style: 'modern'
        },
        glasses_classic: {
            path: 'M62,55 Q67,52 72,55 Q77,52 82,55 M72,55 L72,58',
            style: 'classic'
        },
        beard_light: {
            path: 'M65,72 Q70,78 75,72 Q75,75 70,77 Q65,75 65,72',
            style: 'subtle'
        },
        beard_full: {
            path: 'M63,70 Q70,82 77,70 Q77,78 70,82 Q63,78 63,70',
            style: 'full'
        }
    }
};

// === 📷 PHOTO AVATAR SYSTEM ===
const PHOTO_AVATAR_SYSTEM = {
    uploadOptions: {
        maxSize: AVATAR_V2_CONFIG.maxPhotoSize,
        allowedTypes: AVATAR_V2_CONFIG.supportedFormats,
        compression: {
            quality: 0.8,
            maxWidth: 400,
            maxHeight: 400
        }
    },
    
    filters: {
        lifestyle: LIFESTYLE_AVATAR_PROFILES,
        
        artistic: {
            vintage: { sepia: 0.3, brightness: 0.9, contrast: 1.1 },
            modern: { saturation: 1.2, brightness: 1.1, contrast: 1.0 },
            dramatic: { contrast: 1.4, brightness: 0.9, saturation: 0.8 },
            soft: { blur: 0.5, brightness: 1.1, saturation: 0.9 },
            vibrant: { saturation: 1.5, brightness: 1.2, contrast: 1.1 }
        },
        
        professional: {
            corporate: { brightness: 1.0, contrast: 1.1, saturation: 0.9 },
            creative: { saturation: 1.2, brightness: 1.1, vibrance: 1.2 },
            minimal: { saturation: 0.7, brightness: 1.0, contrast: 1.0 }
        }
    },
    
    frames: {
        circle: { borderRadius: '50%', border: 'none' },
        rounded: { borderRadius: '20px', border: '3px solid' },
        square: { borderRadius: '0', border: '2px solid' },
        hexagon: { clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' },
        diamond: { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', transform: 'rotate(0deg)' }
    }
};

// === 🚀 PROGRESSIONE COACHING AVATAR ===
const AVATAR_PROGRESSION_SYSTEM = {
    levels: {
        1: { name: 'Nuovo Inizio', unlock: 'Primo login', rewards: ['basic_customization'] },
        2: { name: 'Prime Settimane', unlock: '1 settimana completata', rewards: ['hair_styles', 'basic_filters'] },
        3: { name: 'Momentum', unlock: '2 settimane completate', rewards: ['eye_styles', 'expression_pack_1'] },
        4: { name: 'Costanza', unlock: '3 settimane completate', rewards: ['accessories_pack_1', 'photo_filters_1'] },
        5: { name: 'Trasformazione', unlock: '4 settimane completate', rewards: ['advanced_customization', 'progression_frame'] },
        6: { name: 'Padronanza', unlock: '5 settimane completate', rewards: ['premium_styles', 'ai_suggestions'] },
        7: { name: 'Maestria', unlock: '6 settimane completate', rewards: ['expert_tools', 'custom_expressions'] },
        8: { name: 'Eccellenza', unlock: '7 settimane completate', rewards: ['all_features', 'celebration_effects'] },
        9: { name: 'Mentore', unlock: 'Mentor altri utenti', rewards: ['exclusive_styles', 'mentor_badge'] },
        10: { name: 'Leggenda', unlock: 'Master completo', rewards: ['legendary_customization', 'unique_aura'] }
    },
    
    achievements: {
        'first_customization': { name: 'Primo Stile', description: 'Personalizza il tuo primo avatar' },
        'photo_upload': { name: 'Foto Personale', description: 'Carica la tua prima foto avatar' },
        'style_explorer': { name: 'Esploratore di Stili', description: 'Prova 5 stili diversi' },
        'consistency_king': { name: 'Re della Costanza', description: 'Mantieni lo stesso avatar per 7 giorni' },
        'ai_collaborator': { name: 'Collaboratore AI', description: 'Usa 10 suggerimenti AI' },
        'perfectionist': { name: 'Perfezionista', description: 'Spendi 30+ minuti nella personalizzazione' },
        'trendsetter': { name: 'Trendsetter', description: 'Crea uno stile unico votato dalla community' }
    }
};

// === 🤖 AI SUGGESTION ENGINE ===
class AvatarAIEngine {
    constructor() {
        this.userProfile = null;
        this.progressData = null;
        this.preferences = {};
    }
    
    // Analizza profilo utente e genera suggerimenti
    generateSuggestions(userProfile, currentAvatar, progressData) {
        const suggestions = [];
        
        // Suggerimenti basati su profilo lifestyle
        if (userProfile && LIFESTYLE_AVATAR_PROFILES[userProfile.type]) {
            const profile = LIFESTYLE_AVATAR_PROFILES[userProfile.type];
            suggestions.push(...this.getLifestyleSuggestions(profile, currentAvatar));
        }
        
        // Suggerimenti basati su progressi
        if (progressData) {
            suggestions.push(...this.getProgressSuggestions(progressData, currentAvatar));
        }
        
        // Suggerimenti stagionali/temporali
        suggestions.push(...this.getContextualSuggestions());
        
        return this.rankSuggestions(suggestions);
    }
    
    getLifestyleSuggestions(profile, currentAvatar) {
        const suggestions = [];
        
        profile.aiSuggestions.forEach(suggestion => {
            suggestions.push({
                type: 'lifestyle',
                priority: 'high',
                title: `Ottimizzazione ${profile.name}`,
                description: suggestion,
                action: this.generateLifestyleAction(profile, currentAvatar),
                impact: 'Migliora l\'allineamento con il tuo profilo'
            });
        });
        
        return suggestions;
    }
    
    getProgressSuggestions(progressData, currentAvatar) {
        const suggestions = [];
        const completedWeeks = progressData.weeksCompleted || 0;
        
        if (completedWeeks >= 2 && !currentAvatar.hasProgressionElements) {
            suggestions.push({
                type: 'progression',
                priority: 'medium',
                title: 'Celebra i Tuoi Progressi',
                description: 'Aggiungi elementi che mostrano i tuoi risultati',
                action: 'add_progression_indicators',
                impact: 'Motivazione visiva per i tuoi successi'
            });
        }
        
        if (progressData.streak >= 7 && currentAvatar.mode === 'cartoon') {
            suggestions.push({
                type: 'achievement',
                priority: 'high',
                title: 'Aura di Costanza',
                description: 'Sblocca un\'aura speciale per la tua dedizione',
                action: 'unlock_consistency_aura',
                impact: 'Riconoscimento visivo della tua disciplina'
            });
        }
        
        return suggestions;
    }
    
    getContextualSuggestions() {
        const suggestions = [];
        const now = new Date();
        const season = this.getSeason(now);
        const hour = now.getHours();
        
        // Suggerimenti stagionali
        if (season === 'winter') {
            suggestions.push({
                type: 'seasonal',
                priority: 'low',
                title: 'Palette Invernale',
                description: 'Colori caldi per la stagione fredda',
                action: 'apply_winter_palette',
                impact: 'Armonia con la stagione corrente'
            });
        }
        
        // Suggerimenti basati sull'orario
        if (hour >= 18 || hour <= 6) {
            suggestions.push({
                type: 'contextual',
                priority: 'low',
                title: 'Modalità Serale',
                description: 'Colori più soft per la sera',
                action: 'apply_evening_mode',
                impact: 'Meno affaticamento visivo'
            });
        }
        
        return suggestions;
    }
    
    rankSuggestions(suggestions) {
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        
        return suggestions.sort((a, b) => {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }
    
    getSeason(date) {
        const month = date.getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'autumn';
        return 'winter';
    }
    
    generateLifestyleAction(profile, currentAvatar) {
        return {
            type: 'apply_lifestyle_optimization',
            data: {
                colors: profile.colors,
                traits: profile.cartoonTraits,
                filters: profile.photoFilters
            }
        };
    }
}

// === 🎨 ENHANCED AVATAR MANAGER V2.0 ===
class EnhancedAvatarManagerV2 {
    constructor() {
        this.currentUser = null;
        this.currentAvatar = {
            mode: AVATAR_V2_CONFIG.modes.CARTOON,
            cartoonConfig: this.getDefaultCartoonConfig(),
            photoConfig: this.getDefaultPhotoConfig(),
            level: 1,
            achievements: [],
            createdAt: new Date(),
            lastModified: new Date()
        };
        this.aiEngine = new AvatarAIEngine();
        this.progressionData = null;
        this.isInitialized = false;
    }
    
    // Inizializzazione completa sistema
    async initialize(userId, lifestyleProfile = null) {
        try {
            this.currentUser = userId;
            console.log('🚀 Inizializzazione Enhanced Avatar System V2.0...');
            
            // Carica avatar esistente
            await this.loadUserAvatar();
            
            // Applica profilo lifestyle se fornito
            if (lifestyleProfile) {
                await this.applyLifestyleProfile(lifestyleProfile);
            }
            
            // Carica dati progressione
            await this.loadProgressionData();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Genera suggerimenti AI iniziali
            await this.generateAISuggestions();
            
            this.isInitialized = true;
            console.log('✅ Enhanced Avatar System V2.0 inizializzato');
            
            return true;
            
        } catch (error) {
            console.error('❌ Errore inizializzazione Avatar V2.0:', error);
            return false;
        }
    }
    
    // Configurazione cartoon di default
    getDefaultCartoonConfig() {
        return {
            faceShape: 'oval',
            hairStyle: 'short_modern',
            hairColor: '#4A5568',
            eyeStyle: 'natural',
            eyeColor: '#2D3748',
            noseStyle: 'subtle',
            mouthExpression: 'calm',
            skinTone: '#F7FAFC',
            accessories: [],
            aura: null,
            customizations: {}
        };
    }
    
    // Configurazione photo di default
    getDefaultPhotoConfig() {
        return {
            imageData: null,
            filter: 'none',
            frame: 'circle',
            brightness: 1.0,
            contrast: 1.0,
            saturation: 1.0,
            customEffects: {}
        };
    }
    
    // Applica profilo lifestyle
    async applyLifestyleProfile(profileType) {
        const profile = LIFESTYLE_AVATAR_PROFILES[profileType];
        if (!profile) return false;
        
        try {
            if (this.currentAvatar.mode === AVATAR_V2_CONFIG.modes.CARTOON) {
                // Applica traits cartoon
                Object.assign(this.currentAvatar.cartoonConfig, {
                    ...this.currentAvatar.cartoonConfig,
                    mouthExpression: profile.cartoonTraits.expression,
                    eyeStyle: profile.cartoonTraits.eyeStyle,
                    aura: profile.cartoonTraits.aura
                });
            } else {
                // Applica filtri foto
                Object.assign(this.currentAvatar.photoConfig, profile.photoFilters);
            }
            
            // Salva cambiamenti
            await this.saveAvatar();
            
            console.log(`✅ Profilo lifestyle "${profile.name}" applicato`);
            return true;
            
        } catch (error) {
            console.error('❌ Errore applicazione profilo lifestyle:', error);
            return false;
        }
    }
    
    // Cambia modalità avatar (cartoon/photo)
    async switchAvatarMode(newMode) {
        if (!Object.values(AVATAR_V2_CONFIG.modes).includes(newMode)) {
            throw new Error('Modalità avatar non valida');
        }
        
        this.currentAvatar.mode = newMode;
        this.currentAvatar.lastModified = new Date();
        
        await this.saveAvatar();
        this.emitAvatarChanged('mode_switch', { newMode });
        
        console.log(`🔄 Modalità avatar cambiata: ${newMode}`);
        return true;
    }
    
    // Upload e processamento foto
    async uploadPhoto(file) {
        try {
            // Validazione file
            if (!this.validatePhotoFile(file)) {
                throw new Error('File non valido');
            }
            
            // Comprimi e processa immagine
            const processedImage = await this.processPhotoFile(file);
            
            // Salva in configurazione
            this.currentAvatar.photoConfig.imageData = processedImage;
            this.currentAvatar.mode = AVATAR_V2_CONFIG.modes.PHOTO;
            this.currentAvatar.lastModified = new Date();
            
            // Sblocca achievement
            this.unlockAchievement('photo_upload');
            
            await this.saveAvatar();
            this.emitAvatarChanged('photo_uploaded', { imageData: processedImage });
            
            console.log('📷 Foto avatar caricata e processata');
            return processedImage;
            
        } catch (error) {
            console.error('❌ Errore upload foto:', error);
            throw error;
        }
    }
    
    // Validazione file foto
    validatePhotoFile(file) {
        if (!file) return false;
        
        // Controlla tipo
        if (!AVATAR_V2_CONFIG.supportedFormats.includes(file.type)) {
            return false;
        }
        
        // Controlla dimensione
        if (file.size > AVATAR_V2_CONFIG.maxPhotoSize) {
            return false;
        }
        
        return true;
    }
    
    // Processamento file foto
    async processPhotoFile(file) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                const maxSize = 400;
                let { width, height } = img;
                
                // Ridimensiona mantenendo proporzioni
                if (width > height) {
                    if (width > maxSize) {
                        height = height * (maxSize / width);
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width = width * (maxSize / height);
                        height = maxSize;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Disegna e comprimi
                ctx.drawImage(img, 0, 0, width, height);
                const compressedDataURL = canvas.toDataURL('image/jpeg', 0.8);
                
                resolve(compressedDataURL);
            };
            
            img.onerror = () => reject(new Error('Errore caricamento immagine'));
            img.src = URL.createObjectURL(file);
        });
    }
    
    // Aggiorna configurazione cartoon
    updateCartoonConfig(updates) {
        Object.assign(this.currentAvatar.cartoonConfig, updates);
        this.currentAvatar.lastModified = new Date();
        
        this.saveAvatar();
        this.emitAvatarChanged('cartoon_updated', updates);
        
        console.log('🎨 Configurazione cartoon aggiornata:', updates);
    }
    
    // Aggiorna configurazione photo
    updatePhotoConfig(updates) {
        Object.assign(this.currentAvatar.photoConfig, updates);
        this.currentAvatar.lastModified = new Date();
        
        this.saveAvatar();
        this.emitAvatarChanged('photo_updated', updates);
        
        console.log('📷 Configurazione photo aggiornata:', updates);
    }
    
    // Genera avatar SVG cartoon
    generateCartoonSVG() {
        const config = this.currentAvatar.cartoonConfig;
        const components = CARTOON_AVATAR_COMPONENTS;
        
        const svg = `
            <svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
                <!-- Background -->
                <circle cx="70" cy="70" r="65" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
                
                <!-- Face -->
                <path d="${components.faceShapes[config.faceShape].path}" 
                      fill="${config.skinTone}" 
                      transform="translate(0,10)"/>
                
                <!-- Hair -->
                <path d="${components.hairStyles[config.hairStyle].path}" 
                      fill="${config.hairColor}" 
                      transform="translate(3,5)"/>
                
                <!-- Eyes -->
                <g id="eyes" transform="translate(15,0)">
                    <path d="${components.eyeStyles[config.eyeStyle].shape}" 
                          fill="white" 
                          transform="translate(-5,0)"/>
                    <path d="${components.eyeStyles[config.eyeStyle].shape}" 
                          fill="white" 
                          transform="translate(15,0)"/>
                    <circle cx="80" cy="55" r="3" fill="${config.eyeColor}"/>
                    <circle cx="100" cy="55" r="3" fill="${config.eyeColor}"/>
                </g>
                
                <!-- Nose -->
                <path d="${components.noseStyles[config.noseStyle].path}" 
                      fill="${this.adjustColor(config.skinTone, -0.1)}" 
                      transform="translate(0,5)"/>
                
                <!-- Mouth -->
                <path d="${components.mouthExpressions[config.mouthExpression].path}" 
                      stroke="#d97706" 
                      stroke-width="2" 
                      fill="none" 
                      stroke-linecap="round"
                      transform="translate(0,8)"/>
                
                <!-- Accessories -->
                ${this.renderAccessories(config.accessories)}
                
                <!-- Aura Effect -->
                ${config.aura ? this.renderAura(config.aura) : ''}
                
                <!-- Progression Indicators -->
                ${this.renderProgressionIndicators()}
            </svg>
        `;
        
        return svg;
    }
    
    // Renderizza accessori
    renderAccessories(accessories) {
        if (!accessories || accessories.length === 0) return '';
        
        return accessories.map(accessory => {
            const component = CARTOON_AVATAR_COMPONENTS.accessories[accessory];
            if (!component) return '';
            
            return `<path d="${component.path}" 
                          stroke="#2d3748" 
                          stroke-width="1.5" 
                          fill="none"/>`;
        }).join('');
    }
    
    // Renderizza effetto aura
    renderAura(auraType) {
        const auraEffects = {
            peaceful: `<animateTransform attributeName="transform" type="rotate" values="0 70 70;360 70 70" dur="20s" repeatCount="indefinite"/>
                      <circle cx="70" cy="70" r="75" fill="none" stroke="#6366f1" stroke-width="0.5" opacity="0.3"/>`,
            energetic: `<circle cx="70" cy="70" r="68" fill="none" stroke="#ef4444" stroke-width="1" opacity="0.6">
                       <animate attributeName="r" values="68;72;68" dur="2s" repeatCount="indefinite"/>
                       </circle>`,
            optimized: `<polygon points="70,10 80,30 100,30 85,45 90,65 70,55 50,65 55,45 40,30 60,30" 
                       fill="#f59e0b" opacity="0.4" transform="translate(0,5)"/>`,
            consistent: `<rect x="20" y="20" width="100" height="100" rx="50" 
                        fill="none" stroke="#10b981" stroke-width="2" opacity="0.4" stroke-dasharray="5,5">
                        <animateTransform attributeName="stroke-dashoffset" values="0;10" dur="1s" repeatCount="indefinite"/>
                        </rect>`
        };
        
        return auraEffects[auraType] || '';
    }
    
    // Renderizza indicatori progressione
    renderProgressionIndicators() {
        const level = this.currentAvatar.level;
        const maxLevel = AVATAR_V2_CONFIG.progressionLevels;
        
        if (level <= 1) return '';
        
        const stars = Math.min(Math.floor(level / 2), 5);
        const starElements = Array.from({ length: stars }, (_, i) => {
            const x = 100 + (i * 8);
            const y = 25;
            return `<polygon points="${x},${y} ${x+2},${y+3} ${x+5},${y+3} ${x+3},${y+5} ${x+4},${y+8} ${x},${y+6} ${x-4},${y+8} ${x-3},${y+5} ${x-5},${y+3} ${x-2},${y+3}" 
                           fill="#fbbf24" 
                           opacity="0.8"/>`;
        }).join('');
        
        return `<g id="progression">${starElements}</g>`;
    }
    
    // Genera HTML per avatar foto
    generatePhotoHTML() {
        const config = this.currentAvatar.photoConfig;
        
        if (!config.imageData) {
            return '<div class="photo-placeholder">📷 Carica una foto</div>';
        }
        
        const frameStyle = PHOTO_AVATAR_SYSTEM.frames[config.frame];
        const filters = this.generateCSSFilters(config);
        
        return `
            <div class="photo-avatar-container" style="${this.objectToCSS(frameStyle)}">
                <img src="${config.imageData}" 
                     alt="Avatar Foto" 
                     style="width: 100%; height: 100%; object-fit: cover; ${filters}"/>
                ${this.renderPhotoOverlays()}
            </div>
        `;
    }
    
    // Genera filtri CSS per foto
    generateCSSFilters(config) {
        return `filter: brightness(${config.brightness}) 
                        contrast(${config.contrast}) 
                        saturate(${config.saturation});`;
    }
    
    // Renderizza overlay per foto
    renderPhotoOverlays() {
        const level = this.currentAvatar.level;
        
        if (level <= 2) return '';
        
        return `
            <div class="photo-overlay">
                <div class="level-badge">${level}</div>
                ${this.currentAvatar.achievements.length > 0 ? '<div class="achievement-indicator">🏆</div>' : ''}
            </div>
        `;
    }
    
    // Sistema di achievement
    unlockAchievement(achievementId) {
        const achievement = AVATAR_PROGRESSION_SYSTEM.achievements[achievementId];
        
        if (!achievement || this.currentAvatar.achievements.includes(achievementId)) {
            return false;
        }
        
        this.currentAvatar.achievements.push(achievementId);
        this.emitAvatarChanged('achievement_unlocked', { achievement, achievementId });
        
        console.log(`🏆 Achievement sbloccato: ${achievement.name}`);
        return true;
    }
    
    // Aggiorna livello progressione
    updateProgressionLevel(newLevel) {
        if (newLevel > this.currentAvatar.level && newLevel <= AVATAR_V2_CONFIG.progressionLevels) {
            const oldLevel = this.currentAvatar.level;
            this.currentAvatar.level = newLevel;
            
            // Sblocca ricompense del nuovo livello
            const levelData = AVATAR_PROGRESSION_SYSTEM.levels[newLevel];
            if (levelData && levelData.rewards) {
                levelData.rewards.forEach(reward => {
                    this.unlockReward(reward);
                });
            }
            
            this.emitAvatarChanged('level_up', { oldLevel, newLevel, levelData });
            console.log(`📈 Livello avatar aggiornato: ${oldLevel} → ${newLevel}`);
            
            return true;
        }
        
        return false;
    }
    
    // Sblocca ricompensa
    unlockReward(rewardId) {
        console.log(`🎁 Ricompensa sbloccata: ${rewardId}`);
        // Implementa logica specifica per ogni ricompensa
    }
    
    // Genera suggerimenti AI
    async generateAISuggestions() {
        if (!this.aiEngine) return [];
        
        try {
            const userProfile = await this.getUserLifestyleProfile();
            const suggestions = this.aiEngine.generateSuggestions(
                userProfile,
                this.currentAvatar,
                this.progressionData
            );
            
            this.emitAvatarChanged('ai_suggestions_updated', { suggestions });
            console.log(`🤖 ${suggestions.length} suggerimenti AI generati`);
            
            return suggestions;
            
        } catch (error) {
            console.error('❌ Errore generazione suggerimenti AI:', error);
            return [];
        }
    }
    
    // Applica suggerimento AI
    async applySuggestion(suggestion) {
        try {
            switch (suggestion.action.type) {
                case 'apply_lifestyle_optimization':
                    await this.applyLifestyleOptimization(suggestion.action.data);
                    break;
                case 'add_progression_indicators':
                    this.addProgressionIndicators();
                    break;
                case 'unlock_consistency_aura':
                    this.unlockConsistencyAura();
                    break;
                default:
                    console.warn('Azione suggerimento non riconosciuta:', suggestion.action.type);
            }
            
            this.emitAvatarChanged('suggestion_applied', { suggestion });
            console.log(`✅ Suggerimento AI applicato: ${suggestion.title}`);
            
        } catch (error) {
            console.error('❌ Errore applicazione suggerimento:', error);
        }
    }
    
    // Salva avatar
    async saveAvatar() {
        try {
            const avatarData = {
                userId: this.currentUser,
                avatar: this.currentAvatar,
                timestamp: new Date().toISOString()
            };
            
            // Salva in localStorage (sostituire con Firebase in produzione)
            localStorage.setItem(`avatar_v2_${this.currentUser}`, JSON.stringify(avatarData));
            
            console.log('💾 Avatar V2.0 salvato');
            return true;
            
        } catch (error) {
            console.error('❌ Errore salvataggio avatar:', error);
            return false;
        }
    }
    
    // Carica avatar utente
    async loadUserAvatar() {
        try {
            const savedData = localStorage.getItem(`avatar_v2_${this.currentUser}`);
            
            if (savedData) {
                const data = JSON.parse(savedData);
                this.currentAvatar = { ...this.currentAvatar, ...data.avatar };
                console.log('✅ Avatar V2.0 caricato da storage');
            } else {
                console.log('📝 Nuovo avatar V2.0 creato');
            }
            
            return this.currentAvatar;
            
        } catch (error) {
            console.error('❌ Errore caricamento avatar:', error);
            return this.currentAvatar;
        }
    }
    
    // Carica dati progressione
    async loadProgressionData() {
        try {
            // Simula caricamento dati progressione (sostituire con vera API)
            this.progressionData = {
                weeksCompleted: 3,
                streak: 12,
                totalSessions: 45,
                achievements: ['first_week', 'consistency_bronze']
            };
            
            // Aggiorna livello basato sui progressi
            const newLevel = Math.min(this.progressionData.weeksCompleted + 1, AVATAR_V2_CONFIG.progressionLevels);
            this.updateProgressionLevel(newLevel);
            
        } catch (error) {
            console.error('❌ Errore caricamento dati progressione:', error);
        }
    }
    
    // Ottieni profilo lifestyle utente
    async getUserLifestyleProfile() {
        try {
            // Simula caricamento profilo lifestyle
            const savedProfile = localStorage.getItem(`lifestyle_profile_${this.currentUser}`);
            
            if (savedProfile) {
                return JSON.parse(savedProfile);
            }
            
            return null;
            
        } catch (error) {
            console.error('❌ Errore caricamento profilo lifestyle:', error);
            return null;
        }
    }
    
    // Setup event listeners
    setupEventListeners() {
        document.addEventListener('lifestyle_profile_updated', (event) => {
            this.applyLifestyleProfile(event.detail.profileType);
        });
        
        document.addEventListener('coaching_progress_updated', (event) => {
            this.loadProgressionData();
            this.generateAISuggestions();
        });
    }
    
    // Emetti evento cambio avatar
    emitAvatarChanged(eventType, data = {}) {
        const event = new CustomEvent('avatar_v2_changed', {
            detail: {
                type: eventType,
                avatar: this.currentAvatar,
                data: data,
                timestamp: new Date()
            }
        });
        
        document.dispatchEvent(event);
    }
    
    // Utility functions
    adjustColor(color, amount) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * amount);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    
    objectToCSS(obj) {
        return Object.entries(obj).map(([key, value]) => {
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${cssKey}: ${value}`;
        }).join('; ');
    }
}

// === 🎨 UI COMPONENTS V2.0 ===
class AvatarUIBuilder {
    constructor(avatarManager) {
        this.avatarManager = avatarManager;
    }
    
    // Crea interfaccia completa avatar builder
    createAvatarBuilder(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div class="avatar-builder-v2">
                <div class="builder-header">
                    <h2>🎨 Avatar Creator V2.0</h2>
                    <div class="mode-selector">
                        <button class="mode-btn ${this.avatarManager.currentAvatar.mode === 'cartoon' ? 'active' : ''}" 
                                data-mode="cartoon">
                            🎭 Cartoon
                        </button>
                        <button class="mode-btn ${this.avatarManager.currentAvatar.mode === 'photo' ? 'active' : ''}" 
                                data-mode="photo">
                            📷 Foto
                        </button>
                    </div>
                </div>
                
                <div class="builder-content">
                    <div class="avatar-preview-section">
                        <div class="avatar-display" id="avatarDisplay">
                            ${this.generateAvatarPreview()}
                        </div>
                        <div class="ai-suggestions" id="aiSuggestions">
                            <h4>🤖 Suggerimenti AI</h4>
                            <div class="suggestions-list"></div>
                        </div>
                    </div>
                    
                    <div class="customization-panel" id="customizationPanel">
                        ${this.generateCustomizationControls()}
                    </div>
                </div>
                
                <div class="builder-actions">
                    <button class="action-btn save-btn">💾 Salva Avatar</button>
                    <button class="action-btn random-btn">🎲 Randomizza</button>
                    <button class="action-btn reset-btn">🔄 Reset</button>
                </div>
            </div>
        `;
        
        this.setupUIEventListeners();
    }
    
    generateAvatarPreview() {
        if (this.avatarManager.currentAvatar.mode === 'cartoon') {
            return this.avatarManager.generateCartoonSVG();
        } else {
            return this.avatarManager.generatePhotoHTML();
        }
    }
    
    generateCustomizationControls() {
        const mode = this.avatarManager.currentAvatar.mode;
        
        if (mode === 'cartoon') {
            return this.generateCartoonControls();
        } else {
            return this.generatePhotoControls();
        }
    }
    
    generateCartoonControls() {
        return `
            <div class="control-section">
                <h4>👤 Forma Viso</h4>
                <div class="control-grid">
                    ${Object.keys(CARTOON_AVATAR_COMPONENTS.faceShapes).map(shape => 
                        `<button class="control-btn ${this.avatarManager.currentAvatar.cartoonConfig.faceShape === shape ? 'active' : ''}" 
                                data-control="faceShape" data-value="${shape}">
                            ${shape.charAt(0).toUpperCase() + shape.slice(1)}
                        </button>`
                    ).join('')}
                </div>
            </div>
            
            <div class="control-section">
                <h4>💇 Stile Capelli</h4>
                <div class="control-grid">
                    ${Object.keys(CARTOON_AVATAR_COMPONENTS.hairStyles).map(style => 
                        `<button class="control-btn ${this.avatarManager.currentAvatar.cartoonConfig.hairStyle === style ? 'active' : ''}" 
                                data-control="hairStyle" data-value="${style}">
                            ${style.replace('_', ' ').charAt(0).toUpperCase() + style.replace('_', ' ').slice(1)}
                        </button>`
                    ).join('')}
                </div>
            </div>
            
            <div class="control-section">
                <h4>👀 Stile Occhi</h4>
                <div class="control-grid">
                    ${Object.keys(CARTOON_AVATAR_COMPONENTS.eyeStyles).map(style => 
                        `<button class="control-btn ${this.avatarManager.currentAvatar.cartoonConfig.eyeStyle === style ? 'active' : ''}" 
                                data-control="eyeStyle" data-value="${style}">
                            ${style.charAt(0).toUpperCase() + style.slice(1)}
                        </button>`
                    ).join('')}
                </div>
            </div>
            
            <div class="control-section">
                <h4>😊 Espressione</h4>
                <div class="control-grid">
                    ${Object.keys(CARTOON_AVATAR_COMPONENTS.mouthExpressions).map(expr => 
                        `<button class="control-btn ${this.avatarManager.currentAvatar.cartoonConfig.mouthExpression === expr ? 'active' : ''}" 
                                data-control="mouthExpression" data-value="${expr}">
                            ${expr.charAt(0).toUpperCase() + expr.slice(1)}
                        </button>`
                    ).join('')}
                </div>
            </div>
            
            <div class="control-section">
                <h4>🎨 Colori</h4>
                <div class="color-controls">
                    <div class="color-group">
                        <label>Capelli</label>
                        <input type="color" data-control="hairColor" value="${this.avatarManager.currentAvatar.cartoonConfig.hairColor}">
                    </div>
                    <div class="color-group">
                        <label>Occhi</label>
                        <input type="color" data-control="eyeColor" value="${this.avatarManager.currentAvatar.cartoonConfig.eyeColor}">
                    </div>
                    <div class="color-group">
                        <label>Pelle</label>
                        <input type="color" data-control="skinTone" value="${this.avatarManager.currentAvatar.cartoonConfig.skinTone}">
                    </div>
                </div>
            </div>
        `;
    }
    
    generatePhotoControls() {
        return `
            <div class="photo-upload-section">
                <div class="upload-area" id="photoUploadArea">
                    <input type="file" id="photoFileInput" accept="image/*" style="display: none;">
                    <div class="upload-content">
                        <div class="upload-icon">📷</div>
                        <div class="upload-text">Clicca per caricare una foto</div>
                        <div class="upload-hint">JPG, PNG, WEBP - Max 5MB</div>
                    </div>
                </div>
            </div>
            
            <div class="control-section">
                <h4>🖼️ Cornice</h4>
                <div class="control-grid">
                    ${Object.keys(PHOTO_AVATAR_SYSTEM.frames).map(frame => 
                        `<button class="control-btn ${this.avatarManager.currentAvatar.photoConfig.frame === frame ? 'active' : ''}" 
                                data-control="frame" data-value="${frame}">
                            ${frame.charAt(0).toUpperCase() + frame.slice(1)}
                        </button>`
                    ).join('')}
                </div>
            </div>
            
            <div class="control-section">
                <h4>✨ Effetti</h4>
                <div class="slider-controls">
                    <div class="slider-group">
                        <label>Luminosità</label>
                        <input type="range" data-control="brightness" min="0.5" max="1.5" step="0.1" 
                               value="${this.avatarManager.currentAvatar.photoConfig.brightness}">
                    </div>
                    <div class="slider-group">
                        <label>Contrasto</label>
                        <input type="range" data-control="contrast" min="0.5" max="2" step="0.1" 
                               value="${this.avatarManager.currentAvatar.photoConfig.contrast}">
                    </div>
                    <div class="slider-group">
                        <label>Saturazione</label>
                        <input type="range" data-control="saturation" min="0" max="2" step="0.1" 
                               value="${this.avatarManager.currentAvatar.photoConfig.saturation}">
                    </div>
                </div>
            </div>
            
            <div class="control-section">
                <h4>🎨 Filtri Artistici</h4>
                <div class="control-grid">
                    ${Object.keys(PHOTO_AVATAR_SYSTEM.filters.artistic).map(filter => 
                        `<button class="control-btn" data-control="artisticFilter" data-value="${filter}">
                            ${filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    setupUIEventListeners() {
        // Mode switcher
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.avatarManager.switchAvatarMode(mode);
                this.updateUI();
            });
        });
        
        // Cartoon controls
        document.querySelectorAll('[data-control]').forEach(control => {
            const controlType = control.dataset.control;
            
            if (control.type === 'color' || control.type === 'range') {
                control.addEventListener('input', (e) => {
                    this.handleControlChange(controlType, e.target.value);
                });
            } else {
                control.addEventListener('click', (e) => {
                    this.handleControlChange(controlType, e.target.dataset.value);
                });
            }
        });
        
        // Photo upload
        const uploadArea = document.getElementById('photoUploadArea');
        const fileInput = document.getElementById('photoFileInput');
        
        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => {
                if (e.target.files[0]) {
                    this.avatarManager.uploadPhoto(e.target.files[0]);
                }
            });
        }
        
        // Action buttons
        document.querySelector('.save-btn')?.addEventListener('click', () => {
            this.avatarManager.saveAvatar();
        });
        
        document.querySelector('.random-btn')?.addEventListener('click', () => {
            this.randomizeAvatar();
        });
        
        document.querySelector('.reset-btn')?.addEventListener('click', () => {
            this.resetAvatar();
        });
    }
    
    handleControlChange(controlType, value) {
        if (this.avatarManager.currentAvatar.mode === 'cartoon') {
            this.avatarManager.updateCartoonConfig({ [controlType]: value });
        } else {
            this.avatarManager.updatePhotoConfig({ [controlType]: value });
        }
        
        this.updateAvatarPreview();
        this.updateActiveStates();
    }
    
    updateUI() {
        const customizationPanel = document.getElementById('customizationPanel');
        if (customizationPanel) {
            customizationPanel.innerHTML = this.generateCustomizationControls();
            this.setupUIEventListeners();
        }
        
        this.updateAvatarPreview();
        this.updateModeButtons();
    }
    
    updateAvatarPreview() {
        const avatarDisplay = document.getElementById('avatarDisplay');
        if (avatarDisplay) {
            avatarDisplay.innerHTML = this.generateAvatarPreview();
        }
    }
    
    updateModeButtons() {
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === this.avatarManager.currentAvatar.mode);
        });
    }
    
    updateActiveStates() {
        document.querySelectorAll('.control-btn').forEach(btn => {
            const control = btn.dataset.control;
            const value = btn.dataset.value;
            
            if (this.avatarManager.currentAvatar.mode === 'cartoon') {
                const isActive = this.avatarManager.currentAvatar.cartoonConfig[control] === value;
                btn.classList.toggle('active', isActive);
            }
        });
    }
    
    randomizeAvatar() {
        if (this.avatarManager.currentAvatar.mode === 'cartoon') {
            const randomConfig = this.generateRandomCartoonConfig();
            this.avatarManager.updateCartoonConfig(randomConfig);
        } else {
            const randomConfig = this.generateRandomPhotoConfig();
            this.avatarManager.updatePhotoConfig(randomConfig);
        }
        
        this.updateUI();
    }
    
    generateRandomCartoonConfig() {
        const components = CARTOON_AVATAR_COMPONENTS;
        
        return {
            faceShape: this.getRandomKey(components.faceShapes),
            hairStyle: this.getRandomKey(components.hairStyles),
            hairColor: this.getRandomColor(),
            eyeStyle: this.getRandomKey(components.eyeStyles),
            eyeColor: this.getRandomColor(),
            noseStyle: this.getRandomKey(components.noseStyles),
            mouthExpression: this.getRandomKey(components.mouthExpressions),
            skinTone: this.getRandomSkinTone()
        };
    }
    
    generateRandomPhotoConfig() {
        return {
            frame: this.getRandomKey(PHOTO_AVATAR_SYSTEM.frames),
            brightness: 0.8 + Math.random() * 0.4,
            contrast: 0.8 + Math.random() * 0.4,
            saturation: 0.8 + Math.random() * 0.4
        };
    }
    
    resetAvatar() {
        if (this.avatarManager.currentAvatar.mode === 'cartoon') {
            this.avatarManager.currentAvatar.cartoonConfig = this.avatarManager.getDefaultCartoonConfig();
        } else {
            this.avatarManager.currentAvatar.photoConfig = this.avatarManager.getDefaultPhotoConfig();
        }
        
        this.updateUI();
    }
    
    // Utility functions
    getRandomKey(obj) {
        const keys = Object.keys(obj);
        return keys[Math.floor(Math.random() * keys.length)];
    }
    
    getRandomColor() {
        const colors = ['#2D3748', '#4A5568', '#718096', '#A0AEC0', '#8B4513', '#2F1B14', '#FFD700', '#DC143C'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    getRandomSkinTone() {
        const tones = ['#F7FAFC', '#FDF2E9', '#FEF5E7', '#FFFAF0', '#FFF5F5'];
        return tones[Math.floor(Math.random() * tones.length)];
    }
}

// === 📊 AVATAR ANALYTICS V2.0 ===
class AvatarAnalyticsV2 {
    constructor(avatarManager) {
        this.avatarManager = avatarManager;
        this.events = [];
        this.startTime = new Date();
    }
    
    trackEvent(eventType, data = {}) {
        const event = {
            type: eventType,
            timestamp: new Date(),
            userId: this.avatarManager.currentUser,
            avatarMode: this.avatarManager.currentAvatar.mode,
            avatarLevel: this.avatarManager.currentAvatar.level,
            sessionId: this.generateSessionId(),
            data: data
        };
        
        this.events.push(event);
        this.processEvent(event);
        
        // Mantieni solo ultimi 200 eventi
        if (this.events.length > 200) {
            this.events = this.events.slice(-200);
        }
        
        console.log('📊 Avatar Analytics V2.0 - Event tracked:', eventType, data);
    }
    
    processEvent(event) {
        // Analisi automatica eventi per insights
        switch (event.type) {
            case 'customization_time_spent':
                this.analyzeCustomizationBehavior(event);
                break;
            case 'mode_switch':
                this.analyzeModeSwitchPattern(event);
                break;
            case 'ai_suggestion_applied':
                this.analyzeSuggestionEffectiveness(event);
                break;
        }
    }
    
    analyzeCustomizationBehavior(event) {
        const timeSpent = event.data.timeSpent;
        
        if (timeSpent > 1800000) { // 30+ minuti
            this.avatarManager.unlockAchievement('perfectionist');
        }
    }
    
    analyzeModeSwitchPattern(event) {
        const recentSwitches = this.events.filter(e => 
            e.type === 'mode_switch' && 
            (new Date() - e.timestamp) < 300000 // ultimi 5 minuti
        );
        
        if (recentSwitches.length >= 5) {
            this.avatarManager.unlockAchievement('style_explorer');
        }
    }
    
    analyzeSuggestionEffectiveness(event) {
        // Traccia efficacia suggerimenti AI
        const suggestionData = {
            suggestionId: event.data.suggestion?.id,
            applied: true,
            userSatisfaction: event.data.satisfaction || null
        };
        
        // Invia feedback al sistema AI
        this.avatarManager.aiEngine.processFeedback(suggestionData);
    }
    
    generateAnalyticsReport() {
        const now = new Date();
        const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const dailyEvents = this.events.filter(e => e.timestamp > dayAgo);
        const weeklyEvents = this.events.filter(e => e.timestamp > weekAgo);
        
        return {
            summary: {
                totalEvents: this.events.length,
                dailyActivity: dailyEvents.length,
                weeklyActivity: weeklyEvents.length,
                averageSessionLength: this.calculateAverageSessionLength(),
                mostUsedMode: this.getMostUsedMode(),
                customizationFrequency: this.getCustomizationFrequency()
            },
            
            engagement: {
                timeSpentCustomizing: this.getTotalCustomizationTime(),
                featuresUsed: this.getUniqueFeatures(),
                aiSuggestionsAccepted: this.getAISuggestionAcceptanceRate(),
                achievementsUnlocked: this.avatarManager.currentAvatar.achievements.length
            },
            
            preferences: {
                favoriteCartoonStyles: this.getFavoriteCartoonStyles(),
                preferredPhotoFilters: this.getPreferredPhotoFilters(),
                colorPreferences: this.getColorPreferences(),
                expressionPreferences: this.getExpressionPreferences()
            },
            
            progression: {
                currentLevel: this.avatarManager.currentAvatar.level,
                levelUpEvents: this.events.filter(e => e.type === 'level_up').length,
                streakData: this.calculateStreakData(),
                growthTrend: this.calculateGrowthTrend()
            }
        };
    }
    
    calculateAverageSessionLength() {
        // Calcola durata media sessioni
        const sessions = this.groupEventsBySessions();
        const sessionLengths = sessions.map(session => {
            const start = new Date(session[0].timestamp);
            const end = new Date(session[session.length - 1].timestamp);
            return end - start;
        });
        
        return sessionLengths.reduce((a, b) => a + b, 0) / sessionLengths.length;
    }
    
    getMostUsedMode() {
        const modeEvents = this.events.filter(e => e.avatarMode);
        const modeCount = {};
        
        modeEvents.forEach(event => {
            modeCount[event.avatarMode] = (modeCount[event.avatarMode] || 0) + 1;
        });
        
        return Object.entries(modeCount).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    }
    
    getCustomizationFrequency() {
        const customizationEvents = this.events.filter(e => 
            e.type.includes('customization') || e.type.includes('updated')
        );
        
        return customizationEvents.length / Math.max(1, this.events.length);
    }
    
    getTotalCustomizationTime() {
        return this.events
            .filter(e => e.type === 'customization_time_spent')
            .reduce((total, event) => total + (event.data.timeSpent || 0), 0);
    }
    
    getUniqueFeatures() {
        const featureEvents = this.events.filter(e => e.data.feature);
        const uniqueFeatures = [...new Set(featureEvents.map(e => e.data.feature))];
        return uniqueFeatures.length;
    }
    
    getAISuggestionAcceptanceRate() {
        const suggestionEvents = this.events.filter(e => e.type.includes('suggestion'));
        const acceptedSuggestions = suggestionEvents.filter(e => e.type === 'suggestion_applied');
        
        return suggestionEvents.length > 0 ? acceptedSuggestions.length / suggestionEvents.length : 0;
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    groupEventsBySessions() {
        // Raggruppa eventi per sessioni (gap > 30 minuti = nuova sessione)
        const sessions = [];
        let currentSession = [];
        
        this.events.forEach((event, index) => {
            if (index === 0) {
                currentSession.push(event);
                return;
            }
            
            const prevEvent = this.events[index - 1];
            const timeDiff = event.timestamp - prevEvent.timestamp;
            
            if (timeDiff > 1800000) { // 30 minuti
                sessions.push(currentSession);
                currentSession = [event];
            } else {
                currentSession.push(event);
            }
        });
        
        if (currentSession.length > 0) {
            sessions.push(currentSession);
        }
        
        return sessions;
    }
}

// === 🎯 INTEGRATION UTILITIES ===
class AvatarIntegrationUtils {
    static async integrateWithLifestyleCoaching(avatarManager, lifestyleData) {
        try {
            // Applica profilo lifestyle all'avatar
            if (lifestyleData.profileType) {
                await avatarManager.applyLifestyleProfile(lifestyleData.profileType);
            }
            
            // Aggiorna progressione basata sui risultati coaching
            if (lifestyleData.weeksCompleted) {
                const newLevel = Math.min(lifestyleData.weeksCompleted + 1, AVATAR_V2_CONFIG.progressionLevels);
                avatarManager.updateProgressionLevel(newLevel);
            }
            
            // Genera suggerimenti contestuali
            await avatarManager.generateAISuggestions();
            
            console.log('✅ Avatar integrato con sistema coaching');
            return true;
            
        } catch (error) {
            console.error('❌ Errore integrazione avatar-coaching:', error);
            return false;
        }
    }
    
    static generateAvatarWidget(avatarManager, size = 'medium') {
        const sizes = {
            small: { width: 60, height: 60 },
            medium: { width: 100, height: 100 },
            large: { width: 150, height: 150 }
        };
        
        const dimensions = sizes[size] || sizes.medium;
        
        const widget = document.createElement('div');
        widget.className = `avatar-widget avatar-widget-${size}`;
        widget.style.cssText = `
            width: ${dimensions.width}px;
            height: ${dimensions.height}px;
            border-radius: 50%;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            position: relative;
        `;
        
        // Contenuto avatar
        if (avatarManager.currentAvatar.mode === 'cartoon') {
            widget.innerHTML = avatarManager.generateCartoonSVG();
        } else {
            widget.innerHTML = avatarManager.generatePhotoHTML();
        }
        
        // Aggiungi indicatori progressione
        if (avatarManager.currentAvatar.level > 1) {
            const levelBadge = document.createElement('div');
            levelBadge.className = 'level-badge';
            levelBadge.textContent = avatarManager.currentAvatar.level;
            levelBadge.style.cssText = `
                position: absolute;
                top: -5px;
                right: -5px;
                background: linear-gradient(45deg, #f59e0b, #d97706);
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-weight: bold;
                border: 2px solid white;
            `;
            widget.appendChild(levelBadge);
        }
        
        // Hover effects
        widget.addEventListener('mouseenter', () => {
            widget.style.transform = 'scale(1.05)';
            widget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
        });
        
        widget.addEventListener('mouseleave', () => {
            widget.style.transform = 'scale(1)';
            widget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        });
        
        return widget;
    }
    
    static createProgressionVisualizer(avatarManager) {
        const container = document.createElement('div');
        container.className = 'avatar-progression-visualizer';
        
        const currentLevel = avatarManager.currentAvatar.level;
        const maxLevel = AVATAR_V2_CONFIG.progressionLevels;
        const progress = (currentLevel / maxLevel) * 100;
        
        container.innerHTML = `
            <div class="progression-header">
                <h4>🚀 Progressione Avatar</h4>
                <span class="level-indicator">Livello ${currentLevel}/${maxLevel}</span>
            </div>
            
            <div class="progression-bar">
                <div class="progression-fill" style="width: ${progress}%"></div>
            </div>
            
            <div class="progression-milestones">
                ${Array.from({ length: maxLevel }, (_, i) => {
                    const level = i + 1;
                    const isUnlocked = level <= currentLevel;
                    const levelData = AVATAR_PROGRESSION_SYSTEM.levels[level];
                    
                    return `
                        <div class="milestone ${isUnlocked ? 'unlocked' : 'locked'}" 
                             title="${levelData ? levelData.name : `Livello ${level}`}">
                            <div class="milestone-dot"></div>
                            <div class="milestone-label">${level}</div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div class="next-unlock">
                ${currentLevel < maxLevel ? `
                    <p>🎯 Prossimo sblocco: <strong>${AVATAR_PROGRESSION_SYSTEM.levels[currentLevel + 1]?.name}</strong></p>
                    <p class="unlock-requirement">${AVATAR_PROGRESSION_SYSTEM.levels[currentLevel + 1]?.unlock}</p>
                ` : `
                    <p>🏆 <strong>Livello Massimo Raggiunto!</strong></p>
                    <p>Sei un vero maestro dell'avatar!</p>
                `}
            </div>
        `;
        
        return container;
    }
    
    static createAchievementGallery(avatarManager) {
        const container = document.createElement('div');
        container.className = 'achievement-gallery';
        
        const userAchievements = avatarManager.currentAvatar.achievements;
        const allAchievements = AVATAR_PROGRESSION_SYSTEM.achievements;
        
        container.innerHTML = `
            <div class="gallery-header">
                <h4>🏆 Achievement Gallery</h4>
                <span class="achievement-count">${userAchievements.length}/${Object.keys(allAchievements).length}</span>
            </div>
            
            <div class="achievement-grid">
                ${Object.entries(allAchievements).map(([id, achievement]) => {
                    const isUnlocked = userAchievements.includes(id);
                    
                    return `
                        <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                            <div class="achievement-icon">${isUnlocked ? '🏆' : '🔒'}</div>
                            <div class="achievement-info">
                                <h5>${achievement.name}</h5>
                                <p>${achievement.description}</p>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        return container;
    }
}

// === 🎨 CSS STYLES V2.0 ===
const AVATAR_V2_STYLES = `
<style>
.avatar-builder-v2 {
    max-width: 1200px;
    margin: 0 auto;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    padding: 2rem;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.builder-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.2);
}

.builder-header h2 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 600;
}

.mode-selector {
    display: flex;
    gap: 0.5rem;
    background: rgba(255,255,255,0.1);
    padding: 0.25rem;
    border-radius: 25px;
}

.mode-btn {
    background: transparent;
    border: none;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
}

.mode-btn.active {
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(10px);
}

.mode-btn:hover {
    background: rgba(255,255,255,0.15);
}

.builder-content {
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
}

.avatar-preview-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.avatar-display {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.avatar-display svg {
    width: 100%;
    max-width: 300px;
    height: auto;
}

.ai-suggestions {
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 1.5rem;
    border: 1px solid rgba(255,255,255,0.2);
}

.ai-suggestions h4 {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
}

.suggestions-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.suggestion-item {
    background: rgba(255,255,255,0.1);
    padding: 1rem;
    border-radius: 10px;
    border-left: 4px solid #fbbf24;
    cursor: pointer;
    transition: all 0.3s ease;
}

.suggestion-item:hover {
    background: rgba(255,255,255,0.2);
    transform: translateX(5px);
}

.suggestion-title {
    font-weight: 600;
    margin-bottom: 0.25rem;
}

.suggestion-description {
    font-size: 0.9rem;
    opacity: 0.9;
}

.customization-panel {
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 1.5rem;
    border: 1px solid rgba(255,255,255,0.2);
    max-height: 600px;
    overflow-y: auto;
}

.control-section {
    margin-bottom: 2rem;
}

.control-section h4 {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.control-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.5rem;
}

.control-btn {
    background: rgba(255,255,255,0.1);
    border: 2px solid rgba(255,255,255,0.2);
    color: white;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    text-align: center;
}

.control-btn:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-1px);
}

.control-btn.active {
    background: linear-gradient(135deg, #ea580c, #f97316);
    border-color: #ea580c;
    box-shadow: 0 4px 15px rgba(234, 88, 12, 0.4);
}

.color-controls {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}

.color-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.color-group label {
    font-size: 0.9rem;
    font-weight: 500;
}

.color-group input[type="color"] {
    width: 100%;
    height: 40px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.slider-controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.slider-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.slider-group label {
    font-size: 0.9rem;
    font-weight: 500;
}

.slider-group input[type="range"] {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: rgba(255,255,255,0.2);
    outline: none;
    cursor: pointer;
}

.photo-upload-section {
    margin-bottom: 2rem;
}

.upload-area {
    border: 2px dashed rgba(255,255,255,0.4);
    border-radius: 15px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.upload-area:hover {
    border-color: rgba(255,255,255,0.6);
    background: rgba(255,255,255,0.05);
}

.upload-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.upload-text {
    font-size: 1.1rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.upload-hint {
    font-size: 0.9rem;
    opacity: 0.7;
}

.builder-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.action-btn {
    background: linear-gradient(135deg, #ea580c, #f97316);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(234, 88, 12, 0.4);
}

.action-btn.random-btn {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.action-btn.random-btn:hover {
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
}

.action-btn.reset-btn {
    background: linear-gradient(135deg, #6b7280, #4b5563);
}

.action-btn.reset-btn:hover {
    box-shadow: 0 8px 25px rgba(107, 114, 128, 0.4);
}

.photo-avatar-container {
    position: relative;
    width: 100%;
    height: 300px;
    overflow: hidden;
}

.photo-overlay {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 0.5rem;
}

.level-badge {
    background: linear-gradient(45deg, #f59e0b, #d97706);
    color: white;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: bold;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.achievement-indicator {
    background: linear-gradient(45deg, #10b981, #059669);
    color: white;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

/* Responsive Design */
@media (max-width: 768px) {
    .builder-content {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    
    .builder-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .control-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .color-controls {
        grid-template-columns: 1fr;
    }
    
    .builder-actions {
        flex-direction: column;
    }
}

/* Avatar Widget Styles */
.avatar-widget {
    transition: all 0.3s ease;
    border: 3px solid rgba(255,255,255,0.3);
}

.avatar-widget:hover {
    border-color: rgba(255,255,255,0.6);
}

.avatar-widget svg {
    width: 100%;
    height: 100%;
}

/* Progression Visualizer */
.avatar-progression-visualizer {
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 1.5rem;
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
}

.progression-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.progression-header h4 {
    margin: 0;
    font-size: 1.1rem;
}

.level-indicator {
    background: rgba(255,255,255,0.2);
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.9rem;
    font-weight: 500;
}

.progression-bar {
    background: rgba(255,255,255,0.2);
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 1.5rem;
}

.progression-fill {
    background: linear-gradient(90deg, #10b981, #34d399);
    height: 100%;
    border-radius: 4px;
    transition: width 0.5s ease;
}

.progression-milestones {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.5rem;
}

.milestone {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
}

.milestone-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255,255,255,0.3);
    transition: all 0.3s ease;
}

.milestone.unlocked .milestone-dot {
    background: linear-gradient(45deg, #10b981, #34d399);
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.milestone-label {
    font-size: 0.7rem;
    font-weight: 500;
}

.next-unlock {
    text-align: center;
    padding-top: 1rem;
    border-top: 1px solid rgba(255,255,255,0.2);
}

.next-unlock p {
    margin: 0.5rem 0;
}

.unlock-requirement {
    font-size: 0.9rem;
    opacity: 0.8;
    font-style: italic;
}

/* Achievement Gallery */
.achievement-gallery {
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 1.5rem;
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
}

.gallery-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.gallery-header h4 {
    margin: 0;
    font-size: 1.1rem;
}

.achievement-count {
    background: rgba(255,255,255,0.2);
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.9rem;
    font-weight: 500;
}

.achievement-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

.achievement-card {
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
}

.achievement-card.unlocked {
    background: rgba(16, 185, 129, 0.2);
    border: 1px solid rgba(16, 185, 129, 0.3);
}

.achievement-card.locked {
    opacity: 0.6;
}

.achievement-icon {
    font-size: 1.5rem;
}

.achievement-info h5 {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
    font-weight: 600;
}

.achievement-info p {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.9;
}
</style>
`;

// === 🚀 MAIN INITIALIZATION FUNCTION ===
async function initializeEnhancedAvatarSystemV2(userId, lifestyleProfile = null) {
    try {
        console.log('🚀 Inizializzazione Enhanced Avatar System V2.0...');
        
        // Aggiungi stili CSS
        if (!document.getElementById('avatar-v2-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'avatar-v2-styles';
            styleElement.textContent = AVATAR_V2_STYLES.replace(/<\/?style>/g, '');
            document.head.appendChild(styleElement);
        }
        
        // Inizializza manager
        const avatarManager = new EnhancedAvatarManagerV2();
        await avatarManager.initialize(userId, lifestyleProfile);
        
        // Inizializza analytics
        const analytics = new AvatarAnalyticsV2(avatarManager);
        
        // Inizializza UI builder
        const uiBuilder = new AvatarUIBuilder(avatarManager);
        
        // Esponi API globale
        window.EnhancedAvatarSystemV2 = {
            manager: avatarManager,
            analytics: analytics,
            uiBuilder: uiBuilder,
            utils: AvatarIntegrationUtils,
            config: AVATAR_V2_CONFIG,
            profiles: LIFESTYLE_AVATAR_PROFILES
        };
        
        console.log('✅ Enhanced Avatar System V2.0 inizializzato con successo!');
        
        // Genera evento di inizializzazione
        document.dispatchEvent(new CustomEvent('avatar_system_v2_ready', {
            detail: { avatarManager, analytics, uiBuilder }
        }));
        
        return {
            success: true,
            manager: avatarManager,
            analytics: analytics,
            uiBuilder: uiBuilder
        };
        
    } catch (error) {
        console.error('❌ Errore inizializzazione Enhanced Avatar System V2.0:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// === 📤 EXPORTS ===
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EnhancedAvatarManagerV2,
        AvatarUIBuilder,
        AvatarAnalyticsV2,
        AvatarIntegrationUtils,
        initializeEnhancedAvatarSystemV2,
        AVATAR_V2_CONFIG,
        LIFESTYLE_AVATAR_PROFILES,
        CARTOON_AVATAR_COMPONENTS,
        PHOTO_AVATAR_SYSTEM,
        AVATAR_PROGRESSION_SYSTEM
    };
}

console.log('🎨 Enhanced Avatar System V2.0 caricato - Sistema completo con AI integration disponibile!');