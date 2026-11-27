export interface ProcurementPolicyRule {
  id: string;
  title: string;
  authority: string;
  reference: string;
  summary: string;
  benefits: string[];
  eligibilityConditions: string[];
  howToClaim: string;
}

export const indianProcurementPolicies: ProcurementPolicyRule[] = [
  {
    id: 'pol-01',
    title: 'Public Procurement Policy for Micro and Small Enterprises (MSEs) Order, 2012',
    authority: 'Ministry of Micro, Small and Medium Enterprises (MSME)',
    reference: 'S.O. 581(E) dated 23.03.2012 & Gazette Notification 2018 Amendment',
    summary: 'Mandates all Central Ministries, Departments, and Central Public Sector Enterprises (CPSEs) to procure a minimum of 25% of their total annual procurement of goods and services from MSEs.',
    benefits: [
      '25% Mandatory Procurement Target from MSEs across all CPSEs and Ministries',
      '4% sub-quota earmarked for procurement from SC / ST owned MSEs',
      '3% sub-quota earmarked for procurement from Women-owned MSEs',
      '100% Exemption from Earnest Money Deposit (EMD / Bid Security)',
      'Issue of Tender Documents free of cost (Zero Tender Fee)',
      'Price Preference (L1 + 15% rule): MSEs quoting within 15% of the lowest tenderer (L1) can match the L1 price and win at least 25% of the tender quantity'
    ],
    eligibilityConditions: [
      'Must possess valid Udyam Registration Certificate',
      'Enterprise must be classified as Micro or Small (Medium enterprises excluded from 25% quota)',
      'Goods/services offered must match the National Industry Classification (NIC) in Udyam certificate'
    ],
    howToClaim: 'Upload Udyam Registration Certificate in the technical bid and select "MSE Exemption Claimed" on GeM / CPPP portal.'
  },
  {
    id: 'pol-02',
    title: 'Relaxation of Prior Turnover and Prior Experience for Startups & MSEs',
    authority: 'Ministry of Finance, Department of Expenditure & DPIIT',
    reference: 'Rule 173(i) of General Financial Rules (GFR) 2017 & DPIIT OM No. 10(1)/2016-DBA',
    summary: 'Procuring entities may relax condition of prior turnover and prior experience in all public procurements for Startups and Micro & Small Enterprises, subject to meeting technical specifications and quality standards.',
    benefits: [
      'Relief from unrealistic multi-crore turnover hurdles for young tech & manufacturing MSEs',
      'Allows new innovators and startups to bid against established corporate conglomerates',
      'Focuses bid evaluation strictly on technical competence and product quality tests'
    ],
    eligibilityConditions: [
      'Recognized by DPIIT as a Startup OR holds valid Micro/Small Udyam certificate',
      'Must demonstrate technical capability, manufacturing capacity, or product test reports from accredited labs (NABL / CIPET)'
    ],
    howToClaim: 'Submit DPIIT Startup Recognition Certificate or Udyam Certificate along with self-declaration citing GFR 2017 Rule 173(i).'
  },
  {
    id: 'pol-03',
    title: 'Public Procurement (Preference to Make in India) Order, 2017',
    authority: 'Department for Promotion of Industry and Internal Trade (DPIIT)',
    reference: 'P-45021/2/2017-PP (BE-II) dated 16.09.2020',
    summary: 'Gives purchase preference to Class-I Local Suppliers (local content >= 50%) and restricts global tender inquiries for tenders valued under ₹200 Crores.',
    benefits: [
      'No Global Tenders allowed for procurements up to ₹200 Crores (safeguarding domestic MSMEs from international dumping)',
      'Class-I Local Suppliers (>= 50% local value addition) receive top purchase preference',
      'Price matching within L1 + 20% margin for local manufacturers'
    ],
    eligibilityConditions: [
      'Calculated percentage of domestic value addition (materials, Indian labor, local components)',
      'Class-I Local Supplier (local content >= 50%) or Class-II (local content >= 20%)'
    ],
    howToClaim: 'Submit a self-declaration of local content percentage and Indian manufacturing location (for tenders under ₹10 Cr).'
  },
  {
    id: 'pol-04',
    title: 'MSME Sustainable (ZED) Certification Pre-Qualification Credit',
    authority: 'Ministry of MSME & Quality Council of India (QCI)',
    reference: 'MSME ZED Scheme Guidelines 2022',
    summary: 'Recognizes enterprises adopting Zero Defect (in production) and Zero Effect (on environment) practices, granting subsidies, lower bank interest rates, and priority scoring in state vendor empanelment.',
    benefits: [
      'Financial subsidies up to 80% on certification cost for Micro enterprises',
      'Bonus technical marks or direct qualification exemption in several State Discom & Municipal tenders',
      'Reduced bank processing charges and concession in interest on bank guarantees'
    ],
    eligibilityConditions: [
      'Valid Udyam Registration and formal assessment on Bronze, Silver, or Gold ZED parameters'
    ],
    howToClaim: 'Include ZED assessment certificate alongside technical credentials.'
  }
];
