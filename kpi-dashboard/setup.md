# Set It Up — KPI Dashboard (No Experience Needed)

If you can copy, paste, and click a few buttons, you can do this. One step at a time —
about 15 minutes. ☕

## 👀 Just want to look first?
**Double-click `index.html`.** It opens in your browser with a full dashboard — cards,
charts, and a table all filled with example numbers. That's the live demo, nothing to
install. When you're ready for your own numbers, follow the steps below.

## 🧰 What you need
- A free Google account (the same one you use for Gmail)
- About 15 minutes
- The files in this folder

---

## 🚀 Do these steps in order

### Step 1 — Open Google Apps Script
Go to **[script.google.com](https://script.google.com)** and click **New project**.
**You'll see:** a code editor with a little starter code.
✅ The tab says "Apps Script".

### Step 2 — Paste in the code
Open **`code.gs`** from this folder in any text editor, copy *everything*, delete the
starter code in the editor, and paste yours in. Click the **Save** icon (floppy disk).
✅ Your code is in place and saved.

### Step 3 — Let the script build your spreadsheet for you 🪄
1. Find the **function dropdown** near the top and choose **`createDashboardTemplate`**.
2. Click **▶ Run**.
3. When the permission box appears, click **Review permissions → your account →
   Advanced → Go to (project) → Allow**. *(Normal — you're letting your own script make
   a file in your Drive.)*
4. Open the **Execution log** at the bottom. Copy the long **`SHEET_ID`** it prints.
**You'll see:** a new Google Sheet named *"KPI Dashboard"* in your Drive, already filled
with example KPIs, trend data, and details.
✅ You have a SHEET_ID copied.

### Step 4 — Tell the script which sheet to use
Near the top of the code, find `const SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';` and replace
the placeholder with your ID (keep the quotes). **Save**.
✅ Your real ID is now in the quotes.

### Step 5 — Authorize the reader function
Choose **`getDashboardData`** in the dropdown, click **▶ Run**, and **Allow** if asked.
✅ The Execution log shows your data with no red errors.

### Step 6 — Publish it as a web link (deploy)
1. Click **Deploy** → **New deployment**.
2. Gear icon → **Web app**.
3. **Execute as: Me**, **Who has access: Anyone**.
   *(“Anyone” just lets your webpage read the numbers — it does **not** give anyone
   access to your account or files.)*
4. **Deploy**, then **Copy** the **Web app URL** (it ends in `/exec`).
✅ You have a link ending in `/exec`.

### Step 7 — Connect your webpage
Open **`index.html`**, find `const WEB_APP_URL = "";` near the top of the script, and
paste your `/exec` link between the quotes. Save.
✅ Done — your dashboard now reads your live numbers when the page is online.

---

## ✅ How do I know it worked?
- Open your `/exec` link in a new tab — you should see text inside curly braces `{ }`.
  That's your data.
- Change a number in your Google Sheet, reload the page, click **↻ Refresh** — it updates.

## ✏️ Editing your dashboard
Edit the Google Sheet:
- **KPIs** tab = the cards. **Trend** tab = the line chart. **Details** tab = the table
  and doughnut. The columns are already labeled for you in the sheet the script built.

---

## 😕 Stuck? Here are the usual fixes

| What you see | What to do |
|---|---|
| Page is blank after connecting live data | Live data needs the page **online** (host it, below) or via a local server. The demo still works on double-click. |
| Charts are empty | The **Trend** tab needs rows like `Jan | Active Members | 4100` (one point per row) with real numbers. |
| `/exec` link asks you to sign in | Set **Who has access: Anyone** and redeploy. |
| Edited `code.gs`, nothing changed | Publish a **new version**: **Deploy → Manage deployments → ✏️ Edit → New version → Deploy**. |
| `Missing tab: "…"` error | A tab was renamed. Re-run `createDashboardTemplate` for a fresh, correctly-named copy. |

---

## 🌐 Want it on the internet (free)?
See **`START-HERE.md`** in the main folder, or the **"Host It Online — Free"** section of
the main `index.html`. Short version: upload the project to a free **GitHub** repository
and switch on **GitHub Pages**.

---
CC BY-SA 4.0 — Miguel Guhlin · [mguhlin@tcea.org](mailto:mguhlin@tcea.org) ·
[mguhlin.org](https://mguhlin.org) · [go.mgpd.org/lftx2606](https://go.mgpd.org/lftx2606)
