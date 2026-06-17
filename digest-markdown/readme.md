# The Reading Loop — Markdown-Only Digest Reader

**New here?** Double-click `index.html` to see it work — this is the simplest example (no Google account needed).

A web-rendered **reading list / link digest** publication whose content lives entirely in **Markdown files**. The site fetches one or more `.md` files at runtime and renders them into a styled, navigable digest — like a curated "issues archive" of link roundups.

> **This is the Markdown-only variant.** It requires **no Google account, no Google Apps Script, no backend, and no database.** There is intentionally **no `code.gs`** in this example. If you want the Apps-Script-powered variant, that lives elsewhere — this one is pure static HTML + Markdown.

---

## What it is

- A single `index.html` (vanilla JavaScript, no build step).
- A `content/` folder of `.md` issue files.
- Markdown is rendered to HTML in the browser with [marked.js](https://marked.js.org/) (via CDN) and sanitized with [DOMPurify](https://github.com/cure53/DOMPurify) (via CDN).
- Design follows the TCEA navy & gold spec, with a navy masthead, a clickable Issues index, an auto-generated in-page Table of Contents, and a centered reading card.

---

## Data flow

```
You author Markdown            Browser fetches the .md           marked.js renders
issue files in content/   ──▶   file named in the ISSUES   ──▶   it to styled HTML
(plain text, no tools)          array (fetch at runtime)         (DOMPurify sanitizes)
```

There is **no server-side code and no database.** The only "logic" is the small script in `index.html` that:
1. reads the `ISSUES` config array,
2. `fetch()`es the selected issue's `.md` file,
3. renders + sanitizes it, and
4. builds the issues list and per-issue table of contents.

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | The digest reader (UI, styling, and rendering logic). |
| `content/issue-12.md`, `issue-11.md`, `issue-10.md` | Sample issues in "The Reading Loop" style. |
| `readme.md` | This file. |
| `setup.md` | Step-by-step authoring + publishing guide. |

---

## How to add a new issue

1. **Write the Markdown.** Copy an existing file in `content/` (e.g. `issue-12.md`) to a new name like `content/issue-13.md` and edit the content.
2. **Register it.** Open `index.html` and add an entry to the `ISSUES` array, **newest first**:
   ```js
   const ISSUES = [
     { id: "issue-13", title: "Issue #13 — Your Title", date: "2026-06-26", file: "content/issue-13.md" },
     { id: "issue-12", title: "Issue #12 — The Quiet Power of Feedback", date: "2026-06-12", file: "content/issue-12.md" },
     // ...older issues
   ];
   ```
   - `id` — a short unique slug used in deep links (`?issue=issue-13`).
   - `title` — shown in the Issues list and the page title.
   - `date` — `YYYY-MM-DD`; used to sort and display the date.
   - `file` — path to the `.md` file **relative to `index.html`**. It must match the file you created exactly.
3. **Preview** with a local server (see below), confirm it loads, then publish.

The site loads the newest issue by default and supports deep links via `?issue=<id>`.

---

## Per-issue Markdown structure (the convention)

Each issue follows "The Reading Loop" newsletter format:

```markdown
# The Reading Loop

**Issue #N — Month DD, YYYY**

A short intro reflection (a paragraph or two).

## Article Navigation

- #1 — Short Title
- #2 — Short Title
...

## #1 - Short Title

> Image: a clean visual of ...        ← image placeholder (renders as a blockquote)

### The Big Idea
...

### Why It Matters
...

### Practical Takeaways
- bullet
- bullet

**Source:** [Name](https://www.example.org/...)
**Author:** Made-Up Name

---

## Closing Reflection

...

> This newsletter provides original commentary and summaries of publicly available
> sources for educational and informational purposes. ...   ← standard disclaimer
```

The reader auto-builds the in-page Table of Contents from the `##` and `###` headings of the current issue, so keeping the heading structure consistent keeps the navigation clean.

---

## `file://` vs. local-server caveat (important)

Opening `index.html` by double-clicking it (a `file://` URL) **will usually fail to load issues.** Browsers block `fetch()` of local files from `file://` for security reasons, so the Markdown can't be read.

**Fix:** run a tiny local web server from this folder and open the `http://` address:

```bash
cd digest-markdown
python3 -m http.server 8000
```

Then visit **http://localhost:8000** in your browser. The reader will show a friendly error with these exact instructions if it detects you're on `file://`.

---

## GitHub Pages

This works **great on GitHub Pages** because Pages serves your files over `https://` — so `fetch()` of the `.md` files is allowed and there's nothing to block.

1. Push this folder to a GitHub repository.
2. In the repo, go to **Settings → Pages**, choose your branch (e.g. `main`) and root, and save.
3. Open the published URL. Done — no server to run, no account beyond GitHub.

---

[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) · Miguel Guhlin · mguhlin@tcea.org · https://mguhlin.org
