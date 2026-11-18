# Riesame delle specifiche R2 con GPT-6.2 Astra

17 novembre 2026. Priorità alle conclusioni che cambiano il primo allenamento, una progressione o la lettura del grafico. Riesame mirato delle fonti e simulazione su carta delle specifiche. Gli stati di accesso sono nei registri [articoli](ricerca/fonti-r1.tsv), [query](ricerca/query-r1.tsv) e [documenti istituzionali](ricerca/documenti-istituzionali-r1.tsv).

| Punto riesaminato | Riscontro | Correzione e conseguenza |
| --- | --- | --- |
| Intensità aerobica | Il consenso congiunto esiste. S28 Bishop et al., PMID 41085254 e 41093682, stesso titolo e testo di consenso in due riviste. Letti entrambi gli abstract. Propongono cinque descrittori di sforzo. Il dettaglio sulle soglie CR10 citate nel rapporto esterno resta da verificare nel testo. | Un solo riferimento nel registro. Per la prova del parlato usiamo la pagina CDC I07, che la presenta come indicazione pratica. |
| Dose d'ingresso | I06, guida statunitense seconda edizione, pp. 62–63 e 90–91. Per adulti inattivi offre diversi esempi di attività breve e progressiva, inclusi cammino e una prima esposizione muscolare settimanale. | Il documento 21 ora offre un esempio da revisionare che funziona anche sotto la base A/B. Una dose personale dipende da capacità, tolleranza e riscontro. |
| Specificità della forza | S29, PMID 37582807. Revisione di 13 studi in adulti 18–60 anni con allenamento di almeno sei settimane. Sul test con pesi liberi il confronto favorisce chi ha praticato con pesi liberi (SMD −0,21, IC95% −0,39 a −0,03). Sul test a macchina la stima favorisce la macchina con IC che attraversa zero. Per ipertrofia solo cinque studi, misure eterogenee, SMD −0,055 (IC95% −0,397 a 0,287). Lette sezioni dei risultati e della discussione. | F03 conserva il gesto richiesto come riferimento. F04 può proporre una variante motivata per il muscolo e la persona. La stima aggregata lascia aperto quanto cambi lo stimolo per quella precisa coppia di esercizi. |
| Frequenza e RIR | Rilette eleggibilità e discussione S12. L'effetto sulla forza attribuito alla frequenza si attenua a volume equiparato. L'overview segnala evidenza insufficiente per fissare una RIR esatta. | Rimangono valide le qualifiche in 21/23. Venti serie distribuite in modi diversi provano soltanto che il conteggio torna. I margini RIR candidati richiedono ancora revisione. |
| Coerenza del prodotto | La sezione 4 del documento 01 chiedeva un consulto con conferma dopo ogni risposta positiva e proponeva solo 2–4 giorni. Controllo del dolore e consiglio sul peso rimandavano al prototipo. | Riallineate le istruzioni attive a Q7, al questionario R2 e alle finestre 2–7. Il dossier 18 resta in attesa del revisore. |

## Prova delle decisioni prima del codice

Casi sintetici letti dall'alto verso il basso nella tabella del documento 22. Un esito qui descrive il comportamento specificato. Il motore sarà verificabile dopo l'approvazione delle regole.

| Ingresso | Comportamento atteso nella bozza corretta | Errore individuato o prevenuto |
| --- | --- | --- |
| Due serie a 15 su 15, target 2–3 RIR, prima serie a 3 e seconda a 0 | P07 riesamina sforzo e carico. Con un segnale Q7 prevale invece P01. | La precedente P06 poteva richiedere di ripetere lo stesso carico solo perché le ripetizioni rientravano nel range. |
| Obiettivo 6–15, registrate 15 e 17 ripetizioni, sforzo coerente | P07 copre l'esito fuori range. | La tabella precedente lasciava scoperto il superamento del limite. |
| Primo utilizzo con esercizio e attrezzo noti, storico vuoto | P03 avvia taratura. Se manca l'identità della macchina, P02 chiede il dato. | L'assenza prevista di storico poteva provocare una richiesta impossibile da soddisfare. |
| Otto ripetizioni simultanee, due manubri da 10 kg, successiva visualizzazione in kg totali | Stessa serie, 20 kg totali × 8. Cambio macchina effettivo resta una nuova configurazione. | La vecchia attesa T10 avrebbe spezzato uno storico solo per il formato di visualizzazione. |
| Budget 32 minuti, cinque esercizi con due serie, quattro cambi da 1,25 min e recupero richiesto di 2 min anche ai cambi | Totale 33,5 min se i cambi si sovrappongono ai recuperi. Proporre una variante compatibile. | Il vecchio esempio da 30,5 avrebbe fatto sembrare sufficiente il budget. |
| Persona inattiva con obiettivo aerobico, capace di camminare comodamente, nessun ostacolo nel percorso Q7 revisionato | Esempio candidato di 5 min di cammino facile in due finestre. Se svolge 3 min, registrare 3 min leggeri. Rivalutare in base al riscontro. | Trasformare 150 min in quota iniziale o registrare ogni minuto come moderato falserebbe la proposta e il grafico. |

## Giudizio sullo stato del progetto

Il passaggio R1→R2 è ragionevole. La [seduta F03 del 18 novembre](26-seduta-forza-r2.md) applica le correzioni a un profilo definito e prepara la revisione di durata, alternativa e rientro. Restano da completare taratura dei carichi, salti disponibili e criteri di riduzione dopo pausa. La priorità tra 5–7 vere sedute di forza e altre estensioni richiede dati dagli utenti R3. La revisione professionale di Q7 e delle prescrizioni precede l'implementazione delle regole.

La verifica software attuale copre la schermata iniziale in tre lingue. Il questionario, il motore, l'installazione e le prove su dispositivi restano tappe successive. La stima precedente di qualche mese è un ordine di grandezza da ricalibrare dopo la prima seduta funzionante e la disponibilità del revisore.
