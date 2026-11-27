import type { Tender } from '../types';

export const mockTenders: Tender[] = [
  {
    id: 'tnd-001',
    tenderNumber: 'GEM/2026/B/8912401',
    officialTenderId: 'GEM/2026/B/8912401',
    title: 'Design, Supply, Installation & Commissioning of 1.2 MW Grid-Connected Rooftop Solar PV Systems',
    issuingAuthority: 'Gujarat Urja Vikas Nigam Limited (GUVNL)',
    authorityType: 'State Govt',
    portal: 'GeM',
    officialSourceName: 'Government e-Marketplace (GeM)',
    portalUrl: 'https://gem.gov.in/',
    officialTenderUrl: 'https://gem.gov.in/',
    category: 'Products',
    subCategory: 'Solar Power & Photovoltaic Systems',
    department: 'Renewable Energy & Power Generation',
    publishingDepartment: 'Renewable Energy & Power Generation',
    publishedDate: '2026-11-10',
    publicationDate: '2026-11-10T10:00:00',
    submissionDeadline: '2026-12-15T15:00:00',
    closingDate: '2026-12-15T15:00:00',
    lastUpdatedTimestamp: '2026-11-26T12:00:00Z',
    technicalBidDate: '2026-12-16T11:00:00',
    estimatedValue: 48000000, // ₹4.80 Cr
    earnestMoneyDeposit: 960000, // ₹9.6 Lakhs (2%)
    tenderFee: 10000, // ₹10,000
    location: {
      state: 'Gujarat',
      city: 'Vadodara & Gandhinagar Sites',
      isPanIndia: false,
    },
    eligibilityCriteria: {
      minTurnoverRequired: 24000000, // ₹2.4 Cr (50% of tender value)
      minYearsExperienceRequired: 3,
      minSingleWorkOrderValue: 19200000, // ₹1.92 Cr (40% single order)
      mandatoryCertifications: ['ISO-9001', 'BIS-ISI'],
      preferredCertifications: ['ISO-14001', 'ZED-GOLD'],
      allowedEnterpriseCategories: ['Micro', 'Small', 'Medium'],
      makeInIndiaPreference: 'Class-I (>=50%)',
      mseExemptionAllowed: {
        emd: true, // 100% EMD waiver for registered MSEs
        tenderFee: true, // Free tender document for MSEs
        turnoverExperienceRelaxation: true, // Relaxed turnover for MSEs with quality proof
        purchasePreferencePercent: 25, // 25% procurement preference with L1 price matching
      },
      subcontractingAllowed: true,
      subcontractingPercentage: 25,
      consortiumAllowed: false,
    },
    documentsRequired: [
      'MSME / Udyam Registration Certificate in relevant NIC code',
      'Audited Financial Statements (Last 3 Financial Years) with UDIN',
      'CA Certified Annual Turnover Certificate',
      'Valid BIS / ISI Certificate for Solar Modules (IS 14286 / IS 61730)',
      'ISO 9001:2015 Quality Management Certificate',
      'Past Client Work Completion & Commissioning Certificates',
      'Make in India (Class-I) Local Content Declaration',
      'EMD & Tender Fee Exemption Undertaking for MSEs',
      'Signed Technical Specifications Compliance Sheet'
    ],
    scopeSummary: 'Turnkey execution of 1.2 MW rooftop solar plants across government educational institutions in Gujarat, including 5 years of comprehensive operation and maintenance (O&M).',
    detailedScope: [
      'Site survey, shadow analysis, and detailed engineering design',
      'Supply of Tier-1 ALMM listed crystalline silicon solar PV modules with BIS mark',
      'High-efficiency grid-tied solar string inverters with IP65 outdoor protection',
      'Galvanized MS / Aluminum mounting structures with wind resistance up to 150 km/h',
      'SCADA / Remote cloud-based monitoring system with real-time generation metrics',
      'Net-metering coordination and statutory CEIG approvals',
      'Comprehensive 5-year O&M with guaranteed PR (Performance Ratio) >= 78%'
    ],
    contactDetails: {
      officerName: 'Er. Rajesh V. Patel',
      designation: 'Chief Superintending Engineer (Renewables)',
      email: 'ce.renewable@guvnl.gov.in',
      phone: '+91-79-2325-4810'
    },
    status: 'Active',
    tenderStatus: 'Active',
    matchedSectorTags: ['Solar', 'Electrical', 'Renewable Energy', 'Power', 'Battery'],
    isDemoData: true
  },
  {
    id: 'tnd-002',
    tenderNumber: 'CPPP/2026/NHA/91024',
    officialTenderId: 'CPPP/2026/NHA/91024',
    title: 'Supply and Maintenance of Cybersecurity Operations Center (SOC) Tools, SIEM & Annual VAPT Audit',
    issuingAuthority: 'National Health Authority (NHA) & Ayushman Bharat Mission',
    authorityType: 'Autonomous Body',
    portal: 'CPPP',
    officialSourceName: 'Central Public Procurement Portal (CPPP)',
    portalUrl: 'https://eprocure.gov.in/cppp/',
    officialTenderUrl: 'https://eprocure.gov.in/cppp/',
    category: 'Services',
    subCategory: 'Cybersecurity & Managed IT Services',
    department: 'Information Technology & Data Protection Division',
    publishingDepartment: 'Information Technology & Data Protection Division',
    publishedDate: '2026-11-14',
    publicationDate: '2026-11-14T11:00:00',
    submissionDeadline: '2026-12-08T17:00:00',
    closingDate: '2026-12-08T17:00:00',
    lastUpdatedTimestamp: '2026-11-26T12:00:00Z',
    technicalBidDate: '2026-12-09T14:30:00',
    estimatedValue: 18500000, // ₹1.85 Cr
    earnestMoneyDeposit: 370000, // ₹3.7 Lakhs
    tenderFee: 5000,
    location: {
      state: 'Delhi',
      city: 'New Delhi (PAN-India Remote SOC Support)',
      isPanIndia: true,
    },
    eligibilityCriteria: {
      minTurnoverRequired: 15000000, // ₹1.5 Cr
      minYearsExperienceRequired: 3,
      minSingleWorkOrderValue: 8000000, // ₹80 Lakhs
      mandatoryCertifications: ['ISO-27001', 'CERT-IN'],
      preferredCertifications: ['CMMI-L3', 'ISO-9001'],
      allowedEnterpriseCategories: ['Micro', 'Small', 'Medium'],
      makeInIndiaPreference: 'Class-I (>=50%)',
      mseExemptionAllowed: {
        emd: true,
        tenderFee: true,
        turnoverExperienceRelaxation: true,
        purchasePreferencePercent: 25,
      },
      subcontractingAllowed: false,
      consortiumAllowed: false,
    },
    documentsRequired: [
      'Valid Udyam Registration Certificate',
      'ISO 27001:2022 Certification copy (accredited by NABCB/IAF)',
      'CERT-In Empanelled Auditor Partnership or Empanelment Letter',
      'Balance Sheets & Profit & Loss statements for FY 21-22, 22-23, 23-24',
      'Minimum 2 Client Work Orders for VAPT / SOC operations in Central/State Govt',
      'CVs and Security Clearance of Lead Security Engineers (CISSP/CEH/CISA)',
      'Non-Disclosure Agreement (NDA) Draft',
      'EMD Exemption Claim declaration under MSMED Act 2006'
    ],
    scopeSummary: '24x7 Security Operations Center monitoring, SIEM threat ingestion, threat hunting, continuous vulnerability scanning, and bi-annual CERT-In compliant VAPT audit for Ayushman Bharat digital portals.',
    detailedScope: [
      '24/7/365 continuous security event monitoring and log correlation for 150+ microservices',
      'Automated incident detection, triage, and rapid containment playbooks',
      'Periodic Vulnerability Assessment and Penetration Testing (Web, Mobile Apps & API)',
      'Phishing simulation, employee security hygiene drills, and dark web monitoring',
      'Compliance alignment with Digital Personal Data Protection (DPDP) Act 2023',
      'Monthly threat intelligence briefings and executive cybersecurity posture reports'
    ],
    contactDetails: {
      officerName: 'Sanjay Deshmukh',
      designation: 'Chief Information Security Officer (CISO)',
      email: 'ciso@nha.gov.in',
      phone: '+91-11-2346-8800'
    },
    status: 'Closing Soon',
    tenderStatus: 'Closing Soon',
    matchedSectorTags: ['Cybersecurity', 'Software', 'IT Services', 'Cloud', 'Audit'],
    isDemoData: true
  },
  {
    id: 'tnd-003',
    tenderNumber: 'GEM/2026/B/7741290',
    officialTenderId: 'GEM/2026/B/7741290',
    title: 'Procurement of Sterile Disposable Surgical Gloves, PPE Kits, and Rapid Diagnostic Medical Consumables',
    issuingAuthority: 'All India Institute of Medical Sciences (AIIMS) - Madurai & Chennai Depot',
    authorityType: 'Autonomous Body',
    portal: 'GeM',
    officialSourceName: 'Government e-Marketplace (GeM)',
    portalUrl: 'https://gem.gov.in/',
    officialTenderUrl: 'https://gem.gov.in/',
    category: 'Products',
    subCategory: 'Medical Consumables & Hospital Supplies',
    department: 'Hospital Store & Central Sterile Supply',
    publishingDepartment: 'Hospital Store & Central Sterile Supply',
    publishedDate: '2026-11-12',
    publicationDate: '2026-11-12T09:00:00',
    submissionDeadline: '2026-12-20T14:00:00',
    closingDate: '2026-12-20T14:00:00',
    lastUpdatedTimestamp: '2026-11-26T12:00:00Z',
    technicalBidDate: '2026-12-21T10:00:00',
    estimatedValue: 9500000, // ₹95 Lakhs
    earnestMoneyDeposit: 190000, // ₹1.9 Lakhs
    tenderFee: 0,
    location: {
      state: 'Tamil Nadu',
      city: 'Madurai & Chennai',
      isPanIndia: false,
    },
    eligibilityCriteria: {
      minTurnoverRequired: 5000000, // ₹50 Lakhs
      minYearsExperienceRequired: 2,
      minSingleWorkOrderValue: 3500000, // ₹35 Lakhs
      mandatoryCertifications: ['CDSCO-MD5', 'ISO-13485'],
      preferredCertifications: ['CE-MARK', 'ZED-SILVER'],
      allowedEnterpriseCategories: ['Micro', 'Small'],
      makeInIndiaPreference: 'Class-I (>=50%)',
      mseExemptionAllowed: {
        emd: true,
        tenderFee: true,
        turnoverExperienceRelaxation: true,
        purchasePreferencePercent: 25, // Note: 3% earmarked for Women MSEs
      },
      subcontractingAllowed: false,
      consortiumAllowed: false,
    },
    documentsRequired: [
      'Valid Udyam Registration as Micro or Small Enterprise',
      'Valid CDSCO Manufacturing / Import License in Form MD-5',
      'ISO 13485:2016 Medical Devices Quality Management Certificate',
      'NABL Accredited Laboratory Test Reports for Sterility and Tensile Strength',
      'Self-attested copy of PAN and GST Returns for last 12 months',
      'CA Turnover certificate for FY 21-22, 22-23, 23-24',
      'Declaration of Women-Owned MSE (if applicable for 3% reservation)',
      'Undertaking for supply timeline of 15 days from Purchase Order'
    ],
    scopeSummary: 'Annual rate contract for supply of 500,000 pairs of powder-free latex examination gloves, 80,000 surgical gowns, 25,000 PPE kits, and rapid blood diagnostic kits with staggered monthly deliveries.',
    detailedScope: [
      'Staggered delivery schedule over 12 months with batch-wise test certificates',
      'Sterility assurance level (SAL 10^-6) with ethylene oxide (ETO) sterilization',
      'Barcoded primary and secondary cartons with manufacturing, expiry, and batch numbers',
      'Replacement warranty for any rejected or damaged cartons within 48 hours',
      'Strict adherence to BIS and CDSCO medical devices guidelines'
    ],
    contactDetails: {
      officerName: 'Dr. K. Swaminathan',
      designation: 'Officer In-Charge, Central Medical Stores',
      email: 'procurement.med@aiims.edu.in',
      phone: '+91-452-248-9100'
    },
    status: 'Active',
    tenderStatus: 'Active',
    matchedSectorTags: ['Medical Devices', 'Healthcare', 'Surgical', 'PPE', 'Consumables'],
    isDemoData: true
  },
  {
    id: 'tnd-004',
    tenderNumber: 'CPPP/2026/NHAI/82103',
    officialTenderId: 'CPPP/2026/NHAI/82103',
    title: 'Widening, Drainage & Flexible Pavement Reconstruction of 4-Lane Feeder Corridor (Km 42.0 to Km 68.5)',
    issuingAuthority: 'National Highways Authority of India (NHAI)',
    authorityType: 'Central Ministry',
    portal: 'CPPP',
    officialSourceName: 'Central Public Procurement Portal (CPPP)',
    portalUrl: 'https://eprocure.gov.in/cppp/',
    officialTenderUrl: 'https://eprocure.gov.in/cppp/',
    category: 'Works',
    subCategory: 'Roads, Bridges & Civil Infrastructure',
    department: 'Project Implementation Unit (PIU) - Western UP',
    publishingDepartment: 'Project Implementation Unit (PIU) - Western UP',
    publishedDate: '2026-11-05',
    publicationDate: '2026-11-05T12:00:00',
    submissionDeadline: '2026-12-28T16:00:00',
    closingDate: '2026-12-28T16:00:00',
    lastUpdatedTimestamp: '2026-11-26T12:00:00Z',
    technicalBidDate: '2026-12-29T15:00:00',
    estimatedValue: 245000000, // ₹24.50 Cr
    earnestMoneyDeposit: 4900000, // ₹49 Lakhs
    tenderFee: 25000,
    location: {
      state: 'Uttar Pradesh',
      city: 'Meerut - Muzaffarnagar Section',
      isPanIndia: false,
    },
    eligibilityCriteria: {
      minTurnoverRequired: 120000000, // ₹12 Cr (50% threshold)
      minYearsExperienceRequired: 5,
      minSingleWorkOrderValue: 98000000, // ₹9.8 Cr
      mandatoryCertifications: ['ISO-9001', 'CPWD-CLASS-1'],
      preferredCertifications: ['ISO-45001', 'PWD-CLASS-A'],
      allowedEnterpriseCategories: ['Medium'],
      makeInIndiaPreference: 'Class-I (>=50%)',
      mseExemptionAllowed: {
        emd: false, // In large infrastructure works (>₹20 Cr), EMD waiver is often not granted
        tenderFee: false,
        turnoverExperienceRelaxation: false,
        purchasePreferencePercent: 0, // Public Procurement Policy works exemption threshold
      },
      subcontractingAllowed: true,
      subcontractingPercentage: 35,
      consortiumAllowed: true,
    },
    documentsRequired: [
      'Class-1 Composite Contractor Enlistment Certificate with CPWD / NHAI',
      'Earnest Money Deposit (EMD) Bank Guarantee in prescribed format',
      'Tender Processing Fee proof via Bharatkosh',
      'Audited Annual Accounts for preceding 5 financial years',
      'Bank Solvency Certificate of minimum ₹10.0 Crores issued within 3 months',
      'Proof of owning / leasing required heavy machinery (Bitumen Sensor Pavers, Batch Plants)',
      'Subcontracting agreement (if partnering with specialized MSMEs)',
      'Key personnel qualification records (Project Manager, Senior Highway Engineer)'
    ],
    scopeSummary: 'Widening of 26.5 km 2-lane feeder road into 4-lane divided highway with concrete medians, RCC storm drains, solar street lights, and asphalt overlay conforming to IRC-37 standards.',
    detailedScope: [
      'Site clearing, grading, sub-base preparation (GSB) and Wet Mix Macadam (WMM)',
      'Dense Bituminous Macadam (DBM) and Bituminous Concrete (BC) wearing coat',
      'Construction of 14 box culverts and roadside RCC drainage network',
      'Thermoplastic road markings, reflective retro-signage, and metal crash barriers',
      'Defect Liability Period (DLP) of 3 years with performance bank guarantee'
    ],
    contactDetails: {
      officerName: 'Anand Kumar Verma',
      designation: 'Project Director & Chief General Manager',
      email: 'pd.meerut@nhai.org',
      phone: '+91-121-267-3310'
    },
    status: 'Active',
    tenderStatus: 'Active',
    matchedSectorTags: ['Civil Works', 'Infrastructure', 'Roads', 'Construction', 'Drainage'],
    isDemoData: true
  },
  {
    id: 'tnd-005',
    tenderNumber: 'GEM/2026/B/6619024',
    officialTenderId: 'GEM/2026/B/6619024',
    title: 'Supply of 100% Biodegradable & Compostable Waste Bags for Municipal Solid Waste Segregation',
    issuingAuthority: 'Jaipur Greater Municipal Corporation & Swachh Bharat Cell',
    authorityType: 'Municipal Corporation',
    portal: 'GeM',
    officialSourceName: 'Government e-Marketplace (GeM)',
    portalUrl: 'https://gem.gov.in/',
    officialTenderUrl: 'https://gem.gov.in/',
    category: 'Products',
    subCategory: 'Eco-Packaging & Waste Management',
    department: 'Health & Solid Waste Management Wing',
    publishingDepartment: 'Health & Solid Waste Management Wing',
    publishedDate: '2026-11-18',
    publicationDate: '2026-11-18T10:00:00',
    submissionDeadline: '2026-12-10T12:00:00',
    closingDate: '2026-12-10T12:00:00',
    lastUpdatedTimestamp: '2026-11-26T12:00:00Z',
    technicalBidDate: '2026-12-10T15:00:00',
    estimatedValue: 4200000, // ₹42 Lakhs
    earnestMoneyDeposit: 84000, // ₹84,000
    tenderFee: 1500,
    location: {
      state: 'Rajasthan',
      city: 'Jaipur',
      isPanIndia: false,
    },
    eligibilityCriteria: {
      minTurnoverRequired: 2100000, // ₹21 Lakhs
      minYearsExperienceRequired: 2,
      minSingleWorkOrderValue: 1500000, // ₹15 Lakhs
      mandatoryCertifications: ['CIPET-17088', 'CPCB-REG'],
      preferredCertifications: ['ZED-GOLD', 'ISO-9001'],
      allowedEnterpriseCategories: ['Micro', 'Small'],
      makeInIndiaPreference: 'Class-I (>=50%)',
      mseExemptionAllowed: {
        emd: true,
        tenderFee: true,
        turnoverExperienceRelaxation: true,
        purchasePreferencePercent: 25, // SC/ST MSE reservation 4% applies
      },
      subcontractingAllowed: false,
      consortiumAllowed: false,
    },
    documentsRequired: [
      'Valid Udyam Registration as Micro/Small Enterprise',
      'CIPET Test Certificate confirming conformity with IS/ISO 17088',
      'Central Pollution Control Board (CPCB) Producer / Manufacturer Registration',
      'CA Certified Turnover for FY 21-22, 22-23, 23-24',
      'Work Completion Certificates for supply of biodegradable bags to any urban body',
      'SC/ST MSE Entrepreneur Caste Certificate (for 4% reservation verification)',
      'Lab sample test compliance undertaking'
    ],
    scopeSummary: 'Supply of 2.5 million pieces of compostable cornstarch-based garbage bags (Green & Blue color coded, 30-micron minimum) with civic awareness printing for doorstep waste collection.',
    detailedScope: [
      'Bags must decompose into organic compost within 180 days under industrial composting conditions',
      'High tensile strength with zero toxic residue or heavy metals as per CPCB standards',
      'Bilingual instructions printed with non-toxic water-based inks',
      'Monthly delivery batches of 250,000 bags to 4 zonal sanitary depots in Jaipur'
    ],
    contactDetails: {
      officerName: 'Smt. Rekha Meena',
      designation: 'Deputy Commissioner (Sanitation)',
      email: 'dc.sanitation@jaipurmc.org',
      phone: '+91-141-274-2820'
    },
    status: 'Closing Soon',
    tenderStatus: 'Closing Soon',
    matchedSectorTags: ['Eco-Products', 'Packaging', 'Biodegradable', 'Municipal', 'Paper'],
    isDemoData: true
  },
  {
    id: 'tnd-006',
    tenderNumber: 'IREPS/2026/WR/ELEC/0894',
    officialTenderId: 'IREPS/2026/WR/ELEC/0894',
    title: 'Annual Maintenance Contract (AMC) & Upgradation of LT Distribution Panels & Energy Automation at Railway Stations',
    issuingAuthority: 'Western Railway (Vadodara & Mumbai Central Divisions)',
    authorityType: 'Railways',
    portal: 'IREPS',
    officialSourceName: 'Indian Railways E-Procurement System (IREPS)',
    portalUrl: 'https://www.ireps.gov.in/',
    officialTenderUrl: 'https://www.ireps.gov.in/',
    category: 'Services',
    subCategory: 'Electrical Engineering & Station Automation',
    department: 'Electrical General (G) Services',
    publishingDepartment: 'Electrical General (G) Services',
    publishedDate: '2026-11-08',
    publicationDate: '2026-11-08T10:00:00',
    submissionDeadline: '2026-12-18T15:30:00',
    closingDate: '2026-12-18T15:30:00',
    lastUpdatedTimestamp: '2026-11-26T12:00:00Z',
    technicalBidDate: '2026-12-19T11:00:00',
    estimatedValue: 12500000, // ₹1.25 Cr
    earnestMoneyDeposit: 250000, // ₹2.5 Lakhs
    tenderFee: 5000,
    location: {
      state: 'Gujarat',
      city: 'Surat, Vadodara, Bharuch Stations',
      isPanIndia: false,
    },
    eligibilityCriteria: {
      minTurnoverRequired: 7500000, // ₹75 Lakhs
      minYearsExperienceRequired: 3,
      minSingleWorkOrderValue: 5000000, // ₹50 Lakhs
      mandatoryCertifications: ['ISO-9001'],
      preferredCertifications: ['ISO-14001', 'ZED-GOLD'],
      allowedEnterpriseCategories: ['Micro', 'Small', 'Medium'],
      makeInIndiaPreference: 'Class-I (>=50%)',
      mseExemptionAllowed: {
        emd: true,
        tenderFee: true,
        turnoverExperienceRelaxation: true,
        purchasePreferencePercent: 25,
      },
      subcontractingAllowed: false,
      consortiumAllowed: false,
    },
    documentsRequired: [
      'MSME Udyam Registration Certificate',
      'Valid Electrical Contractor License (Grade A) issued by Govt Electrical Inspectorate',
      'ISO 9001:2015 Quality Certificate',
      'Past Work Completion Certificates with Indian Railways or State Metro Rail',
      'CA Turnover Certificate with UDIN',
      'List of qualified technicians with Wireman / Electrical Supervisor certificates',
      'EMD exemption request with Udyam verification'
    ],
    scopeSummary: 'Comprehensive preventive and breakdown maintenance of Low Tension panels, MCCBs, auto-changeover switches, power factor correction capacitors, and station LED controllers across 12 railway stations.',
    detailedScope: [
      'Monthly thermographic inspection of busbars and terminal joints to detect hotspots',
      'Calibration of protective relays, Earth Leakage Circuit Breakers (ELCB), and timers',
      'Emergency breakdown attendance within 2 hours of ticket generation via Railway RailNet',
      'Quarterly energy audit report and harmonic distortion analysis'
    ],
    contactDetails: {
      officerName: 'Deepak Saxena',
      designation: 'Senior Divisional Electrical Engineer (General)',
      email: 'srdeng.brc@wr.railnet.gov.in',
      phone: '+91-265-264-1920'
    },
    status: 'Active',
    tenderStatus: 'Active',
    matchedSectorTags: ['Electrical', 'Power', 'Railways', 'Maintenance', 'Panels'],
    isDemoData: true
  },
  {
    id: 'tnd-007',
    tenderNumber: 'CPPP/2026/DRDO/55120',
    officialTenderId: 'CPPP/2026/DRDO/55120',
    title: 'Custom Software Development: AI-Powered Multi-Sensor Telemetry Data Processing Platform',
    issuingAuthority: 'Defence Research and Development Organisation (DRDO - CAIR Labs)',
    authorityType: 'Defense',
    portal: 'CPPP',
    officialSourceName: 'Central Public Procurement Portal (CPPP)',
    portalUrl: 'https://eprocure.gov.in/cppp/',
    officialTenderUrl: 'https://eprocure.gov.in/cppp/',
    category: 'Services',
    subCategory: 'Defense Software & Signal Analytics',
    department: 'Centre for Artificial Intelligence and Robotics (CAIR)',
    publishingDepartment: 'Centre for Artificial Intelligence and Robotics (CAIR)',
    publishedDate: '2026-11-16',
    publicationDate: '2026-11-16T10:00:00',
    submissionDeadline: '2026-12-24T17:00:00',
    closingDate: '2026-12-24T17:00:00',
    lastUpdatedTimestamp: '2026-11-26T12:00:00Z',
    technicalBidDate: '2026-12-26T14:00:00',
    estimatedValue: 22000000, // ₹2.20 Cr
    earnestMoneyDeposit: 440000,
    tenderFee: 10000,
    location: {
      state: 'Karnataka',
      city: 'Bengaluru',
      isPanIndia: false,
    },
    eligibilityCriteria: {
      minTurnoverRequired: 16000000, // ₹1.6 Cr
      minYearsExperienceRequired: 3,
      minSingleWorkOrderValue: 9000000, // ₹90 Lakhs
      mandatoryCertifications: ['ISO-27001', 'ISO-9001'],
      preferredCertifications: ['CMMI-L3', 'CERT-IN'],
      allowedEnterpriseCategories: ['Micro', 'Small', 'Medium'],
      makeInIndiaPreference: 'Class-I (>=50%)',
      mseExemptionAllowed: {
        emd: true,
        tenderFee: true,
        turnoverExperienceRelaxation: true,
        purchasePreferencePercent: 25,
      },
      subcontractingAllowed: false,
      consortiumAllowed: false,
    },
    documentsRequired: [
      'Udyam Registration Certificate',
      'DPIIT Startup India Certificate (if applying under Startup Relaxation)',
      'ISO 27001:2022 and ISO 9001:2015 Certifications',
      'Audited Financial statements for FY 21-22, FY 22-23, FY 23-24',
      'Security Clearance undertaking for Indian citizens on development team',
      'Documented past experience in real-time sensor processing / C++ / Python',
      'Non-Disclosure and Intellectual Property Agreement Acceptance'
    ],
    scopeSummary: 'Engineering of low-latency distributed telemetry ingestion pipeline capable of parsing 50,000 sensor telemetry frames per second with interactive 3D visualization dashboard and anomaly alerts.',
    detailedScope: [
      'Microservices architecture based on Kafka, gRPC, and optimized C++/Rust worker nodes',
      'Real-time automated anomaly detection using unsupervised autoencoders',
      'Hardened air-gapped deployment on indigenous Bharat Operating System Solutions (BOSS Linux)',
      'Full source code handover with exhaustive software architecture documentation and test suites'
    ],
    contactDetails: {
      officerName: 'Group Director (Software Systems)',
      designation: 'Scientist G',
      email: 'cair-tenders@drdo.gov.in',
      phone: '+91-80-2505-7100'
    },
    status: 'Active',
    tenderStatus: 'Active',
    matchedSectorTags: ['Cybersecurity', 'Software', 'AI/ML', 'Defense', 'Cloud'],
    isDemoData: true
  },
  {
    id: 'tnd-008',
    tenderNumber: 'GEM/2026/B/9981240',
    officialTenderId: 'GEM/2026/B/9981240',
    title: 'Procurement of High-Resolution Patient Monitoring Systems with Central Monitoring Station for ICU Wing',
    issuingAuthority: 'Directorate of Medical and Rural Health Services, Govt of Tamil Nadu',
    authorityType: 'State Govt',
    portal: 'GeM',
    officialSourceName: 'Government e-Marketplace (GeM)',
    portalUrl: 'https://gem.gov.in/',
    officialTenderUrl: 'https://gem.gov.in/',
    category: 'Products',
    subCategory: 'Hospital Intensive Care Equipment',
    department: 'Health and Family Welfare Department',
    publishingDepartment: 'Health and Family Welfare Department',
    publishedDate: '2026-11-15',
    publicationDate: '2026-11-15T11:00:00',
    submissionDeadline: '2026-12-12T16:00:00',
    closingDate: '2026-12-12T16:00:00',
    lastUpdatedTimestamp: '2026-11-26T12:00:00Z',
    technicalBidDate: '2026-12-13T11:00:00',
    estimatedValue: 13500000, // ₹1.35 Cr
    earnestMoneyDeposit: 270000,
    tenderFee: 0,
    location: {
      state: 'Tamil Nadu',
      city: 'Tiruchirappalli, Salem & Vellore Govt Hospitals',
      isPanIndia: false,
    },
    eligibilityCriteria: {
      minTurnoverRequired: 8000000, // ₹80 Lakhs
      minYearsExperienceRequired: 3,
      minSingleWorkOrderValue: 5500000, // ₹55 Lakhs
      mandatoryCertifications: ['CDSCO-MD5', 'ISO-13485', 'CE-MARK'],
      preferredCertifications: ['ZED-SILVER', 'ISO-9001'],
      allowedEnterpriseCategories: ['Micro', 'Small', 'Medium'],
      makeInIndiaPreference: 'Class-I (>=50%)',
      mseExemptionAllowed: {
        emd: true,
        tenderFee: true,
        turnoverExperienceRelaxation: true,
        purchasePreferencePercent: 25,
      },
      subcontractingAllowed: false,
      consortiumAllowed: false,
    },
    documentsRequired: [
      'MSME Udyam Registration Certificate',
      'Valid CDSCO Medical Device License in Form MD-5',
      'ISO 13485:2016 QMS Certificate',
      'European CE or US FDA 510(k) certification compliance',
      'CA Certified Turnover Certificate with UDIN',
      'Past performance report from state health societies or railway hospitals',
      '3-Year on-site warranty undertaking with 24-hr breakdown response commitment'
    ],
    scopeSummary: 'Supply, installation, training, and 3-year warranty for 60 units of multi-para patient monitors (ECG, SpO2, NIBP, Respiration, dual Temp) and 3 wireless central monitoring hubs.',
    detailedScope: [
      '12.1-inch color TFT touchscreen display with anti-glare coating and battery backup >= 4 hours',
      'Integrated arrhythmia and ST segment analysis algorithms',
      'Central nurses station software supporting up to 32 bed simultaneous views',
      'Onsite clinical training of nurses and biomedical technicians'
    ],
    contactDetails: {
      officerName: 'Dr. Priya Chandran',
      designation: 'Joint Director (Medical Equipment Procurement)',
      email: 'jd.procurement@tnhealth.org',
      phone: '+91-44-2432-1590'
    },
    status: 'Closing Soon',
    tenderStatus: 'Closing Soon',
    matchedSectorTags: ['Medical Devices', 'Healthcare', 'Hospital', 'Monitors', 'ICU'],
    isDemoData: true
  }
];
