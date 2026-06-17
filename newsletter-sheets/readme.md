# Newsletter (Google Sheets-Powered)

A web-rendered newsletter — "The Learning Loop" style, but generic — that builds each
issue **live from a Google Sheet**. Editors write in the spreadsheet; readers open a
clean, branded, print-ready web page. No copy-paste, no layout fiddling.

![Layout: a navy masthead with the newsletter name, issue number, date, and a gold
"theme" pill; an intro reflection; an "In This Issue" box; an "Article Navigation"
list of numbered anchor links; then each article with an image placeholder, "The Big
Idea", "Why It Matters", "Practical Takeaways", and a source/author/date line; a
closing reflection and a disclaimer.]

## How it works (data flow)

```
Google Sheet  →  Apps Script Web App (code.gs, doGet)  →  JSON  →  index.html renders it
```

- **Source of truth:** a Google Sheet with five tabs.
- **code.gs:** an Apps Script Web App that reads the tabs and returns structured JSON.
- **index.html:** fetches that JSON and renders the styled issue. No build step, no framework.

## Offline / demo mode

If `WEB_APP_URL` in `index.html` is left empty, the page loads the bundled
**`sample-data.json`** instead — so it works immediately with zero setup. Set the
constant to your `/exec` URL to go live. (Browsers block `fetch()` over `file://`, so
preview with a local server — see `setup.md`.)

## Required Sheet structure

| Tab | Shape | Key columns / fields |
|---|---|---|
| **Issue Setup** | Vertical Field / Value | Newsletter Name, Issue Number, Issue Date, Theme, Audience, Tone, Intro, In This Issue, Closing Reflection |
| **Articles** | Header row table | Nav #, Short Navigation Title, Title, Key Facts / Summary, Why It Matters, Practical Takeaways, Source / Publication, URL, Author, Date, Image Description, Priority, **Include?** |
| **Optional Sections** | Header row table | Section, Content, **Include?** |
| **Image Plan** | Header row table | Image Type, Description, **Include?** |
| **Publishing Checklist** | Header row table | Checklist Item, Done?, Owner, Notes |

> **No spreadsheet yet?** Run `createNewsletterTemplate()` in `code.gs` once and it
> builds this entire Sheet for you — all five tabs, headers, and a starter issue. See
> `setup.md` Option B.

Only `Articles` rows where **Include? = Yes** are published; they sort by Priority
(High → Medium → Low) then Nav #. **Practical Takeaways** may be one cell with items
separated by new lines or `|`.

## Hosting

Works as static files anywhere — including **GitHub Pages for free**. See the root
`index.html` of this workshop for step-by-step hosting instructions.

---
CC BY-SA 4.0 — Miguel Guhlin · [mguhlin@tcea.org](mailto:mguhlin@tcea.org) ·
[mguhlin.org](https://mguhlin.org) · [go.mgpd.org/lftx2606](https://go.mgpd.org/lftx2606)
