/* ==========================================================================
   Halvora — consent-gated behavioural + favourites personalization
   --------------------------------------------------------------------------
   The "Recommended for you" rail is a MARKETING feature:
     • It only appears when the visitor has granted MARKETING (Advertising)
       consent in the Securiti banner. No marketing consent → the whole
       section is hidden and nothing is tracked or stored.
     • With consent, recommendations are ranked from BOTH signals:
         – browsing behaviour (service pages viewed, by category)
         – likes / saves (the ♡ favourite buttons)
       Favourites weigh more than views. A "♥ Saved for you" row and a
       "Recently viewed" row round it out.
     • Withdraw consent → behaviour + favourites cookies are deleted, hearts
       reset, and the rail disappears again.
   ========================================================================== */
(function () {
  "use strict";
  if (!window.MFG_CATALOG) return;

  var BKEY = "mfg_ad_personalization";
  var FKEY = "mfg_saved_items";
  var FILL = "#0B7A4B";                 // money green for a filled heart

  function ids(attr) {
    return (document.documentElement.getAttribute(attr) || "").split(",")
      .map(function (s) { return s.trim(); }).filter(Boolean);
  }
  var MKT = ids("data-mkt");            // Advertising, Social Networking = "marketing"

  // Securiti stores __privaci_cookie_consents as base64-encoded JSON on live
  // domains (and URL-encoded/plain JSON in some contexts) — decode defensively.
  function decodeConsents(raw) {
    if (!raw) return null;
    var tries = [];
    try { tries.push(atob(raw)); } catch (e) {}
    try { tries.push(decodeURIComponent(raw)); } catch (e) {}
    tries.push(raw);
    for (var i = 0; i < tries.length; i++) {
      try { var o = JSON.parse(tries[i]); if (o && o.consents) return o.consents; } catch (e) {}
    }
    return null;
  }
  // "Any non-essential consent granted?" — this Securiti domain only publishes
  // Essential + Performance & Functionality + Unclassified as banner toggles
  // (no dedicated Advertising toggle), so we treat consent to ANY non-essential
  // category as permission to personalise / show offers. Essential-only
  // (reject-all) → false. Proper per-category gating needs an Advertising
  // category with cookies published in the Securiti console.
  var ESSENTIAL_ID = "4";
  function marketingConsent() {
    var m = document.cookie.match(/(?:^|;\s*)__privaci_cookie_consents=([^;]+)/);
    var c = m ? decodeConsents(m[1]) : null;
    if (!c) return false;
    return Object.keys(c).some(function (id) { return id !== ESSENTIAL_ID && String(c[id]) === "1"; });
  }

  /* ---- behaviour store -------------------------------------------------- */
  function readBehavior() {
    var m = document.cookie.match(/(?:^|;\s*)mfg_ad_personalization=([^;]+)/);
    if (!m) return { cats: {}, items: [] };
    try { var b = JSON.parse(decodeURIComponent(m[1])); b.cats = b.cats || {}; b.items = b.items || []; return b; }
    catch (e) { return { cats: {}, items: [] }; }
  }
  function writeBehavior(b) {
    document.cookie = BKEY + "=" + encodeURIComponent(JSON.stringify(b)) + ";path=/;max-age=" + (180 * 86400) + ";SameSite=Lax";
  }
  function clearBehavior() { expire(BKEY); }

  /* ---- favourites store ------------------------------------------------- */
  function readFavorites() {
    var m = document.cookie.match(/(?:^|;\s*)mfg_saved_items=([^;]+)/);
    if (!m) return [];
    try { var a = JSON.parse(decodeURIComponent(m[1])); return Array.isArray(a) ? a : []; }
    catch (e) { return []; }
  }
  function writeFavorites(a) {
    document.cookie = FKEY + "=" + encodeURIComponent(JSON.stringify(a)) + ";path=/;max-age=" + (180 * 86400) + ";SameSite=Lax";
  }
  function clearFavorites() { expire(FKEY); }
  function isFav(id) { return readFavorites().indexOf(parseInt(id, 10)) >= 0; }

  function expire(name) {
    ["/", location.pathname].forEach(function (p) {
      [location.hostname, "." + location.hostname, "", ""].forEach(function (d) {
        document.cookie = name + "=;max-age=0;path=" + p + (d ? ";domain=" + d : "");
      });
    });
  }

  function recordView(id) {
    if (!marketingConsent()) return;    // no marketing consent → capture nothing
    var p = window.MFG_FIND(id); if (!p) return;
    var b = readBehavior();
    b.cats[p.category] = (b.cats[p.category] || 0) + 1;
    b.items = [p.id].concat(b.items.filter(function (x) { return x !== p.id; })).slice(0, 8);
    b.last = p.id;
    writeBehavior(b);
  }

  /* ---- scoring: behaviour (+1/view) + favourites (+3/like) -------------- */
  function categoryScores() {
    var b = readBehavior(), favs = readFavorites(), s = {};
    Object.keys(b.cats).forEach(function (k) { s[k] = (s[k] || 0) + b.cats[k]; });
    favs.forEach(function (id) { var p = window.MFG_FIND(id); if (p) s[p.category] = (s[p.category] || 0) + 3; });
    return s;
  }
  function topKey(s) { var t = null, n = -1; Object.keys(s).forEach(function (k) { if (s[k] > n) { n = s[k]; t = k; } }); return t; }

  /* ---- favourite (heart) buttons --------------------------------------- */
  function heartHtml(id, mode) {
    var fav = isFav(id);
    if (mode === "button") {
      return '<button type="button" class="mfg-fav" data-fav-id="' + id + '" data-mode="button" aria-pressed="' + fav + '" title="' + (fav ? "Saved" : "Save") + '" ' +
        'onclick="event.preventDefault();event.stopPropagation();window.MFG_TOGGLE_FAV(' + id + ')" ' +
        'style="cursor:pointer;font-weight:600;padding:0.875rem 1.5rem;border-radius:0.375rem;transition:all .15s;border:1.5px solid ' + (fav ? FILL : "#cbd5e1") + ';color:' + (fav ? FILL : "#334155") + ';background:' + (fav ? "#F1F8F4" : "#fff") + '">' + (fav ? "♥ Saved" : "♡ Save") + '</button>';
    }
    return '<button type="button" class="mfg-fav" data-fav-id="' + id + '" data-mode="inline" aria-pressed="' + fav + '" title="' + (fav ? "Saved" : "Save") + '" ' +
      'onclick="event.preventDefault();event.stopPropagation();window.MFG_TOGGLE_FAV(' + id + ')" ' +
      'style="width:34px;height:34px;border-radius:9999px;border:1px solid ' + (fav ? FILL : "#e2e8f0") + ';cursor:pointer;display:grid;place-items:center;font-size:15px;line-height:1;background:' + (fav ? "#F1F8F4" : "#fff") + ';color:' + (fav ? FILL : "#94a3b8") + '">' + (fav ? "♥" : "♡") + '</button>';
  }
  window.MFG_HEART_HTML = heartHtml;
  window.MFG_IS_FAV = isFav;
  window.MFG_SYNC_HEARTS = function () {
    document.querySelectorAll(".mfg-fav[data-fav-id]").forEach(function (btn) {
      var id = parseInt(btn.getAttribute("data-fav-id"), 10), fav = isFav(id), mode = btn.getAttribute("data-mode");
      btn.setAttribute("aria-pressed", fav); btn.title = fav ? "Saved" : "Save";
      if (mode === "button") {
        btn.textContent = fav ? "♥ Saved" : "♡ Save";
        btn.style.border = "1.5px solid " + (fav ? FILL : "#cbd5e1");
        btn.style.color = fav ? FILL : "#334155";
        btn.style.background = fav ? "#F1F8F4" : "#fff";
      } else {
        btn.textContent = fav ? "♥" : "♡";
        btn.style.border = "1px solid " + (fav ? FILL : "#e2e8f0");
        btn.style.color = fav ? FILL : "#94a3b8";
        btn.style.background = fav ? "#F1F8F4" : "#fff";
      }
    });
  };
  window.MFG_TOGGLE_FAV = function (id) {
    id = parseInt(id, 10);
    // Saving a favourite is a functional wishlist action — no consent gate, no popup.
    var f = readFavorites(), i = f.indexOf(id);
    if (i >= 0) f.splice(i, 1); else f.unshift(id);
    writeFavorites(f.slice(0, 24));
    window.MFG_SYNC_HEARTS();
    lastSig = null; renderHome();
    return true;
  };

  /* ---- card + grid ----------------------------------------------------- */
  function card(p) {
    return '<a href="service.html?id=' + p.id + '" class="group relative border border-slate-200 rounded-xl bg-white overflow-hidden flex flex-col transition hover:-translate-y-1 hover:shadow-card hover:border-transparent">' +
      '<div class="p-6 flex flex-col gap-3 flex-1">' +
        '<div class="flex items-start justify-between">' +
          '<span class="rounded-xl bg-money-soft grid place-items-center shrink-0" style="width:48px;height:48px">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="' + p.color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px">' + window.MFG_ICONS[p.icon] + '</svg></span>' +
          '<span class="text-right"><b class="serif block text-xl text-money leading-none">' + p.stat.value + '</b>' +
            '<small class="text-[11px] text-slate-400">' + p.stat.label + '</small></span>' +
        '</div>' +
        '<div><span class="text-[11px] font-bold tracking-[0.14em] uppercase text-gold-dark">' + p.category + '</span>' +
          '<h3 class="font-bold text-[17px] leading-snug mt-0.5">' + p.name + '</h3></div>' +
        '<p class="text-slate-500 text-sm flex-1">' + p.tagline + '</p>' +
        '<div class="mt-1 flex items-center justify-between">' +
          '<span class="text-money font-bold text-sm inline-flex items-center gap-1.5 group-hover:text-gold-dark">Learn more →</span>' +
          heartHtml(p.id, "inline") +
        '</div>' +
      '</div></a>';
  }
  function grid(list) { return '<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">' + list.map(card).join("") + '</div>'; }
  function label(t) { return '<p class="text-xs font-bold tracking-[0.18em] uppercase text-slate-400 mt-10 mb-4">' + t + '</p>'; }

  /* ---- home "Recommended for you" -------------------------------------- */
  var lastSig = null;
  function renderHome() {
    var host = document.getElementById("mfg-reco");
    if (!host) return;
    var sect = host.closest("section");

    if (!marketingConsent()) {           // no marketing consent → no rail, no behaviour tracking
      if (lastSig === "off") return;
      clearBehavior();                   // favourites persist — they're a functional wishlist
      if (sect) sect.style.display = "none";
      host.innerHTML = "";
      window.MFG_SYNC_HEARTS();
      lastSig = "off";
      return;
    }
    if (sect) sect.style.display = "";

    var b = readBehavior(), favs = readFavorites();
    var sig = "on|" + JSON.stringify(b.cats) + "|" + b.items.join(",") + "|" + favs.join(",");
    if (sig === lastSig) return;
    lastSig = sig;

    function head(eyebrow, title) {
      return '<div class="flex items-end justify-between gap-5 flex-wrap mb-8">' +
        '<div><p class="text-xs font-bold tracking-[0.18em] uppercase text-gold-dark">' + eyebrow + '</p>' +
        '<h2 class="serif text-3xl md:text-4xl font-bold mt-2">' + title + '</h2></div>' +
        '<button type="button" onclick="showConsentPreferencesPopup()" class="text-sm font-semibold text-slate-500 hover:text-money underline">Manage cookies</button></div>';
    }

    if (b.items.length === 0 && favs.length === 0) {
      var popular = window.MFG_CATALOG.filter(function (p) { return p.tag === "popular"; }).slice(0, 3);
      host.innerHTML = head("✦ Recommended for you", "Popular with our members") + grid(popular) +
        '<p class="text-sm text-slate-500 mt-6 text-center">Explore a few services or tap ♡ to <strong>save</strong> the ones you like — this rail then tailors itself to your interests.</p>';
      window.MFG_SYNC_HEARTS();
      return;
    }

    var cat = topKey(categoryScores());
    // lead with items from the top-interest category (favourites live in their
    // own row below), then fill with other non-favourited items.
    var picks = window.MFG_CATALOG.filter(function (p) { return p.category === cat && !isFav(p.id); });
    if (picks.length < 3) picks = picks.concat(window.MFG_CATALOG.filter(function (p) { return picks.indexOf(p) < 0 && !isFav(p.id); }));
    picks = picks.slice(0, 3);
    var favItems = favs.map(window.MFG_FIND).filter(Boolean).slice(0, 3);
    var recent = b.items.map(window.MFG_FIND).filter(Boolean).slice(0, 3);

    host.innerHTML =
      head("✦ Personalized for you", "Based on your interest in " + cat) + grid(picks) +
      (favItems.length ? label("♥ Saved for you") + grid(favItems) : "") +
      (recent.length ? label("Recently viewed") + grid(recent) : "");
    window.MFG_SYNC_HEARTS();
  }

  /* ---- personalized "offers" slot (#mfg-ads) --------------------------- */
  var lastAdsSig = null;
  function adCard(p) {
    return '<a href="service.html?id=' + p.id + '" class="relative border border-slate-200 rounded-xl bg-white overflow-hidden flex flex-col transition hover:-translate-y-1 hover:shadow-card">' +
      '<span class="absolute top-2 left-2 z-10 bg-money-deep text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide">Ad</span>' +
      '<div class="p-4 flex flex-col gap-2 flex-1">' +
        '<div class="flex items-start justify-between">' +
          '<span class="rounded-lg bg-money-soft grid place-items-center shrink-0" style="width:42px;height:42px">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="' + p.color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:21px;height:21px">' + window.MFG_ICONS[p.icon] + '</svg></span>' +
          '<span class="text-right"><b class="serif block text-lg text-money leading-none">' + p.stat.value + '</b><small class="text-[10px] text-slate-400">' + p.stat.label + '</small></span>' +
        '</div>' +
        '<h4 class="font-bold text-[15px] leading-snug">' + p.name + '</h4>' +
        '<p class="text-slate-500 text-xs flex-1">' + p.tagline + '</p>' +
        '<span class="text-money font-bold text-xs">' + p.cta + ' →</span>' +
      '</div></a>';
  }
  function adGrid(list) { return '<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">' + list.map(adCard).join("") + '</div>'; }
  function adsPlaceholder() {
    return '<div class="rounded-xl border border-dashed border-slate-300 bg-money-soft p-5 flex items-center gap-4 flex-wrap text-sm text-slate-500">' +
      '<span class="text-[10px] font-extrabold uppercase tracking-wider text-money-deep bg-gold rounded px-2 py-1">Offer slot · Advertising</span>' +
      '<span class="flex-1 min-w-[240px]">Personalized offers render here only after you accept cookies in the Securiti banner. Reject → nothing loads, no ad tracking.</span>' +
      '<button type="button" onclick="showConsentPreferencesPopup()" class="font-semibold text-money underline">Cookie preferences</button>' +
      '</div>';
  }
  function renderAds() {
    var host = document.getElementById("mfg-ads");
    if (!host) return;
    var mkt = marketingConsent();
    var b = readBehavior(), favs = readFavorites();
    var sig = mkt ? ("on|" + JSON.stringify(b.cats) + "|" + favs.join(",")) : "off";
    if (sig === lastAdsSig) return;
    lastAdsSig = sig;
    if (!mkt) { host.innerHTML = adsPlaceholder(); return; }
    var personalized = (b.items.length > 0 || favs.length > 0);
    var cat = personalized ? topKey(categoryScores()) : null;
    var picks = cat ? window.MFG_CATALOG.filter(function (p) { return p.category === cat; })
                    : window.MFG_CATALOG.filter(function (p) { return p.tag === "popular"; });
    if (picks.length < 3) picks = picks.concat(window.MFG_CATALOG.filter(function (p) { return picks.indexOf(p) < 0; }));
    picks = picks.slice(0, 3);
    var headline = cat ? ("Based on your interest in " + cat + " — offers picked for you") : "Featured offers for you";
    host.innerHTML =
      '<div class="rounded-2xl overflow-hidden shadow-card border border-slate-200">' +
        '<div class="flex items-center justify-between gap-3 px-5 py-3" style="background:linear-gradient(90deg,#03291E,#0B7A4B)">' +
          '<span class="text-xs font-extrabold uppercase tracking-wider text-white">✦ Sponsored · personalized for you</span>' +
          '<span class="text-[10px] font-bold text-money-deep bg-gold rounded px-2 py-1 uppercase tracking-wide hidden sm:inline">Ad · shown with consent</span>' +
        '</div>' +
        '<div class="p-5 bg-white">' +
          '<p class="serif text-sm font-bold text-money-deep mb-4">' + headline + '</p>' + adGrid(picks) +
        '</div>' +
      '</div>';
  }

  /* ---- service detail page --------------------------------------------- */
  function renderService() {
    var host = document.getElementById("mfg-service");
    if (!host) return;
    var id = new URLSearchParams(location.search).get("id");
    var p = window.MFG_FIND(id) || window.MFG_CATALOG[0];
    document.title = p.name + " — Halvora Health & Financial";
    recordView(p.id);

    host.innerHTML =
      '<nav class="text-sm text-slate-500 mb-7"><a href="index.html" class="hover:text-money">Home</a> · ' +
        '<a href="index.html#services" class="hover:text-money">' + p.category + '</a> · <span class="text-money-deep">' + p.name + '</span></nav>' +
      '<div class="grid lg:grid-cols-[1fr_.85fr] gap-12 items-start">' +
        '<div>' +
          '<span class="text-xs font-bold tracking-[0.18em] uppercase text-gold-dark">' + p.category + '</span>' +
          '<h1 class="serif text-4xl md:text-5xl font-bold mt-2">' + p.name + '</h1>' +
          '<p class="text-slate-600 mt-4 text-[18px] leading-relaxed">' + p.blurb + '</p>' +
          '<ul class="mt-7 grid sm:grid-cols-2 gap-x-6 gap-y-3.5">' + p.features.map(function (f) {
            return '<li class="flex gap-3 items-start text-[15px]"><span class="w-6 h-6 rounded-full bg-money text-gold grid place-items-center shrink-0 text-[13px]">✓</span>' + f + '</li>'; }).join("") + '</ul>' +
          '<div class="flex flex-wrap gap-3.5 mt-8">' +
            '<button class="inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-md bg-money text-white hover:bg-money-dark transition">' + p.cta + ' →</button>' +
            '<button class="inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-md border-[1.5px] border-money text-money hover:bg-money hover:text-white transition">Talk to a coach</button>' +
            heartHtml(p.id, "button") +
          '</div>' +
          '<p class="text-slate-400 text-[11px] mt-5 max-w-lg leading-relaxed">Details shown are illustrative for demonstration purposes only. Halvora is a fictitious brand; HSA eligibility and tax treatment follow IRS rules.</p>' +
        '</div>' +
        '<aside class="rounded-2xl shadow-hi overflow-hidden text-white sticky top-24" style="background:linear-gradient(160deg,#03291E,#064E3B 60%,#0B7A4B)">' +
          '<div class="p-8">' +
            '<span class="inline-grid place-items-center rounded-2xl bg-white/10 border border-white/15 mb-5" style="width:64px;height:64px">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="#C9A227" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="width:32px;height:32px">' + window.MFG_ICONS[p.icon] + '</svg></span>' +
            '<div class="serif text-5xl font-bold">' + p.stat.value + '</div>' +
            '<div class="text-gold text-sm font-semibold tracking-wide uppercase mt-1">' + p.stat.label + '</div>' +
            '<p class="text-white/70 text-sm mt-4">' + p.tagline + '</p>' +
            '<a href="#" class="w-full inline-flex justify-center font-semibold px-5 py-3 rounded-md bg-gold text-money-deep hover:bg-gold-dark transition mt-6">' + p.cta + '</a>' +
          '</div>' +
        '</aside>' +
      '</div>';

    var more = window.MFG_CATALOG.filter(function (x) { return x.category === p.category && x.id !== p.id; });
    if (more.length < 3) more = more.concat(window.MFG_CATALOG.filter(function (x) { return x.id !== p.id && more.indexOf(x) < 0; }));
    more = more.slice(0, 3);
    var moreHost = document.getElementById("mfg-more");
    if (moreHost) moreHost.innerHTML = '<h2 class="serif text-2xl font-bold mb-6">More in ' + p.category + '</h2>' + grid(more);
    window.MFG_SYNC_HEARTS();
  }

  function run() { renderService(); renderHome(); renderAds(); window.MFG_SYNC_HEARTS(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
  setInterval(function () { renderHome(); renderAds(); }, 1500);
})();
