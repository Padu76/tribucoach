// 🧠 ADVANCED KNOWLEDGE BASE - TRIBUCOACH
// Sistema di conoscenza avanzata per fitness, nutrizione e benessere

class AdvancedKnowledgeBase {
    constructor() {
        this.initializeTrainingMethodologies();
        this.initializeAdvancedNutrition();
        this.initializeSpecificPrograms();
        this.initializeCaseStudies();
        this.initializeCommonFAQs();
        this.initializeSupplementGuide();
        this.initializeMindBodyPrograms();
        
        console.log('🧠 Advanced Knowledge Base inizializzata');
    }

    // 🏋️ METODOLOGIE DI ALLENAMENTO AVANZATE
    initializeTrainingMethodologies() {
        this.trainingMethodologies = {
            functional: {
                keywords: ['funzionale', 'functional', 'movimenti naturali', 'vita quotidiana', 'coordinazione'],
                theory: `🏃 ALLENAMENTO FUNZIONALE

💡 PRINCIPI BASE:
- Movimenti multi-articolari e multi-planari
- Integrazione core-stabilità-mobilità
- Transfert nella vita quotidiana
- Catene cinetiche complete

🎯 BENEFICI:
- Migliora postura e equilibrio
- Riduce rischio infortuni
- Aumenta forza utilizzabile
- Sviluppa coordinazione

📋 ESERCIZI CHIAVE:
- Squat variations (goblet, overhead, single leg)
- Deadlift patterns (conventional, sumo, single leg)
- Push/Pull movements (push-ups, rows, carries)
- Rotational exercises (wood chops, med ball throws)
- Locomotion patterns (crawls, lunges, steps)`,
                
                workout: `🔥 WORKOUT FUNZIONALE 30 MIN

WARM-UP (5min):
- Dynamic stretching
- Joint mobility
- Activation movements

MAIN CIRCUIT (20min):
🏃 Round 1 (6min): SQUAT PATTERN
- Goblet squats: 45sec
- Rest: 15sec
- Jump squats: 45sec
- Rest: 15sec
- Single leg box step: 45sec
- Rest: 15sec
Repeat 2x

🏃 Round 2 (6min): PUSH/PULL PATTERN
- Push-ups variations: 45sec
- Rest: 15sec
- TRX/Inverted rows: 45sec
- Rest: 15sec
- Bear crawl: 45sec
- Rest: 15sec
Repeat 2x

🏃 Round 3 (8min): INTEGRATION
- Turkish get-ups: 30sec each side
- Farmer's carry: 40sec
- Mountain climbers: 30sec
- Plank variations: 40sec
- Wood chops: 30sec each side
Repeat 2x

COOL-DOWN (5min):
- Static stretching
- Breathing exercises
- Myofascial release

💪 PROGRESSIONE:
Settimana 1-2: Focus tecnica
Settimana 3-4: Aumenta intensità
Settimana 5-6: Variazioni complesse
Settimana 7-8: Test e nuove sfide`
            },

            hypertrophy: {
                keywords: ['ipertrofia', 'massa muscolare', 'volume', 'pompaggio', 'definizione'],
                theory: `💪 ALLENAMENTO IPERTROFIA

🔬 MECCANISMI SCIENTIFICI:
1. Tensione meccanica (75-85% 1RM)
2. Stress metabolico (pump, lattato)
3. Danno muscolare controllato
4. Progressive overload costante

📊 PARAMETRI OTTIMALI:
- Volume: 12-20 serie/gruppo muscolare/settimana
- Intensità: 65-85% 1RM
- Frequenza: 2-3x settimana per gruppo
- Rep range: 6-15 reps (sweet spot 8-12)
- Rest: 2-3min esercizi compound, 60-90sec isolamenti

🎯 PERIODIZZAZIONE:
FASE 1 (4 sett): Volume alto, intensità media
FASE 2 (3 sett): Volume medio, intensità alta  
FASE 3 (1 sett): Deload attivo
FASE 4 (4 sett): Volume altissimo, tecniche intensive

⚡ TECNICHE AVANZATE:
- Drop sets (riduci peso del 20-30%)
- Rest-pause (3-5 rep extra dopo cedimento)
- Cluster sets (mini-pause intra-serie)
- Pre-exhaustion (isolamento prima compound)
- Mechanical drop sets (da difficile a facile)`,

                workout: `🔥 UPPER BODY HYPERTROPHY

🎯 CHEST & TRICEPS FOCUS:

A1. Panca piana: 4x8-10 (3min rest)
A2. Incline DB press: 4x10-12 (2min rest)

B1. Dips: 3x12-15 (90sec rest)
B2. Cable crossover: 3x12-15 (90sec rest)

C1. Close grip bench: 3x10-12
C2. Overhead tricep ext: 3x12-15
C3. Tricep pushdowns: 3xAMRAP
(C1-C3 circuit, 2min rest tra round)

D. PUMP FINISHER:
Push-ups to failure
Diamond push-ups to failure
Wall push-ups to failure
(No rest tra esercizi)

💡 TECNICHE:
- Serie A: Progressive overload focus
- Serie B: Range motion completo
- Serie C: Tri-set metabolico
- Serie D: Blood flow restriction effect

🔄 NEXT WORKOUT:
BACK & BICEPS con stessa struttura
- Pull-ups/Lat pulldowns
- Rows variations
- Bicep curl complex
- Pump finisher posterior`
            },

            strength: {
                keywords: ['forza', 'powerlifting', 'massimali', '1RM', 'stacco', 'squat', 'panca'],
                theory: `⚡ ALLENAMENTO FORZA

🎯 PRINCIPI NEUROMUSCOLTARI:
- Recruitment fibre veloci (Type II)
- Coordinazione inter-muscolare
- Efficienza neurale
- Potenza e velocità

📈 PARAMETRI FORZA MASSIMA:
- Intensità: 85-100% 1RM
- Volume: 3-6 reps per serie
- Serie: 3-6 per esercizio
- Rest: 3-5 minuti (completo recupero ATP-PC)
- Frequenza: 3-6x settimana

🏆 BIG 3 POWERLIFTING:

SQUAT TECNICA:
- Set-up: Barra alta traps, stance spalle
- Discesa: Anche indietro, ginocchia fuori
- Risalita: Drive talloni, anche avanti
- Respirazione: Valsalva per stabilità core

DEADLIFT TECNICA:
- Set-up: Barra sopra metatarsi
- Presa: Mixed o hook grip
- Lift-off: Gambe prima, poi schiena
- Lockout: Anche in avanti, spalle indietro

BENCH PRESS TECNICA:
- Arch: Naturale, spalle retratte
- Presa: Larghezza ottimale (1.5x spalle)
- Discesa: Controllo, tocco chest
- Spinta: Drive gambe + push braccia`,

                workout: `⚡ STRENGTH WORKOUT - SQUAT FOCUS

WARM-UP (15min):
- General: 5min bike/row leggero
- Dynamic: Leg swings, hip circles
- Specific: Bodyweight squats
- Empty bar: 2x10 perfect form
- 50%: 1x5, 70%: 1x3, 80%: 1x1

MAIN LIFT - BACK SQUAT:
Week 1: 85% x 5x3 (5min rest)
Week 2: 87.5% x 4x3 (5min rest)  
Week 3: 90% x 3x3 (5min rest)
Week 4: 92.5% x 2x3 (6min rest)

ACCESSORY WORK:
B1. Front squat: 3x6 @70%
B2. Romanian deadlift: 3x8
(3min rest tra superset)

C1. Bulgarian split squat: 3x10 each
C2. Leg curl: 3x12
C3. Calf raise: 3x15
(90sec rest tra esercizi)

CORE FINISHER:
- Plank: 3x60sec
- Side plank: 2x45sec each
- Dead bug: 2x10 each

📊 TESTING PROTOCOL:
Ogni 4-6 settimane:
- Week off o deload
- 1RM test (opener, second, third attempt)
- Rivaluta percentuali
- Adatta accessori a weak points`
            },

            endurance: {
                keywords: ['resistenza', 'cardio', 'aerobico', 'maratona', 'endurance', 'fiato'],
                theory: `🏃 ALLENAMENTO RESISTENZA

🫀 SISTEMI ENERGETICI:
1. AEROBICO (con O2): 70-85% sforzi lunghi
2. ANAEROBICO LATTACIDO: 85-95% sforzi medi
3. ANAEROBICO ALATTACIDO: 95-100% sforzi brevi

📊 ZONE DI ALLENAMENTO:
ZONA 1 (60-70% FCmax): Recovery active
ZONA 2 (70-80% FCmax): Base aerobica
ZONA 3 (80-85% FCmax): Aerobic threshold  
ZONA 4 (85-92% FCmax): Lactate threshold
ZONA 5 (92-100% FCmax): VO2max/Neuromuscular

🎯 PERIODIZZAZIONE POLARIZZATA:
- 80% Volume in Zona 1-2 (base aerobica)
- 20% Volume in Zona 4-5 (high intensity)
- Zona 3 limitata (zona grigia)

⚡ METODI DI ALLENAMENTO:
- Long Slow Distance (LSD): 60-90min Z1-Z2
- Tempo runs: 20-40min Z3-Z4
- Interval training: 4x4min Z4-Z5
- Fartlek: Gioco di velocità variabile
- Hill repeats: Forza + potenza aerobica`,

                workout: `🏃 ENDURANCE WEEK STRUCTURE

LUNEDÌ - EASY RUN:
45-60min Zone 1-2
- Warm-up: 10min gradual
- Main: 30-45min conversational pace
- Cool-down: 5min + stretching
💗 Feel: Dovresti riuscire a parlare

MARTEDÌ - INTERVAL TRAINING:
Total: 45min
- Warm-up: 15min progressive
- Main set: 6x3min @Z4 (90sec recovery)
- Cool-down: 10min easy
💗 Feel: Respiro controllato ma intenso

MERCOLEDÌ - RECOVERY:
30min Zone 1 O Cross-training
- Bike easy / Swimming / Yoga
- Focus su mobilità e recovery
💗 Feel: Energizzante, non faticoso

GIOVEDÌ - TEMPO RUN:
Total: 50min
- Warm-up: 15min build
- Main: 20min @threshold pace
- Cool-down: 15min easy
💗 Feel: "Comfortably hard"

VENERDÌ - REST o EASY:
Rest completo o 20-30min easy

SABATO - LONG RUN:
60-120min Zone 1-2
- Progressive: Inizia facile
- Ultimo 25%: Slightly uptempo
- Nutrition practice
💗 Feel: Aerobic base building

DOMENICA - RECOVERY:
30-40min easy + strength/mobility

📊 PROGRESSIONE:
Week 1: Volume base
Week 2: +10% volume
Week 3: +10% volume + intensity
Week 4: Deload (-30% volume)`
            }
        };
    }

