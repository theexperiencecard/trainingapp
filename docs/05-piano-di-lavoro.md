# Piano di lavoro

Un compito alla volta. Nuovo ordine approvato: R0 → R1 → R2 prima del motore;
R3 (ricerca utenti) può procedere in parallelo. Il punto 0.3 resta indipendente. Ogni compito sta in una sessione di lavoro breve. Stato: `da fare`, `in corso`, `fatto`.

Tipo: D = delicato, N = normale, M = meccanico (vedi `AGENTS.md`, sezione 5).

## Tappa 0: preparazione

| N. | Compito | Tipo | Fatto quando | Stato |
| --- | --- | --- | --- | --- |
| 0.1 | Proporre le tecnologie e la struttura delle cartelle, con le alternative | D | Roberto ha approvato e la scelta è in `DECISIONI.md` | fatto |
| 0.2 | Creare il progetto vuoto con test, controllo dei tipi e lint | N | Un comando esegue tutto e passa | fatto |
| 0.3 | Controlli automatici a ogni modifica inviata al repository | N | Una modifica con un test rotto viene segnalata | in corso |

## Revisione prima del motore

Priorità dell'utente: qualità scientifica per obiettivo/profilo, poi personalizzazione
con sostituzioni e grafici corretti. Nessuna regola numerica è cambiata da questa revisione.

| N. | Compito | Tipo | Fatto quando | Stato |
| --- | --- | --- | --- | --- |
| R0 | Audit dei materiali, protocollo scientifico e requisiti di personalizzazione | D | Lacune, domande, criteri delle fonti e casi di accettazione documentati | fatto |
| R1 | Verifica delle fonti e matrice delle evidenze per Q1–Q15, anche oltre forza/ipertrofia | D | Fonti identificate e valutate, popolazioni e limiti espliciti, lacune residue dichiarate | in corso |
| R2 | Specifica di programmi, questionario, sostituzioni e metriche | D | Regole tracciabili, profili supportati definiti, revisione professionale pertinente e approvazione prima del codice | da fare |
| R3 | Ricerca utenti e mercato iniziale | N | Interviste e alternative documentate, pubblico/problema e criteri della prova proposti | da fare |

R1: PubMed ed Europe PMC ora accessibili nel nuovo ambiente. Primo lotto di
11 fonti nel documento 12; 7 testi con sezioni valutate e 4 solo abstract.
R1 resta aperto per le lacune elencate; metodo nel documento 08.
R0 definisce un protocollo, non certifica scientificamente le regole del prototipo.
I requisiti in `docs/09-personalizzazione-e-metriche.md` sono proposte da finalizzare in R2.

## Tappa 1: il motore, senza interfaccia

| N. | Compito | Tipo | Fatto quando | Stato |
| --- | --- | --- | --- | --- |
| 1.1 | Tipi di dati per esercizi, scale, modelli, sedute e serie, e caricamento dei file di `data/` con convalida | N | I file si caricano e un file sbagliato dà un errore chiaro | da fare |
| 1.2 | Ciclo e numero di serie secondo la specifica approvata in R2 | N | Casi approvati superati; differenze dal ciclo storico di 5 settimane motivate | da fare |
| 1.3 | Regole sul dolore | D | Casi approvati sul dolore superati; tracciabilità rispetto a `painRule` storico | da fare |
| 1.4 | Consiglio sul peso | D | Casi approvati sui carichi superati; differenze da `kgAdvice` storico motivate | da fare |
| 1.5 | Ripetizioni proposte e salita di livello | N | Casi `defVal` e `readyUp` superati | da fare |
| 1.6 | Serie di avvicinamento e riposi, compreso il riposo reale nei superset | N | Test scritti dalle regole | da fare |
| 1.7 | Settimana di rientro dopo una pausa | D | Regola approvata da Roberto e test scritti | da fare |

## Tappa 2: la seduta guidata

| N. | Compito | Tipo | Fatto quando | Stato |
| --- | --- | --- | --- | --- |
| 2.1 | Salvataggio sul dispositivo e funzionamento senza rete | D | App installata sulla Home: una serie registrata in modalità aereo è ancora lì dopo il riavvio, verificato su un iPhone e un Android reali; registrare dispositivi, versioni ed esiti | da fare |
| 2.2 | Schermata Oggi con la seduta del giorno | N | Mostra blocchi, serie e durata stimata | da fare |
| 2.3 | Seduta guidata: una serie alla volta, valori precompilati, un tocco per registrare | N | Una seduta intera si completa con una mano | da fare |
| 2.4 | Timer di riposo che sopravvive alla chiusura, cronometro per le tenute | N | Conto alla rovescia calcolato dall’orario di fine persistito, non dal conteggio dei secondi; provato sospendendo, chiudendo e riaprendo l’app | da fare |
| 2.5 | Modifica e annullamento di una serie, note | N | Provato a mano e con test | da fare |
| 2.6 | Controllo del dolore con legenda, e fastidio durante la serie | N | Le regole della tappa 1 reagiscono ai valori inseriti | da fare |
| 2.7 | Sostituzione manuale oggi o nelle sedute future, con anteprima e annullamento | D | Alternative e limiti approvati in R2; serie svolte conservate e casi di sostituzione superati | da fare |

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
| 5.5 | Grafici per esercizio/variante e riepiloghi con metriche definite | N | Cambi esercizio visibili, unità coerenti, nessun falso record o trasferimento di carico | da fare |

## Prova con le persone

Prerequisiti obbligatori: ogni partecipante installa l’app sulla schermata Home; account e sincronizzazione della tappa 4 sono pronti e verificati prima della prova. Il compito 2.1 richiede esiti positivi su un iPhone e un Android reali; emulatori e prove desktop non lo chiudono.

