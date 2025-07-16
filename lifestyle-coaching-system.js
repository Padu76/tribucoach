// lifestyle-coaching-system.js - Sistema completo basato su percorso fitness coaching
// Integra tutti i materiali: 40 leve, matrice decisionale, livelli coscienza, quiz assessment

// === STRUTTURA PERCORSO COACHING ===
const COACHING_PHASES = {
    1: {
        name: "INCONTRO CONOSCITIVO",
        objective: "Presentazione del percorso e raccolta informazioni",
        duration: "60 minuti",
        activities: ["storia_focalizzata", "valutazione_situazione", "report_chiusura"]
    },
    2: {
        name: "CONSAPEVOLEZZA DI SÉ",
        objective: "Prendere consapevolezza e scoprire motivazioni profonde",
        duration: "45 minuti",
        activities: ["test_autostima", "consapevolezza_presente", "valori_conflitto"]
    },
    3: {
        name: "SETTARE OBIETTIVI",
        objective: "Definire obiettivi SMART e realistici",
        duration: "45 minuti",
        activities: ["goal_setting", "obiettivi_smart", "piano_mensile"]
    },
    4: {
        name: "PIANO DI AZIONE",
        objective: "Creare piano concreto e trovare alleati",
        duration: "45 minuti",
        activities: ["autoefficacia", "alleanze", "incrocio_azione"]
    },
    5: {
        name: "ABITUDINI",
        objective: "Identificare abitudini limitanti e crearne di nuove",
        duration: "45 minuti",
        activities: ["prospettiva_diversa", "abitudini_nuove", "stile_vita_ideale"]
    },
    6: {
        name: "POTENZIALITÀ",
        objective: "Scoprire e valorizzare i propri talenti",
        duration: "45 minuti",
        activities: ["test_creativita", "gratificazioni", "potenzialita_individuali"]
    },
    7: {
        name: "AUTOSTIMA",
        objective: "Consolidare autostima e tecniche di crescita",
        duration: "45 minuti",
        activities: ["tecnica_scalatore", "test_autostima_finale", "allenamento_quotidiano"]
    }
};

