# R2 — copertura del catalogo e calendari candidati 0.2

2026-11-17. Seguito delle bozze 21/22. **Proposte non approvate**, nessun esercizio
importato nell'app e nessuno schema modificato. Audit documentale, non validazione
tecnica/clinica degli esercizi. Non cambia le dosi del prototipo.

## Origine e verifica del materiale

Riletto soltanto `data/esercizi.json` nel pacchetto originale: 48 voci, hash SHA256
`cbbb1727ae644330d98878d71ccace3c005569d0a8f52aa671d26804df4f27af`, uguale all'audit 10.
Esaminati ID, nomi/unità delle voci; istruzioni pertinenti per `press`, `row`, `goblet`,
`trap`, `stepup`, `calf`, `pullO`. Non esaminati tutti i video/istruzioni, né importati
dati personali, luoghi, carichi, dosi, note o collegamenti del fondatore.

## Candidati e problemi di identità

| ID storico | Cosa è stato verificato | Trattamento candidato prima di R2 finale |
| --- | --- | --- |
| `press` | Le istruzioni descrivono una skill a braccia tese con distacco dei piedi | Non usarlo come chest press/overhead press per F01–F04; percorso specialistico |
| `row` | Nome rematore, istruzioni consentono manubrio o anelli | Separare le varianti: carico esterno e corpo libero non condividono automaticamente kg, e1RM o record |
| `goblet` | Squat con manubrio al petto | Candidato per dominante di ginocchio; riscrivere/rivedere istruzioni generali, taratura e capacità richieste |
| `trap` | Stacco con trap bar | Candidato da classificare e revisionare; non dichiararlo un movimento d'anca puro o adatto a ogni principiante |
| `stepup` | Un'unica voce per salita e discesa dal box | Separare compiti/varianti prima di dose e storico; altezza/progressione del prototipo non approvate |
| `calf` | Un'unica voce per polpacci e tibiale | Separare esercizi e unità; una serie non diventa automaticamente lavoro equivalente per entrambi |
| `pullO` | Prevede trazioni alla sbarra oppure rematore agli anelli | Non è un esercizio canonico unico: cambiano gesto, difficoltà e comparabilità |

Un ID storico non dimostra una variante univoca. Prima della migrazione occorrerà
definire identità/configurazione/convenzioni e trattamento dello storico, con approvazione
dello schema. Qui si annota il problema senza rinominare o riscrivere dati.

## Copertura rispetto alle famiglie

| Ruolo necessario | Materiale utile esistente | Lacuna da risolvere |
| --- | --- | --- |
| Dominante di ginocchio | Goblet; bulgaro/step-up come altri candidati da esaminare | Variante d'ingresso, capacità, appoggio e alternative macchina/casa |
| Anca/catena posteriore | Trap bar candidata, non classificazione definitiva | Opzione per casa e ingresso senza trap bar; verifica contributi e istruzioni |
| Spinta generale | Dips/HSPU presenti nei nomi, `press` specialistico | Non coprono automaticamente una spinta accessibile; candidati da revisionare: piegamento inclinato, spinta con manubri/macchina |
| Tirata | `row`, `pullO`, trazioni | Identità separate e variante fattibile per capacità/attrezzi; non imporre trazioni a chi inizia |
| Tronco | Compressione/L-sit/skill nel catalogo | Non bastano a certificare un modulo generale d'ingresso; scegliere esercizi appropriati dopo revisione |
| Aerobico | Voci storiche specialistiche già segnalate nel documento 10 | Modalità generiche, ad esempio cammino/cicloergometro, con intensità/durata iniziali revisionate |
| Accessori F04 | Curl, estensioni tricipiti e altri nomi presenti | Anatomia, unità, contributo diretto/indiretto, progressioni e copertura da verificare |

I nuovi nomi sono **candidati**, non esercizi aggiunti o istruzioni approvate.
Nessuna generazione automatica se uno slot obbligatorio non ha un esercizio idoneo.
Se il vincolo è tempo/attrezzatura, mostrare la copertura reale; se è dolore, percorso Q7.
La preparazione del catalogo dovrà produrre istruzioni proprie, alternative motivate
e una scheda di revisione per ogni variante, senza ricopiare consigli personali.

## Calendari: distribuire una dose esistente

Evidenze di riferimento già lette: S01/S12 distinguono frequenza e dose; S10 resta
solo abstract. I calendari sotto sono **scelte pratiche e prove aritmetiche**,
non prova di equivalenza fisiologica, frequenza ottimale o recupero sufficiente.

