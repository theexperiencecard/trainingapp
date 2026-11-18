# R1 — audit dell'addendum e riferimenti mancanti

2026-11-17. Addendum ricevuto nel messaggio dell'utente, seguito da «Continua».
Questo documento ne conserva una sintesi critica, non una copia verbatim.
Le letture dichiarate dall'autore esterno non costituiscono letture del progetto;
i marcatori `turn…view…`/`filecite` non sono riferimenti bibliografici esportabili.
Revisore: agente Codex; nessuna revisione clinica professionale eseguita.
R1 resta aperto; nessuna modifica a dosi, schema, codice o perimetro del lancio.

## Verifiche eseguite

Interrogati 13 PMID esatti via Europe PMC; letti metadati e abstract di tutti.
Per Nuzzo, Singer e Wiedenmann recuperati XML e valutati sezioni pertinenti di
metodi, risultati e limiti. Letti i due PDF ufficiali CSEP, questionario e documento
di riferimento. Registri aggiornati: S15–S27 e I01–I02; query esatte e hash conservati.
Nessuna nuova ricerca ampia; nessuna verifica esaustiva di correzioni/ritrattazioni.
Il registro contiene 27 articoli (11 testi con sezioni valutate, 15 abstract, 1 metadati)
e, separatamente, 2 documenti istituzionali. Non sono 29 prove indipendenti.

## Correzioni e limiti dell'addendum

- La meta-regressione reps–%1RM è di **Nuzzo, Pinto, Nosaka e Steele**, non Richens.
  DOI/PMID erano corretti: `10.1007/s40279-023-01937-7`, 37792272.
- Singer: **0,13 è il contrasto per il braccio**, non l'effetto complessivo.
  Coscia e corpo intero hanno stime diverse; non confondere effetti pre-post con
  differenze controllate tra durate di recupero.
- Wiedenmann: riduzione dell'errore **fino a circa 2,3 ripetizioni**, non errore finale
  uguale a 2,3. Partecipanti già esperti di RT, inesperti di RIR/RPE; supervisione
  individuale, una familiarizzazione più sei sedute, test 1RM e serie a cedimento.
  Questo protocollo non convalida la taratura autonoma di un principiante sedentario.
- Le fonti sulle cadute distinguono cadute, persone che cadono, lesioni e fratture.
  S20 trova un beneficio sulle fratture; S21 non trova un beneficio chiaro.
  I corpus/interventi differiscono: mantenere il disaccordo, non sommare i risultati.
- CSEP è stato verificato direttamente (I01/I02); «sì» porta a indicazioni specifiche,
  non automaticamente a diagnosi, divieto o emergenza. Il modulo copre anche minori:
  ciò non amplia il perimetro dell'app. Non copiare soglie o testi come regole approvate.
- Il consenso ESSA S27 riguarda pressione durante esercizio in un percorso professionale.
  Aggiornamento successivo: S28 identifica il consenso congiunto (documento 25). S27 non è il consenso ACSM/ESSA su talk test/RPE, né una fonte sul dolore.
  Registrato come riferimento controllato **non pertinente a quel claim**.
- Russo S14: l'addendum nomina il repository Évora ma non fornisce un URL recuperabile.
  In questa sessione nessun PDF Russo letto: resta `metadata_only`. Held S13 resta
  `abstract_only`; rimane irrisolta l'incoerenza sull'ordine degli esercizi.
- Confermate le correzioni già presenti nel documento 15: Coleman non testa ogni
  deload; Afonso non dimostra equivalenza. Non occorre rileggere o ricercare gli stessi studi.
- La tabella Q dell'addendum non va importata: Q4 non significa recuperi, Q5 non
  mobilità, Q7 non e1RM, Q8 non autoregolazione. La matrice corretta è nel documento 17.

## Sintesi delle nuove fonti

Identificativi, autori completi, date e URL verificati in [fonti-r1.tsv](ricerca/fonti-r1.tsv).
F = sezioni del testo valutate; A = solo abstract. Nessuno di questi stati approva una regola.

