// 🔥 MOTIVATION SYSTEM - TRIBUCOACH
// Sistema motivazionale avanzato per sostegno psicologico e mentale

class MotivationSystem {
    constructor() {
        this.initializeMotivationalProfiles();
        this.initializeSituationalMotivation();
        this.initializeGoalPsychology();
        this.initializeComebackProtocols();
        this.initializeMotivationTracking();
        this.initializePersonalizedPhrases();
        
        // Stato utente
        this.userMotivationProfile = null;
        this.currentMotivationLevel = 5; // 1-10 scale
        this.motivationHistory = [];
        this.lastMotivationCheck = null;
        
        console.log('🔥 Motivation System inizializzato');
    }

    // 👤 PROFILI MOTIVAZIONALI
    initializeMotivationalProfiles() {
        this.motivationalProfiles = {
            achiever: {
                name: "L'Achiever",
                keywords: ['obiettivi', 'risultati', 'vincere', 'competizione', 'sfida', 'successo'],
                characteristics: [
                    'Motivato da obiettivi specifici e misurabili',
                    'Ama la competizione e i record personali',
                    'Risponde bene a sfide e milestone',
                    'Needs recognition per i successi'
                ],
                motivationTriggers: [
                    'Progress tracking dettagliato',
                    'Obiettivi SMART con deadline',
                    'Competizioni e challenge',
                    'Recognition pubblico successi',
                    'Battere record personali'
                ],
                phrases: [
                    "💪 I campioni non si fanno nei momenti facili, ma quando tutto sembra impossibile!",
                    "🏆 Ogni ripetizione ti avvicina al tuo record personale. Oggi è il giorno giusto!",
                    "🎯 La differenza tra dove sei e dove vuoi essere si chiama DISCIPLINA!",
                    "⚡ I tuoi competitor stanno riposando. Tu stai migliorando. Vantaggio tuo!",
                    "🚀 Non stai solo allenando il corpo, stai costruendo la versione migliore di te!"
                ],
                challengeMessages: [
                    "Sfida 7 giorni: Batti il tuo record in un esercizio!",
                    "Challenge mensile: +5% performance in tutti i lift principali",
                    "Obiettivo trimestre: Foto prima/dopo che ti farà dire WOW!"
                ]
            },

            explorer: {
                name: "L'Explorer",
                keywords: ['varietà', 'nuove', 'provare', 'diverso', 'scoprire', 'sperimentare'],
                characteristics: [
                    'Si annoia con routine ripetitive',
                    'Ama provare nuove attività e workout',
                    'Motivato dalla crescita personale',
                    'Seeks new experiences e stimoli'
                ],
                motivationTriggers: [
                    'Workout variety e creative exercises',
                    'Nuove discipline fitness da provare',
                    'Learning opportunities continue',
                    'Travel workouts e outdoor activities',
                    'Skills-based challenges'
                ],
                phrases: [
                    "🌟 Ogni workout è una nuova avventura verso la scoperta di te stesso!",
                    "🗺️ Il tuo corpo è capace di cose incredibili che non hai ancora scoperto!",
                    "⚡ Oggi proviamo qualcosa di nuovo - la crescita sta nella novità!",
                    "🎭 Trasforma l'allenamento in un gioco: quale superpotere sviluppi oggi?",
                    "🌈 La noia è il nemico del progresso. Oggi rompiamo gli schemi!"
                ],
                challengeMessages: [
                    "Settimana explorer: Prova 3 nuovi esercizi che non hai mai fatto!",
                    "Challenge varietà: Ogni giorno un workout diverso per 2 settimane",
                    "Obiettivo skill: Impara una nuova abilità fitness (handstand, muscle-up, etc.)"
                ]
            },

            socializer: {
                name: "Il Socializer",
                keywords: ['insieme', 'amici', 'gruppo', 'supporto', 'condividere', 'community'],
                characteristics: [
                    'Motivato dal supporto sociale',
                    'Ama condividere progressi e sfide',
                    'Performant meglio in gruppo',
                    'Values accountability partners'
                ],
                motivationTriggers: [
                    'Group workouts e classi fitness',
                    'Sharing progress sui social',
                    'Accountability partners',
                    'Community support e encouragement',
                    'Team challenges e group goals'
                ],
                phrases: [
                    "🤝 Non sei solo in questo viaggio - hai una tribù che ti sostiene!",
                    "👥 Ogni persona che ispiri con la tua costanza sta migliorando grazie a te!",
                    "💫 La tua energia positiva è contagiosa - sei un esempio per altri!",
                    "🌟 Insieme siamo più forti: la community TribuCoach crede in te!",
                    "🎉 Condividi i tuoi successi - meriti di essere celebrato!"
                ],
                challengeMessages: [
                    "Challenge community: Trova un workout buddy per questa settimana!",
                    "Social goal: Condividi 3 progressi con la community",
                    "Team spirit: Motiva qualcun altro e vedrai raddoppiata la tua energia!"
                ]
            },

            mindful: {
                name: "Il Mindful",
                keywords: ['benessere', 'equilibrio', 'salute', 'energia', 'sentirsi bene', 'pace'],
                characteristics: [
                    'Motivato dal benessere generale',
                    'Focus su salute a lungo termine',
                    'Values balance over extremes',
                    'Prefers sustainable approaches'
                ],
                motivationTriggers: [
                    'Health benefits education',
                    'Stress relief e mental wellness',
                    'Sustainable lifestyle changes',
                    'Energy levels improvement',
                    'Longevity e aging gracefully'
                ],
                phrases: [
                    "🧘 Ogni movimento è un regalo che fai al tuo futuro te stesso",
                    "🌱 Stai piantando semi di salute che fioriranno per anni",
                    "☯️ L'equilibrio che cerchi fuori inizia dal benessere che crei dentro",
                    "🌊 Come l'acqua che scolpisce la roccia, la costanza gentile porta risultati duraturi",
                    "✨ Il tuo corpo ti ringrazia per ogni scelta sana che fai oggi"
                ],
                challengeMessages: [
                    "Mindful week: Focus su come ti senti prima/dopo ogni workout",
                    "Energy challenge: Nota come l'esercizio migliora la tua energia quotidiana",
                    "Gratitude fitness: Ringrazia il tuo corpo per quello che può fare"
                ]
            },

            rebel: {
                name: "Il Rebel",
                keywords: ['non voglio', 'odio', 'noioso', 'faticoso', 'difficile', 'impossibile'],
                characteristics: [
                    'Resistance to traditional approaches',
                    'Needs unconventional motivation',
                    'Responds to reverse psychology',
                    'Motivated by proving others wrong'
                ],
                motivationTriggers: [
                    'Unconventional workout approaches',
                    'Breaking rules e doing it differently',
                    'Proving doubters wrong',
                    'Anti-establishment messaging',
                    'Small rebellious wins'
                ],
                phrases: [
                    "😤 Chi ha detto che non puoi farcela? Oggi gli dimostri il contrario!",
                    "🔥 Le regole sono fatte per essere infrante - anche quelle dei tuoi limiti!",
                    "⚡ Non fare quello che fanno tutti. Fai quello che funziona per TE!",
                    "🚫 'Impossibile' è solo un'opinione. Tu sei qui per cambiarla!",
                    "💥 Ogni dubbioso sarà testimone della tua trasformazione!"
                ],
                challengeMessages: [
                    "Rebel challenge: Fai un workout che nessuno si aspetta da te!",
                    "Prove them wrong: Supera un limite che pensavi impossibile",
                    "Anti-routine: Crea il TUO workout unico e personale"
                ]
            }
        };
    }