Esempio sintetico a dose fissa: K = ginocchio, H = anca, S = spinta, T = tirata,
C = tronco. Ogni slot ha 4 serie settimanali, 20 complessive. Non sono «4 serie
per ogni muscolo»: i contributi dipendono dagli esercizi. Unità omogenea solo per
questo esempio di conteggio; tenute e protocolli diversi richiedono altre definizioni.

| ID / calendario candidato | Distribuzione delle serie | Totale per slot / settimana |
| --- | --- | --- |
| R2-C01 / 2 sedute, es. lunedì e giovedì | A: K2 H2 S2 T2 C2; B: K2 H2 S2 T2 C2 | K4 H4 S4 T4 C4 = 20 |
| R2-C02 / 3 sedute, es. lunedì/mercoledì/venerdì | A: K2 S2 T2 C1; B: H2 S2 T2 C1; C: K2 H2 C2 | K4 H4 S4 T4 C4 = 20 |
| R2-C03 / 4 sedute, es. lunedì/martedì/giovedì/venerdì | A: S2 T2 C1; B: K2 H2 C1; C: S2 T2 C1; D: K2 H2 C1 | K4 H4 S4 T4 C4 = 20 |

Non applicare C01–C03 a ogni famiglia senza verifica:
- F01 conserva la base introduttiva e la gradualità D01; non aumentare i giorni
  perché il calendario è libero. Questi esempi non sostituiscono le sue dosi.
- F02/F04: candidati di redistribuzione di un piano già coerente con obiettivo,
  esercizi, dose e tempo; C02/C03 non aggiungono serie automaticamente.
- F03: verificare esposizioni agli **stessi gesti obiettivo**, ordine e qualità.
  Stesso conteggio di slot non garantisce la stessa pratica di squat o panca.
- F05: supporto muscolare compatibile con l'aerobico, senza duplicare programmi.
  Calendario e dose aerobica iniziale non sono risolti da questa tabella.

Con 5–7 giorni disponibili si può scegliere una distribuzione compatibile e
lasciare altre finestre ad attività secondarie/recupero. **Non ancora coperta** una
richiesta di 5–7 sedute di forza vere e proprie: richiede una variante distinta.
Le combinazioni di giorni sono esempi, non vincoli: disponibilità solo consecutiva,
altri sport o fatica devono produrre un conflitto esplicito se manca una variante valida.

## Tempo: più sedute non significa meno impegno totale

Se una seduta è troppo lunga, prima verificare se la distribuzione può cambiare
senza alterare la dose/obiettivo. Ogni giorno aggiunge preparazione e cambi:
non affermare che tre sedute costano lo stesso tempo totale di due.
Il tempo per recuperi include intervalli fra serie **e fra esercizi** quando richiesti;
il cambio attrezzo non va sempre aggiunto o sempre ignorato: può sovrapporsi al recupero.

Se dose e tempo sono incompatibili, proporre una variante esplicitamente ridotta
da revisionare, oppure segnalare il limite. Non tagliare recuperi, slot prioritari
o istruzioni di preparazione in silenzio. Budget breve non significa stesso risultato.

## Casi da aggiungere alla revisione R2

| ID | Scenario | Attesa proposta |
| --- | --- | --- |
| R2-CAT01 | Ricerca generica di spinta trova `press` | Non assegnarlo come chest press; identità specialistica esplicita |
| R2-CAT02 | `row` cambia da manubrio ad anelli | Nuova variante/metriche appropriate, nessun record di kg condiviso |
| R2-CAT03 | Una voce contiene step-up e step-down | Nessuna dose unica finché non si distingue cosa viene eseguito |
| R2-CAT04 | Casa senza candidato valido per uno slot | Limite dichiarato; niente esercizio inventato |
| R2-CAT05 | Redistribuzione C01→C02→C03 | Totali dell'esempio invariati per slot, ma tempo e specificità rivalutati |
| R2-CAT06 | Obiettivo forza in un gesto, cambio di slot apparentemente equivalente | Verificare il gesto effettivo, non soltanto il conteggio di serie |
| R2-CAT07 | Sette giorni disponibili | Nessuna moltiplicazione automatica della dose o promessa di variante non coperta |

Prossimo: revisione delle varianti d'ingresso/istruzioni, intensità e dose aerobica,
taratura e parametri di incremento/rientro/scarico; poi approvazione del pacchetto R2.
Nessun nuovo articolo generico è necessario per correggere gli errori d'identità trovati.
