# 👋 Start Here — AI-Powered Publications & Dashboards

Welcome! This kit gives you **five ready-made websites**. Each one turns content you
already keep — in Google Sheets, Google Docs, or simple text files — into a polished,
professional web page or dashboard.

You do **not** need to know how to code. If you can copy, paste, and click, you can do
every part of this. Let's go. 🚀

---

## Step 1 — See them work right now (30 seconds)

1. Open this folder on your computer.
2. **Double-click `index.html`** (the one in this main folder).
3. Your web browser opens a menu with five cards. Click any **"Open demo"** button.

Every demo works immediately with built-in example content — nothing to install, no
account needed. Look around and pick the one you like.

> 📦 **Want just the files?** The menu page has a **⬇ ZIP** button on each card, plus a
> **Download all examples** button. (If you edit any files later, re-run `make-zips.sh`
> to refresh those downloads.)

> 💡 **What just happened?** You opened a real website that lives on your own computer.
> The examples come pre-loaded with sample data so you can try before you build.

---

## Step 2 — Pick your project

| Card | Use it when you want… | Where your content lives |
|---|---|---|
| **1 · Newsletter** | A clean, shareable email-style issue | A Google Sheet |
| **2 · KPI Dashboard** | Cards + charts that track numbers | A Google Sheet |
| **3 · Online Magazine** | An online magazine of articles | Google Docs |
| **4 · Reading-List Digest** | A simple roundup of links | Plain text (Markdown) files |
| **5 · Resource Directory** | A searchable catalog of resources | A Google Sheet |

**Easiest to start with:** the **Reading-List Digest** (#4) — no Google account, no setup.
Just edit a text file.

---

## Step 3 — Make it yours

Open the folder for the project you picked, and open its **`setup.md`** file. Each one is
written in the same friendly, click-by-click style with a "Just want to look first?"
shortcut at the top.

The four Google-powered projects (#1, #2, #3, #5) follow the same simple pattern:

1. **The script builds your Google Sheet or Docs for you** — you run one button.
2. **You publish that script as a web link** (called "deploying a Web App").
3. **You paste that link into the webpage.** Done.

That's it. The `setup.md` walks you through each click and tells you what you'll see.

---

## Step 4 — Put it on the internet for FREE

Once it works on your computer, share it with the world using **GitHub Pages** — a free
website host from GitHub. No credit card.

1. Make a free account at **[github.com](https://github.com)**.
2. Click **New repository**. Give it a name (like `my-publications`), choose **Public**,
   and click **Create repository**.
3. On the new repo page, click **Add file → Upload files**. Drag in **everything** from
   this folder (all five folders plus `index.html` and `START-HERE.md`). Click
   **Commit changes**.
4. Go to **Settings → Pages**. Under **Build and deployment**: set **Source** to
   *"Deploy from a branch"*, **Branch** to *main*, folder */(root)*, then **Save**.
5. Wait about a minute. Your site is live at:
   **`https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`**

Share that link with anyone. Every time you upload changes, the site updates.

> 💡 **Prefer your own web server instead?** Just copy these folders into your server's
> web folder (often `/var/www/html/`) or upload them with your host's file manager. The
> main `index.html` is your home page.

---

## A few friendly notes

- **"It works when I double-click but breaks online (or vice versa)."** The built-in
  *demos* always work on a double-click. *Live* Google data only loads when the page is
  online (GitHub Pages) or run through a local server. That's normal and expected.
- **"Is the scary 'unsafe' warning in Google a problem?"** No. When you run your own
  script, Google warns you because *you* wrote it. Click **Advanced → Go to project →
  Allow**. You're only giving your own script permission to read your own files.
- **Want to preview live data on your computer first?** Open a terminal in this folder
  and run `python3 -m http.server 8000`, then visit `http://localhost:8000`. (Browsers
  block webpages from reading live data off a plain double-clicked file, so a tiny local
  server stands in for a real web host.)

---

## What's in each project folder

- **`index.html`** — the actual web page (double-click to view).
- **`setup.md`** — your step-by-step, no-experience-needed guide. ⭐ Start here.
- **`readme.md`** — a short overview of how the project works.
- **`code.gs`** — the Google Apps Script (only for the Google-powered projects).
- **`sample-data.json`** or **`content/*.md`** — the example content that powers the demo.

---

You've got this. Pick one, open its `setup.md`, and take it one step at a time. 💪

---
CC BY-SA 4.0 — Miguel Guhlin · [mguhlin@tcea.org](mailto:mguhlin@tcea.org) ·
[mguhlin.org](https://mguhlin.org) · [go.mgpd.org/lftx2606](https://go.mgpd.org/lftx2606)
