# Set It Up — Digital Publication (No Experience Needed)

If you can copy, paste, and click a few buttons, you can do this. Take it one step
at a time — about 15 minutes.

## 👀 Just want to look first?
**Double-click `index.html`.** It opens in your browser showing a sample magazine with
example articles. That is the live demo — nothing to install. When you are ready to use
your own writing, follow the steps below.

## 🧰 What you need
- A free Google account (the same one you use for Gmail)
- About 15 minutes
- The files in this folder

## 🚀 Do these steps in order

**Step 1 — Open Google Apps Script.**
In your web browser, go to [script.google.com](https://script.google.com) and click the
blue **New project** button.
**You'll see:** a code editor with a little bit of sample code already in it (something
like `function myFunction() {}`).
✅ You now have an empty project ready for our code.

**Step 2 — Paste in the code.**
Open the file `code.gs` from this folder in any text editor, select everything
(Ctrl+A / Cmd+A), and copy it. Back in Apps Script, delete the sample code that's
already there, then paste in what you copied. Click the **Save** icon (the little
floppy disk) near the top.
**You'll see:** the editor now full of the code from `code.gs`.
✅ Your code is in place and saved.

**Step 3 — Let the script build your folder and sample articles for you.**
Near the top of the editor there's a dropdown that lists function names. Click it and
choose **`createPublicationTemplate`**. Then click the **Run** button (the ▶ arrow).
**You'll see:** the first time you run it, Google asks for permission (we handle that in
Step 4). After it finishes, look at the **Execution log** at the bottom — it prints a
link to a brand-new Drive folder that already contains three example Google Docs.
✅ Google made a folder and sample articles for you. No need to create anything by hand.

**Step 4 — Say "yes" to the permission pop-up (authorize).**
When Google asks, choose your account, then click **Advanced → Go to project (unsafe)**,
and finally **Allow**. This looks scary, but it is normal: you are simply giving *your
own* script permission to read *your own* Google Docs.
**You'll see:** the pop-up closes and the script finishes running.
✅ The script is now allowed to read your Docs.

**Step 5 — Tell the code which folder to use.**
In the Execution log from Step 3, find the **FOLDER_ID** (the long string of letters and
numbers). Copy it. Near the top of `code.gs` find the line
`const FOLDER_ID = '';` and paste your ID between the quotes. Click **Save** again.
**You'll see:** your folder's ID sitting inside the quotation marks.
✅ The code now knows where your articles live.

**Step 6 — Publish your code as a Web App.**
Click **Deploy** (top right) → **New deployment**. Click the gear icon and pick
**Web app**. Set these two options:
- **Execute as:** **Me**
- **Who has access:** **Anyone**

Then click **Deploy**.
**You'll see:** a success screen with a **Web app URL** that ends in `/exec`.
✅ Your publication's data is now live on the internet.

> **Why "Anyone"?** Your website needs to grab the data from a regular visitor's browser,
> and visitors aren't signed in to your Google account. "Anyone" just lets your site read
> the published data — it does **not** give anyone access to your Google account or files.

**Step 7 — Copy your Web app URL.**
On that same success screen, click **Copy** next to the Web app URL (it looks like
`https://script.google.com/macros/s/AKfy.../exec`).
**You'll see:** the URL copied to your clipboard.
✅ You have the one link that connects everything.

**Step 8 — Paste the URL into BOTH website files.**
Open `index.html` in a text editor. Near the bottom, find this line:

```js
const WEB_APP_URL = "";
```

Paste your URL between the quotes so it reads:

```js
const WEB_APP_URL = "https://script.google.com/macros/s/AKfy.../exec";
```

Save the file. Now do the **exact same thing** in `article.html`.
**You'll see:** your `/exec` link sitting inside the quotes in both files.
✅ Both pages now point at your live content. You're done!

## ✅ How do I know it worked?
- **Check the data link.** Open your `/exec` link in a new browser tab. You should see a
  wall of text in curly braces `{ }`. That's your data. Good.
- **Check the home page.** Open `index.html` (served over the web — see the last section)
  and you should see your own articles instead of the samples.
- **Check an article.** Click any article. It should open and read nicely.

## 😕 Stuck? Here are the usual fixes

| What you're seeing | The fix |
| --- | --- |
| You connected your live data, but the page looks broken or empty when you just double-click it. | A double-clicked page can't fetch live data — that only works when the page is *served* over the web. Host it for free (see the next section) or run a local server. |
| Your `/exec` link asks you to sign in instead of showing data. | Your deployment's access is set too tight. Go back to **Deploy**, set **Who has access** to **Anyone**, and deploy again. |
| You changed `code.gs` but your edits don't show up. | Editing the code isn't enough — you must publish a **new version**: **Deploy → Manage deployments → Edit (pencil) → New version → Deploy**. |
| No articles show up at all. | Make sure the folder actually has **Google Docs** in it (not Word files or PDFs), and that your **FOLDER_ID** is pasted in correctly. |

## 🌐 Want it on the internet (free)?
See **START-HERE.md** in the main folder, or the "Host It Online — Free" section of the
main `index.html`. One-line summary: upload the whole project to a free GitHub
repository and turn on GitHub Pages.

---
CC BY-SA 4.0 — Miguel Guhlin · [mguhlin@tcea.org](mailto:mguhlin@tcea.org) · [mguhlin.org](https://mguhlin.org) · [go.mgpd.org/lftx2606](https://go.mgpd.org/lftx2606)
