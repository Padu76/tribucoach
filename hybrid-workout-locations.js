// 🏋️ ENHANCED WORKOUT LOCATION SELECTOR - HYBRID OPTIONS
// Aggiorna il sistema per supportare combinazioni di modalità di allenamento

class EnhancedWorkoutLocationSelector {
    constructor() {
        this.initializeHybridOptions();
        this.initializeSeasonalAdaptations();
        console.log('🔄 Enhanced Workout Location Selector inizializzato - HYBRID SUPPORT');
    }

    initializeHybridOptions() {
        this.workoutLocations = {
            // Opzioni singole (esistenti)
            single: {
                'casa': {
                    label: 'A casa',
                    icon: '🏠',
                    description: 'Solo workout domestici',
                    equipment: ['bodyweight', 'resistance_bands', 'dumbbells_home'],
                    pros: ['Convenienza', 'Privacy', 'Flessibilità orari'],
                    cons: ['Limitazioni equipment', 'Distrazioni', 'Meno motivazione sociale']
                },
                'palestra': {
                    label: 'In palestra',
                    icon: '🏋️',
                    description: 'Solo palestra/centro fitness',
                    equipment: ['full_gym', 'machines', 'free_weights', 'cardio_equipment'],
                    pros: ['Equipment completo', 'Ambiente motivante', 'Supporto staff'],
                    cons: ['Costi', 'Orari fissi', 'Spostamenti']
                },
                'aperto': {
                    label: "All'aperto",
                    icon: '🌳',
                    description: 'Solo outdoor training',
                    equipment: ['bodyweight', 'minimal_equipment', 'natural_obstacles'],
                    pros: ['Aria fresca', 'Vitamina D', 'Varietà scenari'],
                    cons: ['Dipendenza meteo', 'Limitazioni stagionali']
                },
                'personal': {
                    label: 'Con personal trainer',
                    icon: '👨‍💼',
                    description: 'Solo sessioni 1-on-1',
                    equipment: ['depends_on_location'],
                    pros: ['Personalizzazione massima', 'Tecnica perfetta', 'Motivazione'],
                    cons: ['Costo elevato', 'Dipendenza da schedule']
                },
                'gruppo': {
                    label: 'Lezioni di gruppo',
                    icon: '👥',
                    description: 'Solo classi fitness',
                    equipment: ['class_specific'],
                    pros: ['Socializzazione', 'Motivazione gruppo', 'Istruttore qualificato'],
                    cons: ['Orari fissi', 'Ritmo non personalizzato']
                }
            },

            // 🔄 NUOVE OPZIONI IBRIDE
            hybrid: {
                'casa_palestra': {
                    label: 'Casa + Palestra',
                    icon: '🏠🏋️',
                    description: 'Combinazione casa e palestra',
                    split: {
                        casa: ['cardio_leggero', 'stretching', 'mobility', 'bodyweight'],
                        palestra: ['strength_training', 'heavy_lifting', 'machines', 'social_workouts']
                    },
                    schedule_example: {
                        weekly: 'Palestra 3x/sett (Lun-Mer-Ven), Casa 2x/sett (Mar-Sab)',
                        seasonal: 'Palestra inverno, Casa estate',
                        convenience: 'Palestra quando possibile, Casa come backup'
                    },
                    pros: ['Massima flessibilità', 'Backup sempre disponibile', 'Varietà'],
                    cons: ['Doppi costi potenziali', 'Equipment duplicato']
                },

                'aperto_casa': {
                    label: 'Outdoor + Casa',
                    icon: '🌳🏠',
                    description: 'Combinazione outdoor e domestico',
                    split: {
                        aperto: ['running', 'hiking', 'calisthenics', 'sports'],
                        casa: ['strength_training', 'yoga', 'stretching', 'bad_weather_backup']
                    },
                    schedule_example: {
                        seasonal: 'Outdoor primavera/estate, Casa autunno/inverno',
                        weather: 'Outdoor bel tempo, Casa maltempo',
                        weekly: 'Outdoor weekend, Casa weekdays'
                    },
                    pros: ['Adattabilità meteo', 'Varietà scenari', 'Costo contenuto'],
                    cons: ['Dipendenza condizioni', 'Planning più complesso']
                },

                'palestra_personal': {
                    label: 'Palestra + Personal',
                    icon: '🏋️👨‍💼',
                    description: 'Palestra libera + sessioni personal',
                    split: {
                        palestra: ['routine_workouts', 'cardio', 'familiar_exercises'],
                        personal: ['new_techniques', 'form_correction', 'program_updates', 'motivation_boost']
                    },
                    schedule_example: {
                        frequency: '1x personal/settimana + 2-3x palestra libera',
                        progression: '1x personal/2 settimane per maintenance',
                        intensive: '2x personal/settimana per risultati rapidi'
                    },
                    pros: ['Best of both worlds', 'Costo ottimizzato', 'Indipendenza + Guida'],
                    cons: ['Costo medio-alto', 'Coordinamento schedule']
                },

                'gruppo_casa': {
                    label: 'Gruppi + Casa',
                    icon: '👥🏠',
                    description: 'Lezioni gruppo + allenamento casa',
                    split: {
                        gruppo: ['social_motivation', 'new_exercises', 'structured_classes'],
                        casa: ['practice_techniques', 'extra_volume', 'recovery_work']
                    },
                    schedule_example: {
                        frequency: '2x gruppo/settimana + 2x casa practice',
                        supplement: 'Gruppo per imparare, Casa per consolidare',
                        social: 'Gruppo per motivazione, Casa per focus'
                    },
                    pros: ['Apprendimento + Pratica', 'Socializzazione + Privacy', 'Costo bilanciato'],
                    cons: ['Gestione time complex', 'Potrebbero sovrapporsi']
                },

                'total_hybrid': {
                    label: 'Mix Completo',
                    icon: '🔄',
                    description: 'Tutte le modalità combinate',
                    split: {
                        palestra: ['heavy_lifting', 'machines'],
                        casa: ['recovery', 'quick_workouts'],
                        aperto: ['cardio', 'functional'],
                        personal: ['monthly_assessment'],
                        gruppo: ['social_classes']
                    },
                    schedule_example: {
                        weekly: 'Palestra 2x, Casa 2x, Outdoor 1x, Gruppo 1x/settimana',
                        seasonal: 'Adatta mix in base a stagione/vita',
                        flexible: 'Scegli daily in base a tempo/energia'
                    },
                    pros: ['Varietà massima', 'Adattabilità totale', 'Mai noia'],
                    cons: ['Complessità gestionale', 'Costi potenzialmente alti', 'Possibile confusione']
                }
            }
        };
    }

