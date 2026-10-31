/* ==========================================================================
   My House · gallery behaviour
   Reads window.HOUSE from photos.js. No libraries.
   1 data   2 state and storage   3 grid, save, archive   4 navigation and filters   5 modes   6 palette   7 viewer   8 keys and start
   ========================================================================== */
(function () {
  'use strict';

  var HOUSE = window.HOUSE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ICON = {
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.9c0 5.3-8.8 10.1-8.8 10.1S3.2 14.2 3.2 8.9A4.3 4.3 0 0 1 12 7.1a4.3 4.3 0 0 1 8.8 1.8Z"/></svg>',
    floor: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11 12 4l9 7M5 10v10h14V10"/></svg>',
    file: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l5 5v13H7zM14 3v5h5"/></svg>',
    cube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9"/></svg>',
    swap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18"/><rect x="3" y="5" width="18" height="14" rx="1.5"/></svg>',
    archive: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="4.5" rx="1"/><path d="M5 8.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.5M10 12.5h4"/></svg>',
    restore: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v5h5"/></svg>',
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="1.5"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>'
  };

  // 1 · data ---------------------------------------------------------------
  var groups = HOUSE.groups;
  var groupById = {};
  groups.forEach(function (g) { groupById[g.id] = g; });

  var items = [];
  var seen = {};
  HOUSE.photos.forEach(function (p) {
    seen[p.group] = (seen[p.group] || 0) + 1;
    items.push({
      id: p.group + '/' + p.file,
      group: p.group,
      no: pad(seen[p.group]),
      src: 'images/' + p.group + '/' + p.file + '.webp',
      thumb: 'images/' + p.group + '/thumbs/' + p.file + '.webp',
      before: p.firstIdea ? 'images/first-ideas/' + p.firstIdea + '.webp' : null,
      beforeThumb: p.firstIdea ? 'images/first-ideas/thumbs/' + p.firstIdea + '.webp' : null,
      w: p.w, h: p.h, title: p.title, desc: p.desc, alt: p.alt
    });
  });
  var byId = {};
  items.forEach(function (it) { byId[it.id] = it; });
  var withBefore = items.filter(function (it) { return it.before; });

  // 2 · state and storage ------------------------------------------------------
  // Saved and archived photos are remembered in this browser: localStorage first, a cookie if storage is blocked.
  var store = {
    get: function (key) {
      try { var v = localStorage.getItem(key); if (v !== null) return JSON.parse(v); } catch (e) {}
      var m = document.cookie.match(new RegExp('(?:^|; )' + key + '=([^;]*)'));
      try { return m ? JSON.parse(decodeURIComponent(m[1])) : null; } catch (e) { return null; }
    },
    set: function (key, value) {
      var json = JSON.stringify(value);
      try { localStorage.setItem(key, json); } catch (e) {}
      document.cookie = key + '=' + encodeURIComponent(json) + '; max-age=31536000; path=/; SameSite=Lax';
    }
  };
  var KEY_SAVED = 'my-house-saved-v3', KEY_ARCHIVED = 'my-house-archived-v1';
  var keep = function (list) { return new Set((list || []).filter(function (id) { return byId[id]; })); };
  var saved = keep(store.get(KEY_SAVED));
  var archived = keep(store.get(KEY_ARCHIVED));
  var persist = function () { store.set(KEY_SAVED, Array.from(saved)); store.set(KEY_ARCHIVED, Array.from(archived)); };

  var mode = { before: false, saved: false, archive: false };
  var filter = 'all';                  // 'all' or a group id
  var shown = [];                      // items on screen, in page order: the viewer walks through these

  var toastTimer, toastUndo = null;
  function toast(msg, undo) {
    var t = $('#toast');
    t.innerHTML = '<span>' + esc(msg) + '</span>' + (undo ? '<button type="button" class="toast-undo">Undo</button>' : '');
    toastUndo = undo || null;
    t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); toastUndo = null; }, undo ? 4500 : 1700);
  }
  $('#toast').addEventListener('click', function (e) {
    if (e.target.closest('.toast-undo') && toastUndo) { var u = toastUndo; toastUndo = null; $('#toast').classList.remove('show'); u(); }
  });

  // 3 · grid, save, archive -------------------------------------------------------
  var rooms = $('#rooms');
  function inMode(it) {
    if (mode.archive) return archived.has(it.id);        // the archive shows only archived photos
    if (archived.has(it.id)) return false;               // everywhere else they are hidden
    if (mode.saved && !saved.has(it.id)) return false;
    if (mode.before && !it.before) return false;
    return true;
  }
  function inFilter(it) { return filter === 'all' || it.group === filter; }

  function card(it) {
    var on = saved.has(it.id);
    var sizes = '(max-width: 420px) 100vw, (max-width: 640px) 50vw, (max-width: 900px) 33vw, 25vw';
    return '<figure class="card reveal" data-id="' + it.id + '">' +
      '<img class="img-after" src="' + it.thumb + '" srcset="' + it.thumb + ' 760w, ' + it.src + ' ' + it.w + 'w" sizes="' + sizes + '"' +
        ' width="' + it.w + '" height="' + it.h + '" alt="' + esc(it.alt) + '" loading="lazy" decoding="async">' +
      (it.before ? '<img class="img-before" src="' + it.beforeThumb + '" srcset="' + it.beforeThumb + ' 760w, ' + it.before + ' 1536w" sizes="' + sizes + '"' +
        ' width="1536" height="1024" alt="" loading="lazy" decoding="async">' : '') +
      (mode.before ? '<span class="tag">First idea</span>' : '') +
      '<figcaption><span class="num">' + esc(groupById[it.group].label) + ' · ' + it.no + '</span><h3>' + esc(it.title) + '</h3></figcaption>' +
      '<button class="open" type="button" aria-label="Open ' + esc(it.title) + '"></button>' +
      '<button class="fav" type="button" aria-pressed="' + on + '" aria-label="' + (on ? 'Remove ' : 'Save ') + esc(it.title) + '">' + ICON.heart + '</button>' +
      (mode.archive
        ? '<button class="arc" type="button" aria-label="Restore ' + esc(it.title) + '" title="Restore">' + ICON.restore + '</button>'
        : '<button class="arc" type="button" aria-label="Archive ' + esc(it.title) + '" title="Archive">' + ICON.archive + '</button>') +
      '</figure>';
  }

  // every photo in one grid, four per row, in the order you walk through the house
  function renderRooms() {
    shown = items.filter(function (it) { return inMode(it) && inFilter(it); });
    rooms.innerHTML = '<div class="grid">' + shown.map(card).join('') + '</div>';
    var empty = $('#empty');
    empty.hidden = shown.length > 0;
    empty.textContent = mode.archive ? 'The archive is empty. Archive a photo to move it here.'
      : mode.saved ? 'Nothing saved yet. Tap the heart on any photo to keep it here.' : 'No photos in this view.';
    $('#footCount').textContent = (items.length - archived.size) + ' photographs' + (archived.size ? ' · ' + archived.size + ' archived' : '');
    observeReveal();
    buildNav();
  }

  // reveal: cards fade up as they come into view (checked on scroll, so it works everywhere)
  function observeReveal() {
    $$('.reveal', rooms).forEach(function (el, i) {
      if (reduceMotion) el.classList.add('in'); else el.style.transitionDelay = (i % 3) * 60 + 'ms';
    });
    revealVisible();
  }
  function revealVisible() {
    var limit = window.innerHeight * 0.96;
    $$('.reveal:not(.in)', rooms).forEach(function (el) { if (el.getBoundingClientRect().top < limit) el.classList.add('in'); });
  }

  rooms.addEventListener('click', function (e) {
    var c = e.target.closest('.card'); if (!c) return;
    if (e.target.closest('.fav')) { toggleSaved(c.dataset.id); return; }
    if (e.target.closest('.arc')) { toggleArchived(c.dataset.id); return; }
    if (e.target.closest('.open')) openViewer(c.dataset.id);
  });

  function toggleSaved(id) {
    var it = byId[id]; if (!it) return;
    if (saved.has(id)) { saved.delete(id); toast('Removed from saved'); } else { saved.add(id); toast('Saved · ' + it.title); }
    persist();
    $$('.card[data-id="' + id + '"] .fav').forEach(function (b) {
      var on = saved.has(id);
      b.setAttribute('aria-pressed', String(on)); b.setAttribute('aria-label', (on ? 'Remove ' : 'Save ') + it.title);
    });
    updateSavedBadge();
    if (viewer.open) syncSave();
    if (mode.saved) renderRooms();
  }
  // archive: the photo leaves the rooms and goes to the archive; restore brings it back
  function toggleArchived(id) {
    var it = byId[id]; if (!it) return;
    var was = archived.has(id);
    if (was) archived.delete(id); else archived.add(id);
    persist();
    var y = window.scrollY;
    if (filter !== 'all' && !items.some(function (x) { return inMode(x) && x.group === filter; })) filter = 'all';
    renderRooms();
    window.scrollTo(0, y);
    updateArchiveBadge();
    if (viewer.open) refreshViewer();
    toast((was ? 'Restored · ' : 'Archived · ') + it.title, function () { toggleArchived(id); });
    if (mode.archive) setModeBar();
  }
  function updateArchiveBadge() {
    var b = $('#archiveCount'); b.textContent = archived.size; b.hidden = archived.size === 0;
    $('#modeArchive').setAttribute('aria-label', 'Archive (' + archived.size + ')');
  }
  function updateSavedBadge() {
    var b = $('#savedCount'); b.textContent = saved.size; b.hidden = saved.size === 0;
    $('#modeSaved').setAttribute('aria-label', 'Saved photos (' + saved.size + ')');
  }

  // 4 · navigation and filters ------------------------------------------------------
  // The header is fixed. Its links filter the grid by floor; a line slides under the active one.
  var secNav = $('#sections'), indicator = $('#indicator');
  function buildNav() {
    $$('.sec-link', secNav).forEach(function (a) { a.remove(); });
    var pool = items.filter(inMode);
    [{ id: 'all', label: 'All' }].concat(groups).forEach(function (g) {
      var count = g.id === 'all' ? pool.length : pool.filter(function (it) { return it.group === g.id; }).length;
      if (g.id !== 'all' && !count) return;
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'sec-link'; b.dataset.filter = g.id;
      b.setAttribute('aria-pressed', String(filter === g.id));
      b.innerHTML = esc(g.label) + '<span class="n">' + count + '</span>';
      secNav.appendChild(b);
    });
    moveIndicator();
  }
  function moveIndicator() {
    var active = $('.sec-link[aria-pressed="true"]', secNav);
    if (!active) { indicator.style.opacity = '0'; return; }
    indicator.style.left = active.offsetLeft + 12 + 'px';
    indicator.style.width = active.offsetWidth - 24 + 'px';
    indicator.style.opacity = '1';
    if (secNav.scrollWidth > secNav.clientWidth) secNav.scrollLeft = Math.max(0, active.offsetLeft - secNav.clientWidth / 2 + active.offsetWidth / 2);
  }
  function setFilter(f) {
    filter = groupById[f] ? f : 'all';
    renderRooms();
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    try { history.replaceState(null, '', filter === 'all' ? location.pathname + location.search : '#' + filter); } catch (e) {}
  }
  secNav.addEventListener('click', function (e) { var b = e.target.closest('.sec-link'); if (b) setFilter(b.dataset.filter); });
  window.addEventListener('resize', moveIndicator);

  // a thin progress line under the header, and cards fading in as they arrive
  var ticking = false, progress = $('#progress');
  function onScroll() {
    var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    revealVisible();
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  // project files menu
  var filesBtn = $('#openFiles'), files = $('#files');
  function setFiles(open) {
    files.hidden = !open; filesBtn.setAttribute('aria-expanded', String(open));
    if (open) { var f = $('a', files); if (f) f.focus(); }
  }
  filesBtn.addEventListener('click', function (e) { e.stopPropagation(); setFiles(files.hidden); });
  document.addEventListener('click', function (e) { if (!files.hidden && !e.target.closest('.menu-wrap')) setFiles(false); });
  files.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setFiles(false); filesBtn.focus(); } });

  // 5 · modes ------------------------------------------------------------------
  function setMode(name, on) {
    mode[name] = on;
    if (name === 'archive' && on) { mode.before = false; mode.saved = false; }   // the archive is its own view
    if (name !== 'archive' && on) mode.archive = false;
    $('#modeBefore').setAttribute('aria-pressed', String(mode.before));
    $('#modeSaved').setAttribute('aria-pressed', String(mode.saved));
    $('#modeArchive').setAttribute('aria-pressed', String(mode.archive));
    document.body.classList.toggle('before', mode.before);
    document.body.classList.toggle('archive', mode.archive);
    setModeBar();
    if (name === 'archive' || (filter !== 'all' && !items.some(function (it) { return inMode(it) && it.group === filter; }))) filter = 'all';
    renderRooms();
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  function setModeBar() {
    var bits = [];
    if (mode.archive) bits.push('Archive: ' + archived.size + (archived.size === 1 ? ' photo' : ' photos') + ', hidden from the rooms');
    if (mode.before) bits.push('First ideas: ' + withBefore.length + ' photos. Hover or open one to compare with the final');
    if (mode.saved) bits.push('Saved: ' + saved.size + ' photos');
    $('#modeBar').hidden = !bits.length;
    $('#modeText').textContent = bits.join(' · ');
    $('#restoreAll').hidden = !(mode.archive && archived.size);
    return bits;
  }
  $('#modeBefore').addEventListener('click', function () { setMode('before', !mode.before); });
  $('#modeSaved').addEventListener('click', function () { setMode('saved', !mode.saved); });
  $('#modeArchive').addEventListener('click', function () { setMode('archive', !mode.archive); });
  $('#modeClear').addEventListener('click', function () { mode.before = false; mode.archive = false; setMode('saved', false); });
  $('#restoreAll').addEventListener('click', function () {
    var list = Array.from(archived);
    archived.clear(); persist(); updateArchiveBadge(); setModeBar(); renderRooms();
    toast('Restored ' + list.length + (list.length === 1 ? ' photo' : ' photos'), function () {
      list.forEach(function (id) { archived.add(id); }); persist(); updateArchiveBadge(); setModeBar(); renderRooms();
    });
  });
  // the list of archived files, so they can also be moved into a folder on disk
  function copyArchiveList() {
    var text = Array.from(archived).map(function (id) { return byId[id].src; }).join('\n');
    if (!text) { toast('The archive is empty'); return; }
    var done = function () { toast('Copied ' + archived.size + ' file names'); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () { prompt('Archived files:', text); });
    else prompt('Archived files:', text);
  }

  // 6 · command palette ---------------------------------------------------------
  var palette = $('#palette'), palInput = $('#palInput'), palList = $('#palList');
  var palEntries = [], palSel = 0;

  function commands() {
    var list = [];
    groups.forEach(function (g) {
      list.push({ kind: 'Floors', icon: ICON.floor, title: g.label, sub: g.note, run: function () { goTo(g.id); } });
    });
    list.push({ kind: 'Floors', icon: ICON.floor, title: 'All photos', sub: 'Every room in one grid', run: function () { goTo('all'); } });
    items.forEach(function (it) {
      var arc = archived.has(it.id);
      list.push({ kind: 'Photos', thumb: it.thumb, title: it.title, sub: (arc ? 'Archived · ' : '') + groupById[it.group].label + ' · ' + it.desc,
        run: function () { if (arc && !mode.archive) setMode('archive', true); openViewer(it.id); } });
    });
    list.push({ kind: 'Views', icon: ICON.swap, title: mode.before ? 'Hide first ideas' : 'Show first ideas', sub: 'Compare the first images with the corrected ones', run: function () { setMode('before', !mode.before); } });
    list.push({ kind: 'Views', icon: ICON.heart, title: mode.saved ? 'Show everything' : 'Show saved photos', sub: saved.size + ' saved', run: function () { setMode('saved', !mode.saved); } });
    list.push({ kind: 'Views', icon: ICON.archive, title: mode.archive ? 'Leave the archive' : 'Open the archive', sub: archived.size + ' archived', run: function () { setMode('archive', !mode.archive); } });
    if (archived.size) list.push({ kind: 'Views', icon: ICON.copy, title: 'Copy the archived file names', sub: 'To move them into a folder on disk', run: copyArchiveList });
    list.push({ kind: 'Files', icon: ICON.cube, title: '3D model', sub: 'Walk around and through the house', href: 'model/3d-model.html' });
    $$('a', files).forEach(function (a) {
      if (a.getAttribute('href').indexOf('docs/') === 0) list.push({ kind: 'Files', icon: ICON.file, title: $('span', a).textContent, sub: $('small', a).textContent, href: a.getAttribute('href') });
    });
    return list;
  }
  function score(entry, words) {
    var hay = (entry.title + ' ' + entry.sub + ' ' + entry.kind).toLowerCase();
    var s = 0;
    for (var i = 0; i < words.length; i++) {
      var k = hay.indexOf(words[i]);
      if (k < 0) return -1;
      s += k === 0 ? 3 : (entry.title.toLowerCase().indexOf(words[i]) > -1 ? 2 : 1);
    }
    return s;
  }
  function renderPalette() {
    var q = palInput.value.trim().toLowerCase();
    var words = q ? q.split(/\s+/) : [];
    var all = commands();
    palEntries = (words.length
      ? all.map(function (e) { return { e: e, s: score(e, words) }; }).filter(function (x) { return x.s >= 0; })
          .sort(function (a, b) { return b.s - a.s; }).map(function (x) { return x.e; })
      : all.filter(function (e) { return e.kind !== 'Photos'; }).concat(all.filter(function (e) { return e.kind === 'Photos'; }).slice(0, 6))
    ).slice(0, 40);
    palSel = 0;
    if (!palEntries.length) { palList.innerHTML = '<li class="pal-empty">Nothing matches "' + esc(q) + '"</li>'; return; }
    var html = '', lastKind = '';
    palEntries.forEach(function (e, i) {
      if (!words.length && e.kind !== lastKind) { html += '<li class="pal-group" role="presentation">' + e.kind + '</li>'; lastKind = e.kind; }
      html += '<li class="pal-item" role="option" id="pal-' + i + '" data-i="' + i + '" aria-selected="' + (i === 0) + '">' +
        (e.thumb ? '<img src="' + e.thumb + '" alt="" loading="lazy">' : '<span class="pal-icon">' + e.icon + '</span>') +
        '<span class="pal-text"><b>' + esc(e.title) + '</b><small>' + esc(e.sub) + '</small></span></li>';
    });
    palList.innerHTML = html;
    palInput.setAttribute('aria-activedescendant', 'pal-0');
  }
  function selectPal(i) {
    if (!palEntries.length) return;
    palSel = (i + palEntries.length) % palEntries.length;
    $$('.pal-item', palList).forEach(function (li) { li.setAttribute('aria-selected', String(+li.dataset.i === palSel)); });
    var li = $('#pal-' + palSel); if (li) li.scrollIntoView({ block: 'nearest' });
    palInput.setAttribute('aria-activedescendant', 'pal-' + palSel);
  }
  function runPal(i) {
    var e = palEntries[i]; if (!e) return;
    palette.close();
    if (e.href) location.href = e.href; else e.run();
  }
  function openPalette() { if (viewer.open) return; palInput.value = ''; renderPalette(); palette.showModal(); palInput.focus(); }
  $('#openPalette').addEventListener('click', openPalette);
  palInput.addEventListener('input', renderPalette);
  palInput.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); selectPal(palSel + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); selectPal(palSel - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); runPal(palSel); }
  });
  palList.addEventListener('click', function (e) { var li = e.target.closest('.pal-item'); if (li) runPal(+li.dataset.i); });
  palList.addEventListener('mousemove', function (e) { var li = e.target.closest('.pal-item'); if (li && +li.dataset.i !== palSel) selectPal(+li.dataset.i); });
  palette.addEventListener('click', function (e) { if (e.target === palette) palette.close(); });

  function goTo(id) {
    if (mode.archive || mode.saved || mode.before) { mode.archive = mode.saved = mode.before = false; setMode('archive', false); }
    setFilter(id);
  }

  // 7 · viewer ----------------------------------------------------------------
  var viewer = $('#viewer'), vImg = $('#vImg'), vPic = $('#vPic'), vBefore = $('#vBefore'), vBeforeImg = $('#vBeforeImg');
  var vHandle = $('#vHandle'), strip = $('#strip');
  var vi = 0, comparing = false, zoomed = false, split = 50, opener = null;
  var vItem = function () { return shown[vi]; };

  function openViewer(id) {
    var i = shown.findIndex(function (it) { return it.id === id; });
    if (i < 0) {
      mode.before = false; mode.saved = false; filter = 'all';
      setMode('archive', archived.has(id));
      i = shown.findIndex(function (it) { return it.id === id; });
    }
    if (i < 0) return;
    vi = i; opener = document.activeElement;
    buildStrip();
    if (!viewer.open) viewer.showModal();
    comparing = mode.before && !!vItem().before;
    show();
  }
  function buildStrip() {
    strip.innerHTML = shown.map(function (it, i) {
      return '<button type="button" role="option" data-i="' + i + '" aria-label="' + esc(it.title) + '"><img src="' + it.thumb + '" alt="" loading="lazy"></button>';
    }).join('');
  }
  function show() {
    var it = vItem(); if (!it) return;
    setZoom(false);
    vImg.classList.add('loading');
    var pre = new Image();
    pre.onload = pre.onerror = function () { if (vItem() === it) { vImg.src = it.src; vImg.classList.remove('loading'); } };
    pre.src = it.src;
    vImg.alt = it.alt;
    $('#vWhere').textContent = groupById[it.group].label + ' · ' + it.no;
    $('#vTitle').textContent = it.title;
    $('#vDesc').textContent = it.desc;
    $('#vCount').textContent = pad(vi + 1) + ' / ' + pad(shown.length);
    var cmp = $('#vCompare');
    cmp.hidden = !it.before;
    if (!it.before) comparing = false;
    cmp.setAttribute('aria-pressed', String(comparing));
    if (it.before) vBeforeImg.src = it.before;
    applyCompare();
    syncSave();
    $$('button', strip).forEach(function (b) { b.setAttribute('aria-selected', String(+b.dataset.i === vi)); });
    var sel = $('button[data-i="' + vi + '"]', strip);
    if (sel) strip.scrollLeft = sel.offsetLeft - strip.clientWidth / 2 + sel.offsetWidth / 2;
    try { history.replaceState(null, '', '#' + it.id); } catch (e) {}
    [vi - 1, vi + 1].forEach(function (k) { var n = shown[(k + shown.length) % shown.length]; if (n) { (new Image()).src = n.src; } });
  }
  function applyCompare() {
    vBefore.hidden = vHandle.hidden = !comparing;
    $('#vTagBefore').hidden = $('#vTagAfter').hidden = !comparing;
    vBefore.style.clipPath = 'inset(0 ' + (100 - split) + '% 0 0)';
    vHandle.style.left = split + '%';
    vHandle.setAttribute('aria-valuenow', String(Math.round(split)));
    $('#vZoom').disabled = comparing;
  }
  function setCompare(on) { if (!vItem() || !vItem().before) return; comparing = on; setZoom(false); $('#vCompare').setAttribute('aria-pressed', String(on)); applyCompare(); }
  function syncSave() {
    var it = vItem(); if (!it) return;
    var on = saved.has(it.id), b = $('#vSave');
    b.setAttribute('aria-pressed', String(on)); b.setAttribute('aria-label', (on ? 'Remove from saved' : 'Save') + ' (S)');
    var a = $('#vArchive'), arc = archived.has(it.id);
    a.innerHTML = arc ? ICON.restore : ICON.archive;
    a.setAttribute('aria-label', (arc ? 'Restore' : 'Archive') + ' (A)'); a.title = (arc ? 'Restore' : 'Archive') + ' (A)';
  }
  // after archiving or restoring from the viewer, the photo leaves this view: move on to the next one
  function refreshViewer() {
    buildStrip();
    if (!shown.length) { closeViewer(); return; }
    if (vi >= shown.length) vi = shown.length - 1;
    comparing = mode.before && !!vItem().before;
    show();
  }
  function step(d) { if (!shown.length) return; vi = (vi + d + shown.length) % shown.length; comparing = mode.before && !!vItem().before; show(); }
  function closeViewer() { if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen(); if (viewer.open) viewer.close(); }
  viewer.addEventListener('close', function () {
    setZoom(false);
    try { history.replaceState(null, '', filter === 'all' ? location.pathname + location.search : '#' + filter); } catch (e) {}
    if (opener && opener.focus) opener.focus({ preventScroll: true });
  });

  // zoom: click the photo, move the pointer to look around
  function setZoom(on) { zoomed = on && !comparing; vPic.classList.toggle('zoomed', zoomed); $('#vZoom').setAttribute('aria-pressed', String(zoomed)); if (!zoomed) vPic.style.transformOrigin = ''; }
  function aim(x, y) {
    var r = $('#vFrame').getBoundingClientRect();
    vPic.style.transformOrigin = ((x - r.left) / r.width * 100) + '% ' + ((y - r.top) / r.height * 100) + '%';
  }
  vImg.addEventListener('click', function (e) { if (comparing) return; aim(e.clientX, e.clientY); setZoom(!zoomed); });
  $('#vFrame').addEventListener('pointermove', function (e) { if (zoomed) aim(e.clientX, e.clientY); });
  $('#vZoom').addEventListener('click', function () { setZoom(!zoomed); });

  // before and after slider
  var dragging = false;
  function slideTo(clientX) {
    var r = vPic.getBoundingClientRect();
    split = Math.max(0, Math.min(100, (clientX - r.left) / r.width * 100));
    applyCompare();
  }
  vHandle.addEventListener('pointerdown', function (e) { dragging = true; vHandle.setPointerCapture(e.pointerId); e.preventDefault(); });
  vHandle.addEventListener('pointermove', function (e) { if (dragging) slideTo(e.clientX); });
  vHandle.addEventListener('pointerup', function () { dragging = false; });
  vPic.addEventListener('pointerdown', function (e) { if (comparing && e.target !== vHandle && !vHandle.contains(e.target)) slideTo(e.clientX); });
  vHandle.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); split = Math.max(0, Math.min(100, split + (e.key === 'ArrowLeft' ? -5 : 5))); applyCompare(); }
  });

  $('#vPrev').addEventListener('click', function () { step(-1); });
  $('#vNext').addEventListener('click', function () { step(1); });
  $('#vClose').addEventListener('click', closeViewer);
  $('#vSave').addEventListener('click', function () { if (vItem()) toggleSaved(vItem().id); });
  $('#vArchive').addEventListener('click', function () { if (vItem()) toggleArchived(vItem().id); });
  $('#vCompare').addEventListener('click', function () { setCompare(!comparing); });
  $('#vFull').addEventListener('click', toggleFull);
  function toggleFull() {
    if (!document.fullscreenElement) { if (viewer.requestFullscreen) viewer.requestFullscreen(); }
    else if (document.exitFullscreen) document.exitFullscreen();
  }
  strip.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    vi = +b.dataset.i; comparing = mode.before && !!vItem().before; show();
  });
  viewer.addEventListener('keydown', function (e) {
    if (e.target === vHandle) return;
    var k = e.key.toLowerCase();
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    else if (k === 'c') setCompare(!comparing);
    else if (k === 's') { if (vItem()) toggleSaved(vItem().id); }
    else if (k === 'a') { if (vItem()) toggleArchived(vItem().id); }
    else if (k === 'z') setZoom(!zoomed);
    else if (k === 'f') toggleFull();
  });
  var touchX = 0, touchY = 0;
  $('#vFrame').addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; touchY = e.changedTouches[0].clientY; }, { passive: true });
  $('#vFrame').addEventListener('touchend', function (e) {
    if (zoomed || dragging || comparing) return;
    var dx = e.changedTouches[0].clientX - touchX, dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
  }, { passive: true });

  // 8 · keys and start ------------------------------------------------------------
  document.addEventListener('keydown', function (e) {
    if (viewer.open || palette.open) return;
    var typing = /input|textarea|select/i.test(document.activeElement.tagName);
    if (typing) return;
    if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); openPalette(); }
    else if (e.key.toLowerCase() === 'b' && !e.metaKey && !e.ctrlKey) setMode('before', !mode.before);
    else if (e.key === 'Escape' && !files.hidden) setFiles(false);
  });

  // start: #floor/name opens a photo, #floor filters the grid
  var hash = decodeURIComponent(location.hash.slice(1));
  if (groupById[hash]) filter = hash;
  updateSavedBadge();
  updateArchiveBadge();
  renderRooms();
  onScroll();
  if (byId[hash]) openViewer(hash);
})();
