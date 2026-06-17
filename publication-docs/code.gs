/**
 * Field Notes — Google Apps Script backend
 * ----------------------------------------------------------------------------
 * Converts a Drive folder full of Google Docs into a JSON feed that the
 * static site (index.html + article.html) consumes.
 *
 * DATA FLOW:
 *   Google Docs (in one Drive folder)  ->  this Apps Script (docToHtml_)
 *   ->  getPublication() builds JSON   ->  doGet() serves it as a Web App
 *   ->  index.html / article.html fetch the /exec URL.
 *
 * AUTHORING CONVENTION (top of each Doc, one per line, before the body):
 *   Category: Strategy
 *   Byline: Dana Okafor          (or "Author:")
 *   Date: 2026-05-28
 *   Excerpt: A one-sentence teaser shown on the home page.
 *   Featured: true               (only one Doc should be featured)
 * These leading lines are parsed into fields and stripped from the body.
 * The article title is the first Heading 1 in the Doc, or the Doc's name.
 * The slug/id is derived from the Doc name.
 *
 * QUICK SETUP (see setup.md for the full walkthrough):
 *   1. Put your article Docs in one Drive folder.
 *   2. Paste this file into a new Apps Script project (script.google.com).
 *   3. Set FOLDER_ID and the publication constants below.
 *   4. Run getPublication() once and approve the Drive + Docs permissions.
 *   5. Deploy > New deployment > Web app > Execute as: Me > Who has access:
 *      Anyone. Copy the /exec URL.
 *   6. Paste that URL into WEB_APP_URL in BOTH index.html and article.html.
 *
 * ----------------------------------------------------------------------------
 * Attribution: CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
 * Miguel Guhlin  ·  mguhlin@tcea.org  ·  https://mguhlin.org
 * https://go.mgpd.org/lftx2606
 * ----------------------------------------------------------------------------
 */

// ===== CONFIG ===============================================================
const FOLDER_ID = 'PASTE_DRIVE_FOLDER_ID_HERE';
const PUBLICATION_TITLE = 'Field Notes';
const TAGLINE = 'Practical ideas for educators and teams who do the work';
const ISSUE_LABEL = 'Vol. 3, Issue 2';
// ===========================================================================


/**
 * ONE-CLICK SETUP. Run this once to create a Drive folder and three sample article
 * Google Docs (using the authoring convention), so you skip building them by hand.
 * It logs the new folder's URL and FOLDER_ID — paste that ID into FOLDER_ID above,
 * then deploy as a Web App.
 *
 * (Easiest path: new project at script.google.com, paste this whole file,
 *  Run createPublicationTemplate, approve permissions, copy the logged FOLDER_ID.)
 */
