// firebase.js - Configurazione Firebase per TribuCoach
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSsQEPii_Eb99cWGs7eqozgTtIqbtO2rs",
  authDomain: "tribucoach-9564b.firebaseapp.com",
  projectId: "tribucoach-9564b",
  storageBucket: "tribucoach-9564b.firebasestorage.app",
  messagingSenderId: "476626832985",
  appId: "1:476626832985:web:bd3103957299ab7a67ab48",
  measurementId: "G-YZ565MKQGV"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Esporta i servizi Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;