// === PERSONALIZZAZIONE PER QUADRANTI ===
const QUADRANT_STRATEGIES = {
    "Q1": {
        name: "Coaching Opzionale",
        description: "Competente tecnicamente e emotivamente",
        approach: "Ottimizzazione e performance avanzate",
        focus: ["perfezionamento", "sfide_avanzate", "leadership"],
        communication_style: "Consulenza tra pari, suggerimenti avanzati",
        sessions_frequency: "Mensile o su richiesta",
        materials: {
            phase_1: {
                questions: [
                    "Quali sono i tuoi standard di eccellenza attuali?",
                    "Dove vedi margini di ottimizzazione?",
                    "Quali sfide ti motivano di più?"
                ],
                exercises: ["analisi_performance", "benchmarking_personale"],
                homework: "Identifica 3 aree di micro-miglioramento"
            },
            phase_2: {
                questions: [
                    "Cosa ti spinge oltre la zona comfort?",
                    "Come mantieni la motivazione ai massimi livelli?",
                    "Quali sono i tuoi driver di crescita?"
                ],
                exercises: ["mappa_motivazioni_avanzate", "valori_eccellenza"],
                homework: "Definisci la tua vision di eccellenza"
            },
            phase_3: {
                questions: [
                    "Quali obiettivi ti sembrano impossibili ma affascinanti?",
                    "Come strutturi le tue sfide per mantenerle stimolanti?",
                    "Qual è il tuo next level?"
                ],
                exercises: ["goal_setting_avanzato", "reverse_engineering"],
                homework: "Crea un piano di crescita esponenziale"
            }
        }
    },
    "Q2": {
        name: "Training Tecnico",
        description: "Forte gestione emotiva, competenze tecniche da sviluppare",
        approach: "Skill building e competenze pratiche",
        focus: ["competenze_tecniche", "procedure_strutturate", "learning_system"],
        communication_style: "Istruttore esperto, step-by-step",
        sessions_frequency: "Settimanale",
        materials: {
            phase_1: {
                questions: [
                    "Quali competenze specifiche vuoi sviluppare?",
                    "Cosa ti blocca nell'apprendimento pratico?",
                    "Quale supporto tecnico ti serve?"
                ],
                exercises: ["skill_gap_analysis", "learning_style_assessment"],
                homework: "Identifica le 5 competenze chiave da sviluppare"
            },
            phase_2: {
                questions: [
                    "Come apprendi meglio le nuove competenze?",
                    "Quali sono i tuoi punti di forza nell'apprendimento?",
                    "Dove trovi le migliori risorse?"
                ],
                exercises: ["mappa_learning_path", "risorse_apprendimento"],
                homework: "Crea il tuo sistema di apprendimento personale"
            },
            phase_3: {
                questions: [
                    "Quali micro-obiettivi tecnici puoi raggiungere questa settimana?",
                    "Come misuri i tuoi progressi pratici?",
                    "Qual è il tuo prossimo milestone tecnico?"
                ],
                exercises: ["micro_goals_tecnici", "tracking_system"],
                homework: "Implementa il tuo primo skill building project"
            }
        }
    },
    "Q3": {
        name: "Coaching Emotivo",
        description: "Competenze tecniche buone, gestione emotiva da sviluppare",
        approach: "Mindset, motivazione e resilienza emotiva",
        focus: ["gestione_emozioni", "motivazione_interna", "resilienza"],
        communication_style: "Coach motivazionale, supporto emotivo",
        sessions_frequency: "Settimanale con check-in",
        materials: {
            phase_1: {
                questions: [
                    "Quali emozioni ti limitano di più?",
                    "Quando ti senti più vulnerabile emotivamente?",
                    "Cosa ti aiuta a ritrovare equilibrio?"
                ],
                exercises: ["emotional_audit", "trigger_mapping"],
                homework: "Tieni un diario emotivo per una settimana"
            },
            phase_2: {
                questions: [
                    "Qual è la tua fonte di motivazione più profonda?",
                    "Come reagisci agli ostacoli emotivi?",
                    "Quali sono i tuoi pattern emotivi ricorrenti?"
                ],
                exercises: ["core_motivation_discovery", "emotional_patterns"],
                homework: "Pratica 10 minuti di mindfulness quotidiana"
            },
            phase_3: {
                questions: [
                    "Come vuoi sentirti tra 3 mesi?",
                    "Quali abitudini emotive vuoi cambiare?",
                    "Qual è il tuo sistema di supporto emotivo?"
                ],
                exercises: ["emotional_goals", "support_system_mapping"],
                homework: "Implementa 3 rituali di benessere emotivo"
            }
        }
    },
    "Q4": {
        name: "Coaching Completo",
        description: "Bisogno di supporto sia tecnico che emotivo",
        approach: "Approccio olistico e supporto completo",
        focus: ["fondamenta_solide", "supporto_continuo", "crescita_graduale"],
        communication_style: "Mentor paziente, guida passo-passo",
        sessions_frequency: "Bisettimanale con supporto continuo",
        materials: {
            phase_1: {
                questions: [
                    "Da dove vuoi iniziare il tuo cambiamento?",
                    "Qual è la tua più grande sfida attuale?",
                    "Di che tipo di supporto hai bisogno?"
                ],
                exercises: ["assessment_completo", "priorita_cambiamento"],
                homework: "Scegli UN'area di focus per iniziare"
            },
            phase_2: {
                questions: [
                    "Come ti senti quando pensi al cambiamento?",
                    "Quali sono le tue paure principali?",
                    "Cosa ti darebbe più fiducia?"
                ],
                exercises: ["fear_audit", "confidence_building"],
                homework: "Fai una piccola azione di crescita ogni giorno"
            },
            phase_3: {
                questions: [
                    "Qual è il primo piccolo obiettivo che vuoi raggiungere?",
                    "Come posso supportarti meglio?",
                    "Cosa ti fa sentire orgoglioso di te?"
                ],
                exercises: ["micro_goals", "support_plan"],
                homework: "Celebra ogni piccolo successo quotidiano"
            }
        }
    }
};