| ID / fonte / stato | Dati valutati e conseguenza per il progetto | Limiti da conservare |
| --- | --- | --- |
| S15 Nuzzo 2023/24 — F | 269 studi, 7.289 persone, 952 test; relazione media reps–%1RM con variabilità individuale e differenze panca/leg press. Q1/Q3/Q9: niente conversione individuale esatta | 97% gruppi sani, 92% <59 anni; dati da primo set non affaticato, 1RM misurato e prove a cedimento; ricerca non standard e difficilmente replicabile |
| S16 Singer 2024 — F | 9 studi, 19 misure, 5–10 settimane. Contrasti più lungo vs breve: braccio SMD 0,13 (CrI95% −0,27; 0,51), coscia 0,17 (−0,13; 0,43), corpo intero −0,08 (−0,45; 0,29). Q1: segnale piccolo/incerto, non timer ottimale universale | 6 studi non allenati; 8 giovani; volumi moderati, nessun esito sui muscoli del tronco; SMART-LD 4 buoni/4 discreti/1 scarso. CrI bayesiano distinto da IC frequentista |
| S17 Ingram 2024/25 — A | 189 studi, 6.654 adulti; stretching vs controllo passivo: g acuto 0,63 (IC95% 0,52–0,75), cronico 0,96 (0,84–1,09). Q11: beneficio medio sul ROM | Età media 26,8; studi randomizzati e non; 4 min/seduta riguarda acuto, 10 min/settimana cronico. Non soglie universali, prevenzione infortuni o equivalenza con RT |
| S18 Riebe 2015 — A | Consenso ACSM: attività abituale, sintomi/malattie note e intensità desiderata. Q7: ridurre referral inutili preservando percorsi appropriati | Non verificata qui l'edizione corrente del manuale ACSM né un algoritmo clinico completo; nessun effetto quantitativo nell'abstract |
| S19 Radaelli 2024/25 — A | 151 trial, 6.306 ≥60 anni, RT supervisionato; basso volume associato a miglioramenti funzionali, moderato/alto favorevole alla forza. Q3/Q12 | Volume per tercili di frequenza×esercizi×serie, non una dose fissa. Nell'abstract il dato sul cammino veloce è incoerente: SMD 0,40 fuori dall'IC −0,57; 0,14. Non usarlo senza chiarimento sul testo |
| S20 Ge 2026 — A | 29 RCT, 6.367 anziani in comunità; lesioni RR 0,87 (IC95% 0,80–0,95), fratture 0,56 (0,37–0,85). Q12 | Interventi/esiti da valutare nel testo; rischio di bias e certezza per esito non estraibili integralmente dall'abstract |
| S21 Yang 2026 — A | 38 studi/33 coorti, 20.183 persone; programmi multicomponente: tasso cadute IRR 0,80 (IC95% 0,71–0,90), persone con ≥1 caduta RR 0,88 (0,82–0,93). Q12 | Certezza bassa per cadute/fallers, moderata per lesioni gravi; eterogeneità elevata; fratture incerte. Non prova l'efficacia di un modulo app autonomo |
| S22 Wiedenmann 2026 — F | 26 adulti sani attivi completano; miglioramento RIR dopo sei sedute settimanali. Leg press 4RIR: variazione MAE −2,26 (IC95% −3,40; −1,11) ripetizioni. Q3/Q6 | Nessun controllo senza pratica; campione piccolo già esperto di RT; nessun test di equivalenza tra età; ordine leg press→panca fisso; cedimento supervisionato. Non prescrivere automaticamente quel protocollo |
| S23 Hamdani 2026 — A | 29 trial/3.005 ≥60 anni; +1.113 passi/die (IC95% 669–1.557) vs minimo intervento, bassa certezza; +912 (412–1.413) vs attivo, molto bassa. Q13 | Esito passi, non aderenza alla forza/retention; pochi follow-up senza beneficio persistente. Data online 2 marzo dall'abstract; campo data Europe PMC indica invece 1 aprile |
| S24 Huang et al. 2025 — A | NMA APRE/RPE/VBRT/PBRT; panca PBRT vs APRE SMD −0,83 (IC95% −1,22; −0,44), RPE vs APRE −0,76 (−1,70; 0,19). Q6 | Ranking SUCRA non prova superiorità in ogni confronto; conclusione astratta più forte di alcuni intervalli. Full text disponibile ma non valutato qui; non valida l'algoritmo consumer |
| S25 Roberts 2024/25 — A | 43 uomini giovani per leg extension, 39 per panca; confronto di 18 equazioni su prove a 80% 1RM. Q9: validità locale per esercizio/protocollo | Coefficienti ritarati e rivalutati sullo stesso campione; niente validazione esterna delle formule modificate. Non implementare formule dalla resa tipografica dell'abstract |
| S26 Hammert 2025 — A | 51 studi; distingue endurance a carico assoluto fisso e relativo alla forza corrente. Q9/Q15: tracciare protocollo e cadenza | 11 studi non chiariscono il test; sintesi metodologica, non dose finale o indice unico |
| S27 Schultz 2025 — A | Consenso ESSA per pressione durante esercizio; fonte identificata, esclusa come prova per il claim talk test/dolore | Popolazione e percorso professionale; non trasferire soglie pressorie a un algoritmo consumer |

