// Default seed data for MediCare Supplies Demo
// Stored in localStorage on first load

// High-quality inline medical SVG icons as data URLs to guarantee 100% offline reliability without broken image links
function createSvgDataUrl(bgHue, iconSvg) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="#f8fafc"/>
    <rect x="20" y="20" width="360" height="260" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
    <circle cx="200" cy="140" r="70" fill="${bgHue}" opacity="0.12"/>
    <g transform="translate(160, 100)" stroke="${bgHue}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
      ${iconSvg}
    </g>
    <text x="200" y="245" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#64748b" text-anchor="middle">Standard Medical Grade</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_PRODUCTS = [
  {
    id: "med-01",
    name: "Nitrile Examination Gloves (Powder-Free)",
    category: "Personal Protective Equipment",
    brand: "MediShield Pro",
    description: "High tensile strength medical examination gloves offering tactile sensitivity and reliable chemical splash resistance. Latex-free and non-sterile.",
    specs: "Material: 100% Synthetic Nitrile; Color: Cobalt Blue; Thickness: 4.0 mil; Standard: ASTM D6319, EN 455; Powder-free.",
    packaging: "Box of 100 pcs (50 pairs)",
    price: 360,
    priceDisplay: "₱360.00",
    availability: "Available",
    image: createSvgDataUrl("#0f2942", `<path d="M18 11V6a2 2 0 0 1 4 0v7a2 2 0 0 1 4 0v-4a2 2 0 0 1 4 0v6a2 2 0 0 1 4 0v3a9 9 0 0 1-18 0v-4"/><path d="M6 18a6 6 0 0 1 6-6h2"/>`)
  },
  {
    id: "med-02",
    name: "Surgical Face Masks 3-Ply (BFE ≥ 98%)",
    category: "Personal Protective Equipment",
    brand: "SafeBreathe Medical",
    description: "Fluid-resistant disposable face masks equipped with ultrasonically welded ear loops and adjustable aluminum nose bridge for a secure seal.",
    specs: "Filtration: BFE ≥ 98%, PFE ≥ 98%; Layers: Polypropylene spunbond outer/inner, meltblown middle filter; Hypoallergenic.",
    packaging: "Box of 50 pcs",
    price: 135,
    priceDisplay: "₱135.00",
    availability: "Available",
    image: createSvgDataUrl("#0d9488", `<rect x="6" y="10" width="68" height="44" rx="6"/><line x1="6" y1="24" x2="74" y2="24"/><line x1="6" y1="38" x2="74" y2="38"/><path d="M6 16C-6 24 -6 40 6 48"/><path d="M74 16C86 24 86 40 74 48"/>`)
  },
  {
    id: "med-03",
    name: "Sterile Absorbent Gauze Pads (4\" x 4\")",
    category: "Medical Consumables",
    brand: "CuraWound",
    description: "USP Type VII 100% woven cotton gauze sponges individually sealed for clean wound dressing, debridement, and exudate absorption.",
    specs: "Dimensions: 4 in x 4 in (10cm x 10cm); Ply: 12-ply; Sterilization: Ethylene Oxide (EO); Lint-free woven edges.",
    packaging: "Box of 100 individually wrapped packets",
    price: 240,
    priceDisplay: "₱240.00",
    availability: "Available",
    image: createSvgDataUrl("#1a365d", `<rect x="12" y="12" width="56" height="56" rx="4"/><line x1="24" y1="12" x2="24" y2="68"/><line x1="40" y1="12" x2="40" y2="68"/><line x1="56" y1="12" x2="56" y2="68"/><line x1="12" y1="28" x2="68" y2="28"/><line x1="12" y1="44" x2="68" y2="44"/><line x1="12" y1="60" x2="68" y2="60"/>`)
  },
  {
    id: "med-04",
    name: "Disposable Syringes with Luer Lock Needle (3mL)",
    category: "Medical Consumables",
    brand: "PrecisionInject",
    description: "Ultra-clear polypropylene barrel with clearly defined graduation scale markings and secure luer lock tip preventing accidental needle detachment.",
    specs: "Volume: 3 mL; Needle: 23G x 1 inch detachable; Piston: Latex-free medical synthetic rubber; Pyrogen-free.",
    packaging: "Box of 100 pcs blister packs",
    price: 480,
    priceDisplay: "₱480.00",
    availability: "Available",
    image: createSvgDataUrl("#08837e", `<path d="m32 20 28 28"/><path d="m42 10 28 28"/><line x1="56" y1="24" x2="68" y2="12"/><line x1="64" y1="8" x2="72" y2="16"/><line x1="28" y1="36" x2="16" y2="48"/><line x1="10" y1="54" x2="18" y2="46"/><line x1="14" y1="50" x2="6" y2="58"/>`)
  },
  {
    id: "med-05",
    name: "Digital Infrared Forehead Thermometer",
    category: "Diagnostic Equipment",
    brand: "ThermoScan Medical",
    description: "Non-contact clinical grade thermometer with instant 1-second infrared sensor, color-coded fever warning screen, and 32-reading memory recall.",
    specs: "Measurement range: 32.0°C - 42.9°C (89.6°F - 109.2°F); Accuracy: ±0.2°C; Distance: 1-5 cm; Power: 2x AAA batteries.",
    packaging: "1 Unit per Retail Box with Battery & Manual",
    price: 950,
    priceDisplay: "₱950.00",
    availability: "Available",
    image: createSvgDataUrl("#0f2942", `<path d="M28 62V22a10 10 0 0 1 20 0v40a16 16 0 1 1-20 0z"/><circle cx="38" cy="62" r="8"/><line x1="38" y1="26" x2="38" y2="54"/>`)
  },
  {
    id: "med-06",
    name: "Automatic Upper Arm Blood Pressure Monitor",
    category: "Diagnostic Equipment",
    brand: "CardioCheck Pro",
    description: "Fully automatic digital sphygmomanometer featuring IntelliSense cuff inflation, irregular heartbeat detection, and 2-user 99-reading memory.",
    specs: "Pressure Range: 0 to 299 mmHg; Pulse: 40 to 180 beats/min; Cuff Size: Standard 22–42 cm wide-range; Power: AC Adapter or 4x AA.",
    packaging: "1 Complete Kit (Monitor, Wide Cuff, Case, Adapter)",
    price: 1850,
    priceDisplay: "₱1,850.00",
    availability: "Available",
    image: createSvgDataUrl("#14b8a6", `<rect x="10" y="16" width="60" height="48" rx="8"/><circle cx="40" cy="40" r="16"/><path d="M40 28v12l8 4"/>`)
  },
  {
    id: "med-07",
    name: "Fingertip Pulse Oximeter (Dual Color OLED)",
    category: "Diagnostic Equipment",
    brand: "OxySense Clinique",
    description: "Portable non-invasive blood oxygen saturation and pulse rate monitor with multi-directional display, plethysmograph waveform, and auto-shutoff.",
    specs: "SpO2 Range: 70%–100% (±2%); Pulse Range: 30–250 bpm; Battery: 2x AAA (up to 30 continuous hours); Auto-off in 8s.",
    packaging: "1 Unit with Lanyard and Pouch",
    price: 680,
    priceDisplay: "₱680.00",
    availability: "Available",
    image: createSvgDataUrl("#1a365d", `<rect x="16" y="14" width="48" height="52" rx="10"/><circle cx="40" cy="36" r="10"/><path d="M24 54h32"/>`)
  },
  {
    id: "med-08",
    name: "Standard Folding Wheelchair (Chrome Plated Steel)",
    category: "Patient Care",
    brand: "MobilityCare Plus",
    description: "Heavy-duty folding patient wheelchair engineered with reinforced cross-braces, wipeable vinyl upholstery, padded armrests, and swing-away footrests.",
    specs: "Weight capacity: 110 kg (242 lbs); Seat Width: 18 inches; Rear Wheels: 24\" solid rubber; Front casters: 8\" PVC; Total weight: 17.5 kg.",
    packaging: "1 Fully Assembled Folded Unit",
    price: 4950,
    priceDisplay: "₱4,950.00",
    availability: "Available",
    image: createSvgDataUrl("#0f2942", `<circle cx="36" cy="52" r="16"/><circle cx="36" cy="52" r="6"/><path d="M36 36V18h16l10 24h12"/><circle cx="68" cy="14" r="5"/><circle cx="68" cy="62" r="6"/>`)
  },
  {
    id: "med-09",
    name: "Workplace & Emergency First Aid Kit (65-Piece)",
    category: "Clinic Supplies",
    brand: "RescueLine Safety",
    description: "Comprehensive medical response kit stocked in a water-resistant wall-mountable hard case, organized for quick access during clinic or workplace injuries.",
    specs: "Includes: Antiseptic wipes, triangular bandages, conforming rolls, sterile pads, tweezers, trauma shears, adhesive strips, CPR shield, tourniquet.",
    packaging: "1 Wall-Mountable Hard Case Box",
    price: 1250,
    priceDisplay: "₱1,250.00",
    availability: "Available",
    image: createSvgDataUrl("#0d9488", `<rect x="12" y="20" width="56" height="46" rx="6"/><path d="M30 20V12a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v8"/><line x1="40" y1="31" x2="40" y2="55"/><line x1="28" y1="43" x2="52" y2="43"/>`)
  },
  {
    id: "med-10",
    name: "Isopropyl Alcohol 70% Antiseptic (1 Gallon / 3.785L)",
    category: "Medical Consumables",
    brand: "SaniClean Pharma",
    description: "Hospital-grade antiseptic and antibacterial topical solution formulated for clinic surface sanitization, hand disinfection, and general sterilizing.",
    specs: "Active: 70% Isopropanol USP; Form: Clear Liquid; Volume: 1 US Gallon (3,785 mL); Scent: Clean clinical; Safety capped.",
    packaging: "1 Gallon Bottle (4 bottles per master carton)",
    price: 395,
    priceDisplay: "₱395.00",
    availability: "Available",
    image: createSvgDataUrl("#1a365d", `<rect x="22" y="24" width="36" height="48" rx="4"/><path d="M34 24V12h12v12"/><path d="M30 12h20"/>`)
  },
  {
    id: "med-11",
    name: "Compressor Nebulizer Therapy System",
    category: "Diagnostic Equipment",
    brand: "RespiraCare Ultra",
    description: "Durable piston-compressor medication nebulizer delivering consistent aerosol medication for asthma, bronchitis, and respiratory treatments.",
    specs: "MMAD: ~3.0 µm; Nebulization Rate: ≥ 0.25 mL/min; Sound: < 60 dB; Includes adult mask, pediatric mask, angled mouthpiece, tubing, 5 filters.",
    packaging: "1 Complete Clinical Machine System",
    price: 1450,
    priceDisplay: "₱1,450.00",
    availability: "Available",
    image: createSvgDataUrl("#08837e", `<rect x="14" y="20" width="52" height="42" rx="6"/><circle cx="34" cy="41" r="8"/><path d="M50 32v18"/><path d="M56 37h6c4 0 8 4 8 8v8"/>`)
  },
  {
    id: "med-12",
    name: "Disposable Non-Woven Bed Sheet Roll (50m x 60cm)",
    category: "Clinic Supplies",
    brand: "MediCover Pro",
    description: "Waterproof and grease-resistant spunbond polypropylene exam table paper roll with pre-perforated tear lines for hygienic clinic patient turnover.",
    specs: "Dimensions: 60 cm width x 50 meters length; Perforation: Every 40 cm; Grammage: 25 gsm; Embossed texture.",
    packaging: "1 Continuous Roll in protective shrinkwrap",
    price: 520,
    priceDisplay: "₱520.00",
    availability: "Available",
    image: createSvgDataUrl("#0f2942", `<ellipse cx="26" cy="40" rx="12" ry="24"/><path d="M26 16h40c6.6 0 12 10.7 12 24s-5.4 24-12 24H26"/>`)
  },
  {
    id: "med-13",
    name: "Dual-Head Stainless Steel Clinical Stethoscope",
    category: "Diagnostic Equipment",
    brand: "AcuSound Cardiology",
    description: "Acoustically superior stainless steel chestpiece with tunable diaphragm and deep bell for high and low frequency auscultation of heart and lung sounds.",
    specs: "Chestpiece: Machined stainless steel; Tubing: Dual-lumen latex-free; Ear tips: Soft sealing silicone; Length: 27 inches.",
    packaging: "1 Boxed Instrument with spare ear tips & diaphragm",
    price: 1650,
    priceDisplay: "₱1,650.00",
    availability: "Available",
    image: createSvgDataUrl("#14b8a6", `<path d="M20 18v16c0 10 8 18 18 18h4c10 0 18-8 18-18V18"/><circle cx="20" cy="14" r="4"/><circle cx="60" cy="14" r="4"/><path d="M40 52v12a8 8 0 0 0 8 8h10"/><circle cx="66" cy="72" r="8"/>`)
  },
  {
    id: "med-14",
    name: "Adjustable Aluminum Underarm Crutches (Pair)",
    category: "Patient Care",
    brand: "MobilityCare Plus",
    description: "Lightweight anodized aluminum crutches with dual push-button height adjustments for underarm pad and hand grip. Heavy duty non-skid rubber tips.",
    specs: "Patient Height: Medium (5'2\" to 5'10\"); Adjustment: 9-step height, 4-step handgrip; Weight capacity: 136 kg (300 lbs).",
    packaging: "1 Pair (Left and Right)",
    price: 880,
    priceDisplay: "₱880.00",
    availability: "Pre-order",
    image: createSvgDataUrl("#0d9488", `<line x1="24" y1="12" x2="56" y2="12"/><line x1="28" y1="12" x2="38" y2="72"/><line x1="52" y1="12" x2="42" y2="72"/><line x1="30" y1="36" x2="50" y2="36"/><rect x="36" y="70" width="8" height="6" rx="2"/>`)
  }
];

