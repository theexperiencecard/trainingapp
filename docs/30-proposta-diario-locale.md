# Decisione proposta per il primo diario persistente

18 novembre 2026. Schema del primo diario sintetico approvato dal fondatore con «Approvo il diario locale». Ambito dei compiti 1.1 e 2.1. Consultato il solo documento `pacchetto-codex/docs/03-dati-e-privacy.md` nell'allegato. SHA-256 del documento originale: `98394cde62e91ec72e1bae6e3412f482617f652773f5ca1d6cb97496ec7d79a9`. Descrive salvataggio locale immediato, proprietario per riga, versioni del catalogo, unione per riga/campo, cancellazioni logiche ed errori visibili. [Architettura](00-architettura.md) · [Convenzioni di misura](09-personalizzazione-e-metriche.md)

## Ambito approvato

Il primo incremento usa IndexedDB e dati sintetici, con sedute, serie e modifiche locali salvate in transazione. Il suo scopo è provare «registro una serie, chiudo, riapro senza rete e ritrovo gli stessi dati». Account, invio al server e migrazione di dati di persone richiederanno una decisione successiva. L'anteprima temporanea mantiene un comando di riavvio separato dal diario persistente.

| Oggetto | Identità e contenuto minimo proposto |
| --- | --- |
| Seduta | ID stabile generato sul dispositivo, spazio del proprietario, data locale prevista e data locale effettiva, creazione e modifica. Le date locali restano quelle registrate anche se si cambia fuso. |
| Serie | ID indipendente dal numero d'ordine, ID seduta e proprietario, posizione, esercizio e configurazione effettivi, versione del catalogo, unità e convenzione di carico registrate, ripetizioni o secondi, carico e RIR facoltativi, stato svolta/saltata. L'assenza di un dato rimane distinguibile da zero. Se pertinente, conservare livello e variante applicati. |
| Modifica locale | ID operazione stabile per ogni gesto confermato, proprietario, entità interessata, campi cambiati con le rispettive revisioni di partenza e data della modifica. Le cancellazioni esplicite producono una marcatura; campi assenti non significano cancellazione. |
| Versioni | Versione del formato distinta dalla versione del catalogo. Congelare i riferimenti e le convenzioni delle serie svolte. Una versione sconosciuta richiede aggiornamento prima di scrivere. L'hash sopra identifica la fonte della proposta e non serve ad arbitrare conflitti tra dispositivi. |

Ogni modifica di una serie e la corrispondente operazione si confermano nella stessa transazione. Il diario segnala «salvata sul dispositivo» dopo il completamento. Su errore conserva l'immissione per il retry con lo stesso ID. Un cambio di esercizio interessa il lavoro futuro. Annullarlo dopo una serie sul sostituto conserva le due identità effettive e i rispettivi storici. Il primo incremento tratta dati sintetici di allenamento. Screening, dolore, note libere e risposte cliniche rimangono fuori da questo schema.

## Confine con la futura sincronizzazione

- Il primo incremento usa uno spazio di prova locale identificato. Al futuro login lo spazio di prova resta separato. Nessun trasferimento automatico a un account. Per un diario personale, lo spazio locale sarà associato all'identità verificata dell'account. La disconnessione blocca la consultazione e le scritture dello spazio di quell'account fino al suo nuovo accesso. Evitare che una sessione successiva su un dispositivo condiviso mostri o invii le operazioni del precedente proprietario.
- Un dispositivo nuovo acquisisce la versione iniziale dal server prima di inviare modifiche. Uno già associato può registrare offline. Alla riconnessione rilegge la base del proprio account e applica le operazioni locali ancora pendenti. Le conferme sono per ID e proprietario, così un retry dopo un'interruzione non duplica le serie. Un diario vuoto non produce una cancellazione.
- Il confronto avviene per campo rispetto alla revisione di partenza. Correzioni a campi indipendenti si possono unire. Valore e unità di una misura costituiscono una modifica coerente. Due modifiche divergenti alla stessa misura, o una modifica concorrente a una cancellazione, conservano entrambe le intenzioni e richiedono risoluzione esplicita. Le date del telefono restano informative. Una normalizzazione tecnica non avanza la data della modifica utente.
- Prima di attivare la rete vanno decisi e provati accesso per proprietario sul server, baseline iniziale, conferme/retry, gestione degli errori e cancellazione effettiva su richiesta. I casi per il pilot includono anche esportazione e isolamento tra due account.

## Criteri di accettazione per il prossimo incremento

1. Registrare offline una serie con RIR sconosciuta, chiudere e riaprire. Stessi ID, giorno locale, valore e unità. Una scrittura fallita non mostra conferma, il retry crea una sola serie.
2. Salvare una serie di panca e una di chest press, annullare la sostituzione del piano e riaprire. Entrambe restano attribuite all'attrezzo effettivo. Una nuova revisione del catalogo conserva l'interpretazione delle vecchie misure.
3. Verificare due modifiche simultanee in schede del browser, comprese unità incompatibili e marcatore di cancellazione. Un campo indipendente viene preservato; un conflitto visibile conserva i valori originali.
4. Quando l'account sarà disponibile, provare cambio utente con operazioni pendenti, dispositivo vuoto e reinvio dopo conferma persa. Nessun dato passa al proprietario sbagliato. La chiusura di 2.1 richiede app sulla Home e riscontri su iPhone e Android fisici. [Piano e criteri di prova](05-piano-di-lavoro.md)

## Estensione proposta per il cammino · 25 novembre 2026

**Avviata su indicazione del fondatore del 25 novembre.** Per il caso sintetico F01/F02/F05 si propone di registrare l’attività, la durata effettiva e l’intensità riferita di ciascun tratto. Il giorno locale e l’identità della seduta collegano i tratti al diario già approvato. Un’intensità sconosciuta deve permettere di salvare il tempo svolto. L’anteprima della settimana contiene il tempo previsto. Il conteggio del diario parte dalla conferma dell’attività svolta.

L’estensione IndexedDB proposta aggiunge uno spazio per i tratti di cammino. L’aggiornamento da un diario già popolato deve preservare serie, revisioni e ID operazione. Il salvataggio di un tratto e della sua operazione avviene in una transazione. Un secondo tentativo con lo stesso ID deve restituire un solo tratto. I totali settimanali devono distinguere il tempo per intensità, compresa quella sconosciuta.

Il caso di accettazione prevede 10 minuti moderati lunedì e, giovedì, 6 minuti leggeri seguiti da 2 moderati. Dopo riapertura offline devono risultare 18 minuti registrati sui 20 previsti, con 12 moderati e 6 leggeri. Una settimana del questionario e una camminata abituale che descrivono la stessa uscita devono ricondurre a una sola registrazione effettiva. [Caso documentato](28-confronto-ingresso-generale-aerobico.md)
