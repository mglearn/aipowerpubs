/**
 * Code.gs — KPI Dashboard Connector (Web App)
 * ----------------------------------------------------------------------------
 * Reads a Google Sheet of metrics and returns JSON that kpi-dashboard/index.html
 * renders into KPI cards, charts (Chart.js), and a detail table.
 *
 * Tabs read:
 *   "KPIs"    — header table: Metric, Value, Target, Unit, Period, Trend, Category, Notes
 *   "Trend"   — LONG format header table: Period, Metric, Value  (one row per point)
 *   "Details" — any header table; returned as array of row objects
 *
 * SETUP (full steps in setup.md):
 *   1. Sheet → Extensions → Apps Script. Paste this, set SHEET_ID, Save.
 *   2. Run getDashboardData() once to authorize.
 *   3. Deploy → New deployment → Web app → Execute as Me → Anyone → copy /exec URL.
 *   4. Paste that URL into WEB_APP_URL in index.html.
 *
 * CC BY-SA 4.0 — Miguel Guhlin (mguhlin@tcea.org | mguhlin.org |
 *   https://go.mgpd.org/lftx2606)
 * ----------------------------------------------------------------------------
 */

const SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';

const TABS = { kpis: 'KPIs', trend: 'Trend', details: 'Details' };

/**
 * ONE-CLICK SETUP. Run this once to create a ready-to-use dashboard Spreadsheet
 * with the KPIs, Trend, and Details tabs, headers, and sample data. It logs the
 * new file's URL and ID — paste that ID into SHEET_ID above, then deploy as a Web App.
 *
 * (Easiest path: open a new project at script.google.com, paste this whole file,
 *  Run createDashboardTemplate, approve permissions, copy the logged ID.)
 */
function createDashboardTemplate() {
  const ss = SpreadsheetApp.create('KPI Dashboard');

  // KPIs
  const kpis = ss.getActiveSheet().setName(TABS.kpis);
  kpis.getRange('A1:H1').setValues([[
    'Metric', 'Value', 'Target', 'Unit', 'Period', 'Trend', 'Category', 'Notes'
  ]]);
  kpis.getRange('A2:H7').setValues([
    ['Active Members', 4820, 5000, '', 'This month', 'up', 'Membership', 'Steady growth from spring campaign.'],
    ['Course Completions', 1340, 1200, '', 'This month', 'up', 'Learning', 'Above target.'],
    ['Net Promoter Score', 62, 60, '', 'Q2', 'up', 'Satisfaction', ''],
    ['Events Held', 18, 24, '', 'This quarter', 'down', 'Engagement', 'Two events postponed.'],
    ['Support Tickets Resolved', 96, 95, '%', 'This month', 'up', 'Operations', ''],
    ['Avg. Satisfaction', 4.6, 4.5, '/5', 'This month', 'up', 'Satisfaction', '']
  ]);

  // Trend (long format: Period, Metric, Value)
  const trend = ss.insertSheet(TABS.trend);
  trend.getRange('A1:C1').setValues([['Period', 'Metric', 'Value']]);
  trend.getRange('A2:C13').setValues([
    ['Jan', 'Active Members', 4100], ['Feb', 'Active Members', 4250],
    ['Mar', 'Active Members', 4380], ['Apr', 'Active Members', 4510],
    ['May', 'Active Members', 4690], ['Jun', 'Active Members', 4820],
    ['Jan', 'Course Completions', 880], ['Feb', 'Course Completions', 940],
    ['Mar', 'Course Completions', 1010], ['Apr', 'Course Completions', 1150],
    ['May', 'Course Completions', 1265], ['Jun', 'Course Completions', 1340]
  ]);

  // Details (first column = labels, first numeric column feeds the doughnut)
  const details = ss.insertSheet(TABS.details);
  details.getRange('A1:D1').setValues([['Region', 'Members', 'Completions', 'Satisfaction']]);
  details.getRange('A2:D6').setValues([
    ['North', 1320, 410, 4.7],
    ['South', 1180, 360, 4.5],
    ['East', 1090, 300, 4.6],
    ['West', 1230, 270, 4.4],
    ['Online', 0, 0, 0]
  ]);

  // Tidy headers
  [kpis, trend, details].forEach(sh => {
    sh.getRange(1, 1, 1, sh.getLastColumn()).setFontWeight('bold')
      .setBackground('#002855').setFontColor('#ffffff');
    sh.setFrozenRows(1);
  });

  const url = ss.getUrl(), id = ss.getId();
  Logger.log('KPI Dashboard Sheet created.\nURL: ' + url + '\nSHEET_ID: ' + id +
             '\n\nPaste the SHEET_ID into the constant at the top of this file.');
  return { url: url, id: id };
}

/** Main entry point. */
function getDashboardData() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const data = {
    kpis: readKpis_(ss),
    trend: tableToObjects_(ss, TABS.trend),     // [{Period, Metric, Value}, ...]
    details: tableToObjects_(ss, TABS.details),
    meta: { updated: new Date().toISOString() }
  };
  Logger.log(JSON.stringify(data, null, 2));
  return data;
}

function readKpis_(ss) {
  return tableToObjects_(ss, TABS.kpis).map(o => ({
    metric: o['Metric'] || '',
    value: o['Value'] || '',
    target: o['Target'] || '',
    unit: o['Unit'] || '',
    period: o['Period'] || '',
    trend: o['Trend'] || '',
    category: o['Category'] || '',
    notes: o['Notes'] || ''
  })).filter(o => o.metric);
}

/* ---------- helpers ---------- */

function getSheetOrThrow_(ss, name) {
  const sh = ss.getSheetByName(name);
  if (!sh) throw new Error('Missing tab: "' + name + '". Check the tab name.');
  return sh;
}

function getRows_(ss, name) {
  const sh = getSheetOrThrow_(ss, name);
  return sh.getDataRange().getValues()
    .filter(r => r.some(c => (c || '').toString().trim() !== ''));
}

/** First non-empty row = header. Numeric-looking cells stay as numbers. */
function tableToObjects_(ss, name) {
  const rows = getRows_(ss, name);
  if (rows.length < 2) return [];
  const headers = rows[0].map(h => (h || '').toString().trim());
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const obj = {};
    let has = false;
    headers.forEach((h, c) => {
      if (!h) return;
      let v = rows[i][c];
      if (v === '' || v == null) { obj[h] = ''; return; }
      obj[h] = v;
      has = true;
    });
    if (has) out.push(obj);
  }
  return out;
}

/* ---------- web-app endpoint ---------- */

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify(getDashboardData()))
    .setMimeType(ContentService.MimeType.JSON);
}
