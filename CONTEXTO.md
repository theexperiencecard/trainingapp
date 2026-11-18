# Ripresa rapida — aggiornato 2026-11-18 (sera)

Leggi questo file e AGENTS.md, poi soltanto i documenti del compito corrente.
Mantieni questo riepilogo entro circa 60 righe; sostituisci lo stato superato.

## Direzione approvata
- Prima qualità scientifica per obiettivo/profilo; poi personalizzazione e sostituzioni.
- Ricerca estesa oltre forza/ipertrofia: generale, aerobico, mobilità, equilibrio e resistenza.
- Forza e ipertrofia richiedono scelte motivate. Valutare disponibilità 2–7 giorni,
  esperienza, capacità, recupero e vincoli; perimetro del documento 20 confermato.
- Il questionario è un punto di partenza da tarare; nessuna promessa «90% perfetto».
- Sostituzione manuale nella prima versione; preservare storico e serie svolte.
- Grafici per esercizio/variante; nessuna equivalenza automatica tra kg di attrezzi diversi.
- Sicurezza e integrità dei dati sono requisiti trasversali. Coach a pagamento dopo validazione.

## Stato verificato
- 0.1/0.2 completati: React/Vite, TypeScript rigoroso, Vitest, ESLint, un progetto npm.
- Node 24.22.1 (`.nvmrc`), npm 11; `npm ci`, `npm run check`, `npm run build`. Con Node 22 `npm ci` si rifiuta (engine-strict).
- Anteprima F04 interattiva IT/DE/EN, shell PWA e timer persistente.
- Diario IndexedDB (doc 30) approvato e realizzato il 18/11 con Claude Code: il tentativo Codex non era stato pubblicato. 28 test; `scripts/journal-e2e.cjs` 18/18 in Chromium sulla build. Mancano telefoni reali e `storage.persist()`.
- Lavoro Claude Code sul ramo `claude/app-development-continuation-dkrl22` (PR bozza verso `main`).
- 0.3: workflow scritto e prova negativa locale riuscita; esecuzione GitHub ancora da fare.
- Repository condiviso: github.com/theexperiencecard/trainingapp, ramo `main`.
- Push autorizzato dall’utente; per riprendere verificare HEAD remoto e stato locale.
- Prova in Chromium a larghezza mobile eseguita; prove Home su iPhone e Android reali ancora aperte.
- R0 completato: audit documentale, protocollo e requisiti. NON revisione scientifica conclusa.

## Prossimo: completare R2 — consigliato Codex con GPT-6.2 Astra, senza cambio automatico
- Rapporto esterno ricevuto e archiviato in `docs/ricerca/rapporto-esterno-2026-11-17.txt`.
- R1 chiusa come dossier mirato dopo assenso contestuale «Comunque continua»; non validazione clinica.
- Casi F01–F05 pronti nei documenti 26–28. Consegna al revisore nel 29; esiti e approvazioni ancora aperti. Stima pilot nel 05.
- Q7: dossier `docs/18-screening-dolore-revisione.md`, pronto per revisione, non validato clinicamente.
- Registro: 29 articoli (12 testi/sezioni, 16 abstract, 1 metadati) + 7 documenti istituzionali valutati.
- S12 ACSM 2026 valutata; S13 Held solo abstract; S14 Russo solo metadati (editore 403).
- Bozze R2: dosi/questionario e casi candidati; nessun numero approvato o motore implementato.
- Q1–Q15 rimappate alle definizioni ufficiali 08/10; l'addendum esterno aveva associazioni ipotetiche.
- Q6/Q8: dossier 19 con precedenze, sostituzioni e casi candidati; nessun algoritmo approvato.
- Perimetro F01–F05 adulti autonomi e gestione L01–L10 confermati; specialismi rinviati, non età/BMI.
- Completare revisione esercizi/istruzioni, revisione familiarizzazione aerobica proposta nel 21, taratura/incrementi/rientro/scarico.
- Poi revisione/approvazione R2 prima del motore; R3 ricerca utenti può procedere in parallelo.
- Modelli/consumo: 24; preferire risultato verificato per quota usata, senza inventare limiti account.

## Vincoli da conservare
- Prima della prova: installazione sulla Home per ogni partecipante; account e sync pronti.
- 2.1 si chiude solo con prove positive su iPhone E Android reali, app installata.
- Timer a conto alla rovescia dall'orario di fine persistito, mai dal conteggio dei tick.
- Regole numeriche del prototipo non modificate. Cambi futuri: fonti, approvazione e test aggiornati.
- Nessuna nuova libreria, migrazione, account, segreto, pagamento o deploy implicito.
- Fine di ogni risposta: modello esatto per il prossimo compito; nessun cambio automatico.
- Ogni compito: breve consiglio Codex/altro strumento; se esterno, prompt mirato pronto.
- Prosegui fino ai vincoli reali del piano. Autorizzati subagenti sullo stesso modello per attività indipendenti; integra e verifica prima della consegna.
- Commit e push a fine blocco coerente, con questo contesto aggiornato e remoto verificato.

## Dove approfondire
- `docs/05-piano-di-lavoro.md`: stato e criteri; `DECISIONI.md`: storia delle scelte (righe recenti prevalgono).
- `docs/01-prodotto.md`: prodotto; `docs/00-architettura.md`: architettura approvata.
- `docs/06-controlli-automatici.md`: verifica CI; `docs/07-prossimi-passi-e-ricerca.md`: interviste.
- Pacchetto originale: allegato `pacchetto-codex.zip`, non versionato; contiene riferimenti personali.
  Audit autosufficiente in 08. Cataloghi, prototipo e specifiche storiche non sono ancora nel checkout.
  Prima di importarli, controllare e rimuovere dati personali; se l'allegato manca, richiederlo.
- Ambiente pubblicato dall’utente; nuovo runtime verificato. Nessuna ripubblicazione dell’agente.
- Controlla sempre `git status` e `git log`: nessuna esecuzione o pubblicazione è implicita nei documenti.
