/* ============================================================
   DEVFORGE — CONTENT CONFIG
   ------------------------------------------------------------
   Single source of truth for the whole site. Edit values here
   and every page section updates. No HTML edits required.

   RULES
   - Anything marked [REPLACE] is a placeholder. Swap it for real
     information before presenting this project.
   - Do NOT invent employers, job titles, dates or certifications.
     Honest placeholders are better than invented credentials.
   - Never commit passwords, API keys, app passwords or tokens.
     A Web3Forms access key is safe in this file BY DESIGN (it can
     only submit a message to your inbox) — but a real mail account
     password must never go here.
   ============================================================ */

const DEVFORGE = {
  /* ---------------------------------------------------------
     1. IDENTITY
     --------------------------------------------------------- */
  meta: {
    siteName: "DevForge",
    tagline: "Web Development Portfolio and Project Showcase",
    title: "DevForge — Web Development Portfolio and Project Showcase",
    description:
      "DevForge is the web development specialization project of Jericho Andren, an IT student building modern, responsive and user-friendly web experiences with HTML, CSS, JavaScript, PHP and MySQL.",
    author: "Jericho Andren",
    locale: "en_PH"
  },

  brand: {
    name: "DevForge",
    mark: "DF",
    // Wordmark used in the header and footer.
    homeLabel: "DevForge — home"
  },

  profile: {
    name: "Jericho Andren",
    initials: "JA",
    role: "Web Developer in Training",
    headlineRole: "IT Student / Aspiring Web Developer",
    availability: "Open to internships and junior web developer roles",
    location: "Pasay City, Philippines",
    photo: "assets/profile.jpg",
    photoAlt: "Portrait of Jericho Andren",

    /* Only publish a field when you consciously decide to. */
    email: "jriku47@gmail.com",
    showEmail: true,
    phone: "",
    showPhone: false,

    links: {
      github: "https://github.com/jriku47-a11y",
      linkedin: "https://www.linkedin.com/in/jriku",
      portfolio: "https://jriku47-a11y.github.io/Portfolio/",
      specializationRepo: "https://github.com/jriku47-a11y/Project-3"
    }
  },

  /* ---------------------------------------------------------
     2. HOME / HERO
     --------------------------------------------------------- */
  hero: {
    eyebrow: "Web Development Specialization Project",
    headline: "Building Modern, Responsive, and User-Friendly Web Experiences.",
    /* Rendered inside a gradient span at the end of the headline. */
    headlineAccent: "Web Experiences.",
    lede:
      "I am an IT student specialising in web development. This project is my working portfolio: every section is live, every filter works, and the task manager stores real data in your browser instead of pretending to.",
    actions: [
      { label: "Explore My Projects", href: "#projects", variant: "primary" },
      { label: "Contact Me", href: "#contact", variant: "ghost" }
    ],
    /* Shown as chips under the hero copy. */
    featuredSkills: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "PHP", "MySQL", "Git & GitHub"],
    stats: [
      { value: "3", label: "Published projects", note: "2 full-stack, 1 front-end" },
      { value: "9", label: "Skill categories", note: "front-end, back-end, database, tools, UI/UX" },
      { value: "320px", label: "Smallest screen tested", note: "no horizontal scroll" }
    ]
  },

  /* ---------------------------------------------------------
     3. ABOUT ME
     Fields marked [REPLACE] were not provided — fill them in
     with your own words before presenting.
     --------------------------------------------------------- */
  about: {
    heading: "About Me",
    lede:
      "I build websites the way an engineer should: understand the problem, keep the code readable, then make it fast and accessible.",

    /* [REPLACE] written in your own words */
    paragraphs: [
      "I am an Information Technology student specialising in Web Development. My interest in this field started from wanting to understand how the pages I use every day are actually built, and it grew into a habit of rebuilding them properly — with valid markup, a real design system, and behaviour that works on a phone as well as a monitor.",
      "This portfolio is the practical side of that learning. Instead of a static write-up, I built a working product: filterable project cards, an accessible contact form, and a task manager that genuinely adds, edits, completes and deletes records. Every feature here is something I can demonstrate live in front of an instructor."
    ],

    education: [
      {
        /* [REPLACE] add another entry when you have one to show, and set
           `period` to the years you actually attended. */
        period: "Currently enrolled",
        title: "BSIT — Web Development Specialization",
        org: "Datamex College of Saint Adeline",
        detail: "Coursework in web design, programming, database systems and human-computer interaction."
      }
    ],

    goal: {
      title: "Career goal",
      text:
        "To become a Web Developer who can take a requirement from an ordinary sentence, turn it into a working, accessible and maintainable interface, and explain the trade-offs behind every choice."
    },

    interests: [
      "Accessible, keyboard-first interfaces",
      "Design systems and layout that survive real content",
      "Database design and clean SQL queries",
      "Performance: fast first paint, small payloads",
      "Version control discipline and readable commits",
      "Writing documentation I would want to read myself"
    ],

    lessons: [
      {
        title: "Ship the interaction, not the screenshot",
        body: "A design that only looks finished is not finished. Building the filter and the task manager taught me more than any static layout did."
      },
      {
        title: "Accessibility is cheaper during the build",
        body: "Labels, focus order and live regions cost minutes while writing markup, and days if they are retrofitted afterwards."
      },
      {
        title: "One source of truth",
        body: "Moving every string into a config file meant I could restyle, translate or correct content without touching the components."
      },
      {
        title: "Test the boring widths",
        body: "Bugs lived at 320px and 1024px, never at the width I happened to design on."
      }
    ]
  },

  /* ---------------------------------------------------------
     4. TECHNICAL SKILLS
     level: "current" = can build with it today
            "learning" = actively studying, not production-ready
     --------------------------------------------------------- */
  skills: {
    intro:
      "Honest self-assessment: what I can build with today is marked current, what I am still learning is marked learning.",

    categories: [
      {
        id: "frontend",
        icon: "◧",
        name: "Front-End",
        blurb: "The part the visitor sees and touches.",
        items: [
          { name: "HTML5", level: "current", note: "Semantic structure, forms, accessible markup" },
          { name: "CSS3", level: "current", note: "Grid, Flexbox, custom properties, responsive rules" },
          { name: "JavaScript (ES2020+)", level: "current", note: "DOM, events, modules, localStorage, async/await" },
          { name: "Responsive Design", level: "current", note: "Mobile-first layout from 320px upward" },
          { name: "Tailwind CSS", level: "learning", note: "Utility-first workflow and design tokens" },
          { name: "TypeScript", level: "learning", note: "Typed JavaScript for larger codebases" }
        ]
      },
      {
        id: "backend",
        icon: "◨",
        name: "Back-End",
        blurb: "Server logic, validation and APIs.",
        items: [
          { name: "PHP", level: "current", note: "Contact endpoints, PDO prepared statements, sessions" },
          { name: "MySQL", level: "current", note: "Schema design, JOINs, indexing, migrations" },
          { name: "REST Conventions", level: "current", note: "Resource naming, status codes, JSON payloads" },
          { name: "Node.js + Express", level: "learning", note: "Moving the same patterns to a JavaScript runtime" }
        ]
      },
      {
        id: "database",
        icon: "◩",
        name: "Database",
        blurb: "Storing data that stays correct.",
        items: [
          { name: "MySQL / MariaDB", level: "current", note: "Normalised tables, foreign keys, transactions" },
          { name: "SQL Query Writing", level: "current", note: "SELECT, JOIN, GROUP BY, subqueries" },
          { name: "Browser Storage", level: "current", note: "localStorage schema versioning and safe parsing" },
          { name: "SQLite", level: "learning", note: "Embedded database used by the analytics project" }
        ]
      },
      {
        id: "tools",
        icon: "◪",
        name: "Development Tools",
        blurb: "The workflow around the code.",
        items: [
          { name: "Git", level: "current", note: "Branches, staging, readable commit history" },
          { name: "GitHub", level: "current", note: "Repositories, Pages deployment, pull requests" },
          { name: "VS Code", level: "current", note: "Emmet, extensions, integrated terminal" },
          { name: "Browser DevTools", level: "current", note: "Console, network tab, accessibility audit, responsive mode" },
          { name: "XAMPP", level: "current", note: "Local Apache, MySQL and PHP environment" },
          { name: "Figma", level: "learning", note: "Wireframes and interactive prototypes" }
        ]
      },
      {
        id: "uiux",
        icon: "◫",
        name: "UI/UX",
        blurb: "Designing before writing markup.",
        items: [
          { name: "Wireframing", level: "current", note: "Low-fidelity layouts before any styling" },
          { name: "Design Principles", level: "current", note: "Hierarchy, contrast, spacing, consistency" },
          { name: "Prototyping", level: "current", note: "Clickable flows to validate a layout early" },
          { name: "User Research", level: "learning", note: "Interviews, personas and usability testing" }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------
     5. PROJECTS SHOWCASE
     Replace `demo` / `repo` with "" when a link does not exist
     yet — the card then shows a muted "link coming soon" label
     instead of a dead anchor.
     --------------------------------------------------------- */
  projects: {
    intro:
      "Filter by discipline. Every card opens a detail panel with the problem, the approach and what I would improve next.",
    filters: [
      { id: "all", label: "All" },
      { id: "front-end", label: "Front-End" },
      { id: "full-stack", label: "Full-Stack" },
      { id: "ui-ux", label: "UI/UX" }
    ],
    items: [
      {
        id: "salon",
        title: "Salon Management & Booking System",
        category: "full-stack",
        tags: ["PHP", "MySQL", "JavaScript", "CRUD"],
        thumbnail: "assets/projects/salon.svg",
        summary:
          "A booking and customer-management system for a salon, built as a capstone: service catalogue, availability check, booking form and an owner dashboard.",
        problem:
          "Appointments were tracked on paper and in scattered messages, so double-bookings were common and the owner had no history to plan from.",
        approach:
          "I designed the schema around three entities — customer, service and booking — enforced the rules with foreign keys, then added server-side validation so the interface could not submit an invalid booking.",
        outcome:
          "Bookings, reschedules and cancellations became one auditable flow, and the owner can filter past appointments by date or customer.",
        lessons:
          "Writing the validation rules in SQL first removed most of the duplicated logic in the form.",
        demo: "https://jriku47-a11y.github.io/Salon/",
        repo: "https://github.com/jriku47-a11y/Salon",
        year: ""   // [REPLACE] set the year once you confirm it
      },
      {
        id: "inventory",
        title: "IT Equipment Inventory Analytics",
        category: "full-stack",
        tags: ["SQL", "SQLite", "Data Analysis", "Excel"],
        thumbnail: "assets/projects/inventory.svg",
        summary:
          "An analytics layer over an equipment inventory: SQL queries answer utilisation and cost questions, and the results are exported as a formatted workbook.",
        problem:
          "The inventory existed as a spreadsheet, so questions like “which department has the most unused equipment?” could not be answered without manual counting.",
        approach:
          "I loaded the data into a normalised database, wrote the aggregation queries, then exposed the results in the browser with a read-only SQLite runtime and an exported Excel report.",
        outcome:
          "Answers that previously took an afternoon now take one query, and the workbook is what the department actually receives.",
        lessons:
          "Choosing the right grain for a table removed an entire class of duplicate-row bugs.",
        demo: "https://jriku47-a11y.github.io/Portfolio/#inventory",
        repo: "",
        year: ""   // [REPLACE] set the year once you confirm it
      },
      {
        id: "portfolio",
        title: "Personal Portfolio Website",
        category: "front-end",
        tags: ["HTML", "CSS", "JavaScript", "Accessibility"],
        thumbnail: "assets/projects/portfolio.svg",
        summary:
          "A single-page developer portfolio with a light and dark theme, a live database explorer, a resume viewer and a contact form that reports honestly whether a message was sent.",
        problem:
          "I needed one place that a recruiter could read in under a minute without losing the technical detail I wanted to show.",
        approach:
          "Content lives in a single config file, the design system is built on custom properties, and every interactive control is keyboard reachable and labelled.",
        outcome:
          "Published with GitHub Pages and used as the live demonstration for academic presentations.",
        lessons:
          "Moving all content into one config file meant I could correct a typo without touching a component.",
        demo: "https://jriku47-a11y.github.io/Portfolio/",
        repo: "https://github.com/jriku47-a11y/Portfolio",
        year: ""   // [REPLACE] set the year once you confirm it
      },
      {
        id: "devforge",
        title: "DevForge — This Portfolio",
        category: "ui-ux",
        tags: ["UI/UX", "Design System", "JavaScript", "A11y"],
        thumbnail: "assets/projects/devforge.svg",
        summary:
          "The specialization project you are reading: a dark-navy portfolio with filterable project cards, an accessible contact form and a working task manager backed by localStorage.",
        problem:
          "A portfolio that only shows pictures of work proves nothing. An evaluator should be able to press the buttons and see real behaviour.",
        approach:
          "I designed the token system first, then built each component as a reusable pattern, and wrote an automated test suite that drives the filters, the task manager and the form validation.",
        outcome:
          "Every control on this page performs real work, and the test suite documents that behaviour.",
        lessons:
          "Writing the tests forced me to decide what each control should do before I styled it.",
        demo: "https://jriku47-a11y.github.io/Project-3/",
        repo: "https://github.com/jriku47-a11y/Project-3",
        year: ""   // [REPLACE] set the year once you confirm it
      }
    ],
    /* Shown only when a project has no live link yet. */
    missingLinkLabel: "Link coming soon"
  },

  /* ---------------------------------------------------------
     6. SPECIALIZATION PROJECT DETAILS
     Written so it can be read aloud to an instructor.
     --------------------------------------------------------- */
  specialization: {
    heading: "Specialization Project Details",
    intro:
      "This section explains the project in the order an evaluator would ask about it: why it was built, what problem it solves, who it is for, and how it was developed.",

    background:
      "My Web Development specialization requires a project that demonstrates applied web development rather than a collection of exercises. I wanted one project that could carry every requirement at once — an interface, a database, a working feature and documentation — so I chose to build a portfolio and project showcase that a reviewer could actually use rather than only read.",

    problem:
      "As a student I had no single place that presented my work to an employer or an instructor. Static screenshots hide whether the work is real, and a plain list of technologies says nothing about how I reason. There was also no low-risk place to practise the full front-end interaction cycle — filtering, validation, persistence — before doing it in a production system.",

    objectives: {
      general: [
        "Demonstrate applied web development skills in a single, working application.",
        "Produce a portfolio that presents projects, skills and contact details clearly.",
        "Prove interactivity by shipping features that really work, not static mock-ups.",
        "Apply accessibility and responsive design as requirements, not extras."
      ],
      specific: [
        "Build a single-page portfolio with semantic HTML5 and a consistent design system.",
        "Implement a filterable project showcase with working detail views.",
        "Develop a functional task manager with add, edit, complete, delete, search and filter.",
        "Persist user data with versioned localStorage so records survive a page reload.",
        "Create a validated contact form with honest success and error states.",
        "Verify keyboard navigation, focus visibility and contrast.",
        "Keep all content in a single configuration file for easy maintenance.",
        "Document setup, testing and deployment in the README."
      ]
    },

    targetUsers: [
      { who: "Instructors and academic evaluators", need: "One link that explains the project, the decisions and the evidence." },
      { who: "Recruiters and hiring managers", need: "A fast read of skills, projects and how to make contact." },
      { who: "Fellow students", need: "A working example of interactions they can study and reuse." },
      { who: "Future me", need: "A documented codebase I can extend without reverse-engineering it." }
    ],

    features: [
      { title: "Single-page navigation", body: "Sticky header, smooth scrolling, active-section highlight and a mobile menu." },
      { title: "Theme control", body: "Dark and light themes with the choice remembered between visits." },
      { title: "Filterable projects", body: "Filter by discipline with live result counts and empty-state feedback." },
      { title: "Project detail views", body: "An accessible dialog with problem, approach, outcome and lessons." },
      { title: "Task manager", body: "Add, edit, complete and delete; search; filter by status; progress counter." },
      { title: "Persistent storage", body: "Versioned localStorage with safe parsing and recovery from corrupt data." },
      { title: "Validated contact form", body: "Inline field errors, honeypot spam trap, live status region." },
      { title: "Responsive layout", body: "Verified from 320px to 1920px with no horizontal overflow." }
    ],

    technologies: [
      { name: "HTML5", role: "Semantic structure, forms, dialog element, metadata for SEO." },
      { name: "CSS3", role: "Custom properties, Grid, Flexbox, fluid type, dark theme, reduced-motion support." },
      { name: "JavaScript", role: "Rendering from config, filters, task manager, validation, storage." },
      { name: "localStorage", role: "Client-side persistence for the task manager — no server required." },
      { name: "PHP + MySQL", role: "Studied for the salon project; the optional mail endpoint pattern is documented." },
      { name: "Git & GitHub", role: "Version control, public repository and Pages deployment." },
      { name: "Browser DevTools", role: "Console checks, network inspection, responsive and accessibility audits." }
    ],

    process: [
      { phase: "1. Requirement analysis", body: "Listed what an evaluator must be able to do in the first 60 seconds, and turned that into a section list." },
      { phase: "2. Design", body: "Wireframed the hero, project grid and task manager on paper before writing any CSS." },
      { phase: "3. Design system", body: "Defined colour, spacing and typography tokens first so every component inherits the same rhythm." },
      { phase: "4. Build", body: "Built markup, then styles, then behaviour for each component in that order." },
      { phase: "5. Data layer", body: "Moved all content into a config file and added the storage layer with a versioned schema." },
      { phase: "6. Accessibility pass", body: "Added landmarks, labels, focus order, live regions and reduced-motion handling." },
      { phase: "7. Testing", body: "Automated the filters, task manager and validation; checked 22 viewport widths." },
      { phase: "8. Documentation & deployment", body: "Wrote this README and deployed to GitHub Pages from the main branch." }
    ],

    challenges: [
      {
        title: "Making the task manager feel real",
        problem: "A demo that resets on reload would have proven nothing.",
        solution: "Added a versioned storage schema, safe JSON parsing and a visible counter so the behaviour is obvious to a reviewer."
      },
      {
        title: "Filters that lie",
        problem: "Filtering changed the cards but not the result count, which made empty results look like a bug.",
        solution: "Tied the counter to the same filtered array the cards render from, and added a distinct empty state."
      },
      {
        title: "Accessible dialog",
        problem: "A detail panel that traps no focus lets keyboard users wander into the page behind it.",
        solution: "Used the native dialog element, closed it on Escape, and returned focus to the card that opened it."
      },
      {
        title: "Mobile ordering",
        problem: "On a phone the avatar pushed the headline below the fold.",
        solution: "Reordered the hero for a single column so the photo and the name appear before the pitch."
      }
    ],

    future: [
      { title: "Real authentication", body: "Move task storage behind PHP and MySQL with per-user accounts and server-side validation." },
      { title: "Project data from a database", body: "Replace the config file with a projects table and an admin interface." },
      { title: "Automated visual regression", body: "Screenshot every section in both themes on each push." },
      { title: "Internationalisation", body: "Serve an English and a Filipino locale from the same config." },
      { title: "Offline support", body: "Add a service worker so the portfolio and task manager work without a connection." }
    ]
  },

  /* ---------------------------------------------------------
     7. TASK MANAGER
     --------------------------------------------------------- */
  taskManager: {
    heading: "Task Manager",
    intro:
      "A working application, not a mock-up. Data is stored in your browser with localStorage, so a task added here is still there after you close the tab.",
    storageKey: "devforge.tasks.v1",
    /* Seeded once on a first visit so the demo is not an empty box.
       Set to [] to start empty. */
    seed: [
      { title: "Add your first task", notes: "Type a title and press Add. Everything stays in this browser.", priority: "medium", due: "" },
      { title: "Edit this task", notes: "Press Edit on any card to load it back into the form.", priority: "low", due: "" },
      { title: "Complete this task", notes: "Tick the checkbox and watch the progress bar move.", priority: "high", due: "" }
    ],
    priorities: [
      { id: "low", label: "Low" },
      { id: "medium", label: "Medium" },
      { id: "high", label: "High" }
    ],
    filters: [
      { id: "all", label: "All" },
      { id: "active", label: "Active" },
      { id: "completed", label: "Completed" }
    ],
    limits: { title: 80, notes: 400, message: 12 },
    empty: {
      noTasks: {
        title: "No tasks yet",
        body: "Add your first task using the form above. It will still be here the next time you open this page."
      },
      noMatches: {
        title: "Nothing matches this view",
        body: "Try a different filter, or clear the search box to see everything again."
      }
    },
    messages: {
      added: "Task added.",
      updated: "Task updated.",
      completed: "Task marked as completed.",
      reopened: "Task moved back to active.",
      deleted: "Task deleted.",
      cleared: "All tasks removed.",
      restored: "Deleted task restored."
    },
    labels: {
      newTask: "New task",
      editTask: "Edit task",
      title: "Task title",
      titleHint: "Required. Up to 80 characters.",
      notes: "Notes (optional)",
      notesHint: "Up to 400 characters.",
      priority: "Priority",
      due: "Due date (optional)",
      add: "Add task",
      save: "Save changes",
      cancel: "Cancel edit",
      search: "Search tasks",
      searchHint: "Type to filter by title or notes.",
      edit: "Edit",
      complete: "Mark complete",
      reopen: "Mark active",
      delete: "Delete",
      confirmDelete: "Delete this task?",
      deleteYes: "Yes, delete",
      deleteNo: "Keep it",
      clearAll: "Clear all",
      confirmClear: "Delete every task?",
      restore: "Undo",
      remaining: "remaining",
      done: "done"
    }
  },

  /* ---------------------------------------------------------
     8. CONTACT
     --------------------------------------------------------- */
  contact: {
    heading: "Contact",
    intro:
      "For internships, junior roles, or questions about the project. The form validates everything in the browser before anything is sent.",
    channelsNote: "The fastest reply is usually LinkedIn or GitHub.",

    /* -------------------------------------------------------------
       MAIL RELAY (optional)
       This site is static, so it cannot run PHP. A Web3Forms relay
       posts the message to your inbox from the visitor's browser.

       - Leave accessKey as "" and the form honestly reports that no
         mail service is configured, pointing visitors to GitHub/LinkedIn.
       - With a key, the success message appears ONLY when the service
         confirms it accepted the message. Never fake a success.

       The key is designed to be public. A real mailbox password must
       never be placed in this file.
       ------------------------------------------------------------- */
    relay: {
      enabled: true,
      provider: "web3forms",
      endpoint: "https://api.web3forms.com/submit",
      accessKey: "ed071f54-1119-419d-8e8e-7960f9d611e4"
    },

    labels: {
      name: "Name",
      nameHint: "Required. Up to 80 characters.",
      email: "Email",
      emailHint: "Required. Use an address you can actually receive mail at.",
      subject: "Subject",
      subjectHint: "Optional. Up to 120 characters.",
      message: "Message",
      messageHint: "Required. At least 12 characters.",
      send: "Send message",
      sending: "Sending…",
      honeypotLabel: "Leave this field empty"
    },

    errors: {
      name: "Please enter your name.",
      email: "Please enter a valid email address.",
      emailShort: "That email address looks incomplete.",
      subjectLong: "Please keep the subject under 120 characters.",
      message: "Please write a message of at least 12 characters.",
      messageLong: "Please keep the message under 2000 characters.",
      generic: "Your message was not sent. Please use GitHub or LinkedIn instead.",
      offline: "Your browser is offline, so the message was not sent.",
      disconnected:
        "This build has no mail service connected, so the form cannot send. Please use GitHub or LinkedIn.",
      unconfigured:
        "The mail service rejected this request, so nothing was sent. Please use GitHub or LinkedIn."
    },

    success: "Message sent — it was accepted for delivery. I reply from jriku47@gmail.com.",

    /* Optional: name a second address if the relay delivers elsewhere. */
    replyAddress: "jriku47@gmail.com"
  },

  /* ---------------------------------------------------------
     9. FOOTER
     --------------------------------------------------------- */
  footer: {
    blurb: "Web Development specialization project — built with semantic HTML, modern CSS and vanilla JavaScript.",
    navLabel: "Footer",
    builtWith: "Hand-written HTML, CSS and JavaScript. No frameworks, no build step."
  }
};

/* Exposed on window so every module (and the test suite) can read it.
   `const` alone would only create a script-scoped binding. */
window.DEVFORGE = DEVFORGE;
