# DevForge — Web Development Portfolio and Project Showcase

**IT Web Development Specialization Project**
**Author:** Jericho Andren · BSIT — Web Development Specialization

A working developer portfolio built to prove applied web development rather than to
describe it. Every control on the page does real work: the project filters actually
filter, the search box actually searches, the task manager actually stores records,
and the contact form refuses to claim success unless the mail service confirms it.

> **Live demo:** <https://jriku47-a11y.github.io/Project-3/>
> **Source code:** <https://github.com/jriku47-a11y/Project-3>

---

## Table of contents

1. [What this project demonstrates](#1-what-this-project-demonstrates)
2. [Features](#2-features)
3. [Tech stack and why](#3-tech-stack-and-why)
4. [Project structure](#4-project-structure)
5. [Getting started](#5-getting-started)
6. [Configuration — where to edit content](#6-configuration--where-to-edit-content)
7. [Testing](#7-testing)
8. [Deployment](#8-deployment)
9. [Database notes](#9-database-notes)
10. [Accessibility](#10-accessibility)
11. [Security and privacy](#11-security-and-privacy)
12. [Troubleshooting](#12-troubleshooting)
13. [Future enhancements](#13-future-enhancements)

---

## 1. What this project demonstrates

| Requirement from the specialization | Where it is implemented |
| --- | --- |
| Semantic, accessible structure | `index.html` — landmarks, labelled sections, skip link |
| A reusable design system | `css/base.css` — colour, type, spacing and shape tokens |
| Responsive from 320px upward | `css/layout.css` — breakpoints at 1020px, 900px, 760px, 520px |
| Data-driven rendering | `js/config.js` — every string the visitor sees |
| Client-side interactivity | `js/app.js` — filters, dialog, theme, navigation |
| A working application, not a mock-up | `js/tasks.js` — task manager with real persistence |
| Input validation and honest feedback | `js/contact.js`, task title validation |
| Version control and documentation | Git history + this README |

## 2. Features

**Home**
- Sticky header with active-section highlighting and a mobile menu
- Required headline, two calls to action, profile photo with an initials fallback
- Featured skill chips and a live location / email / GitHub row
- Dark navy theme by default with a light theme toggle that is remembered

**About Me**
- Introduction written in plain language, no invented employers or dates
- Educational background, career goal, technical interests, lessons learned

**Technical Skills**
- Five categories: Front-End, Back-End, Database, Development Tools, UI/UX
- Every skill is honestly marked **Current** (can build with it today) or
  **Learning** (actively studying)

**Projects Showcase**
- Four projects with generated SVG thumbnails
- Working filters: **All / Front-End / Full-Stack / UI/UX** with live counts
- Each card opens an accessible dialog with the problem, approach, outcome and
  lessons; links are real, and a missing link is labelled instead of being a dead anchor

**Specialization Project Details**
- Background and motivation, problem statement, general and specific objectives
- Target users, system features, technologies, development process
- Challenges with their solutions, and future enhancements

**Functional Task Manager** — the demonstrable application
- Add, edit, complete, reopen and delete tasks
- Search across titles and notes
- Filter by **All / Active / Completed** with counts
- Priority, optional notes, optional due date with overdue highlighting
- Progress bar, completion counters, two distinct empty states
- Delete asks for confirmation; data persists in `localStorage`
- Guards against corrupt or wrong-shaped stored data

**Contact**
- Name, email, subject and message with per-field error messages
- Inline `aria-invalid` state and `aria-describedby` hints
- Honeypot spam trap that never tells a bot it failed
- Sends through Web3Forms when a key is configured; otherwise it tells the visitor
  honestly that nothing is connected instead of faking a success

**Footer**
- Logo, navigation, social links, current year and a working back-to-top button

## 3. Tech stack and why

| Layer | Choice | Reason |
| --- | --- | --- |
| Structure | HTML5 | Semantic elements, `<dialog>`, native form validation attributes |
| Styling | CSS3 | Custom properties, Grid, Flexbox, `clamp()` fluid type, no framework |
| Behaviour | Vanilla JavaScript (ES2020+) | No build step, no framework, readable for an evaluator |
| Persistence | `localStorage` | Works on any static host, no server or database to install |
| Mail | Web3Forms relay | Works on GitHub Pages, where PHP cannot run |
| Version control | Git + GitHub Pages | History is part of the evidence |

**Why no framework and no database?** The requirement is a project that can be
installed, tested and deployed in a realistic environment. A build step (React, Vite)
adds a toolchain that a grader may not have, and a MySQL server cannot run on
GitHub Pages. The PHP + MySQL work is demonstrated in the separate salon capstone and
is described in the Skills section. See [Database notes](#9-database-notes).

## 4. Project structure

```
DevForge/
├─ index.html              # the whole page structure
├─ assets/
│  ├─ favicon.svg          # generated
│  ├─ profile.jpg          # profile photo (initials shown if removed)
│  └─ projects/            # generated SVG thumbnails, one per project
├─ css/
│  ├─ base.css             # tokens, reset, typography, accessibility, utilities
│  ├─ layout.css           # header, hero, sections, grids, footer, responsive rules
│  └─ components.css       # buttons, cards, badges, forms, task list, dialog, toast
├─ js/
│  ├─ config.js            # ← all content lives here
│  ├─ utils.js             # DOM helpers, escaping, storage, theme, toast
│  ├─ app.js               # rendering, navigation, filters, dialog
│  ├─ tasks.js             # task manager
│  └─ contact.js           # validation and submission
├─ tests/
│  └─ run-tests.js         # automated test suite (jsdom)
├─ tools/
│  ├─ serve.js             # local static server
│  └─ make-assets.js       # regenerates the favicon and thumbnails
├─ .env.example            # optional settings, documented only
├─ .gitignore
├─ package.json            # npm scripts (start / test / assets)
└─ README.md
```

## 5. Getting started

The site is static — there is nothing to compile.

**Option A — open it directly**
Open `index.html` in a browser. Everything works, including the task manager.

**Option B — local server (recommended)**

```bash
git clone https://github.com/jriku47-a11y/Project-3.git
cd Project-3
npm start            # http://127.0.0.1:8080
```

`npm start` runs `tools/serve.js`, a dependency-free static server. Any other server
works too, for example:

```bash
python -m http.server 8080
php -S 127.0.0.1:8080
```

**Requirements:** any current browser. Node.js 18+ is only needed for the test suite
and the helper scripts.

## 6. Configuration — where to edit content

Open **`js/config.js`**. It is the single source of truth; no HTML edits are needed.

| What | Where |
| --- | --- |
| Name, role, location, links, photo | `profile` |
| Headline, lede, buttons, skill chips | `hero` |
| About text, education, goal, lessons | `about` |
| Skill categories and levels | `skills.categories` |
| Project cards, filters, tags | `projects.items` / `projects.filters` |
| Objectives, users, features, process | `specialization` |
| Task labels, seed tasks, limits | `taskManager` |
| Form labels, error copy, mail relay | `contact` |

Placeholders you must review before presenting are marked `[REPLACE]` **in comments**.
Anything that is still empty renders nothing rather than a broken element — for example
a project with no `repo` link shows "Link coming soon" instead of a dead anchor.

**Publishing your email:** `profile.email` with `profile.showEmail: true`.
**Publishing your phone:** `profile.phone` with `profile.showPhone: true` (off by
default). The full address must never be added.

## 7. Testing

```bash
npm install     # once — installs jsdom (a dev dependency)
npm test        # starts a local server and runs the suite
```

The suite drives the real page in a headless DOM and asserts behaviour a reviewer
would check by hand:

| Group | Covers |
| --- | --- |
| Page rendering | boot without errors, headline, avatar, skills, about |
| Specialization details | objectives, users, features, technologies, process |
| Projects + filters | all four filters, result counts, empty state, links |
| Project dialog | opens, labelled, focus moves in, closes, focus returns |
| Task manager | create, validate, edit, complete, reopen, delete (with confirmation), search, filters, progress, clear all |
| Persistence | storage round trip, first-visit seed, corrupt and wrong-shaped data |
| Contact form | validation errors, honeypot, success **only** on a confirmed send |
| Navigation | links, targets, mobile menu, theme toggle, back-to-top |
| Accessibility | landmarks, labels, live regions, alt text, focus handling, `rel="noopener"` |
| Privacy + secrets | no address, no phone, no other email address, no credentials |
| Responsive CSS | breakpoints present, grids able to shrink, reduced motion |

Latest result: **185 checks passing, 0 failing.**

Layout was additionally verified in real Chrome: no horizontal overflow at
320 / 360 / 390 / 414 / 480 / 600 / 768 / 834 / 1024 / 1180 / 1366 / 1600 / 1920 px,
and the dialog, filters, task manager and validation were exercised in the browser.

**Tests that cannot be automated here:** real mail delivery (needs a live inbox) and
real screen-reader output (needs a human with a screen reader).

## 8. Deployment

### GitHub Pages (current deployment)

1. Repository → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main**, folder: **/ (root)**
4. The site is served from `https://<user>.github.io/<repo>/`

No build step and no environment variables are required. `.nojekyll` is committed so
that files starting with `_` are published.

### Any static host

Upload the repository contents to the web root of Netlify, Vercel, Cloudflare Pages,
cPanel or similar. Nothing needs to be compiled. If you host it in a **subdirectory**,
no change is needed because every link is relative.

### If you add a PHP backend

GitHub Pages cannot execute PHP. To mail from your own server instead, add an
`api/contact.php` endpoint that accepts the JSON body the form already sends
(`name`, `email`, `subject`, `message`), then set `contact.relay.accessKey` to `""` in
`js/config.js`. The page will detect that no relay is configured and tell visitors
which route is live — it never silently pretends to send.

## 9. Database notes

**This project needs no database.** Task data is stored per browser with
`localStorage` under the versioned key `devforge.tasks.v1`, which means:

- no installation, no credentials, no SQL dump;
- tasks are private to that browser and are never uploaded anywhere;
- clearing site data clears the tasks;
- the version suffix makes a future schema change safe.

If this project is extended with real accounts, the intended design is a `tasks` table
plus a `users` table in MySQL, accessed only through PHP with PDO prepared statements,
with the JSON payload the task manager already uses as the API contract.

## 10. Accessibility

- Skip link, one `<h1>`, labelled sections, landmark elements
- Every input has a real `<label>`; hints and errors use `aria-describedby`
- Status messages use `role="status"` + `aria-live="polite"`
- Invalid fields are marked with `aria-invalid` and a visible error message
- Visible `:focus-visible` ring on every interactive element, never removed
- The project dialog is a native `<dialog>`: it traps focus, closes on <kbd>Esc</kbd>,
  and returns focus to the card that opened it
- The honeypot is removed from the accessibility tree and is not focusable
- `prefers-reduced-motion` disables the reveal animation and smooth scrolling
- Colour contrast: body text ≥ 7:1, muted text ≥ 5:1 in both themes
- Verified with no horizontal overflow down to 320px

## 11. Security and privacy

- **No secrets in this repository.** `.gitignore` excludes `.env`, `*.local`,
  `node_modules`, logs and editor folders. `.env.example` contains placeholders only.
- Every value inserted with `innerHTML` is escaped by `esc()` in `js/utils.js`, so
  content can never become markup.
- URLs are restricted to `http(s):`, `mailto:` and `tel:` before being placed in an
  `href`, which blocks `javascript:` payloads.
- The contact form has a honeypot field and never displays a fake success message.
- The **Web3Forms access key** in `js/config.js` is designed to be public: it can only
  submit a message to the owner's inbox. A real mailbox password must never be placed
  in a repository — see the privacy notes in `js/config.js`.
- No residential address, and the phone number is hidden by default.

## 12. Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| Page is unstyled | The CSS files did not load. Check the paths in `index.html` and open the browser console. |
| Task manager is empty on a new browser | Expected: demo tasks are seeded once, on a visit where no data exists. |
| Tasks disappear | Site data was cleared, or the browser blocks storage in private mode. The form reports this. |
| Contact form says nothing is connected | `contact.relay.accessKey` is empty. See [Deployment](#8-deployment). |
| Contact form accepts but no mail arrives | The relay accepted the message; check the inbox registered on the Web3Forms account, its spam folder, and that the account email is verified. |
| Changes do not appear | Hard-refresh (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>); browsers cache CSS and JS aggressively. |
| `npm test` fails with `ECONNREFUSED` | Port 8131 is in use. Run with another port: `TEST_PORT=8200 npm test`. |

## 13. Future enhancements

1. Move the task manager behind PHP + MySQL with real user accounts
2. Load project data from a database with a small admin interface
3. Add screenshot-based visual regression tests to the pipeline
4. Serve an English and a Filipino locale from the same config
5. Add a service worker so the portfolio works offline
6. Add a light/dark theme that follows the system preference until the visitor chooses

---

## License

Released under the MIT License — see `LICENSE`.

Built by **Jericho Andren** as an IT Web Development Specialization project.