function createPublicationTemplate() {
  const folder = DriveApp.createFolder('Field Notes — Articles');

  const samples = [
    {
      name: 'Welcome to Field Notes',
      meta: ['Category: Editorial', 'Byline: The Editors', 'Date: 2026-06-10',
             'Excerpt: Why we built this publication and what to expect each issue.',
             'Featured: true'],
      title: 'Welcome to Field Notes',
      blocks: [
        ['h2', 'A calmer way to share ideas'],
        ['p', 'Field Notes collects practical ideas for educators and teams who do the work. Each article is short, original, and ready to use.'],
        ['h2', 'What you will find'],
        ['ul', ['One big idea per piece', 'A clear why-it-matters', 'Steps you can try this week']],
        ['p', 'Write each article as a Google Doc in this folder and it appears here automatically.']
      ]
    },
    {
      name: 'Designing Workflows That Last',
      meta: ['Category: Strategy', 'Byline: Dana Okafor', 'Date: 2026-06-05',
             'Excerpt: Map the loop before you adopt the tool.'],
      title: 'Designing Workflows That Last',
      blocks: [
        ['h2', 'Start with the loop'],
        ['p', 'Name the workflow a tool is meant to serve before adopting it. The loop makes the right choice obvious.'],
        ['h3', 'Three steps'],
        ['ul', ['Draw the current workflow on one page', 'Find the biggest time leak', 'Pilot one change for two weeks']]
      ]
    },
    {
      name: 'Summaries People Trust',
      meta: ['Category: Craft', 'Byline: Priya Nandakumar', 'Date: 2026-05-28',
             'Excerpt: Transparency is what makes a summary useful.'],
      title: 'Summaries People Trust',
      blocks: [
        ['h2', 'Link first, summarize second'],
        ['p', 'A summary earns trust when readers can verify it in seconds. Always link the original source.'],
        ['p', 'Keep it short enough that readers still want the full piece.']
      ]
    }
  ];

  samples.forEach(function (s) {
    const doc = DocumentApp.create(s.name);
    const body = doc.getBody();
    s.meta.forEach(function (line) { body.appendParagraph(line); });
    body.appendParagraph(s.title).setHeading(DocumentApp.ParagraphHeading.HEADING1);
    s.blocks.forEach(function (b) {
      if (b[0] === 'h2') body.appendParagraph(b[1]).setHeading(DocumentApp.ParagraphHeading.HEADING2);
      else if (b[0] === 'h3') body.appendParagraph(b[1]).setHeading(DocumentApp.ParagraphHeading.HEADING3);
      else if (b[0] === 'ul') b[1].forEach(function (li) { body.appendListItem(li); });
      else body.appendParagraph(b[1]);
    });
    doc.saveAndClose();
    DriveApp.getFileById(doc.getId()).moveTo(folder);   // move from root into the folder
  });

  const url = folder.getUrl(), id = folder.getId();
  Logger.log('Publication folder created with 3 sample articles.\nURL: ' + url +
             '\nFOLDER_ID: ' + id + '\n\nPaste the FOLDER_ID into the constant at the top of this file.');
  return { url: url, id: id };
}


/**
 * Web App entry point. Returns the publication as JSON.
 */
function doGet() {
  const data = getPublication();
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}


/**
 * Builds the publication object from every Google Doc in FOLDER_ID.
 * Returns { meta:{title,tagline,issue}, articles:[...] } sorted featured-first
 * then by date descending.
 */
function getPublication() {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const files = folder.getFilesByType(MimeType.GOOGLE_DOCS);

  const articles = [];
  const usedSlugs = {};

  while (files.hasNext()) {
    const file = files.next();
    try {
      const article = buildArticle_(file, usedSlugs);
      if (article) articles.push(article);
    } catch (err) {
      // Skip a Doc that fails to parse rather than breaking the whole feed.
      Logger.log('Skipping "' + file.getName() + '": ' + err);
    }
  }

  articles.sort(function (a, b) {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;   // featured first
    return (b.date || '').localeCompare(a.date || '');           // newest first
  });

  return {
    meta: {
      title: PUBLICATION_TITLE,
      tagline: TAGLINE,
      issue: ISSUE_LABEL
    },
    articles: articles
  };
}


/**
 * Converts a single Doc file into an article object.
 */
function buildArticle_(file, usedSlugs) {
  const docName = file.getName();
  const doc = DocumentApp.openById(file.getId());
  const body = doc.getBody();

  const parsed = docToHtml_(body);           // { meta, bodyHtml, firstHeading }
  const meta = parsed.meta;

  const title = parsed.firstHeading || docName;
  const slug = makeSlug_(docName, usedSlugs);

  const words = body.getText().split(/\s+/).filter(String).length;
  const readingMinutes = Math.max(1, Math.round(words / 200));

  return {
    id: slug,
    slug: slug,
    title: title,
    category: meta.category || 'Article',
    byline: meta.byline || 'Staff',
    date: meta.date || formatDate_(file.getDateCreated()),
    excerpt: meta.excerpt || autoExcerpt_(body),
    featured: meta.featured === true,
    readingMinutes: readingMinutes,
    bodyHtml: parsed.bodyHtml
  };
}


/**
 * Walks the Doc body and converts it to clean HTML.
 * - Leading metadata lines (Category:/Byline:/Author:/Date:/Excerpt:/Featured:)
 *   are parsed into meta and stripped from the output.
 * - HEADING1 -> h2, HEADING2 -> h3, HEADING3 -> h4, NORMAL -> p.
 * - List items are grouped into <ul>...</ul>.
 * - The first Heading 1 is captured as the article title.
 *
 * Returns { meta, bodyHtml, firstHeading }.
 */
