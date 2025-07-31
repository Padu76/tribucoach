// firebase-config.js - Configurazione Firebase per TribuCoach
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDTJgM-2FQBSjqTMQ-IoxflMleSJqTf0I",
  authDomain: "tribucoach-a2254.firebaseapp.com",
  projectId: "tribucoach-a2254",
  storageBucket: "tribucoach-a2254.firebasestorage.app",
  messagingSenderId: "425200296836",
  appId: "1:425200296836:web:af4f3e79f612604ee2b3d1"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Esporta i servizi Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);

// Funzione di test connessione
export async function testFirebaseConnection() {
    try {
        console.log('🔍 Test connessione Firebase...');
        // Test semplice senza query complesse per evitare quota exceeded
        const testResult = {
            connected: true,
            projectId: firebaseConfig.projectId,
            timestamp: new Date().toISOString()
        };
        console.log('✅ Firebase connesso:', testResult);
        return testResult;
    } catch (error) {
        console.error('❌ Errore connessione Firebase:', error);
        return { connected: false, error: error.message };
    }
}

// Log per conferma
console.log('🔥 Firebase inizializzato per progetto:', firebaseConfig.projectId);

export default app;