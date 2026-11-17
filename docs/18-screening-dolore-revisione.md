# R1/Q7 — dossier per screening e dolore

2026-11-17. Dossier documentale preparato; **non è un protocollo clinico approvato**.
Nessuna modifica alle soglie del prototipo o all'app. Serve a rendere concrete le
scelte da revisionare in R2, senza una nuova ricerca generale.

## Evidenze e limiti

Riutilizzati S18 (abstract ACSM 2015), I01/I02 (questionario e riferimento CSEP letti).
Tre verifiche mirate aggiuntive, senza ricerca sistematica: pagine ufficiali NICE/NHS,
selezionate per distinguere assistenza urgente, consulto e attività quotidiana.
URL, versioni e hash HTML in [registro istituzionale](ricerca/documenti-istituzionali-r1.tsv).

| Fonte | Sezioni valutate e risultato utile | Limite di applicabilità |
| --- | --- | --- |
| S18 / I01 / I02 | Attività abituale, sintomi/condizioni note e intensità prevista; CSEP distingue storia recente da dolore/gonfiore attuale e restrizioni ricevute | Screening non è diagnosi, nulla osta generale o triage completo. Il «sì» richiede il ramo pertinente, non un blocco indistinto |
| I03 NICE NG59 | Raccomandazioni 1.1.1–1.2.2: rivalutare sintomi nuovi/cambiati; considerare cause specifiche; informazione e attività adattate alle capacità, incoraggiando attività normali nel percorso appropriato | Linea guida clinica sulla lombalgia/sciatica >16 anni; non algoritmo fitness generale. Non adottati strumenti diagnostici, trattamenti o farmaci |
| I04 NHS Back pain | Sezioni su consulto ordinario/urgente/emergenza e attività: peggioramento rapido, sintomi sistemici o neurologici richiedono percorsi diversi; non raccomanda riposo a letto prolungato | Informazione pubblica britannica sulla schiena; non una lista esaustiva per ogni distretto. Fermare un esercizio provocativo non equivale a prescrivere immobilità |
| I05 NHS Chest pain | Sezioni assistenza immediata e non urgente: sintomi toracici persistenti improvvisi, irradiati o associati a dispnea/malessere non vanno gestiti come fatica ordinaria | Nessuna diagnosi automatica; versione con revisione programmata già scaduta alla data di accesso, da ricontrollare prima dell'uso nel prodotto |

I03: pagina aggiornata 29 luglio 2026, raccomandazioni selezionate marcate 2016.
I04: pagina revisionata 5 marzo 2026. I05: revisionata 8 agosto 2023, revisione prevista
8 agosto 2026. Queste date descrivono quanto esposto, non certificano l'aggiornamento
clinico di ogni frase. Non valutati sistematicamente tutti gli studi sottostanti,
finanziamenti o conflitti dei gruppi delle linee guida.

## Percorsi candidati, da revisionare

La tabella definisce una proposta di comportamento, **non istruzioni sanitarie per
un utente reale**. Le condizioni sono esempi per la revisione, non un elenco esaustivo
di segnali né un classificatore con sensibilità/specificità note.

| ID | Contesto da distinguere | Comportamento dell'app proposto | Fondamento / scelta pratica |
| --- | --- | --- | --- |
| Q7-P01 | Sintomi attuali compatibili con bisogno di assistenza immediata, per esempio i quadri descritti da I04/I05 | Interrompere la guida all'allenamento e rendere subito accessibili istruzioni di assistenza locale; niente quiz lungo, alternative o coach prima dell'aiuto | Indicazioni delle fonti; testo, combinazioni e destinazioni locali da revisione clinica |
| Q7-P02 | Problema nuovo o peggioramento che richiede consulto, senza classificazione automatica come emergenza | Sospendere la raccomandazione coinvolta e indirizzare alla valutazione appropriata; non diagnosticare, non proporre semplicemente un esercizio diverso | I02/I04; estensione esatta della sospensione è proposta da revisionare |
| Q7-P03 | Condizione stabile o restrizione già discussa con un professionista | Considerare le indicazioni vigenti; se non traducibili nel perimetro dell'app, dichiarare il limite e chiedere chiarimento professionale | S18/I02; una condizione nota non implica divieto universale né autorizzazione illimitata |
| Q7-P04 | Fastidio riferito durante un esercizio, senza elementi sufficienti per attribuirne causa/gravità | Consentire di fermare o saltare l'esercizio; raccogliere il minimo contesto utile e applicare il percorso revisionato prima di suggerire alternative | I02/I04 + scelta UX; niente «è solo DOMS» o soglia numerica che certifichi sicurezza |
| Q7-P05 | Nessun segnale dichiarato, risposte sufficienti per il profilo supportato | Accedere al percorso graduale e alla taratura; possibilità di interrompere/riferire un cambiamento in qualsiasi momento | S18/I01; assenza di segnalazioni non è garanzia di assenza di problemi |
| Q7-P06 | Risposte mancanti, contraddittorie o incerte su un passaggio necessario | Chiarimento breve; se irrisolto, non fabbricare idoneità o una prescrizione individuale. Conservare quanto già registrato | Scelta progettuale; non trasformare ogni incertezza in emergenza |

