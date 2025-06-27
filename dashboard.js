// dashboard.js - Logica della Dashboard
import { setupQuizListener, setupLeadsListener, setupMetricsListener, formatDateTime, getProfileIcon, addLeadNote } from './firebase-functions.js';

// Funzione per renderizzare i risultati del quiz
function renderQuizResults(snapshot) {
    const quizTableBody = document.querySelector('#quizTable tbody');
    quizTableBody.innerHTML = ''; // Pulisce la tabella prima di riempirla

    let quizCount = 0;
    if (snapshot.size > 0) {
        snapshot.forEach(doc => {
            quizCount++;
            const data = doc.data();
            const row = quizTableBody.insertRow();
            row.insertCell().textContent = doc.id.substring(0, 8) + '...'; // ID troncato
            row.insertCell().textContent = data.name || 'N/A';
            row.insertCell().textContent = data.email || 'N/A';
            row.insertCell().textContent = (data.goals && data.goals.length > 0) ? data.goals.join(', ') : 'N/A';
            row.insertCell().textContent = data.activity_level || 'N/A';
            row.insertCell().textContent = data.lead_score || '0';
            row.insertCell().innerHTML = `${getProfileIcon(data.profile)} ${data.profile || 'N/A'}`;
            row.insertCell().textContent = data.timestamp ? formatDateTime(data.timestamp) : 'N/A';
        });
    } else {
        const row = quizTableBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 8;
        cell.textContent = 'Nessun quiz trovato.';
        cell.style.textAlign = 'center';
    }
    document.getElementById('quizCount').textContent = quizCount;
    // Qui potresti aggiungere logica per il trend se mantieni metriche precedenti
}

// Funzione per renderizzare i lead
function renderLeads(snapshot) {
    const leadsTableBody = document.querySelector('#leadsTable tbody');
    leadsTableBody.innerHTML = ''; // Pulisce la tabella

    let leadsCount = 0;
    if (snapshot.size > 0) {
        snapshot.forEach(doc => {
            leadsCount++;
            const data = doc.data();
            const row = leadsTableBody.insertRow();
            row.insertCell().textContent = doc.id.substring(0, 8) + '...'; // ID troncato
            row.insertCell().textContent = data.name || 'N/A';
            row.insertCell().textContent = data.email || 'N/A';
            row.insertCell().textContent = (data.goals && data.goals.length > 0) ? data.goals.join(', ') : 'N/A';
            row.insertCell().textContent = data.lead_score || '0';
            row.insertCell().textContent = data.timestamp ? formatDateTime(data.timestamp) : 'N/A';

            const notesCell = row.insertCell();
            if (data.notes && data.notes.length > 0) {
                notesCell.innerHTML = `<ul>${data.notes.map(note => `<li>${note.content} (${formatDateTime(note.timestamp)})</li>`).join('')}</ul>`;
            } else {
                notesCell.textContent = 'Nessuna nota.';
            }

            const actionCell = row.insertCell();
            const noteBtn = document.createElement('button');
            noteBtn.textContent = 'Aggiungi Nota';
            noteBtn.onclick = () => promptForNote(doc.id);
            noteBtn.style.marginRight = '5px';
            actionCell.appendChild(noteBtn);

            // Aggiungi qui altri pulsanti azione se necessari (es. Contatta su WhatsApp)
        });
    } else {
        const row = leadsTableBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 8;
        cell.textContent = 'Nessun lead trovato.';
        cell.style.textAlign = 'center';
    }
    document.getElementById('leadsCount').textContent = leadsCount;
    // Qui potresti aggiungere logica per il trend
}

// Funzione per renderizzare le metriche
function renderMetrics(snapshot) {
    const metricsTableBody = document.querySelector('#metricsTable tbody');
    metricsTableBody.innerHTML = ''; // Pulisce la tabella

    let metricsCount = 0;
    if (snapshot.size > 0) {
        snapshot.forEach(doc => {
            metricsCount++;
            const data = doc.data();
            const row = metricsTableBody.insertRow();
            row.insertCell().textContent = doc.id.substring(0, 8) + '...'; // ID troncato
            row.insertCell().textContent = data.name || 'N/A'; // Assicurati che i tuoi documenti metrics abbiano un campo 'name'
            row.insertCell().textContent = data.value || '0';   // E un campo 'value'
            row.insertCell().textContent = data.timestamp ? formatDateTime(data.timestamp) : 'N/A';
        });
    } else {
        const row = metricsTableBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 4;
        cell.textContent = 'Nessuna metrica trovata.';
        cell.style.textAlign = 'center';
    }
    document.getElementById('metricsCount').textContent = metricsCount;
    // Qui potresti aggiungere logica per il trend
}

// Funzione per chiedere e aggiungere una nota
async function promptForNote(leadId) {
    const note = prompt('Inserisci la nota per questo lead:');
    if (note) {
        try {
            await addLeadNote(leadId, note);
            alert('Nota aggiunta con successo!');
        } catch (error) {
            alert('Errore nell\'aggiungere la nota: ' + error.message);
        }
    }
}


// Inizializza i listener real-time al caricamento della pagina
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard caricata. Attivazione listener Firebase...');
    setupQuizListener(renderQuizResults);
    setupLeadsListener(renderLeads);
    setupMetricsListener(renderMetrics);
});