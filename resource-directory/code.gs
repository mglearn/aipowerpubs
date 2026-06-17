/**
 * Resource Directory — Google Apps Script Web App backend
 * ------------------------------------------------------------------
 * Reads a Google Sheet tab named "Resources" and serves it as JSON
 * for the front-end directory (index.html).
 *
 * SETUP (see setup.md for the full walkthrough):
 *   1. Create a Google Sheet with a tab named exactly: Resources
 *   2. Add these header columns in the first row (any order):
 *        Title | URL | Category | Tags | Description | Level |
 *        Rating | Featured | Added | Include
 *      - Tags: comma-separated, e.g.  writing, reference, free
 *      - Featured: Yes / No
 *      - Added: a date (e.g. 2026-05-28)
 *      - Include: Yes / No   (blank counts as Yes)
 *   3. Extensions > Apps Script. Paste this file.
 *   4. Set SHEET_ID below to your Sheet's ID (from its URL).
 *   5. Run getResources() once and authorize the script.
 *   6. Deploy > New deployment > Web app:
 *        Execute as: Me
 *        Who has access: Anyone
 *      Copy the /exec URL and paste it into WEB_APP_URL in index.html.
 *
 * Attribution: CC BY-SA 4.0 · Miguel Guhlin
 *   mguhlin@tcea.org · https://mguhlin.org · https://go.mgpd.org/lftx2606
 * ------------------------------------------------------------------
 */

const SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';
const SHEET_TAB = 'Resources';

/**
 * ONE-CLICK SETUP. Run this once to create a ready-to-use Google Sheet named
 * "Resource Directory" with a "Resources" tab, the correct header row, and a
 * handful of sample resources. It logs the new file's URL and ID — paste that
 * ID into the SHEET_ID constant above, then deploy this script as a Web App.
 *
 * (Easiest path: open a new project at script.google.com, paste this whole file,
 *  Run createDirectoryTemplate, approve permissions, copy the logged ID.)
 */
function createDirectoryTemplate() {
  var ss = SpreadsheetApp.create('Resource Directory');

  var sheet = ss.getActiveSheet().setName(SHEET_TAB);

  // Header row — must match the column names getResources() reads.
  var headers = ['Title', 'URL', 'Category', 'Tags', 'Description',
                 'Level', 'Rating', 'Featured', 'Added', 'Include'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Sample rows (Tags comma-separated; varied Level/Rating; some Featured=Yes).
  var rows = [
    ['Markdown Cheat Sheet', 'https://example.org/markdown-cheatsheet', 'Guides',
     'writing, reference, formatting',
     'A one-page reference covering headings, lists, links, tables, and code blocks in Markdown.',
     'Beginner', 4.6, 'Yes', '2026-05-28', 'Yes'],
    ['Open Source Diagram Maker', 'https://example.org/diagram-maker', 'Tools',
     'diagrams, visuals, free',
     'Browser-based tool for flowcharts, mind maps, and network diagrams with export to PNG and SVG.',
     'Beginner', 4.8, 'Yes', '2026-06-02', 'Yes'],
    ['Intro to Data Analysis', 'https://example.org/data-analysis-course', 'Courses',
     'data, spreadsheets, analytics',
     'A self-paced course teaching the fundamentals of cleaning, summarizing, and charting data.',
     'Intermediate', 4.4, 'No', '2026-04-15', 'Yes'],
    ['Lesson Plan Template Pack', 'https://example.org/lesson-plan-templates', 'Templates',
     'teaching, planning, printable',
     'A bundle of editable lesson plan templates for daily, weekly, and unit planning.',
     'Beginner', 4.2, 'No', '2026-03-22', 'Yes'],
    ['Educators Discussion Forum', 'https://example.org/educators-forum', 'Communities',
     'teaching, networking, support',
     'An active community where educators share strategies, ask questions, and trade resources.',
     'Beginner', 4.5, 'No', '2026-05-10', 'Yes'],
    ['Color Palette Generator', 'https://example.org/color-palette', 'Tools',
     'design, visuals, accessibility',
     'Generate accessible, high-contrast color palettes for slides, sites, and print materials.',
     'Beginner', 4.7, 'Yes', '2026-06-08', 'Yes'],
    ['Accessibility Checklist', 'https://example.org/accessibility-checklist', 'Guides',
     'accessibility, reference, inclusion',
     'A practical checklist for making documents, slides, and websites accessible to everyone.',
     'Intermediate', 4.9, 'Yes', '2026-06-12', 'Yes'],
    ['Web Development Bootcamp', 'https://example.org/webdev-bootcamp', 'Courses',
     'coding, web, productivity',
     'A hands-on bootcamp covering HTML, CSS, and JavaScript through real projects.',
     'Advanced', 4.6, 'Yes', '2026-06-14', 'Yes']
  ];
  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);

  // Style the header row and freeze it.
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#002855')
    .setFontColor('#ffffff');
  sheet.setFrozenRows(1);

  var url = ss.getUrl(), id = ss.getId();
  Logger.log('Resource Directory Sheet created.\nURL: ' + url + '\nSHEET_ID: ' + id +
             '\n\nPaste the SHEET_ID into the constant at the top of this file.');
  return { url: url, id: id };
}

