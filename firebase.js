// firebase.js - Configurazione Firebase per TribuCoach
// Importa le funzioni necessarie per inizializzare l'app, l'autenticazione e Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js"; // Importa il servizio di autenticazione
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js"; // Importa il servizio Firestore

// La configurazione della tua app web Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDSsQEPii_Eb99cWGs7eqozgTtIqbtO2rs", // La tua chiave API
  authDomain: "tribucoach-9564b.firebaseapp.com", // Il dominio per l'autenticazione
  projectId: "tribucoach-9564b", // L'ID del tuo progetto Firebase
  storageBucket: "tribucoach-9564b.firebasestorage.app", // Il bucket di storage (se usi Firebase Storage)
  messagingSenderId: "476626832985", // L'ID del mittente per il messaging (se usi Cloud Messaging)
  appId: "1:476626832985:web:7835188f40f4348567ab48" // L'ID della tua app Firebase
  // Abbiamo rimosso 'measurementId' qui per non usare Analytics, come richiesto in precedenza.
  // Se decidi di usare Analytics in futuro, dovrai aggiungerlo qui e importare getAnalytics.
};

// Inizializza l'applicazione Firebase
const app = initializeApp(firebaseConfig);

// Esporta i servizi Firebase che userai in altri file
export const auth = getAuth(app); // Esporta l'istanza di autenticazione
export const db = getFirestore(app); // Esporta l'istanza del database Firestore

// Puoi anche esportare l'app stessa se necessario, ma non è strettamente richiesto per i tuoi file attuali
export default app;