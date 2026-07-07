export const SAMPLE_LOGOS = [
  {
    name: "Aero Minimalist (White)",
    // A clean circular geometric brand logo
    url: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <circle cx="100" cy="100" r="90" stroke="white" stroke-width="6" fill="none" opacity="0.9" />
        <path d="M60,110 L100,55 L140,110 Z" fill="none" stroke="white" stroke-width="6" stroke-linejoin="round" />
        <path d="M75,130 L100,95 L125,130 Z" fill="white" opacity="0.8" />
        <circle cx="100" cy="100" r="10" fill="white" />
        <text x="100" y="170" fill="white" font-family="sans-serif" font-size="12" font-weight="bold" letter-spacing="4" text-anchor="middle">A E R O</text>
      </svg>
    `)}`
  },
  {
    name: "Retro Coffee (Warm Roast)",
    // A beautiful retro-style cafe logo
    url: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <rect width="200" height="200" fill="none" />
        <circle cx="100" cy="95" r="75" stroke="#f59e0b" stroke-width="4" stroke-dasharray="6 4" fill="none" />
        <circle cx="100" cy="95" r="65" stroke="#78350f" stroke-width="3" fill="#fef3c7" />
        <path d="M70,95 C70,120 130,120 130,95 Z" fill="#78350f" />
        <path d="M130,85 C145,85 145,105 130,105" stroke="#78350f" stroke-width="8" fill="none" />
        <path d="M85,75 C90,60 95,60 100,75 C105,60 110,60 115,75" stroke="#ef4444" stroke-width="4" stroke-linecap="round" fill="none" />
        <text x="100" y="145" fill="#78350f" font-family="monospace" font-size="11" font-weight="bold" letter-spacing="2" text-anchor="middle">ROAST &amp; CO.</text>
        <text x="100" y="180" fill="#f59e0b" font-family="sans-serif" font-size="10" font-weight="bold" letter-spacing="5" text-anchor="middle">EST. 2026</text>
      </svg>
    `)}`
  },
  {
    name: "Cyber Emblem (Volt Green)",
    // A futuristic cyberpunk neon logo
    url: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <path d="M40,50 L160,50 L180,90 L100,160 L20,90 Z" stroke="#22c55e" stroke-width="4" fill="#090d16" />
        <path d="M60,65 L140,65 L150,90 L100,135 L50,90 Z" fill="none" stroke="#3b82f6" stroke-width="2" />
        <line x1="100" y1="50" x2="100" y2="160" stroke="#22c55e" stroke-width="2" stroke-dasharray="4 4" />
        <polygon points="100,65 115,95 100,125 85,95" fill="#22c55e" fill-opacity="0.7" />
        <circle cx="100" cy="95" r="30" stroke="#3b82f6" stroke-width="2" fill="none" />
        <text x="100" y="185" fill="#22c55e" font-family="monospace" font-size="11" letter-spacing="3" text-anchor="middle">NEO_ACTIVE</text>
      </svg>
    `)}`
  }
];

export const MOCKUP_COLORS = [
  { name: "Nordic Cream", hex: "#f5f5f4" },
  { name: "Onyx Black", hex: "#1c1917" },
  { name: "Heather Gray", hex: "#a8a29e" },
  { name: "Forest Green", hex: "#14532d" },
  { name: "Crimson Red", hex: "#7f1d1d" },
  { name: "Mustard Gold", hex: "#ca8a04" },
  { name: "Pastel Pink", hex: "#fbcfe8" },
  { name: "Cobalt Blue", hex: "#1e3a8a" },
  { name: "Sage Green", hex: "#86efac" }
];

export const PRODUCT_TEMPLATES = [
  {
    id: 'mug',
    name: "Ceramic Coffee Mug",
    category: "Drinkware",
    defaultColor: "#f5f5f4",
    logoDefaultScale: 0.65,
    logoDefaultX: 42,
    logoDefaultY: 52,
  },
  {
    id: 'tshirt',
    name: "Premium Crewneck T-Shirt",
    category: "Apparel",
    defaultColor: "#1c1917",
    logoDefaultScale: 0.55,
    logoDefaultX: 50,
    logoDefaultY: 38,
  },
  {
    id: 'hoodie',
    name: "Classic Pullover Hoodie",
    category: "Apparel",
    defaultColor: "#a8a29e",
    logoDefaultScale: 0.5,
    logoDefaultX: 50,
    logoDefaultY: 36,
  },
  {
    id: 'tote',
    name: "Natural Canvas Tote Bag",
    category: "Accessories",
    defaultColor: "#fafaf9",
    logoDefaultScale: 0.6,
    logoDefaultX: 50,
    logoDefaultY: 62,
  },
  {
    id: 'cap',
    name: "Classic Baseball Cap",
    category: "Accessories",
    defaultColor: "#14532d",
    logoDefaultScale: 0.7,
    logoDefaultX: 50,
    logoDefaultY: 48,
  },
  {
    id: 'notebook',
    name: "Hardbound Journal Notebook",
    category: "Stationery",
    defaultColor: "#7f1d1d",
    logoDefaultScale: 0.55,
    logoDefaultX: 52,
    logoDefaultY: 48,
  },
  {
    id: 'phonecase',
    name: "Sleek Protective Phone Case",
    category: "Accessories",
    defaultColor: "#ca8a04",
    logoDefaultScale: 0.5,
    logoDefaultX: 50,
    logoDefaultY: 54,
  },
  {
    id: 'custom',
    name: "AI Custom Background Scene",
    category: "AI Synthesized",
    defaultColor: "#ffffff",
    logoDefaultScale: 0.8,
    logoDefaultX: 50,
    logoDefaultY: 50,
  }
];
