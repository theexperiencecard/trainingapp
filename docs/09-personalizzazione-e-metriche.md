# Personalizzazione, sostituzioni e metriche — requisiti da validare

Proposta R0 del 2026-11-16. Questi sono requisiti di prodotto e casi di accettazione
proposti, non uno schema dati o nuove prescrizioni di allenamento già approvati.

## Questionario e adattamento

Distinguere obiettivo primario (forza in movimenti scelti, ipertrofia, altro),
esperienza effettiva, capacità iniziali, disponibilità di 2–7 giorni, durata,
attrezzatura, attività quotidiana/altri sport, recupero, preferenze e limitazioni.
Ogni domanda deve cambiare una decisione o un percorso: evitare raccolta inutile.
Usare domande condizionali; verificare sul campo il vincolo dei tre minuti.
Non dedurre capacità o programmi solo da peso, aspetto, sesso o calorie dichiarate.

Prima della scheda, mostrare giorni assegnati, obiettivo e motivazione sintetica.
Disponibilità e prescrizione sono distinte; dichiarare i profili non supportati.
Nelle prime sedute tarare carichi e difficoltà con riscontri osservabili, senza
promettere la perfezione del questionario. Dose e regole vengono da R1/R2.

## Sostituzione manuale nella prima versione

La sostituzione di base è parte del prodotto iniziale, indipendente dalla chat.
Una proposta valuta obiettivo, movimento, muscoli coinvolti, attrezzatura,
abilità richieste, vincoli individuali e impatto sul resto della seduta.
«Stesso muscolo» non dimostra equivalenza per migliorare una specifica alzata.

Flusso proposto:
1. Scegliere il motivo e l'ambito: solo oggi oppure anche nelle sedute future.
2. Mostrare alternative motivate; esplicitare se cambia lo stimolo o l'obiettivo.
3. Mostrare l'effetto su serie, ripetizioni, riposo, eventuale superset e carico
   iniziale. Nessuna conversione automatica dei kg senza regola giustificata.
4. Confermare, registrare il cambiamento e consentire l'annullamento.

Se il motivo è dolore, applicare il percorso specifico revisionato: nessuna
alternativa va presentata come sicuramente sicura perché ha un nome diverso.
Se manca un'alternativa appropriata, l'app deve dirlo invece di inventarne una.
Cambiare programma futuro non riscrive serie già svolte o grafici storici.
Annullare dopo aver registrato serie conserva quanto realmente eseguito.

## Grafici e significato delle misure

- Ogni esercizio/variante identificabile ha il proprio storico. Passando a un
  nuovo esercizio, mostrare «nuovo storico» e un indicatore del cambio programma.
- Tornando a un esercizio precedente, riprendere il suo storico; eventuali periodi
  vuoti restano visibili. Non interpolare miglioramenti durante l'assenza.
- Separare attrezzi/macchine non confrontabili e convenzioni di carico: totale,
  per manubrio, assistenza, zavorra o carico esterno a corpo libero.
- Tonnellaggio: somma di carico registrato × ripetizioni, soltanto dove unità e
  convenzione sono definite. Non rappresenta lavoro meccanico, crescita muscolare
  o forza in modo diretto. Un valore mancante non equivale a zero.
- Non sommare tenute in secondi, elastici senza carico misurato e kg come se
  fossero la stessa misura. Mostrare metriche pertinenti e dati mancanti.
- Un cambio di esercizio o macchina non deve generare automaticamente un record
  di forza per il vecchio esercizio. Eventuali massimali stimati vanno etichettati
  come stime con limiti di validità da definire nella ricerca.
- Riepiloghi di programma: separare aderenza, serie per categorie e prestazioni.
  Il conteggio delle serie per muscolo richiede regole esplicite, evitando che
  ogni serie multiarticolare diventi una serie piena per ogni muscolo coinvolto.

Esempio grafico da prototipare: panca con bilanciere e chest press hanno due
grafici distinti; una linea temporale del programma mostra quando è avvenuto
il cambio. Il riepilogo delle sedute rimane continuo, senza una falsa linea
che colleghi direttamente i kg dei due esercizi.

## Modifiche avanzate e coach

Proposta: modifiche essenziali e protezioni nel prodotto base; chat e assistenza
avanzata come possibile servizio a pagamento. La divisione commerciale è aperta.
La chat propone azioni strutturate; codice indipendente verifica i vincoli e
l'utente conferma. Non può aggirare le regole approvate. La scienza non dipende
dall'abbonamento. Nessun prezzo, API o fornitore aggiuntivo è scelto qui.

## Casi di accettazione da trasformare in test dopo R2

| Caso | Risultato richiesto |
| --- | --- |
| Persona sedentaria e persona allenata con gli stessi giorni liberi | Il motore considera capacità/esperienza e spiega eventuali differenze |
| Disponibilità di 7 giorni | Non prescrive automaticamente 7 sedute impegnative |
| Stesso profilo, obiettivo forza oppure ipertrofia | Scelte motivate da regole specifiche, non solo un'etichetta diversa |
| Attrezzatura assente o nessuna alternativa compatibile | Messaggio chiaro e percorso valido; nessun esercizio inventato |
| Cambio esercizio durante la seduta | Serie precedenti e storico conservati; nuove serie attribuite all'esercizio svolto |
| Cambio bilanciere/macchina o convenzione dei manubri | Nessun confronto o record automaticamente equivalente |
| Ripristino di un esercizio precedente | Storico precedente recuperato, nessun trasferimento arbitrario di kg |
| Annullamento dopo una serie sul nuovo esercizio | Serie realmente svolta conservata; ripristino del programma esplicito |
| Dolore o profilo non supportato | Percorso revisionato, non sostituzione presentata come garanzia di sicurezza |
| Richiesta IA incompatibile con le regole | Azione rifiutata senza modificare i dati |

Validazione: revisione scientifica/professionale per le prescrizioni, test software
per i vincoli, prove d'uso per comprensione e facilità. Sono evidenze diverse.
