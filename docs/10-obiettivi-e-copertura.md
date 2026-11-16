# R1 — obiettivi estesi e copertura del catalogo

2026-11-16. Analisi documentale completata; ricerca bibliografica ancora bloccata.
Le priorità di lancio sotto sono proposte di prodotto, non risultati di mercato.
Le associazioni obiettivo/componenti sono ipotesi da verificare prima di prescrivere.

## Obiettivi da studiare

| Obiettivo espresso dall'utente | Capacità o risultato da distinguere | Proposta per l'app |
| --- | --- | --- |
| Muovermi di più, iniziare o riprendere | Abitudine, capacità iniziale, tolleranza alle attività | Famiglia di ingresso e taratura |
| Sentirmi in forma nella vita quotidiana | Capacità aerobica, forza funzionale, autonomia | Famiglia generale con componenti combinate |
| Diventare più forte | Prestazione in movimenti definiti | Famiglia forza con specificità esplicita |
| Aumentare la massa muscolare | Ipertrofia e misure pertinenti | Famiglia ipertrofia; tonnellaggio non usato come misura diretta della crescita |
| Avere più fiato | Capacità aerobica, durata o prestazione a sforzo comparabile | Famiglia aerobica con componente muscolare |
| Resistere più a lungo con i muscoli | Resistenza muscolare locale, distinta dal fiato | Modulo o variante specifica, da non confondere con forza massima |
| Muovermi meglio | Mobilità, controllo e compiti concreti | Modulo con obiettivi misurabili, senza promessa di correggere ogni postura |
| Essere più stabile e autonomo | Equilibrio, coordinazione e capacità funzionale | Modulo generale; percorso anziani/fragilità da studiare separatamente |
| Perdere grasso o ricomporre il corpo | Composizione corporea, mantenimento delle capacità, comportamento | Modificatore di una famiglia, non catalogo di esercizi «bruciagrasso» |
| Scaricare stress e stare meglio | Benessere percepito, piacere e continuità | Preferenza trasversale; nessuna promessa terapeutica |
| Migliorare nello sport, potenza o abilità | Prestazione sportiva e gesti specifici | Estensione successiva, distinta dalla prima libreria generale |

Dimagrimento, benessere e riduzione del dolore non devono diventare promesse
garantite. Un bisogno di riabilitazione o una condizione clinica richiedono un
percorso specifico, non la semplice selezione di una famiglia generica.
La domanda di mercato per queste famiglie resta da verificare con R3.

## Estensione delle domande scientifiche

Q1–Q9 restano nel protocollo 08. Aggiungere:

| ID | Domanda | Evidenze necessarie |
| --- | --- | --- |
| Q10 | Come costruire e progredire attività aerobica e combinarla con il lavoro muscolare? | Linee guida e studi per adulti inattivi/attivi; intensità, durata, interazioni e aderenza |
| Q11 | Come migliorare mobilità e controllo nei compiti scelti? | Studi longitudinali su forza, stretching e ROM; distinguere mobilità da trattamento del dolore |
| Q12 | Come allenare equilibrio, autonomia e potenza in sicurezza? | Popolazioni e rischi espliciti; distinguere adulti sani, anziani autonomi e fragilità |
| Q13 | Quali scelte favoriscono aderenza e benessere? | Interventi comportamentali e attività preferite; distinguere esiti autoriferiti e clinici |
| Q14 | Come adattare l'attività a obiettivi di composizione corporea? | Esercizio isolato vs dieta/interventi combinati; massa grassa, magra, capacità e sostenibilità |
| Q15 | Come programmare resistenza muscolare locale e supporto allo sport? | Outcome specifici e trasferibilità; non estrapolare automaticamente da forza/ipertrofia |

Ricerche previste, non ancora eseguite con successo: `aerobic exercise AND
sedentary adults AND guideline`; `concurrent training AND meta-analysis`;
`resistance training AND range of motion AND systematic review`; `balance
training AND older adults AND systematic review`; `exercise adherence AND
systematic review`; `exercise AND body composition AND obesity AND meta-analysis`.
Separare campioni clinici/non clinici ed evitare limiti temporali che escludano
linee guida ancora pertinenti; cercare gli aggiornamenti e le evidenze discordanti.

## Audit riproducibile del pacchetto

Analizzati i JSON originali nell'allegato, senza importarvi dati personali.
SHA-256 di `data/esercizi.json`:
`cbbb1727ae644330d98878d71ccace3c005569d0a8f52aa671d26804df4f27af`.

- 48 voci complessive, incluse 7 con unità `check`: non sono 48 esercizi distinti
  pronti per generare schede. Alcune altre voci sono varianti o movimenti accoppiati.
- 12 voci marcate `skill`, 11 marcate `strength`; le categorie si sovrappongono.
  L'assenza del tag non dimostra che un esercizio non alleni la forza.
- 2 voci `cardio`, entrambe legate ad attività di montagna; copertura insufficiente
  per una libreria aerobica generale e per preferenze/attrezzature diverse.
- `sedute-esempio.json` dichiara un solo modello personale: tre sedute principali
  con attività accessorie. Sette chiavi di giorni non significano sette schede.
- 23 casi di test storici. Verificano il prototipo, non l'idoneità ai nuovi obiettivi.
- Mancano campi strutturati generali per attrezzatura, schema di movimento,
  equivalenza condizionata all'obiettivo e capacità necessarie. Esistono descrizioni
  testuali e tag specifici, ma non un modello di classificazione già validato.

## Materiale riutilizzabile e lacune

| Area | Materiale identificato | Lavoro necessario |
| --- | --- | --- |
| Lavoro muscolare | Rematore, goblet squat, trap bar, dips, trazioni e accessori | Verificare varianti d'ingresso, copertura dei movimenti e alternative per attrezzi |
| Mobilità | Lavoro per spalle e varianti di pike/pancake | Separare obiettivi specialistici da mobilità generale; verificare progressioni |
| Equilibrio | Soprattutto abilità di verticale | Non usarle come sostituto di un percorso generale di equilibrio/autonomia |
| Aerobico | Attività specifiche di montagna | Ampliare con modalità generali dopo revisione; definire misure e progressione |
| Ingresso sedentari | Nessun modello dedicato verificato | Valutazione iniziale, accessibilità, alternative e aderenza |
| Casa senza attrezzi/macchine | Copertura non sistematica | Inventario dei bisogni e revisione di nuovi esercizi prima di aggiungerli |

I nomi qui riportati identificano contenuti del catalogo; non ne certificano
l'appropriatezza per un principiante o un determinato profilo.

## Accesso e stato delle evidenze

Ritentate il 2026-11-16: ricerca Europe PMC su resistance training/hypertrophy,
ricerca PubMed su exercise/systematic review e pagina WHO sull'attività fisica.
Tutte: `Tunnel connection failed: 403 Forbidden`. Stato ambiente corrente:
rete restricted, elenco domini personalizzati applicati vuoto. La bozza salvata
contiene i tre domini richiesti; non è prova di accesso attivo.

Nessuna nuova pubblicazione è stata identificata o letta in questa sessione.
R1 rimane in corso. Servono aggiornamento effettivo della rete o testi originali
forniti dall'utente; poi applicare il protocollo 08, senza trasformare queste
ipotesi di prodotto in prescrizioni scientificamente validate.
