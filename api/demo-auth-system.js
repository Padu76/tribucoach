// demo-auth-system.js - Sistema di autenticazione demo per sviluppo
// Simula Firebase Auth senza dipendenze esterne

class DemoAuthSystem {
    constructor() {
        this.currentUser = null;
        this.authListeners = [];
        this.isInitialized = false;
        
        // Utenti demo predefiniti
        this.demoUsers = [
            {
                uid: 'demo-user-001',
                email: 'demo@tribucoach.com',
                password: 'demo123',
                displayName: 'Demo User',
                emailVerified: true,
                metadata: {
                    creationTime: '2024-01-15T10:00:00Z',
                    lastSignInTime: new Date().toISOString()
                }
            },
            {
                uid: 'andrea-coach-001',
                email: 'andrea@tribucoach.com',
                password: 'coach123',
                displayName: 'Andrea Padoan',
                emailVerified: true,
                metadata: {
                    creationTime: '2024-01-01T09:00:00Z',
                    lastSignInTime: new Date().toISOString()
                }
            }
        ];
        
        this.init();
    }
    
    init() {
        console.log('🎭 Demo Auth System inizializzato');
        
        // Controlla se c'è un utente salvato
        const savedUser = localStorage.getItem('demoAuthUser');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                console.log('✅ Utente demo ripristinato:', this.currentUser.email);
            } catch (error) {
                console.warn('⚠️ Errore ripristino utente demo:', error);
                localStorage.removeItem('demoAuthUser');
            }
        }
        
        this.isInitialized = true;
        
        // Notifica listeners dopo breve delay per simulare async
        setTimeout(() => {
            this.notifyAuthListeners();
        }, 100);
    }
    
    // Simula onAuthStateChanged di Firebase
    onAuthStateChanged(callback) {
        this.authListeners.push(callback);
        
        // Se già inizializzato, chiama subito il callback
        if (this.isInitialized) {
            setTimeout(() => callback(this.currentUser), 50);
        }
        
        // Ritorna funzione di unsubscribe
        return () => {
            const index = this.authListeners.indexOf(callback);
            if (index > -1) {
                this.authListeners.splice(index, 1);
            }
        };
    }
    
    // Simula signInWithEmailAndPassword
    async signInWithEmailAndPassword(email, password) {
        console.log('🔐 Demo login tentativo:', email);
        
        // Simula delay di rete
        await this.delay(800);
        
        // Trova utente demo
        const user = this.demoUsers.find(u => u.email === email && u.password === password);
        
        if (!user) {
            const error = new Error('Invalid email or password');
            error.code = 'auth/invalid-credential';
            throw error;
        }
        
        // Crea copia dell'utente senza password
        const userCopy = { ...user };
        delete userCopy.password;
        
        // Aggiorna ultimo login
        userCopy.metadata.lastSignInTime = new Date().toISOString();
        
        this.currentUser = userCopy;
        localStorage.setItem('demoAuthUser', JSON.stringify(userCopy));
        
        console.log('✅ Demo login successful:', user.email);
        
        // Notifica listeners
        this.notifyAuthListeners();
        
        return { user: userCopy };
    }
    
    // Simula createUserWithEmailAndPassword
    async createUserWithEmailAndPassword(email, password) {
        console.log('📝 Demo registrazione:', email);
        
        // Simula delay di rete
        await this.delay(1000);
        
        // Controlla se utente esiste già
        const existingUser = this.demoUsers.find(u => u.email === email);
        if (existingUser) {
            const error = new Error('Email already in use');
            error.code = 'auth/email-already-in-use';
            throw error;
        }
        
        // Crea nuovo utente demo
        const newUser = {
            uid: 'demo-user-' + Date.now(),
            email: email,
            displayName: email.split('@')[0],
            emailVerified: true, // Demo: assume sempre verificato
            metadata: {
                creationTime: new Date().toISOString(),
                lastSignInTime: new Date().toISOString()
            }
        };
        
        // Aggiungi alla lista demo (solo per questa sessione)
        this.demoUsers.push({ ...newUser, password: password });
        
        this.currentUser = newUser;
        localStorage.setItem('demoAuthUser', JSON.stringify(newUser));
        
        console.log('✅ Demo registrazione successful:', email);
        
        // Notifica listeners
        this.notifyAuthListeners();
        
        return { user: newUser };
    }
    
    // Simula sendPasswordResetEmail
    async sendPasswordResetEmail(email) {
        console.log('📧 Demo password reset per:', email);
        
        // Simula delay di rete
        await this.delay(500);
        
        // In demo mode, assume sempre successo
        console.log('✅ Demo password reset email inviata');
        return;
    }
    
    // Simula signOut
    async signOut() {
        console.log('🚪 Demo logout');
        
        // Simula delay di rete
        await this.delay(300);
        
        this.currentUser = null;
        localStorage.removeItem('demoAuthUser');
        
        // Notifica listeners
        this.notifyAuthListeners();
        
        console.log('✅ Demo logout completato');
    }
    
    // Notifica tutti i listeners dello stato auth
    notifyAuthListeners() {
        this.authListeners.forEach(callback => {
            try {
                callback(this.currentUser);
            } catch (error) {
                console.error('❌ Errore in auth listener:', error);
            }
        });
    }
    
    // Utility per simulare delay di rete
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Getter per utente corrente
    get user() {
        return this.currentUser;
    }
}

