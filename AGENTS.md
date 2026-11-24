# Istruzioni per l'agente di programmazione

Questo file vale per ogni compito in questo progetto. Se una richiesta lo contraddice, fermati e chiedi.

## 1. Il progetto in breve

Un'app di allenamento per principianti e per chi si allena in palestra. L'utente risponde a un questionario breve, riceve una scheda, viene guidato serie per serie, e l'app adatta carichi e volume in base a ripetizioni, fatica e dolore. Un coach in chat, basato su un modello di IA, è la funzione a pagamento.

Il prototipo del pacchetto allegato è un riferimento storico di comportamento, non una validazione scientifica. Non è ancora importato nel checkout; non copiarne lo stato globale o i dati personali.

Chi lavora: due persone non sviluppatrici, circa 5 ore a settimana. Scrivi codice semplice, leggibile e facile da provare.

## 2. Cosa leggere prima di lavorare

| Quando | File |
| --- | --- |
| Sempre, all'inizio di una sessione | `CONTEXTO.md`, poi solo i documenti necessari al compito indicato |
| Revisione scientifica e personalizzazione | `docs/08-revisione-scientifica.md`, `docs/09-personalizzazione-e-metriche.md` |
| Logica di allenamento | `docs/02-regole-allenamento.md`, `data/*.json`, `data/casi-di-test.json` |
| Dati, account, sincronizzazione, privacy | `docs/03-dati-e-privacy.md` |
| Coach in chat | `docs/04-coach-ai.md` |
| Dubbi sul perché di una scelta | `docs/brief-ricerca.md`, `docs/fonti-scientifiche.md` |

Leggi il punto corrente del piano e le decisioni pertinenti prima di modificarli.
I file del pacchetto non ancora importati possono mancare: non inventarne il contenuto.
Mantieni `CONTEXTO.md` entro circa 60 righe, sostituendo lo stato superato invece di
accumulare resoconti. Non leggere interi archivi, lockfile o log senza necessità.
Per efficienza: riusa documenti e risultati già validi; cerca prima metadati e abstract,
poi valuta i testi selezionati in dettaglio. Estrai solo le sezioni pertinenti, includendo
metodi, limiti e risultati contrari; conserva query, link e sintesi per evitare riletture.
Non ripetere richieste bloccate senza un cambiamento di stato; esaurita la diagnosi,
comunica il prerequisito concreto. L'efficienza non riduce la qualità della verifica.

## 3. Priorità, in quest'ordine

Priorità di prodotto: (1) qualità scientifica verificabile e adattamento a obiettivo
e profilo; (2) personalizzazione, sostituzioni e metriche corrette; poi le altre funzioni.
Requisiti trasversali: sicurezza, integrità delle serie salvate, uso semplice in palestra,
leggibilità del codice. Una scelta pratica non va spacciata per evidenza scientifica.
Mai spingere ad allenarsi con dolore o fornire consigli medici.

## 4. Fermati e chiedi prima di

- **Cambiare modello,** o avviare sotto-agenti con un modello diverso (vedi sezione 5).
- Aggiungere una libreria, un servizio esterno o uno strumento a pagamento.
- Cambiare lo schema dei dati o scrivere una migrazione.
- Toccare account, permessi, regole di accesso al database, pagamenti o abbonamenti.
- Cancellare file o dati, oppure riscrivere più di circa 200 righe già esistenti.
- Cambiare una regola o un numero di `docs/02-regole-allenamento.md`: soglie del dolore, percentuali, criteri di livello.
- Pubblicare, fare un deploy, inviare qualcosa agli store, creare account, spendere denaro.
- Usare o spostare chiavi e segreti.
- Procedere quando il compito è ambiguo o esce dal punto corrente del piano di lavoro.

Come chiedere: una sola domanda, 2-3 opzioni, la tua raccomandazione e il motivo in una riga. Poi aspetta.

## 5. Scelta del modello

Lavora con il modello che l'utente ha impostato. Non cambiarlo da solo.

Prima di iniziare un compito, classificalo e scrivilo nella prima riga della risposta:

| Tipo | Esempi | Cosa fai |
| --- | --- | --- |
| **Delicato** | architettura iniziale, schema dei dati e migrazioni, sincronizzazione e unione dei dati, account e permessi, pagamenti, dati sanitari, il coach e i suoi limiti, un bug non risolto dopo 2 tentativi | Se non stai usando il modello più capace, **fermati e proponi il cambio**. Riparti solo dopo la risposta |
| **Normale** | schermate, componenti, logica di allenamento con casi di prova già scritti, test, correzioni | Procedi |
| **Meccanico** | traduzioni di testi, rinomine, formattazione, spostamento di file | Segnala in una riga che basterebbe il modello economico, poi procedi |

Alla fine di ogni risposta di lavoro indica sempre il modello esatto consigliato per il prossimo compito, prima del successivo «via». Non cambiarlo automaticamente.

Per ogni compito indica brevemente se conviene restare in Codex o usare un altro
modello/strumento, considerando qualità, accesso alle fonti e costo del passaggio
di contesto. Se consigli lavoro esterno, prepara un prompt autonomo e mirato con
output atteso, fonti già disponibili e lacune, oppure riusa quello esistente.
Altrimenti continua autonomamente nel compito autorizzato, senza chiedere un nuovo via.
Non inventare consumi, crediti residui o risparmi percentuali: se non misurabili,
fornisci soltanto una valutazione qualitativa breve. Evita analisi di costo ripetitive.