    // 🥗 NUTRIZIONE AVANZATA
    initializeAdvancedNutrition() {
        this.advancedNutrition = {
            macros: {
                keywords: ['macros', 'macronutrienti', 'proteine', 'carboidrati', 'grassi', 'calorie'],
                content: `🥗 GUIDA MACRONUTRIENTI AVANZATA

🔬 PROTEINE (1.6-2.2g/kg):
FONTI COMPLETE:
- Animali: Carne, pesce, uova, latticini
- Vegetali: Quinoa, soia, hemp protein
- Integratori: Whey, caseine, plant-based

TIMING OTTIMALE:
- Post-workout: 20-40g entro 2h
- Pre-bed: 20-30g caseine (sintesi notturna)
- Distribuzione: 20-30g ogni pasto
- Leucina: 2.5-3g per trigger mTOR

💪 PER MASSA: 2.0-2.2g/kg
💪 PER DEFINIZIONE: 2.2-2.8g/kg
💪 PER MANTENIMENTO: 1.6-2.0g/kg

🌾 CARBOIDRATI (3-12g/kg):
TIMING STRATEGICO:
- Pre-workout (1-3h): 1-4g/kg
- Post-workout (0-2h): 1.2g/kg + proteine
- Sera: Quantità moderata per recovery

FONTI QUALITATIVE:
- High GI: Riso bianco, banana (post-workout)
- Medium GI: Avena, patate dolci (pre-workout)
- Low GI: Quinoa, legumi (pasti principali)

🏃 ENDURANCE: 8-12g/kg
🏋️ STRENGTH: 4-6g/kg  
🔥 FAT LOSS: 2-4g/kg

🥑 GRASSI (0.8-1.5g/kg):
ESSENZIALI:
- Omega-3: 2-3g/giorno (EPA+DHA)
- Omega-6: Rapporto 4:1 con omega-3
- Saturi: <10% calorie totali
- Monoinsaturi: Olio oliva, avocado, noci

TIMING:
- Lontano da workout (rallenta digestione)
- Colazione: MCT oil per energia
- Sera: Supporta produzione ormoni

💡 CALCOLO PRATICO:
1. Peso 70kg, obiettivo massa
2. Proteine: 70 x 2.0 = 140g (560 cal)
3. Grassi: 70 x 1.0 = 70g (630 cal)  
4. Carboidrati: Resto calorie ÷ 4
5. Esempio 2800 cal: (2800-1190)÷4 = 402g carbs`
            },

            timing: {
                keywords: ['timing nutrizionale', 'pre workout', 'post workout', 'digiuno', 'meal timing'],
                content: `⏰ TIMING NUTRIZIONALE AVANZATO

🌅 PROTOCOLLI DIGIUNO:
16:8 INTERMITTENT FASTING:
- Digiuno: 20:00 - 12:00 (16h)
- Feeding: 12:00 - 20:00 (8h)
- Benefici: Insulino-sensibilità, autofagia
- Training: A digiuno o break fast post

20:4 WARRIOR DIET:
- Digiuno: 20h con piccoli snack
- Feeding: 4h finestra pasto principale  
- Advanced protocol per esperti
- Monitoring energia e performance

🏋️ NUTRIZIONE PERI-WORKOUT:

PRE-WORKOUT (1-3h prima):
OBIETTIVO: Energia + Idratazione
- Carboidrati: 30-60g (facili digestione)
- Proteine: 15-25g
- Grassi: Limitati (<10g)
- Liquidi: 400-600ml
- Caffeina: 3-6mg/kg (se tollerata)

ESEMPI:
- Banana + whey protein
- Avena + miele + BCAA
- Toast integrale + marmellata

INTRA-WORKOUT (>90min):
- Carboidrati: 30-60g/h
- Elettroliti: Sodio, potassio
- BCAA: 10-15g (se a digiuno)
- Acqua: 150-250ml ogni 15-20min

POST-WORKOUT (0-2h):
OBIETTIVO: Recovery + Anabolismo
- Carboidrati: 1.0-1.2g/kg
- Proteine: 20-40g (0.3g/kg)
- Rapporto: 3:1 o 4:1 (carbs:protein)
- Timing: Prima 30min più efficaci

ESEMPI:
- Whey + banana + latte
- Pollo + riso + verdure
- Smoothie: frutta + proteine + avena

🌙 NUTRIZIONE NOTTURNA:
CENA (3h pre-bed):
- Proteine: 25-40g (caseine/caseifici)
- Carboidrati: Moderati (sweet potato)
- Grassi: Omega-3, magnesio
- Evita: Caffeina, alcol, eccessi

PRE-BED SNACK:
- 20-30g caseine o Greek yogurt
- Magnesio: 200-400mg
- Melatonina: 0.5-3mg (se necessario)
- Camomilla o ashwagandha

💧 IDRATAZIONE STRATEGICA:
BASELINE: 35ml/kg peso corporeo
EXERCISE: +500-750ml/h intensità media
CLIMA CALDO: +20-30% fabbisogno
MONITORING: Colore urine (giallo chiaro)

ELETTROLITI WORKOUT:
- Sodio: 200-700mg/h
- Potassio: 150-300mg/h  
- Magnesio: 50-100mg/h
- Calcio: 10-30mg/h`
            },

            supplements: {
                keywords: ['integratori', 'supplementi', 'proteine', 'creatina', 'vitamine'],
                content: `💊 GUIDA INTEGRATORI EVIDENCE-BASED

🏆 TIER 1 - ESSENZIALI:

CREATINA MONOIDRATO:
- Dosaggio: 5g/giorno (ogni giorno)
- Timing: Indifferente, costanza importante
- Benefici: +15% forza, +30% potenza
- Loading: Opzionale (20g x 5 giorni)
- Effetti: Visibili dopo 2-4 settimane

PROTEINE IN POLVERE:
- Whey: Veloce assorbimento, post-workout
- Caseine: Lento rilascio, pre-bed
- Plant-based: Vegani, mix pisello+riso+canapa
- Dosaggio: 20-40g per serving
- Qualità: Amino profile completo

VITAMINA D3:
- Dosaggio: 2000-4000 IU/giorno
- Timing: Con grassi per assorbimento
- Benefici: Ossa, immune, testosterone
- Testing: 25(OH)D livelli 30-50 ng/ml
- Essenziale per atleti indoor

🥈 TIER 2 - PERFORMANCE:

CAFFEINA:
- Dosaggio: 3-6mg/kg (200-400mg)
- Timing: 30-45min pre-workout
- Benefici: +10-15% performance
- Ciclizzazione: 1-2 settimane off/month
- Evita: 6h prima di dormire

BETA-ALANINA:
- Dosaggio: 3-5g/giorno (split doses)
- Timing: Con pasti (riduce tingling)
- Benefici: Buffer lattato, endurance
- Loading: 4-6 settimane per efficacia
- Utile: Sforzi 1-4 minuti

CITRULLINA MALATO:
- Dosaggio: 6-8g pre-workout
- Timing: 30-45min prima
- Benefici: Pump, riduce DOMS
- Meccanismo: Ossido nitrico pathway
- Alternative: L-Arginina meno efficace

🥉 TIER 3 - SPECIFICI:

OMEGA-3 (EPA/DHA):
- Dosaggio: 2-3g/giorno
- Rapporto: 2:1 EPA:DHA ideale
- Benefici: Anti-inflammatory, recovery
- Qualità: Third-party tested
- Timing: Con grassi nei pasti

MAGNESIO:
- Dosaggio: 200-400mg sera
- Forma: Gliccinato > Ossido
- Benefici: Sonno, crampi, stress
- Deficiency: Comune negli atleti
- Timing: Pre-bed per rilassamento

MULTIVITAMINICO:
- Baseline insurance policy
- Qualità: Forme bioattive
- Timing: Con prima colazione
- Non sostituisce: Dieta bilanciata
- Focus: B-complex, minerali

❌ EVITA - MARKETING HYPE:
- BCAAs (se mangi proteine adeguate)
- Glutamina (produzione endogena sufficiente)
- Fat burners (caffeina + marketing)
- Mass gainers (fai frullati casalinghi)
- Testosterone boosters naturali

🧪 PROTOCOLLO STACK:
BEGINNER:
- Whey protein
- Creatina monoidrato
- Vitamina D3
- Multivitaminico base

INTERMEDIATE:
+ Caffeina pre-workout
+ Omega-3
+ Magnesio sera

ADVANCED:
+ Beta-alanina
+ Citrullina malato
+ Specifici per goal/carenze`
            }
        };
    }

