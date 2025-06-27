// firebase.js - Configurazione Firebase per TribuCoach
// Importa le funzioni necessarie per inizializzare l'app, l'autenticazione e Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js"; // Importa il servizio di autenticazione
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js"; // Importa il servizio Firestore

// La configurazione della tua app web Firebase (GENERATA DALLA CONSOLE PER 'tribucoach-a2254')
const firebaseConfig = {
  apiKey: "AIzaSyDTJgM-2FQBSjqTMQ-Ioxf1lM1eSJq1f0I", // NUOVA API KEY
  authDomain: "tribucoach-a2254.firebaseapp.com",
  projectId: "tribucoach-a2254",
  storageBucket: "tribucoach-a2254.firebasestorage.app",
  messagingSenderId: "425200296836",
  appId: "1:425200296836:web:653365016e46ce02e2b3d1"
  // 'measurementId' non è incluso qui se non intendi usare Firebase Analytics.
  // Se Firebase ti ha dato un measurementId, puoi aggiungerlo qui se decidi di usarlo e importare getAnalytics.
  // Es: measurementId: "G-XXXXXXXXXX"
};

// Inizializza l'applicazione Firebase
const app = initializeApp(firebaseConfig);

// Esporta i servizi Firebase che userai in altri file (auth e db)
export const auth = getAuth(app); // Esporta l'istanza di autenticazione
export const db = getFirestore(app); // Esporta l'istanza del database Firestore

// Esporta anche l'istanza dell'app stessa se è necessario in altri moduli
export default app;