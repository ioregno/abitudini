// Collega l'app Abitudini al foglio HABIT TRACKER.
// Incolla questo file in Estensioni > Apps Script, cambia CHIAVE, poi
// Esegui il deployment > Nuovo deployment > App web (Esegui come: Me, Chi ha accesso: Chiunque).

const CHIAVE = 'cambiami';            // la stessa parola va messa nell'app
const MESI = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
const PRIMA_RIGA = 7, ULTIMA_RIGA = 21; // righe delle abitudini nei fogli dei mesi
const ALBO = 'Albo dOro';

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.k !== CHIAVE) return json({ok: false, errore: 'chiave'});
  try {
    if (p.a === 'set') return json(scrivi(p));
    return json(leggiAnno());
  } catch (err) {
    return json({ok: false, errore: String(err)});
  }
}

// tutto l'anno in una volta: abitudini, target e valori di ogni giorno + Albo d'Oro
function leggiAnno() {
  const ss = SpreadsheetApp.getActive();
  const anno = Number(ss.getSheetByName(MESI[0]).getRange('C2').getValue()) || new Date().getFullYear();
  const mesi = MESI.map(nome => {
    const sh = ss.getSheetByName(nome);
    if (!sh) return null;
    // B:C = nome e target, E:AI = giorni 1-31
    const righe = sh.getRange(PRIMA_RIGA, 2, ULTIMA_RIGA - PRIMA_RIGA + 1, 34).getValues();
    return righe.map((r, i) => ({
      riga: PRIMA_RIGA + i,
      nome: String(r[0] || '').trim(),
      target: String(r[1] || '').trim(),
      v: r.slice(3).map(x => x === '' ? null : x)
    })).filter(h => h.nome);
  });
  let albo = [];
  const sa = ss.getSheetByName(ALBO);
  if (sa) albo = sa.getRange('B5:G' + Math.max(5, sa.getLastRow())).getDisplayValues();
  return {ok: true, anno, mesi, albo, ora: new Date().toISOString()};
}

// scrive un valore nella cella del giorno: m = mese 1-12, d = giorno, r = riga, v = valore
function scrivi(p) {
  const m = Number(p.m), d = Number(p.d), r = Number(p.r);
  if (!(m >= 1 && m <= 12) || !(d >= 1 && d <= 31) || !(r >= PRIMA_RIGA && r <= ULTIMA_RIGA)) return {ok: false, errore: 'cella'};
  const lock = LockService.getDocumentLock();
  lock.waitLock(10000);
  try {
    const cella = SpreadsheetApp.getActive().getSheetByName(MESI[m - 1]).getRange(r, 4 + d);
    const v = p.v;
    if (v === 'true' || v === 'false') cella.setValue(v === 'true');
    else if (v === '' || v === undefined) cella.clearContent();
    else {
      const n = Number(String(v).replace(',', '.'));
      if (isNaN(n)) return {ok: false, errore: 'valore'};
      cella.setValue(n);
    }
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }
  return {ok: true};
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