    // 🧘 PROGRAMMI SPECIFICI BENESSERE
    initializeSpecificPrograms() {
        this.specificPrograms = {
            relaxation: {
                keywords: ['relax', 'rilassamento', 'stress', 'tensione', 'calma'],
                program: `🧘 PROGRAMMA RILASSAMENTO PROFONDO

🌅 ROUTINE MATTUTINA (10min):
BREATHING PREPARATION:
1. Posizione comoda seduto/sdraiato
2. Mani su petto e pancia
3. Osserva respiro naturale 2min

BOX BREATHING:
- Inspira 4 secondi (pancia si espande)
- Trattieni 4 secondi
- Espira 4 secondi (pancia si sgonfia)  
- Pausa 4 secondi
- Ripeti 8 cicli

BODY SCAN VELOCE:
- Inizia dalla testa
- Rilassa ogni parte del corpo
- Muovi consapevolezza verso piedi
- 1-2 secondi per area

🌇 ROUTINE SERA (15-20min):

PROGRESSIVE MUSCLE RELAXATION:
1. Piedi: Contrai 5sec → Rilassa 10sec
2. Polpacci: Contrai 5sec → Rilassa 10sec
3. Cosce: Contrai 5sec → Rilassa 10sec
4. Glutei: Contrai 5sec → Rilassa 10sec
5. Addome: Contrai 5sec → Rilassa 10sec
6. Mani/Avambracci: Contrai 5sec → Rilassa 10sec
7. Bicipiti: Contrai 5sec → Rilassa 10sec
8. Spalle: Contrai 5sec → Rilassa 10sec
9. Viso: Contrai 5sec → Rilassa 10sec

4-7-8 BREATHING:
- Inspira dal naso per 4 secondi
- Trattieni respiro per 7 secondi
- Espira dalla bocca per 8 secondi
- Ripeti 4-8 cicli
- Potente per attivare parasimpatico

💤 SLEEP PREPARATION:
AMBIENTE:
- Temperatura: 18-20°C
- Buio completo (blackout)
- Silenzio o white noise
- No dispositivi elettronici

ROUTINE PRE-BED:
- Doccia calda (aumenta poi drop temperatura)
- Lettura libro cartaceo
- Journal gratitudine (3 cose positive)
- Meditazione guidata 5-10min
- Evita: schermi, caffeina, pasti pesanti

🎯 TECNICHE EMERGENCY (3-5min):
STRESS ACUTO - 5-4-3-2-1:
- 5 cose che vedi
- 4 cose che tocchi
- 3 cose che senti
- 2 cose che odori  
- 1 cosa che gusti
(Grounding technique per ansia)

RESPIRO RAPIDO RESET:
- 3 respiri profondi consecutivi
- Inspira 6 secondi
- Espira 8 secondi
- Focus solo sul respiro

💡 APP CONSIGLIATE:
- Headspace: Meditazioni guidate
- Calm: Storie per dormire
- Insight Timer: Community e timer
- Waking Up: Filosofia + pratica
- Ten Percent Happier: Practical approach`
            },

            stretching: {
                keywords: ['stretching', 'flessibilità', 'mobilità', 'allungamento', 'rigidità'],
                program: `🤸 PROGRAMMA STRETCHING COMPLETO

🌅 MORNING MOBILITY (10min):
DYNAMIC WARM-UP:
1. Neck rolls: 5 each direction
2. Arm circles: 10 forward/backward
3. Leg swings: 10 front-back, 10 side-side
4. Hip circles: 10 each direction
5. Ankle circles: 10 each foot

MORNING FLOW:
Position → Hold 30-45sec each

CAT-COW STRETCH:
- Start tabletop position
- Arch back (cow), round spine (cat)
- Mobilizza intera colonna vertebrale

DOWNWARD DOG TO COBRA:
- Downward dog 30sec
- Flow to plank
- Lower to cobra 30sec
- Allunga hip flexors + chest

STANDING FORWARD FOLD:
- Piedi hip-width apart
- Fold forward, bend knees slightly
- Allunga hamstrings + lower back

🏋️ PRE-WORKOUT PREP (8min):
FUNCTIONAL MOVEMENTS:
1. Leg swings: 10x each direction
2. Walking lunges: 10 total
3. Arm crossovers: 10 each arm
4. Torso twists: 10 each side
5. Inch worms: 5 reps
6. Glute bridges: 15 reps

ACTIVATION SPECIFIC:
Upper body day:
- Band pull-aparts: 15
- Wall slides: 10
- Doorway chest stretch: 30sec

Lower body day:
- Clamshells: 10 each side
- Monster walks: 10 each direction
- 90/90 hip stretch: 30sec each

🌙 EVENING DEEP STRETCH (20min):

LOWER BODY SEQUENCE:
1. PIGEON POSE: 2min each side
   - Hip flexors + glutes deep stretch
   - Breathe deeply, surrender to stretch

2. FIGURE-4 STRETCH: 90sec each side
   - Supine, ankle on opposite knee
   - Pull thigh toward chest

3. SEATED SPINAL TWIST: 90sec each side
   - Sit tall, twist from core
   - Hand behind back for support

4. HAMSTRING STRETCH: 90sec each leg
   - Supine, leg straight up
   - Use strap or towel if needed

UPPER BODY SEQUENCE:
1. CHILD'S POSE: 2min
   - Arms extended, hips back
   - Focus su breathing

2. DOORWAY CHEST STRETCH: 90sec each arm
   - Forearm su wall, step forward
   - Various heights per different fibers

3. NECK LATERAL STRETCH: 45sec each side
   - Ear toward shoulder
   - Opposite hand behind back

4. SEATED SIDE BEND: 60sec each side
   - Reach up and over
   - Lateral torso stretch

FINAL INTEGRATION:
SUPINE SPINAL TWIST: 2min each side
- Knees to one side, arms in T
- Ultimate relaxation position

🎯 PROBLEM AREAS FOCUS:

TIGHT HIPS (Office workers):
- 90/90 stretch: 2min each side
- Couch stretch: 90sec each side  
- Butterfly stretch: 2min
- Happy baby pose: 2min

TIGHT SHOULDERS (Desk job):
- Doorway stretch: Various angles
- Cross-body arm stretch: 45sec each
- Behind-back clasp: 60sec
- Wall slides: 2x10

TIGHT HAMSTRINGS:
- Standing toe touch: 2min
- Single leg RDL stretch: 90sec each
- Supine leg raise: 90sec each
- Seated forward fold: 2min

💡 STRETCHING RULES:
- Never stretch cold muscles
- Breathe deeply throughout
- Mild discomfort OK, pain NO
- Consistency > Intensity
- Hold static stretches 30-60sec minimum
- Dynamic before workout, static after`
            },

            meditation: {
                keywords: ['meditazione', 'mindfulness', 'consapevolezza', 'mente', 'pace interiore'],
                program: `🧘‍♀️ PROGRAMMA MEDITAZIONE COMPLETA

🌱 BEGINNER TRACK (Settimane 1-4):

SETTIMANA 1-2: FOUNDATION
DAILY PRACTICE (5min):
1. POSTURA:
   - Seduto comodo, schiena dritta
   - Mani sulle ginocchia o in grembo
   - Occhi chiusi o semiaperti

2. BREATH AWARENESS:
   - Focus solo sul respiro naturale
   - Quando mente vaga, torna al respiro
   - No giudizio, solo osservazione
   - Conta respiri da 1 a 10, ricomincia

3. CLOSING:
   - Ultimi 30sec, espandi consapevolezza
   - Sounds, body sensations
   - Gentle movement ritorno

SETTIMANA 3-4: EXPANSION (8min):
+ BODY SCAN SEMPLICE:
- Start top of head
- Move attention through body
- Notice sensations without changing
- Head → shoulders → arms → torso → legs

+ LOVING-KINDNESS INTRO:
- "May I be happy and healthy"
- Repeat 3-5 times
- Feel intention behind words

🌿 INTERMEDIATE TRACK (Settimane 5-12):

DAILY PRACTICE (10-15min):
1. BREATHING TECHNIQUES:
   EQUAL BREATHING:
   - Inhale 4 counts, exhale 4 counts
   - Gradually increase to 6-8 counts
   - Calma nervous system

   ALTERNATE NOSTRIL:
   - Block right nostril, inhale left
   - Block left nostril, exhale right
   - Continue alternating 5-8 rounds
   - Balances brain hemispheres

2. MINDFULNESS PRACTICES:
   NOTING MEDITATION:
   - Notice thoughts as "thinking"
   - Emotions as "feeling"  
   - Sensations as "sensing"
   - Label gently, return to breath

   OPEN AWARENESS:
   - No specific focus object
   - Aware of whatever arises
   - Spacious, accepting awareness

🌺 ADVANCED TRACK (3+ mesi):

DAILY PRACTICE (20-30min):
1. CONCENTRATION PRACTICES:
   SINGLE-POINTED FOCUS:
   - Choose object (breath, candle flame, mantra)
   - Sustain attention without wandering
   - Build samatha (calm abiding)

   MANTRA MEDITATION:
   - "Om" or "So Hum" or personal mantra
   - Coordinate with breathing
   - Let vibration permeate being

2. INSIGHT PRACTICES:
   VIPASSANA WALKING:
   - Extremely slow walking
   - Aware of each component of step
   - Lifting, moving, placing
   - Can be indoor, 10-20 steps

   INVESTIGATING EMOTIONS:
   - When strong emotion arises
   - Turn toward it with curiosity
   - Where felt in body?
   - What's the actual sensation?
   - Watch it change and pass

📱 DAILY INTEGRATION:

MICRO-MEDITATIONS (30sec-2min):
- RED LIGHT MEDITATION: Breathing awareness at traffic lights
- ELEVATOR MEDITATION: Body scan during elevator rides  
- PHONE MEDITATION: 3 breaths before answering calls
- EATING MEDITATION: First 3 bites in complete awareness

MINDFUL ACTIVITIES:
- Brushing teeth with full attention
- Walking meditation to car/work
- Mindful listening in conversations
- Single-tasking vs multitasking

🎯 SPECIFIC APPLICATIONS:

FOR ANXIETY:
- 4-7-8 breathing technique
- Body scan to ground in present
- Loving-kindness for self-compassion
- RAIN technique (Recognize, Allow, Investigate, Nurture)

FOR FOCUS:
- Concentration on single object
- Counting breaths 1-10 repeatedly
- Mantra meditation
- Candle gazing (trataka)

FOR SLEEP:
- Body scan releasing tension
- Gratitude reflection
- 4-7-8 breathing
- Yoga nidra practice

🌟 RETREAT DAYS (Monthly):
- 2-4 hours dedicated practice
- Alternate sitting and walking
- Noble silence (no talking)
- Journal insights
- Deepen understanding through extended practice

💡 KEY PRINCIPLES:
- Consistency over duration
- Progress isn't linear
- Thoughts aren't the enemy
- Compassion for yourself
- Integration into daily life is the goal`
            },

            yoga: {
                keywords: ['yoga', 'asana', 'vinyasa', 'hatha', 'flow'],
                program: `🧘‍♀️ PROGRAMMA YOGA COMPLETO

🌅 MORNING ENERGIZING FLOW (20min):

SUN SALUTATION A (5 rounds):
1. MOUNTAIN POSE (Tadasana): 5 breaths
   - Feet hip-width, arms at sides
   - Ground through feet, lengthen spine

2. UPWARD SALUTE: Inhale, arms overhead
3. STANDING FORWARD FOLD: Exhale, fold forward
4. HALF LIFT: Inhale, hands to shins
5. LOW PUSH-UP: Exhale, step/jump back, lower
6. UPWARD FACING DOG: Inhale, chest forward
7. DOWNWARD DOG: Exhale, roll over toes
8. STANDING FORWARD FOLD: Inhale, step/jump forward
9. MOUNTAIN POSE: Exhale, return to standing

STANDING SEQUENCE (Hold 5-8 breaths each):
- WARRIOR I (right): Back foot 45°, front knee over ankle
- WARRIOR II: Open hips, arms parallel floor
- SIDE ANGLE: Right elbow on thigh, left arm overhead
- TRIANGLE: Straighten front leg, hand to shin/block
- WIDE-LEGGED FORWARD FOLD: Feet wide, fold forward

Repeat left side

SEATED CLOSING:
- SEATED SPINAL TWIST: 1min each side
- SEATED FORWARD FOLD: 2min
- SAVASANA: 3-5min complete relaxation

🌙 EVENING RESTORATIVE FLOW (25min):

GENTLE WARM-UP:
1. CAT-COW: 8-10 rounds, coordinate breath
2. CHILD'S POSE: 2min, arms extended or by sides
3. GENTLE TWISTS: Seated, 1min each side

YIN YOGA SEQUENCE (Hold 3-5min each):
1. BUTTERFLY POSE:
   - Soles of feet together, fold forward
   - Support head with block/pillow
   - Deep hip opening

2. DRAGON POSE: 
   - Low lunge, back knee down
   - Sink hips forward, hands inside front foot
   - Each side, deep hip flexor stretch

3. CATERPILLAR:
   - Seated, legs straight, fold forward
   - Round spine, let head hang
   - Hamstring and spine release

4. SUPPORTED FISH:
   - Bolster/pillow under shoulder blades
   - Arms open wide, heart opening
   - Counter all day's forward folding

5. LEGS UP WALL:
   - Lie near wall, legs up wall
   - Arms wide, completely passive
   - Calms nervous system

FINAL SAVASANA: 8-10min
- Complete stillness
- Body completely supported
- Let go of day's tension

💪 POWER YOGA FLOW (45min):

DYNAMIC WARM-UP (10min):
- Joint mobility: all major joints
- 3 rounds Sun Salutation A
- 2 rounds Sun Salutation B (add Warrior I)

STRENGTH BUILDING SEQUENCE:
1. CHAIR POSE FLOW:
   Chair → Forward Fold → Half Lift → Chair
   5 rounds, build heat

2. WARRIOR III SEQUENCE:
   - Warrior I → Warrior III → Standing Split
   - Each side, hold 30sec each pose

3. ARM BALANCE PREPARATION:
   - Crow pose prep: Squat, hands down
   - Build to lifting toes off ground
   - Dolphin prep: Forearm plank

PEAK POSES (Hold 30-60sec):
- SIDE PLANK: Each side, modify on knee if needed
- CROW POSE: Balance on hands, knees to elbows
- FOREARM STAND: Against wall for support
- WHEEL POSE: Full backbend or bridge variation

COOL DOWN (10min):
- Seated twists: Release spine
- Happy baby: Knees to chest, rock side to side
- Savasana: Complete integration

🎯 SPECIALIZED SEQUENCES:

FOR BACK PAIN:
- Cat-cow: Mobilize spine
- Knee to chest: Release lower back
- Supine twist: Decompress
- Child's pose: Rest and restore
- Avoid: Deep backbends, forward folds with straight legs

FOR STRESS RELIEF:
- Legs up wall: 10-15min
- Supported child's pose: With bolster
- Gentle twists: Release tension
- Extended savasana: 15-20min
- Focus on exhale longer than inhale

FOR HIP OPENING:
- Low lunge variations
- Pigeon pose and variations
- Butterfly and bound angle
- Figure-4 stretch
- Happy baby pose

FOR HEART OPENING:
- Camel pose (on shins)
- Fish pose variations
- Wheel pose progression
- Bridge pose flows
- Cobra to upward dog

📚 YOGA PHILOSOPHY INTEGRATION:
- AHIMSA (Non-harm): Listen to body, don't force
- SANTOSHA (Contentment): Accept where you are today
- TAPAS (Discipline): Consistent daily practice
- PRANAYAMA (Breath): Coordinate movement with breath
- DHARANA (Concentration): Stay present on mat

💡 PRACTICE TIPS:
- Quality over quantity
- Modify poses for your body
- Use props (blocks, straps, bolsters)
- Breathe deeply throughout
- End every practice with savasana
- Practice 3-6x per week for benefits`
            },

            mindfulness: {
                keywords: ['mindfulness', 'presenza', 'consapevolezza', 'attenzione', 'momento presente'],
                program: `🌟 PROGRAMMA MINDFULNESS QUOTIDIANA

🧠 FOUNDATION PRINCIPLES:

MINDFULNESS DEFINITION:
- Present moment awareness
- Non-judgmental observation
- Accepting what is, without resistance
- Seeing thoughts/emotions as temporary events
- Cultivating witness consciousness

CORE PRACTICES:
1. MINDFUL BREATHING
2. BODY AWARENESS
3. THOUGHT WATCHING
4. EMOTIONAL REGULATION
5. MINDFUL DAILY ACTIVITIES

🌅 DAILY PRACTICE STRUCTURE:

MORNING FOUNDATION (10min):
1. MINDFUL AWAKENING (2min):
   - Before getting up, feel body in bed
   - Notice quality of mind upon waking
   - Set intention for mindful day

2. BREATH AWARENESS (5min):
   - Comfortable seated position
   - Natural breathing, no control
   - When mind wanders, gently return
   - Count breaths 1-10, repeat

3. DAILY INTENTION (3min):
   - How do you want to show up today?
   - What qualities to cultivate?
   - Visualize mindful interactions

MIDDAY CHECK-IN (3-5min):
- PAUSE AND RESET:
  - Stop whatever you're doing
  - Take 5 conscious breaths
  - Body scan: tension? relaxation?
  - Mind scan: busy? calm? scattered?
  - Emotional check: what's present?

EVENING REFLECTION (8min):
1. GRATITUDE PRACTICE (3min):
   - 3 specific things you're grateful for
   - Feel appreciation in your body
   - Include challenges as growth opportunities

2. DAY REVIEW (3min):
   - When were you most present?
   - When did you operate on autopilot?
   - What triggered reactive patterns?
   - No judgment, just awareness

3. LOVING-KINDNESS (2min):
   - Send good wishes to yourself
   - Extend to loved ones
   - Include difficult people
   - Extend to all beings

🎯 MINDFUL DAILY ACTIVITIES:

MINDFUL EATING:
- First bite in complete silence
- Chew slowly, taste fully
- Notice textures, temperatures, flavors
- Eat without distractions (no phone/TV)
- Pay attention to hunger/satiety cues

MINDFUL WALKING:
- Feel feet connecting with ground
- Notice rhythm of steps
- Coordinate with breathing
- Observe surroundings without judgment
- Can be done anywhere, any pace

MINDFUL LISTENING:
- Give full attention to speaker
- Notice urge to interrupt or respond
- Listen to tone, emotion, not just words
- Stay present rather than planning response
- Practice with music, nature sounds

MINDFUL TECHNOLOGY USE:
- Pause before checking phone
- Notice impulse to reach for device
- Set specific times for email/social media
- Single-task instead of multitasking
- Use technology mindfully, not compulsively

🚨 MINDFULNESS FOR DIFFICULT EMOTIONS:

RAIN TECHNIQUE:
R - RECOGNIZE: What's happening right now?
A - ALLOW: Can I let this be here?
I - INVESTIGATE: How does this feel in my body?
N - NURTURE: What do I need right now?

ANXIETY MANAGEMENT:
- 5-4-3-2-1 GROUNDING:
  5 things you see
  4 things you can touch
  3 things you hear
  2 things you smell
  1 thing you taste

- ANXIETY BREATHING:
  Inhale for 4, hold for 4, exhale for 6
  Longer exhale activates parasympathetic

ANGER TRANSFORMATION:
- STOP technique:
  S - Stop what you're doing
  T - Take a breath
  O - Observe what's happening
  P - Proceed with awareness

- Notice anger in body:
  Where do you feel it? Hot? Tight?
  Breathe into that area
  Remember: emotions are temporary

💼 WORKPLACE MINDFULNESS:

MINDFUL TRANSITIONS:
- 3 breaths between meetings
- Mindful walking to bathroom/coffee
- Set mindfulness reminders on phone
- Practice desk-based breathing exercises

MINDFUL EMAIL:
- Read full email before responding
- Take breath before typing response
- Choose words consciously
- Send with intention, not reaction

STRESS RESPONSE:
- Notice early warning signs
- Take micro-breaks (30 seconds)
- Progressive muscle relaxation at desk
- Mindful lunch breaks away from work

🏠 FAMILY MINDFULNESS:

MINDFUL PARENTING:
- Listen fully when child speaks
- Notice your reactive patterns
- Take parent time-outs when triggered
- Model mindful behavior
- Create family mindfulness rituals

RELATIONSHIP PRACTICES:
- Mindful communication
- Listen without planning response
- Notice judgments about partner
- Express appreciation mindfully
- Create phone-free connection time

🎯 WEEKLY INTENSIVE PRACTICES:

MINDFUL NATURE TIME:
- 30min in natural setting
- Sit quietly, observe without agenda
- Notice all senses simultaneously
- Feel connection to larger web of life

DIGITAL SABBATH:
- Choose 2-4 hours technology-free
- Engage in analog activities
- Notice compulsions for stimulation
- Appreciate silence and stillness

MINDFUL MOVEMENT:
- Yoga, walking, or gentle exercise
- Coordinate movement with breath
- Feel body moving through space
- Appreciate body's capabilities

💡 INTEGRATION TIPS:
- Start small: 2-3 minutes daily
- Use triggers: doorways, phone rings
- Practice during routine activities
- Be patient with wandering mind
- Join mindfulness community/app
- Remember: every moment is new opportunity`
            }
        };
    }

