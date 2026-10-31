/* ==========================================================================
   My House · wiring budget behaviour
   Reads window.WIRING from wiring-data.js. No libraries.
   1 data and state   2 cards   3 money bar and progress   4 list   5 check the paper   6 viewer   7 view, print, scroll   8 start
   ========================================================================== */
(function () {
  'use strict';

  var W = window.WIRING;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var fmt = function (n) { return Math.round(n).toLocaleString('en-US'); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ICON = {
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    flag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 2.8 20h18.4zM12 10v4.5M12 17.3v.01"/></svg>',
    zoom: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2M11 8v6M8 11h6"/></svg>'
  };

  // 1 · data and state -------------------------------------------------------
  var items = W.items;
  var byNo = {};
  items.forEach(function (it) {
    it.thumb = 'images/wiring/thumbs/' + it.file + '.webp';
    it.img = 'images/wiring/' + it.file + '.webp';
    byNo[it.no] = it;
  });

  var KEY = 'house.wiring.v1';
  var state = { bought: [], fixes: {}, view: 'cards' };
  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved) {
      state.bought = Array.isArray(saved.bought) ? saved.bought : [];
      state.fixes = saved.fixes && typeof saved.fixes === 'object' ? saved.fixes : {};
      state.view = saved.view === 'list' ? 'list' : 'cards';
    }
  } catch (e) {}
  function store() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  function lineTotal(it) { return state.fixes[it.no] != null ? state.fixes[it.no] : it.total; }
  function each(it) { return lineTotal(it) / it.qty; }
  function groupTotal(id) { return items.filter(function (it) { return it.group === id; }).reduce(function (s, it) { return s + lineTotal(it); }, 0); }
  function grandTotal() { return items.reduce(function (s, it) { return s + lineTotal(it); }, 0); }
  function writtenTotal() { return items.reduce(function (s, it) { return s + it.total; }, 0); }
  function isBought(it) { return state.bought.indexOf(it.no) !== -1; }
  function isFixed(it) { return state.fixes[it.no] != null && state.fixes[it.no] !== it.total; }
  function qtyText(it) { return it.qty + ' ' + it.unit; }

  // 2 · cards ------------------------------------------------------------------
  function cardHTML(it) {
    var grand = grandTotal();
    var share = lineTotal(it) / grand * 100;
    return '' +
      '<article class="item reveal' + (isBought(it) ? ' is-bought' : '') + (it.check ? ' is-check' : '') + '" id="item-' + it.no + '" data-no="' + it.no + '">' +
        '<button class="pic" type="button" data-open="' + it.no + '" aria-label="Open the photo of ' + esc(it.name) + '">' +
          '<img src="' + it.thumb + '" alt="' + esc(it.name + ', ' + it.spec) + '" loading="lazy" width="520" height="520">' +
          '<span class="zoom">' + ICON.zoom + '</span>' +
        '</button>' +
        '<span class="no">' + pad(it.no) + '</span>' +
        (it.check ? '<span class="flag" title="Hard to read on the paper">' + ICON.flag + 'Check</span>' : '') +
        '<span class="stamp" aria-hidden="true">Bought</span>' +
        '<div class="body">' +
          '<h3><i class="dot" style="background:' + it.swatch + '"></i>' + esc(it.name) + '</h3>' +
          '<p class="spec">' + esc(it.spec) + '</p>' +
          '<p class="what">' + esc(it.what) +
            (it.link ? ' <a href="' + it.link.href + '">' + esc(it.link.text) + ' →</a>' : '') + '</p>' +
          '<dl class="nums">' +
            '<div><dt>Qty</dt><dd>' + esc(qtyText(it)) + '</dd></div>' +
            '<div><dt>Each</dt><dd>' + fmt(each(it)) + '</dd></div>' +
            '<div class="tot"><dt>Total</dt><dd>' + fmt(lineTotal(it)) + (isFixed(it) ? '<s>' + fmt(it.total) + '</s>' : '') + '</dd></div>' +
          '</dl>' +
          '<div class="share" title="' + share.toFixed(1) + '% of the budget"><span style="width:' + Math.max(share, .8).toFixed(2) + '%;background:' + it.swatch + '"></span></div>' +
          '<div class="foot-row">' +
            '<small>' + share.toFixed(1) + '% of the budget</small>' +
            '<button class="buy" type="button" data-buy="' + it.no + '" aria-pressed="' + isBought(it) + '">' + ICON.check + '<span>' + (isBought(it) ? 'Bought' : 'Mark bought') + '</span></button>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function renderGroups() {
    var grand = grandTotal();
    $('#groups').innerHTML = W.groups.map(function (g, gi) {
      var list = items.filter(function (it) { return it.group === g.id; });
      var sub = groupTotal(g.id);
      return '' +
        '<section class="group" id="' + g.id + '" aria-labelledby="h-' + g.id + '">' +
          '<header class="group-head">' +
            '<div>' +
              '<p class="eyebrow">Part ' + (gi + 1) + ' · ' + list.length + ' items</p>' +
              '<h2 id="h-' + g.id + '">' + esc(g.label) + '</h2>' +
              '<p class="note">' + esc(g.note) + '</p>' +
            '</div>' +
            '<div class="sub">' +
              '<span>Subtotal</span><b>' + fmt(sub) + '</b>' +
              '<em>' + (sub / grand * 100).toFixed(0) + '% of the total</em>' +
            '</div>' +
          '</header>' +
          '<div class="items">' + list.map(cardHTML).join('') + '</div>' +
        '</section>';
    }).join('');
    observeReveal();
  }

  // 3 · money bar and progress ------------------------------------------------
  function renderSpend() {
    var grand = grandTotal();
    $('#spendBar').innerHTML = items.map(function (it) {
      var pct = lineTotal(it) / grand * 100;
      return '<button type="button" class="seg-i" data-seg="' + it.no + '" style="flex-grow:' + lineTotal(it) + ';background:' + it.swatch + '" ' +
        'aria-label="' + esc(pad(it.no) + ' ' + it.name + ', ' + fmt(lineTotal(it)) + ' UGX, ' + pct.toFixed(1) + ' percent') + '"></button>';
    }).join('');
    $('#spendLegend').innerHTML = W.groups.map(function (g) {
      return '<span><i class="' + g.id + '"></i>' + g.short + ' ' + (groupTotal(g.id) / grand * 100).toFixed(0) + '%</span>';
    }).join('');
  }

  function spendHint(no) {
    var hint = $('#spendHint');
    $$('.item.hot').forEach(function (c) { c.classList.remove('hot'); });
    if (!no) { hint.textContent = 'Point at a segment to see the item'; hint.classList.remove('on'); return; }
    var it = byNo[no];
    hint.innerHTML = '<b>' + pad(it.no) + ' ' + esc(it.name) + '</b> · ' + fmt(lineTotal(it)) + ' · ' + (lineTotal(it) / grandTotal() * 100).toFixed(1) + '%';
    hint.classList.add('on');
    var card = $('#item-' + no);
    if (card) card.classList.add('hot');
  }

  function renderBought() {
    var done = items.filter(isBought);
    var spent = done.reduce(function (s, it) { return s + lineTotal(it); }, 0);
    var grand = grandTotal();
    var pct = grand ? Math.round(spent / grand * 100) : 0;
    $('#boughtRing').style.setProperty('--p', pct);
    $('#boughtPct').textContent = pct + '%';
    if (!done.length) {
      $('#boughtCount').textContent = 'Nothing bought yet';
      $('#boughtMoney').textContent = 'Tick items as they arrive on site';
    } else {
      $('#boughtCount').textContent = done.length === items.length ? 'Everything is bought' : 'Bought ' + done.length + ' of ' + items.length + ' items';
      $('#boughtMoney').textContent = fmt(spent) + ' spent · ' + fmt(grand - spent) + ' still to buy';
    }
    $('#boughtReset').hidden = !done.length;
  }

  function renderTotals(animate) {
    var grand = grandTotal();
    var fixed = items.some(isFixed);
    if (animate && !reduceMotion) countUp($('#grand'), grand); else $('#grand').textContent = fmt(grand);
    $('#grandNote').textContent = items.length + ' items · ' + (fixed ? 'with your corrections' : 'figures as written');
    $('#grandNote').classList.toggle('fixed', fixed);
    $('#footCount').textContent = items.length + ' items · UGX ' + fmt(grand);
  }

  function countUp(el, to) {
    var start = null, dur = 1100;
    function step(t) {
      if (!start) start = t;
      var k = Math.min(1, (t - start) / dur);
      el.textContent = fmt(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // 4 · list (receipt) ----------------------------------------------------------
  function renderReceipt() {
    var rows = '';
    W.groups.forEach(function (g) {
      rows += '<tr class="grp"><td colspan="5">' + esc(g.label) + '</td></tr>';
      items.filter(function (it) { return it.group === g.id; }).forEach(function (it) {
        rows += '<tr class="' + (isBought(it) ? 'is-bought' : '') + '">' +
          '<td class="n">' + it.no + '</td>' +
          '<td><span class="li"><img src="' + it.thumb + '" alt="" loading="lazy"><span>' + esc(it.name) +
            (it.check ? ' <i class="warn" title="' + esc(it.check) + '">⚠</i>' : '') +
            (isBought(it) ? ' <i class="ok">bought</i>' : '') + '<small>' + esc(it.spec) + '</small></span></span></td>' +
          '<td>' + esc(qtyText(it)) + '</td>' +
          '<td class="r">' + fmt(each(it)) + '</td>' +
          '<td class="r b">' + fmt(lineTotal(it)) + '</td></tr>';
      });
      rows += '<tr class="subrow"><td></td><td colspan="3">Subtotal</td><td class="r b">' + fmt(groupTotal(g.id)) + '</td></tr>';
    });
    $('#receiptBody').innerHTML = rows;
    $('#receiptFoot').innerHTML = '<tr><td></td><td colspan="3">Grand total <small>labour and transport excluded</small></td><td class="r">' + fmt(grandTotal()) + '</td></tr>';
  }

  // 5 · check the paper -----------------------------------------------------------
  function renderCheck() {
    var now = grandTotal(), gap = W.paperTotal - now;
    $('#sumWritten').textContent = fmt(writtenTotal());
    $('#sumNow').textContent = fmt(now);
    $('#sumPaper').textContent = fmt(W.paperTotal);
    $('#sumGap').textContent = gap === 0 ? 'Matches' : (gap > 0 ? '+' : '−') + fmt(Math.abs(gap));
    $('#gapBox').classList.toggle('ok', gap === 0);
    $('#resetFix').hidden = !items.some(isFixed);

    $('#cases').innerHTML = items.filter(function (it) { return it.check; }).map(function (it) {
      var cur = lineTotal(it);
      return '' +
        '<article class="case">' +
          '<button class="case-pic" type="button" data-open="' + it.no + '" aria-label="Open the photo of ' + esc(it.name) + '"><img src="' + it.thumb + '" alt=""></button>' +
          '<div>' +
            '<p class="eyebrow">Item ' + it.no + ' · ' + esc(qtyText(it)) + '</p>' +
            '<h3>' + esc(it.name) + '</h3>' +
            '<p>' + esc(it.check) + '</p>' +
            '<div class="opts" role="group" aria-label="Reading for item ' + it.no + '">' +
              it.options.map(function (v, i) {
                return '<button type="button" id="opt-' + it.no + '-' + i + '" data-fix="' + it.no + '" data-val="' + v + '" aria-pressed="' + (cur === v) + '">' +
                  fmt(v) + '<small>' + (v === it.total ? 'as written' : fmt(v / it.qty) + ' each') + '</small></button>';
              }).join('') +
            '</div>' +
          '</div>' +
        '</article>';
    }).join('');
  }

  function setFix(no, val) {
    var it = byNo[no];
    if (val === it.total) delete state.fixes[no]; else state.fixes[no] = val;
    store();
    renderAll();
    var gap = W.paperTotal - grandTotal();
    toast(gap === 0 ? 'The items now match the paper total' : 'Item ' + no + ' set to ' + fmt(val));
  }

  // 6 · viewer -----------------------------------------------------------------------
  var lb = $('#lb'), lbIndex = 0;
  function openViewer(no) {
    lbIndex = items.indexOf(byNo[no]);
    fillViewer();
    if (!lb.open) lb.showModal();
  }
  function fillViewer() {
    var it = items[lbIndex];
    var img = $('#lbImg');
    img.src = it.img; img.alt = it.name + ', ' + it.spec;
    $('#lbNo').textContent = 'Item ' + pad(it.no) + ' · ' + W.groups.filter(function (g) { return g.id === it.group; })[0].short;
    $('#lbName').textContent = it.name;
    $('#lbSpec').textContent = it.spec;
    $('#lbWhat').textContent = it.what;
    $('#lbNums').innerHTML = '<div><dt>Qty</dt><dd>' + esc(qtyText(it)) + '</dd></div><div><dt>Each</dt><dd>' + fmt(each(it)) + '</dd></div><div><dt>Total</dt><dd>' + fmt(lineTotal(it)) + '</dd></div>';
    $('#lbCheck').hidden = !it.check;
    $('#lbCheck').textContent = it.check || '';
    $('#lbSrc').textContent = it.src || hostOf(it.page);
    $('#lbSrc').href = it.page;
    $('#lbCount').textContent = (lbIndex + 1) + ' / ' + items.length;
  }
  function hostOf(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return u; } }
  function step(d) { lbIndex = (lbIndex + d + items.length) % items.length; fillViewer(); }
  $('#lbPrev').addEventListener('click', function () { step(-1); });
  $('#lbNext').addEventListener('click', function () { step(1); });
  $('#lbClose').addEventListener('click', function () { lb.close(); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  // 7 · view, print, scroll ----------------------------------------------------------
  function setView(v) {
    state.view = v; store();
    $('#viewCards').setAttribute('aria-pressed', v === 'cards');
    $('#viewList').setAttribute('aria-pressed', v === 'list');
    $('#groups').hidden = v === 'list';
    $('#receipt').hidden = v !== 'list';
  }
  $('#viewCards').addEventListener('click', function () { setView('cards'); });
  $('#viewList').addEventListener('click', function () { setView('list'); });
  $('#print').addEventListener('click', function () { window.print(); });

  var io = 'IntersectionObserver' in window && !reduceMotion
    ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -40px' })
    : null;
  function observeReveal() {
    $$('.reveal:not(.in)').forEach(function (el) { if (io) io.observe(el); else el.classList.add('in'); });
  }

  var secLinks = $$('.sec-link');
  function onScroll() {
    var h = document.documentElement;
    var k = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    $('#progress').style.transform = 'scaleX(' + k.toFixed(4) + ')';
    var cur = null;
    secLinks.forEach(function (a) {
      var t = $(a.getAttribute('href'));
      if (t && !t.closest('[hidden]') && t.getBoundingClientRect().top < 160) cur = a;
    });
    secLinks.forEach(function (a) { a.setAttribute('aria-current', a === cur ? 'true' : 'false'); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  var toastTimer;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  // one listener for every button the renders create
  document.addEventListener('click', function (e) {
    var b;
    if ((b = e.target.closest('[data-open]'))) { openViewer(+b.dataset.open); return; }
    if ((b = e.target.closest('[data-buy]'))) {
      var no = +b.dataset.buy, i = state.bought.indexOf(no);
      if (i === -1) state.bought.push(no); else state.bought.splice(i, 1);
      store();
      var card = $('#item-' + no), on = i === -1;
      card.classList.toggle('is-bought', on);
      b.setAttribute('aria-pressed', on);
      $('span', b).textContent = on ? 'Bought' : 'Mark bought';
      renderBought(); renderReceipt();
      return;
    }
    if ((b = e.target.closest('[data-fix]'))) {
      var id = b.id;
      setFix(+b.dataset.fix, +b.dataset.val);
      var again = document.getElementById(id);
      if (again) again.focus();
      return;
    }
    if ((b = e.target.closest('[data-seg]'))) {
      var c = $('#item-' + b.dataset.seg);
      if (state.view === 'list') setView('cards');
      if (c) {
        c = $('#item-' + b.dataset.seg);
        c.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        c.classList.remove('pulse'); void c.offsetWidth; c.classList.add('pulse');
      }
    }
  });
  $('#spendBar').addEventListener('pointerover', function (e) { var s = e.target.closest('[data-seg]'); spendHint(s ? +s.dataset.seg : null); });
  $('#spendBar').addEventListener('pointerleave', function () { spendHint(null); });
  $('#spendBar').addEventListener('focusin', function (e) { var s = e.target.closest('[data-seg]'); spendHint(s ? +s.dataset.seg : null); });
  $('#spendBar').addEventListener('focusout', function () { spendHint(null); });
  $('#boughtReset').addEventListener('click', function () {
    state.bought = []; store(); renderAll();
    toast('Ticks cleared');
  });
  $('#resetFix').addEventListener('click', function () { state.fixes = {}; store(); renderAll(); toast('Back to the figures as written'); });

  // 8 · start ------------------------------------------------------------------------
  function renderAll(first) {
    renderGroups(); renderSpend(); renderBought(); renderReceipt(); renderCheck(); renderTotals(first);
    $$('.item').forEach(function (c) { c.classList.add('in'); });
  }
  renderAll(true);
  // first paint: let the cards rise in as they scroll into view
  $$('.item').forEach(function (c) { c.classList.remove('in'); });
  observeReveal();
  setView(state.view);
  onScroll();
})();