    // ⏰ MOTIVAZIONE SITUAZIONALE
    initializeSituationalMotivation() {
        this.situationalMotivation = {
            morning: {
                keywords: ['mattina', 'sveglia', 'iniziare', 'primo'],
                messages: [
                    "🌅 Buongiorno campione! Hai appena vinto la battaglia più importante: alzarti dal letto!",
                    "☀️ Il sole è sorto e anche la tua energia! Oggi scrivi una nuova pagina della tua storia",
                    "⚡ Ogni mattina è una nuova opportunità di diventare la versione migliore di te",
                    "🔥 Il mondo appartiene a chi si alza presto. Tu hai già vinto la giornata!",
                    "💪 La tua energia mattutina è il carburante per tutto il giorno. Fai il pieno!"
                ],
                workoutSpecific: [
                    "Il workout mattutino è il tuo segreto per una giornata incredibile!",
                    "Allenati ora e senti l'energia durare tutto il giorno",
                    "Il morning workout è come il caffè per l'anima!"
                ]
            },

            preWorkout: {
                keywords: ['prima', 'iniziare allenamento', 'pre workout', 'palestra'],
                messages: [
                    "🎯 È il momento! Trasforma quell'energia in potenza pura!",
                    "⚡ Ogni grande trasformazione inizia con un singolo rep. Questo è il tuo!",
                    "🔥 Il tuo corpo è pronto, la tua mente è forte. Ora DAI TUTTO!",
                    "💥 Ricorda perché hai iniziato. Oggi fai un passo in più verso quel traguardo!",
                    "🚀 Non stai solo allenando muscoli, stai costruendo disciplina e carattere!"
                ],
                motivationalQuestions: [
                    "Quale versione di te uscirà da questo workout?",
                    "Che record personale puoi battere oggi?",
                    "Come ti sentirai dopo aver dato il massimo?"
                ]
            },

            midWorkout: {
                keywords: ['stanco', 'fatica', 'difficile', 'non ce la faccio', 'voglio smettere'],
                messages: [
                    "💪 La fatica che senti ora è la debolezza che lascia il tuo corpo!",
                    "🔥 Questo momento di difficoltà è dove nascono i veri risultati!",
                    "⚡ Il tuo corpo può resistere. È la tua mente che deve convincersi!",
                    "🎯 Una ripetizione in più di quella che credi possibile = crescita!",
                    "💎 I diamanti si formano sotto pressione. Tu sei il diamante!"
                ],
                pushThroughTechniques: [
                    "Conta solo fino a 3: 1... 2... 3... e fai quella ripetizione!",
                    "Pensa a quanto ti sentirai orgoglioso tra 30 secondi",
                    "Questa fatica è temporanea, i risultati sono permanenti!"
                ]
            },

            postWorkout: {
                keywords: ['finito', 'completato', 'fatto'],
                messages: [
                    "🏆 MISSION ACCOMPLISHED! Hai appena investito nel tuo futuro migliore!",
                    "⭐ Quello che hai fatto oggi ti ha reso più forte di ieri!",
                    "🎉 Celebra questo momento! Hai scelto la crescita invece del comfort!",
                    "💪 Il tuo corpo ti sta già ringraziando per questo regalo di salute!",
                    "🌟 Hai dimostrato ancora una volta che SEI CAPACE di tutto!"
                ],
                reflectionPrompts: [
                    "Come ti senti ora rispetto a prima del workout?",
                    "Cosa hai scoperto di te stesso oggi?",
                    "Quale parte del workout ti ha reso più orgoglioso?"
                ]
            },

            evening: {
                keywords: ['sera', 'stanco', 'lungo giorno', 'energia bassa'],
                messages: [
                    "🌙 Anche se il giorno è stato lungo, hai ancora energia per te stesso",
                    "✨ Un movimento serale è come una coccola per il tuo corpo",
                    "🧘 Non serve un workout intenso. Anche 10 minuti di movimento sono un regalo",
                    "💤 Un po' di attività ora migliorerà il tuo sonno stanotte",
                    "🌟 Finisci la giornata con qualcosa di buono per te"
                ],
                gentleOptions: [
                    "Che ne dici di una camminata rilassante?",
                    "Pochi minuti di stretching per rilasciare la tensione?",
                    "Yoga dolce per concludere in bellezza?"
                ]
            },

            weekend: {
                keywords: ['weekend', 'sabato', 'domenica', 'tempo libero'],
                messages: [
                    "🎉 Weekend = tempo per te! Come vuoi celebrare il tuo corpo oggi?",
                    "🌈 Il weekend è perfetto per provare qualcosa di nuovo e divertente!",
                    "🏖️ Relax non significa inattività. Significa scegliere movimento che ti piace!",
                    "🎪 Trasforma il fitness in gioco! Cosa ti diverte di più?",
                    "🌟 Il weekend è il momento perfetto per workout più lunghi e piacevoli"
                ],
                funActivities: [
                    "Hiking in natura?",
                    "Ballo a casa con la tua musica preferita?",
                    "Sport con amici o famiglia?",
                    "Esplorazione della città a piedi/bici?"
                ]
            },

            stressed: {
                keywords: ['stress', 'ansia', 'tensione', 'preoccupato', 'nervoso'],
                messages: [
                    "🌊 Il movimento è la medicina più naturale per lo stress",
                    "🧘 Ogni respiro durante l'esercizio rilascia la tensione accumulata",
                    "⚡ Trasforma lo stress in energia per il movimento!",
                    "🎯 Focus sul presente: qui, ora, questo movimento, questo respiro",
                    "💚 Il tuo corpo sa come guarire se stesso. Dagli questa opportunità"
                ],
                stressRelievers: [
                    "10 respiri profondi + 5 minuti di camminata",
                    "Stretching dolce per rilasciare tensione fisica",
                    "Movimento ritmico (dance, cyclette) per liberare endorfine"
                ]
            },

            unmotivated: {
                keywords: ['non ho voglia', 'pigro', 'svogliato', 'demotivato'],
                messages: [
                    "😊 È normale non avere sempre voglia. I campioni si allenano SOPRATTUTTO quando non ne hanno voglia",
                    "🔥 La motivazione ti fa iniziare, l'abitudine ti fa continuare",
                    "⭐ Non serve essere perfetto. Serve solo iniziare",
                    "💎 I giorni senza voglia sono quelli che contano di più",
                    "🌱 Anche 5 minuti sono meglio di 0. Inizia piccolo"
                ],
                microCommitments: [
                    "Solo 5 minuti di movimento, poi vedi come ti senti",
                    "Metti solo le scarpe da ginnastica. Poi decidi",
                    "Una sola serie di un esercizio che ti piace"
                ]
            }
        };
    }