    // 📊 CASI STUDIO E SUCCESS STORIES
    initializeCaseStudies() {
        this.caseStudies = {
            weightLoss: {
                keywords: ['perdere peso', 'dimagrimento', 'successo', 'trasformazione', 'caso studio'],
                stories: [
                    {
                        title: "Marco, 35 anni - Da 95kg a 78kg in 8 mesi",
                        story: `🎯 SITUAZIONE INIZIALE:
Marco, impiegato sedentario, 95kg, 1.78m (BMI 30)
- Lavoro d'ufficio 9h/giorno
- Nessuna attività fisica da 5 anni  
- Alimentazione disordinata (fast food, bevande zuccherate)
- Stress cronico, sonno irregolare

💪 PROTOCOLLO APPLICATO:
SETTIMANE 1-4: FONDAMENTA
- Camminata 30min/giorno dopo lavoro
- Eliminazione bevande zuccherate
- 3 pasti principali + 2 spuntini
- Tracking peso e circonferenze
- Sonno: 22:30-6:30 costante

SETTIMANE 5-12: INTENSIFICAZIONE
- Aggiunto 3x/sett strength training
- Deficit calorico 400 cal/giorno
- Proteine 140g/giorno (2g/kg target weight)
- Weekend: 1 pasto libero controllato
- Stress management: meditazione 10min/sera

SETTIMANE 13-32: PERIODIZZAZIONE
- Alternato fasi cutting/maintaining
- Varietà allenamenti: HIIT, forza, funzionale
- Refeed giorni strategici
- Tracking macros più preciso
- Supporto famiglia e amici

📊 RISULTATI:
- Peso: 95kg → 78kg (-17kg)
- Grasso corporeo: 25% → 12%
- Circonferenza vita: 98cm → 82cm
- Performance: Da 0 a 10 push-ups
- Energia: +300% soggettiva
- Sonno: Qualità migliorata drasticamente

🔑 FATTORI CHIAVE SUCCESSO:
- Progressione graduale sostenibile
- Focus su abitudini, non solo peso
- Supporto sociale e accountability
- Flessibilità nel protocollo
- Mindset a lungo termine`,
                        
                        lessons: `💡 LESSONS LEARNED:
1. CONSISTENCY > PERFECTION
2. Small changes compound over time
3. Environment setup crucial
4. Support system non-negotiable
5. Track behavior, not just outcomes`
                    },
                    
                    {
                        title: "Sofia, 28 anni - Da ansiosa a atleta in 12 mesi",
                        story: `🎯 SITUAZIONE INIZIALE:
Sofia, designer grafica, ansia generalizzata
- Attacchi di panico frequenti
- Sedentaria completa
- Bassa autostima corporea
- Dipendenza da caffè/zuccheri
- Sonno frammentato

💪 PROTOCOLLO APPLICATO:
MESI 1-3: STABILIZZAZIONE
- Yoga gentle 20min/giorno
- Breathing exercises per ansia
- Riduzione caffè graduale
- Routine sonno regolare
- Journal emozioni e trigger

MESI 4-8: BUILDING CONFIDENCE  
- Aggiunto bodyweight training
- Gruppi fitness per socializzazione
- Nutrizione anti-infiammatoria
- Terapia cognitivo-comportamentale
- Obiettivi fitness progressivi

MESI 9-12: TRANSFORMATION
- Training forza avanzato
- Prima gara amateur fitness
- Ruolo mentore per altri
- Alimentazione intuitiva
- Ansia gestita senza farmaci

📊 RISULTATI:
- Attacchi panico: Da 3-4/sett a 0
- Forza: Da 0 a 8 pull-ups
- Fiducia: Da 3/10 a 9/10
- Energia: Stabile tutto giorno
- Relazioni: Migliorate drasticamente
- Carriera: Promozione ottenuta

🔑 FATTORI CHIAVE:
- Movimento come medicina per mente
- Comunità fitness supportiva
- Progressi fisici → fiducia mentale
- Routine strutturate calmano ansia
- Obiettivi esterni motivanti`,
                        
                        lessons: `💡 INSIGHTS:
1. Exercise is medicine for mental health
2. Community accelerates transformation
3. Physical strength = mental resilience
4. Routine reduces anxiety
5. Helping others solidifies progress`
                    }
                ]
            },

            muscle_gain: {
                keywords: ['massa muscolare', 'muscle gain', 'ipertrofia', 'forza'],
                stories: [
                    {
                        title: "Luca, 22 anni - Da ectomorfo a +15kg massa in 18 mesi",
                        story: `🎯 SITUAZIONE INIZIALE:
Luca, studente universitario, 1.80m, 62kg
- Metabolismo velocissimo
- Difficoltà ad aumentare peso
- Mai fatto palestra sistematicamente
- Alimentazione casuale
- Stress da studio elevato

💪 PROTOCOLLO APPLICATO:
MESI 1-6: MASS BUILDING FASE 1
- Surplus calorico +500 cal/giorno
- 6 pasti/giorno, proteine ogni pasto
- Full body workout 3x/settimana
- Focus compound movements
- Riposo: 8-9h/notte programmato

MESI 7-12: INTENSIFICAZIONE
- Upper/Lower split 4x/settimana
- Proteine 150g/giorno (2.4g/kg)
- Creatina 5g/giorno
- Progressive overload costante
- Mini-cut 4 settimane per definire

MESI 13-18: SPECIALIZZAZIONE
- Push/Pull/Legs 6x/settimana  
- Periodizzazione volume/intensità
- Surplus calorico ridotto +300
- Tecniche avanzate (drop sets, rest-pause)
- Tracking dettagliato performance

📊 RISULTATI:
- Peso: 62kg → 77kg (+15kg)
- Massa magra: +12kg stimata
- Grasso corporeo: 8% → 12% (accettabile)
- Panca piana: 40kg → 95kg
- Squat: 50kg → 120kg
- Stacco: 60kg → 140kg

🔑 FATTORI CHIAVE:
- Pazienza per guadagni lenti
- Alimentazione precisa e costante
- Progressive overload sistematico
- Recovery priorità assoluta
- Mindset lungo termine`,
                        
                        lessons: `💡 HARD-GAINED WISDOM:
1. Ectomorphs can build muscle (just slower)
2. Eating is as important as training
3. Compound movements are foundation
4. Consistency beats perfection
5. Track everything measurable`
                    }
                ]
            },

            lifestyle_change: {
                keywords: ['cambiamento vita', 'stile di vita', 'trasformazione completa'],
                stories: [
                    {
                        title: "Elena, 45 anni - Da workaholic a life balance",
                        story: `🎯 SITUAZIONE INIZIALE:
Elena, executive manager, mamma di 2 figli
- 60h lavorative/settimana
- Zero tempo per se stessa
- Stress cronico, cortisolo alto
- 15kg sovrappeso post-gravidanze
- Relazioni familiari tese

💪 PROTOCOLLO APPLICATO:
MESI 1-3: TIME AUDIT
- Tracking tempo reale per 2 settimane
- Identificazione sprechi temporali
- Workout 15min mattina (non negoziabili)
- Meal prep domenica
- Boundaries lavorative rigide

MESI 4-9: SYSTEMS BUILDING
- 30min allenamento 4x/settimana
- Delegazione tasks lavorativi
- Family fitness activities weekend
- Mindfulness 10min/giorno
- Sleep hygiene priorità

MESI 10-18: INTEGRATION
- Lifestyle fitness (bike to work)
- Leadership con esempio sano
- Vacanze attive con famiglia
- Hobby ritrovati (pittura)
- Work-life boundaries solide

📊 RISULTATI:
- Peso: -12kg mantenuti stabilmente
- Energia: +400% soggettiva
- Stress: Da 9/10 a 4/10
- Relazioni: Drasticamente migliorate
- Carriera: Più produttiva in meno ore
- Figli: Modello positivo di vita

🔑 BREAKTHROUGH INSIGHTS:
- Time scarcity era illusione
- Exercise aumenta produttività
- Boundaries migliorano relazioni
- Modeling behavior per figli
- Health = ultimate productivity hack`,
                        
                        lessons: `💡 LIFE LESSONS:
1. Busy doesn't equal productive
2. Self-care enables caring for others
3. Small daily actions > grand gestures
4. Health improves everything else
5. You teach others how to treat you`
                    }
                ]
            }
        };
    }

