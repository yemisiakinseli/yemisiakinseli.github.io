(function () {
  "use strict";

  var root = document.documentElement;
  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  /* ---------- Theme: follows the device until the visitor picks one ---------- */
  try {
    var saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);
  } catch (e) {}

  /* ---------- Listeners that live on the document (bound once) ---------- */
  var globalBound = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var bar = $("#progress"), toTop = $("#toTop"), nav = $("#nav");
    if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    if (toTop) toTop.classList.toggle("show", y > 700);
    if (nav) nav.classList.toggle("scrolled", y > 8);
  }
  function setMenu(open) {
    var btn = $("#menuBtn"), links = $("#navLinks");
    if (!btn || !links) return;
    links.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  function bindGlobal() {
    if (globalBound) return;
    globalBound = true;
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    document.addEventListener("click", function (e) {
      var links = $("#navLinks"), btn = $("#menuBtn");
      if (links && btn && !links.contains(e.target) && !btn.contains(e.target)) setMenu(false);
    });
  }

  /* ---------- Filter + search for any list ---------- */
  function initFilterable(box) {
    var toggles = $$("[data-toggle]", box);
    var input = $("[data-search]", box);
    var items = $$("[data-item]", box);
    var empties = $$("[data-empty]", box);
    var note = $("[data-note]", box);
    var texts = items.map(function (it) { return it.textContent.toLowerCase().replace(/\s+/g, " "); });
    var active = toggles.filter(function (t) { return t.classList.contains("is-active"); })[0];
    var f = active ? active.getAttribute("data-toggle") : "all";
    var q = "";

    function apply() {
      var shown = 0;
      items.forEach(function (it, i) {
        var types = (it.getAttribute("data-type") || "").split(" ");
        var ok = (f === "all" || types.indexOf(f) !== -1) && (!q || texts[i].indexOf(q) !== -1);
        it.hidden = !ok;
        if (ok) { shown++; it.classList.remove("pre"); }
      });
      empties.forEach(function (e) { e.hidden = true; });
      if (!shown) {
        var pick = null;
        if (!q) pick = empties.filter(function (e) { return e.getAttribute("data-for") === f; })[0];
        if (!pick) pick = empties.filter(function (e) { return !e.getAttribute("data-for"); })[0];
        if (pick) pick.hidden = false;
      }
      if (note) note.textContent = shown + (shown === 1 ? " result" : " results");
      var wide = $("[data-autowide]", box);
      if (wide) {
        var vis = items.filter(function (it) { return !it.hidden; });
        items.forEach(function (it) { it.classList.remove("card-feature"); });
        if (vis.length % 2 === 1) vis[0].classList.add("card-feature");
      }
    }

    toggles.forEach(function (t) {
      t.addEventListener("click", function () {
        f = t.getAttribute("data-toggle");
        toggles.forEach(function (o) {
          var on = o === t;
          o.classList.toggle("is-active", on);
          o.setAttribute("aria-pressed", String(on));
        });
        apply();
      });
    });
    if (input) input.addEventListener("input", function () { q = input.value.trim().toLowerCase(); apply(); });
    apply();
  }

  /* ---------- Works: search categories and projects ---------- */
  function initWorksSearch() {
    var input = $("[data-works-search]");
    if (!input) return;
    var cats = $$("[data-cat-item]");
    var results = $("#projectResults");
    var projs = $$("[data-proj]");
    var empty = $("#worksEmpty");
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      var catShown = 0, projShown = 0;
      cats.forEach(function (c) {
        var ok = !q || c.getAttribute("data-text").toLowerCase().indexOf(q) !== -1;
        c.hidden = !ok;
        if (ok) { catShown++; c.classList.remove("pre"); }
      });
      projs.forEach(function (p) {
        var ok = q && p.getAttribute("data-text").toLowerCase().indexOf(q) !== -1;
        p.hidden = !ok;
        if (ok) projShown++;
      });
      if (results) results.hidden = !q || projShown === 0;
      if (empty) empty.hidden = !q || (catShown + projShown) > 0;
    });
  }

  /* ---------- Experience cards open a details panel ---------- */
  function initExperience() {
    var dlg = $("#xpDialog");
    var cards = $$(".xp-card");
    if (!cards.length) return;
    var canModal = dlg && typeof dlg.showModal === "function";
    cards.forEach(function (card) {
      var btn = $("[data-xp]", card);
      if (!btn) return;
      btn.addEventListener("click", function () {
        if (!canModal) { card.classList.toggle("open"); return; }
        $("#xpMeta", dlg).innerHTML = "";
        var badge = $(".badge", card);
        if (badge) { var b = document.createElement("span"); b.className = "badge"; b.textContent = badge.textContent; $("#xpMeta", dlg).appendChild(b); }
        var when = $(".xp-when", card);
        if (when) { var w = document.createElement("span"); w.className = "mono xp-when"; w.textContent = when.textContent; $("#xpMeta", dlg).appendChild(w); }
        $("#xpTitle", dlg).textContent = btn.textContent;
        $("#xpOrg", dlg).textContent = $(".xp-org", card).textContent;
        var list = $("#xpList", dlg);
        list.innerHTML = "";
        $$(".xp-detail li", card).forEach(function (li) {
          var n = document.createElement("li"); n.textContent = li.textContent; list.appendChild(n);
        });
        dlg.showModal();
      });
    });
    if (canModal) {
      var close = $(".xp-close", dlg);
      if (close) close.addEventListener("click", function () { dlg.close(); });
      dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    }
  }

  /* ---------- Links like experience.html#edu-futminna scroll to and mark that card ---------- */
  function initDeepLink() {
    var id = window.__PREVIEW ? (window.__DEEP || "") : location.hash.replace(/^#/, "");
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.remove("pre");
    el.classList.add("is-target");
    setTimeout(function () { el.scrollIntoView({ behavior: "smooth", block: "center" }); }, 250);
  }

  /* ---------- Browser tab icon follows photo.jpg when the site is hosted ---------- */
  function initFavicon() {
    if (window.__PREVIEW) return;
    try {
      var img = new Image();
      img.onload = function () {
        try {
          var c = document.createElement("canvas");
          c.width = c.height = 64;
          var x = c.getContext("2d");
          var s = Math.min(img.width, img.height);
          x.beginPath(); x.arc(32, 32, 32, 0, Math.PI * 2); x.clip();
          x.drawImage(img, (img.width - s) / 2, 0, s, s, 0, 0, 64, 64);
          var url = c.toDataURL("image/jpg");
          var link = $('link[rel="icon"]');
          if (link) link.setAttribute("href", url);
        } catch (e) {}
      };
      img.src = "photo.jpg";
    } catch (e) {}
  }

  /* ---------- Page setup (runs on every page load) ---------- */
  function init() {
    bindGlobal();

    var themeBtn = $("#themeBtn");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        var current = root.getAttribute("data-theme");
        if (!current) current = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        var next = current === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        try { localStorage.setItem("theme", next); } catch (e) {}
      });
    }

    var menuBtn = $("#menuBtn");
    if (menuBtn) menuBtn.addEventListener("click", function () { setMenu(menuBtn.getAttribute("aria-expanded") !== "true"); });

    var toTop = $("#toTop");
    if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    onScroll();

    /* Fade-in for things below the fold */
    var reveals = $$(".reveal");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.remove("pre"); io.unobserve(en.target); }
        });
      }, { threshold: 0.1 });
      reveals.forEach(function (el, i) {
        if (el.getBoundingClientRect().top > window.innerHeight * 0.92) {
          el.style.transitionDelay = (i % 3) * 70 + "ms";
          el.classList.add("pre");
          io.observe(el);
        }
      });
    }

    $$("[data-filterable]").forEach(initFilterable);
    initWorksSearch();

    initExperience();
    initDeepLink();
    initFavicon();

    /* Copy email */
    $$("[data-copy]").forEach(function (btn) {
      var label = $(".copy-label", btn);
      var original = label ? label.textContent : "";
      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-copy");
        function done(ok) {
          if (!label) return;
          label.textContent = ok ? "Copied" : "Select and copy it above";
          setTimeout(function () { label.textContent = original; }, 2000);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
        } else { done(false); }
      });
    });

    /* Contact form opens the visitor's email app */
    var form = $("#contactForm");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var name = $("#cName").value.trim();
        var topic = $("#cTopic").value;
        var msg = $("#cMsg").value.trim();
        var body = msg + (name ? "\n\n" + name : "");
        window.location.href = "mailto:" + form.getAttribute("data-to") +
          "?subject=" + encodeURIComponent(topic) + "&body=" + encodeURIComponent(body);
      });
    }

    var y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
  }

  window.PortfolioInit = init;
  if (!window.__PREVIEW) init();
})();