    initializeSeasonalAdaptations() {
        this.seasonalPreferences = {
            primavera: {
                preferred: ['aperto', 'casa_aperto', 'outdoor_running'],
                reasoning: 'Clima mite, voglia di stare fuori dopo inverno'
            },
            estate: {
                preferred: ['aperto_mattina', 'casa_condizionata', 'piscina'],
                reasoning: 'Evita caldo palestre, preferisce outdoor early morning'
            },
            autunno: {
                preferred: ['palestra', 'casa_palestra', 'indoor_activities'],
                reasoning: 'Ritorno a routine, preparazione inverno'
            },
            inverno: {
                preferred: ['palestra', 'casa', 'indoor_heated'],
                reasoning: 'Evita freddo, cerca ambienti riscaldati'
            }
        };
    }

    // 🎯 GENERA RACCOMANDAZIONI IBRIDE INTELLIGENTI
    generateHybridRecommendations(userProfile) {
        const {
            budget, 
            timeAvailability, 
            experience, 
            goals, 
            constraints,
            personality,
            season
        } = userProfile;

        let recommendations = [];

        // SCENARIO 1: Budget limitato ma vuole varietà
        if (budget === 'low' && personality.includes('variety_lover')) {
            recommendations.push({
                type: 'casa_aperto',
                reasoning: 'Massima varietà con costi minimi',
                schedule: 'Outdoor per cardio/funzionale, Casa per strength',
                monthly_cost: '0-20€',
                equipment_needed: ['resistance_bands', 'yoga_mat', 'basic_weights']
            });
        }

        // SCENARIO 2: Budget medio, tempo limitato
        if (budget === 'medium' && timeAvailability === 'limited') {
            recommendations.push({
                type: 'casa_palestra',
                reasoning: 'Casa per quick workouts, palestra per sessioni intensive',
                schedule: 'Casa weekdays (20-30min), Palestra weekend (60-90min)',
                monthly_cost: '30-60€',
                efficiency: 'Alta - adatta a schedule irregolare'
            });
        }

        // SCENARIO 3: Budget alto, vuole risultati rapidi
        if (budget === 'high' && goals.includes('fast_results')) {
            recommendations.push({
                type: 'palestra_personal',
                reasoning: 'Personal per tecnica, palestra per volume',
                schedule: '1x personal/settimana + 3x palestra autonoma',
                monthly_cost: '150-300€',
                results_timeline: '2-3 mesi per risultati visibili'
            });
        }

        // SCENARIO 4: Social ma anche introverso
        if (personality.includes('social') && personality.includes('introvert')) {
            recommendations.push({
                type: 'gruppo_casa',
                reasoning: 'Classi per socializzare, casa per focus personale',
                schedule: '2x gruppo/settimana + 2x casa practice',
                monthly_cost: '40-80€',
                social_balance: 'Perfetto per personality complessa'
            });
        }

        // SCENARIO 5: Adattamento stagionale
        if (season && this.seasonalPreferences[season]) {
            const seasonalPref = this.seasonalPreferences[season];
            recommendations.push({
                type: 'seasonal_adaptive',
                primary: seasonalPref.preferred[0],
                backup: 'casa',
                reasoning: seasonalPref.reasoning,
                adaptation: `Cambia focus ogni stagione per ottimale engagement`
            });
        }

        return recommendations.slice(0, 3); // Top 3 recommendations
    }

