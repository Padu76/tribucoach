// firebase.js - Configurazione Firebase per TribuCoach (PROGETTO CORRETTO)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDSsQEPii_Eb99cWGs7eqozgTtIqbtO2rs",
  authDomain: "tribucoach-a2254.firebaseapp.com",  // ← CORRETTO
  projectId: "tribucoach-a2254",                    // ← CORRETTO
  storageBucket: "tribucoach-a2254.firebasestorage.app", // ← CORRETTO
  messagingSenderId: "425200296836",                // ← CORRETTO (dal tuo screenshot)
  appId: "1:425200296836:web:7835188f40f4348567ab48"  // ← AGGIORNATO con messagingSenderId corretto
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Esporta i servizi Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics - con gestione errori
let analytics = null;
try {
  analytics = getAnalytics(app);
  console.log('🔥 Firebase Analytics inizializzato');
} catch (error) {
  console.warn('⚠️ Analytics non disponibile:', error.message);
}

export { analytics };

// Log per conferma
console.log('🔥 Firebase inizializzato per progetto:', firebaseConfig.projectId);

export default app;