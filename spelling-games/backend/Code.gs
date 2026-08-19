// Wallscourt Farm Academy — Spelling Games score backend
//
// Bound to a Google Sheet. Creates a "Scores" tab on first use with columns:
//   Timestamp | PupilId | PupilName | Game | RuleId | Score | Accuracy | BestStreak
//
// One row is appended per finished round. Reads never mutate the sheet, so
// GET requests are safe to call as often as the game likes.
//
// GET  ?action=leaderboard&game=spelling-pop&rule=tch-short-vowel&top=10
//        → { leaderboard: [ {pupilId, pupilName, score, accuracy, date}, ... ] }
//        Best single score per pupil, for this game (+ rule if given), highest first.
//        Omit `rule` for an all-time leaderboard across every week's rule.
//
// GET  ?action=history&pupilId=AM72&game=spelling-pop
//        → { history: [ {timestamp, score, accuracy, ruleId}, ... ] }
//        Every round that pupil has played, most recent first.
//
// GET  ?action=roster
//        → { roster: [ {id, name, pin, year}, ... ], currentWeek: {term, week} }
//        Read from the "Roster" and "Settings" tabs — see setupRosterSheet()
//        below for how those tabs get created. This is the pupil-setup tool:
//        a teacher types names into the Sheet, no code or GitHub involved.
//
// POST body (Content-Type: text/plain, JSON-encoded) — one finished round:
//        { pupilId, pupilName, game, ruleId, score, accuracy, bestStreak }
//        → { status: 'ok' }
//
// Note: like the other WFA staff-tools sync scripts, this trusts whatever the
// client sends — there's no server-side check that pupilId is a real pupil.
// Fine for an internal classroom tool; don't point anything sensitive at it.

const SHEET_NAME = 'Scores';
const HEADERS = ['Timestamp', 'PupilId', 'PupilName', 'Game', 'RuleId', 'Score', 'Accuracy', 'BestStreak'];
const ROSTER_SHEET_NAME = 'Roster';
const ROSTER_HEADERS = ['Name', 'Code', 'PIN', 'Year'];
const SETTINGS_SHEET_NAME = 'Settings';

