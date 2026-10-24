// Gym Log sync backend: Google Apps Script bound to a Google Sheet.
// Sheet tab "Sessions", header row: id | person | day | date | order | label | updated | json
// Set the secret: Project Settings > Script properties > add  KEY = <your shared key>
const SHEET = 'Sessions';
const HEAD = ['id','person','day','date','order','label','updated','json'];

function sheet_() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(SHEET) || ss.getSheets()[0]; // falls back to first tab (CSV import names it after the file)
  if (!sh) { sh = ss.insertSheet(SHEET); sh.appendRow(HEAD); }
  return sh;
}
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function authed_(k) { return k && k === PropertiesService.getScriptProperties().getProperty('KEY'); }

function doGet(e) {
  if (!authed_(e.parameter.key)) return out_({ ok: false, error: 'bad key' });
  const v = sheet_().getDataRange().getValues().slice(1);
  const sessions = v.filter(r => r[7]).map(r => { try { return JSON.parse(r[7]); } catch (x) { return null; } }).filter(Boolean);
  return out_({ ok: true, sessions });
}

function doPost(e) {
  let body; try { body = JSON.parse(e.postData.contents); } catch (x) { return out_({ ok: false, error: 'bad json' }); }
  if (!authed_(body.key)) return out_({ ok: false, error: 'bad key' });
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const sh = sheet_();
    const ids = sh.getRange(1, 1, sh.getLastRow(), 1).getValues().map(r => String(r[0]));
    let n = 0;
    (body.sessions || []).forEach(s => {
      if (!s || !s.id) return;
      const row = [s.id, s.person, s.day, s.date || '', s.order, s.label || '', s.updated || Date.now(), JSON.stringify(s)];
      const i = ids.indexOf(String(s.id));
      if (i > 0) sh.getRange(i + 1, 1, 1, row.length).setValues([row]);
      else { sh.appendRow(row); ids.push(String(s.id)); }
      n++;
    });
    return out_({ ok: true, upserted: n });
  } finally { lock.releaseLock(); }
}