    // 🔧 BUILDER INTELLIGENTE PER HYBRID PLAN
    buildHybridWorkoutPlan(selectedHybrid, userProfile) {
        const hybridData = this.workoutLocations.hybrid[selectedHybrid];
        
        if (!hybridData) {
            console.error('Hybrid option not found:', selectedHybrid);
            return null;
        }

        const plan = {
            name: hybridData.label,
            description: hybridData.description,
            weekly_structure: this.generateWeeklyStructure(hybridData, userProfile),
            equipment_list: this.generateEquipmentList(hybridData),
            cost_breakdown: this.calculateCostBreakdown(hybridData, userProfile),
            progression_path: this.generateProgressionPath(hybridData),
            backup_options: this.generateBackupOptions(hybridData),
            success_metrics: this.defineSuccessMetrics(hybridData, userProfile)
        };

        return plan;
    }

    generateWeeklyStructure(hybridData, userProfile) {
        // Genera struttura settimanale basata su hybrid type e user profile
        const baseSchedule = hybridData.schedule_example.weekly;
        
        return {
            monday: this.assignBestLocation('monday', hybridData, userProfile),
            tuesday: this.assignBestLocation('tuesday', hybridData, userProfile),
            wednesday: this.assignBestLocation('wednesday', hybridData, userProfile),
            thursday: this.assignBestLocation('thursday', hybridData, userProfile),
            friday: this.assignBestLocation('friday', hybridData, userProfile),
            saturday: this.assignBestLocation('saturday', hybridData, userProfile),
            sunday: this.assignBestLocation('sunday', hybridData, userProfile),
            flexibility_notes: 'Adatta in base a energia, tempo, meteo'
        };
    }

    assignBestLocation(day, hybridData, userProfile) {
        // Logic per assegnare location ottimale per ogni giorno
        const workdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        const weekend = ['saturday', 'sunday'];
        
        if (workdays.includes(day) && userProfile.timeAvailability === 'limited') {
            return {
                location: 'casa',
                workout_type: 'quick_effective',
                duration: '20-30min',
                reasoning: 'Weekday efficiency'
            };
        }
        
        if (weekend.includes(day)) {
            return {
                location: 'palestra_or_outdoor',
                workout_type: 'comprehensive',
                duration: '60-90min',
                reasoning: 'Weekend time availability'
            };
        }
        
        return {
            location: 'flexible',
            workout_type: 'adaptive',
            duration: '30-60min',
            reasoning: 'Based on daily circumstances'
        };
    }

