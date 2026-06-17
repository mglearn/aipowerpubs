/**
 * export.js — a tiny "Copy bar" for finished publications.
 * Adds three buttons: Copy Markdown, Copy HTML, Copy for Email.
 *
 *   ExportBar.mount({
 *     mount: '#exportbar',                 // element or selector to fill
 *     getMarkdown: () => "..markdown..",   // called on click
 *     getHtml:     () => "..clean html..", // semantic HTML of the finished piece
 *     emailMaxWidth: 600                    // optional
 *   });
 *
 * - "Copy Markdown" copies the Markdown source (plain text).
 * - "Copy HTML" copies the clean HTML source (plain text).
 * - "Copy for Email" copies inline-styled HTML as BOTH rich text (paste into
 *   Gmail/Outlook → formatted) AND plain source (paste into Mailchimp/an HTML box).
 *
 * No dependencies. Works on any of these pages by including:
 *   <script src="export.js"></script>
 *
 * CC BY-SA 4.0 — Miguel Guhlin (mguhlin@tcea.org | mguhlin.org | https://go.mgpd.org/lftx2606)
 */
(function () {
  // ---- clipboard helpers ----
  function copyPlain(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta);
        resolve();
      } catch (e) { reject(e); }
    });
  }

  function copyRich(html) {
    // Put the inline-styled HTML on the clipboard as both html and plain text.
    if (navigator.clipboard && window.ClipboardItem) {
      try {
        var item = new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([html], { type: 'text/plain' })
        });
        return navigator.clipboard.write([item]);
      } catch (e) { /* fall through */ }
    }
    return copyPlain(html); // fallback: at least copy the source
  }

  // ---- email-safe inlining: walk the HTML and set per-tag inline styles ----
  var STYLE = {
    H1: 'margin:0 0 16px;font-family:Georgia,"Times New Roman",serif;color:#002855;font-size:26px;line-height:1.25;',
    H2: 'margin:28px 0 8px;font-family:Georgia,"Times New Roman",serif;color:#002855;font-size:21px;line-height:1.3;',
    H3: 'margin:20px 0 6px;font-family:Arial,Helvetica,sans-serif;color:#003b7a;font-size:13px;letter-spacing:.5px;text-transform:uppercase;font-weight:700;',
    H4: 'margin:16px 0 6px;color:#003b7a;font-size:15px;',
    P:  'margin:0 0 14px;font-size:16px;line-height:1.6;color:#1a2230;',
    A:  'color:#003b7a;',
    UL: 'margin:0 0 14px;padding-left:22px;',
    OL: 'margin:0 0 14px;padding-left:22px;',
    LI: 'margin:6px 0;font-size:16px;line-height:1.6;color:#1a2230;',
    BLOCKQUOTE: 'margin:16px 0;padding:10px 18px;border-left:4px solid #FFB81C;background:#f0f4fa;color:#33405a;',
    HR: 'border:0;border-top:1px solid #e2e8f0;margin:24px 0;',
    IMG: 'max-width:100%;height:auto;border-radius:6px;',
    TABLE: 'border-collapse:collapse;width:100%;margin:14px 0;',
    TH: 'border:1px solid #e2e8f0;padding:8px 10px;background:#002855;color:#ffffff;text-align:left;',
    TD: 'border:1px solid #e2e8f0;padding:8px 10px;text-align:left;vertical-align:top;'
  };

  function inlineEmailStyles(html, maxWidth) {
    maxWidth = maxWidth || 600;
    var doc = new DOMParser().parseFromString('<div id="__r">' + html + '</div>', 'text/html');
    var root = doc.getElementById('__r');
    var all = root.getElementsByTagName('*');
    for (var i = 0; i < all.length; i++) {
      var el = all[i], s = STYLE[el.tagName];
      if (s) el.setAttribute('style', s + (el.getAttribute('style') || ''));
    }
    return '<div style="max-width:' + maxWidth + 'px;margin:0 auto;padding:24px;' +
      'font-family:Arial,Helvetica,sans-serif;color:#1a2230;background:#ffffff;">' +
      root.innerHTML + '</div>';
  }

  // ---- UI ----
  var injected = false;
  function injectStyle() {
    if (injected) return; injected = true;
    var css =
      '.xbar{display:flex;flex-wrap:wrap;align-items:center;gap:8px;max-width:860px;margin:18px auto 0;' +
      'padding:10px 14px;background:#fff;border:1px solid #e2e8f0;border-left:5px solid #FFB81C;' +
      'border-radius:10px;box-shadow:0 2px 10px rgba(0,40,85,.06);font-family:"Source Sans 3",Arial,sans-serif;}' +
      '.xbar .xlabel{font-weight:700;color:#002855;margin-right:4px;font-size:.9rem;}' +
      '.xbar button{cursor:pointer;border:1.5px solid #002855;background:#002855;color:#fff;font-weight:700;' +
      'border-radius:8px;padding:7px 13px;font-size:.85rem;}' +
      '.xbar button:hover{background:#003b7a;border-color:#003b7a;}' +
      '.xbar button.alt{background:#fff;color:#002855;}' +
      '.xbar button.alt:hover{border-color:#d99a00;color:#d99a00;}' +
      '.xbar .xnote{color:#5a6577;font-size:.8rem;flex-basis:100%;}' +
      '.xtoast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);background:#002855;color:#fff;' +
      'padding:10px 18px;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,.25);font-family:Arial,sans-serif;' +
      'font-weight:700;opacity:0;transition:opacity .2s;z-index:9999;pointer-events:none;}' +
      '.xtoast.show{opacity:1;}' +
      '@media print{.xbar{display:none;}}';
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  }

  var toastEl;
  function toast(msg, ok) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'xtoast'; document.body.appendChild(toastEl); }
    toastEl.textContent = (ok === false ? '⚠ ' : '✓ ') + msg;
    toastEl.style.background = ok === false ? '#a33' : '#002855';
    toastEl.classList.add('show');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove('show'); }, 1800);
  }

  function btn(label, cls, fn) {
    var b = document.createElement('button');
    b.type = 'button'; b.textContent = label; if (cls) b.className = cls;
    b.addEventListener('click', fn); return b;
  }

  function mount(opts) {
    injectStyle();
    var host = typeof opts.mount === 'string' ? document.querySelector(opts.mount) : opts.mount;
    if (!host) return;
    host.innerHTML = '';
    var bar = document.createElement('div'); bar.className = 'xbar';

    var label = document.createElement('span');
    label.className = 'xlabel'; label.textContent = '📋 Copy this ' + (opts.label || 'issue') + ':';
    bar.appendChild(label);

    if (opts.getMarkdown) {
      bar.appendChild(btn('Markdown', null, function () {
        Promise.resolve(opts.getMarkdown()).then(copyPlain)
          .then(function () { toast('Markdown copied'); })
          .catch(function () { toast('Copy failed', false); });
      }));
    }
    if (opts.getHtml) {
      bar.appendChild(btn('HTML', null, function () {
        Promise.resolve(opts.getHtml()).then(copyPlain)
          .then(function () { toast('HTML copied'); })
          .catch(function () { toast('Copy failed', false); });
      }));
      bar.appendChild(btn('✉️ For Email', 'alt', function () {
        Promise.resolve(opts.getHtml()).then(function (h) {
          return copyRich(inlineEmailStyles(h, opts.emailMaxWidth));
        }).then(function () { toast('Email HTML copied — paste into Gmail or your email tool'); })
          .catch(function () { toast('Copy failed', false); });
      }));
    }

    var note = document.createElement('span');
    note.className = 'xnote';
    note.innerHTML = '<b>Markdown</b> = source for docs · <b>HTML</b> = source for a website/CMS · ' +
      '<b>For Email</b> = paste into Gmail/Outlook (formatted) or a Mailchimp HTML box (source).';
    bar.appendChild(note);

    host.appendChild(bar);
  }

  window.ExportBar = { mount: mount, inlineEmailStyles: inlineEmailStyles };
})();
