/* ==========================================================================
   Meridian Financial Group — front-end behaviour
   --------------------------------------------------------------------------
   Cookie consent is owned by the SECURITI Cookie Consent SDK (loaded in
   <head>). Securiti renders the banner + preference center and drives Google
   Consent Mode. Footer links call Securiti's showConsentPreferencesPopup().

   The shim below only provides a friendly fallback if a visitor clicks before
   the Securiti SDK finishes loading. It never overrides Securiti's function.
   ========================================================================== */
(function () {
  "use strict";
  if (typeof window.showConsentPreferencesPopup !== "function") {
    window.showConsentPreferencesPopup = function () {
      if (typeof window.initCmp === "function") { try { window.initCmp(); } catch (e) {} }
      alert("Loading cookie preferences… please try again in a moment.");
      return false;
    };
    window.showConsentPreferencesPopup.__isFallback = true;
  }

  /* ---- Products & services grid (shared catalog.js) -------------------- */
  // Run immediately if the DOM is already parsed (scripts can execute after
  // DOMContentLoaded when cached); otherwise wait for it.
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderServices);
  else renderServices();

  function renderServices() {
    var grid = document.getElementById("mfg-services");
    if (!grid || !window.MFG_CATALOG) return;
    grid.innerHTML = window.MFG_CATALOG.map(function (p) {
      var badge = p.tag === "popular"
        ? '<span class="ml-2 inline-block align-middle bg-gold text-money-deep text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide">Popular</span>'
        : (p.tag === "new" ? '<span class="ml-2 inline-block align-middle bg-money text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide">New</span>' : '');
      return '<a href="service.html?id=' + p.id + '" class="group border border-slate-200 rounded-xl bg-white overflow-hidden flex flex-col transition hover:-translate-y-1 hover:shadow-card hover:border-transparent">' +
        '<div class="p-6 flex flex-col gap-3 flex-1">' +
          '<div class="flex items-start justify-between gap-3">' +
            '<span class="rounded-xl bg-money-soft grid place-items-center shrink-0" style="width:52px;height:52px">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="' + p.color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:26px;height:26px">' + window.MFG_ICONS[p.icon] + '</svg></span>' +
            '<span class="text-right pt-1"><b class="serif block text-xl text-money leading-none">' + p.stat.value + '</b>' +
              '<small class="text-[11px] text-slate-400">' + p.stat.label + '</small></span>' +
          '</div>' +
          '<div><span class="text-[11px] font-bold tracking-[0.14em] uppercase text-gold-dark">' + p.category + '</span>' + badge +
            '<h3 class="font-bold text-[17px] leading-snug mt-0.5">' + p.name + '</h3></div>' +
          '<p class="text-slate-500 text-sm flex-1">' + p.tagline + '</p>' +
          '<div class="mt-1 flex items-center justify-between pt-1">' +
            '<span class="text-money font-bold text-sm inline-flex items-center gap-1.5 group-hover:text-gold-dark">Learn more →</span>' +
            (window.MFG_HEART_HTML ? window.MFG_HEART_HTML(p.id, "inline") : "") +
          '</div>' +
        '</div>' +
      '</a>';
    }).join("");
  }
})();