// === PERSONALIZZAZIONE PER LIVELLI DI COSCIENZA ===
const CONSCIOUSNESS_LEVELS = {
    "Opportunista": {
        communication: "Risultati immediati e gratificazioni tangibili",
        motivators: ["benefici_immediati", "ricompense_veloci", "cambiamenti_visibili"],
        language: "Concreto, diretto, orientato al risultato",
        examples: "Vedrai risultati in 7 giorni", "Guadagnerai tempo subito",
        session_structure: "Focus su wins veloci e progressi misurabili",
        homework_style: "Azioni immediate con feedback rapido"
    },
    "Conformista": {
        communication: "Struttura chiara, regole e tradizioni",
        motivators: ["sicurezza", "struttura", "approvazione_sociale"],
        language: "Metodico, strutturato, rassicurante",
        examples: "Seguiamo un metodo provato", "Questo approccio è testato",
        session_structure: "Agenda chiara, step definiti, procedure",
        homework_style: "Checklist dettagliate e istruzioni precise"
    },
    "Achiever": {
        communication: "Successo, performance e risultati misurabili",
        motivators: ["performance", "competizione", "riconoscimento"],
        language: "Orientato al successo, metriche, sfide",
        examples: "Raggiungiamo l'eccellenza", "Supera i tuoi record",
        session_structure: "KPI, obiettivi sfidanti, benchmarking",
        homework_style: "Progetti sfidanti con metriche di successo"
    },
    "Pluralista": {
        communication: "Crescita personale, benessere e comunità",
        motivators: ["crescita_personale", "benessere", "impatto_sociale"],
        language: "Olistico, empatico, orientato al benessere",
        examples: "Cresciamo insieme", "Il tuo benessere è importante",
        session_structure: "Approccio olistico, ascolto profondo",
        homework_style: "Riflessioni, pratiche di benessere, crescita"
    }
};

// === INTEGRAZIONE CON 40 LEVE MOTIVAZIONALI ===
const MOTIVATIONAL_LEVERS = {
    "GUADAGNARE": {
        triggers: ["salute", "tempo", "soldi", "popolarità", "migliorare_apparenza", 
                  "sicurezza", "lode", "comfort", "piacere", "orgoglio", "avanzamento", 
                  "divertimento", "fiducia", "prestigio"],
        application: "Utilizzare nelle fasi di goal setting e motivazione"
    },
    "ESSERE": {
        triggers: ["buoni_genitori", "socievoli", "aggiornati", "creativi", "orgogliosi", 
                  "influenti", "appartenere", "efficienti", "primi", "autorità"],
        application: "Utilizzare per definire identità e valori"
    },
    "FARE": {
        triggers: ["esprimere_personalità", "resistere_dominazione", "soddisfare_curiosità", 
                  "emulare", "apprezzare_bellezza", "acquisire", "vincere_affetto", "migliorarsi"],
        application: "Utilizzare per definire azioni e comportamenti"
    },
    "RISPARMIARE": {
        triggers: ["tempo", "soldi", "lavoro", "sconforto", "preoccupazioni", 
                  "dubbi", "rischi", "imbarazzo"],
        application: "Utilizzare per superare obiezioni e resistenze"
    }
};

