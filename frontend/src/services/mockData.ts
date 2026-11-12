// NEEDBRIDGE High-Fidelity Client-Side Fallback Data Engine
// Ensures 100% interactive functionality on static deployments (Vercel, GitHub Pages)
// and seamless fallback when backend server is offline or unreachable.

export interface MockDataStore {
  demands: any[];
  clusters: any[];
  campaigns: any[];
  suppliers: any[];
  products: any[];
  ledger: any[];
  agentLogs: any[];
  users: any[];
  riskAssessments: any[];
  predictive: any[];
}

export const INITIAL_DEMANDS = [
  {
    id: "dem-101",
    product_name: "Need 40 Programming Laptops for CS Sophomore Cohort",
    category: "Laptops & Computing",
    description: "College of Engineering requires 40 durable laptops for upcoming Java/Python systems laboratory with 16GB RAM and fast NVMe storage.",
    quantity: 40,
    max_budget_per_unit: 920.0,
    specs: { ram: "16GB DDR5", storage: "512GB SSD", processor: "Intel Core i7", display: "14-inch FHD" },
    delivery_location: "Pacific Coast University, Dept of CS, Seattle, WA",
    delivery_region: "North America",
    required_delivery_date: "2026-12-20",
    buyer_type: "university",
    status: "campaign_created",
    organization_name: "Pacific Coast University",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: "dem-102",
    product_name: "Looking for 35 Laptops for Computer Science Students",
    category: "Laptops & Computing",
    description: "35 units needed for vocational programming bootcamp. Must reliably support Docker, Android Studio, and Node.js toolchains.",
    quantity: 35,
    max_budget_per_unit: 900.0,
    specs: { ram: "16GB DDR4", storage: "512GB SSD", processor: "Intel Core i5/i7", display: "14-inch Anti-Glare" },
    delivery_location: "Apex Training Center, 400 Tech Hub, Denver, CO",
    delivery_region: "North America",
    required_delivery_date: "2026-12-15",
    buyer_type: "training_center",
    status: "campaign_created",
    organization_name: "Apex Vocational Training Institute",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "dem-103",
    product_name: "25 Coding Laptops for Youth Tech Fellowship",
    category: "Laptops & Computing",
    description: "Subsidized community coding fellowship seeking 25 developer machines for underserved high school and community coders.",
    quantity: 25,
    max_budget_per_unit: 880.0,
    specs: { ram: "16GB", storage: "512GB SSD", processor: "Intel Core i5", warranty: "2 Years" },
    delivery_location: "Community Guild HQ, 120 Michigan Ave, Chicago, IL",
    delivery_region: "North America",
    required_delivery_date: "2026-12-18",
    buyer_type: "community_org",
    status: "campaign_created",
    organization_name: "Community Coding Guild",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "dem-104",
    product_name: "50 Standard Chemistry Lab Kits for AP Science",
    category: "Lab & Scientific Equipment",
    description: "50 experiment kits with borosilicate glassware, digital pH probes, and thermometer modules for AP Chemistry laboratory coursework.",
    quantity: 50,
    max_budget_per_unit: 175.0,
    specs: { glassware: "Borosilicate 3.3", sensors: "Digital pH + Temp", pieces: "45-Piece Set" },
    delivery_location: "Oakridge STEM Academy, Austin, TX",
    delivery_region: "North America",
    required_delivery_date: "2026-12-30",
    buyer_type: "school",
    status: "campaign_created",
    organization_name: "Oakridge STEM Academy",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: "dem-105",
    product_name: "60 Laboratory Glassware Kits for Bio Incubator",
    category: "Lab & Scientific Equipment",
    description: "Standardized borosilicate glassware sets for shared biochemistry workstation prep and early-stage molecular biology startups.",
    quantity: 60,
    max_budget_per_unit: 180.0,
    specs: { glassware: "Borosilicate 3.3 Heavy Duty", compliance: "OSHA & CE" },
    delivery_location: "BioTech Incubator Bldg 4, Boston, MA",
    delivery_region: "North America",
    required_delivery_date: "2027-01-10",
    buyer_type: "small_business",
    status: "campaign_created",
    organization_name: "BioTech Discovery Labs",
    created_at: new Date(Date.now() - 86400000 * 6).toISOString()
  },
  {
    id: "dem-106",
    product_name: "Ergonomic Task Chairs for Co-working Pod",
    category: "Office & Furniture",
    description: "Breathable mesh ergonomic chairs with 3D adjustable arms and dynamic lumbar support for shared maker space.",
    quantity: 25,
    max_budget_per_unit: 250.0,
    specs: { mechanism: "Synchro-tilt", mesh: "Breathable Elastomeric", armrests: "3D Adjustable" },
    delivery_location: "Central Co-work Collective, Chicago, IL",
    delivery_region: "North America",
    required_delivery_date: "2027-01-15",
    buyer_type: "small_business",
    status: "active",
    organization_name: "Co-work Hub",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "dem-107",
    product_name: "Precision Digital STEM Microscopes with LCD",
    category: "Lab & Scientific Equipment",
    description: "Trinocular precision digital microscopes with 1080p sensors and 7-inch LCD displays for citizen science research.",
    quantity: 18,
    max_budget_per_unit: 340.0,
    specs: { magnification: "40X-2000X", camera: "12MP HDMI Sensor", screen: "7-inch HD LCD" },
    delivery_location: "Metro Science Center, Portland, OR",
    delivery_region: "North America",
    required_delivery_date: "2027-01-25",
    buyer_type: "community_org",
    status: "active",
    organization_name: "Community Bio Club",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: "dem-108",
    product_name: "27-inch 4K UHD Color Accurate Monitors",
    category: "Electronics & Displays",
    description: "27-inch IPS UHD panels with 99% sRGB color gamut for multimedia design students and freelance animation artists.",
    quantity: 20,
    max_budget_per_unit: 380.0,
    specs: { resolution: "3840x2160 4K", panel: "IPS 99% sRGB", ports: "USB-C 65W PD + HDMI" },
    delivery_location: "Arts & Tech Media Center, San Francisco, CA",
    delivery_region: "North America",
    required_delivery_date: "2027-02-01",
    buyer_type: "school",
    status: "active",
    organization_name: "Bay Area Design Guild",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: "dem-109",
    product_name: "Commercial Solar Inverter & Battery Storage Modules",
    category: "Clean Energy & Hardware",
    description: "Hybrid solar inverters 10kW with lithium battery management systems for community micro-grid test facility.",
    quantity: 15,
    max_budget_per_unit: 1200.0,
    specs: { capacity: "10kW Hybrid", battery_support: "LiFePO4 48V", efficiency: "98.2%" },
    delivery_location: "EcoLiving Innovation Park, Phoenix, AZ",
    delivery_region: "North America",
    required_delivery_date: "2027-02-15",
    buyer_type: "community_org",
    status: "active",
    organization_name: "Desert Sun Clean Energy Co-op",
    created_at: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: "dem-110",
    product_name: "Individual Developer ThinkPad Laptop",
    category: "Laptops & Computing",
    description: "Need 1 developer laptop with 16GB RAM for independent full-stack web and mobile application consulting.",
    quantity: 1,
    max_budget_per_unit: 950.0,
    specs: { ram: "16GB", storage: "512GB NVMe", processor: "i7" },
    delivery_location: "Residential Office, Denver, CO",
    delivery_region: "North America",
    required_delivery_date: "2026-12-15",
    buyer_type: "individual",
    status: "active",
    organization_name: "Independent Developer",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const INITIAL_CLUSTERS = [
  {
    id: "cl-1",
    cluster_name: "Collective Lot: STEM Developer Laptops (100 Units)",
    category: "Laptops & Computing",
    target_product: "ThinkPad E14 Gen 5 (Intel Core i7, 16GB RAM, 512GB SSD)",
    total_quantity: 100,
    total_budget: 90400.0,
    buyer_count: 3,
    geographic_focus: "North America (Regional Bulk Hub)",
    demand_liquidity_score: 87.5,
    growth_projection: "High (+35% in 7 days)",
    status: "campaign_active",
    liquidity_factors: {
      buyer_density: 18.5,
      volume_mass: 25.0,
      supplier_availability: 14.5,
      geographic_alignment: 13.5,
      price_competitiveness: 12.0,
      historical_success: 4.0
    },
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    matches: [
      {
        id: "m-101",
        cluster_id: "cl-1",
        demand_id: "dem-101",
        match_score: 96.2,
        compatibility_explanation: "Pacific Coast University (40 units) matches Intel Core i7 / 16GB RAM / 512GB SSD developer baseline and North America Dec 20 delivery window.",
        shared_specs: ["16GB RAM", "512GB NVMe SSD", "Intel Core i5/i7", "14-inch FHD Display"],
        differences: ["DDR5 preferred vs DDR4 acceptable across counterparts"],
        potential_savings_pct: 20.0,
        approved_by_user: true,
        created_at: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: "m-102",
        cluster_id: "cl-1",
        demand_id: "dem-102",
        match_score: 93.8,
        compatibility_explanation: "Apex Vocational Training Institute (35 units) aligns with CS developer laptop profile and qualifies cluster for Tier-3 bulk manufacturer discount.",
        shared_specs: ["16GB RAM", "512GB SSD", "Docker/Node.js Ready", "North America Delivery"],
        differences: ["2-year vs 3-year warranty preference"],
        potential_savings_pct: 20.0,
        approved_by_user: true,
        created_at: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: "m-103",
        cluster_id: "cl-1",
        demand_id: "dem-103",
        match_score: 91.5,
        compatibility_explanation: "Community Coding Guild (25 units) completes the 100-unit MOQ threshold, unlocking institutional pricing for a grassroots non-profit.",
        shared_specs: ["16GB RAM", "512GB SSD", "Mid-December Fulfillment"],
        differences: ["Budget cap $880 vs $920 covered by 20% bulk tier at $712/unit"],
        potential_savings_pct: 19.1,
        approved_by_user: true,
        created_at: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ]
  },
  {
    id: "cl-2",
    cluster_name: "Academic Chemistry Borosilicate Lab Kits (110 Sets)",
    category: "Lab & Scientific Equipment",
    target_product: "Standard University Undergraduate Chemistry Experiment Lab Kit",
    total_quantity: 110,
    total_budget: 19550.0,
    buyer_count: 2,
    geographic_focus: "Eastern Seaboard & Midwest",
    demand_liquidity_score: 82.0,
    growth_projection: "Moderate (+18% in 14 days)",
    status: "campaign_active",
    liquidity_factors: {
      buyer_density: 16.0,
      volume_mass: 24.0,
      supplier_availability: 13.0,
      geographic_alignment: 14.0,
      price_competitiveness: 11.0,
      historical_success: 4.0
    },
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    matches: [
      {
        id: "m-201",
        cluster_id: "cl-2",
        demand_id: "dem-104",
        match_score: 92.4,
        compatibility_explanation: "Oakridge STEM Academy (50 sets) requires Borosilicate 3.3 glassware and digital pH sensors compatible with EduStem bulk SKU.",
        shared_specs: ["Borosilicate 3.3 Glassware", "OSHA & CE Compliant", "45-Piece Standard"],
        differences: ["Includes digital pH probe bundle"],
        potential_savings_pct: 25.0,
        approved_by_user: true,
        created_at: new Date(Date.now() - 86400000 * 4).toISOString()
      },
      {
        id: "m-202",
        cluster_id: "cl-2",
        demand_id: "dem-105",
        match_score: 89.7,
        compatibility_explanation: "BioTech Discovery Labs (60 sets) shares exact glassware specification, doubling order volume to 110 sets.",
        shared_specs: ["Borosilicate 3.3 Glassware", "Heavy-Duty Lab Grade"],
        differences: ["Delivery scheduled 11 days later (compatible split shipment)"],
        potential_savings_pct: 25.0,
        approved_by_user: true,
        created_at: new Date(Date.now() - 86400000 * 4).toISOString()
      }
    ]
  },
  {
    id: "cl-3",
    cluster_name: "Ergonomic Synchronous Task Seating (45 Chairs)",
    category: "Office & Furniture",
    target_product: "Ergonomic Synchronous Mesh Task Chair with 3D Adjustable Arms",
    total_quantity: 45,
    total_budget: 11250.0,
    buyer_count: 5,
    geographic_focus: "Central Metro Co-working Zone",
    demand_liquidity_score: 68.5,
    growth_projection: "Developing (+20% in 10 days)",
    status: "ready_for_campaign",
    liquidity_factors: {
      buyer_density: 15.0,
      volume_mass: 18.0,
      supplier_availability: 12.0,
      geographic_alignment: 11.0,
      price_competitiveness: 9.0,
      historical_success: 3.5
    },
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "cl-4",
    cluster_name: "Precision Trinocular STEM Microscopes (30 Units)",
    category: "Lab & Scientific Equipment",
    target_product: "Digital Trinocular STEM Microscope 1080P with 7-inch LCD Monitor",
    total_quantity: 30,
    total_budget: 10500.0,
    buyer_count: 4,
    geographic_focus: "National Academic Consortium",
    demand_liquidity_score: 64.0,
    growth_projection: "Developing (+12% in 14 days)",
    status: "forming",
    liquidity_factors: {
      buyer_density: 14.0,
      volume_mass: 16.0,
      supplier_availability: 11.0,
      geographic_alignment: 10.0,
      price_competitiveness: 9.5,
      historical_success: 3.5
    },
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: "cl-5",
    cluster_name: "Ultra-Wide 4K High-Res Design Displays (25 Units)",
    category: "Electronics & Displays",
    target_product: "27-inch 4K Color Accurate IPS Monitors",
    total_quantity: 25,
    total_budget: 9500.0,
    buyer_count: 3,
    geographic_focus: "West Coast Creative Guilds",
    demand_liquidity_score: 58.0,
    growth_projection: "Emerging (+15% in 21 days)",
    status: "forming",
    liquidity_factors: {
      buyer_density: 12.0,
      volume_mass: 14.0,
      supplier_availability: 10.0,
      geographic_alignment: 11.0,
      price_competitiveness: 8.0,
      historical_success: 3.0
    },
    created_at: new Date(Date.now() - 86400000 * 6).toISOString()
  }
];

export const INITIAL_CAMPAIGNS = [
  {
    id: "cmp-101",
    cluster_id: "cl-1",
    title: "Cross-Community STEM Laptop Collective Procurement",
    product_name: "ThinkPad E14 Gen 5 (Intel Core i7, 16GB RAM, 512GB SSD)",
    category: "Laptops & Computing",
    target_quantity: 100,
    current_quantity: 100,
    min_required_quantity: 80,
    target_funding: 76000.0,
    current_funding: 76000.0,
    estimated_unit_price: 712.0,
    final_unit_price: 712.0,
    individual_market_unit_price: 890.0,
    status: "Purchased",
    deadline: "2026-12-10",
    delivery_estimate: "10-14 Business Days",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    participants: [
      { id: "p1", campaign_id: "cmp-101", user_id: "u1", user_name: "Prof. Marcus Chen (Pacific Coast Univ)", quantity: 40, expected_contribution: 28480.0, authorized_amount: 28480.0, paid_amount: 28480.0, refund_status: "NONE", approved: true, joined_at: new Date(Date.now() - 86400000 * 4).toISOString() },
      { id: "p2", campaign_id: "cmp-101", user_id: "u2", user_name: "Sarah Jenkins (Apex Training)", quantity: 35, expected_contribution: 24920.0, authorized_amount: 24920.0, paid_amount: 24920.0, refund_status: "NONE", approved: true, joined_at: new Date(Date.now() - 86400000 * 3).toISOString() },
      { id: "p3", campaign_id: "cmp-101", user_id: "u3", user_name: "Amara Okafor (Community Coding Guild)", quantity: 25, expected_contribution: 17800.0, authorized_amount: 17800.0, paid_amount: 17800.0, refund_status: "NONE", approved: true, joined_at: new Date(Date.now() - 86400000 * 2).toISOString() }
    ],
    quotes: [
      { id: "q1", supplier_id: "sup-1", product_id: "prod-1", supplier_name: "Apex Enterprise Computing Ltd.", proposed_unit_price: 712.0, min_qty: 60, bulk_discount_pct: 20.0, delivery_fee: 250.0, tax_pct: 8.0, estimated_delivery_days: 10, status: "selected", notes: "Direct enterprise OEM lot with 3-year on-site warranty.", supplier_rating: 4.9, is_demo: true, created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
      { id: "q2", supplier_id: "sup-2", product_id: "prod-1", supplier_name: "Silicon Direct Wholesale Inc.", proposed_unit_price: 729.0, min_qty: 50, bulk_discount_pct: 18.1, delivery_fee: 300.0, tax_pct: 8.0, estimated_delivery_days: 12, status: "submitted", notes: "Regional distribution pallet with 2-year depot warranty.", supplier_rating: 4.7, is_demo: true, created_at: new Date(Date.now() - 86400000 * 3).toISOString() }
    ]
  },
  {
    id: "cmp-102",
    cluster_id: "cl-2",
    title: "Consortium Undergraduate Chemistry Experiment Sets",
    product_name: "Standard University Undergraduate Chemistry Experiment Lab Kit",
    category: "Lab & Scientific Equipment",
    target_quantity: 110,
    current_quantity: 110,
    min_required_quantity: 90,
    target_funding: 13612.5,
    current_funding: 13612.5,
    estimated_unit_price: 123.75,
    final_unit_price: 123.75,
    individual_market_unit_price: 165.0,
    status: "Threshold Achieved",
    deadline: "2026-12-28",
    delivery_estimate: "14-21 Business Days",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    participants: [
      { id: "p4", campaign_id: "cmp-102", user_id: "u4", user_name: "David Rodriguez (Oakridge STEM Academy)", quantity: 50, expected_contribution: 6187.5, authorized_amount: 6187.5, paid_amount: 6187.5, refund_status: "NONE", approved: true, joined_at: new Date(Date.now() - 86400000 * 3).toISOString() },
      { id: "p5", campaign_id: "cmp-102", user_id: "u5", user_name: "Dr. Elena Rostova (BioTech Discovery Labs)", quantity: 60, expected_contribution: 7425.0, authorized_amount: 7425.0, paid_amount: 7425.0, refund_status: "NONE", approved: true, joined_at: new Date(Date.now() - 86400000 * 3).toISOString() }
    ],
    quotes: [
      { id: "q3", supplier_id: "sup-4", product_id: "prod-2", supplier_name: "EduStem Global Manufacturing", proposed_unit_price: 123.75, min_qty: 80, bulk_discount_pct: 25.0, delivery_fee: 190.0, tax_pct: 8.0, estimated_delivery_days: 14, status: "selected", notes: "ISO-certified borosilicate 3.3 bulk batch.", supplier_rating: 4.6, is_demo: true, created_at: new Date(Date.now() - 86400000 * 3).toISOString() }
    ]
  },
  {
    id: "cmp-103",
    cluster_id: "cl-3",
    title: "Regional Co-working & Studio Ergonomic Task Seating",
    product_name: "Ergonomic Synchronous Mesh Task Chair with 3D Adjustable Arms",
    category: "Office & Furniture",
    target_quantity: 45,
    current_quantity: 35,
    min_required_quantity: 30,
    target_funding: 8208.0,
    current_funding: 6384.0,
    estimated_unit_price: 182.4,
    final_unit_price: null,
    individual_market_unit_price: 240.0,
    status: "Funding Pending",
    deadline: "2027-01-15",
    delivery_estimate: "7-12 Business Days",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    participants: [
      { id: "p6", campaign_id: "cmp-103", user_id: "u6", user_name: "Lucas Silva (Design Studio Hub)", quantity: 20, expected_contribution: 3648.0, authorized_amount: 3648.0, paid_amount: 0.0, refund_status: "NONE", approved: true, joined_at: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: "p7", campaign_id: "cmp-103", user_id: "u7", user_name: "Chloe Bennett (Independent)", quantity: 15, expected_contribution: 2736.0, authorized_amount: 2736.0, paid_amount: 0.0, refund_status: "NONE", approved: true, joined_at: new Date(Date.now() - 86400000 * 1).toISOString() }
    ],
    quotes: [
      { id: "q4", supplier_id: "sup-5", product_id: "prod-3", supplier_name: "Ergon Commercial Furnishings", proposed_unit_price: 182.4, min_qty: 30, bulk_discount_pct: 24.0, delivery_fee: 150.0, tax_pct: 8.0, estimated_delivery_days: 10, status: "selected", notes: "Assembled commercial pallet delivery.", supplier_rating: 4.7, is_demo: true, created_at: new Date(Date.now() - 86400000 * 2).toISOString() }
    ]
  },
  {
    id: "cmp-104",
    cluster_id: "cl-4",
    title: "Undergraduate Biology Digital Microscope Batch",
    product_name: "Digital Trinocular STEM Microscope 1080P with 7-inch LCD Monitor",
    category: "Lab & Scientific Equipment",
    target_quantity: 30,
    current_quantity: 18,
    min_required_quantity: 20,
    target_funding: 7956.0,
    current_funding: 4773.6,
    estimated_unit_price: 265.2,
    final_unit_price: null,
    individual_market_unit_price: 340.0,
    status: "Proposal Ready",
    deadline: "2027-01-30",
    delivery_estimate: "12-16 Business Days",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    participants: [
      { id: "p8", campaign_id: "cmp-104", user_id: "u8", user_name: "Zoe Alvarez (Biology Lab Initiative)", quantity: 18, expected_contribution: 4773.6, authorized_amount: 0.0, paid_amount: 0.0, refund_status: "NONE", approved: true, joined_at: new Date(Date.now() - 86400000 * 1).toISOString() }
    ],
    quotes: []
  }
];

export const INITIAL_SUPPLIERS = [
  {
    id: "sup-1",
    business_name: "Apex Enterprise Computing Ltd.",
    category: "Laptops & Computing",
    rating: 4.9,
    is_verified: true,
    is_demo: true,
    product_count: 4,
    address: "Austin, TX, USA",
    contact_email: "supplier.apex@apexcomputing.com",
    active_bids: 4,
    fulfilled_orders: 128
  },
  {
    id: "sup-2",
    business_name: "Silicon Direct Wholesale Inc.",
    category: "Laptops & Computing",
    rating: 4.7,
    is_verified: true,
    is_demo: true,
    product_count: 3,
    address: "San Jose, CA, USA",
    contact_email: "supplier.silicon@siliconlogistics.com",
    active_bids: 2,
    fulfilled_orders: 95
  },
  {
    id: "sup-3",
    business_name: "SciLab Precision Optics & Equipment",
    category: "Lab & Scientific Equipment",
    rating: 4.8,
    is_verified: true,
    is_demo: true,
    product_count: 5,
    address: "Cambridge, MA, USA",
    contact_email: "supplier.scilab@scilaboratories.com",
    active_bids: 3,
    fulfilled_orders: 112
  },
  {
    id: "sup-4",
    business_name: "EduStem Global Manufacturing",
    category: "Lab & Scientific Equipment",
    rating: 4.6,
    is_verified: true,
    is_demo: true,
    product_count: 6,
    address: "Chicago, IL, USA",
    contact_email: "supplier.stemkits@stemdirect.org",
    active_bids: 5,
    fulfilled_orders: 84
  },
  {
    id: "sup-5",
    business_name: "Ergon Commercial Furnishings",
    category: "Office & Furniture",
    rating: 4.7,
    is_verified: true,
    is_demo: true,
    product_count: 3,
    address: "Grand Rapids, MI, USA",
    contact_email: "supplier.ergon@ergonoffice.com",
    active_bids: 2,
    fulfilled_orders: 67
  }
];

export const INITIAL_LEDGER = [
  {
    id: "led-1",
    campaign_id: "cmp-101",
    transaction_type: "ESCROW_LOCK",
    amount: 76000.0,
    currency: "USD",
    user_id: "marcus.chen@pacific.edu",
    actor_name: "Consortium Escrow System",
    description: "Campaign CMP-101 achieved threshold (100/80 units). Total funds \$76,000.00 locked in PayPal Sandbox Escrow.",
    paypal_order_id: "SANDBOX-PP-7821098492-X",
    current_hash: "a49f8021c3b174e9d0e51240f92b771e84d28f01b34e5699c8e146a89efb3901",
    previous_hash: "0000000000000000000000000000000000000000000000000000000000000000",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "led-2",
    campaign_id: "cmp-101",
    transaction_type: "SUPPLIER_PAYOUT_AUTHORIZED",
    amount: 71200.0,
    currency: "USD",
    user_id: "admin@needbridge.io",
    actor_name: "Platform Director Vance",
    description: "Multi-party consensus approval verified. Escrow milestone 1 approved for Apex Enterprise Computing Ltd.",
    paypal_order_id: "SANDBOX-PP-7821098492-PO1",
    current_hash: "e7bc2109f0293da8214f5290b82f019482ca01948201fa840192e019247192ba",
    previous_hash: "a49f8021c3b174e9d0e51240f92b771e84d28f01b34e5699c8e146a89efb3901",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: "led-3",
    campaign_id: "cmp-102",
    transaction_type: "ESCROW_LOCK",
    amount: 13612.5,
    currency: "USD",
    user_id: "system@needbridge.io",
    actor_name: "Autonomous Escrow Daemon",
    description: "Consortium Chemistry Kits 110-set batch threshold fulfilled. Funds safely locked under custodial contract.",
    paypal_order_id: "SANDBOX-PP-4921008123-K",
    current_hash: "f83bca910248e9102ca938210491823049182049182309182309182301982309",
    previous_hash: "e7bc2109f0293da8214f5290b82f019482ca01948201fa840192e019247192ba",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

export const INITIAL_AGENT_LOGS = [
  {
    id: "log-1",
    agent_name: "Demand Intelligence Agent",
    input_summary: "40 Programming Laptops for CS Sophomore Cohort (Pacific Coast Univ)",
    output_data: { category: "Laptops & Computing", specs: { ram: "16GB DDR5", storage: "512GB SSD", cpu: "Intel i7" }, confidence: 0.985 },
    execution_time_ms: 118,
    status: "success",
    decision_explanation: "Extracted hardware attributes for 40 units: 16GB DDR5, 512GB NVMe, Intel i7. Confidence score: 0.985.",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "log-2",
    agent_name: "Community Discovery Agent",
    input_summary: "Cross-community pool scan across 30 active requisitions",
    output_data: { cluster_id: "cl-1", combined_qty: 100, communities: 3, liquidity_score: 87.5 },
    execution_time_ms: 164,
    status: "success",
    decision_explanation: "Detected mutual purchasing affinity between Pacific Coast Univ (40), Apex Training (35), and Community Guild (25). Combined: 100 units.",
    created_at: new Date(Date.now() - 3600000 * 1.8).toISOString()
  },
  {
    id: "log-3",
    agent_name: "Procurement Optimization Agent",
    input_summary: "Evaluate 3 vendor bids for 100-unit STEM laptop consortium",
    output_data: { winning_supplier: "Apex Enterprise Computing Ltd.", unit_price: 712.0, savings_pct: 20.0 },
    execution_time_ms: 92,
    status: "success",
    decision_explanation: "Evaluated 3 competitive bids. Triggered Tier-3 bulk discount (20% off) at Apex Enterprise Computing ($712 vs $890 retail).",
    created_at: new Date(Date.now() - 3600000 * 1.2).toISOString()
  },
  {
    id: "log-4",
    agent_name: "Procurement Coordinator Agent",
    input_summary: "Campaign CMP-101 multi-party approval threshold check",
    output_data: { consensus_pct: 100, participants_approved: 3, campaign_status: "Purchased" },
    execution_time_ms: 74,
    status: "success",
    decision_explanation: "Generated explainability report and secured 100% affirmative consensus from all 3 independent institutional buyers.",
    created_at: new Date(Date.now() - 3600000 * 0.8).toISOString()
  },
  {
    id: "log-5",
    agent_name: "Risk & Trust Agent",
    input_summary: "Audit Apex Enterprise Computing Ltd. & Escrow Ledger Hash",
    output_data: { risk_score: 0.04, risk_level: "LOW", kyc_verified: true },
    execution_time_ms: 105,
    status: "success",
    decision_explanation: "Verified Apex Enterprise Computing tax credentials, delivery reliability (99.2%), and sandbox escrow hash. Risk Score: 0.04 (VERY LOW).",
    created_at: new Date(Date.now() - 3600000 * 0.3).toISOString()
  }
];

export const INITIAL_PREDICTIVE = [
  {
    category: "Lab & Scientific Equipment",
    predicted_item: "Standard Undergraduate STEM Chemistry Kits",
    expected_quantity_range: "380 - 520 units",
    historical_demand_frequency: "Bi-Annual Academic Semester Recurring (Every 6 months)",
    confidence_level: 88.5,
    confidence_label: "88.5% Confirmed Pattern",
    recommended_preparation_date: "2026-12-01",
    explanation: "Consecutive historical procurement spikes observed 3 weeks prior to university term starts across 4 regional polytechnic institutions.",
    is_heuristic: false,
    data_points_analyzed: 8
  },
  {
    category: "Laptops & Computing",
    predicted_item: "Computer Science Dev Laptops (16GB RAM, 512GB SSD)",
    expected_quantity_range: "280 - 360 units",
    historical_demand_frequency: "Annual Academic Intake Recurring",
    confidence_level: 92.0,
    confidence_label: "92.0% Confirmed Pattern",
    recommended_preparation_date: "2027-07-01",
    explanation: "High-fidelity cluster recurrence detected from coding bootcamps and computer science departments renewing hardware warranties.",
    is_heuristic: false,
    data_points_analyzed: 6
  },
  {
    category: "Office & Furniture",
    predicted_item: "Ergonomic Task Seating & Modular Desks",
    expected_quantity_range: "150 - 220 units",
    historical_demand_frequency: "Annual Fiscal Budget Exhaustion Cycle",
    confidence_level: 76.0,
    confidence_label: "76.0% Confirmed Pattern",
    recommended_preparation_date: "2027-02-01",
    explanation: "Community libraries and municipal research centers consistently deploy unspent operational grants into ergonomic upgrades.",
    is_heuristic: false,
    data_points_analyzed: 4
  },
  {
    category: "Clean Energy & Hardware",
    predicted_item: "Photovoltaic Solar Battery Storage Modules",
    expected_quantity_range: "Unavailable",
    historical_demand_frequency: "Annual Pre-Summer Grid Resilience Cycle",
    confidence_level: 0.0,
    confidence_label: "Confidence Unavailable (Insufficient Data)",
    recommended_preparation_date: "Pending further data collection",
    explanation: "Insufficient historical data (only 2 observed cycles; minimum 3 required for statistical validity). Confidence is unavailable.",
    is_heuristic: true,
    data_points_analyzed: 2
  }
];
