# Set It Up — Newsletter (No Experience Needed)

If you can copy, paste, and click a few buttons, you can do this. Take it one step at a
time — about 15 minutes. ☕

## 👀 Just want to look first?
**Double-click `index.html`.** It opens in your browser showing a complete sample
newsletter. That is the live demo — nothing to install. When you are ready to use your
own content, follow the steps below.

## 🧰 What you need
- A free Google account (the same one you use for Gmail)
- About 15 minutes
- The files in this folder

---

## 🚀 Do these steps in order

### Step 1 — Open Google Apps Script
Go to **[script.google.com](https://script.google.com)** and click **New project**
(top-left).
**You'll see:** a code editor with a little bit of starter code.
✅ You're in the right place if the tab says "Apps Script".

### Step 2 — Paste in the code
1. In the editor, select all the starter code and delete it.
2. Open the file **`code.gs`** from this folder in any text editor, copy *everything*,
   and paste it into the Apps Script editor.
3. Click the **floppy-disk Save icon** (or press Ctrl/Cmd-S).
✅ The code is saved when the little "unsaved" dot disappears.

### Step 3 — Let the script build your spreadsheet for you 🪄
1. At the top, find the **function dropdown** (it may say `doGet`). Choose
   **`createNewsletterTemplate`**.
2. Click **▶ Run**.
3. A box pops up asking for permission. Click **Review permissions**, pick your Google
   account, click **Advanced → Go to (project name)**, then **Allow**.
   *(This is normal — you're approving your own script to create a file in your Drive.)*
4. When it finishes, click **Execution log** at the bottom. It prints a line like
   `SHEET_ID: 1AbCd...`. **Copy that long ID.**
**You'll see:** a new Google Sheet named *"Newsletter — The Learning Loop"* appear in
your Google Drive, already filled in with example content.
✅ You have a SHEET_ID copied to your clipboard.

### Step 4 — Tell the script which sheet to use
1. Back in the Apps Script editor, near the top of the code, find this line:
   `const SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';`
2. Replace `PASTE_YOUR_SHEET_ID_HERE` with the ID you copied (keep the quote marks).
3. **Save** again.
✅ The line now shows your real ID inside the quotes.

### Step 5 — Authorize the reader function
1. Choose **`getNewsletterData`** in the function dropdown.
2. Click **▶ Run**, and **Allow** if it asks again.
✅ The Execution log shows your newsletter content with no red errors.

### Step 6 — Publish it as a web link (deploy)
1. Click the blue **Deploy** button (top-right) → **New deployment**.
2. Click the **gear icon** → choose **Web app**.
3. Set **Execute as: Me** and **Who has access: Anyone**.
   *(“Anyone” just lets your webpage read the data — like making a document
   “anyone with the link can view”.)*
4. Click **Deploy**, then **Copy** the **Web app URL**. It ends in `/exec`.
✅ You have a long link ending in `/exec` on your clipboard.

### Step 7 — Connect your webpage
1. Open **`index.html`** from this folder in a text editor.
2. Near the top of the script find: `const WEB_APP_URL = "";`
3. Paste your `/exec` link between the quotes:
   `const WEB_APP_URL = "https://script.google.com/macros/s/XXXX/exec";`
4. Save.
✅ Done! To see your live newsletter, put the files online (Step below) — your live
data loads automatically.

---

## ✅ How do I know it worked?
- Open your `/exec` link in a new browser tab. You should see a wall of text inside
  curly braces `{ }`. That's your data — perfect.
- Edit a cell in your Google Sheet, reload the page — your change shows up.

## ✏️ Editing future issues
Just edit the Google Sheet. Mark a row **Include? = Yes** to publish it, **No** to hide
it. No code changes needed.

---

## 😕 Stuck? Here are the usual fixes

| What you see | What to do |
|---|---|
| Double-clicked the page after connecting live data, now it's blank | Live data needs the page to be **online**. Put it on the web (see below) or run a local server. The demo (no `WEB_APP_URL`) still works on double-click. |
| Your `/exec` link asks you to sign in | In the deployment settings, set **Who has access: Anyone**, then redeploy. |
| You edited `code.gs` but nothing changed online | You must publish a **new version**: **Deploy → Manage deployments → ✏️ Edit → New version → Deploy**. |
| `Missing tab: "…"` error | A tab in your Sheet was renamed. Re-run `createNewsletterTemplate` for a fresh, correctly-named copy. |

---

## 🌐 Want it on the internet (free)?
See **`START-HERE.md`** in the main folder, or the **"Host It Online — Free"** section of
the main `index.html`. Short version: upload the whole project to a free **GitHub**
repository and switch on **GitHub Pages**.

---
CC BY-SA 4.0 — Miguel Guhlin · [mguhlin@tcea.org](mailto:mguhlin@tcea.org) ·
[mguhlin.org](https://mguhlin.org) · [go.mgpd.org/lftx2606](https://go.mgpd.org/lftx2606)
