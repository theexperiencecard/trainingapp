# Piano di lavoro

Un compito alla volta, nell'ordine. Ogni compito sta in una sessione di lavoro breve. Stato: `da fare`, `in corso`, `fatto`.

Tipo: D = delicato, N = normale, M = meccanico (vedi `AGENTS.md`, sezione 5).

## Tappa 0: preparazione

| N. | Compito | Tipo | Fatto quando | Stato |
| --- | --- | --- | --- | --- |
| 0.1 | Proporre le tecnologie e la struttura delle cartelle, con le alternative | D | Roberto ha approvato e la scelta è in `DECISIONI.md` | in corso |
| 0.2 | Creare il progetto vuoto con test, controllo dei tipi e lint | N | Un comando esegue tutto e passa | da fare |
| 0.3 | Controlli automatici a ogni modifica inviata al repository | N | Una modifica con un test rotto viene segnalata | da fare |

## Tappa 1: il motore, senza interfaccia

| N. | Compito | Tipo | Fatto quando | Stato |
| --- | --- | --- | --- | --- |
| 1.1 | Tipi di dati per esercizi, scale, modelli, sedute e serie, e caricamento dei file di `data/` con convalida | N | I file si caricano e un file sbagliato dà un errore chiaro | da fare |
| 1.2 | Ciclo di 5 settimane e numero di serie | N | Casi "scarico" superati | da fare |
| 1.3 | Regole sul dolore | D | Casi `painRule` superati | da fare |
| 1.4 | Consiglio sul peso | D | Casi `kgAdvice` superati, stesso risultato in kg | da fare |
| 1.5 | Ripetizioni proposte e salita di livello | N | Casi `defVal` e `readyUp` superati | da fare |
| 1.6 | Serie di avvicinamento e riposi, compreso il riposo reale nei superset | N | Test scritti dalle regole | da fare |
| 1.7 | Settimana di rientro dopo una pausa | D | Regola approvata da Roberto e test scritti | da fare |

## Tappa 2: la seduta guidata

| N. | Compito | Tipo | Fatto quando | Stato |
| --- | --- | --- | --- | --- |
| 2.1 | Salvataggio sul dispositivo e funzionamento senza rete | D | Una serie registrata in modalità aereo è ancora lì dopo il riavvio | da fare |
| 2.2 | Schermata Oggi con la seduta del giorno | N | Mostra blocchi, serie e durata stimata | da fare |
| 2.3 | Seduta guidata: una serie alla volta, valori precompilati, un tocco per registrare | N | Una seduta intera si completa con una mano | da fare |
| 2.4 | Timer di riposo che sopravvive alla chiusura, cronometro per le tenute | N | Provato chiudendo e riaprendo l'app | da fare |
| 2.5 | Modifica e annullamento di una serie, note | N | Provato a mano e con test | da fare |
| 2.6 | Controllo del dolore con legenda, e fastidio durante la serie | N | Le regole della tappa 1 reagiscono ai valori inseriti | da fare |

## Tappa 3: questionario e modelli

| N. | Compito | Tipo | Fatto quando | Stato |
| --- | --- | --- | --- | --- |
| 3.1 | Questionario letto da un file di dati, con le domande di sicurezza | N | Cambiare una domanda non richiede codice | da fare |
| 3.2 | Regole che assegnano un modello | D | Ogni combinazione di risposte porta a un modello o a un messaggio chiaro | da fare |
| 3.3 | I modelli di partenza come file di dati | N | Roberto li ha riletti | da fare |

## Tappa 4: account e sincronizzazione

| N. | Compito | Tipo | Fatto quando | Stato |
| --- | --- | --- | --- | --- |
| 4.1 | Schema del database e regole di accesso | D | Un test dimostra che un utente non legge i dati di un altro | da fare |
| 4.2 | Accesso con email | D | Entrata, uscita e recupero funzionano | da fare |
| 4.3 | Sincronizzazione riga per riga | D | Due dispositivi, uno senza rete: nessun dato perso. Un dispositivo vuoto non sovrascrive | da fare |
| 4.4 | Consenso, esportazione e cancellazione dei dati | D | Provati dall'app | da fare |

## Tappa 5: progressi e lingue

| N. | Compito | Tipo | Fatto quando | Stato |
| --- | --- | --- | --- | --- |
| 5.1 | Storico per settimane, serie per serie | N | Si arriva a ogni seduta passata | da fare |
| 5.2 | Livelli e punti neutri | N | Nessun titolo a tema | da fare |
| 5.3 | Tutti i testi in italiano, tedesco e inglese | M | Nessun testo nel codice, nessuna parola tagliata in tedesco | da fare |
| 5.4 | Controllo di accessibilità | N | Contrasto e aree toccabili rispettati, tema chiaro e scuro | da fare |

## Prova con le persone

Qui lo sviluppo si ferma. 10-20 persone usano la versione web per 4-6 settimane. Si guarda quanti completano la prima seduta, quanti si allenano ancora dopo 4 settimane e quanti pagherebbero.

## Dopo la prova, solo con esito positivo

| N. | Compito | Tipo |
| --- | --- | --- |
| 6.1 | Coach in chat con azioni a elenco chiuso | D |
| 6.2 | Illustrazioni degli esercizi | N |
| 6.3 | App per gli store | D |
| 6.4 | Abbonamenti | D |

## Avanzamento del compito 0.1

2026-11-16: piano di analisi approvato. Proposta e confronto disponibili in
`docs/00-architettura.md`; resta la conferma della scelta tecnologica.
Il compito 0.2 non è iniziato.