    generateEquipmentList(hybridData) {
        // Lista equipment necessario per hybrid approach
        let equipment = {
            essential: [],
            recommended: [],
            upgrade_path: []
        };

        // Analizza split e determina equipment
        Object.entries(hybridData.split).forEach(([location, activities]) => {
            if (location === 'casa') {
                equipment.essential.push(...['yoga_mat', 'resistance_bands']);
                equipment.recommended.push(...['adjustable_dumbbells', 'pull_up_bar']);
                equipment.upgrade_path.push(...['home_gym_setup', 'smart_equipment']);
            }
        });

        return equipment;
    }

    calculateCostBreakdown(hybridData, userProfile) {
        // Calcolo costi per approccio ibrido
        let costs = {
            monthly: {},
            one_time: {},
            total_monthly: 0,
            cost_per_workout: 0
        };

        // Logic per calcolare costi basati su hybrid type
        if (hybridData.label.includes('Palestra')) {
            costs.monthly.gym_membership = 35;
        }
        if (hybridData.label.includes('Personal')) {
            costs.monthly.personal_trainer = 120;
        }
        if (hybridData.label.includes('Casa')) {
            costs.one_time.home_equipment = 150;
        }

        costs.total_monthly = Object.values(costs.monthly).reduce((a, b) => a + b, 0);
        costs.cost_per_workout = costs.total_monthly / (userProfile.weekly_workouts * 4.33);

        return costs;
    }

    generateProgressionPath(hybridData) {
        return {
            beginner: 'Start with easier location, gradually add complexity',
            intermediate: 'Balance between locations based on goals',
            advanced: 'Optimize each location for specific adaptations',
            timeline: '3-month adaptation periods for each progression level'
        };
    }

    generateBackupOptions(hybridData) {
        return {
            bad_weather: 'Casa sempre disponibile',
            equipment_broken: 'Switch to bodyweight or alternative location',
            schedule_conflict: 'Flexible location based on time available',
            motivation_low: 'Choose most enjoyable location for that day'
        };
    }

    defineSuccessMetrics(hybridData, userProfile) {
        return {
            consistency: 'Weekly workout completion rate >80%',
            progression: 'Monthly strength/endurance improvements',
            satisfaction: 'High enjoyment across all locations',
            efficiency: 'Cost per result optimization',
            sustainability: '6+ month adherence without major changes'
        };
    }

    // 🎯 METODO PRINCIPALE PER UI INTEGRATION
    getEnhancedLocationOptions() {
        return {
            categories: {
                single: {
                    title: 'Modalità Singola',
                    description: 'Scegli un tipo di allenamento principale',
                    options: Object.keys(this.workoutLocations.single)
                },
                hybrid: {
                    title: 'Modalità Ibrida',
                    description: 'Combina diverse modalità per massima flessibilità',
                    options: Object.keys(this.workoutLocations.hybrid),
                    recommended: true
                }
            },
            hybrid_benefits: [
                'Varietà che previene noia',
                'Backup sempre disponibile',
                'Adattabile a vita/stagioni',
                'Ottimizzazione costo/beneficio',
                'Crescita più completa'
            ]
        };
    }
}

// 🔗 INTEGRATION CON SISTEMA ESISTENTE
class HybridWorkoutIntegration {
    constructor() {
        this.locationSelector = new EnhancedWorkoutLocationSelector();
        this.setupUIIntegration();
    }

    setupUIIntegration() {
        // Aggiorna dropdown esistente con opzioni ibride
        this.updateLocationDropdown();
        this.addHybridRecommendationEngine();
        this.setupDynamicScheduling();
    }

    updateLocationDropdown() {
        const enhancedOptions = this.locationSelector.getEnhancedLocationOptions();
        
        // Nuovo HTML per dropdown con categorie
        return `
            <optgroup label="🎯 Modalità Singola">
                <option value="casa">🏠 A casa</option>
                <option value="palestra">🏋️ In palestra</option>
                <option value="aperto">🌳 All'aperto</option>
                <option value="personal">👨‍💼 Con personal trainer</option>
                <option value="gruppo">👥 Lezioni di gruppo</option>
            </optgroup>
            
            <optgroup label="🔄 Modalità Ibrida (Raccomandato)">
                <option value="casa_palestra">🏠🏋️ Casa + Palestra</option>
                <option value="aperto_casa">🌳🏠 Outdoor + Casa</option>
                <option value="palestra_personal">🏋️👨‍💼 Palestra + Personal</option>
                <option value="gruppo_casa">👥🏠 Gruppi + Casa</option>
                <option value="total_hybrid">🔄 Mix Completo</option>
            </optgroup>
        `;
    }