    // ❓ FAQ COMUNI DEL FITNESS
    initializeCommonFAQs() {
        this.commonFAQs = {
            workout: [
                {
                    question: "Quante volte a settimana devo allenarmi?",
                    answer: `🏋️ FREQUENZA ALLENAMENTO OTTIMALE:

🌱 PRINCIPIANTI (0-6 mesi):
- 3x/settimana full body
- Giorni alterni per recovery
- Focus su apprendimento tecnico
- 45-60min per sessione

💪 INTERMEDI (6-24 mesi):
- 4-5x/settimana upper/lower o push/pull/legs
- Può gestire volume maggiore
- Specializzazione su weak points
- 60-75min per sessione

🏆 AVANZATI (2+ anni):
- 5-6x/settimana split avanzati
- Recovery attivo nei rest days
- Periodizzazione specifica
- 75-90min per sessione

🎯 FATTORI DETERMINANTI:
- Obiettivi specifici
- Capacità di recovery
- Tempo disponibile
- Stress extra-palestra
- Esperienza di allenamento

💡 REGOLA D'ORO: 
Meglio 3 allenamenti costanti che 6 saltuari!`
                },
                
                {
                    question: "È meglio cardio o pesi per dimagrire?",
                    answer: `🔥 CARDIO VS PESI PER FAT LOSS:

⚖️ LA VERITÀ:
- Deficit calorico è l'unico requisito
- Pesi preservano massa muscolare
- Cardio brucia calorie immediate
- Combinazione = risultati ottimali

🏋️ PESI VANTAGGI:
- EPOC: Consumo post-workout
- Preserva/costruisce muscolo
- Migliora metabolismo basale
- Forma corporea migliore
- Efficienza temporale

🏃 CARDIO VANTAGGI:
- Calorie bruciate maggiori durante
- Miglioramento cardiovascolare
- Stress relief mentale
- Varietà di modalità
- Accessibile a tutti

🎯 STRATEGIA OTTIMALE:
70% pesi + 30% cardio
- 3-4x pesi/settimana
- 2-3x cardio/settimana
- Alternanza HIIT/LISS
- Recovery active nei rest days

💡 RICORDA:
Dieta > Pesi > Cardio per fat loss
Ma tutti e tre insieme = risultati ottimali!`
                },

                {
                    question: "Quante proteine devo mangiare al giorno?",
                    answer: `🥩 FABBISOGNO PROTEICO PERSONALIZZATO:

📊 GUIDELINES GENERALI:
🌱 SEDENTARI: 0.8-1.2g/kg
💪 ATTIVI: 1.4-1.8g/kg  
🏋️ STRENGTH TRAINING: 1.6-2.2g/kg
🏃 ENDURANCE: 1.2-1.6g/kg
🔥 CUTTING: 2.0-2.8g/kg

🎯 ESEMPIO PRATICO (70kg person):
- Sedentario: 56-84g/giorno
- Attivo fitness: 98-126g/giorno
- Bodybuilding: 112-154g/giorno
- Cutting: 140-196g/giorno

⏰ TIMING IMPORTANTE:
- 20-30g per pasto
- Post-workout: 25-40g entro 2h
- Pre-bed: 20-30g caseine
- Distribuzione uniforme migliore

🥗 FONTI QUALITATIVE:
Animali (complete):
- Pollo, manzo, pesce, uova
- Latticini, whey protein

Vegetali (combine per complete):
- Legumi + cereali
- Quinoa, soia, hemp
- Plant protein powders

💡 SEGNALI ADEGUATEZZA:
- Recovery muscolare buono
- Sazietà tra pasti
- Performance stabile
- Composizione corporea migliora`
                },

                {
                    question: "Posso allenarmi se ho dolore muscolare?",
                    answer: `💪 DOMS vs DOLORE - GUIDA PRATICA:

✅ DOMS (Delayed Onset Muscle Soreness):
CARATTERISTICHE:
- Dolore sordo, diffuso
- 24-72h post-workout
- Peggiora con stiramento
- Migliora con movimento leggero
- Nessun dolore acuto

GESTIONE:
- Light movement/active recovery
- Stretching gentle
- Foam rolling
- Massaggio
- Calore (doccia calda)

🔴 DOLORE DA EVITARE:
WARNING SIGNS:
- Dolore acuto, localizzato
- Peggiora con movimento
- Presente durante workout
- Gonfiore/lividi
- Perdita funzione

AZIONE:
- STOP allenamento immediato
- RICE protocol (Rest, Ice, Compression, Elevation)
- Consulta professionista se persiste

🎯 DECISION MATRIX:
DOMS leggero (1-3/10): ✅ Allena
DOMS moderato (4-6/10): ⚠️ Active recovery
DOMS severo (7+/10): ❌ Rest completo
Dolore acuto: 🚨 STOP + valutazione

💡 PREVENZIONE DOMS:
- Warm-up adeguato
- Progressione graduale
- Cool-down con stretching
- Idratazione costante
- Sonno 7-9h/notte`
                },

                {
                    question: "Come faccio a rimanere motivato nel lungo termine?",
                    answer: `🎯 MOTIVATION → DISCIPLINE → SYSTEMS:

🧠 PSYCHOLOGY OF MOTIVATION:
Motivation fluctuates (normale!)
Discipline creates consistency
Systems make it automatic

🔥 BUILDING INTRINSIC MOTIVATION:
1. CONNECT TO YOUR WHY:
   - Salute famiglia
   - Energia quotidiana
   - Fiducia in se stessi
   - Longevità vita
   - Esempio per altri

2. PROCESS GOALS vs OUTCOME:
   ❌ "Perdere 10kg"
   ✅ "Allenarmi 4x/settimana"
   ✅ "Mangiare 5 porzioni verdure/giorno"

3. IDENTITY-BASED HABITS:
   "I am someone who exercises"
   Non "I want to exercise"

🛠️ PRACTICAL SYSTEMS:
ENVIRONMENT DESIGN:
- Gym clothes ready sera prima
- Healthy snacks sempre visibili
- Remove barriers to good habits
- Add friction to bad habits

SOCIAL ACCOUNTABILITY:
- Workout buddy
- Join fitness communities
- Share goals publicly
- Progress photos/tracking

REWARD SYSTEMS:
- Non-food rewards
- New workout clothes
- Massage dopo milestones
- Track small wins daily

📊 TRACKING MOTIVATION:
Daily habits tracker
Weekly progress photos
Monthly measurements
Quarterly goal review

🎪 VARIETY & CHALLENGE:
- Change workouts ogni 4-6 settimane
- Try new fitness activities
- Set performance goals
- Join events/challenges

💡 MINDSET SHIFTS:
- Progress not perfection
- Consistency over intensity
- Journey not destination
- Growth mindset
- Self-compassion importante`
                }
            ],

            nutrition: [
                {
                    question: "Devo contare le calorie per sempre?",
                    answer: `📊 CALORIE COUNTING - TOOL, NON PRIGIONE:

🎯 FASI DEL RAPPORTO CON CALORIE:

FASE 1 - AWARENESS (2-3 mesi):
- Track tutto per educazione
- Impara porzioni reali
- Identifica pattern alimentari
- Scopri calorie nascoste
- Costruisci database mentale

FASE 2 - PRECISION (Goal specifici):
- Count durante cut/bulk
- Competizioni o obiettivi precisi
- Plateau breaking
- Medical reasons
- Performance optimization

FASE 3 - INTUITIVE (Long-term):
- Tracking sporadico/check-in
- Ascolto segnali fame/sazietà
- Flexible approach
- Focus qualità vs quantità
- Sustainable lifestyle

🔄 WHEN TO COUNT:
✅ Starting journey (education)
✅ Specific goals (contest prep)
✅ Plateau troubleshooting
✅ Medical monitoring
✅ Research/optimization

❌ WHEN TO STOP:
- Causing anxiety/obsession
- Social life impacted
- Disordered eating patterns
- Intuitive eating mastered
- Maintenance achieved

💡 MIDDLE GROUND APPROACHES:
- Hand portion method
- Plate method (1/2 veggies, 1/4 protein, 1/4 carbs)
- Weekly averages vs daily
- Photos instead of numbers
- Mindful eating practices

🎯 GOAL: Counting teaches you to NOT count!`
                },

                {
                    question: "Gli integratori sono necessari?",
                    answer: `💊 SUPPLEMENTS: NICE TO HAVE, NOT MUST HAVE

🏆 PRIORITY PYRAMID:

LEVEL 1 - FOUNDATION (90% risultati):
1. Calorie totali appropriate
2. Macronutrienti bilanciati  
3. Micronutrienti da cibi whole
4. Idratazione adeguata
5. Timing nutrizionale base

LEVEL 2 - OPTIMIZATION (8% risultati):
- Creatina monoidrato
- Vitamina D (se deficiente)
- Omega-3 (se low fish intake)
- Whey protein (convenience)

LEVEL 3 - FINE TUNING (2% risultati):
- Caffeina pre-workout
- Beta-alanina (endurance)
- Citrullina (pump)
- Multivitaminico (insurance)

🔬 EVIDENCE-BASED ESSENTIALS:

CREATINA:
- Most researched supplement
- 3-5g daily (timing irrelevant)
- Works for 70% people
- Helps strength, power, recovery

VITAMINA D:
- Test blood levels first
- 2000-4000 IU if deficient
- Crucial for bone health, immunity
- Especially important for indoor athletes

PROTEIN POWDER:
- Convenience factor mainly
- Useful if struggling to hit targets
- Not superior to whole foods
- Quality matters (third-party tested)

❌ MARKETING SCAMS:
- Fat burners (except caffeine)
- Testosterone boosters "naturali"
- BCAAs (if eating enough protein)
- Mass gainers (make your own)
- Detox/cleanse products

💰 MONEY-SAVING TRUTH:
99% of supplements are unnecessary
Focus budget on quality whole foods
Creatina + Vitamina D + good diet > expensive stack

🎯 DECISION FRAMEWORK:
1. Is my diet dialed in?
2. Is there scientific evidence?
3. Does cost justify minimal benefit?
4. Am I using it to avoid real work?

💡 REMEMBER: Supplements supplement, not replace!`
                },

                {
                    question: "Posso mangiare carboidrati la sera?",
                    answer: `🌙 CARBOIDRATI SERALI - MITO VS SCIENZA:

🔬 COSA DICE LA RICERCA:

METABOLISMO NON SI FERMA:
- Metabolismo basale attivo 24/7
- Difference giorno/notte <10%
- Timing < Total daily intake
- Context matters more than clock

CARBS EVENING BENEFITS:
- Migliorano qualità sonno
- Supportano recovery muscolare
- Riducono cortisolo notturno
- Aumentano serotonina→melatonina
- Refill glicogeno durante riposo

🎯 QUANDO EVITARE CARBS SERA:

INSULIN RESISTANCE:
- Diabete tipo 2
- PCOS severe
- Metabolismo compromesso
- Sedentarietà estrema

DIGESTIVE ISSUES:
- Reflusso gastroesofageo
- Digestione lenta
- Sleep disruption da pasti pesanti

🕐 TIMING GUIDELINES:

OPTIMAL WINDOW:
- 2-3h prima di dormire
- Permette digestione completa
- Non interferisce con sleep
- Still benefits from carbs

BEST EVENING CARBS:
✅ Complex, slower digesting:
- Sweet potato
- Quinoa  
- Oats
- Rice integrale

❌ Avoid high sugar:
- Candy, desserts
- Fruit juices
- High GI processed foods

💡 PRACTICAL EXAMPLES:

POST-WORKOUT DINNER (6-7pm):
- Chicken breast
- Sweet potato  
- Steamed broccoli
- Perfect timing for recovery

LATE WORKER (9-10pm):
- Greek yogurt
- Berries
- Small amount oats
- Light but satisfying

🎯 BOTTOM LINE:
- Total calories matter most
- Carbs won't magically turn to fat at night
- Listen to your body
- Quality over timing
- Individual variation exists

Context > Timing > Type > Amount!`
                }
            ],

            recovery: [
                {
                    question: "Quanto sonno serve per il recupero muscolare?",
                    answer: `😴 SLEEP - THE ULTIMATE PERFORMANCE ENHANCER:

🔬 SCIENCE OF SLEEP & RECOVERY:

GROWTH HORMONE RELEASE:
- 70% rilasciato durante deep sleep
- Picco 1-3h dopo addormentamento
- Critico per muscle repair
- Synthetic proteico aumentato

TESTOSTERONE & CORTISOL:
- Testosterone peak al mattino dopo good sleep
- Cortisol regulated da circadian rhythm
- Sleep debt = cortisol elevation = catabolism
- Even una notte bad sleep affects hormones

💪 SLEEP REQUIREMENTS:

ATHLETES: 8-10h per notte
- Extra 1-2h rispetto sedentari
- Più intense training = più sleep needs
- Elite athletes often sleep 10-12h

RECREATIONAL FITNESS: 7-9h
- Minimum 7h per basic recovery
- Sweet spot 8-8.5h per most people
- Quality > quantity (but both matter)

⚡ SLEEP DEBT CONSEQUENCES:

PERFORMANCE IMPACTS:
- -10-30% strength dopo 2-3 nights poor sleep
- Reaction time slower
- Motivation decreased
- Perceived exertion increased

RECOVERY IMPACTS:
- Protein synthesis decreased
- Inflammation increased  
- Immune function compromised
- Fat loss impaired (leptin/ghrelin disrupted)

🛏️ SLEEP OPTIMIZATION:

ENVIRONMENT:
- Temperature: 16-19°C
- Darkness: Blackout curtains/eye mask
- Silence: Earplugs/white noise
- Comfortable mattress/pillows

PRE-SLEEP ROUTINE:
- No screens 1h before bed
- Dim lights 2h before
- Reading, meditation, stretching
- Consistent bedtime ±30min

SUPPLEMENTS (if needed):
- Magnesium: 200-400mg
- Melatonin: 0.5-3mg (lowest effective dose)
- L-theanine: 100-200mg
- Avoid: Alcohol, caffeine 6h+ before bed

📊 TRACKING SLEEP QUALITY:
- Wearable devices (Whoop, Oura)
- Sleep diary subjective rating
- Morning HRV measurements
- Performance correlation

💡 RED FLAGS FOR MEDICAL EVAL:
- Chronic snoring
- Stopping breathing during sleep
- Never feeling rested
- Falling asleep uncontrollably
- Restless legs

🎯 ACTION STEPS:
1. Prioritize 8h sleep opportunity
2. Create optimal environment
3. Establish consistent routine
4. Track and correlate with performance
5. Treat sleep like training - non-negotiable!

Remember: You don't build muscle in gym, you build it in bed!`
                },

                {
                    question: "Cosa fare nei giorni di riposo?",
                    answer: `🔄 REST DAYS - ACTIVE RECOVERY MASTERY:

🎯 REST DAY PHILOSOPHY:
Rest ≠ Sedentary
Recovery is ACTIVE process
Movement promotes blood flow
Light activity > complete immobility

💪 ACTIVE RECOVERY OPTIONS:

LOW INTENSITY CARDIO (Zone 1):
- Walking 30-60min
- Easy bike ride
- Swimming lento
- Elliptical conversation pace
- Benefits: Blood flow, metabolic waste removal

MOBILITY & FLEXIBILITY:
- Yoga flow 20-45min
- Static stretching routine
- Foam rolling session
- Dynamic stretching
- Benefits: Range of motion, tension release

STRESS MANAGEMENT:
- Meditation 10-20min
- Nature walks
- Reading, hobbies
- Social activities
- Benefits: Cortisol reduction, mental recovery

🧘 RECOVERY PROTOCOLS:

MORNING ROUTINE:
- Gentle movement/stretching 10min
- Hydration focus
- Light breakfast
- Sunlight exposure
- Set positive intention

MIDDAY OPTIONS:
- Walk during lunch
- Desk stretches if working
- Breathing exercises
- Light housework/gardening

EVENING WIND-DOWN:
- Foam rolling 15-20min
- Hot bath with Epsom salts
- Gentle yoga/stretching
- Early bedtime preparation

🍽️ REST DAY NUTRITION:

CALORIE INTAKE:
- Slight reduction from training days
- Still adequate for recovery
- Don't drastically cut calories
- Listen to hunger cues

MACRO FOCUS:
- Maintain protein for muscle repair
- Anti-inflammatory foods
- Adequate carbs for glycogen
- Healthy fats for hormones

HYDRATION:
- Continue adequate water intake
- Herbal teas for relaxation
- Avoid excessive alcohol
- Monitor urine color

🚫 WHAT TO AVOID:

COMPLETE IMMOBILITY:
- All-day couch surfing
- Prolonged sitting
- Zero movement
- Binge-watching marathons

STRESS INDUCERS:
- Intense work sessions
- Relationship conflicts
- Financial stress
- Overthinking training

POOR CHOICES:
- Alcohol excess
- Junk food binges  
- Late nights
- Stimulant overuse

📊 RECOVERY MONITORING:

SUBJECTIVE MEASURES:
- Energy level 1-10
- Mood assessment
- Sleep quality rating
- Muscle soreness level
- Motivation for next workout

OBJECTIVE MEASURES:
- Heart rate variability (HRV)
- Resting heart rate
- Body weight trends
- Performance markers

🎯 REST DAY SUCCESS:

PLAN YOUR REST:
- Schedule like workouts
- Prepare activities in advance
- Have backup options
- Make it enjoyable

LISTEN TO BODY:
- Some days need complete rest
- Other days can handle more activity
- Adjust based on training load
- Trust your intuition

💡 MINDSET SHIFT:
Rest days aren't earned, they're required
Recovery is where adaptation happens
Active recovery > passive rest
Quality rest = better workouts

Remember: Champions are made on rest days!`
                }
            ]
        };
    }

