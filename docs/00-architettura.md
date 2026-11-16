# Proposta di architettura — compito 0.1

Data: 2026-11-16. Stato: approvata dall’utente. Compito 0.1 completato.
Scelta: React e Vite; Expo escluso per questa versione.

## Vincoli approvati

- Ogni partecipante alla prova installa l'app sulla schermata Home. Account e
  sincronizzazione devono essere pronti e verificati prima della prova.
- I timer a conto alla rovescia persistono l'orario di fine e calcolano il tempo
  residuo dalla differenza con l'orario corrente, senza contare i secondi.
- Il compito 2.1 si chiude solo con prove positive su un iPhone e un Android reali,
  con installazione sulla Home, salvataggio senza rete e riavvio dell'app.

## Scelta approvata

TypeScript rigoroso, React e Vite per una web app installabile (PWA).
Vitest per i test, TypeScript per il controllo dei tipi, ESLint per il lint.
Un solo progetto npm e un solo file di blocco delle dipendenze.
CSS semplice e componenti piccoli; introdurre altre librerie solo quando servono.

È la soluzione più coerente con la prova web con 10–20 persone e con le circa
5 ore settimanali disponibili. Si può distribuire la stessa interfaccia sul web
e valutarne successivamente l'inserimento in Capacitor per gli store.
Questo passaggio richiederà comunque prove e adattamenti sui dispositivi.

## Alternative e conseguenze

| Aspetto | React + Vite, consigliato | Expo + React Native |
| --- | --- | --- |
| Prima prova web | Percorso diretto, interfaccia HTML e CSS | Supporta il web, con componenti e convenzioni React Native |
| Uso senza rete | IndexedDB e cache dell'app da progettare e provare | L'app nativa offre una base favorevole; la versione web richiede comunque una soluzione specifica |
| Store futuri | Possibile percorso con Capacitor, da validare | Percorso nativo già previsto dall'ecosistema |
| Manutenzione iniziale | Un ambiente web e strumenti comuni | Maggiore attenzione alle differenze tra web, Android e iOS |
| Quando preferirlo | Validare prima il prodotto web | App nativa e integrazioni del telefono necessarie già al lancio |

Expo è una buona alternativa se cambia la priorità verso gli store.
Nessuna delle due scelte risolve automaticamente conflitti e sincronizzazione.

La documentazione React consiglia generalmente un framework completo e segnala
il costo di gestire navigazione e caricamento dei dati con una configurazione
personalizzata. Qui Vite è una scelta consapevole: il percorso principale deve
funzionare sul dispositivo, mentre rendering sul server e indicizzazione delle
schermate di allenamento non sono requisiti. La navigazione sarà definita quando
esisteranno le prime schermate; evitiamo di costruire un framework interno.

## Struttura proposta, da creare gradualmente

```text
trainingapp/
  AGENTS.md                 istruzioni di lavoro
  DECISIONI.md              scelte e motivazioni
  docs/                     specifiche e piano di lavoro
  data/                     cataloghi e casi di prova verificati
  prototipo/                riferimento di comportamento
  src/
    app/                    avvio e collegamento delle parti
    core/                   regole pure di allenamento e relativi test
    features/               schermate raggruppate per funzione
    components/             elementi visivi condivisi quando necessari
    storage/                salvataggio sul dispositivo, dalla tappa 2
    sync/                   sincronizzazione, dalla tappa 4
    locales/                it.json, de.json, en.json
    styles/                 temi, spaziature e accessibilità
  public/                   risorse statiche, poi manifest e icone
  tests/                    prove che coinvolgono più parti
  supabase/                 database e funzioni server, dalla tappa 4
```

Le cartelle sono una destinazione prevista, non moduli da creare tutti subito.
I test unitari possono stare accanto al modulo come `nome.test.ts`.
Il pacchetto allegato resta la fonte dei materiali: questo compito importa
solo piano e registro delle decisioni, oltre alla presente proposta.
Il prototipo e i dati vanno controllati prima dell'importazione: il README del
pacchetto segnala contenuti personali, che non devono diventare dati di esempio.

## Confini tra le parti

- `core` riceve valori e restituisce risultati: niente React, rete o database.
  Date locali e istante corrente entrano come dati espliciti, così i test sono
  ripetibili e il fuso del server non decide il giorno di allenamento.
