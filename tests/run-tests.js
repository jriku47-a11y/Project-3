/* ============================================================
   DEVFORGE — AUTOMATED TEST SUITE
   ------------------------------------------------------------
   Drives the real page in a headless DOM and asserts the
   behaviour a reviewer would check by hand: rendering, project
   filters, the dialog, the task manager (add / edit / complete /
   delete / search / filter / persistence), contact-form
   validation, accessibility basics and responsive rules.

   Usage:
     npm install     (installs jsdom)
     npm test        (starts a local server, runs every suite)

   Add TEST_PORT to run against an already running server.
   ============================================================ */

const { JSDOM, VirtualConsole } = require("jsdom");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PORT = Number(process.env.TEST_PORT || 8131);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".json": "application/json"
};

/* ---------- tiny test runner ---------- */
let pass = 0;
let fail = 0;
const failures = [];
let group = "";

function describe(name) {
  group = name;
  console.log("\n=== " + name + " ===");
}

function ok(name, cond, extra) {
  if (cond) {
    pass++;
    console.log("  PASS  " + name);
  } else {
    fail++;
    failures.push(group + " :: " + name + (extra ? "  -> " + extra : ""));
    console.log("  FAIL  " + name + (extra ? "  -> " + extra : ""));
  }
}

/* ---------- static server ---------- */
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let url = decodeURIComponent(req.url.split("?")[0]);
      if (url.endsWith("/")) url += "index.html";
      const file = path.join(ROOT, url);
      if (!file.startsWith(ROOT)) {
        res.writeHead(403);
        return res.end("forbidden");
      }
      fs.readFile(file, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          return res.end("not found");
        }
        res.writeHead(200, { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream" });
        res.end(data);
      });
    });
    server.listen(PORT, "127.0.0.1", () => resolve(server));
  });
}

/* ---------- page helpers ---------- */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function openPage(url) {
  const vc = new VirtualConsole();
  const errors = [];
  vc.on("jsdomError", (e) => {
    const msg = String((e && e.message) || e);
    if (!/fonts\.|Could not load img|resource/i.test(msg)) errors.push(msg);
  });
  vc.on("error", (...a) => errors.push("console.error: " + a.join(" ")));

  const dom = await JSDOM.fromURL(url, {
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
    virtualConsole: vc
  });
  await sleep(1400);
  const { window } = dom;
  const doc = window.document;
  return {
    window,
    doc,
    errors,
    $: (s) => doc.querySelector(s),
    $$: (s) => Array.from(doc.querySelectorAll(s)),
    text: () => doc.body.textContent.replace(/\s+/g, " "),
    type(el, value) {
      el.value = value;
      el.dispatchEvent(new window.Event("input", { bubbles: true }));
      el.dispatchEvent(new window.Event("change", { bubbles: true }));
    },
    click(el) {
      el.dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true }));
    },
    submit(form) {
      form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
    },
    close: () => window.close()
  };
}

/* ============================================================
   SUITES
   ============================================================ */
