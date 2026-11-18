# Il prodotto

Stato: bozza del 16 novembre 2026. La ricerca di mercato (vedi `brief-ricerca.md`) può cambiare pubblico, nome, prezzi e questionario. Tutto ciò che è segnato come **bozza** va costruito in modo che si possa cambiare senza toccare il codice.

## Priorità aggiornate (2026-11-16)

1. Qualità scientifica verificabile, con programmi distinti per obiettivi e profili.
2. Personalizzazione, sostituzione degli esercizi e lettura corretta dei progressi.

La ricerca deve valutare disponibilità da 2 a 7 giorni, esperienza, capacità,
attività, recupero e vincoli: perimetro confermato nel documento 20, dettagli operativi in R2.
Il questionario considera le finestre disponibili e le confronta con le varianti coperte.
«90% perfetto» è un'ambizione da tradurre in criteri, non una garanzia di risultato.
Le dosi e il ciclo del prototipo attendono revisione; fonti e requisiti nei documenti 08 e 09.

L'utente richiede copertura anche oltre forza/ipertrofia: salute generale, ripresa,
capacità aerobica, mobilità, equilibrio e altri bisogni pertinenti. La ricerca
estesa è nel documento 10; famiglie e moduli del documento 11 sono proposte R2.
La presenza di un obiettivo tra le proposte non significa che sia già supportato.

## 1. Per chi

Adulti autonomi, principianti, persone che riprendono e praticanti ricreativi;
casa/palestra nei limiti del catalogo revisionato. Cinque famiglie F01–F05 e finestre
disponibili da 2 a 7 giorni, senza assegnare automaticamente altrettante sedute.
Nessuna esclusione automatica per età adulta o BMI; percorsi specialistici rinviati
come nel documento 20. Non è ancora una promessa di copertura implementata.

## 2. Cosa promette

Obiettivo da verificare nella prova: una proposta iniziale in 3 minuti, una guida serie per serie in palestra, e carichi che si adattano a come è andata l'ultima volta e a come stai oggi.

## 3. La prima versione: web, per la validazione

Serve a una prova con 10-20 persone per 4-6 settimane. Deve contenere solo questo:

| Funzione | Cosa fa |
| --- | --- |
| Questionario | Al massimo 20 domande, meno di 3 minuti, poi assegna un modello di scheda |
| Seduta guidata | Una serie alla volta, valori precompilati dall'ultima volta, timer di riposo, serie di avvicinamento |
| Consiglio sul peso | Taratura e progressione secondo la futura versione approvata delle regole R2 (21/22) |
| Ripetizioni in serbo | Stima dopo la serie di forza, con opzione «non so». La serie si salva anche senza stima |
| Controllo del dolore | Prima e durante la seduta, secondo i percorsi del dossier 18 dopo revisione professionale |
| Cicli e scarico | Da approvare in R2; 4 settimane + 1 è la configurazione storica |
| Sostituzioni | Cambio manuale oggi o nel programma, conseguenze esplicite, annullamento e storico conservato |
| Metriche | Grafici per esercizio/variante; tonnellaggio con unità e limiti espliciti |
| Storico | Tutte le settimane, serie per serie, con note |
| Progressi | Livelli e punti neutri, vedi sezione 5 |
| Tre lingue | Italiano, tedesco, inglese |
| Account e sincronizzazione | Accesso con email, dati su più dispositivi |
| Funzionamento senza rete | La seduta si fa anche senza segnale |

Fuori dalla prima versione: store, pagamenti, coach in chat completo, orologi e app salute, piano di resistenza in salita, illustrazioni animate. Il coach entra dopo, vedi `04-coach-ai.md`.

## 4. Questionario e modelli di scheda (bozza)

Le domande e i modelli stanno in file di dati, non nel codice.

Per la prova usare le domande candidate R2-Q01–Q09 del [documento 22](22-questionario-progressione-casi-r2.md). Registrare le finestre disponibili da due a sette, la priorità dichiarata e i movimenti familiari. Il dossier Q7 distingue una restrizione già discussa, un problema attuale e un possibile bisogno urgente. Una risposta positiva apre il ramo pertinente. I testi di screening richiedono revisione professionale prima dell’uso.

Le famiglie e i limiti effettivi del catalogo sono nei documenti 20–23. Il tempo di tre minuti è un obiettivo di usabilità da misurare nel pilot.

## 5. Livelli e parte a gioco

Deve far venire voglia di tornare senza far sentire in colpa.

- **Livello generale da 1 a 25,** senza titoli a tema. Nel prototipo i titoli sono "Acrobata", "Funambolo" e simili: vanno tolti.
- **Statistiche:** Forza, Resistenza, Mobilità, Costanza. Nel prototipo esistono anche Equilibrio e Saggezza: Equilibrio resta solo nei modelli con abilità, Saggezza diventa Costanza.
- **Punti:** per ogni serie fatta, per la seduta completata, per il controllo del dolore, per lo scarico rispettato e per l'esercizio saltato a causa del dolore. Premiare la scelta prudente è voluto.
- **Livelli per abilità o esercizio:** scale con un criterio numerico per salire, come in `data/livelli.json`.
- **Da evitare:** serie di giorni consecutivi che si azzerano, classifiche tra utenti, notifiche che fanno sentire in colpa, premi per allenarsi anche con dolore.

## 6. Schermate

1. **Oggi:** seduta del giorno, avvio, stato della settimana, possibilità di anticipare o spostare una seduta.
2. **Seduta guidata:** una serie alla volta, pulsanti grandi, timer.
3. **Progressi:** livello, statistiche, mappa delle settimane, storico.
4. **Esercizi e livelli:** come si fa ogni esercizio, scale e test.
5. **Coach:** chat, quando sarà attiva.
6. **Profilo:** dati, lingua, attrezzatura, esportazione e cancellazione dei dati.

Cosa il prototipo fa bene e va mantenuto: valori precompilati, un tocco per registrare una serie, "ultima volta" visibile sotto l'obiettivo, modifica di una serie già salvata, annulla, nota per esercizio, timer che sopravvive alla chiusura dell'app.

## 7. Decisioni ancora aperte

- Nome e marchio. "Quota" è provvisorio e va sostituito: non usarlo nei testi per l'utente.
- Copertura effettiva di esercizi, attrezzatura e paesi entro il perimetro confermato.
- Prezzi e piani.
- Come mostrare gli esercizi: illustrazioni animate prodotte in casa. Fino ad allora testo e passi scritti.
- Chi rivede schede e regole sul dolore dal punto di vista professionale.
