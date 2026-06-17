# Resource Directory

**New here?** Double-click `index.html` to see it work, then open `setup.md` when you're ready to use your own content.

A searchable, filterable online **resource directory / catalog**. It presents a
curated set of tools, guides, courses, templates, and communities as cards that
visitors can full-text search, filter by category and tags, and sort. Entries are
pulled **live from a Google Sheet** through a Google Apps Script Web App that
returns JSON, and the site also works **fully offline** using a bundled demo file.

It is a single self-contained `index.html` page (vanilla JavaScript, no build step,
no framework), so you can host it anywhere static.

---

## What's in this folder

| File | Purpose |
|------|---------|
| `index.html` | The directory app: search, filters, sorting, and the results grid. |
| `code.gs` | Google Apps Script Web App that reads the Sheet and serves JSON. |
| `sample-data.json` | Demo data used as the offline fallback (and a shape reference). |
| `readme.md` | This file. |
| `setup.md` | Step-by-step setup for the Sheet + Apps Script deployment. |

---

## Data flow

```
Google Sheet ("Resources" tab)
        │
        ▼
Google Apps Script Web App (code.gs, doGet → getResources)
        │   returns JSON
        ▼
index.html  (fetch → parse → render cards)
        │
        ▼
Visitor searches / filters / sorts in the browser
```

If `WEB_APP_URL` in `index.html` is left empty, the page instead fetches the
bundled `./sample-data.json`, so the directory works with zero setup.

---

## Required Sheet columns

The Apps Script reads a single tab named exactly **`Resources`**. Put these
headers in the first row (order does not matter):

| Column | Meaning | Example |
|--------|---------|---------|
| `Title` | Resource name (also the card link text) | `Markdown Cheat Sheet` |
| `URL` | Link opened in a new tab | `https://example.org/...` |
| `Category` | One category per resource | `Guides` |
| `Tags` | Comma-separated tags | `writing, reference, free` |
| `Description` | Short blurb shown on the card | `A one-page reference...` |
| `Level` | Optional difficulty/level | `Beginner` |
| `Rating` | Optional number | `4.6` |
| `Featured` | `Yes` / `No` → gold star | `Yes` |
| `Added` | Date added | `2026-05-28` |
| `Include` | `Yes` / `No` (blank = included) | `Yes` |

The Web App splits `Tags` on commas, parses `Featured` to a boolean, drops any
row whose `Include` is set to something other than Yes/blank, and de-duplicates
the categories and tags into sorted lists for the filter UI.

### JSON shape returned

```json
{
  "resources": [
    {
      "title": "Markdown Cheat Sheet",
      "url": "https://example.org/markdown-cheatsheet",
      "category": "Guides",
      "tags": ["writing", "reference", "formatting"],
      "description": "A one-page reference...",
      "level": "Beginner",
      "rating": 4.6,
      "featured": true,
      "added": "2026-05-28"
    }
  ],
  "categories": ["Communities", "Courses", "Guides", "Templates", "Tools"],
  "tags": ["accessibility", "analytics", "..."],
  "meta": { "updated": "2026-06-16T08:00:00Z" }
}
```

`index.html` reads these exact field names, so `sample-data.json` matches them
exactly.

---

## How search, filter, and sort work

- **Search** — Type in the header search box. It does a debounced, case-insensitive
  full-text match across each resource's title, description, category, level, and
  tags. Results update as you type.
- **Category filter** — Click a navy category pill in the sidebar. Selecting a
  category narrows results; clicking **All** clears it. Only one category at a time.
- **Tag filter** — Click one or more tags in the sidebar to require them (AND logic:
  a card must have **all** selected tags). Clicking a tag chip **on a card** adds
  that tag to the active filters too.
- **Active filters** — Every active category, tag, and search term shows as a gold
  chip above the grid; click its `×` to remove just that filter.
- **Sort** — The toolbar dropdown offers A→Z, Z→A, Newest (by Added date),
  Featured first, and Top rated.
- **Result count + empty state** — A live count shows how many resources match,
  and a friendly "No resources match your filters" message appears when nothing does.
- **Clear all filters** resets search, category, tags, and sort.

The layout is responsive: on narrow screens the filter sidebar collapses into a
tappable **Filters** button. All controls are keyboard accessible with visible
focus rings.

---

## Offline / demo mode

With `WEB_APP_URL = ""` (the default), the page loads `./sample-data.json`. This
lets you preview and develop the directory with no Google account or deployment.
Because browsers block `fetch()` of local files via `file://`, serve the folder
over a tiny local web server, for example:

```
python3 -m http.server 8000
# then open http://localhost:8000/
```

To go live, deploy `code.gs` (see `setup.md`) and paste its `/exec` URL into
`WEB_APP_URL`.

---

## Hosting on GitHub Pages

This is a static site, so GitHub Pages works well:

1. Commit `index.html` and `sample-data.json` to a repository.
2. In the repo, go to **Settings → Pages** and set the source to your branch
   (root). Your site publishes at `https://<user>.github.io/<repo>/`.
3. For live data, set `WEB_APP_URL` to your Apps Script `/exec` URL before
   committing. (The browser fetches the Apps Script directly; GitHub Pages only
   serves the static files.) If you omit it, the bundled demo data is used.

---

CC BY-SA 4.0 · Miguel Guhlin · mguhlin@tcea.org · https://mguhlin.org · https://go.mgpd.org/lftx2606
