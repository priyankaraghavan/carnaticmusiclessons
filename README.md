# Niranjana's Carnatic Music Lessons

A simple static website to track Carnatic music lessons month by month, so her parents can follow along.

## Adding a new lesson

Open [`lessons.json`](lessons.json) and add a new entry to the array:

```json
{
  "date": "2026-11-17",
  "topics": "Kriti: Vatapi Ganapatim — charanam",
  "notes": "Practice charanam with sarvalaghu. Record and send a voice note before next class."
}
```

- `date` — format `YYYY-MM-DD`
- `topics` — what was taught in that class (varnam/kriti/tala/etc.)
- `notes` — optional homework or notes for the week; leave as `""` if none

Entries are automatically grouped by month and sorted newest-first on the page — no other file needs to change.

Commit and push the change, and the live site updates automatically within a minute or two.

## Publishing with GitHub Pages

1. Push this repo to GitHub (already set up to push to `origin`).
2. On GitHub: **Settings → Pages**.
3. Under "Build and deployment", set **Source** to `Deploy from a branch`.
4. Set **Branch** to `main` and folder to `/ (root)`, then **Save**.
5. After a minute, the site will be live at:
   `https://priyankaraghavan.github.io/carnaticmusiclessons/`

Share that link with the parents — it's read-only and updates whenever you push new lessons.
