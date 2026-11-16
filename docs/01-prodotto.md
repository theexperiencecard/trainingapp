# Il prodotto

Stato: bozza del 16 novembre 2026. La ricerca di mercato (vedi `brief-ricerca.md`) può cambiare pubblico, nome, prezzi e questionario. Tutto ciò che è segnato come **bozza** va costruito in modo che si possa cambiare senza toccare il codice.

## Priorità aggiornate (2026-11-16)

1. Qualità scientifica verificabile, con programmi distinti per obiettivi e profili.
2. Personalizzazione, sostituzione degli esercizi e lettura corretta dei progressi.

La ricerca deve valutare disponibilità da 2 a 7 giorni, esperienza, capacità,
attività, recupero e vincoli: i profili supportati al lancio saranno decisi in R2.
Il perimetro 2–4 giorni sotto è la bozza precedente, non la copertura finale approvata.
«90% perfetto» è un'ambizione da tradurre in criteri, non una garanzia di risultato.
Le dosi e il ciclo del prototipo attendono revisione; fonti e requisiti nei documenti 08 e 09.

L'utente richiede copertura anche oltre forza/ipertrofia: salute generale, ripresa,
capacità aerobica, mobilità, equilibrio e altri bisogni pertinenti. La ricerca
estesa è nel documento 10; famiglie e moduli del documento 11 sono proposte R2.
La presenza di un obiettivo tra le proposte non significa che sia già supportato.

## 1. Per chi

Principianti e persone che si allenano in palestra 2-4 volte a settimana, non soddisfatte dell'app fornita dalla palestra o di altre app.

## 2. Cosa promette

Una scheda adatta a te in 3 minuti, una guida serie per serie in palestra, e carichi che si adattano a come è andata l'ultima volta e a come stai oggi.

## 3. La prima versione: web, per la validazione

Serve a una prova con 10-20 persone per 4-6 settimane. Deve contenere solo questo:

| Funzione | Cosa fa |
| --- | --- |
| Questionario | Al massimo 20 domande, meno di 3 minuti, poi assegna un modello di scheda |
| Seduta guidata | Una serie alla volta, valori precompilati dall'ultima volta, timer di riposo, serie di avvicinamento |
| Consiglio sul peso | Secondo `02-regole-allenamento.md` |
| Ripetizioni in serbo | Chieste dopo ogni serie di forza, con un tocco |
| Controllo del dolore | Prima della seduta e durante le serie, con le regole di `02-regole-allenamento.md` |
| Cicli e scarico | Da approvare in R2; 4 settimane + 1 è la configurazione storica |
| Sostituzioni | Cambio manuale oggi o nel programma, conseguenze esplicite, annullamento e storico conservato |
| Metriche | Grafici per esercizio/variante; tonnellaggio con unità e limiti espliciti |
| Storico | Tutte le settimane, serie per serie, con note |
| Progressi | Livelli e punti neutri, vedi sezione 5 |
| Tre lingue | Italiano, tedesco, inglese |
| Account e sincronizzazione | Accesso con email, dati su più dispositivi |
| Funzionamento senza rete | La seduta si fa anche senza segnale |

Fuori dalla prima versione: store, pagamenti, coach in chat completo, orologi e app salute, piano di resistenza in salita, illustrazioni animate. Il coach entra dopo, vedi `04-coach-ai.md`.

## 4. Questionario e modelli di scheda (bozza)

Le domande e i modelli stanno in file di dati, non nel codice.

Domande di partenza:

1. Obiettivo: forza, massa muscolare, forma generale, perdere peso.
2. Esperienza: mai allenato, meno di 1 anno, 1-3 anni, più di 3 anni.
3. Giorni a settimana: 2, 3, 4.
4. Minuti per seduta: 30, 45, 60, 75.
5. Dove ti alleni: palestra completa, palestra piccola, casa con manubri, casa a corpo libero.
6. Dolori o limitazioni attuali, per zona.
7. Età e sesso.
8. Altri sport e quante volte a settimana.
9. Esercizi che non vuoi o non puoi fare.
10. Domande di sicurezza: dolore al petto sotto sforzo, svenimenti, problemi di cuore, gravidanza, interventi recenti. Con una risposta positiva l'app invita a parlare con il medico prima di iniziare e non assegna la scheda finché l'utente non conferma di averlo fatto.

Modelli di partenza per la validazione, da portare a 30-40 dopo la ricerca:

| Modello | Giorni | Luogo |
| --- | --- | --- |
| Tutto il corpo, principiante | 2 | palestra |
| Tutto il corpo, principiante | 3 | palestra |
| Parte alta e parte bassa | 4 | palestra |
| Tutto il corpo con manubri | 3 | casa |
| Corpo libero | 3 | casa |
| Calisthenics e forza (quello del prototipo, in `data/sedute-esempio.json`) | 3 | palestra |

Ogni modello è un elenco di sedute fatte di blocchi, nello stesso formato di `data/sedute-esempio.json`. Gli esercizi vengono da una libreria unica, `data/esercizi.json`, da ampliare.

## 5. Livelli e parte a gioco

Deve far venire voglia di tornare senza far sentire in colpa.

- **Livello generale da 1 a 25,** senza titoli a tema. Nel prototipo i titoli sono "Acrobata", "Funambolo" e simili: vanno tolti.
- **Statistiche:** Forza, Resistenza, Mobilità, Costanza. Nel prototipo esistono anche Equilibrio e Saggezza: Equilibrio resta solo nei modelli con abilità, Saggezza diventa Costanza.
- **Punti:** per ogni serie fatta, per la seduta completata, per il controllo del dolore, per lo scarico rispettato e per l'esercizio saltato a causa del dolore. Premiare la scelta prudente è voluto.
- **Livelli per abilità o esercizio:** scale con un criterio numerico per salire, come in `data/livelli.json`.
- **Da evitare:** serie di giorni consecutivi che si azzerano, classifiche tra utenti, notifiche che fanno sentire in colpa, premi per allenarsi anche con dolore.

## 6. Schermate

1. **Oggi:** seduta del giorno, avvio, stato della settimana, possibilità di anticipare o spostare una seduta.
2. **Seduta guidata:** una serie alla volta, pulsanti grandi, timer.
3. **Progressi:** livello, statistiche, mappa delle settimane, storico.
4. **Esercizi e livelli:** come si fa ogni esercizio, scale e test.
5. **Coach:** chat, quando sarà attiva.
6. **Profilo:** dati, lingua, attrezzatura, esportazione e cancellazione dei dati.

Cosa il prototipo fa bene e va mantenuto: valori precompilati, un tocco per registrare una serie, "ultima volta" visibile sotto l'obiettivo, modifica di una serie già salvata, annulla, nota per esercizio, timer che sopravvive alla chiusura dell'app.

## 7. Decisioni ancora aperte

- Nome e marchio. "Quota" è provvisorio e va sostituito: non usarlo nei testi per l'utente.
- Pubblico di lancio più ristretto, oppure no.
- Prezzi e piani.
- Come mostrare gli esercizi: illustrazioni animate prodotte in casa. Fino ad allora testo e passi scritti.
- Chi rivede schede e regole sul dolore dal punto di vista professionale.
