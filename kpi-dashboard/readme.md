# KPI Dashboard (Google Sheets-Powered)

An online performance dashboard that pulls its numbers **live from a Google Sheet**.
Headline KPI cards (value, target, delta, trend), two charts (Chart.js), and a sortable
detail table — all branded in TCEA navy & gold.

![Layout: a navy header bar with the dashboard title, a "last updated" stamp, and a gold
Refresh button; a responsive grid of KPI cards each showing a big value, its target, and
a colored +/- delta; a line chart of trends over time beside a doughnut breakdown; and a
sortable details table.]

## How it works (data flow)

```
Google Sheet  →  Apps Script Web App (code.gs, doGet)  →  JSON  →  index.html + Chart.js
```

## Offline / demo mode

Leave `WEB_APP_URL` empty in `index.html` and the page loads bundled
**`sample-data.json`** — charts and cards render with zero setup. (Serve over http;
browsers block `fetch()` on `file://`.)

> **No spreadsheet yet?** Run `createDashboardTemplate()` in `code.gs` once and it
> builds the whole Sheet for you — KPIs, Trend, and Details tabs with sample data. See
> `setup.md` Option B.

## Required Sheet structure

| Tab | Columns |
|---|---|
| **KPIs** | `Metric`, `Value`, `Target`, `Unit`, `Period`, `Trend` (up/down), `Category`, `Notes` |
| **Trend** | `Period`, `Metric`, `Value` — **long format**: one row per data point. The line chart draws one line per distinct Metric across Periods. |
| **Details** | Any columns. First column = labels, first numeric column drives the doughnut; the whole table is shown and is click-to-sort. |

## How charts map to data

- **KPI cards** ← `KPIs` tab. Delta = `(Value − Target) / Target`; color/arrow from
  `Trend` (or value-vs-target if blank).
- **Line chart** ← `Trend` tab (one series per Metric).
- **Doughnut** ← `Details` (label column + first numeric column); falls back to KPI values.

## Hosting

Static files — host free on **GitHub Pages**. See the workshop root `index.html`.

---
CC BY-SA 4.0 — Miguel Guhlin · [mguhlin@tcea.org](mailto:mguhlin@tcea.org) ·
[mguhlin.org](https://mguhlin.org) · [go.mgpd.org/lftx2606](https://go.mgpd.org/lftx2606)
