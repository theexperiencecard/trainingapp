# Piano di lavoro

Un compito alla volta. Nuovo ordine approvato: R0 → R1 → R2 prima del motore;
R3 (ricerca utenti) può procedere in parallelo. Il punto 0.3 resta indipendente. Ogni compito sta in una sessione di lavoro breve. Stato: `da fare`, `in corso`, `fatto`.

Tipo: D = delicato, N = normale, M = meccanico (vedi `AGENTS.md`, sezione 5).

## Tappa 0: preparazione

| N. | Compito | Tipo | Fatto quando | Stato |
| --- | --- | --- | --- | --- |
| 0.1 | Proporre le tecnologie e la struttura delle cartelle, con le alternative | D | Roberto ha approvato e la scelta è in `DECISIONI.md` | fatto |
| 0.2 | Creare il progetto vuoto con test, controllo dei tipi e lint | N | Un comando esegue tutto e passa | fatto |
| 0.3 | Controlli automatici a ogni modifica inviata al repository | N | Una modifica con un test rotto viene segnalata | fatto |

## Revisione prima del motore

Priorità dell'utente: qualità scientifica per obiettivo/profilo, poi personalizzazione
con sostituzioni e grafici corretti. Nessuna regola numerica è cambiata da questa revisione.

| N. | Compito | Tipo | Fatto quando | Stato |
| --- | --- | --- | --- | --- |
| R0 | Audit dei materiali, protocollo scientifico e requisiti di personalizzazione | D | Lacune, domande, criteri delle fonti e casi di accettazione documentati | fatto |
| R1 | Verifica delle fonti e matrice delle evidenze per Q1–Q15, anche oltre forza/ipertrofia | D | Fonti identificate e valutate, popolazioni e limiti espliciti, lacune residue dichiarate | fatto |
| R2 | Specifica di programmi, questionario, sostituzioni e metriche | D | Regole tracciabili, profili supportati definiti, revisione professionale pertinente e approvazione prima del codice | in corso |
| R3 | Ricerca utenti e mercato iniziale | N | Interviste e alternative documentate, pubblico/problema e criteri della prova proposti | da fare |

R1: PubMed ed Europe PMC ora accessibili nel nuovo ambiente. Primo lotto di
11 fonti nel documento 12; 7 testi con sezioni valutate e 4 solo abstract.
Aggiornamento 2026-11-17 nel documento 15: rapporto esterno revisionato, 14 fonti
totali (8 testi con sezioni valutate, 5 abstract, 1 soli metadati).
Seguito nello stesso giorno: addendum integrato nei documenti 16/17; 27 articoli
(11 testi con sezioni valutate, 15 abstract, 1 metadati) e 2 documenti CSEP letti.
Blocco successivo Q7/Q6/Q8: dossier 18/19 pronti per revisione; 5 documenti
istituzionali valutati complessivamente. Prossimo: proposta perimetro/lacune R1.
Perimetro/trattamento lacune del documento 20 confermati dal successivo «continua»:
R1 chiusa come dossier mirato; R2 avviata nei documenti 21/22. Nessuna dose approvata.
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
| 2.1 | Salvataggio sul dispositivo e funzionamento senza rete | D | App installata sulla Home: una serie registrata in modalità aereo è ancora lì dopo il riavvio, verificato su un iPhone e un Android reali; registrare dispositivi, versioni ed esiti | in corso |
| 2.2 | Schermata Oggi con la seduta del giorno | N | Mostra blocchi, serie e durata stimata | da fare |
| 2.3 | Seduta guidata: una serie alla volta, valori precompilati, un tocco per registrare | N | Una seduta intera si completa con una mano | in corso |
| 2.4 | Timer di riposo che sopravvive alla chiusura, cronometro per le tenute | N | Conto alla rovescia calcolato dall’orario di fine persistito, non dal conteggio dei secondi; provato sospendendo, chiudendo e riaprendo l’app | in corso |
| 2.5 | Modifica e annullamento di una serie, note | N | Provato a mano e con test | in corso |
| 2.6 | Controllo del dolore con legenda, e fastidio durante la serie | N | Le regole della tappa 1 reagiscono ai valori inseriti | da fare |
| 2.7 | Sostituzione manuale oggi o nelle sedute future, con anteprima e annullamento | D | Alternative e limiti approvati in R2; serie svolte conservate e casi di sostituzione superati | da fare |

## Tappa 3: questionario e modelli