- `features` mostra i risultati e raccoglie gli input. I testi visibili sono
  nelle traduzioni; formattazione di numeri e date segue la lingua dell'utente.
- `storage` gestisce scritture locali e relativi errori. Una serie è mostrata
  come salvata solo dopo il completamento della scrittura persistente.
- `sync` scambia le modifiche con il server e rende visibili gli errori.
  Lo schema, i conflitti e le cancellazioni saranno definiti nelle tappe dedicate.
- `app` collega queste parti. Il motore resta utilizzabile anche senza interfaccia.

## Funzionamento senza rete

Proposta per la tappa 2: IndexedDB per i dati locali e un service worker per
rendere disponibili i file necessari ad avviare l'app già caricata almeno una volta.
La cache dell'interfaccia e il salvataggio delle serie sono due responsabilità distinte.
La libreria di supporto e il formato dei dati saranno scelti nel compito 2.1.

Gli aggiornamenti dell'app devono rispettare una seduta in corso. Occorre provare
chiusura, riapertura, aggiornamento, errori di scrittura e assenza di rete sui
browser dei telefoni usati per la validazione. Il browser può cancellare dati
locali: la persistenza va richiesta dove disponibile e i limiti vanno gestiti;
il solo IndexedDB non è una garanzia assoluta contro ogni perdita di dati.

Supabase resta il candidato per account, Postgres e funzioni server nella tappa 4.
Le regole di accesso per riga dovranno avere test di isolamento tra utenti.
La sincronizzazione delle scritture locali sarà una funzione dell'app: non basta
abilitare Supabase Realtime. Hosting europeo e requisiti di privacy andranno
verificati prima di configurare il servizio. Il coach arriverà dopo la validazione
e chiamerà il modello dal server, come previsto dai documenti di prodotto.

## Strumenti e prossimo compito

Il compito 0.2 introdurrà React, React DOM, TypeScript, Vite con il plugin React,
Vitest, ESLint e i pacchetti di tipi e lint necessari alla configurazione scelta.
Le versioni stabili compatibili saranno verificate al momento dell'installazione
e registrate nel lockfile; Node verrà fissato a una versione LTS compatibile.
Nell'ambiente attuale sono disponibili Node 24.22.1 e npm 11.9.0.
Questo inventario non equivale a una prova di compatibilità del futuro progetto.

Comandi previsti per il compito 0.2, ancora da implementare:

- `npm ci`: installazione ripetibile dal lockfile.
- `npm run dev`: avvio dello sviluppo.
- `npm run check`: test senza modalità interattiva, tipi e lint, con errore
  se uno dei controlli fallisce; deve eseguire almeno un test significativo.
- `npm run build`: verifica della compilazione per la distribuzione.

La configurazione iniziale deve poter essere verificata senza account esterni.
I casi di allenamento del pacchetto entreranno nei test prima delle rispettive
implementazioni. Le prove automatiche a ogni invio saranno il compito 0.3.

## Verifica della proposta

Confrontata con prodotto, piano di lavoro, decisioni e requisiti dei dati del
pacchetto. I seguenti documenti ufficiali sono stati letti il 2026-11-16 tramite
i repository degli autori; i siti della documentazione rispondono con un blocco
di rete in questo ambiente. I rami di sviluppo sono fonti aggiornabili, non
riferimenti a versioni stabili già selezionate.

- [React: costruire un'app da zero](https://github.com/reactjs/react.dev/blob/main/src/content/learn/build-a-react-app-from-scratch.md)
- [Vite: guida iniziale](https://github.com/vitejs/vite/blob/main/docs/guide/index.md)
- [Expo: web app installabili e limiti dei service worker](https://github.com/expo/expo/blob/main/docs/pages/guides/progressive-web-apps.mdx)
- [Supabase: regole di accesso per riga](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/database/postgres/row-level-security.mdx)
- [Vitest: guida iniziale](https://github.com/vitest-dev/vitest/blob/main/docs/guide/index.md)

In questa fase non esistono codice applicativo o comandi di test, tipi e lint:
nessuno di questi controlli è dichiarato eseguito o superato.

## Revisione manuale in tre passi

1. Confrontare le due opzioni con l'obiettivo di validare prima la versione web.
2. Verificare che cartelle e confini rendano indipendente il motore di allenamento.
3. Consultare la scelta approvata in `DECISIONI.md` e i vincoli di completamento
   aggiornati nel piano di lavoro.