Qui lo sviluppo si ferma. 10-20 persone usano la versione web per 4-6 settimane. Prima di iniziare si definiscono criteri di qualità, successo e arresto; nessuna promessa di «90% perfetto». Si guarda quanti completano la prima seduta, quanti si allenano ancora dopo 4 settimane e quanti pagherebbero.

## Dopo la prova, solo con esito positivo

| N. | Compito | Tipo |
| --- | --- | --- |
| 6.1 | Coach in chat con azioni a elenco chiuso | D |
| 6.2 | Illustrazioni degli esercizi | N |
| 6.3 | App per gli store | D |
| 6.4 | Abbonamenti | D |

## Avanzamento del compito 0.1

2026-11-16: proposta approvata e registrata in `DECISIONI.md`, insieme ai tre
vincoli su installazione/account/sincronizzazione, timer e dispositivi reali.
Compito 0.1 chiuso; compito 0.2 completato, come descritto sotto.

## Esito del compito 0.2

2026-11-16: creato il progetto React/Vite con TypeScript rigoroso, Vitest,
ESLint, traduzioni iniziali e un solo progetto npm con lockfile.

- `npm ci --no-fund`: riuscito; dipendenze reinstallate dal lockfile.
- `npm run check`: codice di uscita 0; 3 test di rendering React superati,
  controllo dei tipi superato, lint superato senza avvisi.
- `npm run build`: codice di uscita 0; build Vite generata in `dist/`.
- Avvio e preview: HTTP 200 per HTML, moduli di sviluppo e asset compilati.

Prova manuale: seguire i tre passi in `README.md`. I test sono eseguiti in Node;
le richieste HTTP non sostituiscono una prova nel browser o su telefoni reali.
Il compito 0.3 è in corso, con esito descritto sotto. Home/PWA, salvataggio offline, timer, account e
sincronizzazione restano nelle rispettive tappe; il compito 2.1 resta aperto.

## Avanzamento del compito 0.3

2026-11-16: workflow GitHub Actions preparato per push, pull request e avvio
manuale. Procedura in `docs/06-controlli-automatici.md`.

- YAML analizzato; eventi e sequenza installazione/check/build verificati.
- Prova negativa locale: aspettativa di rendering volutamente sbagliata in un
  file temporaneo; 3 casi falliti come previsto, uscita 1, build non eseguita.
  File temporaneo rimosso e test originali conservati.
- Ripristinata la base: `npm ci --no-fund`, `npm run check` (3 test, tipi e lint)
  e `npm run build` superati, uscita 0.
- Esecuzione su GitHub non effettuata: i commit sono locali; `main` remoto
  è ancora al commit iniziale `cfa5d05`. Il punto resta in corso fino alla prova
  remota verde/rossa/verde. Nessun invio o modifica alle impostazioni GitHub eseguiti.

La verifica visiva del punto 0.2 è rinviata su indicazione dell'utente; non
blocca questi controlli, ma resta distinta dai test automatici già superati.
Prossimi compiti e ricerca consigliata: `docs/07-prossimi-passi-e-ricerca.md`.

## Avanzamento R1: copertura per le schede base

2026-11-16: estesi gli obiettivi e auditato il catalogo (48 voci, 7 check,
2 cardio specifiche, un modello personale, 23 test storici). Risultati nel
[documento 10](10-obiettivi-e-copertura.md); cinque famiglie e moduli proposti
nel [documento 11](11-famiglie-schede-base.md). Non sono schede prescritte o validate.

Accesso a fonti originali ancora bloccato: rete corrente senza i domini aggiuntivi,
nuovi tentativi a PubMed/Europe PMC/WHO tutti 403. Bozza di configurazione già salvata;
serve applicarla oppure ricevere testi originali. Nessuna nuova fonte letta.
Il lavoro bibliografico e R2 restano aperti; non implementare dosi inventate.

Verifica della sessione: `npm run check` superato (3 test, tipi, lint) e
`npm run build` superato, entrambi uscita 0. Validano solo la base software.

## R1: primo lotto dopo la pubblicazione dell'ambiente

2026-11-16: PubMed/Europe PMC accessibili; WHO diretto 403, linee guida lette
tramite pubblicazione scientifica. Sette testi integrali recuperati e sezioni
pertinenti valutate; quattro fonti limitate all'abstract. Esiti in `docs/12-evidenze-primo-lotto.md`,
conseguenze per le schede in `docs/13-dalle-evidenze-alle-schede.md` e registri in `docs/ricerca/`.
Ricerca mirata, non screening esaustivo. Dosi finali, sicurezza e schede complete
non approvate; lacune R1 dichiarate nel documento 12. Nessuna regola del motore modificata.
Revisione manuale: verificare stato delle fonti, confrontare le conseguenze per
le famiglie e controllare le lacune prima di approvare prescrizioni.

Controlli della sessione: registro di 11 fonti con identificativi univoci e 7 hash
XML verificato; `npm run check` (3 test, tipi, lint) e `npm run build` superati,
uscita 0. I controlli software non validano clinicamente le prescrizioni.

## Condivisione del lavoro

2026-11-16: utente autorizza commit e push dell'intero lavoro del progetto su
`theexperiencecard/trainingapp`, ramo `main`, per collaborazione con un'altra IA.
Il riferimento per la ripresa è `CONTEXTO.md`; i resoconti precedenti sui commit
solo locali descrivono lo stato storico. L'esito del push va verificato confrontando
HEAD locale e `refs/heads/main` remoto. Il punto 0.3 richiede ancora verifica delle
esecuzioni GitHub; l'invio del workflow non certifica che i job siano passati.