function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    if (params.action === 'leaderboard') return json({ leaderboard: getLeaderboard(params) });
    if (params.action === 'history') return json({ history: getHistory(params) });
    if (params.action === 'roster') return json(getRosterAndSettings());
    return json({ error: 'unknown action — use ?action=leaderboard, ?action=history or ?action=roster' });
  } catch (err) {
    return json({ error: err.message });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (!body.pupilId || !body.game || typeof body.score !== 'number') {
      return json({ status: 'error', message: 'missing pupilId, game or score' });
    }
    appendScore(body);
    return json({ status: 'ok' });
  } catch (err) {
    return json({ status: 'error', message: err.message });
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function appendScore(body) {
  getSheet().appendRow([
    new Date().toISOString(),
    String(body.pupilId).slice(0, 40),
    String(body.pupilName || '').slice(0, 60),
    String(body.game || '').slice(0, 40),
    String(body.ruleId || '').slice(0, 60),
    Number(body.score) || 0,
    Number(body.accuracy) || 0,
    Number(body.bestStreak) || 0
  ]);
}

function readAllRows() {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const values = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  return values.map(r => ({
    timestamp: r[0], pupilId: r[1], pupilName: r[2], game: r[3],
    ruleId: r[4], score: r[5], accuracy: r[6], bestStreak: r[7]
  }));
}

function getLeaderboard(params) {
  const game = params.game || '';
  const rule = params.rule || '';
  const top = Math.min(parseInt(params.top, 10) || 10, 50);

  const rows = readAllRows().filter(r =>
    (!game || r.game === game) && (!rule || r.ruleId === rule)
  );

  // Keep each pupil's single best score for this game/rule.
  const bestByPupil = {};
  rows.forEach(r => {
    const cur = bestByPupil[r.pupilId];
    if (!cur || r.score > cur.score) bestByPupil[r.pupilId] = r;
  });

  return Object.values(bestByPupil)
    .sort((a, b) => b.score - a.score)
    .slice(0, top)
    .map(r => ({ pupilId: r.pupilId, pupilName: r.pupilName, score: r.score, accuracy: r.accuracy, date: r.timestamp }));
}

function getHistory(params) {
  const pupilId = params.pupilId;
  if (!pupilId) return [];
  const game = params.game || '';
  return readAllRows()
    .filter(r => r.pupilId === pupilId && (!game || r.game === game))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ════════════════════════════════════════════════════════════════
   Pupil setup — read from the Roster/Settings tabs, no code involved
   once setupRosterSheet() below has been run once.
   ════════════════════════════════════════════════════════════════ */

function getRosterAndSettings() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rosterSheet = ss.getSheetByName(ROSTER_SHEET_NAME);
  const settingsSheet = ss.getSheetByName(SETTINGS_SHEET_NAME);

  let roster = [];
  if (rosterSheet) {
    const lastRow = rosterSheet.getLastRow();
    if (lastRow >= 2) {
      const values = rosterSheet.getRange(2, 1, lastRow - 1, ROSTER_HEADERS.length).getValues();
      roster = values
        .filter(r => r[0] && r[1] && r[2] && r[3]) // Name, Code, PIN, Year all present
        .map(r => ({
          name: String(r[0]).trim(),
          id: String(r[1]).trim().toUpperCase(),
          pin: String(r[2]).trim(),
          year: String(r[3]).trim()
        }));
    }
  }

  let currentWeek = null;
  if (settingsSheet) {
    const term = settingsSheet.getRange('A2').getValue();
    const week = settingsSheet.getRange('B2').getValue();
    if (term && week) currentWeek = { term: String(term).trim(), week: String(week).trim() };
  }

  return { roster: roster, currentWeek: currentWeek };
}

/* Run this ONCE, from the Apps Script editor's Run button (pick
   setupRosterSheet from the function dropdown first) — or afterwards,
   reload the Sheet and use the new "Spelling Games" menu it adds
   instead. It builds the Roster and Settings tabs with headers, a Year
   dropdown, and formulas that auto-fill a Code and PIN as soon as a
   Name is typed — a teacher never has to invent either. Safe to run
   again later: it only fills in what's missing, never touches existing
   pupil rows or overwrites the current term/week. */
function setupRosterSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let roster = ss.getSheetByName(ROSTER_SHEET_NAME);
  if (!roster) roster = ss.insertSheet(ROSTER_SHEET_NAME);
  if (roster.getRange('A1').getValue() !== 'Name') {
    roster.getRange('A1:D1').setValues([ROSTER_HEADERS]);
    roster.getRange('A1:D1').setFontWeight('bold');
    roster.setFrozenRows(1);
  }

  // Code/PIN formulas are deterministic per row (not RANDBETWEEN), so a
  // teacher editing an unrelated cell elsewhere in the sheet never
  // reshuffles everyone else's PIN — a real risk with volatile formulas.
  const startRow = 2, numRows = 60;
  for (let i = 0; i < numRows; i++) {
    const row = startRow + i;
    const codeCell = roster.getRange(row, 2);
    const pinCell = roster.getRange(row, 3);
    if (!codeCell.getFormula() && !codeCell.getValue()) {
      codeCell.setFormula('=IF(A' + row + '="","",UPPER(LEFT(A' + row + '&"XX",2))&TEXT(MOD(ROW()*37,90)+10,"00"))');
    }
    if (!pinCell.getFormula() && !pinCell.getValue()) {
      pinCell.setFormula('=IF(A' + row + '="","",TEXT(1000+MOD(ROW()*8191,9000),"0000"))');
    }
  }
  const yearRange = roster.getRange(startRow, 4, numRows, 1);
  const yearRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Y2', 'Y3', 'Y4', 'Y5', 'Y6'], true)
    .setAllowInvalid(false)
    .build();
  yearRange.setDataValidation(yearRule);
  roster.autoResizeColumns(1, 4);

  let settings = ss.getSheetByName(SETTINGS_SHEET_NAME);
  if (!settings) settings = ss.insertSheet(SETTINGS_SHEET_NAME);
  if (settings.getRange('A1').getValue() !== 'Term') {
    settings.getRange('A1:B1').setValues([['Term', 'Week']]);
    settings.getRange('A1:B1').setFontWeight('bold');
    settings.getRange('A2:B2').setValues([['T1', 'W1']]);
  }
  settings.getRange('A2').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['T1', 'T2', 'T3', 'T4', 'T5', 'T6'], true).build()
  );
  settings.getRange('B2').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['W1', 'W2', 'W3', 'W4', 'W5', 'W6'], true).build()
  );
  settings.autoResizeColumns(1, 2);

  try {
    SpreadsheetApp.getUi().alert('Roster and Settings tabs are ready. Type pupil names into the Roster tab — their code and PIN fill in automatically.');
  } catch (e) {
    // getUi() only works when this Sheet is open in a browser tab, not when
    // run straight from the Apps Script editor with no Sheet open — that's
    // fine, the tabs are already built either way.
  }
}

/* Adds a "Spelling Games" menu to the Sheet itself, so after the first
   setup a teacher never needs to open the Apps Script editor again. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Spelling Games')
    .addItem('Set up Roster tab', 'setupRosterSheet')
    .addToUi();
}