Finanziamenti/conflitti: S16 dichiara nessun finanziamento e precedente consulenza
Tonal per Schoenfeld; dichiarata partecipazione editoriale Frontiers. Per le altre
nuove fonti l'esame di finanziamenti/conflitti non è completo: lacuna, non assenza di conflitti.
S05/S09/S10/S11 mantengono lo stato storico `abstract_only`.

## Documenti istituzionali I01/I02

Accesso dal [sito CSEP](https://csep.ca/2021/01/20/pre-screening-for-physical-activity/),
PDF inglesi con copyright 2017 serviti dal percorso 2021/05; questa è la versione
letta, non una certificazione di validità immutata in ogni paese/edizione.
URL e hash in [documenti-istituzionali-r1.tsv](ricerca/documenti-istituzionali-r1.tsv).
Il questionario distingue eventi negli ultimi sei mesi, dolore/gonfiore attuale,
restrizioni professionali e altre condizioni. Il documento di riferimento distingue
risposte/contesti; non basta estrarre le domande per riprodurne correttamente il percorso.
Le indicazioni per aumentare l'attività non sono un sistema completo di gestione
dell'emergenza. Per Q7 restano revisione clinica, localizzazione, aggiornamenti e
condizioni di riuso/adattamento prima di incorporare contenuti nel prodotto.

## Prossimo passo e verifica

Usare la [matrice Q1–Q15](17-matrice-r1.md) per concentrare il seguito su Q7,
regole di progressione Q6 e classificazione delle sostituzioni Q8. Non serve un'altra
ricerca generale. Gli altri abstract diventano letture prioritarie solo quando una
regola proposta dipende da un risultato che richiede il testo completo.
R1 non chiude automaticamente: distinguere lacune da risolvere e lacune da accettare
esplicitamente per un perimetro definito. R2 richiede revisione/approvazione prima del codice.

Revisione manuale: (1) controllare correzioni e stati; (2) leggere Q7/Q6/Q8 nella
matrice; (3) verificare che nessuna soglia sia diventata normativa.

Controlli eseguiti: `git diff --check`; unicità ID/DOI/query e conteggio degli stati;
hash dei tre XML e due PDF; link locali; tutte le Q1–Q15 presenti una volta nella
matrice; CONTEXTO entro 60 righe. Tutti superati. `npm run check` e `npm run build`
non rieseguiti: sola documentazione, ultima verifica applicativa già registrata nel 15.
