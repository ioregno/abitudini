# Come mettere in funzione l'app Abitudini

## 1. Collega il foglio (5 minuti, una volta sola)
1. Apri il foglio HABIT TRACKER > menu **Estensioni > Apps Script**.
2. Cancella quello che c'è e incolla tutto il file `apps-script/Codice.gs`.
3. Alla riga `const CHIAVE = 'cambiami';` metti una parola tua (es. `piano2026`). Salva.
4. In alto a destra **Esegui il deployment > Nuovo deployment** > icona ingranaggio > **App web**.
   - Esegui come: **Me**
   - Chi ha accesso: **Chiunque**
5. **Esegui il deployment**, autorizza col tuo account Google (se dice "app non verificata": Avanzate > Vai al progetto).
6. Copia l'**URL dell'app web** (finisce con `/exec`).

## 2. Metti l'app online
I file vanno in una repo GitHub pubblica (come `schede`), con GitHub Pages attivo:
Settings > Pages > Branch `main`, cartella `/ (root)`.

## 3. Sul telefono
1. Apri il link GitHub Pages in Safari > Condividi > **Aggiungi alla schermata Home**.
2. Apri l'app, in fondo **Collegamento al foglio**: incolla l'URL `/exec` e la chiave > **Collega**.

Se cambi lo script, fai **Gestisci deployment > Modifica > Nuova versione**, così l'URL resta lo stesso.