export const INITIAL_SETTINGS = {
  businessName: "MediCare Supplies",
  brandSubtitle: "Medical Supplies Demo",
  heroHeading: "Medical Supplies for Everyday Care.",
  heroSubheading: "Supplying trusted medical consumables, diagnostic tools, and patient care essentials to clinics, community health centers, businesses, and households across the Philippines.",
  aboutHeading: "Reliable Medical Supplies Partner",
  aboutText: "MediCare Supplies is a demonstration showcase designed to present how clinical facilities, small businesses, and private caregivers can explore medical inventories and request consolidated formal price quotations online. We prioritize transparent product specifications, reliable stock availability tracking, and straightforward order fulfillment coordination.",
  deliveryText: "Sample delivery coverage: Standard nationwide courier shipping via LBC/J&T and same-day on-demand transport (Grab/Lalamove) within Metro Manila and nearby provinces for rush items. Warehouse pickup is also arranged for confirmed quotation orders.",
  paymentText: "Sample payment options: Bank transfer (BDO, BPI, Metrobank), GCash corporate account, or Check payment upon receipt for pre-approved institutional and clinic accounts. (Note: Demonstration setup only; no live financial checkout).",
  contactPhone: "+63 (02) 8123-4567 / +63 917 123 4567",
  contactEmail: "inquiries@medicaresupplies-demo.ph",
  contactAddress: "Unit 402 HealthCore Bldg, Medical Plaza Blvd, Pasig City, Metro Manila, Philippines",
  operatingHours: "Monday – Friday: 8:00 AM – 5:30 PM | Saturday: 8:30 AM – 1:00 PM (PHT)",
  facebookUrl: "https://www.facebook.com/profile.php?id=61590781614230"
};