    addHybridRecommendationEngine() {
        // Genera raccomandazioni personalizzate
        return (userProfile) => {
            const recommendations = this.locationSelector.generateHybridRecommendations(userProfile);
            
            return recommendations.map(rec => ({
                title: rec.type.replace('_', ' + '),
                description: rec.reasoning,
                cost: rec.monthly_cost,
                schedule: rec.schedule,
                match_score: this.calculateMatchScore(rec, userProfile)
            })).sort((a, b) => b.match_score - a.match_score);
        };
    }

    calculateMatchScore(recommendation, userProfile) {
        let score = 0;
        
        // Score basato su budget match
        if (recommendation.monthly_cost && userProfile.budget) {
            const cost = parseInt(recommendation.monthly_cost.split('-')[1]) || 0;
            if (userProfile.budget === 'low' && cost <= 30) score += 30;
            if (userProfile.budget === 'medium' && cost <= 80) score += 25;
            if (userProfile.budget === 'high') score += 20;
        }
        
        // Score basato su time availability
        if (recommendation.schedule && userProfile.timeAvailability === 'limited') {
            if (recommendation.schedule.includes('quick') || recommendation.schedule.includes('20-30min')) {
                score += 25;
            }
        }
        
        // Score basato su personality
        if (userProfile.personality) {
            if (userProfile.personality.includes('variety_lover') && recommendation.type.includes('_')) {
                score += 20;
            }
            if (userProfile.personality.includes('social') && recommendation.type.includes('gruppo')) {
                score += 15;
            }
        }
        
        return Math.min(score, 100);
    }

    setupDynamicScheduling() {
        // Sistema per schedule dinamico basato su hybrid choice
        return {
            generateWeeklyPlan: (hybridType, userConstraints) => {
                return this.locationSelector.buildHybridWorkoutPlan(hybridType, userConstraints);
            },
            
            adaptToCircumstances: (dailyFactors) => {
                // Weather, energy, time, motivation
                const { weather, energy, timeAvailable, motivation } = dailyFactors;
                
                let recommendation = 'casa'; // default safe
                
                if (weather === 'good' && energy === 'high' && timeAvailable > 60) {
                    recommendation = 'aperto';
                } else if (timeAvailable < 30) {
                    recommendation = 'casa';
                } else if (motivation === 'low') {
                    recommendation = 'gruppo'; // social motivation
                } else if (energy === 'high' && timeAvailable > 45) {
                    recommendation = 'palestra';
                }
                
                return {
                    recommended_location: recommendation,
                    reasoning: this.explainRecommendation(dailyFactors, recommendation),
                    backup_option: 'casa',
                    workout_adjustment: this.suggestWorkoutAdjustment(dailyFactors)
                };
            }
        };
    }

    explainRecommendation(factors, recommendation) {
        const explanations = {
            casa: 'Quick, convenient, controllable environment',
            palestra: 'High energy + time = full equipment workout',
            aperto: 'Perfect weather + energy = outdoor advantage',
            gruppo: 'Low motivation needs social boost',
            personal: 'Need guidance and accountability today'
        };
        
        return explanations[recommendation] + ` (based on: ${Object.entries(factors).map(([k,v]) => `${k}:${v}`).join(', ')})`;
    }

    suggestWorkoutAdjustment(factors) {
        if (factors.energy === 'low') return 'gentle_recovery';
        if (factors.timeAvailable < 30) return 'hiit_efficient';
        if (factors.motivation === 'low') return 'fun_activity';
        if (factors.energy === 'high') return 'challenging_workout';
        return 'standard_workout';
    }
}

// Export per uso globale
window.EnhancedWorkoutLocationSelector = EnhancedWorkoutLocationSelector;
window.HybridWorkoutIntegration = HybridWorkoutIntegration;

console.log('🔄 Enhanced Workout Location System loaded - HYBRID SUPPORT READY!');