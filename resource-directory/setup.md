# Set It Up — Resource Directory (No Experience Needed)

If you can copy, paste, and click a few buttons, you can do this. About 15 minutes.

## 👀 Just want to look first?
**Double-click `index.html`.** It opens showing a searchable directory full of example
resources — search and filters work immediately. Nothing to install.

## 🧰 What you need
- A free Google account
- About 15 minutes
- The files in this folder

## 🚀 Do these steps in order

### Step 1 — Open Google Apps Script
Go to <https://script.google.com> and click **New project** (top left).

**You'll see:** a code editor with a file called `Code.gs` and a little bit of starter code in it.

✅ You now have an empty project ready for your code.

### Step 2 — Paste in the project code
Select everything in that `Code.gs` box and delete it. Then open the `code.gs` file from
this folder, copy **all** of it, and paste it in. Click the **Save** (floppy-disk) icon.

**You'll see:** the code editor filled with the Resource Directory code, and the file name
keeps a small dot or "Saved" note when you save.

✅ Your code is in place.

### Step 3 — Build your Google Sheet with one click
At the top of the editor there's a dropdown that lists function names (it probably says
`doGet`). Click it and choose **`createDirectoryTemplate`**. Then click **▶ Run**.

This one button creates a brand-new Google Sheet named **Resource Directory** with a
**Resources** tab, the correct column headers, and several sample rows — all done for you.

**You'll see:** Google asks you to authorize the script the first time (that's the next
step). After it runs, an **Execution log** opens at the bottom showing a link to your new
Sheet and a long **SHEET_ID**.

✅ Your Google Sheet exists and is filled with sample resources.

### Step 4 — Say "yes" to the permission pop-up
The first time you Run, Google shows a permission window. Pick your Google account, click
**Advanced**, then **Go to (project name) (unsafe)**, then **Allow**.

> Why "unsafe"? It only looks scary. You are giving *your own* script permission to use
> *your own* Google account. Nothing leaves your account.

**You'll see:** the window closes and the script finishes running (back to Step 3's log).

✅ The script is authorized and `createDirectoryTemplate` has run.

### Step 5 — Copy your Sheet ID into the code
In the Execution log from Step 3, find the line that says **SHEET_ID:** followed by a long
string of letters and numbers. Copy that string. Back in the code, find this line near the top:

```js
const SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';
```

Replace `PASTE_YOUR_SHEET_ID_HERE` with your ID (keep the quotes), then **Save** again.

**You'll see:** the line now shows your real ID, like `const SHEET_ID = '1AbC...XyZ';`.

✅ The code now knows which Sheet to read.

### Step 6 — Deploy it as a Web App
Click **Deploy** (top right) → **New deployment**. Click the gear icon and choose
**Web app**. Set:
- **Execute as:** **Me**
- **Who has access:** **Anyone**

Click **Deploy** and approve any prompts.

> Why "Anyone"? Your web page needs to read the data without anyone logging in. "Anyone"
> means anyone with the link can *read* your published list — it does **not** let them edit
> your Sheet.

**You'll see:** a confirmation with a **Web app URL** that ends in `/exec`.

✅ Your data is now live on the web as JSON.

### Step 7 — Copy the /exec URL
Click **Copy** next to that Web app URL (the one ending in `/exec`).

**You'll see:** the URL is now on your clipboard, ready to paste.

✅ You have the link your web page needs.

### Step 8 — Paste the URL into index.html
Open `index.html` in any text editor. Near the bottom, find this line:

```js
const WEB_APP_URL = "";
```

Paste your `/exec` URL between the quotes:

```js
const WEB_APP_URL = "https://script.google.com/macros/s/AKfy.../exec";
```

Save the file.

**You'll see:** the quotes now hold your long Web app URL.

✅ Your page is connected to your live Sheet.

## ✅ How do I know it worked?
- Open `index.html` (hosted over http — see the last section) and you should see your
  resources from the Sheet, not the demo ones.
- Add a row in the **Resources** tab of your Sheet, refresh the page, and your new
  resource appears.
- Tip: paste the `/exec` URL straight into a browser tab. You should see plain text JSON
  full of your resources — that means the Web App is working.

## 😕 Stuck? Here are the usual fixes

| What you see | The fix |
|--------------|---------|
| It worked when you double-clicked, but breaks after going live | Don't open the live version with `file://`. Serve it over http or host it (see the last section). |
| The `/exec` link asks you to sign in | In **Deploy → Manage deployments**, set **Who has access** to **Anyone**, then deploy a new version. |
| Page loads but shows **no results** | Check the **Include** column — anything other than `Yes` or blank hides that row. |
| Your tags all show as one big tag | Separate tags with **commas** in one cell, like `writing, reference, free`. |
| You edited the Sheet but nothing changes | Just refresh the page. If you changed `code.gs`, **deploy a new version** (Deploy → Manage deployments → edit → New version). |

## 🌐 Want it on the internet (free)?
See **START-HERE.md** in the main folder or the "Host It Online — Free" section of the
main `index.html`.

---
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — Miguel Guhlin ·
[mguhlin@tcea.org](mailto:mguhlin@tcea.org) ·
[blog.tcea.org](https://blog.tcea.org) ·
[go.mgpd.org/lftx2606](https://go.mgpd.org/lftx2606)
