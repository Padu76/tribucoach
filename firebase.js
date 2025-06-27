// firebase.js - Configurazione Firebase per TribuCoach
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
// Se intendi usare Analytics, DEVI importare getAnalytics
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDSsQEPii_Eb99cWGs7eqozgTtIqbtO2rs",
  authDomain: "tribucoach-9564b.firebaseapp.com",
  projectId: "tribucoach-9564b",
  storageBucket: "tribucoach-9564b.firebasestorage.app",
  messagingSenderId: "476626832985",
  appId: "1:476626832985:web:7835188f40f4348567ab48",
  // AGGIUNGI O AGGIORNA QUESTO CAMPO con il Measurement ID corretto
  measurementId: "G-EVYE5YBZJE"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Esporta i servizi Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
// Esporta anche Analytics se lo stai usando
export const analytics = getAnalytics(app);

export default app;