| N. | Compito | Tipo | Fatto quando | Stato |
| --- | --- | --- | --- | --- |
| 3.1 | Questionario letto da un file di dati, con le domande di sicurezza | N | Cambiare una domanda non richiede codice | in corso |
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
| 5.1 | Storico per settimane, serie per serie | N | Si arriva a ogni seduta passata | in corso |
| 5.2 | Livelli e punti neutri | N | Nessun titolo a tema | da fare |
| 5.3 | Tutti i testi in italiano, tedesco e inglese | M | Nessun testo nel codice, nessuna parola tagliata in tedesco | da fare |
| 5.4 | Controllo di accessibilità | N | Contrasto e aree toccabili rispettati, tema chiaro e scuro | da fare |
| 5.5 | Grafici per esercizio/variante e riepiloghi con metriche definite | N | Cambi esercizio visibili, unità coerenti, nessun falso record o trasferimento di carico | in corso |

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

Preferenza confermata il 2026-11-17: per ogni compito raccomandazione breve su
Codex/altro modello o strumento; prompt mirato se conviene spostare il lavoro,
altrimenti prosecuzione autonoma. Commit e push a fine blocco coerente con
contesto aggiornato. Nessuna nuova attività R1 eseguita nell'aggiornare queste istruzioni.

2026-11-16: utente autorizza commit e push dell'intero lavoro del progetto su
`theexperiencecard/trainingapp`, ramo `main`, per collaborazione con un'altra IA.
Il riferimento per la ripresa è `CONTEXTO.md`; i resoconti precedenti sui commit
solo locali descrivono lo stato storico. L'esito del push va verificato confrontando
HEAD locale e `refs/heads/main` remoto. Il punto 0.3 richiede ancora verifica delle
esecuzioni GitHub; l'invio del workflow non certifica che i job siano passati.

## R1: ricerca esterna assistita

2026-11-17: su richiesta dell'utente preparato `docs/14-prompt-ricerca-esterna.md`,
autonomo e mirato alle lacune, con 11 fonti iniziali e stato di lettura esplicito.
Il rapporto sarà fornito dall'utente: verificare riferimenti, applicabilità e
proposte prima di integrarli. R1 resta in corso; nessuna nuova fonte letta oggi.
Verifica documentale: DOI confrontati con il registro e riepilogo entro 60 righe.
Suite applicativa non rieseguita: nessun codice, configurazione o dipendenza modificati.

## R1: rapporto esterno ricevuto e revisionato

2026-11-17: originale archiviato con provenienza e hash; revisione nel documento 15.
ACSM 2026 verificata su testo integrale pertinente; Held 2026 su abstract;
Russo identificato tramite Crossref, testo editore 403. Registri estesi senza
promuovere a verificate le letture dichiarate dall'altra IA. Evidenze, proposte
e lacune separate; corretta l'inferenza eccessiva sullo scarico da Coleman.
Prossimo passo: riferimenti mancanti e matrice Q1–Q15, prima delle specifiche R2.
R1 resta in corso. Nessuna dose, schema o nuova funzione approvata.
Verifica: registri/hash/link locali e CONTEXTO entro 60 righe superati;
`npm run check` (3 test, tipi, lint) e `npm run build` superati, uscita 0.

## R1: addendum e matrice consolidata

2026-11-17: verificati 13 nuovi riferimenti per PMID, approfondite sezioni di tre
testi e letti questionario/documento di riferimento CSEP. Audit nel documento 16;
matrice Q1–Q15 nel 17 con definizioni originali, proposte e lacune separate.
Corretti autore Nuzzo, interpretazione dell'effetto sui recuperi e applicabilità
dello studio RIR; mantenuti distinti risultati discordanti sulle fratture.
Prossimo punto: Q7 screening/dolore, poi Q6/Q8. R1 resta in corso; nessuna nuova
prescrizione approvata. Per efficienza verifiche documentali, senza ripetere suite
applicativa invariata: nessun codice, dipendenza o configurazione modificati.

## R1: dossier pronti per la revisione delle scelte

2026-11-17: completato il blocco documentale Q7 (18) e preparato Q6/Q8 (19).
Riutilizzate le evidenze; aggiunte tre pagine istituzionali NICE/NHS con versioni,
limiti e hash. Percorsi, precedenze e casi candidati distinti da regole approvate.
Q7 non è validato clinicamente; nessun contatto esterno o servizio attivato.
Il prossimo blocco presenta perimetro F01–F05 e lacune da risolvere/accettare/rinviare,
per una decisione complessiva prima di R2. R1 resta in corso.
Modalità: blocchi interni con commit/push e contesto aggiornato, revisione utente
su consegne compiute; nessuna attesa di «via» per passi già autorizzati.
Verifiche documentali superate: `git diff --check`, link, 3 hash HTML, registro
istituzionale, ID di proposte/casi e CONTEXTO entro 60 righe. Suite applicativa
non rieseguita: nessun codice/configurazione modificato; i casi sono ancora proposte.