export const INITIAL_FAQS = [
  {
    id: "faq-1",
    question: "How do bulk orders and institutional pricing work?",
    answer: "For healthcare centers, clinics, schools, and corporate purchasing, we provide volume tiered pricing. Simply add your desired items and estimated quantities into the Quotation Request builder. Our team reviews stock availability and replies with a formal price quote."
  },
  {
    id: "faq-2",
    question: "How is product availability verified?",
    answer: "Items marked 'Available' are stocked in our standard replenishment cycle. Items labeled 'Pre-order' generally take 5 to 10 business days for specialized dispatch. Once you submit a quote, we confirm current batch lot numbers and delivery schedules."
  },
  {
    id: "faq-3",
    question: "What are the delivery and pickup arrangements?",
    answer: "Orders can be dispatched via accredited freight forwarders nationwide or same-day logistics within Metro Manila. Pre-arranged warehouse pickup is also supported upon issuance of a formal quotation confirmation."
  },
  {
    id: "faq-4",
    question: "What is your warranty and returns policy for medical equipment?",
    answer: "Diagnostic instruments (such as digital monitors, nebulizers, and pulse oximeters) include a standard 1-year manufacturer service warranty against factory defects. Medical consumables cannot be returned once individual sterile blister seals are broken."
  }
];

