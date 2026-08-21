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
//        Best single score per learner, for this game (+ rule if given), highest first.
//        Omit `rule` for an all-time leaderboard across every week's rule.
//
// GET  ?action=history&pupilId=AM72&game=spelling-pop
//        → { history: [ {timestamp, score, accuracy, ruleId}, ... ] }
//        Every round that learner has played, most recent first.
//
// GET  ?action=roster
//        → { roster: [ {id, name, pin, year}, ... ], currentWeek: {term, week} }
//        Read from the "Roster" and "Settings" tabs — see setupRosterSheet()
//        below for how those tabs get created. This is the learner-setup tool:
//        a teacher types names into the Sheet, no code or GitHub involved.
//
// Weekly "most active learners" email digest — see setupWeeklyDigestTrigger()
// below. Run it once from the Apps Script editor (or the "Spelling Games"
// Sheet menu) to schedule a weekly email celebrating the learners who've
// played the most rounds. Edit DIGEST_RECIPIENT_EMAILS first.
//
// POST body (Content-Type: text/plain, JSON-encoded) — one finished round:
//        { pupilId, pupilName, game, ruleId, score, accuracy, bestStreak }
//        → { status: 'ok' }
//
// Note: like the other WFA staff-tools sync scripts, this trusts whatever the
// client sends — there's no server-side check that pupilId is a real learner.
// Fine for an internal classroom tool; don't point anything sensitive at it.

