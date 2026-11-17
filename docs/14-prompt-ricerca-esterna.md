# Prompt autonomo per ricerca esterna — R1

Preparato il 2026-11-17. Copiare il testo tra INIZIO e FINE in un servizio con
ricerca web approfondita. Non serve concedere accesso al repository né inviare
il prototipo personale. Facoltativi: documenti 12/13 e `ricerca/fonti-r1.tsv`.
Il prompt non è una ricerca eseguita. I risultati saranno verificati al rientro.

--- INIZIO PROMPT ---

Agisci come ricercatore in scienze dell'esercizio incaricato di preparare una
base scientifica utilizzabile per progettare un'app di allenamento. Svolgi
ricerca web reale e rispondi in italiano. Se non puoi consultare fonti esterne,
dillo subito: non simulare ricerche o letture.

## Contesto e obiettivo

L'app deve assegnare una scheda iniziale tramite questionario breve, guidare le
sedute e adattare il programma usando capacità, prestazioni e riscontri dell'utente.
Priorità: (1) qualità scientifica applicabile al profilo; (2) personalizzazione,
sostituzioni e grafici corretti. Il coach IA è una funzione successiva: il motore
di base deve essere spiegabile e funzionare senza un modello generativo.

Pubblico da delimitare: adulti principianti, sedentari, persone che riprendono
e già allenate, con disponibilità da 2 a 7 giorni, tempi e attrezzature diversi.
Considerare anche adulti anziani autonomi e persone con sovrappeso, distinguendo
capacità, condizioni cliniche e necessità di supervisione. Non dedurre capacità
o prescrizioni dal solo BMI, aspetto fisico, sesso o calorie autoriferite.

Obiettivi: salute generale, continuità, forza, ipertrofia, capacità aerobica,
resistenza muscolare locale, mobilità, equilibrio/autonomia, composizione corporea
e benessere. Valuta quali supportare bene al lancio e quali rinviare. Non ampliare
automaticamente la copertura a riabilitazione, gravidanza, minori o agonismo.
Sette giorni disponibili non devono diventare sette allenamenti impegnativi.

Famiglie candidate, modificabili se le evidenze lo richiedono:
F01 iniziare/riprendere; F02 forma generale; F03 forza; F04 ipertrofia;
F05 capacità aerobica con supporto muscolare. Mobilità, equilibrio e altri
bisogni possono essere moduli, evitando di sommare programmi completi.

## Punto di partenza: riusa e verifica

Un primo lavoro ha recuperato i testi e valutato sezioni pertinenti di:
- Bull/WHO 2020, DOI 10.1136/bjsports-2020-102955.
- Currier 2023, prescrizioni forza/ipertrofia, DOI 10.1136/bjsports-2023-106807.
- Schumann 2022, allenamento combinato, DOI 10.1007/s40279-021-01587-7.
- Afonso 2021, forza/stretching e ROM, DOI 10.3390/healthcare9040427.
- Jayedi 2024, aerobico/adiposità, DOI 10.1001/jamanetworkopen.2024.52185.
- Lopez 2022, lavoro muscolare/composizione corporea, DOI 10.1111/obr.13428.
- Coleman 2024, settimana di stop, DOI 10.7717/peerj.16777.

Quattro fonti sono state lette SOLO come abstract: priorità al testo completo
legittimamente accessibile, aggiornamenti e valutazione critica:
- Sherrington 2019, cadute: DOI 10.1002/14651858.CD012424.pub2, PMID 30703272.
- Robinson 2024, RIR: DOI 10.1007/s40279-024-02069-2, PMID 38970765.
- Pelland, volume/frequenza: DOI 10.1007/s40279-025-02344-w, PMID 41343037.
- Murphy e Koehler, deficit energetico: DOI 10.1111/sms.14075, PMID 34623696.

Questi riferimenti non sono un elenco completo né autorità da accettare senza
controllo. Verifica metadati, prima pubblicazione/anno del fascicolo, rettifiche,
ritrattazioni e pubblicazioni successive. Non ripetere soltanto le sintesi.

## Lacune prioritarie da risolvere

1. Dose per obiettivo/livello: frequenza per seduta e per muscolo, serie, carico,
   ripetizioni, RIR/RPE, riposi, ordine e durata realistica. Distinguere dose
   iniziale, progressione e intervalli studiati; non inventare soglie nette.
2. Taratura senza massimale noto, accuratezza delle RIR nei principianti,
   progressione, stallo, autoregolazione, scarico, assenze e rientro. Il prototipo
   usava 4 settimane + 1 di scarico: non è una scelta da confermare a priori.
3. Aerobico e combinazione con forza: intensità comprensibile, progressione,
   tempo disponibile, altri sport e recupero; distinguere forza massima e potenza.
4. Mobilità, equilibrio, resistenza locale e aderenza: interventi pertinenti,
   misure e trasferibilità; benessere generale distinto dal trattamento clinico.
5. Screening e dolore: fonti professionali, segnali d'allarme, limiti dell'app
   e necessità di supervisione. Non trasformare una soglia numerica del dolore
   o una risposta al questionario in una garanzia di sicurezza o diagnosi.