    // 🎯 PSICOLOGIA DEGLI OBIETTIVI
    initializeGoalPsychology() {
        this.goalPsychology = {
            goalsetting: {
                smartFramework: {
                    specific: "Cosa ESATTAMENTE vuoi raggiungere?",
                    measurable: "Come misurerai il progresso?",
                    achievable: "È realisticamente raggiungibile?",
                    relevant: "Perché è importante per te?",
                    timebound: "Entro quando vuoi raggiungerlo?"
                },
                
                goalTypes: {
                    outcome: {
                        description: "Risultati finali (peso, misure, performance)",
                        examples: ["Perdere 10kg", "Correre 5km", "Bench press 100kg"],
                        pitfalls: "Dipendono da fattori esterni, possono demotivare",
                        advice: "Usali come direzione, non come unica misura di successo"
                    },
                    process: {
                        description: "Azioni quotidiane controllabili",
                        examples: ["Allenarsi 4x/settimana", "Mangiare 5 porzioni verdure/giorno"],
                        benefits: "Completamente sotto il tuo controllo, creano abitudini",
                        advice: "Focus principale qui - controllano i risultati"
                    },
                    identity: {
                        description: "Chi vuoi diventare",
                        examples: ["Essere una persona attiva", "Diventare qualcuno che si prende cura di sé"],
                        power: "Cambia comportamenti a livello profondo",
                        advice: "Il più potente - allinea azioni con identità desiderata"
                    }
                },

                motivationalMessages: [
                    "🎯 Un obiettivo senza piano è solo un desiderio. Hai il piano, ora agisci!",
                    "📈 Ogni piccolo step ti avvicina al traguardo. Progress over perfection!",
                    "🔥 I tuoi obiettivi ti stanno aspettando. Ogni giorno è un'opportunità per avvicinarti",
                    "💪 Non stai solo raggiungendo un obiettivo, stai diventando il tipo di persona che raggiunge obiettivi",
                    "⭐ Il viaggio verso l'obiettivo ti trasforma più dell'obiettivo stesso"
                ]
            },

            plateaus: {
                recognition: [
                    "I plateau sono normali e temporanei",
                    "Indicano che il corpo si è adattato (buona cosa!)",
                    "Momento perfetto per variare l'approccio",
                    "Test della tua resilienza mentale"
                ],
                
                strategies: [
                    {
                        name: "Variety Shock",
                        description: "Cambia completamente tipo di allenamento per 2-3 settimane",
                        example: "Da pesi a bodyweight, da steady cardio a HIIT"
                    },
                    {
                        name: "Progressive Overload Reset",
                        description: "Riduci carichi del 20% e ricostruisci con form perfetto",
                        example: "Focus su range of motion, tempo, controllo"
                    },
                    {
                        name: "Recovery Focus",
                        description: "Intensifica recupero per permettere adattamenti",
                        example: "Più sonno, stress management, nutrizione precision"
                    },
                    {
                        name: "Measurement Shift",
                        description: "Cambia metriche di progresso",
                        example: "Da peso a circonferenze, da kg a repetitions, da tempo a sensazioni"
                    }
                ],

                motivationalMessages: [
                    "🏔️ I plateau sono come montagne - sembrano invalicabili finché non trovi il sentiero giusto",
                    "🌱 Anche gli alberi più forti hanno periodi di crescita lenta. Stanno rafforzando le radici",
                    "💎 I plateau sono dove si forgia la vera disciplina. Qui si vedono i campioni",
                    "🔄 Stagnazione è informazione: il tuo corpo ti sta dicendo di cambiare approccio",
                    "⚡ Ogni plateau superato ti rende mentalmente più forte per la vita"
                ]
            },

            setbacks: {
                reframing: [
                    "Setback = Setup for comeback",
                    "Failure = First Attempt In Learning",
                    "Mistakes = Valuable data for improvement",
                    "Restart = Another chance to do it better"
                ],

                recoveryProtocol: {
                    step1: {
                        name: "Acknowledge & Accept",
                        action: "Riconosci cosa è successo senza giudizio",
                        message: "È umano. Anche i migliori hanno battute d'arresto."
                    },
                    step2: {
                        name: "Learn & Analyze", 
                        action: "Cosa puoi imparare da questa esperienza?",
                        message: "Ogni fallimento è un master class mascherato."
                    },
                    step3: {
                        name: "Plan & Prepare",
                        action: "Come eviterai questa situazione in futuro?",
                        message: "La preparazione previene performance scadenti."
                    },
                    step4: {
                        name: "Start Small",
                        action: "Riparti con micro-abitudini facili",
                        message: "Small wins creano momentum per big wins."
                    },
                    step5: {
                        name: "Celebrate Return",
                        action: "Celebra il coraggio di ricominciare",
                        message: "Ripartire richiede più coraggio che continuare."
                    }
                },

                comebackMessages: [
                    "🦅 Le aquile volano più in alto dopo la tempesta",
                    "🌱 I semi crescono più forti dopo l'inverno più duro",
                    "💪 Questo restart ti renderà più intelligente e resiliente",
                    "🔥 Il tuo comeback sarà più forte del tuo setback",
                    "⭐ Stai scrivendo la parte migliore della tua storia proprio ora"
                ]
            }
        };
    }

