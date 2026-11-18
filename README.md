# Training app

Repository di riferimento: https://github.com/theexperiencecard/trainingapp, ramo `main`.

Per riprendere il lavoro con una nuova IA: leggere [CONTEXTO.md](CONTEXTO.md) e
[AGENTS.md](AGENTS.md), poi solo i documenti indicati per il prossimo compito.

Anteprima interna React/Vite in italiano, tedesco e inglese. Permette di registrare due serie sintetiche, verificare gli effetti di una sostituzione e utilizzare timer di recupero e cronometro.

## Provarla in tre passi

1. Con Node 24.22.1 e npm 11 esegui `npm ci`, poi `npm run build` e `npm run preview`. Apri l'indirizzo locale mostrato da Vite.
2. Registra la prima serie di panca, scegli la chest press M1 per oggi e giovedì, poi registra la seconda. Il diario mostra 480 kg per la panca e 250 kg per la macchina. Ripristina la panca per giovedì e ricontrolla il diario.
3. Inserisci una durata nel timer e avvialo. Quando compare la conferma che la pagina è pronta offline, disattiva la rete, chiudi e riapri lo stesso indirizzo. Il recupero riparte dalla scadenza salvata. La simulazione delle serie ricomincia da zero.

La cache di produzione si prepara dopo la prima apertura online, su HTTPS o localhost. Per lavorare sul codice usa `npm run dev`. Il diario persistente e la prova su iPhone e Android sono descritti nel piano.

## Controlli

- `npm run check`: esegue test, controllo dei tipi e lint, fermandosi al primo errore.
- `npm run build`: controlla i tipi e genera la versione compilata in `dist/`.
- `npm run preview`: serve localmente la build già generata, per verificarla.
- `npm test`, `npm run typecheck`, `npm run lint`: controlli singoli.

Vitest copre l'interfaccia nelle tre lingue e il calcolo e ripristino dei timer. Le prove interattive della versione compilata sono registrate nel piano.

Le versioni sono fissate in `package.json` e `package-lock.json`. TypeScript
6.0.3 è la versione stabile compatibile con l'intervallo dichiarato dal lint
(`typescript-eslint`: TypeScript <6.1); la versione 7 non è forzata.

## Prossime tappe

La shell offline e il timer sono provabili. Restano aperti diario persistente, motore, account, sincronizzazione e collaudo sui dispositivi.
I vincoli approvati e lo stato di ogni compito sono nel
[piano di lavoro](docs/05-piano-di-lavoro.md).
Il compito 2.1 richiede prove su un iPhone e un Android reali; la prova con le
persone richiede installazione sulla Home, account e sincronizzazione pronti.

Il workflow dei controlli automatici e la procedura per verificarlo sono in
[Controlli automatici](docs/06-controlli-automatici.md). Le indicazioni su modelli,
prossime tappe e ricerca sono in [Prossimi passi](docs/07-prossimi-passi-e-ricerca.md).
