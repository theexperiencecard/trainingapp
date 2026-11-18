# Controlli automatici — compito 0.3

Il workflow `.github/workflows/checks.yml` esegue installazione dal lockfile,
test, tipi, lint e build su push e pull request. È anche avviabile manualmente
dalla scheda Actions quando il workflow è presente nel ramo predefinito.
Usa la versione Node di `.nvmrc`, gli stessi comandi locali e azioni ufficiali
fissate a commit verificati dei tag v7. Non richiede segreti dell'app.

Un errore interrompe il job e lo rende rosso. Non sono presenti opzioni per
ignorare errori o test mancanti. Il controllo segnala gli errori; rendere il
controllo obbligatorio per un merge è una configurazione separata del repository.

## Verifica locale

Eseguire dalla cartella principale:

```sh
npm ci --no-fund
npm run check
npm run build
```

La prova negativa deve dimostrare che un'aspettativa sbagliata in un test React
restituisce un codice diverso da zero e impedisce di proseguire alla build.
Usare un file di prova temporaneo e ripristinare i test prima di creare un commit.
Gli esiti della sessione sono nel piano di lavoro.

## Verifica su GitHub in tre passi

1. Quando le modifiche saranno inviate su un ramo GitHub, aprire la relativa
   esecuzione di **Checks** e verificare che tutti i passaggi siano verdi.
2. Su un ramo di prova, modificare un'aspettativa di `src/app/App.test.tsx` in
   modo che attenda un titolo sbagliato; inviare la modifica e verificare che
   il passaggio dei test sia rosso e quello della build non venga eseguito.
3. Correggere l'aspettativa sul ramo di prova, inviare la correzione e verificare
   che il workflow torni verde. Non unire il test rotto nel ramo principale.

Il 18 novembre 2026 il workflow è risultato verde su main, rosso sul test volutamente errato del ramo isolato `audit/ci-03-20261118`, poi verde dopo il ripristino. Nella prova negativa la build è stata saltata. Compito 0.3 completato. [Baseline](https://github.com/theexperiencecard/trainingapp/actions/runs/44246050568) · [Test negativo](https://github.com/theexperiencecard/trainingapp/actions/runs/44247397511) · [Ripristino](https://github.com/theexperiencecard/trainingapp/actions/runs/44247556339)