    // 🚀 PROTOCOLLI DI COMEBACK
    initializeComebackProtocols() {
        this.comebackProtocols = {
            after_break: {
                durations: {
                    "1-2 weeks": {
                        plan: "Gentle return, 70% previous intensity",
                        focus: "Movement patterns, joint mobility",
                        message: "Welcome back! Il tuo corpo ha ricaricato le batterie."
                    },
                    "1 month": {
                        plan: "Progressive build-up over 2 weeks",
                        focus: "Cardiovascular base, basic strength",
                        message: "Take it steady - rebuilding stronger foundations."
                    },
                    "2-3 months": {
                        plan: "4-week progressive program",
                        focus: "Full body conditioning, habit reestablishment",
                        message: "Patience + consistency = sustainable return to form."
                    },
                    "6+ months": {
                        plan: "Treat as beginner, 8-week build-up",
                        focus: "Movement quality, injury prevention",
                        message: "Fresh start = opportunity to do everything better."
                    }
                },

                weeklyProgression: {
                    week1: "Foundation - 50% previous volume, focus form",
                    week2: "Building - 65% volume, add complexity",
                    week3: "Momentum - 80% volume, increase intensity",
                    week4: "Integration - 90% volume, full range activities"
                },

                motivationalSupport: [
                    "🌟 Every expert was once a beginner. Every pro was once amateur.",
                    "🔄 You're not starting over, you're starting better",
                    "💪 Muscle memory is real - your body remembers more than you think",
                    "🎯 Focus on how good it feels to move again",
                    "⚡ This time you have experience and wisdom on your side"
                ]
            },

            after_injury: {
                phases: {
                    clearance: {
                        message: "🏥 Medical clearance first - no shortcuts with health",
                        focus: "Doctor/physio guidance, understand limitations"
                    },
                    mobility: {
                        message: "🧘 Gentle movement, listen to your body carefully", 
                        focus: "Range of motion, pain-free movements only"
                    },
                    stability: {
                        message: "🎯 Building stability around the injury site",
                        focus: "Balance, proprioception, light resistance"
                    },
                    strength: {
                        message: "💪 Progressive loading, patience with the process",
                        focus: "Gradual strength building, avoid compensation patterns"
                    },
                    integration: {
                        message: "🔄 Return to full activities with confidence",
                        focus: "Sport-specific movements, psychological confidence"
                    }
                },

                psychologicalSupport: [
                    "🦋 Healing is not linear - expect good days and challenging days",
                    "🌱 Your body wants to heal - give it time and right conditions",
                    "💎 This experience is teaching you to value and respect your body",
                    "🎯 Focus on what you CAN do, not what you can't",
                    "⭐ Comeback stories are always the most inspiring"
                ]
            },

            motivation_lost: {
                rootCauses: {
                    burnout: "Too much too fast - need rest and variety",
                    plateauFrustration: "Progress stalled - need new approach",
                    lifeStress: "External pressures - need gentler approach",
                    boredom: "Same routine too long - need novelty",
                    perfectionism: "All-or-nothing thinking - need self-compassion"
                },

                solutions: {
                    microCommitments: [
                        "Just put on workout clothes",
                        "5-minute walk outside", 
                        "One set of favorite exercise",
                        "Gentle stretching while watching TV"
                    ],
                    varietyInjection: [
                        "Try completely new activity",
                        "Change workout time/location",
                        "Add music or podcast",
                        "Exercise with friend/group"
                    ],
                    goalReset: [
                        "Focus on feeling instead of looking",
                        "Process goals instead of outcome goals",
                        "Daily habits instead of weekly targets",
                        "Fun factor over fitness factor"
                    ]
                },

                rekindlingMessages: [
                    "🔥 Lost motivation? It's not gone, just hiding. Let's find it together.",
                    "🌟 You don't need motivation to start. You need to start to get motivated.",
                    "💫 The hardest part is beginning again. You're already here - that's courage.",
                    "🎯 Small actions create big momentum. What's your smallest possible step?",
                    "💪 Your body misses movement more than you realize. Listen to it."
                ]
            }
        };
    }

