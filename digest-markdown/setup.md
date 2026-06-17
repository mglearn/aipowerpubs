# Set It Up — Reading-List Digest (The Easy One)

Good news: this example needs no Google account and no code deployment. If you can edit
a text file, you can run this. About 5 minutes.

## 👀 Just want to look first?

**Double-click `index.html`.** It opens in your browser with three example issues you can
click through. Nothing to install.

## ✍️ Write your own issue (3 steps)

1. **Make a copy to start from.** Open the `content` folder (it sits right next to
   `index.html`). Copy an existing issue file — for example `issue-12.md` — and rename
   the copy to `issue-13.md`. A `.md` file is just a plain text file: you can open and
   edit it in any editor you already have (Notepad on Windows, TextEdit on Mac, or
   anything else). No special software needed.

2. **Edit the text.** Open your new `issue-13.md` and change the words to make it your
   own. Keep the same headings and overall shape so the page stays tidy. You only need a
   few bits of Markdown — they are simple:
   - `# Your Title` — a `#` and a space makes a big title.
   - `## A Section` — two `##` makes a section heading.
   - `- a point` — a dash and a space makes a bullet point.
   - `[the words you see](https://the-link.com)` — this makes a clickable link: the text
     in square brackets is what shows, the address in parentheses is where it goes.

3. **Register it so it shows up.** Open `index.html` in your text editor and find the
   `ISSUES` list near the top of the script (it's a list of issues, newest first). Add one
   new line at the top, copying the pattern of the lines already there:

   ```js
   { id:"issue-13", title:"Issue #13 — Your Title", date:"2026-06-26", file:"content/issue-13.md" },
   ```

   One more thing if you want the **double-click preview** to keep working: also copy your
   issue's text into a matching block in `index.html`, like this —
   `<script type="text/markdown" id="md-issue-13">…your markdown here…</script>`. (The id
   must match: `issue-13` → `md-issue-13`.) Don't want to bother? No problem — just preview
   with a local server instead (see the next section), and you can skip the extra block.

## 👀 Preview your changes

There are two ways:

- **Simplest:** double-click `index.html` again. (This uses the embedded copies, so it
  works without anything running.)
- **For live editing of the `.md` files:** run a tiny local server. Why? When you
  double-click a page, the browser won't read separate local files for safety reasons — a
  little server gives it a proper web address so your latest `.md` edits show up instantly.
  In a terminal, from this folder, run `python3 -m http.server 8000`, then visit
  http://localhost:8000 in your browser.

## 😕 Stuck? Here are the usual fixes

| Problem | Likely fix |
|---|---|
| Blank page | Make sure the `id` in your `ISSUES` line matches the file you created. |
| My new issue doesn't appear | Did you add it to the `ISSUES` list in `index.html`? |
| Links don't work | Check the format: `[text](url)` — text in square brackets, full web address in parentheses. |

## 🌐 Want it on the internet (free)?

See **START-HERE.md** in the main folder or the "Host It Online — Free" section of the
main `index.html`. (This example is perfect for GitHub Pages.)

---

CC BY-SA 4.0 — Miguel Guhlin · [mguhlin@tcea.org](mailto:mguhlin@tcea.org) · [mguhlin.org](https://mguhlin.org) · [go.mgpd.org/lftx2606](https://go.mgpd.org/lftx2606)
