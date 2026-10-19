# learning-games

Pupil-facing games site (served with a `CNAME`): one folder per game (`first-words-match`, `karate-quest`, `map-explorer`, `mastering-number`, `phonics-alien`, `spelling-games`, `times-tables`, `times-tables-bingo`, `sentence-builder`).

- `map-explorer/LINKS.md` is the contract the Enquiry Builder relies on. Don't rename or remove the pages it lists.
- Pupils use these on iPads and phones: keep them single-file friendly, touch-first and encouraging in tone.

## Working across devices (read first)

- **GitHub is the source of truth for this repo.** Work from the repository, not from a folder on one particular computer. Don't assume paths like `~/Library/CloudStorage` or `~/Desktop` exist.
- **Before editing:** run `git fetch`, `git log -5` and `git status`. Other Claude sessions may be editing the same repo at the same time.
- **Never commit** passwords, API keys, tokens, pupil names, UPNs or any pupil-identifying data. Remote URLs must not contain tokens.
- **Visible version number.** Every HTML tool shows a version in its footer or header: `DD.MM.YYx` (whole school) or `YN-DD.MM.YYx` (one year group). Bump it in the file on every push and state the new version when you report the push.
- **Reference data** (term dates, staff, pupils, curriculum plan) comes from the WFA database, never a Google Sheet or Apps Script.
- **Systems reference:** `docs/SYSTEM.md` in the private `wallscourtfarm/wfa-data` repo.
- **Files that aren't code** (decks, PDFs, school documents) live in OneDrive, not here.