    // 📊 TRACKING MOTIVAZIONE
    initializeMotivationTracking() {
        this.motivationTracking = {
            metrics: {
                level: "1-10 scale current motivation",
                trend: "Increasing/stable/decreasing over time", 
                triggers: "What increases/decreases motivation",
                patterns: "Time of day, week, month patterns",
                blockers: "Common obstacles and barriers"
            },

            assessmentQuestions: [
                "Su una scala da 1 a 10, quanto ti senti motivato oggi?",
                "Cosa ti ha dato più energia questa settimana?",
                "Quale momento della giornata ti senti più motivato?",
                "Cosa ti fa perdere motivazione più facilmente?",
                "Quando ti sei sentito più orgoglioso di te stesso recentemente?"
            ],

            interventions: {
                low: {
                    range: "1-3",
                    actions: [
                        "Micro-commitment approach",
                        "Focus on feeling over performance", 
                        "Social support activation",
                        "Environment modification",
                        "Professional support if persistent"
                    ]
                },
                moderate: {
                    range: "4-6", 
                    actions: [
                        "Goal clarification",
                        "Routine optimization",
                        "Progress celebration",
                        "Obstacle identification",
                        "Variety introduction"
                    ]
                },
                high: {
                    range: "7-10",
                    actions: [
                        "Momentum maintenance",
                        "Challenge escalation",
                        "Habit solidification", 
                        "Inspiration sharing",
                        "Long-term vision planning"
                    ]
                }
            }
        };
    }