## R1: consegna complessiva pronta per la decisione

2026-11-17: documento 20 con pubblico iniziale proposto, tutte le famiglie F01–F05,
moduli inclusi/rinviati, lacune L01–L10 e contenuto atteso delle specifiche R2.
Richiesta una sola decisione di prodotto sul pacchetto; nessuna nuova ricerca o
prescrizione. R1 resta in corso fino alla conferma; R2 non è ancora approvata.
La conferma del perimetro consentirà di chiudere il dossier R1 e redigere R2,
ma non approverà dosi, percorsi clinici, schema dati o lancio.
Controlli documentali superati: diff, link/fonti, copertura F01–F05/L01–L10,
stati coerenti e CONTEXTO entro 60 righe. Suite applicativa invariata non ripetuta.

## R2: prima bozza concreta

2026-11-17: il «Comunque continua» dopo la proposta conferma il perimetro e il
passaggio a R2; interpretazione esplicitata all'utente. R1 documentale chiusa,
lacune L01–L10 conservate. Documenti 21/22: dosi candidate F01–F05, base a due
esposizioni muscolari, questionario, precedenze di progressione e 13 casi candidati.
Mancano soprattutto catalogo/varianti, frequenze superiori, dose aerobica iniziale,
taratura e regole di incremento/rientro/scarico. R2 non chiusa; nessun motore scritto.
Percorso restante: completare/revisionare R2 → motore con test → app/offline/account/sync
→ prove reali e pilot 4–6 settimane. Non è una previsione di data di consegna.
Verifiche superate: diff, link/fonti, identificativi univoci (5 dosi, 9 domande,
7 regole, 13 casi), aritmetica durata, stati R1/R2 e CONTEXTO entro 60 righe.
`npm run check`/`build` non rieseguiti: sola documentazione. I casi non sono ancora
test eseguibili e i controlli non validano le prescrizioni.

## R2: identità degli esercizi e distribuzione settimanale

2026-11-17: documento 23 con audit mirato del catalogo originale, stesso hash del
documento 10. Individuate voci specialistiche/ambigue/composite da distinguere;
nessun dato personale o catalogo applicativo importato. Tre calendari candidati
redistribuiscono lo stesso esempio di 20 serie su 2/3/4 sedute; non sono dosi approvate.
R2 resta in corso: revisione esercizi/istruzioni, aerobico iniziale, taratura e
parametri di incremento/rientro/scarico ancora da completare.
Documento 24: confronto modelli/quote con fonti ufficiali consultate, distinguendo
GPT-6.2 Astra da Sol e tariffe a crediti da utilizzo incluso nell'abbonamento.
Controlli documentali superati: diff, hash catalogo, ID esistenti, totali per slot
nei tre calendari, 7 casi univoci, rapporti tariffari, link e CONTEXTO entro 60 righe.
Nessun codice/configurazione applicativa cambiati; `npm run check`/`build` non ripetuti.

R2 in corso. Il riesame nel documento 25 corregge fonte sull'intensità, percorso
aerobico iniziale, precedenze di progressione, durata e continuità dei grafici.
18 novembre 2026. Il documento 26 segue due sedute F03 su carta con taratura, alternativa, passi reali e rientro. Lo stesso gesto/configurazione riapre il grafico. Prossimo caso completo F04 con sostituzione, conteggio del lavoro diretto/indiretto e limiti di comparabilità. I criteri di incremento e rientro di F03 attendono revisione.

## Dal caso F04 alla prova su telefono

18 novembre 2026. Il [caso F04](27-settimana-ipertrofia-r2.md) copre due sedute, cambio «solo oggi» o futuro, annullamento, serie saltata per tempo, lavoro diretto/indiretto e grafici per macchina. Rimane una simulazione. Prossimo blocco R2 proposto: riusare un profilo per confrontare ingresso F01, forma generale F02 e aerobico F05. Riunire poi i casi e le scelte aperte per la revisione professionale.

**Stima di calendario dal 18 novembre.** Assunte circa cinque ore settimanali complessive del team con assistenza Codex, continuità del lavoro, revisore disponibile durante R2 e accesso ai due telefoni. Intervalli orientativi, ancora senza una velocità di implementazione misurata.

