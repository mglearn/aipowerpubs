# Field Notes — a Google Docs powered digital publication

> **New here?** Double-click `index.html` to see it work, then open `setup.md` when you're ready to use your own content.

**Field Notes** is a self-contained example of an online magazine / journal whose
articles are written in **Google Docs** and published to a clean, responsive
website. A Google Apps Script Web App reads a Drive folder full of Docs, converts
each one to tidy HTML, and serves the whole issue as JSON. The static site
(`index.html` + `article.html`) fetches that JSON and renders the magazine.

It also runs fully **offline**: if no Apps Script URL is configured, the site
loads the bundled `sample-data.json` demo issue.

---

## What's in this folder

| File | Purpose |
| --- | --- |
| `index.html` | Publication home / table of contents — masthead, featured lead article, and a grid of article cards. |
| `article.html` | Single-article reading view (`article.html?id=<slug>`) with prev/next navigation and a print stylesheet. |
| `code.gs` | Google Apps Script backend — converts Docs in a Drive folder to JSON. |
| `sample-data.json` | Offline demo issue. Matches the exact shape `getPublication()` returns. |
| `readme.md` | This file. |
| `setup.md` | Step-by-step instructions to connect your own Google Docs. |

---

## Data flow

```
Google Docs (one Drive folder)
        │   editor writes each article as a Doc
        ▼
Apps Script  (code.gs · docToHtml_)
        │   converts headings/paragraphs/lists to HTML,
        │   parses leading metadata lines into fields
        ▼
JSON feed   (doGet → ContentService)
        │   { meta:{...}, articles:[...] }
        ▼
Static site (index.html + article.html)
        fetch the /exec URL and render the issue
```

---

## How to author an article (Google Doc)

Create one Google Doc per article inside the publication's Drive folder.

1. **Title** — make it a *Heading 1* (the first Heading 1 becomes the article
   title; if there is none, the Doc's name is used). The Doc name is always used
   to generate the URL slug.
2. **Metadata lines** — at the very top of the Doc, before the body, add any of
   these lines (one per line, as normal text):

   ```
   Category: Strategy
   Byline: Dana Okafor
   Date: 2026-05-28
   Excerpt: A one-sentence teaser shown on the home page.
   Featured: true
   ```

   - `Byline:` and `Author:` are interchangeable.
   - `Date:` is best as `YYYY-MM-DD`. If omitted, the Doc's creation date is used.
   - `Excerpt:` powers the card teaser. If omitted, the start of the body is used.
   - `Featured: true` promotes the article to the lead-story slot. Mark only one.
   - These lines are parsed into fields and **removed** from the published body.
3. **Body** — write normally. The converter maps:
   - *Heading 1* → `h2`, *Heading 2* → `h3`, *Heading 3* → `h4`
   - normal paragraphs → `p`, bulleted/numbered items → `<ul><li>`
   - Reading time is calculated automatically from the word count.

---

## Offline demo mode

Both `index.html` and `article.html` start with:

```js
const WEB_APP_URL = "";
```

When this is empty, the site fetches `./sample-data.json` instead of a live
backend. This makes the example work immediately — just open `index.html`
through a local web server (browsers block `fetch` from `file://`):

```bash
# from inside this folder
python3 -m http.server 8000
# then visit http://localhost:8000/
```

To go live, follow `setup.md` and paste your deployed `/exec` URL into
`WEB_APP_URL` in **both** HTML files.

---

## GitHub Pages

This is a static site, so it hosts well on GitHub Pages:

1. Commit `index.html`, `article.html`, and `sample-data.json` to a repo.
2. In the repo, go to **Settings → Pages** and serve from your branch root.
3. The demo works as-is. To use live Google Docs content, set `WEB_APP_URL`
   to your Apps Script `/exec` URL before committing.

> Note: the Apps Script Web App must be deployed with **Who has access: Anyone**
> so the browser can fetch it. The script runs as you; visitors never see your
> Google account or files directly — only the JSON you choose to publish.

---

CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/) · Miguel Guhlin · mguhlin@tcea.org · https://mguhlin.org · https://go.mgpd.org/lftx2606