// Crea istanza globale del sistema demo
const demoAuth = new DemoAuthSystem();

// Simula l'oggetto auth di Firebase
export const auth = {
    currentUser: demoAuth.currentUser,
    onAuthStateChanged: (callback) => demoAuth.onAuthStateChanged(callback),
    signInWithEmailAndPassword: (email, password) => demoAuth.signInWithEmailAndPassword(email, password),
    createUserWithEmailAndPassword: (email, password) => demoAuth.createUserWithEmailAndPassword(email, password),
    sendPasswordResetEmail: (email) => demoAuth.sendPasswordResetEmail(email),
    signOut: () => demoAuth.signOut()
};

// Simula Firestore (database demo minimale)
export const db = {
    // Simula doc() function
    doc: (collection, id) => ({
        id: id,
        collection: collection,
        // Simula get()
        get: async () => ({
            exists: () => Math.random() > 0.3, // 70% chance di esistere
            data: () => ({
                wellnessScore: Math.floor(Math.random() * 100),
                currentStreak: Math.floor(Math.random() * 30),
                createdAt: new Date().toISOString()
            })
        })
    }),
    
    // Simula collection() function  
    collection: (name) => ({
        name: name,
        // Simula where() e query()
        where: (field, operator, value) => ({
            // Simula getDocs()
            getDocs: async () => ({
                forEach: (callback) => {
                    // Simula alcuni documenti demo
                    for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
                        callback({
                            id: `demo-doc-${i}`,
                            data: () => ({
                                type: Math.random() > 0.5 ? 'week' : 'lesson',
                                completed: Math.random() > 0.3,
                                userId: value,
                                timestamp: new Date().toISOString()
                            })
                        });
                    }
                }
            })
        })
    })
};

// Simula altre funzioni Firebase necessarie
export const signInWithEmailAndPassword = auth.signInWithEmailAndPassword;
export const createUserWithEmailAndPassword = auth.createUserWithEmailAndPassword;
export const sendPasswordResetEmail = auth.sendPasswordResetEmail;
export const onAuthStateChanged = auth.onAuthStateChanged;

// Simula funzioni Firestore
export const doc = db.doc;
export const collection = db.collection;
export const query = (collection, ...constraints) => {
    // Simula query con where
    let result = collection;
    constraints.forEach(constraint => {
        if (constraint && constraint.getDocs) {
            result = constraint;
        }
    });
    return result;
};
export const where = (field, operator, value) => db.collection().where(field, operator, value);
export const getDocs = async (query) => {
    if (query && query.getDocs) {
        return await query.getDocs();
    }
    return { forEach: () => {} };
};
export const getDoc = async (docRef) => {
    if (docRef && docRef.get) {
        return await docRef.get();
    }
    return { exists: () => false, data: () => ({}) };
};

console.log('🎭 Demo Auth System caricato - Utenti disponibili:');
console.log('📧 demo@tribucoach.com / demo123');
console.log('📧 andrea@tribucoach.com / coach123');

export default { auth, db };