    // 💬 FRASI PERSONALIZZATE
    initializePersonalizedPhrases() {
        this.personalizedPhrases = {
            byGoal: {
                weightLoss: [
                    "🔥 Ogni caloria bruciata è un passo verso la versione migliore di te!",
                    "⚖️ Il numero sulla bilancia non definisce il tuo valore, ma i tuoi sforzi sì!",
                    "💪 Stai perdendo peso ma guadagnando fiducia, forza e salute!",
                    "🌟 Il tuo corpo si sta trasformando ogni giorno, anche quando non lo vedi!"
                ],
                muscleGain: [
                    "💪 Ogni ripetizione costruisce non solo muscoli, ma carattere!",
                    "🏗️ Stai letteralmente costruendo una versione più forte di te stesso!",
                    "⚡ La crescita muscolare richiede tempo, ma la crescita mentale è immediata!",
                    "🔥 Ogni grammo di muscolo guadagnato è un investimento nel tuo futuro!"
                ],
                fitness: [
                    "🚀 La tua resistenza migliora ogni giorno, anche nei giorni difficili!",
                    "⚡ L'energia che stai costruendo ti servirà per tutta la vita!",
                    "🏃 Non stai solo migliorando il fitness, stai migliorando la qualità della vita!",
                    "💫 Ogni allenamento è un deposito nella banca della salute futura!"
                ],
                health: [
                    "❤️ Il tuo cuore ti ringrazia per ogni battito durante l'esercizio!",
                    "🌱 Stai investendo nella versione più sana e longeva di te stesso!",
                    "✨ Ogni movimento è una medicina naturale per corpo e mente!",
                    "🧠 L'esercizio che fai oggi protegge la tua mente di domani!"
                ]
            },

            byPersonality: {
                determined: [
                    "🔥 La tua determinazione è la tua superpotenza!",
                    "💎 I diamanti si formano sotto pressione - proprio come te!",
                    "⚡ La tua costanza oggi creerà risultati straordinari domani!"
                ],
                gentle: [
                    "🌸 Ogni piccolo passo gentile conta più di quello che credi",
                    "🌙 Sii paziente con te stesso - la crescita richiede tempo",
                    "💫 Il tuo approccio delicato è una forza, non una debolezza"
                ],
                competitive: [
                    "🏆 Oggi compete contro la versione di ieri di te stesso!",
                    "⚡ I tuoi competitor stanno riposando mentre tu migliori!",
                    "🎯 Ogni workout ti dà un vantaggio sulla competizione!"
                ],
                social: [
                    "👥 La tua energia positiva ispira tutti intorno a te!",
                    "🌟 Sei un esempio luminoso per la tua community!",
                    "🤝 Il supporto che dai agli altri ti torna indietro moltiplicato!"
                ]
            },

            byTimeOfDay: {
                morning: [
                    "🌅 Hai vinto la battaglia più difficile: alzarti dal letto!",
                    "☀️ La tua energia mattutina alimenterà tutta la giornata!",
                    "⚡ Il morning workout è il tuo segreto per giornate incredibili!"
                ],
                afternoon: [
                    "🌞 Perfetto momento per ricaricare le energie!",
                    "💪 Il pomeriggio è ideale per liberare lo stress accumulato!",
                    "🔥 Trasforma la stanchezza in energia con il movimento!"
                ],
                evening: [
                    "🌙 Concludi la giornata con qualcosa di buono per te!",
                    "✨ Il workout serale è il tuo regalo di fine giornata!",
                    "💤 Un po' di movimento ora migliorerà il tuo sonno!"
                ]
            }
        };
    }

    // 🎯 METODI PRINCIPALI

