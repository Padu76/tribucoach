// firebase-api.js
import { db } from './firebase-config.js';
import {
  collection,
  doc,
  getDocs,
  query,
  orderBy,
  limit,
  setDoc,
  addDoc,
  serverTimestamp,
  onSnapshot
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

// Recupera tutti i quiz dalla collezione "quiz_results"
export async function getAllQuizResults() {
  console.log("📊 Recupero tutti i quiz results...");
  const quizCollection = collection(db, "quiz_results");
  const quizQuery = query(quizCollection, orderBy("timestamp", "desc"), limit(1000));
  const querySnapshot = await getDocs(quizQuery);
  const quizResults = [];
  querySnapshot.forEach((doc) => {
    quizResults.push({ id: doc.id, ...doc.data() });
  });
  console.log(`📊 Quiz trovati: ${quizResults.length}`);
  return quizResults;
}

// Recupera le conversazioni chatbot dalla collezione "conversations"
export async function getChatbotConversations() {
  console.log("💬 Recupero conversazioni da Firebase...");
  const conversationsCollection = collection(db, "conversations");
  const conversationsQuery = query(conversationsCollection, orderBy("timestamp", "desc"), limit(1000));
  const querySnapshot = await getDocs(conversationsQuery);
  const conversations = [];
  querySnapshot.forEach((doc) => {
    conversations.push({ id: doc.id, ...doc.data() });
  });
  console.log(`💬 Conversazioni trovate: ${conversations.length}`);
  return conversations;
}

// Recupera gli utenti dalla collezione "users"
export async function getUsers() {
  console.log("👥 Recupero utenti da Firebase...");
  const usersCollection = collection(db, "users");
  const usersQuery = query(usersCollection, orderBy("timestamp", "desc"), limit(1000));
  const querySnapshot = await getDocs(usersQuery);
  const users = [];
  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() });
  });
  console.log(`👥 Utenti trovati: ${users.length}`);
  return users;
}

// Salva o aggiorna un lead nella collezione "leads" a partire dai dati di un quiz
export async function saveOrUpdateLeadFromQuiz(quizData) {
  try {
    const contactKey = quizData.whatsapp || quizData.email || quizData.phone || `anon-${Date.now()}`;
    const leadRef = doc(db, 'leads', contactKey);

    await setDoc(leadRef, {
      name: quizData.name || '',
      age: quizData.age || '',
      whatsapp: quizData.whatsapp || '',
      email: quizData.email || '',
      city: quizData.city || '',
      gender: quizData.gender || '',
      profile: quizData.profile || '',
      score: quizData.score || 0,
      goals: quizData.goals || [],
      training_style: quizData.training_style || '',
      activity_level: quizData.activity_level || '',
      obstacles: quizData.obstacles || [],
      source: 'quiz',
      timestamp: serverTimestamp()
    }, { merge: true });

    console.log(`✅ Lead salvato/aggiornato in leads: ${contactKey}`);
  } catch (error) {
    console.error("❌ Errore salvataggio lead:", error);
    throw error;
  }
}

// Salva un nuovo quiz nella collezione "quiz_results" + aggiorna leads
export async function saveQuizResult(quizData) {
  try {
    console.log("💾 Salvataggio quiz in quiz_results...");
    const docRef = await addDoc(collection(db, "quiz_results"), {
      ...quizData,
      timestamp: serverTimestamp()
    });
    console.log(`✅ Quiz salvato con ID: ${docRef.id}`);

    // Salva/aggiorna anche il lead
    await saveOrUpdateLeadFromQuiz(quizData);

    return docRef;
  } catch (error) {
    console.error("❌ Errore salvataggio quiz:", error);
    throw error;
  }
}

// Listener realtime per quiz_results
export function setupQuizListener(callback) {
  const quizQuery = query(collection(db, "quiz_results"), orderBy("timestamp", "desc"));
  return onSnapshot(quizQuery, (snapshot) => {
    const quizzes = [];
    snapshot.forEach((doc) => quizzes.push({ id: doc.id, ...doc.data() }));
    callback(quizzes);
  });
}

// Listener realtime per leads
export function setupLeadsListener(callback) {
  const leadsQuery = query(collection(db, "leads"), orderBy("timestamp", "desc"));
  return onSnapshot(leadsQuery, (snapshot) => {
    const leads = [];
    snapshot.forEach((doc) => leads.push({ id: doc.id, ...doc.data() }));
    callback(leads);
  });
}