| Traguardo | Finestra cumulativa ipotizzata | Come si riconosce |
| --- | --- | --- |
| Prima seduta dimostrativa interna | 2–4 settimane | Con dati sintetici si percorrono avvio, registrazione di una serie, sostituzione e lettura dello storico. Può usare una scheda di esempio mentre le prescrizioni attendono revisione. È un'anteprima separata dalla prova del prodotto. |
| Prova personale della prima versione completa | 12–20 settimane | Questionario e regole revisionati, seduta, timer persistente, sostituzione e grafici. Account e sincronizzazione verificati. Su iPhone e Android reali la serie offline sopravvive al riavvio dell'app installata sulla Home e alla successiva sincronizzazione. |
| Risultati della prova con 10–20 persone | Ulteriori 4–6 settimane di utilizzo dopo l'avvio del pilot | Partecipanti con app sulla Home, account attivi e criteri del pilot definiti. Reclutamento e disponibilità dei telefoni incidono sulla data di avvio. |

Per la finestra di 12–20 settimane il preventivo indicativo è 2–4 per specifiche, revisione e catalogo minimo, 4–6 per motore, questionario, seduta e grafici, 4–6 per persistenza, installazione, account e sincronizzazione, 2–4 per integrazione e prove sui dispositivi. Sono stime di lavoro da ricalibrare alla prima seduta percorribile e al riscontro del revisore. Una revisione tardiva o perdita di dati nei test offline può spostare il calendario.

## Consegna integrata del 18 novembre

I [casi F01/F02/F05](28-confronto-ingresso-generale-aerobico.md) completano gli esempi per le cinque famiglie. La [scheda per la revisione](29-consegna-revisione-r2.md) collega ogni decisione a un caso e a un esito da registrare. Nessuna prescrizione è stata approvata.

La prima dimostrazione interna prevista nella stima è disponibile in questa build. Copre due serie di esempio, cambio solo oggi o anche giovedì, ripristino del piano e volumi separati. Il riavvio azzera il diario sintetico. 2.4 offre già recupero a scadenza persistita e cronometro di tenuta con ripristino. Resta da integrarli nella seduta definitiva. Per 2.1 la cache di produzione consente la riapertura offline dopo la prima visita. Il [primo diario persistente](30-proposta-diario-locale.md) è in attesa della decisione sullo schema.

Verificati in Chromium la registrazione delle due serie sui tre rami, i volumi 480/250 o 960 kg, la riapertura della build offline, il ripristino del timer e il cronometro, la lingua e la larghezza di 360 px. Verificati anche manifest, rifiuto di asset con hash errato, esclusione degli endpoint API e cambio di versione dopo la chiusura della scheda. Questi riscontri anticipano la demo iniziale. La stima del pilot dipende ancora da revisione, account, sync e dispositivi reali.

## Diario integrato e distanza dal pilot · 23 novembre 2026

La PR #1 di Claude partiva dal 7dc3172 e aggiungeva un secondo diario IndexedDB. Dalla PR provengono l'inserimento dei valori al momento della registrazione, la virgola decimale, la distinzione tra carico mancante e zero e i casi di prova in Chromium. L'integrazione mantiene gli stati svolta/saltata/annullata, le revisioni per campo e lo storico giornaliero per configurazione. Un ID di operazione ripetuto con contenuto differente è respinto. Un giorno con carichi incompleti mostra il conteggio delle serie e segnala che il volume è sconosciuto. [PR originale](https://github.com/theexperiencecard/trainingapp/pull/1)

Per stimare il progresso, il traguardo è il pilot della prima versione installata sulla Home, con questionario, scheda adatta all'obiettivo, seduta completa, account e sincronizzazione. La seguente ripartizione è un giudizio di pianificazione, da rifare al primo flusso completo. La somma attuale è circa un terzo.

| Ambito | Peso indicativo | Punti maturati | Riscontro |
| --- | ---: | ---: | --- |
| Scienza, catalogo e motore | 30 | 9 | Fonti e casi per cinque famiglie pronti. Mancano parere professionale, catalogo approvato e motore. |
| Dal questionario alla seduta conclusa | 25 | 7 | Preferenze, simulazione di sostituzione e timer provabili. Manca il collegamento a una scheda e a tutti i passaggi di una seduta. |
| Diario, offline e progressi | 20 | 15 | Serie e correzioni locali, conflitti, ripristino e grafici per attrezzo. Copertura sintetica ancora limitata. |
| Account, privacy e sincronizzazione | 15 | 0 | Specifiche disponibili. Accesso, isolamento degli utenti, esportazione e sync da realizzare. |
| Collaudo mobile e preparazione pilot | 10 | 1 | Verifiche automatiche e browser desktop disponibili. Servono i due telefoni reali e prova d'uso. |