    // Rileva profilo motivazionale dell'utente
    detectMotivationalProfile(userMessages, userPreferences = {}) {
        const profileScores = {};
        
        // Inizializza scores
        Object.keys(this.motivationalProfiles).forEach(profile => {
            profileScores[profile] = 0;
        });

        // Analizza messaggi dell'utente
        userMessages.forEach(message => {
            const messageText = message.toLowerCase();
            
            Object.entries(this.motivationalProfiles).forEach(([profileName, profileData]) => {
                profileData.keywords.forEach(keyword => {
                    if (messageText.includes(keyword)) {
                        profileScores[profileName] += 1;
                    }
                });
            });
        });

        // Trova profilo con score più alto
        const dominantProfile = Object.entries(profileScores)
            .sort(([,a], [,b]) => b - a)[0][0];

        this.userMotivationProfile = dominantProfile;
        return this.motivationalProfiles[dominantProfile];
    }

    // Genera messaggio motivazionale personalizzato
    generateMotivationalMessage(context = {}) {
        const {
            situation = 'general',
            userGoal = null,
            motivationLevel = 5,
            timeOfDay = 'any',
            personalityTrait = null
        } = context;

        let message = "";
        let suggestions = [];

        // 1. Messaggi situazionali
        if (this.situationalMotivation[situation]) {
            const situationData = this.situationalMotivation[situation];
            message = this.getRandomFromArray(situationData.messages);
            
            if (situationData.workoutSpecific) {
                suggestions = situationData.workoutSpecific;
            }
        }

        // 2. Personalizza per profilo utente
        if (this.userMotivationProfile && this.motivationalProfiles[this.userMotivationProfile]) {
            const profilePhrases = this.motivationalProfiles[this.userMotivationProfile].phrases;
            if (Math.random() > 0.5) { // 50% chance di usare frase del profilo
                message = this.getRandomFromArray(profilePhrases);
            }
        }

        // 3. Personalizza per obiettivo
        if (userGoal && this.personalizedPhrases.byGoal[userGoal]) {
            const goalPhrases = this.personalizedPhrases.byGoal[userGoal];
            if (Math.random() > 0.7) { // 30% chance di usare frase dell'obiettivo
                message = this.getRandomFromArray(goalPhrases);
            }
        }

        // 4. Adatta per livello motivazione
        if (motivationLevel <= 3) {
            message = this.adaptForLowMotivation(message);
            suggestions = this.generateLowMotivationSuggestions();
        } else if (motivationLevel >= 8) {
            message = this.adaptForHighMotivation(message);
            suggestions = this.generateHighMotivationChallenges();
        }

        return {
            message: message,
            suggestions: suggestions,
            motivationLevel: motivationLevel,
            profile: this.userMotivationProfile,
            confidence: 'high'
        };
    }

    // Gestisce situazioni di bassa motivazione
    handleLowMotivation(context = {}) {
        const protocol = this.comebackProtocols.motivation_lost;
        
        // Identifica possibile causa
        const rootCause = this.identifyMotivationLoss(context);
        
        // Suggerisce soluzioni appropriate
        const solutions = protocol.solutions[rootCause] || protocol.solutions.microCommitments;
        
        // Genera messaggio supportivo
        const supportMessage = this.getRandomFromArray(protocol.rekindlingMessages);
        
        return {
            message: supportMessage,
            rootCause: rootCause,
            solutions: solutions,
            microCommitments: protocol.solutions.microCommitments,
            confidence: 'high',
            type: 'low_motivation_support'
        };
    }

    // Fornisce supporto per plateau
    handlePlateau(context = {}) {
        const plateauData = this.goalPsychology.plateaus;
        
        const recognitionMessage = "🏔️ I plateau sono normali e temporanei. Indicano che il tuo corpo si è adattato - è una buona cosa!";
        
        const strategies = plateauData.strategies;
        const motivationalMessage = this.getRandomFromArray(plateauData.motivationalMessages);
        
        return {
            message: `${recognitionMessage}\n\n${motivationalMessage}`,
            strategies: strategies,
            type: 'plateau_support',
            confidence: 'high'
        };
    }

    // Supporta comeback dopo pausa
    handleComeback(breakDuration = "1 month") {
        const comebackData = this.comebackProtocols.after_break;
        
        // Trova piano appropriato per durata pausa
        let plan = comebackData.durations["1 month"]; // default
        
        Object.entries(comebackData.durations).forEach(([duration, planData]) => {
            if (breakDuration.includes(duration.split('-')[0])) {
                plan = planData;
            }
        });

        const supportMessage = this.getRandomFromArray(comebackData.motivationalSupport);
        
        return {
            message: `${plan.message}\n\n${supportMessage}`,
            plan: plan.plan,
            focus: plan.focus,
            weeklyProgression: comebackData.weeklyProgression,
            type: 'comeback_support',
            confidence: 'high'
        };
    }

