# Modelli e consumo: raccomandazione verificata

2026-11-17. Preferenza dell'utente: minimizzare il costo totale per risultato corretto,
considerando un abbonamento dichiarato di circa 23 €/mese e i limiti di utilizzo.
Non abbiamo accesso al piano effettivo, al consumo, ai crediti o ai reset dell'account.
Il prezzo dichiarato non basta a identificarli; nessun acquisto/cambio modello eseguito.

## Fonti consultate

- [Modelli](https://learn.chatgpt.com/docs/models), raggiunto dal sito developers.openai.com:
  raccomanda GPT-6.2 Astra per lavori impegnativi, GPT-6.2 Sol per coding e lavoro ordinario.
- [Prezzi e utilizzo](https://learn.chatgpt.com/docs/pricing), stessa provenienza:
  quote incluse, tariffe a crediti e limiti sono cose diverse.
- Pagina Help Center sul piano tentata: HTTP 403; nessun contenuto di quella pagina letto.

«6.2» è ambiguo: **GPT-6.2 Astra** e **GPT-6.2 Sol** sono due modelli distinti.
Le pagine consultate li indicano disponibili su Plus e altri piani supportati;
la disponibilità concreta va verificata nel selettore dell'utente. La raccomandazione
precedente di trattare GPT-6 Astra come scelta più capace fissa è superata.

## Numeri pubblicati, non misure del nostro account

| Modello | Crediti / milione token input | Input in cache | Output | Stima pubblicata messaggi locali Plus / 5 ore |
| --- | --- | --- | --- | --- |
| GPT-6 Astra | 250 | 25 | 1.250 | 5–45 |
| GPT-6.2 Astra | 200 | 10 | 1.000 | 6–50 |
| GPT-6.2 Sol | 50 | 2,5 | 250 | 17–180 |

Tariffe a velocità Standard. La pagina specifica che i prezzi a crediti **non
determinano da soli la quota inclusa**. Le stime di messaggi non sono limiti fissi;
task cloud possono consumare più dei messaggi locali, e possono applicarsi limiti
settimanali. Non convertirle in «hai ancora N messaggi» o in un prezzo per questa chat.
Contesto, ragionamento, strumenti, cache e durata del task cambiano il consumo.

A parità di token, cache e velocità, 6.2 Astra costa meno di 6 Astra nella tabella
a crediti (−20% per input non in cache e output). Sol costa un quarto di 6.2 Astra
nelle tre colonne. Questo non dimostra un uguale rapporto di quota dell'abbonamento.
Se Sol richiedesse dieci volte il lavoro per lo stesso risultato, potrebbe essere
meno conveniente; non abbiamo osservazioni che dimostrino «dieci tentativi contro uno».

## Strategia proposta per questa app

| Lavoro | Modello consigliato | Ragione e criterio di riesame |
| --- | --- | --- |
| Decisioni R2 con vincoli scientifici, revisione dei casi, architettura/sync complessa | GPT-6.2 Astra se disponibile | Usare ragionamento approfondito dove un errore cambia molte parti; non sostituisce il professionista sanitario |
| Implementazione con specifiche/casi approvati, componenti e correzioni delimitate | GPT-6.2 Sol | Modello ordinario attuale a minor tariffa; verificare risultato con gli stessi test/criteri |
| Bug trasversale, contraddizioni persistenti, fallimenti sostanziali ripetuti | Rivalutare contesto e passare ad Astra su scelta dell'utente | Non concatenare correzioni alla cieca; distinguere specifica incompleta da errore del modello |

Cominciare dallo sforzo predefinito del client, aumentarlo per necessità motivata;
non usare Max/Ultra sistematicamente. Non avviare due implementazioni identiche solo
per misurare il modello. Provare Sol su un blocco reale delimitato quando opportuno,
osservando quota prima/dopo (se l'utente la fornisce), errori sostanziali e revisioni.
Un messaggio di chiarimento o un test utile non equivale a un tentativo fallito.

L'obiettivo è il costo fino a **criteri soddisfatti**, inclusi correzioni, revisione,
contesto riletto e passaggio di consegne. Nessun risparmio percentuale sul progetto
è oggi misurato. Commit/push con output breve sono utili alla continuità; la loro
incidenza esatta non è misurata. Ridurre duplicazioni e letture integrali inutili
è una misura concreta, non una garanzia di consumo basso.

Prompt di ripresa riutilizzabile, senza esportare tutta la conversazione:

> Leggi AGENTS.md e CONTEXTO.md. Continua il prossimo blocco autorizzato indicato,
> usando solo i documenti pertinenti. Mantieni distinte proposte, regole approvate
> e lacune. Verifica il risultato, aggiorna il contesto compatto, fai commit/push
> e riporta il modello consigliato per il seguito. Non ripetere la ricerca già valida.