Raccomandazioni verificate il 2026-11-17: GPT-6.2 Astra per lavoro impegnativo,
GPT-6.2 Sol per implementazione ordinaria; «6.2» da solo non identifica il modello.
Confrontare costo totale fino al risultato corretto, non solo messaggi o prezzo
per token. Non assumere meno iterazioni senza osservazioni; non dedurre quota inclusa
dalle tariffe a crediti. Dettagli/fonti nel documento 24; nessun cambio automatico.

## 6. Come lavorare

1. **Un compito alla volta,** preso da `docs/05-piano-di-lavoro.md`. Niente funzioni non richieste.
2. **Prima un piano breve:** file che toccherai, come lo proverai. Per i compiti delicati aspetta l'approvazione del piano.
   Dentro un piano già autorizzato prosegui per blocchi interni senza chiedere nuovi
   «via»: l'utente preferisce revisionare una consegna compiuta. Commit e riepilogo
   sono punti di ripresa, non richieste di approvazione. L'assenza di subagenti non
   è un impedimento; resta necessario rispettare i limiti della sezione 4.
3. **Modifiche piccole.** Se servono più di 300 righe nuove, dividi il compito.
4. **Test prima del codice** per la logica di allenamento. Conserva i casi storici come regressioni; una modifica scientifica approvata richiede nuovi casi e motivazione delle attese cambiate.
5. **Esegui davvero** test, controllo dei tipi e lint prima di dire che hai finito. Riporta i comandi e l'esito. Se non hai potuto eseguire qualcosa, dillo.
6. **Commit piccoli** con un messaggio chiaro. Niente push forzati. Mai segreti o dati personali nel repository.
   Commit e push autorizzati a fine blocco coerente, con contesto aggiornato, per
   permettere il passaggio a un'altra IA. Prima controlla modifiche locali e remoto;
   dopo verifica l'esito. Nei lavori più ampi, pubblica ogni punto intermedio coerente e provato. Prosegui nello stesso turno dal punto appena salvato, rileggendo solo il necessario.
   Segnala subito se il lavoro resta soltanto locale; nessun deploy implicito.
7. **A fine compito scrivi:** cosa è cambiato, come provarlo a mano in 3 passi, cosa resta aperto. Aggiorna il riepilogo compatto `CONTEXTO.md`, lo stato in `docs/05-piano-di-lavoro.md` e, se hai preso una decisione, aggiungila a `DECISIONI.md`.

Se non sai una cosa, non inventarla: cerca nei file del progetto, poi nella documentazione ufficiale, poi chiedi.

## 7. Tecnologie (approvate nel compito 0.1; server ancora da configurare)

- **Linguaggio:** TypeScript in modalità rigorosa.
- **Interfaccia:** React con Vite, come app web installabile che funziona senza rete.
- **Store, più avanti:** la stessa app dentro Capacitor. Non prima della validazione.
- **Server:** Supabase per account, database Postgres con regole di accesso per riga e funzioni lato server.
- **Logica di allenamento:** un modulo separato in `src/core`, senza dipendenze dall'interfaccia né dalla rete, coperto da test (Vitest).
- **Modello di IA:** chiamato solo dal server. Nessuna chiave dentro l'app.

Usa le versioni stabili correnti e controlla la documentazione ufficiale invece di andare a memoria. Se ritieni migliore un'alternativa (per esempio Expo e React Native), proponila nel primo compito con vantaggi e svantaggi per due persone non sviluppatrici.

## 8. Regole del codice

- **Lingua:** nomi e commenti in inglese. Testi per l'utente mai dentro il codice, sempre nei file di traduzione `it`, `de`, `en`. L'italiano è la lingua di riferimento.
- **Testi:** frasi brevi e concrete. Il tedesco è più lungo: nessun contenitore a larghezza fissa. Virgola decimale in italiano e tedesco.
- **Parola "IA":** solo per il coach in chat. Il questionario produce un "piano personalizzato".
- **Date:** un giorno di allenamento è una data locale dell'utente nel formato `AAAA-MM-GG`. "Oggi" si calcola nel fuso dell'utente.
- **Senza rete:** ogni serie si salva subito sul dispositivo e si sincronizza dopo.
- **Sincronizzazione:** unione campo per campo con data di modifica. Mai "vince l'ultimo dispositivo" sull'intero stato: nel prototipo un dispositivo vuoto ha sovrascritto le impostazioni.
- **Accessibilità:** aree toccabili di almeno 44 punti, contrasto del testo almeno 4,5:1, tema chiaro e scuro, niente informazione affidata al solo colore.
- **Dati di esempio:** sempre inventati. Mai i dati personali del fondatore.
- **Errori:** messaggi che dicono cosa è successo e cosa fare. Nessun errore ignorato in silenzio.

## 9. Cosa non fare

- Non inventare esercizi, soglie o regole di allenamento.
- Non scrivere testi che sembrano diagnosi o consigli medici.
- Non aggiungere tracciamento, statistiche d'uso o servizi di terzi senza chiedere.
- Non lavorare su store, pagamenti o collegamenti con orologi prima che `docs/05-piano-di-lavoro.md` lo preveda.
- Non dichiarare finito un compito che non hai provato.