    // Valuta motivazione attuale
    assessMotivation(userResponse) {
        const response = userResponse.toLowerCase();
        
        // Sentiment analysis semplice
        const positiveWords = ['bene', 'ottimo', 'fantastico', 'motivato', 'energia', 'felice'];
        const negativeWords = ['male', 'stanco', 'demotivato', 'difficile', 'non ce la faccio'];
        
        let score = 5; // neutral
        
        positiveWords.forEach(word => {
            if (response.includes(word)) score += 1;
        });
        
        negativeWords.forEach(word => {
            if (response.includes(word)) score -= 1;
        });
        
        // Normalizza tra 1-10
        score = Math.max(1, Math.min(10, score));
        
        this.currentMotivationLevel = score;
        this.recordMotivationLevel(score);
        
        return score;
    }

    // Utility methods
    getRandomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    adaptForLowMotivation(message) {
        return message.replace(/!/g, '.').replace(/💪|🔥|⚡/g, '🌱');
    }

    adaptForHighMotivation(message) {
        return message + " 🚀 Sei on fire oggi!";
    }

    generateLowMotivationSuggestions() {
        return [
            "Solo 5 minuti di movimento, poi vedi come ti senti",
            "Metti solo le scarpe da ginnastica",
            "Una sola serie del tuo esercizio preferito"
        ];
    }

    generateHighMotivationChallenges() {
        return [
            "Prova un esercizio nuovo che ti spaventa un po'",
            "Aumenta l'intensità del 10% oggi",
            "Fai una serie extra nel tuo ultimo esercizio"
        ];
    }

    identifyMotivationLoss(context) {
        // Logica semplificata - in produzione useresti ML
        if (context.stressLevel && context.stressLevel > 7) return 'lifeStress';
        if (context.plateauWeeks && context.plateauWeeks > 4) return 'plateauFrustration';
        if (context.sameRoutineWeeks && context.sameRoutineWeeks > 8) return 'boredom';
        return 'burnout';
    }

    recordMotivationLevel(level) {
        this.motivationHistory.push({
            level: level,
            timestamp: new Date(),
            context: this.currentMotivationLevel
        });
        
        // Mantieni solo ultimi 30 record
        if (this.motivationHistory.length > 30) {
            this.motivationHistory = this.motivationHistory.slice(-30);
        }
    }

    // 📊 Analytics motivazione
    getMotivationAnalytics() {
        return {
            currentLevel: this.currentMotivationLevel,
            profile: this.userMotivationProfile,
            history: this.motivationHistory,
            averageLevel: this.motivationHistory.length > 0 ? 
                this.motivationHistory.reduce((sum, record) => sum + record.level, 0) / this.motivationHistory.length : 5,
            trend: this.calculateMotivationTrend(),
            lastCheck: this.lastMotivationCheck
        };
    }

    calculateMotivationTrend() {
        if (this.motivationHistory.length < 5) return 'insufficient_data';
        
        const recent = this.motivationHistory.slice(-5);
        const older = this.motivationHistory.slice(-10, -5);
        
        const recentAvg = recent.reduce((sum, r) => sum + r.level, 0) / recent.length;
        const olderAvg = older.reduce((sum, r) => sum + r.level, 0) / older.length;
        
        if (recentAvg > olderAvg + 0.5) return 'increasing';
        if (recentAvg < olderAvg - 0.5) return 'decreasing';
        return 'stable';
    }

    // 🎯 Metodo principale per integrazione
    getMotivationalResponse(userMessage, context = {}) {
        const message = userMessage.toLowerCase();
        
        // Rileva situazione
        let situation = 'general';
        if (message.includes('stanco') || message.includes('non ce la faccio')) {
            situation = 'midWorkout';
        } else if (message.includes('mattina') || message.includes('sveglia')) {
            situation = 'morning';
        } else if (message.includes('non ho voglia') || message.includes('demotivato')) {
            situation = 'unmotivated';
        } else if (message.includes('stress') || message.includes('ansia')) {
            situation = 'stressed';
        } else if (message.includes('finito') || message.includes('completato')) {
            situation = 'postWorkout';
        }

        // Valuta livello motivazione da messaggio
        const motivationLevel = this.assessMotivation(userMessage);
        
        // Genera risposta appropriata
        if (motivationLevel <= 3) {
            return this.handleLowMotivation({ ...context, message: userMessage });
        } else if (message.includes('plateau') || message.includes('non progredisco')) {
            return this.handlePlateau(context);
        } else if (message.includes('pausa') || message.includes('fermo da')) {
            return this.handleComeback(context.breakDuration);
        } else {
            return this.generateMotivationalMessage({
                situation,
                motivationLevel,
                ...context
            });
        }
    }
}

// Export per uso globale
window.MotivationSystem = MotivationSystem;