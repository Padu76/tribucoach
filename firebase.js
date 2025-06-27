// firebase.js - Configurazione Firebase per TribuCoach
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDSsQEPii_Eb99cWGs7eqozgTtIqbtO2rs",
  authDomain: "tribucoach-9564b.firebaseapp.com",
  projectId: "tribucoach-9564b",
  storageBucket: "tribucoach-9564b.firebasestorage.app",
  messagingSenderId: "476626832985",
  appId: "1:476626832985:web:7835188f40f4348567ab48"
  // RIMOSSO measurementId per evitare conflitti Analytics
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Esporta i servizi Firebase (SENZA Analytics)
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;