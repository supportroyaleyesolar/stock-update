/**
 * ROYAL EYE SOLAR POWER - INITIAL PRODUCT INVENTORY
 * Pre-loaded with official solar partner brands seen on Royal Eye poster:
 * Waaree, Vikram Solar, Adani Solar, Microtek, Exide, Eastman, EMMVEE, RenewSys
 */

const DEFAULT_INVENTORY = [
  // -------------------------------------------------------------
  // 1. SOLAR PANELS
  // -------------------------------------------------------------
  {
    id: "REP-PNL-001",
    name: "Waaree 540W Bifacial Dual Glass Solar Module",
    category: "panels",
    brand: "Waaree",
    dailyStock: 48,
    price: 13490,
    mrp: 17500,
    date: "11 Sep 2026",
    specs: {
      capacity: "540W",
      type: "Mono PERC Half-Cut Bifacial",
      efficiency: "21.4%",
      warranty: "12 Yrs Product / 30 Yrs Performance",
      voltage: "41.8V (Vmp)",
      highlights: "Dual Glass, Up to 25% rear side gain, MNRE & ALMM Approved"
    },
    badge: "Top Seller"
  },
  {
    id: "REP-PNL-002",
    name: "Vikram Solar 550W Somera Half-Cut Mono PERC",
    category: "panels",
    brand: "Vikram Solar",
    dailyStock: 35,
    price: 13800,
    mrp: 18000,
    date: "11 Sep 2026",
    specs: {
      capacity: "550W",
      type: "144-Cell Half-Cut Monocrystalline",
      efficiency: "21.28%",
      warranty: "12 Yrs Product / 27 Yrs Linear Output",
      voltage: "42.1V (Vmp)",
      highlights: "DCR Approved, Ideal for PM Surya Ghar Rooftop Yojana"
    },
    badge: "Subsidy Eligible"
  },
  {
    id: "REP-PNL-003",
    name: "Adani Solar 545W Shine Series Mono PERC",
    category: "panels",
    brand: "Adani Solar",
    dailyStock: 6,
    price: 13950,
    mrp: 18200,
    date: "11 Sep 2026",
    specs: {
      capacity: "545W",
      type: "Mono PERC High Efficiency",
      efficiency: "21.35%",
      warranty: "12 Yrs Product / 25 Yrs Performance",
      voltage: "42.3V (Vmp)",
      highlights: "Tier-1 Manufacturer, Extreme wind load certified (5400 Pa)"
    },
    badge: "Low Stock"
  },
  {
    id: "REP-PNL-004",
    name: "RenewSys 540W DESERV Galactic Mono Bifacial",
    category: "panels",
    brand: "RenewSys",
    dailyStock: 22,
    price: 13200,
    mrp: 16900,
    date: "11 Sep 2026",
    specs: {
      capacity: "540W",
      type: "Bifacial Dual-Glass PV Module",
      efficiency: "21.1%",
      warranty: "10 Yrs Product / 30 Yrs Performance",
      voltage: "41.6V (Vmp)",
      highlights: "100% Made in India Cells & Encapsulants"
    },
    badge: "Commercial Grade"
  },
  {
    id: "REP-PNL-005",
    name: "EMMVEE 550W Diamond Mono PERC TopCon",
    category: "panels",
    brand: "EMMVEE",
    dailyStock: 0,
    price: 14200,
    mrp: 18500,
    date: "10 Sep 2026",
    specs: {
      capacity: "550W",
      type: "N-Type TopCon Technology",
      efficiency: "22.1%",
      warranty: "15 Yrs Product / 30 Yrs Performance",
      voltage: "42.8V (Vmp)",
      highlights: "Ultra-low degradation, superior high-temperature performance"
    },
    badge: "Out of Stock"
  },

  // -------------------------------------------------------------
  // 2. INVERTERS (On-Grid, Off-Grid & Hybrid)
  // -------------------------------------------------------------
  {
    id: "REP-INV-001",
    name: "Microtek 3.3kW On-Grid Solar Inverter (Single Phase)",
    category: "inverter",
    brand: "Microtek",
    dailyStock: 14,
    price: 32500,
    mrp: 41000,
    date: "11 Sep 2026",
    specs: {
      capacity: "3.3 kW",
      type: "Grid-Tied String Inverter (1-Phase)",
      efficiency: "97.6%",
      warranty: "5 Years Replacement + 5 Yrs Extended",
      voltage: "MPPT Range: 100V - 500V",
      highlights: "WiFi Monitoring Dongle Included, KSEB Net Metering Ready"
    },
    badge: "Residential Hero"
  },
  {
    id: "REP-INV-002",
    name: "Microtek 5.0kW On-Grid 1-Phase Solar Inverter",
    category: "inverter",
    brand: "Microtek",
    dailyStock: 18,
    price: 43500,
    mrp: 56000,
    date: "11 Sep 2026",
    specs: {
      capacity: "5.0 kW",
      type: "Grid-Tied String Inverter with Dual MPPT",
      efficiency: "98.1%",
      warranty: "5 Years Standard / 10 Years Service",
      voltage: "MPPT Range: 120V - 550V",
      highlights: "Dual MPPT trackers for multi-roof orientation, IP65 Waterproof"
    },
    badge: "Fast Moving"
  },
  {
    id: "REP-INV-003",
    name: "Eastman 5kVA / 48V Solar Hybrid PCU Inverter",
    category: "inverter",
    brand: "Eastman",
    dailyStock: 7,
    price: 52000,
    mrp: 68000,
    date: "11 Sep 2026",
    specs: {
      capacity: "5 kVA / 4000W Output",
      type: "MPPT Solar Hybrid PCU (Grid + Battery + Solar)",
      efficiency: "94.5%",
      warranty: "2 Years Comprehensive",
      voltage: "Battery: 48V DC / Solar VOC: 150V",
      highlights: "Solar priority mode, smart grid charging shutoff"
    },
    badge: "Hybrid Ready"
  },
  {
    id: "REP-INV-004",
    name: "Microtek 10kW 3-Phase Commercial Solar Inverter",
    category: "inverter",
    brand: "Microtek",
    dailyStock: 4,
    price: 78000,
    mrp: 99000,
    date: "11 Sep 2026",
    specs: {
      capacity: "10 kW (Three Phase 415V)",
      type: "Dual MPPT On-Grid Commercial Inverter",
      efficiency: "98.5%",
      warranty: "5 Years Standard + Onsite Thrissur Support",
      voltage: "MPPT Range: 200V - 850V",
      highlights: "Built-in DC Disconnect switch, RS485 & 4G/WiFi cloud logger"
    },
    badge: "Commercial"
  },

  // -------------------------------------------------------------
  // 3. SOLAR WATER HEATERS
  // -------------------------------------------------------------
  {
    id: "REP-SWH-001",
    name: "Royal Eye 200 LPD ETC Pressurized Solar Water Heater",
    category: "water-heater",
    brand: "Royal Eye",
    dailyStock: 11,
    price: 33500,
    mrp: 42000,
    date: "11 Sep 2026",
    specs: {
      capacity: "200 Litres / Day (4-6 Family Members)",
      type: "Evacuated Tube Collector (ETC) Pressurized",
      efficiency: "Max Temp 70°C - 80°C",
      warranty: "5 Years Tank & Frame Warranty",
      voltage: "Optional 2kW Backup Electric Heating Rod",
      highlights: "Food Grade SS304 Inner Tank, High Density PUF Insulation (72h heat retention)"
    },
    badge: "Royal Special"
  },
  {
    id: "REP-SWH-002",
    name: "Royal Eye 100 LPD Non-Pressurized ETC Solar Water Heater",
    category: "water-heater",
    brand: "Royal Eye",
    dailyStock: 16,
    price: 21500,
    mrp: 27500,
    date: "11 Sep 2026",
    specs: {
      capacity: "100 Litres / Day (2-3 Persons)",
      type: "Borosilicate 3-Target Glass Tubes",
      efficiency: "Overnight Temp Drop < 3°C",
      warranty: "5 Years Warranty",
      voltage: "Gravity Feed / Low Pressure",
      highlights: "Rust proof powder coated stand, sacrificial magnesium anode rod"
    },
    badge: "Economy Choice"
  },
  {
    id: "REP-SWH-003",
    name: "EMMVEE 300 LPD Glass Lined Flat Plate Collector (FPC)",
    category: "water-heater",
    brand: "EMMVEE",
    dailyStock: 3,
    price: 54000,
    mrp: 67000,
    date: "11 Sep 2026",
    specs: {
      capacity: "300 Litres / Day (Large Villas / Hotels)",
      type: "Copper Flat Plate Collector with Hard Water Glass Lining",
      efficiency: "Handles up to 600 PPM water hardness",
      warranty: "7 Years Tank Warranty",
      voltage: "Operates up to 6 Bar pressure",
      highlights: "Direct pressure pump compatible, ultra durable copper riser tubes"
    },
    badge: "Hard Water Expert"
  },

  // -------------------------------------------------------------
  // 4. BATTERIES (Tubular / Solar C10 & C20)
  // -------------------------------------------------------------
  {
    id: "REP-BAT-001",
    name: "Exide Solar Tubular 150Ah / 12V 6LMS150L",
    category: "battery",
    brand: "Exide",
    dailyStock: 26,
    price: 15800,
    mrp: 21000,
    date: "11 Sep 2026",
    specs: {
      capacity: "150Ah @ C10 Rating",
      type: "Tall Tubular Deep Cycle Solar Battery",
      efficiency: "1800+ Cycles @ 80% DOD",
      warranty: "60 Months (36 Months Free + 24 Prorata)",
      voltage: "12V Nominal",
      highlights: "Ceramic vent plugs with float indicators, low maintenance"
    },
    badge: "Top Seller"
  },
  {
    id: "REP-BAT-002",
    name: "Exide Solar Tubular 200Ah / 12V 6LMS200L",
    category: "battery",
    brand: "Exide",
    dailyStock: 12,
    price: 19900,
    mrp: 26500,
    date: "11 Sep 2026",
    specs: {
      capacity: "200Ah @ C10 Rating",
      type: "Heavy Duty Tall Tubular Solar Battery",
      efficiency: "2000+ Cycles @ 80% DOD",
      warranty: "60 Months Comprehensive",
      voltage: "12V Nominal",
      highlights: "Thick spines cast at 100 bar pressure, supreme reliability for Kerala monsoon"
    },
    badge: "Heavy Duty"
  },
  {
    id: "REP-BAT-003",
    name: "Eastman Solar Tall Tubular 150Ah C10",
    category: "battery",
    brand: "Eastman",
    dailyStock: 9,
    price: 14750,
    mrp: 19500,
    date: "11 Sep 2026",
    specs: {
      capacity: "150Ah @ C10 Rating",
      type: "Tall Tubular Solar Flooded",
      efficiency: "1600+ Cycles",
      warranty: "60 Months (36 Free + 24 Pro-rata)",
      voltage: "12V Nominal",
      highlights: "Special selenium alloy spine for rapid recharge recovery"
    },
    badge: "Value Pick"
  },
  {
    id: "REP-BAT-004",
    name: "Microtek Solar Tubular 200Ah / 12V Super Duty",
    category: "battery",
    brand: "Microtek",
    dailyStock: 8,
    price: 19200,
    mrp: 25000,
    date: "11 Sep 2026",
    specs: {
      capacity: "200Ah @ C10 Rating",
      type: "Tall Tubular Deep Discharge",
      efficiency: "High acid volume per ampere-hour",
      warranty: "60 Months Full Warranty",
      voltage: "12V Nominal",
      highlights: "Zero antimony alloy minimizes water top-ups"
    },
    badge: "Low Maintenance"
  },

  // -------------------------------------------------------------
  // 5. LITHIUM BATTERIES (LiFePO4 Energy Storage)
  // -------------------------------------------------------------
  {
    id: "REP-LIT-001",
    name: "Royal Eye REX 5.12kWh 48V 100Ah LiFePO4 Wall Mount",
    category: "lithium-battery",
    brand: "Royal Eye",
    dailyStock: 15,
    price: 98000,
    mrp: 135000,
    date: "11 Sep 2026",
    specs: {
      capacity: "5.12 kWh (48V 100Ah)",
      type: "Lithium Iron Phosphate (LiFePO4) Grade-A Prismatics",
      efficiency: "6000+ Cycles @ 80% DOD (15+ Years Life)",
      warranty: "5 Years Replacement Warranty",
      voltage: "51.2V Nominal (44.8V - 58.4V)",
      highlights: "Built-in Smart BMS with CAN/RS485, LCD Status Display, Wall-mount Bracket included"
    },
    badge: "REX Flagship"
  },
  {
    id: "REP-LIT-002",
    name: "Royal Eye REX 10.24kWh 48V 200Ah LiFePO4 Floor Mount",
    category: "lithium-battery",
    brand: "Royal Eye",
    dailyStock: 5,
    price: 185000,
    mrp: 250000,
    date: "11 Sep 2026",
    specs: {
      capacity: "10.24 kWh (51.2V 200Ah)",
      type: "Heavy Commercial Solar Lithium Storage",
      efficiency: "6000+ Cycles @ 90% DOD",
      warranty: "5 Years Replacement + 5 Years Service",
      voltage: "51.2V Nominal",
      highlights: "Dual BMS with high current circuit breaker, parallel support up to 15 packs"
    },
    badge: "Commercial Power"
  },
  {
    id: "REP-LIT-003",
    name: "Eastman 2.56kWh 24V 100Ah LiFePO4 Compact Pack",
    category: "lithium-battery",
    brand: "Eastman",
    dailyStock: 11,
    price: 56000,
    mrp: 75000,
    date: "11 Sep 2026",
    specs: {
      capacity: "2.56 kWh (25.6V 100Ah)",
      type: "LiFePO4 Solar Home ESS",
      efficiency: "4500 Cycles @ 80% DOD",
      warranty: "5 Years Warranty",
      voltage: "25.6V Nominal",
      highlights: "Replaces two 12V 150Ah lead-acid batteries with 1/3 the weight and 3x the life"
    },
    badge: "24V Drop-in"
  },
  {
    id: "REP-LIT-004",
    name: "Waaree 5kWh 48V Lithium-Ion Solar Power Storage",
    category: "lithium-battery",
    brand: "Waaree",
    dailyStock: 2,
    price: 104000,
    mrp: 140000,
    date: "11 Sep 2026",
    specs: {
      capacity: "5 kWh Energy Capacity",
      type: "Lithium Ferro Phosphate (LFP)",
      efficiency: ">95% Round Trip Efficiency",
      warranty: "7 Years Performance Warranty",
      voltage: "48V System",
      highlights: "Seamless integration with Waaree & Microtek hybrid inverters"
    },
    badge: "Low Stock"
  }
];

// Partner brand data for quick filtering & logo indicators
const SOLAR_PARTNERS = [
  { name: "Waaree", tag: "One with the Sun", color: "#198754" },
  { name: "Vikram Solar", tag: "Creating Climate for Change", color: "#dc3545" },
  { name: "Adani Solar", tag: "Solar for a Greener Tomorrow", color: "#0d6efd" },
  { name: "EMMVEE", tag: "Building a Greener Tomorrow", color: "#fd7e14" },
  { name: "RenewSys", tag: "Let there be light", color: "#0dcaf0" },
  { name: "Eastman", tag: "Energy. Unlimited.", color: "#ffc107" },
  { name: "Exide", tag: "India's No. 1 Storage Power", color: "#e50914" },
  { name: "Microtek", tag: "Technology We Live", color: "#20c997" },
  { name: "Royal Eye", tag: "REX - Royal Eye Excellence", color: "#ff1e27" }
];