function docToHtml_(body) {
  const meta = {};
  let firstHeading = '';
  const parts = [];
  let listOpen = false;
  let readingMeta = true; // only parse metadata lines at the very top

  const metaRe = /^(Category|Byline|Author|Date|Excerpt|Featured)\s*:\s*(.*)$/i;
  const num = body.getNumChildren();

  for (let i = 0; i < num; i++) {
    const child = body.getChild(i);
    const type = child.getType();

    if (type === DocumentApp.ElementType.LIST_ITEM) {
      readingMeta = false;
      if (!listOpen) { parts.push('<ul>'); listOpen = true; }
      parts.push('<li>' + escapeHtml_(child.getText()) + '</li>');
      continue;
    }

    // Close any open list before a non-list element.
    if (listOpen) { parts.push('</ul>'); listOpen = false; }

    if (type !== DocumentApp.ElementType.PARAGRAPH) {
      continue; // ignore tables, images-as-objects, etc. for this simple converter
    }

    const para = child.asParagraph();
    const text = para.getText();
    const heading = para.getHeading();

    // Parse leading metadata lines (only while still at the top of the doc).
    if (readingMeta && heading === DocumentApp.ParagraphHeading.NORMAL) {
      if (text.trim() === '') { continue; } // skip blank lines at top
      const m = text.match(metaRe);
      if (m) {
        applyMeta_(meta, m[1], m[2]);
        continue; // strip from body
      }
      readingMeta = false; // first real content line ends the metadata block
    }

    if (text.trim() === '' && heading === DocumentApp.ParagraphHeading.NORMAL) {
      continue; // skip empty paragraphs in body
    }

    switch (heading) {
      case DocumentApp.ParagraphHeading.HEADING1:
        if (!firstHeading) { firstHeading = text; }   // becomes the title
        else { parts.push('<h2>' + escapeHtml_(text) + '</h2>'); }
        break;
      case DocumentApp.ParagraphHeading.HEADING2:
        parts.push('<h3>' + escapeHtml_(text) + '</h3>');
        break;
      case DocumentApp.ParagraphHeading.HEADING3:
        parts.push('<h4>' + escapeHtml_(text) + '</h4>');
        break;
      default:
        parts.push('<p>' + escapeHtml_(text) + '</p>');
    }
    readingMeta = false;
  }

  if (listOpen) { parts.push('</ul>'); }

  return { meta: meta, bodyHtml: parts.join(''), firstHeading: firstHeading };
}


/**
 * Stores one parsed metadata key/value into the meta object.
 */
function applyMeta_(meta, key, value) {
  key = key.toLowerCase();
  value = (value || '').trim();
  if (key === 'category') meta.category = value;
  else if (key === 'byline' || key === 'author') meta.byline = value;
  else if (key === 'date') meta.date = value;
  else if (key === 'excerpt') meta.excerpt = value;
  else if (key === 'featured') meta.featured = /^(true|yes|y|1)$/i.test(value);
}


/**
 * Falls back to the first sentence-ish chunk of the body for the excerpt.
 */
function autoExcerpt_(body) {
  const text = body.getText().replace(/\s+/g, ' ').trim();
  if (text.length <= 160) return text;
  return text.slice(0, 157).replace(/\s+\S*$/, '') + '...';
}


/**
 * Turns a Doc name into a URL-safe slug, ensuring uniqueness.
 */
function makeSlug_(name, usedSlugs) {
  let base = name.toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')  // strip any extension
    .replace(/[^a-z0-9]+/g, '-')   // non-alphanumerics -> hyphen
    .replace(/^-+|-+$/g, '');      // trim hyphens
  if (!base) base = 'article';
  let slug = base;
  let n = 2;
  while (usedSlugs[slug]) { slug = base + '-' + n; n++; }
  usedSlugs[slug] = true;
  return slug;
}


/**
 * Formats a Date as YYYY-MM-DD in the script's timezone.
 */
function formatDate_(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}


/**
 * Minimal HTML escaping for text pulled from the Doc.
 */
function escapeHtml_(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