const SHEET_NAME = 'Scores';
const HEADERS = ['Timestamp', 'PupilId', 'PupilName', 'Game', 'RuleId', 'Score', 'Accuracy', 'BestStreak'];
const ROSTER_SHEET_NAME = 'Roster';
// First Name / Last Name / Year lead, so a teacher can paste a class list's
// name + year columns straight in. Code / PIN trail and fill themselves in.
const ROSTER_HEADERS = ['First Name', 'Last Name', 'Year', 'Code', 'PIN'];
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

  // Keep each learner's single best score for this game/rule.
  const bestByLearner = {};
  rows.forEach(r => {
    const cur = bestByLearner[r.pupilId];
    if (!cur || r.score > cur.score) bestByLearner[r.pupilId] = r;
  });

  return Object.values(bestByLearner)
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
   Learner setup — read from the Roster/Settings tabs, no code involved
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
        .filter(r => r[0] && r[2] && r[3] && r[4]) // First Name, Year, Code, PIN — Last Name optional
        .map(r => ({
          name: [String(r[0]).trim(), String(r[1]).trim()].filter(Boolean).join(' '),
          year: String(r[2]).trim(),
          id: String(r[3]).trim().toUpperCase(),
          pin: String(r[4]).trim()
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
   First Name is typed — a teacher never has to invent either. First
   Name / Last Name / Year lead (columns A-C) so a class list's name +
   year columns can be pasted straight in. Safe to run again later: it
   only fills in what's missing, never touches existing learner rows or
   overwrites the current term/week. */
function setupRosterSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let roster = ss.getSheetByName(ROSTER_SHEET_NAME);
  if (!roster) roster = ss.insertSheet(ROSTER_SHEET_NAME);
  if (roster.getRange('A1').getValue() !== 'First Name') {
    roster.getRange('A1:E1').setValues([ROSTER_HEADERS]);
    roster.getRange('A1:E1').setFontWeight('bold');
    roster.setFrozenRows(1);
  }

  // Code/PIN formulas are deterministic per row (not RANDBETWEEN), so a
  // teacher editing an unrelated cell elsewhere in the sheet never
  // reshuffles everyone else's PIN — a real risk with volatile formulas.
  const startRow = 2, numRows = 60;
  for (let i = 0; i < numRows; i++) {
    const row = startRow + i;
    const codeCell = roster.getRange(row, 4);
    const pinCell = roster.getRange(row, 5);
    if (!codeCell.getFormula() && !codeCell.getValue()) {
      codeCell.setFormula('=IF(A' + row + '="","",UPPER(LEFT(A' + row + '&"XX",2))&TEXT(MOD(ROW()*37,90)+10,"00"))');
    }
    if (!pinCell.getFormula() && !pinCell.getValue()) {
      pinCell.setFormula('=IF(A' + row + '="","",TEXT(1000+MOD(ROW()*8191,9000),"0000"))');
    }
  }
  const yearRange = roster.getRange(startRow, 3, numRows, 1);
  const yearRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Y2', 'Y3', 'Y4', 'Y5', 'Y6'], true)
    .setAllowInvalid(false)
    .build();
  yearRange.setDataValidation(yearRule);
  roster.autoResizeColumns(1, 5);

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
    SpreadsheetApp.getUi().alert('Roster and Settings tabs are ready. Paste or type First Name / Last Name / Year into the Roster tab — Code and PIN fill in automatically.');
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
    .addSeparator()
    .addItem('Send weekly digest now', 'sendWeeklyDigest')
    .addItem('Schedule weekly digest…', 'setupWeeklyDigestTrigger')
    .addToUi();
}

/* ════════════════════════════════════════════════════════════════
   Weekly "most active learners" digest — celebrates whoever played the
   most rounds last week, emailed to staff every Monday morning. Reads
   straight off the Scores tab (no new sheet needed) and cross-
   references Roster for each learner's year group.
   ════════════════════════════════════════════════════════════════ */

// Who receives the digest. To update this list: open the bound
// Google Sheet → Extensions → Apps Script, edit the emails below,
// then click Save (the disk icon, or Ctrl/Cmd+S). No redeploy needed —
// the change applies to the very next send, whether that's the next
// scheduled Monday run or a manual "Send weekly digest now".
const DIGEST_RECIPIENT_EMAILS = [
  'innes.mclean@clf.uk',
];

const DIGEST_TOP_N = 10;

// Sends as this alias instead of your personal Gmail address. Already
// created, verified, and added under "Send mail as" in the Gmail
// account that owns this script (Gmail → Settings → Accounts and
// Import → Send mail as). If it's ever removed or unverified,
// GmailApp silently falls back to your own address (see the try/catch
// below) rather than failing the whole digest.
const DIGEST_SENDER_ALIAS = 'wallscourtspelling@gmail.com';

// The teacher backdoor code (see spFindLearnerOrTeacher in spelling-pool.js)
// always starts with this prefix — never counts it as a learner here.
const TEACHER_CODE_PREFIX = 'TEACH';

function computeWeeklyActivity(sinceDate) {
  const roster = getRosterAndSettings().roster;
  const yearById = {};
  roster.forEach(function (p) { yearById[p.id] = p.year; });

  const byLearner = {};
  readAllRows().forEach(function (r) {
    const id = String(r.pupilId || '').toUpperCase();
    if (!id || id.indexOf(TEACHER_CODE_PREFIX) === 0) return;
    const ts = new Date(r.timestamp);
    if (isNaN(ts) || ts < sinceDate) return;

    if (!byLearner[id]) {
      byLearner[id] = {
        id: id,
        name: r.pupilName || id,
        year: yearById[id] || '',
        roundsPlayed: 0,
        totalScore: 0,
        games: {}
      };
    }
    const entry = byLearner[id];
    entry.roundsPlayed += 1;
    entry.totalScore += Number(r.score) || 0;
    if (r.game) entry.games[r.game] = true;
    if (yearById[id]) entry.year = yearById[id]; // roster year wins over a stale one on the row
  });

  return Object.keys(byLearner).map(function (id) {
    const e = byLearner[id];
    return {
      id: e.id,
      name: e.name,
      year: e.year,
      roundsPlayed: e.roundsPlayed,
      totalScore: e.totalScore,
      gamesPlayed: Object.keys(e.games).length
    };
  }).sort(function (a, b) {
    return b.roundsPlayed - a.roundsPlayed || b.totalScore - a.totalScore;
  });
}

function buildDigestHtml(stats, sinceDate, now) {
  if (stats.length === 0) {
    return '<p style="color:#64748b;font-size:13px;">No games were played last week.</p>';
  }

  const tz = Session.getScriptTimeZone();
  const rangeStr = Utilities.formatDate(sinceDate, tz, 'd MMM') + ' – ' + Utilities.formatDate(now, tz, 'd MMM yyyy');

  const top = stats.slice(0, DIGEST_TOP_N);
  const rows = top.map(function (p, i) {
    return '<tr>' +
      '<td style="padding:6px 10px;font-size:13px;color:#94a3b8;">' + (i + 1) + '</td>' +
      '<td style="padding:6px 10px;font-size:13px;color:#1e293b;font-weight:bold;">' + p.name + '</td>' +
      '<td style="padding:6px 10px;font-size:12px;color:#64748b;">' + (p.year || '') + '</td>' +
      '<td style="padding:6px 10px;font-size:13px;color:#1798d3;font-weight:bold;text-align:center;">' + p.roundsPlayed + '</td>' +
      '<td style="padding:6px 10px;font-size:12px;color:#64748b;text-align:center;">' + p.gamesPlayed + '</td>' +
      '</tr>';
  }).join('');

  return '<p style="font-size:13px;color:#334155;margin:0 0 12px;">Most rounds played, <strong>' + rangeStr + '</strong>:</p>' +
    '<table style="width:100%;border-collapse:collapse;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;">' +
    '<thead><tr style="background:#eef2f7;">' +
    '<th></th>' +
    '<th style="text-align:left;padding:6px 10px;font-size:11px;color:#64748b;text-transform:uppercase;">Learner</th>' +
    '<th style="text-align:left;padding:6px 10px;font-size:11px;color:#64748b;text-transform:uppercase;">Year</th>' +
    '<th style="padding:6px 10px;font-size:11px;color:#64748b;text-transform:uppercase;">Rounds</th>' +
    '<th style="padding:6px 10px;font-size:11px;color:#64748b;text-transform:uppercase;">Games</th>' +
    '</tr></thead><tbody>' + rows + '</tbody></table>';
}

function sendWeeklyDigest() {
  const now = new Date();
  const sinceDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const stats = computeWeeklyActivity(sinceDate);

  if (stats.length === 0) {
    console.log('sendWeeklyDigest: no activity last week, skipping send.');
    return;
  }

  const tz = Session.getScriptTimeZone();
  const dateStr = Utilities.formatDate(now, tz, 'EEEE d MMMM yyyy');
  const subject = 'Spelling Games — most active learners last week (' + Utilities.formatDate(now, tz, 'd MMM') + ')';
  const summaryHtml = buildDigestHtml(stats, sinceDate, now);

  const htmlBody =
    '<div style="font-family:Arial,sans-serif;max-width:600px;color:#222;">' +
    '<div style="background:#1798d3;height:8px;border-radius:6px 6px 0 0;"></div>' +
    '<div style="border:1px solid #ddd;border-top:none;padding:20px 22px;border-radius:0 0 6px 6px;">' +
    '<h1 style="font-size:16px;margin:0 0 2px;color:#1798d3;">🏆 Spelling Games — Most Active Last Week</h1>' +
    '<p style="font-size:13px;color:#64748b;margin:0 0 18px;">Generated ' + dateStr + '</p>' +
    summaryHtml +
    '<p style="margin-top:16px;font-size:11px;color:#999;">' +
    'Celebrate these learners in class, and encourage others to catch up! This is an automated ' +
    'weekly digest from the Spelling Games score tracker.' +
    '</p></div></div>';

  const textBody = 'Most active learners last week: ' +
    stats.slice(0, DIGEST_TOP_N).map(function (p) { return p.name + ' (' + p.roundsPlayed + ')'; }).join(', ');

  try {
    // Preferred: send as the shared alias, so it doesn't look like it's
    // coming from a personal inbox. Requires DIGEST_SENDER_ALIAS to be a
    // verified "Send mail as" address on this script's Google account.
    GmailApp.sendEmail(
      DIGEST_RECIPIENT_EMAILS.join(','),
      subject,
      textBody,
      { htmlBody: htmlBody, name: 'Wallscourt Farm Academy — Spelling Games', from: DIGEST_SENDER_ALIAS }
    );
  } catch (err) {
    // Alias not verified yet (or was removed) — fall back to sending as
    // whichever account owns this script, so the digest still goes out.
    console.log('sendWeeklyDigest: could not send as ' + DIGEST_SENDER_ALIAS + ' (' + err.message + '), falling back to the default sender.');
    GmailApp.sendEmail(
      DIGEST_RECIPIENT_EMAILS.join(','),
      subject,
      textBody,
      { htmlBody: htmlBody, name: 'Wallscourt Farm Academy — Spelling Games' }
    );
  }

  console.log('sendWeeklyDigest: sent to ' + DIGEST_RECIPIENT_EMAILS.join(','));
}

/* Run this ONCE from the Apps Script editor (pick setupWeeklyDigestTrigger
   from the function dropdown) or from the "Spelling Games" Sheet menu, to
   schedule the digest automatically. Safe to run again later — it clears
   any existing weekly-digest trigger first, so you won't end up with
   duplicates. Change the day/time below and re-run to reschedule. */
function setupWeeklyDigestTrigger() {
  ScriptApp.getProjectTriggers()
    .filter(function (t) { return t.getHandlerFunction() === 'sendWeeklyDigest'; })
    .forEach(function (t) { ScriptApp.deleteTrigger(t); });

  ScriptApp.newTrigger('sendWeeklyDigest')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(8)
    .create();

  try {
    SpreadsheetApp.getUi().alert('Weekly digest scheduled for every Monday morning.');
  } catch (e) {
    // getUi() only works when run from a Sheet open in the browser, not
    // straight from the Apps Script editor — the trigger is still created.
  }
}