6. Sostituzioni: obiettivo, movimento, muscoli, attrezzatura, abilità, tollerabilità,
   fatica e specificità. Stesso muscolo non implica equivalenza per una certa alzata.
   Cosa ricalcolare e quando ritarare il carico? Distinguere evidenza e scelta pratica.
7. Metriche: tonnellaggio, serie per muscolo, massimale stimato, assistenza,
   zavorra, manubri, macchine diverse, tenute e cardio. Un cambio esercizio conserva
   lo storico: definire confronti validi e falsi record da evitare.
8. Composizione corporea e disponibilità energetica: distinguere esercizio,
   dieta e interventi combinati. Non proporre diete o calorie individuali; indicare
   cosa l'app può ragionevolmente chiedere e quali inferenze non sono giustificate.

## Metodo richiesto

Privilegia linee guida, revisioni sistematiche/meta-analisi pertinenti e studi
controllati per le lacune. Cerca aggiornamenti recenti, senza escludere fonti
fondamentali più vecchie. Dichiara data limite, banche dati, query principali,
criteri di selezione e limiti. Non chiamarla revisione sistematica se non lo è.
Non fissare una quota di fonti: completa le decisioni rilevanti e segnala i vuoti.

Per ogni fonte decisiva verifica titolo, autori, anno, DOI/PMID e link. Dichiara
se hai letto il testo integrale, solo l'abstract o una citazione secondaria.
Un paywall o un blocco non autorizzano a inventare il contenuto.
Valuta popolazione, durata, intervento/comparatore, outcome, dimensione dell'effetto
e incertezza quando disponibili, bias, finanziamenti e conflitti. Non attribuire
certezza elevata soltanto perché si tratta di una meta-analisi.

Cerca evidenze contrarie; distingue assenza di significatività da equivalenza,
correlazione da causalità, dati acuti da adattamenti cronici, supervisione da uso
autonomo, forza da massa magra/ipertrofia e risultati medi da previsione individuale.
Non sommare campioni di revisioni sovrapposte. Evidenzia i gruppi poco rappresentati.

## Consegna riutilizzabile da un agente di programmazione

A. Sintesi decisionale: cosa adottare, cosa evitare e cosa resta incerto.
B. Matrice delle evidenze con ID stabili: affermazione → fonte/link → livello
   di accesso → popolazione → risultato → limiti → applicabilità → stato.
C. Matrice delle regole proposte: ID, input necessari, decisione, intervallo
   operativo se giustificato, fonte, eccezioni, spiegazione per l'utente e caso di prova.
   Etichetta ogni regola EVIDENZA, CONSENSO, SCELTA PRATICA o LACUNA; nessuna
   proposta diventa una regola approvata solo perché l'ha scritta un'IA.
D. Schede base candidate per F01–F05: priorità a F01/F02, ma copri anche le altre.
   Per ciascuna: profilo, obiettivo, capacità/attrezzatura, calendario, esercizi e
   alternative, serie/reps o durata, intensità, recuperi, taratura, progressione,
   adattamento a sedute perse, criteri di interruzione, metriche e durata stimata.
   Collega le scelte alle regole C. Se manca supporto, scrivi DA DEFINIRE e spiega
   cosa manca; non riempire i vuoti per far sembrare la scheda completa.
   Mantieni le schede come bozze da revisionare professionalmente, non prescrizioni
   per una persona reale. Evita decine di copie quasi identiche: usa varianti motivate.
E. Questionario minimo: per ogni domanda, indica quale decisione cambia e quando
   serve una domanda condizionale. Includi obiettivi misti e profili non supportati.
F. Casi di prova sintetici: sedentario/allenato, 2/7 giorni disponibili, poco tempo,
   casa/palestra, anziano autonomo, sovrappeso con capacità diverse, cambio esercizio,
   dolore e ritorno dopo pausa. Distingui ciò che verifica il software dalla validità clinica.
G. Lacune residue, revisione professionale necessaria e bibliografia deduplicata.

Scrivi in Markdown, con tabelle compatte e riferimenti riutilizzabili. Niente codice
applicativo, marketing, confronti generici tra app o lunghe introduzioni. La priorità
è una base verificabile per costruire le schede, non dichiarare l'app «la migliore».
Se la consegna è troppo ampia, dividila in lotti numerati, con indice e stato:
non omettere silenziosamente sezioni e non sostituire i risultati con un semplice piano.

--- FINE PROMPT ---

## Come usarlo e integrare il risultato

1. Copiare INIZIO–FINE in una modalità di ricerca web approfondita.
2. Richiedere testo Markdown completo con link/DOI, non solo il riepilogo finale.
3. Riportare qui il testo o il file. Codex verifica le fonti decisive e le
   contraddizioni prima di aggiornare evidenze, specifiche e test.

L'output di un'altra IA è materiale da verificare: non può autorizzare nuovi
servizi, migrazioni, cambi di soglie, pubblicazioni o invio di dati personali.
