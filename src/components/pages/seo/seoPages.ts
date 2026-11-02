// Search-focused category pages and guides. Every claim here must be supported by the
// linked sources or by the store's own policies; do not add unverified figures.

export interface SeoPageConfig {
  path: string;
  kind: 'category' | 'guide';
  seoTitle: string;
  seoDescription: string;
  keywords: string;
  badge: string;
  h1: string;
  intro: string;
  primaryCta?: { label: string; to: string };
  table?: { title: string; headers: string[]; rows: string[][]; note?: string };
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  productMatch?: string[];
  productExclude?: string[];
  productsHeading?: string;
  faqs: { question: string; answer: string }[];
  related: { label: string; to: string }[];
  sources?: { label: string; url: string }[];
}

const EPA_SALES = 'https://www.epa.gov/section608/stationary-refrigeration-and-air-conditioning-sales-restriction';
const EPA_TT = 'https://www.epa.gov/climate-hfcs-reduction/technology-transitions-hfc-restrictions-sector';
const EPA_608 = 'https://www.epa.gov/section608';

const BUYING_FAQ = {
  question: 'Do I need EPA certification to buy from Alper Refrigerants?',
  answer:
    'Yes for refrigerants. Refrigerant orders require an EPA Section 608 certification (or proof that you employ certified technicians) and are reviewed before they ship. Equipment and tools do not require certification.',
};

