/* ============================================================
   DEVFORGE — APP
   Renders every section from DEVFORGE (js/config.js), then wires
   navigation, theme, project filters, the detail dialog and the
   back-to-top button.
   ============================================================ */

(function () {
  "use strict";

  const CFG = window.DEVFORGE;
  if (!CFG) return;

  /* ============================================================
     1. HERO + IDENTITY
     ============================================================ */
  function renderHeadline() {
    const h1 = $("#heroTitle");
    if (!h1) return;

    const full = String(CFG.hero.headline || "");
    const accent = String(CFG.hero.headlineAccent || "");

    h1.textContent = "";
    if (accent && full.slice(-accent.length) === accent) {
      h1.appendChild(document.createTextNode(full.slice(0, full.length - accent.length)));
      const span = document.createElement("span");
      span.className = "grad";
      span.textContent = accent;
      h1.appendChild(span);
    } else {
      h1.textContent = full;
    }
  }

  function renderIdentity() {
    const p = CFG.profile;

    document.title = CFG.meta.title;
    const desc = $('meta[name="description"]');
    if (desc) desc.setAttribute("content", CFG.meta.description);

    // The headline keeps its gradient accent span. setText() would delete it,
    // so the last phrase is rebuilt as a real element.
    renderHeadline();
    setText("#heroRole", p.headlineRole);
    setText("#heroLede", CFG.hero.lede);
    setText("#heroName", p.name);
    setText("#heroLocation", p.location);
    setText("#footName", p.name);
    setText("#year", String(new Date().getFullYear()));
    setText("#footerBlurb", CFG.footer.blurb);
    setText("#builtWith", CFG.footer.builtWith);

    const links = p.links || {};
    [["#headerGithub", links.github], ["#footGithub", links.github],
     ["#footLinkedin", links.linkedin], ["#footPortfolio", links.portfolio]
    ].forEach(([sel, href]) => {
      const a = $(sel);
      if (a && href) {
        a.href = href;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
    });

    // Featured skill chips
    $("#heroSkills").innerHTML = (CFG.hero.featuredSkills || [])
      .map((s) => `<li class="chip">${esc(s)}</li>`)
      .join("");

    // Hero meta list
    const meta = [];
    meta.push(`<div><dt>Location</dt><dd>${esc(p.location)}</dd></div>`);
    if (p.showEmail && p.email) {
      meta.push(`<div><dt>Email</dt><dd><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></dd></div>`);
    }
    if (p.showPhone && p.phone) {
      meta.push(`<div><dt>Phone</dt><dd>${esc(p.phone)}</dd></div>`);
    }
    if (links.github) {
      meta.push(`<div><dt>GitHub</dt><dd><a href="${escUrl(links.github)}" target="_blank" rel="noopener noreferrer">${esc(links.github.replace(/^https:\/\//, ""))}</a></dd></div>`);
    }
    $("#heroMeta").innerHTML = meta.join("");

    // Avatar with initials fallback
    const avatar = $("#heroAvatar");
    const badge = $(".avatar-initials", avatar);
    if (badge) badge.textContent = p.initials || "";

    if (avatar && p.photo) {
      const img = new Image();
      img.alt = p.photoAlt || "Portrait of " + p.name;
      img.width = 336;
      img.height = 336;
      img.decoding = "async";
      img.addEventListener("load", () => avatar.classList.add("has-image"));
      img.addEventListener("error", () => img.remove());
      img.src = p.photo;
      avatar.prepend(img);
    }
  }

  /* ============================================================
     2. ABOUT
     ============================================================ */
  function renderAbout() {
    const a = CFG.about;

    setText("#aboutTitle", a.heading);
    setText("#aboutLede", a.lede);

    $("#aboutParagraphs").innerHTML = (a.paragraphs || [])
      .map((t) => `<p>${esc(t)}</p>`)
      .join("");

    setText("#goalTitle", a.goal.title);
    setText("#goalText", a.goal.text);

    $("#interestsList").innerHTML = (a.interests || [])
      .map((t) => `<li>${esc(t)}</li>`)
      .join("");

    $("#educationTimeline").innerHTML = (a.education || []).map((e) => `
      <li>
        <span class="t-period">${esc(e.period)}</span>
        <span class="t-title">${esc(e.title)}</span>
        <span class="t-org">${esc(e.org)}</span>
        <span class="t-detail">${esc(e.detail)}</span>
      </li>`).join("");

    $("#lessonsList").innerHTML = (a.lessons || []).map((l) => `
      <li><strong>${esc(l.title)}</strong><span>${esc(l.body)}</span></li>`).join("");
  }

  /* ============================================================
     3. SKILLS
     ============================================================ */
  function renderSkills() {
    setText("#skillsIntro", CFG.skills.intro);

    $("#skillsGrid").innerHTML = (CFG.skills.categories || []).map((cat) => `
      <article class="card skill-card reveal">
        <header class="skill-head">
          <span class="skill-icon" aria-hidden="true">${esc(cat.icon)}</span>
          <h3>${esc(cat.name)}</h3>
        </header>
        <p class="skill-blurb">${esc(cat.blurb)}</p>
        <div class="skill-items">
          ${(cat.items || []).map((it) => `
            <div class="skill-item">
              <div class="skill-top">
                <span class="skill-name">${esc(it.name)}</span>
                <span class="badge ${it.level === "current" ? "badge-current" : "badge-learning"}">${it.level === "current" ? "Current" : "Learning"}</span>
              </div>
              <span class="skill-note">${esc(it.note)}</span>
            </div>`).join("")}
        </div>
      </article>`).join("");
  }

  /* ============================================================
     4. SPECIALIZATION DETAILS
     ============================================================ */
  function renderSpecialization() {
    const s = CFG.specialization;

    setText("#specIntro", s.intro);
    setText("#specBackgroundText", s.background);
    setText("#specProblemText", s.problem);

    const list = (arr) => (arr || []).map((t) => `<li>${esc(t)}</li>`).join("");
    $("#objGeneral").innerHTML = list(s.objectives.general);
    $("#objSpecific").innerHTML = list(s.objectives.specific);
    $("#featureList").innerHTML = list(s.features);
    $("#futureList").innerHTML = list(s.future.map((f) => f.title + " — " + f.body));

    $("#targetUsers").innerHTML = (s.targetUsers || []).map((u) => `
      <li><strong>${esc(u.who)}</strong><span>${esc(u.need)}</span></li>`).join("");

    $("#techList").innerHTML = (s.technologies || []).map((t) => `
      <li><b>${esc(t.name)}</b><span>${esc(t.role)}</span></li>`).join("");

    $("#processTimeline").innerHTML = (s.process || []).map((p) => `
      <li>
        <span class="t-title">${esc(p.phase)}</span>
        <span class="t-detail">${esc(p.body)}</span>
      </li>`).join("");

    $("#challengeList").innerHTML = (s.challenges || []).map((c) => `
      <div>
        <strong>${esc(c.title)}</strong>
        <span><b>Problem:</b> ${esc(c.problem)}</span>
        <span><b>Solution:</b> ${esc(c.solution)}</span>
      </div>`).join("");
  }

  /* ============================================================
     5. PROJECTS + FILTERS + DIALOG
     ============================================================ */
  let activeFilter = "all";
  let lastFocused = null;

  function projectCard(p) {
    const missing = CFG.projects.missingLinkLabel;
    const demo = p.demo
      ? `<a class="link-btn" href="${escUrl(p.demo)}" target="_blank" rel="noopener noreferrer">Live ↗</a>`
      : `<span class="link-btn" aria-disabled="true">${esc(missing)}</span>`;
    const repo = p.repo
      ? `<a class="link-btn" href="${escUrl(p.repo)}" target="_blank" rel="noopener noreferrer">Code ↗</a>`
      : `<span class="link-btn" aria-disabled="true">${esc(missing)}</span>`;

    return `
      <article class="card project-card" data-category="${esc(p.category)}" data-id="${esc(p.id)}"
               tabindex="0" role="button" aria-label="View details for ${esc(p.title)}">
        <div class="project-thumb">
          <img src="${esc(p.thumbnail)}" alt="" loading="lazy" width="640" height="360" />
        </div>
        <div class="project-body">
          <h3 class="project-title">${esc(p.title)}</h3>
          <p class="project-summary">${esc(p.summary)}</p>
          <div class="tag-row">${(p.tags || []).map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
          <div class="project-foot">
            <div class="project-links">${demo}${repo}</div>
            ${p.year ? `<span class="chip">${esc(p.year)}</span>` : ""}
          </div>
        </div>
      </article>`;
  }

  function renderProjectFilters() {
    const items = CFG.projects.items || [];
    $("#projectFilters").innerHTML = (CFG.projects.filters || []).map((f) => {
      const count = f.id === "all" ? items.length : items.filter((p) => p.category === f.id).length;
      return `<button class="filter-btn" type="button" data-filter="${esc(f.id)}"
                aria-pressed="${f.id === activeFilter}">${esc(f.label)}<span class="count">${count}</span></button>`;
    }).join("");
  }

  function applyProjectFilter(filter) {
    activeFilter = filter;
    const items = CFG.projects.items || [];
    const visible = filter === "all" ? items : items.filter((p) => p.category === filter);

    $("#projectGrid").innerHTML = visible.map(projectCard).join("");
    $("#projectCount").textContent =
      "Showing " + visible.length + " of " + items.length + " project" + (items.length === 1 ? "" : "s");
    $("#projectEmpty").hidden = visible.length !== 0;

    $$("#projectFilters .filter-btn").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.filter === filter));
    });
  }

  function initProjectFilters() {
    setText("#projectsIntro", CFG.projects.intro);
    renderProjectFilters();
    applyProjectFilter("all");

    $("#projectFilters").addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      applyProjectFilter(btn.dataset.filter);
    });
  }

  /* showModal()/close() are used when the browser supports them. Older
     engines and some test environments lack them, so fall back to toggling the
     `open` attribute rather than throwing. */
  function openDialog(dialog) {
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function closeDialog(dialog) {
    const native = typeof dialog.close === "function";
    if (native) dialog.close();
    else dialog.removeAttribute("open");
    // The `close` event only fires on the native path.
    if (!native && lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  function openProject(id) {
    const p = (CFG.projects.items || []).find((x) => x.id === id);
    const dialog = $("#projectDialog");
    if (!p || !dialog) return;

    lastFocused = document.activeElement;

    $("#dialogTitle").textContent = p.title;
    $("#dialogBody").innerHTML = `
      <div class="tag-row">${(p.tags || []).map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
      <h4>The problem</h4><p>${esc(p.problem)}</p>
      <h4>My approach</h4><p>${esc(p.approach)}</p>
      <h4>The outcome</h4><p>${esc(p.outcome)}</p>
      <h4>What it taught me</h4><p>${esc(p.lessons)}</p>
      <div class="dialog-foot">
        ${p.demo ? `<a class="btn btn-primary btn-sm" href="${escUrl(p.demo)}" target="_blank" rel="noopener noreferrer">Open live demo</a>` : ""}
        ${p.repo ? `<a class="btn btn-ghost btn-sm" href="${escUrl(p.repo)}" target="_blank" rel="noopener noreferrer">View source code</a>` : ""}
      </div>`;

    openDialog(dialog);
    const closeBtn = $("#dialogClose");
    if (closeBtn) closeBtn.focus();
  }

  function initProjectDialog() {
    const dialog = $("#projectDialog");

    $("#projectGrid").addEventListener("click", (e) => {
      // Links inside the card must keep their normal behaviour.
      if (e.target.closest("a")) return;
      const card = e.target.closest(".project-card");
      if (card) openProject(card.dataset.id);
    });

    $("#projectGrid").addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const card = e.target.closest(".project-card");
      if (!card) return;
      e.preventDefault();
      openProject(card.dataset.id);
    });

    $("#dialogClose").addEventListener("click", () => closeDialog(dialog));
    dialog.addEventListener("click", (e) => {
      // Clicking the backdrop (outside the dialog box) closes it.
      if (e.target === dialog) closeDialog(dialog);
    });
    dialog.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && typeof dialog.close !== "function" && dialog.hasAttribute("open")) {
        closeDialog(dialog);
      }
    });
    dialog.addEventListener("close", () => {
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    });
  }

  /* ============================================================
     6. NAVIGATION, THEME, SCROLL UI
     ============================================================ */
  function initHeaderScroll() {
    const header = $("#siteHeader");
    const toTop = $("#toTop");
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      header.classList.toggle("scrolled", y > 8);
      toTop.hidden = y < 400;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    toTop.addEventListener("click", () => {
      const reduce = prefersReducedMotion();
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      // Return focus to the top of the document for keyboard users.
      const skip = $(".skip-link");
      if (skip) skip.focus({ preventScroll: true });
    });
  }

  function initMobileMenu() {
    const btn = $("#menuBtn");
    const menu = $("#mobileMenu");
    const setOpen = (open) => {
      menu.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    btn.addEventListener("click", () => setOpen(menu.hidden));
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !menu.hidden) {
        setOpen(false);
        btn.focus();
      }
    });
  }

  function initTheme() {
    // DevForge's identity is the dark navy theme, so it is the default.
    // A visitor's explicit choice is remembered and always wins.
    applyTheme(getStoredTheme() || "dark");

    $("#themeToggle").addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      storeTheme(applyTheme(next));
    });
  }

  function initScrollSpy() {
    const links = $$("#navList a");
    if (!links.length || typeof IntersectionObserver !== "function") return;

    const byId = {};
    links.forEach((a) => { byId[a.getAttribute("href").slice(1)] = a; });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.remove("active"));
        const link = byId[entry.target.id];
        if (link) link.classList.add("active");
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    Object.keys(byId).forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  function initReveal() {
    const items = $$(".reveal");
    if (!items.length) return;

    if (typeof IntersectionObserver !== "function" || prefersReducedMotion()) {
      items.forEach((el) => el.classList.add("visible"));
      return;
    }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    items.forEach((el) => io.observe(el));
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function boot() {
    renderIdentity();
    renderAbout();
    renderSkills();
    renderSpecialization();
    initProjectFilters();
    initProjectDialog();
    initHeaderScroll();
    initMobileMenu();
    initTheme();
    initScrollSpy();
    initReveal();

    // Re-run reveal for cards rendered after the first pass.
    if (typeof IntersectionObserver === "function") initReveal();

    document.documentElement.setAttribute("data-app-ready", "true");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // Exposed for the automated test suite.
  window.DevForgeApp = {
    applyProjectFilter: applyProjectFilter,
    openProject: openProject,
    renderProjectFilters: renderProjectFilters
  };
})();