/**
 * Web entry point. Returns the directory payload as JSON.
 */
function doGet() {
  var payload;
  try {
    payload = getResources();
  } catch (err) {
    payload = { resources: [], categories: [], tags: [], meta: { error: String(err) } };
  }
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Build the directory payload from the Resources tab.
 * Shape:
 *   {
 *     resources: [ { title, url, category, tags:[...], description,
 *                    level, rating, featured:bool, added } ],
 *     categories: [ ...unique sorted... ],
 *     tags:       [ ...unique sorted... ],
 *     meta:       { updated }
 *   }
 */
function getResources() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_TAB);
  if (!sheet) {
    throw new Error('Sheet tab "' + SHEET_TAB + '" not found. Rename your tab to ' + SHEET_TAB + '.');
  }

  var rows = getRows_(sheet);
  var objects = tableToObjects_(rows);

  var resources = [];
  var categorySet = {};
  var tagSet = {};

  for (var i = 0; i < objects.length; i++) {
    var row = objects[i];

    // Include: Yes (or blank) = included; anything else = skipped.
    var include = String(row['Include'] == null ? '' : row['Include']).trim().toLowerCase();
    if (include && include !== 'yes' && include !== 'true' && include !== '1' && include !== 'y') {
      continue;
    }

    var title = clean_(row['Title']);
    if (!title) continue; // skip rows with no title

    var category = clean_(row['Category']);
    var tags = parseTags_(row['Tags']);
    var featured = parseBool_(row['Featured']);
    var rating = parseNumber_(row['Rating']);

    var resource = {
      title: title,
      url: clean_(row['URL']),
      category: category,
      tags: tags,
      description: clean_(row['Description']),
      level: clean_(row['Level']),
      rating: rating,
      featured: featured,
      added: parseDate_(row['Added'])
    };
    resources.push(resource);

    if (category) categorySet[category] = true;
    for (var t = 0; t < tags.length; t++) tagSet[tags[t]] = true;
  }

  return {
    resources: resources,
    categories: Object.keys(categorySet).sort(localeSort_),
    tags: Object.keys(tagSet).sort(localeSort_),
    meta: { updated: new Date().toISOString() }
  };
}

/* ============================================================
   Helpers
   ============================================================ */

/**
 * Return all rows as a 2D array, dropping fully empty trailing rows.
 */
function getRows_(sheet) {
  var values = sheet.getDataRange().getValues();
  var rows = [];
  for (var i = 0; i < values.length; i++) {
    if (isEmptyRow_(values[i])) continue;
    rows.push(values[i]);
  }
  return rows;
}

/**
 * Convert a 2D array to objects. The first non-empty row is the header.
 */
function tableToObjects_(rows) {
  if (!rows.length) return [];
  var headers = rows[0].map(function (h) { return String(h).trim(); });
  var out = [];
  for (var r = 1; r < rows.length; r++) {
    var obj = {};
    for (var c = 0; c < headers.length; c++) {
      if (!headers[c]) continue;
      obj[headers[c]] = rows[r][c];
    }
    out.push(obj);
  }
  return out;
}

function isEmptyRow_(row) {
  for (var i = 0; i < row.length; i++) {
    if (String(row[i]).trim() !== '') return false;
  }
  return true;
}

function clean_(v) {
  return v == null ? '' : String(v).trim();
}

function parseTags_(v) {
  if (v == null || String(v).trim() === '') return [];
  return String(v)
    .split(',')
    .map(function (t) { return t.trim(); })
    .filter(function (t) { return t.length > 0; });
}

function parseBool_(v) {
  var s = String(v == null ? '' : v).trim().toLowerCase();
  return s === 'yes' || s === 'true' || s === '1' || s === 'y';
}

function parseNumber_(v) {
  if (v == null || String(v).trim() === '') return null;
  var n = Number(v);
  return isNaN(n) ? null : n;
}

/**
 * Normalize an Added value to an ISO date string (YYYY-MM-DD).
 */
function parseDate_(v) {
  if (v == null || String(v).trim() === '') return '';
  if (Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v)) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  var d = new Date(v);
  if (!isNaN(d)) {
    return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(v).trim();
}

function localeSort_(a, b) {
  return String(a).toLowerCase().localeCompare(String(b).toLowerCase());
}