export const SEO_PAGES: SeoPageConfig[] = [
  // ---------- Category pages ----------
  {
    path: '/products/r-410a',
    kind: 'category',
    seoTitle: 'R-410A Refrigerant 25 lb Cylinders | Wholesale',
    seoDescription:
      'Buy R-410A refrigerant by the cylinder, pallet or container for servicing existing systems. EPA 608 certification required. Card or bank wire.',
    keywords: 'r-410a refrigerant, 410a 25 lb, buy r410a, r-410a wholesale, r410a phase down',
    badge: 'Service refrigerant',
    h1: 'R-410A Refrigerant',
    intro:
      'R-410A remains the service refrigerant for millions of installed air conditioners and heat pumps. Order single cylinders, full pallets or container loads for repair and maintenance work.',
    primaryCta: { label: 'Shop refrigerants', to: '/products/refrigerants' },
    sections: [
      {
        heading: 'Can R-410A still be used?',
        paragraphs: [
          'Yes for servicing. Under the EPA Technology Transitions rule, new residential and light commercial split systems must use a refrigerant with a GWP below 700. That limits new equipment, not the repair of systems already installed, so R-410A is still needed to service existing units.',
          'Newly manufactured systems are moving to A2L refrigerants such as R-454B and R-32. Never top off an R-410A system with a different refrigerant.',
        ],
      },
      {
        heading: 'Ordering options',
        paragraphs: [],
        bullets: [
          'Single cylinders: order 1 to 39 cylinders at the per-cylinder price.',
          'Pallets: from 40 cylinders, pallet pricing applies and improves as pallet count rises.',
          'Container loads: request a quote for full or half containers.',
          'Bank wire orders receive a 15% discount; card payments are also accepted.',
        ],
      },
    ],
    productMatch: ['r-410a', 'r410a'],
    productExclude: ['btu', 'mini split', 'heat pump', 'condenser'],
    productsHeading: 'R-410A in stock',
    faqs: [
      {
        question: 'Is R-410A being banned?',
        answer:
          'Production is being phased down under the AIM Act, and new split systems must use lower-GWP refrigerants. Servicing existing R-410A equipment with R-410A remains allowed.',
      },
      {
        question: 'Can I put R-454B or R-32 into an R-410A system?',
        answer:
          'No. A2L refrigerants require equipment designed and listed for them. Only charge the refrigerant named on the equipment nameplate.',
      },
      BUYING_FAQ,
    ],
    related: [
      { label: 'R-454B vs R-32 compared', to: '/guides/r-454b-vs-r-32' },
      { label: 'Who can legally buy refrigerant', to: '/guides/who-can-buy-refrigerant' },
      { label: 'R-454B refrigerant', to: '/products/r-454b' },
    ],
    sources: [
      { label: 'EPA: Technology Transitions restrictions by sector', url: EPA_TT },
      { label: 'EPA: Refrigerant sales restriction', url: EPA_SALES },
    ],
  },
  {
    path: '/products/r-32',
    kind: 'category',
    seoTitle: 'R-32 Refrigerant Cylinders | A2L Wholesale',
    seoDescription:
      'R-32 refrigerant for new low-GWP air conditioners and heat pumps. Single-component A2L refrigerant sold by cylinder or pallet to EPA 608 certified buyers.',
    keywords: 'r-32 refrigerant, r32 refrigerant 25 lb, buy r-32, r-32 a2l, r32 wholesale',
    badge: 'A2L refrigerant',
    h1: 'R-32 Refrigerant',
    intro:
      'R-32 is a single-component A2L refrigerant used in many new mini-splits and heat pumps. It has a GWP of 675, below the 700 limit for new residential split systems.',
    primaryCta: { label: 'Shop refrigerants', to: '/products/refrigerants' },
    sections: [
      {
        heading: 'Handling R-32',
        paragraphs: [
          'R-32 is classified A2L (lower flammability). Use tools and recovery equipment rated for A2L refrigerants and follow the equipment manufacturer instructions.',
          'Because R-32 is a single component, it has no temperature glide and can be charged as vapor or liquid.',
        ],
      },
    ],
    productMatch: ['r-32 ', 'r32 ', 'r-32-', '(r-32)'],
    productExclude: ['btu', 'mini split', 'heat pump', 'condenser'],
    productsHeading: 'R-32 in stock',
    faqs: [
      {
        question: 'Which equipment uses R-32?',
        answer:
          'Several manufacturers, including Daikin and Goodman, use R-32 in new residential systems. Always check the equipment nameplate.',
      },
      {
        question: 'Is R-32 a replacement for R-410A in existing systems?',
        answer: 'No. R-32 is only for equipment designed and listed for it.',
      },
      BUYING_FAQ,
    ],
    related: [
      { label: 'R-454B vs R-32 compared', to: '/guides/r-454b-vs-r-32' },
      { label: 'R-454B handling and cylinders', to: '/guides/r-454b-handling' },
      { label: 'R-410A refrigerant', to: '/products/r-410a' },
    ],
    sources: [{ label: 'EPA: Technology Transitions restrictions by sector', url: EPA_TT }],
  },
  {
    path: '/brands/mrcool',
    kind: 'category',
    seoTitle: 'MRCOOL Mini Splits & Heat Pumps | Alper',
    seoDescription:
      'MRCOOL DIY and ducted mini split heat pumps with manufacturer specifications, single-unit and bulk pricing, card or bank wire payment.',
    keywords: 'mrcool diy mini split, mrcool mini split, mrcool heat pump, mrcool 5th gen, mrcool universal',
    badge: 'Brand',
    h1: 'MRCOOL Mini Splits and Heat Pumps',
    intro:
      'Compare MRCOOL DIY, Universal and ducted systems. Each listing shows the manufacturer capacity and voltage, with single-unit prices and lower prices for bulk orders.',
    primaryCta: { label: 'All air conditioners', to: '/products/air-conditioners' },
    sections: [
      {
        heading: 'Choosing a MRCOOL system',
        paragraphs: [
          'Match capacity (BTU) to the room or zone load, and check the voltage: most larger systems need a 208/230V circuit. Specifications on each listing come from MRCOOL product pages, linked in the listing details.',
        ],
      },
      {
        heading: 'Bulk and contractor orders',
        paragraphs: [
          'Pricing improves at 5, 20 and 40+ units, with container quantities quoted on request. Bank wire orders receive a 15% discount.',
        ],
      },
    ],
    productMatch: ['mrcool'],
    productsHeading: 'MRCOOL systems',
    faqs: [
      {
        question: 'Do I need certification to buy a MRCOOL system?',
        answer:
          'No certification is needed to buy equipment. Installation and refrigerant handling must follow local codes and the manufacturer instructions.',
      },
      {
        question: 'Where do the specifications come from?',
        answer: 'From MRCOOL manufacturer pages. The source link is stored with each listing.',
      },
    ],
    related: [
      { label: 'Senville mini splits', to: '/brands/senville' },
      { label: 'Heating and heat pumps', to: '/products/heating-heat-pumps' },
      { label: 'Shipping policy', to: '/shipping-policy' },
    ],
  },
  {
    path: '/brands/senville',
    kind: 'category',
    seoTitle: 'Senville Mini Split Heat Pumps | Alper',
    seoDescription:
      'Senville LETO and AURA mini split heat pumps with manufacturer specs, single-unit and bulk pricing for contractors and resellers.',
    keywords: 'senville mini split, senville leto, senville aura, senville heat pump, senville 12000 btu',
    badge: 'Brand',
    h1: 'Senville Mini Split Heat Pumps',
    intro:
      'Senville ductless systems from 9,000 to 36,000 BTU. Listings show manufacturer capacity, voltage and frequency, with single-unit and bulk pricing.',
    primaryCta: { label: 'All air conditioners', to: '/products/air-conditioners' },
    sections: [
      {
        heading: 'Voltage and sizing',
        paragraphs: [
          'Most Senville systems are 208/230V, 60 Hz single phase; some 9,000 BTU models run on 115V. Check the voltage on each listing before ordering.',
        ],
      },
    ],
    productMatch: ['senville'],
    productsHeading: 'Senville systems',
    faqs: [
      {
        question: 'Can I order a single Senville unit?',
        answer: 'Yes. Single units are priced individually, and prices drop at higher quantities.',
      },
      {
        question: 'Where do the specifications come from?',
        answer: 'From Senville product specification tables. The source link is stored with each listing.',
      },
    ],
    related: [
      { label: 'MRCOOL mini splits', to: '/brands/mrcool' },
      { label: 'PTAC units', to: '/products/ptac-units' },
      { label: 'Heating and heat pumps', to: '/products/heating-heat-pumps' },
    ],
  },
  {
    path: '/products/ptac-units',
    kind: 'category',
    seoTitle: 'PTAC Units & PTAC Heat Pumps | Wholesale',
    seoDescription:
      'PTAC air conditioners and heat pumps for hotels, apartments and senior living. Single-unit and bulk pricing for property managers and contractors.',
    keywords: 'ptac unit, ptac heat pump, ptac air conditioner wholesale, hotel ptac, ptac 12000 btu',
    badge: 'Commercial',
    h1: 'PTAC Units and PTAC Heat Pumps',
    intro:
      'Packaged terminal air conditioners (PTACs) heat and cool single rooms through a wall sleeve. They are common in hotels, apartments and senior living facilities.',
    primaryCta: { label: 'All air conditioners', to: '/products/air-conditioners' },
    sections: [
      {
        heading: 'What to check before ordering',
        paragraphs: [],
        bullets: [
          'Wall sleeve size: confirm it matches the existing sleeve.',
          'Voltage and plug: PTACs are commonly 208/230V or 265V; match your building supply.',
          'Heat type: heat pump models are more efficient than electric-resistance heat in mild climates.',
        ],
      },
      {
        heading: 'Property replacement projects',
        paragraphs: [
          'For multi-room replacements, request a quote with your unit count and delivery address. Bulk tiers apply from 5 units.',
        ],
      },
    ],
    productMatch: ['ptac'],
    productsHeading: 'PTAC units',
    faqs: [
      {
        question: 'Do PTAC units fit any wall sleeve?',
        answer:
          'No. Sleeve dimensions vary by manufacturer and model. Confirm the sleeve size and grille type before ordering.',
      },
      {
        question: 'Can I get pricing for a whole building?',
        answer: 'Yes. Send your unit count through the quote form and the sales team will reply with pricing.',
      },
    ],
    related: [
      { label: 'Heating and heat pumps', to: '/products/heating-heat-pumps' },
      { label: 'Request a quote', to: '/rfq' },
      { label: 'Senville mini splits', to: '/brands/senville' },
    ],
  },

  // ---------- Guides ----------
  {
    path: '/guides/r-454b-vs-r-32',
    kind: 'guide',
    seoTitle: 'R-454B vs R-32: Differences for HVAC Contractors',
    seoDescription:
      'R-454B vs R-32 compared: GWP, composition, glide, safety class and which manufacturers use each. Plain guide for HVAC technicians.',
    keywords: 'r454b vs r32, r-454b vs r-32, r454b refrigerant, r32 refrigerant, a2l refrigerants',
    badge: 'Guide',
    h1: 'R-454B vs R-32: What Is the Difference?',
    intro:
      'Both refrigerants replace R-410A in new air conditioners and heat pumps, and both are A2L. The equipment decides which one you use; they are not interchangeable.',
    primaryCta: { label: 'See R-454B', to: '/products/r-454b' },
    table: {
      title: 'Side-by-side comparison',
      headers: ['', 'R-454B', 'R-32', 'R-410A (for reference)'],
      rows: [
        ['Composition', 'Blend: R-32 (68.9%) and R-1234yf (31.1%)', 'Single component', 'Blend: R-32 and R-125'],
        ['GWP (AR4)', '466', '675', '2,088'],
        ['ASHRAE safety class', 'A2L', 'A2L', 'A1'],
        ['Temperature glide', 'Small (near-azeotropic)', 'None', 'Negligible'],
        ['Charging', 'Charge as liquid', 'Liquid or vapor', 'Charge as liquid'],
        ['Used in new equipment by', 'Carrier, Trane, Lennox, others', 'Daikin, Goodman, others', 'Legacy equipment'],
      ],
      note: 'Always follow the refrigerant shown on the equipment nameplate.',
    },
    sections: [
      {
        heading: 'Why the change from R-410A?',
        paragraphs: [
          'The EPA Technology Transitions rule limits new residential and light commercial split systems to refrigerants with a GWP below 700. R-410A is far above that limit, so manufacturers moved to R-454B or R-32.',
        ],
      },
      {
        heading: 'What it means on the job',
        paragraphs: [
          'Both are mildly flammable (A2L). Use recovery machines, vacuum pumps and leak detectors rated for A2L refrigerants, and never mix refrigerants or top off with a different gas.',
        ],
      },
    ],
    productMatch: ['r-454b', 'r454b', 'r-32 ', 'r32 '],
    productExclude: ['btu', 'mini split', 'heat pump', 'condenser'],
    productsHeading: 'A2L refrigerants in stock',
    faqs: [
      {
        question: 'Can R-454B and R-32 be mixed?',
        answer: 'No. Never mix refrigerants. Each system must be charged only with the refrigerant on its nameplate.',
      },
      {
        question: 'Which has the lower GWP?',
        answer: 'R-454B, at 466 versus 675 for R-32 (IPCC AR4 values).',
      },
      BUYING_FAQ,
    ],
    related: [
      { label: 'R-454B handling and cylinders', to: '/guides/r-454b-handling' },
      { label: 'R-32 refrigerant', to: '/products/r-32' },
      { label: 'R-410A refrigerant', to: '/products/r-410a' },
    ],
    sources: [
      { label: 'EPA: Technology Transitions restrictions by sector', url: EPA_TT },
      { label: 'Chemours: Opteon XL41 (R-454B)', url: 'https://www.opteon.com/en/products/refrigerants/xl41' },
    ],
  },
  {
    path: '/guides/who-can-buy-refrigerant',
    kind: 'guide',
    seoTitle: 'Who Can Buy Refrigerant? EPA 608 Rules Explained',
    seoDescription:
      'Who can legally buy R-410A, R-454B and other refrigerants in the US, what proof sellers need, and what that means when you order online.',
    keywords: 'who can buy refrigerant, epa 608 certification to buy refrigerant, can homeowners buy r410a, refrigerant sales restriction',
    badge: 'Guide',
    h1: 'Who Can Legally Buy Refrigerant in the US?',
    intro:
      'The EPA restricts the sale of refrigerant for stationary air conditioning and refrigeration to certified technicians and their employers. Here is what that means in practice.',
    primaryCta: { label: 'Shop refrigerants', to: '/products/refrigerants' },
    sections: [
      {
        heading: 'The rule',
        paragraphs: [
          'Under Section 608 of the Clean Air Act, refrigerant for stationary equipment, including HFCs like R-410A, may only be sold to technicians certified under Section 608 (or Section 609 for motor vehicle air conditioning), or to employers who can show they employ certified technicians.',
          'There are limited exceptions, such as small cans of motor-vehicle refrigerant with self-sealing valves, and refrigerant bought for resale to certified buyers.',
        ],
      },
      {
        heading: 'What sellers must do',
        paragraphs: [
          'Sellers must verify certification before selling and keep records of those sales. That is why we ask for your certification number before refrigerant orders ship.',
        ],
      },
      {
        heading: 'Equipment is different',
        paragraphs: [
          'Air conditioners, mini splits and tools do not require certification to buy. Installing and charging them must be done by, or under the rules for, certified technicians.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can a homeowner buy R-410A?',
        answer:
          'Not for stationary systems unless they hold EPA Section 608 certification. A signed form or waiver does not replace certification.',
      },
      {
        question: 'Does EPA 609 certification let me buy R-410A?',
        answer:
          'Section 609 covers motor vehicle air conditioning refrigerants. For stationary refrigerants like R-410A, Section 608 certification is required.',
      },
      BUYING_FAQ,
    ],
    related: [
      { label: 'EPA compliance at Alper', to: '/compliance' },
      { label: 'R-410A refrigerant', to: '/products/r-410a' },
      { label: 'R-22 replacements', to: '/products/r-22-replacements' },
    ],
    sources: [
      { label: 'EPA: Refrigerant sales restriction', url: EPA_SALES },
      { label: 'EPA: Section 608 overview', url: EPA_608 },
    ],
  },
  {
    path: '/guides/r-454b-handling',
    kind: 'guide',
    seoTitle: 'R-454B Handling: Cylinders, Charging & PT Charts',
    seoDescription:
      'How to handle R-454B: A2L cylinder valves and adapters, charging as liquid, tool requirements and where to find the official PT chart.',
    keywords: 'r454b pt chart, r-454b pressure temperature chart, r454b adapter, r454b cylinder, how to charge r454b',
    badge: 'Guide',
    h1: 'R-454B Handling: Cylinders, Adapters and Charging',
    intro:
      'R-454B is the A2L refrigerant used in many new R-410A replacement systems. These are the practical differences technicians notice first.',
    primaryCta: { label: 'See R-454B', to: '/products/r-454b' },
    sections: [
      {
        heading: 'Cylinders and adapters',
        paragraphs: [
          'Cylinders for flammable refrigerants, including A2Ls, use a left-hand thread valve so they cannot be connected to A1 equipment by mistake. You will need a left-hand thread adapter for standard hoses. A2L cylinders are also marked with a red band or top.',
        ],
      },
      {
        heading: 'Charging',
        paragraphs: [
          'R-454B is a near-azeotropic blend with a small temperature glide. Charge it as a liquid and weigh in the charge listed by the equipment manufacturer.',
        ],
      },
      {
        heading: 'Tools',
        paragraphs: [
          'Use recovery machines, vacuum pumps and leak detectors listed for A2L refrigerants. Many R-410A gauges work for pressures, but check that your manifold or digital gauge includes the R-454B profile.',
        ],
      },
      {
        heading: 'Pressure-temperature chart',
        paragraphs: [
          'Use the manufacturer PT chart (linked below) rather than copied tables, because blends report both bubble and dew values.',
        ],
      },
    ],
    productMatch: ['r-454b', 'r454b'],
    productExclude: ['btu', 'mini split', 'heat pump', 'condenser'],
    productsHeading: 'R-454B in stock',
    faqs: [
      {
        question: 'Why does my R-454B cylinder not fit my hose?',
        answer: 'A2L cylinders use left-hand thread valves. Use a left-hand thread adapter rated for the refrigerant.',
      },
      {
        question: 'Can I charge R-454B as vapor?',
        answer: 'No. As a blend it should be charged as liquid to keep the composition correct.',
      },
      BUYING_FAQ,
    ],
    related: [
      { label: 'R-454B vs R-32 compared', to: '/guides/r-454b-vs-r-32' },
      { label: 'HVAC tools and gauges', to: '/products/hvac-tools' },
      { label: 'Who can legally buy refrigerant', to: '/guides/who-can-buy-refrigerant' },
    ],
    sources: [
      { label: 'Chemours: Opteon XL41 (R-454B) product and PT information', url: 'https://www.opteon.com/en/products/refrigerants/xl41' },
      { label: 'EPA: Technology Transitions restrictions by sector', url: EPA_TT },
    ],
  },
];

export const GUIDE_PAGES = SEO_PAGES.filter((p) => p.kind === 'guide');