    // 🔍 SISTEMA DI RICERCA INTELLIGENTE AVANZATO
    generateAdvancedResponse(userMessage, context = {}) {
        const message = userMessage.toLowerCase();
        let bestMatch = null;
        let bestScore = 0;
        let responseType = 'general';

        // 1. CERCA NELLE METODOLOGIE DI ALLENAMENTO
        for (const [method, data] of Object.entries(this.trainingMethodologies)) {
            const score = this.calculateAdvancedMatchScore(message, data.keywords);
            if (score > bestScore) {
                bestScore = score;
                bestMatch = {
                    content: this.formatTrainingMethodology(method, data, message),
                    type: 'training_methodology',
                    confidence: score
                };
                responseType = 'training';
            }
        }

        // 2. CERCA NELLA NUTRIZIONE AVANZATA
        for (const [topic, data] of Object.entries(this.advancedNutrition)) {
            const score = this.calculateAdvancedMatchScore(message, data.keywords);
            if (score > bestScore) {
                bestScore = score;
                bestMatch = {
                    content: data.content,
                    type: 'advanced_nutrition',
                    confidence: score
                };
                responseType = 'nutrition';
            }
        }

        // 3. CERCA NEI PROGRAMMI SPECIFICI
        for (const [program, data] of Object.entries(this.specificPrograms)) {
            const score = this.calculateAdvancedMatchScore(message, data.keywords);
            if (score > bestScore) {
                bestScore = score;
                bestMatch = {
                    content: data.program,
                    type: 'specific_program',
                    confidence: score
                };
                responseType = 'wellness';
            }
        }

        // 4. CERCA NEI CASI STUDIO
        if (message.includes('successo') || message.includes('caso') || message.includes('esempio') || message.includes('storia')) {
            const caseStudy = this.findRelevantCaseStudy(message);
            if (caseStudy && bestScore < 0.8) {
                bestMatch = {
                    content: this.formatCaseStudy(caseStudy),
                    type: 'case_study',
                    confidence: 0.8
                };
                responseType = 'inspiration';
            }
        }

        // 5. CERCA NELLE FAQ
        const faqMatch = this.findBestFAQ(message);
        if (faqMatch && faqMatch.score > bestScore) {
            bestMatch = {
                content: `❓ ${faqMatch.question}\n\n${faqMatch.answer}`,
                type: 'faq',
                confidence: faqMatch.score
            };
            responseType = 'faq';
        }

        return bestMatch ? {
            ...bestMatch,
            responseType: responseType,
            suggestions: this.generateFollowUpSuggestions(responseType, message)
        } : null;
    }

