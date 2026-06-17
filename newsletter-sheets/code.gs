/**
 * Code.gs — Newsletter Sheet Connector (Web App)
 * ----------------------------------------------------------------------------
 * Reads a Google Sheet built for the "Newsletter Creator" workflow and returns
 * structured JSON that newsletter-sheets/index.html renders into a styled issue.
 *
 * Tabs read: "Issue Setup", "Articles", "Optional Sections", "Image Plan",
 *            "Publishing Checklist".
 *
 * SETUP (full steps in setup.md):
 *   1. Open your Sheet → Extensions → Apps Script.
 *   2. Paste this file, set SHEET_ID below, Save.
 *   3. Run getNewsletterData() once to authorize.
 *   4. Deploy → New deployment → Web app → Execute as: Me →
 *      Who has access: Anyone → Deploy. Copy the /exec URL.
 *   5. Paste that URL into WEB_APP_URL in index.html.
 *
 * CC BY-SA 4.0 — Miguel Guhlin (mguhlin@tcea.org | mguhlin.org |
 *   https://go.mgpd.org/lftx2606)
 * ----------------------------------------------------------------------------
 */

const SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';

const TABS = {
  setup: 'Issue Setup',
  articles: 'Articles',
  optional: 'Optional Sections',
  images: 'Image Plan',
  checklist: 'Publishing Checklist'
};

/**
 * ONE-CLICK SETUP. Run this once to create a ready-to-use newsletter Spreadsheet
 * with all five tabs, headers, and a starter issue. It logs the new file's URL and
 * ID — paste that ID into SHEET_ID above, then deploy as a Web App.
 *
 * (Easiest path: open a new project at script.google.com, paste this whole file,
 *  Run createNewsletterTemplate, approve permissions, copy the logged ID.)
 */
function createNewsletterTemplate() {
  const ss = SpreadsheetApp.create('Newsletter — The Learning Loop');

  // Issue Setup (vertical Field/Value)
  const setup = ss.getActiveSheet().setName(TABS.setup);
  setup.getRange('A1:B1').setValues([['Field', 'Value']]);
  setup.getRange('A2:B11').setValues([
    ['Newsletter Name', 'The Learning Loop'],
    ['Issue Number', '1'],
    ['Issue Date', 'June 16, 2026'],
    ['Theme', 'Designing Calmer AI Workflows'],
    ['Audience', 'Educators and instructional leaders'],
    ['Tone', 'Practical, clear, reflective'],
    ['Intro', 'Most weeks the problem is not too little information — it is too much. This issue looks at a few deliberate workflows.'],
    ['In This Issue', 'Three short reads on building sustainable AI habits.'],
    ['Closing Reflection', 'Pick one workflow from this issue and run it for a week. What is the smallest loop you could close?'],
    ['', '']
  ]);

  // Articles
  const arts = ss.insertSheet(TABS.articles);
  arts.getRange('A1:M1').setValues([[
    'Nav #', 'Short Navigation Title', 'Title', 'Key Facts / Summary', 'Why It Matters',
    'Practical Takeaways', 'Source / Publication', 'URL', 'Author', 'Date',
    'Image Description', 'Priority', 'Include?'
  ]]);
  arts.getRange('A2:M3').setValues([
    ['1', 'Start With the Loop', 'Start With the Loop, Not the Tool',
     'Map the workflow before adopting a tool.', 'Clearer workflows mean simpler tool choices.',
     'Draw your workflow on one page|Name the biggest time leak|Pilot for two weeks',
     'Example Learning Lab', 'https://example.org/start-with-the-loop', 'Jordan Avery', 'June 2026',
     'A hand-drawn loop diagram on a whiteboard', 'High', 'Yes'],
    ['2', 'Summaries People Trust', 'Writing AI Summaries People Actually Trust',
     'Pair a short summary with a clear source link.', 'Trust is the currency of any publication.',
     'Always link the original|Keep summaries short|Note uncertainty when it matters',
     'Open Editorial Notes', 'https://example.org/summaries-people-trust', 'Priya Nandakumar', 'May 2026',
     'A summary card beside a linked article', 'Medium', 'Yes']
  ]);

  // Optional Sections
  const opt = ss.insertSheet(TABS.optional);
  opt.getRange('A1:C1').setValues([['Section', 'Content', 'Include?']]);
  opt.getRange('A2:C3').setValues([
    ['Try This', 'Write a two-sentence original summary for each link you saved last week.', 'Yes'],
    ['What to Watch', 'Watch for tools that promise to replace editorial judgment entirely.', 'Yes']
  ]);

  // Image Plan
  const img = ss.insertSheet(TABS.images);
  img.getRange('A1:C1').setValues([['Image Type', 'Description', 'Include?']]);
  img.getRange('A2:C2').setValues([['Placeholder', 'Use placeholders this issue; license real visuals before distribution.', 'Yes']]);

  // Publishing Checklist
  const chk = ss.insertSheet(TABS.checklist);
  chk.getRange('A1:D1').setValues([['Checklist Item', 'Done?', 'Owner', 'Notes']]);
  chk.getRange('A2:D4').setValues([
    ['All source links verified', 'Yes', 'Editor', ''],
    ['Summaries written in original language', 'Yes', 'Editor', ''],
    ['Images licensed or placeholders', 'No', 'Designer', 'Placeholders in this draft']
  ]);

  // Tidy headers
  [setup, arts, opt, img, chk].forEach(sh => {
    sh.getRange(1, 1, 1, sh.getLastColumn()).setFontWeight('bold')
      .setBackground('#002855').setFontColor('#ffffff');
    sh.setFrozenRows(1);
  });

  const url = ss.getUrl(), id = ss.getId();
  Logger.log('Newsletter Sheet created.\nURL: ' + url + '\nSHEET_ID: ' + id +
             '\n\nPaste the SHEET_ID into the constant at the top of this file.');
  return { url: url, id: id };
}