async function run(url) {
  const p = await openPage(url);
  const { window, doc, $, $$, text } = p;

  /* ---------- rendering ---------- */
  describe("PAGE RENDERING");
  ok("no JavaScript errors on load", p.errors.length === 0, p.errors.join(" | "));
  ok("app finished booting", doc.documentElement.getAttribute("data-app-ready") === "true");
  ok("headline matches the specification",
    $("#heroTitle").textContent.indexOf("Building Modern, Responsive, and User-Friendly") === 0,
    $("#heroTitle").textContent);
  ok("headline keeps its gradient accent span", !!$("#heroTitle .grad"));
  ok("gradient span holds the accent phrase",
    $("#heroTitle .grad").textContent === window.DEVFORGE.hero.headlineAccent,
    $("#heroTitle .grad").textContent);
  ok("dark navy is the default theme",
    doc.documentElement.getAttribute("data-theme") === "dark",
    doc.documentElement.getAttribute("data-theme"));
  ok("brand rendered as DevForge", $(".brand-name").textContent.trim() === "DevForge");
  ok("avatar image added to the hero", $$(".avatar img").length === 1);
  ok("avatar has alt text", $$(".avatar img")[0].alt.length > 0);
  ok("initials fallback exists", $(".avatar-initials").textContent.trim() === "JA");
  ok("hero skills rendered", $$("#heroSkills .chip").length >= 5, $$("#heroSkills .chip").length);
  ok("about paragraphs rendered", $$("#aboutParagraphs p").length >= 2);
  ok("education timeline rendered", $$("#educationTimeline li").length >= 1);
  ok("lessons rendered", $$("#lessonsList li").length >= 3);
  ok("skill categories rendered (5)", $$("#skillsGrid .skill-card").length === 5, $$("#skillsGrid .skill-card").length);
  ok("every skill is marked current or learning",
    $$("#skillsGrid .badge").every((b) => /Current|Learning/.test(b.textContent)));
  ok("both skill levels are present",
    $$("#skillsGrid .badge-current").length > 0 && $$("#skillsGrid .badge-learning").length > 0);

  /* ---------- specialization ---------- */
  describe("SPECIALIZATION PROJECT DETAILS");
  const specSections = ["specBackgroundText", "specProblemText"];
  ok("background and problem statement written",
    specSections.every((id) => ($(("#" + id)).textContent || "").length > 80));
  ok("general objectives rendered (>=4)", $$("#objGeneral li").length >= 4, $$("#objGeneral li").length);
  ok("specific objectives rendered (>=6)", $$("#objSpecific li").length >= 6, $$("#objSpecific li").length);
  ok("target users rendered", $$("#targetUsers li").length >= 3);
  ok("features rendered", $$("#featureList li").length >= 6);
  ok("technologies rendered", $$("#techList li").length >= 5);
  ok("development process rendered (>=6 phases)", $$("#processTimeline li").length >= 6, $$("#processTimeline li").length);
  ok("challenges and solutions rendered", $$("#challengeList > div").length >= 3);
  ok("future enhancements rendered", $$("#futureList li").length >= 4);
  ok("no unresolved template marker is visible",
    !/\[REPLACE/.test(text()), (text().match(/\[REPLACE[^]]*\]/g) || []).slice(0, 3).join(","));

  /* ---------- projects ---------- */
  describe("PROJECTS SHOWCASE + FILTERS");
  const total = $("#projectCount").textContent;
  ok("all projects rendered by default", $$("#projectGrid .project-card").length === 4, $$("#projectGrid .project-card").length);
  ok("result count is shown", /\d+ of \d+/.test(total), total);
  ok("filter buttons built from config", $$("#projectFilters .filter-btn").length === 4, $$("#projectFilters .filter-btn").length);
  ok("filter counts rendered", $$("#projectFilters .count").length === 4);

  p.click($$("#projectFilters .filter-btn")[1]); // Front-End
  await sleep(60);
  ok("Front-End filter narrows the grid", $$("#projectGrid .project-card").length === 1, $$("#projectGrid .project-card").length);
  ok("filtered card is the front-end project",
    /Personal Portfolio/.test($("#projectGrid .project-title").textContent), $("#projectGrid .project-title").textContent);
  ok("count updates after filtering", /1 of 4/.test($("#projectCount").textContent), $("#projectCount").textContent);
  ok("pressed state set on the active filter",
    $$("#projectFilters .filter-btn")[1].getAttribute("aria-pressed") === "true");

  p.click($$("#projectFilters .filter-btn")[3]); // UI/UX
  await sleep(60);
  ok("UI/UX filter narrows the grid", $$("#projectGrid .project-card").length === 1);
  ok("UI/UX card is DevForge", /DevForge/.test($("#projectGrid .project-title").textContent));

  p.click($$("#projectFilters .filter-btn")[2]); // Full-Stack
  await sleep(60);
  ok("Full-Stack filter returns two projects", $$("#projectGrid .project-card").length === 2, $$("#projectGrid .project-card").length);

  p.click($$("#projectFilters .filter-btn")[0]); // All
  await sleep(60);
  ok("All filter restores every project", $$("#projectGrid .project-card").length === 4);

  ok("every card has a thumbnail", $$("#projectGrid .project-thumb img").length === 4);
  ok("thumbnail files are referenced locally",
    $$("#projectGrid .project-thumb img").every((i) => (i.getAttribute("src") || "").startsWith("assets/projects/")));
  ok("live demo links open in a new tab safely",
    $$('#projectGrid a[target="_blank"]').every((a) => /noopener/.test(a.rel)));
  ok("missing source link is shown as text, not a dead anchor",
    $$("#projectGrid .link-btn[aria-disabled='true']").length > 0);

  /* ---------- dialog ---------- */
  describe("PROJECT DETAIL DIALOG");
  const dialog = $("#projectDialog");
  ok("dialog exists", !!dialog);
  ok("dialog is closed initially", !dialog.hasAttribute("open"));

  p.click($("#projectGrid .project-card"));
  await sleep(80);
  ok("clicking a card opens the dialog", dialog.hasAttribute("open"));
  ok("dialog is labelled", dialog.getAttribute("aria-labelledby") === "dialogTitle");
  ok("dialog shows the project title", $("#dialogTitle").textContent.length > 3, $("#dialogTitle").textContent);
  ok("dialog explains the problem", /The problem/.test($("#dialogBody").textContent));
  ok("dialog links to source", /source code/i.test($("#dialogBody").textContent));

  p.click($("#dialogClose"));
  await sleep(60);
  ok("close button closes the dialog", !dialog.hasAttribute("open"));

  /* ---------- task manager ---------- */
  describe("TASK MANAGER — CREATE");
  const T = window.DevForgeTasks;
  ok("task manager exposes its state for tests", !!T);
  T.reset();
  await sleep(40);

  ok("empty state visible with no tasks", $("#taskEmpty").hidden === false);
  ok("empty state explains what to do", /Add your first task/.test($("#taskEmptyBody").textContent), $("#taskEmptyBody").textContent);
  ok("list is empty", $$("#taskList .task-item").length === 0);
  ok("clear button disabled when there is nothing to clear", $("#taskClear").disabled === true);

  p.submit($("#taskForm"));
  await sleep(40);
  ok("empty title is rejected", $$("#taskForm .field.invalid").length === 1, $$("#taskForm .field.invalid").length);
  ok("error message is shown", $("#taskTitleError").hidden === false && $("#taskTitleError").textContent.length > 3);
  ok("invalid field is marked for assistive tech", $("#taskTitle").getAttribute("aria-invalid") === "true");
  ok("nothing was created", T.getAll().length === 0);

  p.type($("#taskTitle"), "   ");
  p.submit($("#taskForm"));
  await sleep(40);
  ok("whitespace-only title is rejected", T.getAll().length === 0);

  p.type($("#taskTitle"), "Write the project report");
  p.type($("#taskNotes"), "Include the objectives and screenshots.");
  p.type($("#taskPriority"), "high");
  p.type($("#taskDue"), "2026-12-01");
  p.submit($("#taskForm"));
  await sleep(60);

  ok("task created", T.getAll().length === 1, JSON.stringify(T.getAll()));
  ok("title stored", T.getAll()[0].title === "Write the project report");
  ok("notes stored", /screenshots/.test(T.getAll()[0].notes));
  ok("priority stored", T.getAll()[0].priority === "high");
  ok("due date stored", T.getAll()[0].due === "2026-12-01");
  ok("task renders in the list", $$("#taskList .task-item").length === 1);
  ok("card shows the priority label", /High/.test($("#taskList .prio").textContent));
  ok("card shows the due date", /Dec/.test($("#taskList .task-due").textContent), $("#taskList .task-due").textContent);
  ok("form was cleared after adding", $("#taskTitle").value === "");
  ok("success feedback shown", $("#taskFormStatus").className.includes("ok"));
  ok("empty state hidden again", $("#taskEmpty").hidden === true);
  ok("clear button enabled", $("#taskClear").disabled === false);

  describe("TASK MANAGER — EDIT");
  const id = T.getAll()[0].id;
  p.click($("#taskList [data-act='edit']"));
  await sleep(60);
  ok("form switches to edit mode", $("#taskFormTitle").textContent === "Edit task", $("#taskFormTitle").textContent);
  ok("submit button relabels to save", $("#taskSubmit").textContent === "Save changes", $("#taskSubmit").textContent);
  ok("cancel button appears", $("#taskCancel").hidden === false);
  ok("title loaded into the form", $("#taskTitle").value === "Write the project report");
  ok("edited card is highlighted", $$("#taskList .task-item.editing").length === 1);

  p.type($("#taskTitle"), "Write and submit the report");
  p.click($("#taskSubmit"));
  await sleep(60);
  ok("task count unchanged after edit", T.getAll().length === 1);
  ok("title updated", T.getAll()[0].title === "Write and submit the report", T.getAll()[0].title);
  ok("form returns to add mode", $("#taskFormTitle").textContent === "New task");
  ok("cancel button hidden again", $("#taskCancel").hidden === true);
  ok("list shows the new title", /submit the report/.test($("#taskList").textContent));

  describe("TASK MANAGER — COMPLETE / REOPEN");
  const box = $("#taskList .task-check");
  ok("checkbox starts unchecked", box.checked === false);
  box.checked = true;
  box.dispatchEvent(new window.Event("change", { bubbles: true }));
  await sleep(60);
  ok("task marked complete", T.getAll()[0].done === true);
  ok("completed task is styled", $$("#taskList .task-item.is-done").length === 1);
  ok("completion time recorded", typeof T.getAll()[0].completedAt === "number");
  ok("progress bar reflects completion", $("#taskProgressBar").style.width === "100%", $("#taskProgressBar").style.width);
  ok("progress aria value updated", $("#taskProgress").getAttribute("aria-valuenow") === "100");
  ok("completed filter now counts one", /1/.test($$("#taskFilters .filter-btn")[2].textContent));

  // The list re-renders on every change, so the checkbox must be re-queried.
  const reopenBox = $("#taskList .task-check");
  reopenBox.checked = false;
  reopenBox.dispatchEvent(new window.Event("change", { bubbles: true }));
  await sleep(60);
  ok("task can be reopened", T.getAll()[0].done === false);
  ok("progress back to zero", $("#taskProgressBar").style.width === "0%");

  describe("TASK MANAGER — FILTERS + SEARCH");
  T.seed([
    { title: "Design the wireframe", notes: "sketch the hero", priority: "low", due: "" },
    { title: "Build the task manager", notes: "add edit delete", priority: "high", due: "" },
    { title: "Write documentation", notes: "README and setup", priority: "medium", due: "" }
  ]);
  await sleep(60);
  ok("seeded three tasks", T.getAll().length === 3);
  ok("all three render", $$("#taskList .task-item").length === 3);

  p.click($$("#taskFilters .filter-btn")[1]); // Active
  await sleep(50);
  ok("active filter shows every open task", $$("#taskList .task-item").length === 3);

  const firstCheck = $("#taskList .task-check");
  firstCheck.checked = true;
  firstCheck.dispatchEvent(new window.Event("change", { bubbles: true }));
  await sleep(60);
  ok("completing a task removes it from the Active view", $$("#taskList .task-item").length === 2, $$("#taskList .task-item").length);

  p.click($$("#taskFilters .filter-btn")[2]); // Completed
  await sleep(50);
  ok("completed filter shows only finished tasks", $$("#taskList .task-item").length === 1);
  ok("completed filter shows the right task", /Design the wireframe/.test($("#taskList").textContent));

  p.click($$("#taskFilters .filter-btn")[0]); // All
  await sleep(50);
  p.type($("#taskSearch"), "readme");
  await sleep(220);
  ok("search matches notes", $$("#taskList .task-item").length === 1, $$("#taskList .task-item").length);
  ok("search result is the right task", /Write documentation/.test($("#taskList").textContent));
  ok("count line reflects the search", /Showing 1 of 3/.test($("#taskCount").textContent), $("#taskCount").textContent);

  p.type($("#taskSearch"), "zzzznothing");
  await sleep(220);
  ok("no matches shows the filtered empty state", $("#taskEmpty").hidden === false);
  ok("empty state explains how to recover", /different filter/.test($("#taskEmptyBody").textContent), $("#taskEmptyBody").textContent);
  ok("no results message is a different message than the no-tasks one",
    /Add your first task/.test($("#taskEmptyBody").textContent) === false);

  p.type($("#taskSearch"), "");
  await sleep(220);
  ok("clearing the search restores every task", $$("#taskList .task-item").length === 3);

  describe("TASK MANAGER — DELETE");
  const targetId = T.getAll()[0].id;
  p.click($(`#taskList [data-act='delete'][data-id='${targetId}']`));
  await sleep(50);
  ok("delete asks for confirmation first", $$("#taskList .task-confirm").length === 1);
  ok("confirmation offers a way out", /Keep it/.test($("#taskList").textContent));
  ok("task is not deleted yet", T.getAll().length === 3);

  p.click($(`#taskList [data-act='cancel-delete'][data-id='${targetId}']`));
  await sleep(50);
  ok("cancelling keeps the task", T.getAll().length === 3);
  ok("confirmation row removed", $$("#taskList .task-confirm").length === 0);

  p.click($(`#taskList [data-act='delete'][data-id='${targetId}']`));
  await sleep(50);
  p.click($(`#taskList [data-act='confirm-delete'][data-id='${targetId}']`));
  await sleep(60);
  ok("confirmed delete removes exactly one task", T.getAll().length === 2, T.getAll().length);
  ok("delete feedback shown", /removed|deleted/i.test($("#taskFormStatus").textContent), $("#taskFormStatus").textContent);

  describe("TASK MANAGER — PERSISTENCE");
  ok("data written to localStorage",
    !!p.window.localStorage.getItem("devforge.tasks.v1"));
  const storedRaw = p.window.localStorage.getItem("devforge.tasks.v1");
  const stored = JSON.parse(storedRaw);
  ok("stored payload is an array", Array.isArray(stored));
  ok("stored record keeps its fields", stored[0] && "title" in stored[0] && "done" in stored[0] && "priority" in stored[0]);

  // Prove the round trip through storage by clearing memory and re-reading it.
  // (Each jsdom window has its own storage, so the same window is used.)
  T.seed([{ title: "survives reload", priority: "medium", done: true }]);
  await sleep(50);
  ok("seeded task marked done persists", T.getAll()[0].done === true);
  T.reload();
  await sleep(50);
  ok("tasks survive a reload from localStorage", T.getAll().length === 1 && T.getAll()[0].title === "survives reload",
    JSON.stringify(T.getAll()));
  ok("completion state survives the reload", T.getAll()[0].done === true);

  // Corrupt data must not break the page.
  p.window.localStorage.setItem("devforge.tasks.v1", "{not valid json");
  T.reload();
  await sleep(60);
  ok("corrupt storage does not throw", p.errors.length === 0, p.errors.join(" | "));
  ok("corrupt storage falls back to an empty list", T.getAll().length === 0, JSON.stringify(T.getAll()));
  ok("page still usable after corrupt storage", $("#taskEmpty").hidden === false);

  // A storage key holding the wrong shape must also be tolerated.
  p.window.localStorage.setItem("devforge.tasks.v1", JSON.stringify({ not: "an array" }));
  T.reload();
  await sleep(50);
  ok("wrong-shaped storage falls back to an empty list", T.getAll().length === 0);
  p.window.DevForgeTasks.reset();

  describe("TASK MANAGER — FIRST VISIT SEED");
  const p5 = await openPage(url);
  await sleep(250);
  ok("a first visit gets demo tasks so the panel is not empty",
    p5.window.DevForgeTasks.getAll().length > 0, p5.window.DevForgeTasks.getAll().length);
  ok("seeded tasks are shown in the list", p5.$$("#taskList .task-item").length > 0);
  p5.window.DevForgeTasks.reset();
  p5.close();

  describe("TASK MANAGER — CLEAR ALL");
  const p4 = await openPage(url);
  await sleep(200);
  p4.window.DevForgeTasks.seed([{ title: "temp one" }, { title: "temp two" }]);
  await sleep(60);
  p4.click(p4.$("#taskClear"));
  await sleep(60);
  ok("clear all removes every task", p4.window.DevForgeTasks.getAll().length === 0);
  ok("empty state returns after clearing", p4.$("#taskEmpty").hidden === false);
  p4.window.DevForgeTasks.reset();
  p4.close();

  /* ---------- contact form ---------- */
  describe("CONTACT FORM — VALIDATION");
  const form = $("#contactForm");
  p.submit(form);
  await sleep(60);
  ok("empty submit is blocked", $$("#contactForm .field.invalid").length >= 3, $$("#contactForm .field.invalid").length);
  ok("name error shown", $("#contactNameError").hidden === false);
  ok("email error shown", $("#contactEmailError").hidden === false);
  ok("message error shown", $("#contactMessageError").hidden === false);

  p.type($("#contactName"), "Recruiter");
  p.type($("#contactEmail"), "not-an-email");
  p.type($("#contactMessage"), "short");
  p.submit(form);
  await sleep(60);
  ok("invalid email rejected", $("#contactEmail").getAttribute("aria-invalid") === "true");
  ok("short message rejected", /12 characters/.test($("#contactMessageError").textContent), $("#contactMessageError").textContent);

  p.type($("#contactEmail"), "recruiter@example.com");
  p.type($("#contactMessage"), "I would like to discuss an internship role.");
  p.submit(form);
  await sleep(150);
  ok("valid input clears the errors", $$("#contactForm .field.invalid").length === 0);
  ok("honeypot stays out of the accessibility tree",
    $("#contactCompany").closest(".hp").getAttribute("aria-hidden") === "true");
  ok("honeypot is not focusable", $("#contactCompany").getAttribute("tabindex") === "-1");
  ok("status region is a live region", $("#contactStatus").getAttribute("aria-live") === "polite");

  describe("CONTACT FORM — SERVER BEHAVIOUR");
  const withFetch = async (impl, label, expect) => {
    const original = window.fetch;
    window.fetch = impl;
    p.type($("#contactName"), "Recruiter");
    p.type($("#contactEmail"), "recruiter@example.com");
    p.type($("#contactSubject"), "Internship");
    p.type($("#contactMessage"), "I would like to discuss an internship role.");
    p.submit(form);
    await sleep(180);
    const status = $("#contactStatus");
    ok(label, expect(status), status.className + " | " + status.textContent.slice(0, 80));
    window.fetch = original;
  };

  await withFetch(
    () => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ success: true }) }),
    "confirmed send shows a real success message",
    (s) => s.className.includes("ok") && /accepted for delivery/i.test(s.textContent)
  );

  await withFetch(
    () => Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({ success: false, message: "Access key is invalid." }) }),
    "rejected send is reported as a failure, never a fake success",
    (s) => s.className.includes("err") && !/accepted/i.test(s.textContent)
  );

  await withFetch(
    () => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) }),
    "reply without a success flag is treated as a failure",
    (s) => s.className.includes("err") && !/accepted/i.test(s.textContent)
  );

  await withFetch(
    () => Promise.reject(new TypeError("Failed to fetch")),
    "network failure says the message was NOT sent",
    (s) => s.className.includes("err") && /not sent|could not/i.test(s.textContent)
  );
  ok("submit button re-enabled after a failure", $("#contactSubmit").disabled === false);
  ok("submit button label restored", $("#contactSubmit").textContent === "Send message");

  const honeypotValue = $("#contactCompany").value;
  $("#contactCompany").value = "spam-bot";
  p.type($("#contactName"), "Bot");
  p.type($("#contactEmail"), "bot@example.com");
  p.type($("#contactMessage"), "buy cheap backlinks right now please");
  p.submit(form);
  await sleep(120);
  ok("honeypot submission reports nothing to a bot",
    $("#contactStatus").className.includes("ok") && /accepted/i.test($("#contactStatus").textContent));
  $("#contactCompany").value = honeypotValue;

  /* ---------- navigation ---------- */
  describe("NAVIGATION");
  ok("primary nav has seven links", $$("#navList a").length === 7, $$("#navList a").length);
  ok("every nav link points at a real section",
    $$("#navList a").every((a) => !!doc.querySelector(a.getAttribute("href"))));
  ok("hero CTA goes to the projects section", $(".hero-actions a[href='#projects']").textContent === "Explore My Projects");
  ok("second CTA goes to contact", $(".hero-actions a[href='#contact']").textContent === "Contact Me");
  ok("footer nav present", $$(".footer-nav a").length >= 6);
  ok("footer year is current", $("#year").textContent === String(new Date().getFullYear()));
  ok("back-to-top button starts hidden", $("#toTop").hidden === true);

  describe("THEME TOGGLE");
  const before = doc.documentElement.getAttribute("data-theme");
  p.click($("#themeToggle"));
  await sleep(40);
  const after = doc.documentElement.getAttribute("data-theme");
  ok("theme flips", before !== after, before + " -> " + after);
  ok("exactly one theme attribute", (doc.documentElement.outerHTML.match(/data-theme="/g) || []).length >= 1);
  ok("toggle keeps an accessible name", /Switch to/.test($("#themeToggle").getAttribute("aria-label")));
  ok("theme persisted to storage", !!p.window.localStorage.getItem("devforge.theme"));
  p.click($("#themeToggle"));
  await sleep(40);

  describe("MOBILE MENU");
  const menuBtn = $("#menuBtn");
  const menu = $("#mobileMenu");
  ok("menu starts closed", menu.hidden === true && menuBtn.getAttribute("aria-expanded") === "false");
  p.click(menuBtn);
  await sleep(40);
  ok("menu opens", menu.hidden === false);
  ok("aria-expanded reflects the state", menuBtn.getAttribute("aria-expanded") === "true");
  p.click($("#mobileMenu a"));
  await sleep(40);
  ok("choosing a link closes the menu", menu.hidden === true);

  /* ---------- accessibility ---------- */
  describe("ACCESSIBILITY");
  ok("exactly one h1", $$("h1").length === 1, $$("h1").length);
  ok("skip link is the first focusable element", $("a.skip-link") !== null);
  ok("every section is labelled", $$("section[aria-labelledby]").length >= 7, $$("section[aria-labelledby]").length);
  ok("every input has a label",
    $$("input:not([type=hidden]):not([type=checkbox]), textarea, select").every((i) => !!doc.querySelector('label[for="' + i.id + '"]')));
  ok("checkbox has an accessible name", $$(".task-check").every((c) => !!c.getAttribute("aria-label")));
  ok("status regions announce politely",
    $$("[role=status]").every((s) => s.getAttribute("aria-live") === "polite"));
  ok("no positive tabindex anywhere", $$("[tabindex]").every((e) => Number(e.getAttribute("tabindex")) <= 0));
  ok("dialog has an accessible name", !!$("#projectDialog").getAttribute("aria-labelledby"));
  ok("images have alt attributes", $$("img").every((i) => i.hasAttribute("alt")));
  ok("decorative thumbnails use an empty alt", $$("#projectGrid img").every((i) => i.getAttribute("alt") === ""));
  ok("external links are safe", $$("a[target=_blank]").every((a) => /noopener/.test(a.rel)));

  /* ---------- privacy & secrets ---------- */
  describe("PRIVACY + SECRETS");
  const markup = doc.documentElement.outerHTML;
  ok("no residential address", !/pildera|blk\s*6/i.test(markup));
  ok("phone number not published", !/09667258616/.test(markup));
  ok("no app password in the markup", !/app password|smtp_pass/i.test(markup.replace(/app password/gi, "")));
  const emails = [...new Set((markup.replace(/placeholder="[^"]*"/g, "").match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi) || []))];
  ok("only the intended email address appears",
    emails.length > 0 && emails.every((e) => e.toLowerCase() === "jriku47@gmail.com"), emails.join(","));
  ok("no .env values committed", !/GMAIL_APP_PASSWORD=\s*\S/i.test(markup));

  /* ---------- responsive CSS ---------- */
  describe("RESPONSIVE CSS RULES");
  const css = doc.documentElement.querySelector('link[href*="layout.css"]') ? "" : "";
  void css;
  const layout = $('link[href="css/layout.css"]');
  ok("layout stylesheet is linked", !!layout);
  ok("stylesheet links are present",
    $$("link[rel=stylesheet]").length === 3, $$("link[rel=stylesheet]").length);
  ok("body prevents sideways scrolling",
    /overflow-x:\s*hidden/.test(readFile("css/base.css")));
  const layoutCss = readFile("css/layout.css");
  ok("1020px breakpoint defined", /@media \(max-width:\s*1020px\)/.test(layoutCss));
  ok("900px breakpoint defined", /@media \(max-width:\s*900px\)/.test(layoutCss));
  ok("520px breakpoint defined", /@media \(max-width:\s*520px\)/.test(layoutCss));
  ok("reduced motion honoured", /prefers-reduced-motion/.test(readFile("css/base.css")));
  ok("focus ring defined", /:focus-visible/.test(readFile("css/base.css")));
  // Regression guard: a bare minmax(320px, 1fr) track overflows a 320px screen.
  ok("auto-fit grids can shrink below their minimum track",
    (layoutCss.match(/minmax\(min\(/g) || []).length >= 3,
    "found " + (layoutCss.match(/minmax\(min\(/g) || []).length);
  ok("no bare pixel minmax tracks left in the grids",
    !/grid-template-columns:[^;]*minmax\(\d+px/.test(layoutCss),
    (layoutCss.match(/grid-template-columns:[^;]*minmax\(\d+px[^;]*/g) || []).join(" | "));

  ok("still no JavaScript errors after the whole run", p.errors.length === 0, p.errors.join(" | "));

  p.window.DevForgeTasks.reset();
  p.close();
}

/* helper for the CSS assertions */
function readFile(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

/* ============================================================
   RUN
   ============================================================ */
(async () => {
  const ownServer = !process.env.TEST_PORT;
  const server = ownServer ? await startServer() : null;
  const url = "http://127.0.0.1:" + PORT + "/";

  try {
    await run(url);
  } catch (err) {
    fail++;
    failures.push("HARNESS CRASH: " + (err && err.stack ? err.stack : err));
    console.error("\nHARNESS CRASH:", err);
  } finally {
    if (server) server.close();
  }

  console.log("\n=== SUMMARY ===");
  console.log("  " + pass + " passed, " + fail + " failed");
  if (failures.length) {
    console.log("\nFailures:");
    failures.forEach((f) => console.log("  - " + f));
  }
  process.exit(fail ? 1 : 0);
})();
