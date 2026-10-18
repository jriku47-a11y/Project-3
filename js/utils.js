/* ============================================================
   DEVFORGE — UTILITIES
   Small, dependency-free helpers shared by the other modules.
   ============================================================ */

/* ---------- DOM ---------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/**
 * Escape untrusted text before it is placed in innerHTML.
 * Every value coming from the config file or from user input passes
 * through here, so a stray < or & can never become markup.
 */
function esc(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Escape a value used inside a URL attribute. */
function escUrl(value) {
  const s = String(value || "").trim();
  if (!/^(https?:|mailto:|tel:)/i.test(s)) return "";
  return esc(s);
}

function setText(sel, value, root = document) {
  const n = $(sel, root);
  if (n && value !== null && value !== undefined && value !== "") n.textContent = value;
  return n;
}

/* ---------- Formatting ---------- */
function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" });
}

function isOverdue(iso) {
  if (!iso) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return false;
  return d.getTime() < today.getTime();
}

/* ---------- Storage ----------
   Every read is guarded: private-mode browsers and corrupt JSON must
   never break the page. A failed read simply returns the fallback. */
const Store = {
  read(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return fallback;
      const parsed = JSON.parse(raw);
      return parsed === null || parsed === undefined ? fallback : parsed;
    } catch (err) {
      return fallback;
    }
  },
  write(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      // Quota exceeded or storage blocked (private browsing).
      return false;
    }
  },
  remove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      /* nothing useful to do */
    }
  }
};

/* ---------- Theme ---------- */
const THEME_KEY = "devforge.theme";

function getStoredTheme() {
  try {
    const v = window.localStorage.getItem(THEME_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch (err) {
    return null;
  }
}

function storeTheme(theme) {
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    /* storage blocked — the theme still applies for this page view */
  }
}

/** True when the visitor has asked for reduced animation. */
function prefersReducedMotion() {
  return typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Apply a theme to <html> and keep the toggle's accessible state correct. */
function applyTheme(theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);

  const btn = $("#themeToggle");
  if (btn) {
    const next = theme === "dark" ? "light" : "dark";
    btn.setAttribute("aria-label", "Switch to " + next + " theme");
    btn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
  }
  return theme;
}

/* ---------- Toast ---------- */
let toastTimer = null;

/** Show a transient status message. Hidden from assistive tech because the
    status regions on the forms already announce the same information. */
function toast(message) {
  const el = $("#toast");
  if (!el || !message) return;
  el.textContent = message;
  el.hidden = false;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.hidden = true;
  }, 2600);
}

/* ---------- Misc ---------- */
function debounce(fn, wait) {
  let timer = null;
  return function debounced(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

/** Deterministic pseudo-random id that works without crypto in old browsers. */
function makeId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return "t-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9);
}