    // 🔢 CALCOLO SCORE AVANZATO
    calculateAdvancedMatchScore(message, keywords) {
        let score = 0;
        let totalKeywords = keywords.length;
        let wordMatches = 0;

        // Exact matches
        keywords.forEach(keyword => {
            if (message.includes(keyword.toLowerCase())) {
                wordMatches++;
                score += 1;
            }
        });

        // Partial matches and synonyms
        const synonymMap = {
            'allenamento': ['workout', 'training', 'esercizio'],
            'dieta': ['alimentazione', 'nutrizione', 'cibo'],
            'massa': ['ipertrofia', 'muscoli', 'bulk'],
            'definizione': ['cut', 'dimagrimento', 'grasso'],
            'forza': ['strength', 'potenza', 'massimali'],
            'cardio': ['aerobico', 'resistenza', 'endurance']
        };

        for (const [key, synonyms] of Object.entries(synonymMap)) {
            if (keywords.includes(key)) {
                synonyms.forEach(synonym => {
                    if (message.includes(synonym)) {
                        score += 0.5;
                    }
                });
            }
        }

        return Math.min(score / totalKeywords, 1.0);
    }

    // 📋 FORMATTA METODOLOGIA DI ALLENAMENTO
    formatTrainingMethodology(method, data, userMessage) {
        let response = data.theory;
        
        // Aggiungi workout se richiesto
        if (userMessage.includes('workout') || userMessage.includes('allenamento') || 
            userMessage.includes('programma') || userMessage.includes('esercizi')) {
            response += '\n\n' + data.workout;
        }

        return response;
    }