Prossimo incremento verificabile: percorrere dall'inizio alla fine una scheda di esempio, dal riepilogo iniziale alla registrazione dell'ultima serie e allo storico. La prescrizione automatica dipende dalla revisione R2. Per la prova sul campo restano i prerequisiti dei telefoni reali, degli account e della sincronizzazione.

## Seduta guidata di esempio · 24 novembre 2026

Il percorso di due serie parte da un riepilogo. Dopo la prima serie l'utente può aprire il timer e scegliere la chest press per la seconda. Ogni conferma scrive nel diario locale, usando lo stesso ID di operazione se deve riprovare. Il riepilogo finale porta allo storico. Alla riapertura le serie e il timer restano disponibili. Il passo corrente e le scelte della simulazione si ricostruiscono dal riepilogo iniziale. Il percorso riguarda la scheda di esempio. L'assegnazione dal questionario e il catalogo della prima prova reale dipendono ancora dalla revisione R2.

## Percorso più breve verso il primo pilot

Il questionario mostra ora la direzione ricavata dall'obiettivo, dalla pratica recente e dai movimenti familiari. A parità di vincoli distingue forza e capacità aerobica. Se l'obiettivo è indeciso chiede di sceglierlo. Questo passaggio prepara l'assegnazione delle schede. I contenuti da svolgere dipendono ancora dalle decisioni R2.

1. **Dossier già pronto, revisione da svolgere.** Mantenere le cinque famiglie candidate, dando precedenza ai profili più frequenti e a un catalogo iniziale essenziale. Usare i casi esistenti per convalidare esercizi, dose iniziale, progressione, sostituzioni e percorsi per segnali o dolore. Definire quando dichiarare che il profilo è fuori copertura. [Scheda di revisione](29-consegna-revisione-r2.md)
2. **Preparazione tecnica in parallelo.** Chiudere i casi di onboarding, adattamento e passaggio dal piano alla seduta. Preparare in parallelo la progettazione di account, privacy e sincronizzazione. Il diario locale già collaudato è la base per la seduta. Usare un solo ramo di integrazione per ridurre il lavoro ripetuto.
3. **Integrare le regole revisionate.** Completare domande condizionali, motore, anteprima modificabile, esercizi alternativi, seduta guidata e storico. Automatizzare prima i casi che distinguono obiettivi, livelli, vincoli di tempo e attrezzatura. Prevedere criteri di valutazione dopo le prime sedute.
4. **Verificare il prodotto sui telefoni.** Completare e provare accesso, isolamento dei dati e sincronizzazione. Provare l'installazione sulla Home e il ciclo di registrazione offline, riapertura e sincronizzazione su iPhone e Android reali. Reclutamento e preparazione dei criteri della prova possono procedere prima del collaudo.
5. **Avviare la prova.** Osservare completamento della prima seduta, aderenza e comprensione della scheda per le 4–6 settimane previste. Migliorare accessibilità e comprensione prima del pilot. Gli effetti grafici, il coach e gli store sono successivi alle verifiche essenziali.

Il criterio Pareto ordina il lavoro a partire dai profili più frequenti. La prima versione completa richiede ancora revisione professionale, implementazione e prove sui telefoni. La stima resta circa un terzo del percorso.

## Domande condizionali e motivazione delle sostituzioni

Il questionario mostra 8–10 domande, in funzione di obiettivo e giorni disponibili. Il riepilogo esclude le risposte dei rami non più pertinenti. L'anteprima panca → chest press spiega cosa si conserva per il petto, la differenza nel controllo della traiettoria e la specificità della forza in panca. La selezione di una scheda resta subordinata alla revisione R2. Il criterio di copertura del target Pareto è documentato e da misurare nel pilot. [Questionario e criteri](22-questionario-progressione-casi-r2.md)

Il riepilogo del questionario propone un confronto facoltativo tra panca e chest press per chi cerca forza o ipertrofia. Incrocia attrezzatura dichiarata e movimenti da evitare. La categoria di attrezzo rende l'esercizio un candidato da verificare. Per forza specifica evidenzia l'importanza di praticare il gesto. Per ipertrofia spiega la differenza nel controllo della traiettoria. Se entrambe le opzioni sono escluse, serve una variante compatibile. Il confronto non assegna né avvia una scheda. [Caso alla base dell'esempio](27-settimana-ipertrofia-r2.md)