export const INITIAL_QUOTES = [
  {
    id: "qt-001",
    refNumber: "QT-2026-1042",
    customerName: "Dr. Maria Elena Santos",
    companyName: "Santos Family Wellness Clinic",
    email: "dr.santos@wellnessclinic.ph",
    phone: "0918-555-0192",
    deliveryAddress: "Room 304, San Juan Medical Tower, San Juan City",
    notes: "Please confirm batch expiry dates for Nitrile gloves and 3-ply masks. Requesting delivery by Friday.",
    items: [
      { id: "med-01", name: "Nitrile Examination Gloves (Powder-Free)", unitPrice: 360, quantity: 5, packaging: "Box of 100 pcs" },
      { id: "med-02", name: "Surgical Face Masks 3-Ply (BFE ≥ 98%)", unitPrice: 135, quantity: 10, packaging: "Box of 50 pcs" },
      { id: "med-06", name: "Automatic Upper Arm Blood Pressure Monitor", unitPrice: 1850, quantity: 2, packaging: "1 Complete Kit" }
    ],
    status: "New",
    internalNotes: "Stock reserved in warehouse. Awaiting customer confirmation on shipping courier.",
    createdAt: "2026-10-05T09:30:00.000Z"
  },
  {
    id: "qt-002",
    refNumber: "QT-2026-1043",
    customerName: "Arnel Bautista",
    companyName: "Horizon Logistics Office Care",
    email: "safety@horizonlogistics.ph",
    phone: "0920-888-4321",
    deliveryAddress: "Warehouse 12, C5 Road, Taguig City",
    notes: "Restocking our first aid cabinets for annual safety compliance.",
    items: [
      { id: "med-09", name: "Workplace & Emergency First Aid Kit (65-Piece)", unitPrice: 1250, quantity: 4, packaging: "1 Wall-Mountable Hard Case Box" },
      { id: "med-10", name: "Isopropyl Alcohol 70% Antiseptic (1 Gallon)", unitPrice: 395, quantity: 6, packaging: "1 Gallon Bottle" }
    ],
    status: "Quoted",
    internalNotes: "Formal PDF quote sent via email on Oct 6. Follow-up scheduled.",
    createdAt: "2026-10-06T04:15:00.000Z"
  }
];