    // 📚 TROVA CASO STUDIO RILEVANTE
    findRelevantCaseStudy(message) {
        if (message.includes('peso') || message.includes('dimagrire')) {
            return this.caseStudies.weightLoss.stories[0];
        }
        if (message.includes('massa') || message.includes('muscoli')) {
            return this.caseStudies.muscle_gain.stories[0];
        }
        if (message.includes('vita') || message.includes('stress') || message.includes('equilibrio')) {
            return this.caseStudies.lifestyle_change.stories[0];
        }
        if (message.includes('ansia') || message.includes('mentale')) {
            return this.caseStudies.weightLoss.stories[1];
        }
        return null;
    }

    // 📖 FORMATTA CASO STUDIO
    formatCaseStudy(caseStudy) {
        return `🌟 CASO STUDIO: ${caseStudy.title}

${caseStudy.story}

${caseStudy.lessons}

💪 Vuoi sapere come applicare questi principi al tuo caso? Dimmi i tuoi obiettivi specifici!`;
    }

    // ❓ TROVA MIGLIORE FAQ
    findBestFAQ(message) {
        let bestMatch = null;
        let bestScore = 0;

        // Cerca in tutte le categorie FAQ
        for (const [category, faqs] of Object.entries(this.commonFAQs)) {
            faqs.forEach(faq => {
                const questionKeywords = faq.question.toLowerCase().split(' ');
                let score = 0;
                
                questionKeywords.forEach(keyword => {
                    if (keyword.length > 3 && message.includes(keyword)) {
                        score += 1;
                    }
                });

                // Boost score per keywords specifiche
                if (message.includes('quant')) score += 2;
                if (message.includes('come')) score += 1;
                if (message.includes('perché') || message.includes('perche')) score += 1;
                if (message.includes('devo') || message.includes('posso')) score += 1;

                const normalizedScore = score / questionKeywords.length;
                
                if (normalizedScore > bestScore && normalizedScore > 0.3) {
                    bestScore = normalizedScore;
                    bestMatch = {
                        ...faq,
                        score: normalizedScore
                    };
                }
            });
        }

        return bestMatch;
    }

    // 💡 GENERA SUGGERIMENTI FOLLOW-UP
    generateFollowUpSuggestions(responseType, originalMessage) {
        const suggestions = {
            training: [
                "Vuoi un programma personalizzato per il tuo livello?",
                "Ti serve aiuto con la progressione degli esercizi?",
                "Hai domande sulla tecnica di esecuzione?"
            ],
            nutrition: [
                "Vuoi calcolare i tuoi macro personalizzati?",
                "Ti serve un piano alimentare specifico?",
                "Hai domande sui timing dei pasti?"
            ],
            wellness: [
                "Vuoi integrare questo nella tua routine quotidiana?",
                "Ti serve aiuto per iniziare gradualmente?",
                "Hai domande su come adattarlo al tuo stile di vita?"
            ],
            faq: [
                "Hai altre domande correlate?",
                "Vuoi approfondire qualche aspetto specifico?",
                "Ti serve un esempio pratico?"
            ],
            inspiration: [
                "Vuoi sapere come adattare questo approccio a te?",
                "Ti interessa un piano simile personalizzato?",
                "Hai obiettivi simili a questo caso studio?"
            ]
        };

        return suggestions[responseType] || [
            "Hai altre domande su questo argomento?",
            "Vuoi approfondire qualche aspetto specifico?",
            "Ti serve aiuto con l'applicazione pratica?"
        ];
    }

    // 🎯 METODO PRINCIPALE PER INTEGRAZIONE
    getAdvancedKnowledgeResponse(userMessage, context = {}) {
        const response = this.generateAdvancedResponse(userMessage, context);
        
        if (response && response.confidence > 0.4) {
            return {
                content: response.content,
                confidence: response.confidence > 0.7 ? 'high' : 'medium',
                type: response.type,
                responseType: response.responseType,
                suggestions: response.suggestions,
                isAdvancedKnowledge: true
            };
        }

        return null;
    }

    // 📊 ANALYTICS E STATISTICHE
    getKnowledgeBaseStats() {
        return {
            trainingMethodologies: Object.keys(this.trainingMethodologies).length,
            nutritionTopics: Object.keys(this.advancedNutrition).length,
            wellnessPrograms: Object.keys(this.specificPrograms).length,
            caseStudies: Object.values(this.caseStudies).reduce((total, category) => 
                total + category.stories.length, 0),
            totalFAQs: Object.values(this.commonFAQs).reduce((total, category) => 
                total + category.length, 0),
            coverageAreas: [
                'Training Methodologies',
                'Advanced Nutrition', 
                'Wellness Programs',
                'Success Stories',
                'Common Questions'
            ]
        };
    }
}

// 🔗 INTEGRAZIONE CON SISTEMA ESISTENTE
class EnhancedKnowledgeSystem {
    constructor(existingKnowledgeBase) {
        this.basicKB = existingKnowledgeBase;
        this.advancedKB = new AdvancedKnowledgeBase();
        
        console.log('🧠 Enhanced Knowledge System inizializzato');
        console.log('📊 Stats:', this.advancedKB.getKnowledgeBaseStats());
    }

    // 🎯 METODO UNIFICATO DI RICERCA
    generateSmartResponse(userMessage, context = {}) {
        // 1. PROVA ADVANCED KNOWLEDGE BASE PRIMA
        const advancedResponse = this.advancedKB.getAdvancedKnowledgeResponse(userMessage, context);
        
        if (advancedResponse && advancedResponse.confidence === 'high') {
            return {
                content: advancedResponse.content,
                confidence: 'high',
                source: 'advanced_knowledge',
                suggestions: advancedResponse.suggestions,
                responseType: advancedResponse.responseType
            };
        }

        // 2. FALLBACK A BASIC KNOWLEDGE BASE
        const basicResponse = this.basicKB.generateSmartResponse(userMessage);
        
        if (basicResponse && basicResponse.confidence === 'high') {
            return basicResponse;
        }

        // 3. ADVANCED KNOWLEDGE CON CONFIDENZA MEDIA
        if (advancedResponse && advancedResponse.confidence === 'medium') {
            return {
                content: advancedResponse.content,
                confidence: 'medium',
                source: 'advanced_knowledge',
                suggestions: advancedResponse.suggestions,
                responseType: advancedResponse.responseType
            };
        }

        // 4. BASIC KNOWLEDGE FALLBACK
        return basicResponse;
    }

    // 📊 STATISTICHE COMBINATE
    getSystemStats() {
        const basicStats = {
            basicResponses: 'Available',
            workouts: 4,
            basicNutrition: 'Available'
        };
        
        const advancedStats = this.advancedKB.getKnowledgeBaseStats();
        
        return {
            basic: basicStats,
            advanced: advancedStats,
            totalKnowledgeAreas: basicStats.workouts + advancedStats.trainingMethodologies + 
                                advancedStats.nutritionTopics + advancedStats.wellnessPrograms
        };
    }
}

// Export per uso globale
window.AdvancedKnowledgeBase = AdvancedKnowledgeBase;
window.EnhancedKnowledgeSystem = EnhancedKnowledgeSystem;