/** Main entry point. Returns the whole workbook as a structured object. */
function getNewsletterData() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const data = {
    issueSetup: readIssueSetup_(ss),
    articles: readArticles_(ss),
    optionalSections: readOptionalSections_(ss),
    imagePlan: readImagePlan_(ss),
    publishingChecklist: readChecklist_(ss)
  };
  Logger.log(JSON.stringify(data, null, 2));
  return data;
}

/** Issue Setup is a vertical Field/Value table. Returns a flat object. */
function readIssueSetup_(ss) {
  const rows = getRows_(ss, TABS.setup);
  const setup = {};
  rows.forEach(r => {
    const key = (r[0] || '').toString().trim();
    const val = (r[1] || '').toString().trim();
    if (key && key.toLowerCase() !== 'field') setup[key] = val;
  });
  return setup;
}

/** Articles: header-row table. Include? = Yes, sorted High → Medium → Low, then Nav #. */
function readArticles_(ss) {
  const objs = tableToObjects_(ss, TABS.articles);
  const rank = { high: 0, medium: 1, low: 2 };
  return objs
    .filter(o => yes_(o['Include?']))
    .sort((a, b) => {
      const pa = rank[(a['Priority'] || '').toLowerCase()] ?? 99;
      const pb = rank[(b['Priority'] || '').toLowerCase()] ?? 99;
      if (pa !== pb) return pa - pb;
      return num_(a['Nav #']) - num_(b['Nav #']);
    });
}

/** Optional Sections — only rows marked Yes. */
function readOptionalSections_(ss) {
  return tableToObjects_(ss, TABS.optional).filter(o => yes_(o['Include?']));
}

/** Image Plan — only rows marked Yes. */
function readImagePlan_(ss) {
  return tableToObjects_(ss, TABS.images).filter(o => yes_(o['Include?']));
}

/** Publishing Checklist — all items with done flag. */
function readChecklist_(ss) {
  return tableToObjects_(ss, TABS.checklist).map(o => ({
    item: o['Checklist Item'] || '',
    done: yes_(o['Done?']),
    owner: o['Owner'] || '',
    notes: o['Notes'] || ''
  })).filter(o => o.item);
}

/* ---------- helpers ---------- */

function getSheetOrThrow_(ss, name) {
  const sh = ss.getSheetByName(name);
  if (!sh) throw new Error('Missing tab: "' + name + '". Check the tab name.');
  return sh;
}

function getRows_(ss, name) {
  const sh = getSheetOrThrow_(ss, name);
  const values = sh.getDataRange().getValues();
  return values.filter(r => r.some(c => (c || '').toString().trim() !== ''));
}

/** Treats first row containing known keys as the header, rest as records. */
function tableToObjects_(ss, name) {
  const rows = getRows_(ss, name);
  if (rows.length < 2) return [];
  let headerIdx = rows.findIndex(r =>
    r.some(c => /include\?|checklist item|field|image type|nav #/i.test((c || '').toString()))
  );
  if (headerIdx === -1) headerIdx = 0;
  const headers = rows[headerIdx].map(h => (h || '').toString().trim());
  const out = [];
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const r = rows[i];
    const obj = {};
    let hasData = false;
    headers.forEach((h, c) => {
      if (!h) return;
      const v = (r[c] || '').toString().trim();
      obj[h] = v;
      if (v) hasData = true;
    });
    if (hasData) out.push(obj);
  }
  return out;
}

function yes_(v) { return (v || '').toString().trim().toLowerCase() === 'yes'; }
function num_(v) { const n = parseInt(v, 10); return isNaN(n) ? 9999 : n; }

/* ---------- web-app endpoint ---------- */

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify(getNewsletterData()))
    .setMimeType(ContentService.MimeType.JSON);
}
