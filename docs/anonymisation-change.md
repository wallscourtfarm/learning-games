# Anonymised pupil names and hashed PINs

Status: front end prepared on branch `claude/sharp-pascal-0xzjjb`, not merged, not live.
Backend work for `wfa-data` is described here and has not been started or reviewed.

## What changes for pupils and staff

- Each pupil gets a random two-word game name (for example "Grape Satsuma"). Games and leaderboards show only that name.
- The real name stays in Bromcom and in a staff-only field. It never reaches a pupil page or the public API.
- PINs are stored hashed. Nobody, including staff, can read an old PIN back. Staff issue new PINs and print them once.
- The PIN check moves from the web address to a POST body, so PINs stop appearing in logs.
- Pupil codes and QR codes do not change.

## Front end (this branch)

| File | Change |
|---|---|
| `spelling-games/roster.js` | New flag `SP_PIN_VIA_POST`, default `false`. |
| `spelling-games/spelling-pool.js` | `spVerifyPin` sends a POST when the flag is true. New `spIssuePins` helper. |
| `spelling-games/cards.html` | Cards and labels show the game name, with "For <real name>" in small type. If the roster has no PINs, an "Issue new PINs" button appears. Issued PINs are held in memory only. |
| `spelling-games/admin/index.html` | Roster tab shows game name and real name. PIN column reads "Hashed" when no PIN is returned. |

With the flag off and the current API, behaviour is unchanged, so this branch is safe to merge early. The staff pages already cope with the old and new reply shapes.

## Backend contract needed in wfa-data

1. **Display names.** Add `display_name` (unique) to the pupil table. Generate once per pupil from two reviewed word lists (for example 40 foods by 40 objects gives 1,600 combinations for about 300 pupils). Remove any word that could read as a real name, an insult or a word a child could be teased with. Never regenerate on roster sync. Offer a staff action to regenerate at year change.
2. **Public roster** (`?action=roster`): return `id`, `name` (the display name) and `year`. No real name.
3. **Staff roster** (`?action=adminRoster`): return `id`, `name` (display name), `realName`, `year`, `active`, and `hasPin`. Do not return `pin`.
4. **PIN storage.** Store a salted slow hash (argon2id or scrypt) combined with a server-side secret (a pepper held in the host's environment, not in the database). A 4-digit PIN has only 10,000 possibilities, so a hash alone will not stop someone who steals the database. The lockout (8 wrong tries, 6 hours), IP limiting and the pepper do the real work. Keep them.
5. **`verifyPin`** accepts a POST body `{action, code, pin}` and returns the same reply as now. Keep the GET form working during the changeover, then remove it and delete the old access logs that hold PINs.
6. **`issuePins`** (POST, staff): body `{action, ids}` with `?token=` on the URL. For each id (or every active pupil if `ids` is empty) make a random PIN, store its hash and return `{issued: [{id, pin}]}` once. Log who issued PINs and when, never the PINs.
7. **Scores, history, leaderboard and stats.** The server fills the name from `display_name` and ignores `pupilName` sent by the browser. Backfill the existing score rows so the name column holds the display name, otherwise real names stay in the scores table.
8. **`syncRoster`.** New pupils get a display name and no PIN until issued. Name changes in Bromcom update the real name only. Leavers are deactivated.
9. **Karate Quest and any other endpoint** that stores or returns a name: check and apply the same rule.
10. **Old Apps Script backend and Sheet.** They hold real names and readable PINs. This change does not protect anything until they are shut down and the Sheet is deleted.

## Rollout

1. Deploy the backend changes with the GET `verifyPin` still working. Test with a staff test pupil.
2. Tell teachers the date and what to expect (see the teacher note).
3. On the day: merge this branch with `SP_PIN_VIA_POST = true`. Open the Cards page, press "Issue new PINs", print cards and labels before closing the page.
4. Hand out the new cards. Old PINs stop working at step 3.
5. After a settling period, remove the GET `verifyPin` route and purge old logs.

## Rollback

Set `SP_PIN_VIA_POST` back to `false` and keep the GET route live. Display names can stay. A lost PIN is replaced by issuing a new one, never by reading the old one.
