/* Generates the favicon and the four project thumbnails as SVG.
   Kept in the repo so the assets can be regenerated after editing. */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const out = path.join(root, "assets");
const thumbDir = path.join(out, "projects");
fs.mkdirSync(thumbDir, { recursive: true });

/* ---------- favicon ---------- */
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="DevForge">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#6366f1"/>
      <stop offset=".55" stop-color="#a855f7"/>
      <stop offset="1" stop-color="#22d3ee"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="15" fill="#0a1024"/>
  <rect x="2" y="2" width="60" height="60" rx="13" fill="none" stroke="url(#g)" stroke-width="2.5"/>
  <path d="M20 24 L32 44 L44 24" fill="none" stroke="url(#g)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
fs.writeFileSync(path.join(out, "favicon.svg"), favicon, "utf8");

/* ---------- project thumbnails ---------- */
const projects = [
  { file: "salon.svg",      title: "Salon Booking",    a: "#6366f1", b: "#22d3ee", motif: "calendar" },
  { file: "inventory.svg",  title: "Inventory Data",   a: "#8b5cf6", b: "#22d3ee", motif: "chart"   },
  { file: "portfolio.svg",  title: "Portfolio",        a: "#a855f7", b: "#6366f1", motif: "layout"  },
  { file: "devforge.svg",   title: "DevForge",         a: "#4f46e5", b: "#a855f7", motif: "forge"   }
];

const motifs = {
  calendar: `
    <rect x="404" y="96" width="150" height="130" rx="14" fill="rgba(7,11,24,.55)" stroke="rgba(255,255,255,.28)"/>
    <rect x="404" y="96" width="150" height="30" rx="14" fill="rgba(255,255,255,.14)"/>
    <g fill="rgba(255,255,255,.5)">
      <rect x="424" y="144" width="20" height="16" rx="4"/><rect x="456" y="144" width="20" height="16" rx="4"/>
      <rect x="488" y="144" width="20" height="16" rx="4"/><rect x="520" y="144" width="20" height="16" rx="4"/>
      <rect x="424" y="172" width="20" height="16" rx="4"/><rect x="456" y="172" width="20" height="16" rx="4"/>
      <rect x="488" y="172" width="20" height="16" rx="4" fill="rgba(255,255,255,.9)"/>
      <rect x="424" y="200" width="20" height="16" rx="4"/><rect x="456" y="200" width="20" height="16" rx="4"/>
    </g>`,
  chart: `
    <g fill="rgba(255,255,255,.30)">
      <rect x="404" y="176" width="26" height="50" rx="6"/>
      <rect x="442" y="148" width="26" height="78" rx="6"/>
      <rect x="480" y="120" width="26" height="106" rx="6"/>
      <rect x="518" y="96" width="26" height="130" rx="6"/>
    </g>
    <rect x="386" y="222" width="176" height="5" rx="3" fill="rgba(255,255,255,.5)"/>`,
  layout: `
    <rect x="398" y="94" width="164" height="120" rx="14" fill="rgba(7,11,24,.5)" stroke="rgba(255,255,255,.28)"/>
    <rect x="398" y="94" width="164" height="24" rx="14" fill="rgba(255,255,255,.16)"/>
    <rect x="412" y="132" width="70" height="70" rx="8" fill="rgba(255,255,255,.35)"/>
    <g fill="rgba(255,255,255,.22)">
      <rect x="494" y="132" width="54" height="10" rx="5"/>
      <rect x="494" y="150" width="54" height="10" rx="5"/>
      <rect x="494" y="168" width="34" height="10" rx="5"/>
    </g>`,
  forge: `
    <path d="M470 96 L436 176 h34 l-16 52 74 -96 h-40 l30 -36 z" fill="rgba(255,255,255,.55)"/>
    <circle cx="470" cy="170" r="78" fill="none" stroke="rgba(255,255,255,.20)" stroke-width="2"/>
    <circle cx="470" cy="170" r="98" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="2"/>`
};

projects.forEach((p) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" role="img" aria-label="${p.title} project preview">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p.a}"/>
      <stop offset="1" stop-color="${p.b}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="rgba(255,255,255,.30)"/>
      <stop offset="1" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>
  <rect width="640" height="360" fill="#0a1024"/>
  <rect width="640" height="360" fill="url(#bg)" opacity=".85"/>
  <circle cx="140" cy="70" r="150" fill="url(#glow)"/>
  <g opacity=".9">${motifs[p.motif]}</g>
  <g transform="translate(56 196)">
    <rect width="46" height="46" rx="12" fill="rgba(7,11,24,.55)" stroke="rgba(255,255,255,.35)"/>
    <text x="23" y="31" font-family="ui-monospace,Consolas,monospace" font-size="17" font-weight="700"
          fill="#ffffff" text-anchor="middle">${p.title.slice(0, 2).toUpperCase()}</text>
    <text x="0" y="92" font-family="system-ui,Segoe UI,sans-serif" font-size="30" font-weight="700"
          fill="#ffffff">${p.title}</text>
    <text x="0" y="122" font-family="ui-monospace,Consolas,monospace" font-size="14" letter-spacing="2"
          fill="rgba(255,255,255,.75)">DEVFORGE PROJECT</text>
  </g>
</svg>
`;
  fs.writeFileSync(path.join(thumbDir, p.file), svg, "utf8");
});

console.log("generated favicon.svg + " + projects.length + " project thumbnails");
