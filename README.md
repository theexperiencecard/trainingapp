# Training app

Repository di riferimento: https://github.com/theexperiencecard/trainingapp, ramo `main`.

Per riprendere il lavoro con una nuova IA: leggere [CONTEXTO.md](CONTEXTO.md) e
[AGENTS.md](AGENTS.md), poi solo i documenti indicati per il prossimo compito.

Anteprima interna in italiano, tedesco e inglese. Contiene un diario persistente di prova, grafici del volume per attrezzo, un questionario di preferenze con riepilogo, timer e una seduta guidata di esempio con sostituzione.

## Provarla in tre passi

1. Con Node 24.22.1 e npm 11 esegui `npm ci`, `npm run build` e `npm run preview`. Apri l'indirizzo locale mostrato da Vite e attendi la conferma di disponibilità offline.
2. Apri «Prova una seduta guidata», avvia la prova e registra la prima serie. Usa il timer se vuoi, scegli la chest press M1 per la seconda serie, registrala e apri il diario dal riepilogo. Alla prima prova i due attrezzi mostrano rispettivamente 480 e 250 kg.
3. Disattiva la rete e riapri lo stesso indirizzo nello stesso browser. Correggi, segna come saltata o ripristina una serie e ricontrolla il grafico. Le preferenze e il passo corrente della seduta di esempio ripartono da zero. Le serie confermate e il timer attivo si conservano.

La shell offline di produzione richiede una prima apertura online su HTTPS o localhost. Per lo sviluppo usa `npm run dev`. Gli eventuali dati della prima anteprima della PR #1 sono consultabili nello stesso browser e sulla stessa origine, in uno storico separato in sola lettura.

## Anteprima pubblicata su GitHub Pages

L’app compilata è disponibile su [GitHub Pages](https://theexperiencecard.github.io/trainingapp/).
Per aggiornarla, con **Settings → Pages → Source** impostato su **GitHub Actions**, avvia **Actions → Publish app to GitHub Pages → Run workflow** sul ramo `main`. Il workflow verifica il codice e pubblica la cartella `dist`. Salva il collegamento dalla pagina dell’app in Safari per usare la schermata Home.

## Anteprima sul telefono da GitHub

1. Apri il repository con Safari o Chrome sul telefono e accedi con l’account che ha accesso. In GitHub scegli **Code → Codespaces → Create codespace on main**. Se riapri un Codespace già sul ramo `main`, esegui `git pull --ff-only` prima della build.
2. Nell’editor del Codespace apri il terminale e avvia l’anteprima. `nvm install` legge la versione da `.nvmrc`.

   ```bash
   nvm install
   npm ci
   npm run build
   __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS="${CODESPACE_NAME}-4173.app.github.dev" npm run preview
   ```

3. Nella scheda **Ports** apri l’indirizzo HTTPS della porta **4173** con **Open in Browser**. Mantieni la visibilità **Private** e usa lo stesso account GitHub. Dalla pagina dell’app puoi usare il menu del browser per aggiungerla alla schermata Home. Tieni il Codespace attivo durante la prova e arrestalo quando hai finito.

[Guida GitHub alle porte di Codespaces](https://docs.github.com/en/codespaces/developing-in-a-codespace/forwarding-ports-in-your-codespace)

## Controlli

- `npm run check`: esegue test, controllo dei tipi e lint, fermandosi al primo errore.
- `npm run build`: controlla i tipi e genera la versione compilata in `dist/`.
- `npm run preview`: serve localmente la build già generata, per verificarla.
- `npm test`, `npm run typecheck`, `npm run lint`: controlli singoli.

Vitest copre interfaccia e traduzioni, timer, inserimento dei numeri e volumi per giorno e attrezzo. Le prove interattive della versione compilata sono registrate nel piano.

Per ripetere la prova del diario con Playwright e Chromium già disponibili nel cloud, esegui `npm run build` e `CHROMIUM_PATH=/usr/bin/chromium node scripts/journal-e2e.cjs`. Lo script avvia un server locale e usa un profilo isolato.

Le versioni sono fissate in `package.json` e `package-lock.json`. TypeScript
6.0.3 è la versione stabile compatibile con l'intervallo dichiarato dal lint
(`typescript-eslint`: TypeScript <6.1); la versione 7 non è forzata.

## Prossime tappe

Diario, shell offline e timer sono provabili. Restano aperti la generazione delle schede, il percorso guidato completo, account, sincronizzazione e collaudo sui dispositivi.
I vincoli approvati e lo stato di ogni compito sono nel
[piano di lavoro](docs/05-piano-di-lavoro.md).
Il compito 2.1 richiede prove su un iPhone e un Android reali; la prova con le
persone richiede installazione sulla Home, account e sincronizzazione pronti.

Il workflow dei controlli automatici e la procedura per verificarlo sono in
[Controlli automatici](docs/06-controlli-automatici.md). Le indicazioni su modelli,
prossime tappe e ricerca sono in [Prossimi passi](docs/07-prossimi-passi-e-ricerca.md).