// === GENERATORE DI CONTENUTI PERSONALIZZATI ===
function generatePersonalizedContent(userProfile) {
    const { quadrant, consciousnessLevel, motivationDrivers, challenges, readinessLevel } = userProfile;
    
    // Seleziona strategia quadrante
    const quadrantStrategy = QUADRANT_STRATEGIES[quadrant.split(':')[0]];
    
    // Seleziona approccio livello coscienza
    const consciousnessApproach = CONSCIOUSNESS_LEVELS[consciousnessLevel.split(' -')[0]];
    
    // Genera contenuto personalizzato
    const personalizedContent = {
        welcomeMessage: generateWelcomeMessage(quadrantStrategy, consciousnessApproach),
        sessionPlans: generateSessionPlans(quadrantStrategy, consciousnessApproach, userProfile),
        homeworkTasks: generateHomeworkTasks(quadrantStrategy, consciousnessApproach, motivationDrivers),
        motivationalMessages: generateMotivationalMessages(consciousnessApproach, motivationDrivers),
        progressTracking: generateProgressTracking(quadrantStrategy, userProfile)
    };
    
    return personalizedContent;
}

function generateWelcomeMessage(quadrantStrategy, consciousnessApproach) {
    const baseMessage = `Benvenuto nel tuo percorso di ${quadrantStrategy.name}! `;
    const personalizedApproach = `Il mio approccio con te sarà: ${consciousnessApproach.communication}. `;
    const nextSteps = `Inizieremo con ${quadrantStrategy.focus[0]} per darti ${consciousnessApproach.motivators[0]}.`;
    
    return baseMessage + personalizedApproach + nextSteps;
}

function generateSessionPlans(quadrantStrategy, consciousnessApproach, userProfile) {
    const sessionPlans = [];
    
    // Genera piano per ogni fase
    Object.entries(COACHING_PHASES).forEach(([phaseNum, phase]) => {
        const quadrantMaterials = quadrantStrategy.materials[`phase_${phaseNum}`] || {};
        
        const sessionPlan = {
            phase: parseInt(phaseNum),
            title: phase.name,
            objective: phase.objective,
            duration: phase.duration,
            approach: consciousnessApproach.session_structure,
            questions: quadrantMaterials.questions || [],
            exercises: quadrantMaterials.exercises || [],
            homework: quadrantMaterials.homework || "",
            personalizedNotes: generatePersonalizedNotes(userProfile, phase)
        };
        
        sessionPlans.push(sessionPlan);
    });
    
    return sessionPlans;
}

function generateHomeworkTasks(quadrantStrategy, consciousnessApproach, motivationDrivers) {
    const homeworkStyle = consciousnessApproach.homework_style;
    const focus = quadrantStrategy.focus;
    
    const homeworkTasks = [];
    
    // Genera compiti basati su driver motivazionali
    motivationDrivers.forEach(driver => {
        const lever = findMotivationalLever(driver);
        if (lever) {
            homeworkTasks.push({
                title: `Lavoro su ${driver}`,
                description: `Compito personalizzato per ${driver}`,
                style: homeworkStyle,
                motivationalLever: lever,
                timeframe: getTimeframeForConsciousness(consciousnessApproach)
            });
        }
    });
    
    return homeworkTasks;
}

function generateMotivationalMessages(consciousnessApproach, motivationDrivers) {
    const messages = [];
    const language = consciousnessApproach.language;
    
    motivationDrivers.forEach(driver => {
        const message = {
            trigger: driver,
            content: `${consciousnessApproach.examples} - Lavoriamo su ${driver}`,
            timing: "Quando serve motivazione per " + driver,
            language: language
        };
        messages.push(message);
    });
    
    return messages;
}

function generateProgressTracking(quadrantStrategy, userProfile) {
    const trackingSystem = {
        frequency: quadrantStrategy.sessions_frequency,
        metrics: [],
        milestones: [],
        reportingStyle: ""
    };
    
    // Genera metriche basate su punteggi del profilo
    Object.entries(userProfile.scores || {}).forEach(([area, score]) => {
        trackingSystem.metrics.push({
            area: area,
            currentScore: score,
            targetScore: Math.min(score + 1, 5),
            trackingMethod: getTrackingMethod(area, quadrantStrategy)
        });
    });
    
    return trackingSystem;
}

