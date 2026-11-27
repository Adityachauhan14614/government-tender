import type { MSMEProfile } from '../types';

export const mockMSMEProfiles: MSMEProfile[] = [
  {
    id: 'msme-01',
    companyName: 'IndoSun Renewable & Power Systems Pvt Ltd',
    udyamRegistrationNumber: 'UDYAM-GJ-01-0048291',
    panNumber: 'AABCI7821K',
    category: 'Small',
    enterpriseType: 'Manufacturing',
    foundingYear: 2017,
    location: {
      state: 'Gujarat',
      city: 'Ahmedabad',
      pincode: '380015',
    },
    operationalStates: ['Gujarat', 'Maharashtra', 'Rajasthan', 'Madhya Pradesh', 'Delhi'],
    industrySector: 'Electrical, Solar & Power Equipment',
    secondarySectors: ['Renewable Energy', 'Civil & Electrical Works'],
    primaryProductsServices: [
      'Solar Rooftop PV Systems',
      'Solar Inverters & Power Conditioning Units',
      'LT Electrical Distribution Panels',
      'Battery Energy Storage Systems',
      'LED Street Lighting with Smart Controls'
    ],
    nicCodes: ['27101', '27104', '27400', '43210'],
    financials: {
      turnoverFY24: 92000000, // ₹9.2 Cr
      turnoverFY23: 84000000, // ₹8.4 Cr
      turnoverFY22: 76000000, // ₹7.6 Cr
      averageTurnover: 84000000,
      netWorth: 38000000,
      bankSolvencyLimit: 45000000,
    },
    certifications: [
      { id: 'c1', name: 'ISO 9001:2015 (Quality Management)', code: 'ISO-9001', issuingBody: 'TUV SUD', validUntil: '2027-08-30', verified: true },
      { id: 'c2', name: 'ISO 14001:2015 (Environmental Management)', code: 'ISO-14001', issuingBody: 'BSI', validUntil: '2026-12-15', verified: true },
      { id: 'c3', name: 'BIS / ISI Certification for Solar Panels (IS 14286)', code: 'BIS-ISI', issuingBody: 'Bureau of Indian Standards', validUntil: '2027-03-20', verified: true },
      { id: 'c4', name: 'ZED Certification - Gold Category', code: 'ZED-GOLD', issuingBody: 'Ministry of MSME, QCI', validUntil: '2028-05-10', verified: true },
    ],
    experience: {
      yearsInBusiness: 7,
      maxSingleContractValue: 35000000, // ₹3.5 Cr single project
      totalCompletedProjectsValue: 145000000, // ₹14.5 Cr cumulative
      completedGovProjectsCount: 14,
      topPastClients: [
        'Gujarat Energy Development Agency (GEDA)',
        'Western Railway Division',
        'National Dairy Development Board (NDDB)',
        'Ahmedabad Municipal Corporation'
      ],
    },
    specialStatus: {
      isWomenOwned: false,
      isScStOwned: false,
      isZedCertified: true,
      zedGrade: 'Gold',
      isStartupIndiaRecognized: true,
      dpiitNumber: 'DIPP54219',
    },
    preferences: {
      minTenderValue: 2000000, // 20 Lakhs
      maxTenderValue: 60000000, // 6 Crores
      preferredAuthorities: ['State Govt', 'Railways', 'Central Ministry', 'PSU'],
      onlyWithEmdExemption: true,
    },
  },
  {
    id: 'msme-02',
    companyName: 'Nexus CyberSecurity & Cloud IT Solutions',
    udyamRegistrationNumber: 'UDYAM-KR-03-0091842',
    panNumber: 'AAGCN4920E',
    category: 'Small',
    enterpriseType: 'Services',
    foundingYear: 2019,
    location: {
      state: 'Karnataka',
      city: 'Bengaluru',
      pincode: '560001',
    },
    operationalStates: ['Karnataka', 'Telangana', 'Tamil Nadu', 'Maharashtra', 'Delhi'],
    industrySector: 'Information Technology & Software Services',
    secondarySectors: ['Cybersecurity & Network Audit', 'Cloud Infrastructure & Managed Services'],
    primaryProductsServices: [
      'SOC as a Service & Threat Intelligence',
      'Vulnerability Assessment & Penetration Testing (VAPT)',
      'e-Governance Web Portal Development & Maintenance',
      'Cloud Migration & AWS/Azure/NIC Cloud Management',
      'AI/ML Powered Data Analytics Dashboards'
    ],
    nicCodes: ['62011', '62020', '62090'],
    financials: {
      turnoverFY24: 38000000, // ₹3.8 Cr
      turnoverFY23: 31000000, // ₹3.1 Cr
      turnoverFY22: 24000000, // ₹2.4 Cr
      averageTurnover: 31000000,
      netWorth: 18000000,
      bankSolvencyLimit: 20000000,
    },
    certifications: [
      { id: 'c5', name: 'ISO 27001:2022 (Information Security)', code: 'ISO-27001', issuingBody: 'DNV GL', validUntil: '2027-11-10', verified: true },
      { id: 'c6', name: 'ISO 9001:2015 (Quality Management)', code: 'ISO-9001', issuingBody: 'Bureau Veritas', validUntil: '2026-09-01', verified: true },
      { id: 'c7', name: 'CERT-In Empanelled Auditor Partnership', code: 'CERT-IN', issuingBody: 'Indian Computer Emergency Response Team', validUntil: '2026-10-31', verified: true },
      { id: 'c8', name: 'CMMI Level 3 Appraisal', code: 'CMMI-L3', issuingBody: 'CMMI Institute', validUntil: '2027-02-14', verified: true },
    ],
    experience: {
      yearsInBusiness: 5,
      maxSingleContractValue: 12000000, // ₹1.2 Cr
      totalCompletedProjectsValue: 48000000, // ₹4.8 Cr
      completedGovProjectsCount: 8,
      topPastClients: [
        'Centre for e-Governance (Karnataka)',
        'Telangana State Technology Services (TSTS)',
        'Bharat Electronics Limited (BEL)',
        'National Health Authority (NHA)'
      ],
    },
    specialStatus: {
      isWomenOwned: false,
      isScStOwned: false,
      isZedCertified: false,
      isStartupIndiaRecognized: true,
      dpiitNumber: 'DIPP78420',
    },
    preferences: {
      minTenderValue: 1000000, // 10 Lakhs
      maxTenderValue: 25000000, // 2.5 Crores
      preferredAuthorities: ['Central Ministry', 'State Govt', 'Autonomous Body'],
      onlyWithEmdExemption: true,
    },
  },
  {
    id: 'msme-03',
    companyName: 'Aarogya MedTech & Surgical Supplies',
    udyamRegistrationNumber: 'UDYAM-TN-02-0034567',
    panNumber: 'AAKFA6719P',
    category: 'Micro',
    enterpriseType: 'Manufacturing',
    foundingYear: 2020,
    location: {
      state: 'Tamil Nadu',
      city: 'Chennai',
      pincode: '600032',
    },
    operationalStates: ['Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Karnataka'],
    industrySector: 'Medical Devices, Healthcare & Pharmaceuticals',
    secondarySectors: ['Surgical Disposables', 'Hospital Furniture & Equipment'],
    primaryProductsServices: [
      'Surgical Disposables, Gloves & PPE Kits',
      'Digital Patient Monitors & Pulse Oximeters',
      'Diagnostic Test Kits (Rapid Test)',
      'ICU Hospital Beds & Wheelchairs',
      'Autoclave & Sterilization Equipment'
    ],
    nicCodes: ['32503', '32509', '21002'],
    financials: {
      turnoverFY24: 14000000, // ₹1.4 Cr
      turnoverFY23: 11000000, // ₹1.1 Cr
      turnoverFY22: 8000000,  // ₹80 Lakhs
      averageTurnover: 11000000,
      netWorth: 6500000,
      bankSolvencyLimit: 8000000,
    },
    certifications: [
      { id: 'c9', name: 'ISO 13485:2016 (Medical Devices QMS)', code: 'ISO-13485', issuingBody: 'Intertek', validUntil: '2027-04-18', verified: true },
      { id: 'c10', name: 'CDSCO Medical Device Manufacturing License (MD-5)', code: 'CDSCO-MD5', issuingBody: 'Central Drugs Standard Control Org', validUntil: '2028-01-10', verified: true },
      { id: 'c11', name: 'CE Quality Compliance Certification', code: 'CE-MARK', issuingBody: 'SGS Europe', validUntil: '2026-11-20', verified: true },
      { id: 'c12', name: 'ZED Certification - Silver Category', code: 'ZED-SILVER', issuingBody: 'Ministry of MSME', validUntil: '2027-06-25', verified: true },
    ],
    experience: {
      yearsInBusiness: 4,
      maxSingleContractValue: 4500000, // ₹45 Lakhs
      totalCompletedProjectsValue: 18000000,
      completedGovProjectsCount: 11,
      topPastClients: [
        'Tamil Nadu Medical Services Corp (TNMSC)',
        'ESIC Model Hospital Chennai',
        'Directorate of Medical Services, Kerala',
        'Military Hospital Avadi'
      ],
    },
    specialStatus: {
      isWomenOwned: true, // MSE Women Entrepreneur benefit eligible (3% procurement preference)
      isScStOwned: false,
      isZedCertified: true,
      zedGrade: 'Silver',
      isStartupIndiaRecognized: false,
    },
    preferences: {
      minTenderValue: 500000,
      maxTenderValue: 15000000,
      preferredAuthorities: ['State Govt', 'Central Ministry', 'Autonomous Body'],
      onlyWithEmdExemption: true,
    },
  },
  {
    id: 'msme-04',
    companyName: 'Vanguard Civil Infrastructure & Roads',
    udyamRegistrationNumber: 'UDYAM-UP-28-0019234',
    panNumber: 'AAFCV3910M',
    category: 'Medium',
    enterpriseType: 'Manufacturing',
    foundingYear: 2012,
    location: {
      state: 'Uttar Pradesh',
      city: 'Noida',
      pincode: '201301',
    },
    operationalStates: ['Uttar Pradesh', 'Delhi', 'Haryana', 'Rajasthan', 'Uttarakhand'],
    industrySector: 'Civil Works, Infrastructure & Construction',
    secondarySectors: ['Roads, Highways & Drainage', 'Commercial Building Construction'],
    primaryProductsServices: [
      'Rigid & Flexible Pavement Construction',
      'RCC Storm Water Drainage & Culverts',
      'Government Staff Housing & School Buildings',
      'Structural Steel Fabrication & Sheds',
      'Bituminous Road Resurfacing'
    ],
    nicCodes: ['41001', '42101', '42901'],
    financials: {
      turnoverFY24: 380000000, // ₹38 Cr
      turnoverFY23: 345000000, // ₹34.5 Cr
      turnoverFY22: 310000000, // ₹31 Cr
      averageTurnover: 345000000,
      netWorth: 140000000,
      bankSolvencyLimit: 120000000,
    },
    certifications: [
      { id: 'c13', name: 'ISO 9001:2015 (Construction QMS)', code: 'ISO-9001', issuingBody: 'TUV Austria', validUntil: '2027-01-20', verified: true },
      { id: 'c14', name: 'ISO 45001:2018 (Occupational Health & Safety)', code: 'ISO-45001', issuingBody: 'TUV Austria', validUntil: '2026-10-15', verified: true },
      { id: 'c15', name: 'UP PWD Class-A Contractor Enlistment', code: 'PWD-CLASS-A', issuingBody: 'Public Works Department UP', validUntil: '2028-03-31', verified: true },
      { id: 'c16', name: 'CPWD Class-1 Composite Enlistment', code: 'CPWD-CLASS-1', issuingBody: 'Central PWD', validUntil: '2027-06-30', verified: true },
    ],
    experience: {
      yearsInBusiness: 12,
      maxSingleContractValue: 160000000, // ₹16 Cr single contract
      totalCompletedProjectsValue: 890000000, // ₹89 Cr
      completedGovProjectsCount: 29,
      topPastClients: [
        'National Highways Authority of India (NHAI)',
        'UP State Highway Authority (UPSHA)',
        'Noida Development Authority',
        'Military Engineering Services (MES)'
      ],
    },
    specialStatus: {
      isWomenOwned: false,
      isScStOwned: false,
      isZedCertified: false,
      isStartupIndiaRecognized: false,
    },
    preferences: {
      minTenderValue: 20000000, // 2 Cr
      maxTenderValue: 250000000, // 25 Cr
      preferredAuthorities: ['State Govt', 'Central Ministry', 'PSU', 'Municipal Corporation'],
      onlyWithEmdExemption: false,
    },
  },
  {
    id: 'msme-05',
    companyName: 'EcoKriti Biopolymers & Sustainable Krafts',
    udyamRegistrationNumber: 'UDYAM-RJ-17-0051289',
    panNumber: 'AAQPE8821B',
    category: 'Micro',
    enterpriseType: 'Manufacturing',
    foundingYear: 2021,
    location: {
      state: 'Rajasthan',
      city: 'Jaipur',
      pincode: '302013',
    },
    operationalStates: ['Rajasthan', 'Delhi', 'Haryana', 'Punjab', 'Gujarat'],
    industrySector: 'Eco-Products, Packaging & Paper',
    secondarySectors: ['Stationery & Office Supplies', 'Biodegradable Products'],
    primaryProductsServices: [
      '100% Compostable Food Containers & Trays',
      'Multi-wall Heavy-Duty Kraft Paper Bags',
      'Corrugated Storage Boxes (Recycled)',
      'Biodegradable Garbage Disposal Bags for Hospitals & Municipalities',
      'Plantable Eco-friendly Office Stationery'
    ],
    nicCodes: ['17021', '17029', '22203'],
    financials: {
      turnoverFY24: 8500000, // ₹85 Lakhs
      turnoverFY23: 6500000, // ₹65 Lakhs
      turnoverFY22: 4200000, // ₹42 Lakhs
      averageTurnover: 6500000,
      netWorth: 3900000,
      bankSolvencyLimit: 5000000,
    },
    certifications: [
      { id: 'c17', name: 'CIPET Compostability Certificate (IS/ISO 17088)', code: 'CIPET-17088', issuingBody: 'CIPET India', validUntil: '2027-09-12', verified: true },
      { id: 'c18', name: 'CPCB Manufacturer Registration for Compostable Plastics', code: 'CPCB-REG', issuingBody: 'Central Pollution Control Board', validUntil: '2028-02-28', verified: true },
      { id: 'c19', name: 'ZED Certification - Gold Category', code: 'ZED-GOLD', issuingBody: 'Ministry of MSME', validUntil: '2028-04-10', verified: true },
      { id: 'c20', name: 'FSSAI Food Contact Packaging License', code: 'FSSAI-PKG', issuingBody: 'FSSAI', validUntil: '2026-12-31', verified: true },
    ],
    experience: {
      yearsInBusiness: 3,
      maxSingleContractValue: 2800000, // ₹28 Lakhs
      totalCompletedProjectsValue: 11000000,
      completedGovProjectsCount: 6,
      topPastClients: [
        'Rajasthan State Agro Industries Corp',
        'Jaipur Municipal Corporation (Greater)',
        'Indian Institute of Health Management Research',
        'Indian Railways (North Western Zone Catering)'
      ],
    },
    specialStatus: {
      isWomenOwned: false,
      isScStOwned: true, // SC/ST MSE Entrepreneur (4% special quota eligibility under PPP-MSE)
      isZedCertified: true,
      zedGrade: 'Gold',
      isStartupIndiaRecognized: true,
      dpiitNumber: 'DIPP99401',
    },
    preferences: {
      minTenderValue: 200000,
      maxTenderValue: 10000000,
      preferredAuthorities: ['Municipal Corporation', 'Railways', 'Central Ministry', 'State Govt'],
      onlyWithEmdExemption: true,
    },
  }
];
