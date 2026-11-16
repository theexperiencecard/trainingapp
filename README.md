# Training app

Base React/Vite del compito 0.2. TypeScript rigoroso, Vitest ed ESLint.
La schermata iniziale usa testi separati in italiano, tedesco e inglese;
l'avvio è in italiano. Il nome del prodotto resta da scegliere.

## Avvio in tre passi

1. Nella cartella del progetto attiva Node 24.22.1 (`nvm use`, se usi nvm),
   con npm 11; esegui `npm ci`.
2. Esegui `npm run dev` e apri nel browser l'indirizzo stampato da Vite.
3. Verifica la schermata iniziale in italiano e restringi la finestra:
   il testo deve restare leggibile. Il tema segue quello del dispositivo.

Non servono account, chiavi o variabili d'ambiente per questo progetto iniziale.

## Controlli

- `npm run check`: esegue test, controllo dei tipi e lint, fermandosi al primo errore.
- `npm run build`: controlla i tipi e genera la versione compilata in `dist/`.
- `npm run preview`: serve localmente la build già generata, per verificarla.
- `npm test`, `npm run typecheck`, `npm run lint`: controlli singoli.

I tre test iniziali verificano il rendering React nelle tre lingue, in ambiente
Node. Non sono prove su browser o dispositivi reali. Nessun test di allenamento
è ancora implementato. `npm run check` fallisce anche se non trova test.

Le versioni sono fissate in `package.json` e `package-lock.json`. TypeScript
6.0.3 è la versione stabile compatibile con l'intervallo dichiarato dal lint
(`typescript-eslint`: TypeScript <6.1); la versione 7 non è forzata.

## Prossime tappe

Questo è il progetto vuoto: installazione sulla Home, funzionamento senza rete,
salvataggio, timer, account e sincronizzazione sono ancora da implementare.
I vincoli approvati e lo stato di ogni compito sono nel
[piano di lavoro](docs/05-piano-di-lavoro.md).
Il compito 2.1 richiede prove su un iPhone e un Android reali; la prova con le
persone richiede installazione sulla Home, account e sincronizzazione pronti.

Il workflow dei controlli automatici e la procedura per verificarlo sono in
[Controlli automatici](docs/06-controlli-automatici.md). Le indicazioni su modelli,
prossime tappe e ricerca sono in [Prossimi passi](docs/07-prossimi-passi-e-ricerca.md).