// === UTILITY FUNCTIONS ===
function findMotivationalLever(driver) {
    for (const [category, levers] of Object.entries(MOTIVATIONAL_LEVERS)) {
        if (levers.triggers.includes(driver)) {
            return { category, application: levers.application };
        }
    }
    return null;
}

function getTimeframeForConsciousness(consciousnessApproach) {
    const timeframes = {
        "Opportunista": "1-3 giorni",
        "Conformista": "1 settimana",
        "Achiever": "1-2 settimane",
        "Pluralista": "2-4 settimane"
    };
    
    return timeframes[consciousnessApproach.communication] || "1 settimana";
}

function getTrackingMethod(area, quadrantStrategy) {
    const methods = {
        "wellbeing": "Scala autovalutazione quotidiana",
        "health": "Metriche fisiche e energie",
        "professional": "Soddisfazione lavorativa settimanale",
        "social": "Qualità relazioni mensile"
    };
    
    return methods[area] || "Autovalutazione periodica";
}

function generatePersonalizedNotes(userProfile, phase) {
    const notes = [];
    
    // Aggiungi note basate su sfide
    if (userProfile.challenges) {
        userProfile.challenges.forEach(challenge => {
            if (isRelevantForPhase(challenge, phase)) {
                notes.push(`Focus su ${challenge} durante ${phase.name}`);
            }
        });
    }
    
    // Aggiungi note basate su readiness level
    if (userProfile.readinessLevel < 3) {
        notes.push("Utente con bassa readiness - necessario supporto extra");
    } else if (userProfile.readinessLevel >= 4) {
        notes.push("Utente molto motivato - può gestire sfide maggiori");
    }
    
    return notes;
}

function isRelevantForPhase(challenge, phase) {
    const relevanceMap = {
        "procrastination": ["PIANO DI AZIONE", "ABITUDINI"],
        "low_energy": ["CONSAPEVOLEZZA DI SÉ", "ABITUDINI"],
        "anxiety": ["CONSAPEVOLEZZA DI SÉ", "AUTOSTIMA"],
        "low_self_esteem": ["AUTOSTIMA", "POTENZIALITÀ"]
    };
    
    return relevanceMap[challenge]?.includes(phase.name) || false;
}

// === SISTEMA DI DELIVERY DEI CONTENUTI ===
class LifestyleCoachingSystem {
    constructor(userProfile) {
        this.userProfile = userProfile;
        this.personalizedContent = generatePersonalizedContent(userProfile);
        this.currentPhase = 1;
        this.completedPhases = [];
    }
    
    getCurrentPhaseContent() {
        return this.personalizedContent.sessionPlans.find(
            session => session.phase === this.currentPhase
        );
    }
    
    getNextHomework() {
        const currentSession = this.getCurrentPhaseContent();
        return {
            ...currentSession,
            homework: this.personalizedContent.homeworkTasks.find(
                task => task.title.includes(currentSession.title)
            )
        };
    }
    
    getMotivationalMessage(trigger) {
        return this.personalizedContent.motivationalMessages.find(
            msg => msg.trigger === trigger
        );
    }
    
    advanceToNextPhase() {
        this.completedPhases.push(this.currentPhase);
        this.currentPhase++;
        return this.currentPhase <= 7;
    }
    
    getProgressReport() {
        const completed = this.completedPhases.length;
        const total = 7;
        const progressPercentage = (completed / total) * 100;
        
        return {
            completed,
            total,
            progressPercentage,
            currentPhase: this.currentPhase,
            nextMilestone: COACHING_PHASES[this.currentPhase]?.name || "Percorso completato",
            trackingMetrics: this.personalizedContent.progressTracking.metrics
        };
    }
}

// === EXPORT PRINCIPALE ===
export {
    COACHING_PHASES,
    QUADRANT_STRATEGIES,
    CONSCIOUSNESS_LEVELS,
    MOTIVATIONAL_LEVERS,
    generatePersonalizedContent,
    LifestyleCoachingSystem
};

console.log('🎯 Sistema Lifestyle Coaching caricato - 7 fasi integrate con personalizzazione completa!');