Precedenza candidata: un segnale urgente attuale prevale su preferenze, obiettivo,
prescrizioni precedenti e richieste del coach. Un problema locale non diventa da solo
un divieto di ogni attività. La risoluzione automatica dopo un tempo arbitrario,
un voto più basso o una singola risposta «sto meglio» non è supportata come regola universale.
Un nuovo sintomo rende da riesaminare il contesto: uno screening passato non copre
automaticamente ogni seduta futura. La frequenza fissa di ripetizione resta da decidere.

## Domande e dati: solo proposta funzionale

- Distinguere «adesso», evento passato, cambiamento rispetto al solito e indicazioni
  professionali già ricevute; chiedere soltanto ciò che cambia il percorso.
- Dolore numerico opzionale come descrizione, mai unico criterio di via libera;
  impatto sul movimento e andamento vanno valutati nel percorso pertinente.
- Nessuna richiesta di referti, immagini, diagnosi dettagliate o farmaci come
  prerequisito implicito. Necessità, conservazione e accesso ai dati vanno definite
  nel lavoro privacy/schema già previsto, prima di implementarli.
- Lingua dell'interfaccia e paese di utilizzo sono distinti. Non copiare 999/111
  britannici nelle traduzioni it/de/en; la destinazione locale va verificata.
- Informazioni essenziali disponibili senza rete e senza chat a pagamento;
  annullare la seduta non cancella le serie già salvate. Sono requisiti proposti.

## Casi di accettazione candidati per R2

Sono attese da revisionare, non test software già eseguiti o validazione clinica.

| Caso | Attesa proposta |
| --- | --- |
| Q7-T01: segnale urgente attuale, anche con voto dolore basso | P01; nessun numero ridimensiona automaticamente il segnale |
| Q7-T02: solo storia passata, nessun sintomo attuale | Distinguere P03/P05 dal ramo urgente; non equiparare storia ed emergenza |
| Q7-T03: fastidio durante una serie e richiesta di sostituzione | Fermare/saltare consentito, contesto prima di alternativa; nessuna promessa «questa non fa male» |
| Q7-T04: peggioramento rapido descritto dopo screening iniziale negativo | Riesame del percorso; lo screening precedente non prevale |
| Q7-T05: restrizione professionale incompatibile con esercizio preferito | Nessuna proposta che aggiri la restrizione; esplicitare il limite |
| Q7-T06: risposta essenziale mancante o contraddittoria | P06; nessun valore predefinito equivalente a «nessun problema» |
| Q7-T07: app senza rete o coach indisponibile | Stesso accesso alle informazioni essenziali; serie conservate |
| Q7-T08: ritorno dopo sintomo senza criterio di ripresa revisionato | Nessun automatismo basato su giorni trascorsi o voto; indicare cosa manca |
| Q7-T09: cambio lingua/paese | Testo comprensibile e assistenza locale corretta, senza dedurre paese dalla lingua |

## Scheda pronta per il revisore professionale

Inviare soltanto se autorizzato dall'utente; nessun contatto o servizio attivato qui.
Destinatario: professionista sanitario competente per screening e dolore nell'esercizio;
le prescrizioni di allenamento richiedono anche competenza pertinente nell'esercizio.

> Esamina Q7-P01–P06 e Q7-T01–T09 per un'app fitness autonoma, non riabilitativa.
> Per ogni riga indica: approvabile/modificare/fuori perimetro; condizioni precise,
> formulazione comprensibile, fonte/versione, limiti, azione e criterio di ripresa.
> Controlla falsi allarmi, segnali mancati, sintomi attuali vs storici, minimi dati
> necessari e compatibilità con i paesi/profili di lancio ancora da confermare.
> Segnala quali percorsi richiedono supervisione e quali fonti vanno aggiornate.
> Non trasformare una scala numerica in diagnosi. Riporta nome, qualifica, data,
> conflitti pertinenti e responsabilità della revisione; non certificare l'intera app.

## Stato e limite del blocco

Dossier Q7 pronto per revisione, **Q7 non clinicamente validato**. Restano aperti:
perimetro/paesi di lancio, testo e criteri dei rami, ripresa, attualità e condizioni
di riuso delle fonti, valutazione professionale. Questi punti non impediscono di
preparare Q6/Q8 e le altre parti indipendenti. Non è necessario accumulare altri
articoli generici per far avanzare questa decisione.
