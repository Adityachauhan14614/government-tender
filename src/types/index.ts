export type EnterpriseCategory = 'Micro' | 'Small' | 'Medium';
export type EnterpriseType = 'Manufacturing' | 'Services' | 'Trading / Supply';

export type TenderAuthorityType = 
  | 'Central Ministry' 
  | 'State Govt' 
  | 'PSU' 
  | 'Railways' 
  | 'Defense' 
  | 'Municipal Corporation' 
  | 'Autonomous Body';

export type TenderPortal = 'GeM' | 'CPPP' | 'State eProc' | 'IREPS' | 'Defense eProc';

export type TenderCategory = 'Products' | 'Works' | 'Services' | 'Turnkey' | 'Consultancy';

export interface CertificationItem {
  id: string;
  name: string;
  code: string;
  issuingBody: string;
  validUntil: string;
  verified: boolean;
}

export interface MSMEProfile {
  id: string;
  companyName: string;
  udyamRegistrationNumber: string;
  panNumber: string;
  category: EnterpriseCategory;
  enterpriseType: EnterpriseType;
  foundingYear: number;
  location: {
    state: string;
    city: string;
    pincode: string;
  };
  operationalStates: string[];
  industrySector: string;
  secondarySectors: string[];
  primaryProductsServices: string[];
  nicCodes: string[];
  financials: {
    turnoverFY24: number; // in INR
    turnoverFY23: number;
    turnoverFY22: number;
    averageTurnover: number;
    netWorth: number;
    bankSolvencyLimit: number;
  };
  certifications: CertificationItem[];
  experience: {
    yearsInBusiness: number;
    maxSingleContractValue: number; // in INR
    totalCompletedProjectsValue: number; // in INR
    completedGovProjectsCount: number;
    topPastClients: string[];
  };
  specialStatus: {
    isWomenOwned: boolean;
    isScStOwned: boolean;
    isZedCertified: boolean;
    zedGrade?: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
    isStartupIndiaRecognized: boolean;
    dpiitNumber?: string;
  };
  preferences: {
    minTenderValue: number;
    maxTenderValue: number;
    preferredAuthorities: string[];
    onlyWithEmdExemption: boolean;
  };
}

export interface Tender {
  id: string;
  tenderNumber: string;
  officialTenderId?: string; // Official Tender ID from CPPP/GeM
  title: string;
  issuingAuthority: string;
  authorityType: TenderAuthorityType;
  publishingDepartment?: string; // Publishing Department / Division
  portal: TenderPortal;
  officialSourceName?: string; // e.g. "Central Public Procurement Portal (CPPP)"
  portalUrl?: string;
  officialTenderUrl?: string; // Verified official portal link
  category: TenderCategory;
  subCategory: string;
  department: string;
  publishedDate: string;
  publicationDate?: string; // Publication date
  submissionDeadline: string;
  closingDate?: string; // Closing date
  lastUpdatedTimestamp?: string; // Last refreshed / updated ISO string
  technicalBidDate: string;
  estimatedValue: number; // in INR
  earnestMoneyDeposit: number; // in INR
  tenderFee: number; // in INR
  location: {
    state: string;
    city: string;
    isPanIndia: boolean;
  };
  eligibilityCriteria: {
    minTurnoverRequired: number; // in INR
    minYearsExperienceRequired: number;
    minSingleWorkOrderValue: number; // in INR
    mandatoryCertifications: string[];
    preferredCertifications: string[];
    allowedEnterpriseCategories: EnterpriseCategory[];
    makeInIndiaPreference: 'Class-I (>=50%)' | 'Class-II (>=20%)' | 'Non-Local';
    mseExemptionAllowed: {
      emd: boolean;
      tenderFee: boolean;
      turnoverExperienceRelaxation: boolean; // Under DPIIT / Rule 173(i) of GFR
      purchasePreferencePercent: number; // e.g. 25% for MSEs with 3% for Women and 4% for SC/ST
    };
    subcontractingAllowed: boolean;
    subcontractingPercentage?: number;
    consortiumAllowed: boolean;
  };
  documentsRequired: string[];
  scopeSummary: string;
  detailedScope: string[];
  contactDetails: {
    officerName: string;
    designation: string;
    email: string;
    phone: string;
  };
  status: 'Active' | 'Closing Soon' | 'Under Evaluation' | string;
  tenderStatus?: 'Active' | 'Closing Soon' | 'Under Evaluation' | 'Archived' | string;
  matchedSectorTags: string[];
  isDemoData?: boolean; // Clearly labels existing sample entries as "Demo Data"
}

export function getOfficialTenderUrl(tender: Tender): string {
  if (tender.officialTenderUrl) return tender.officialTenderUrl;
  if (tender.portalUrl && !tender.portalUrl.includes('/tenderdetails/')) return tender.portalUrl;
  switch (tender.portal) {
    case 'CPPP':
      return 'https://eprocure.gov.in/cppp/';
    case 'GeM':
      return 'https://gem.gov.in/';
    case 'IREPS':
      return 'https://www.ireps.gov.in/';
    default:
      return 'https://eprocure.gov.in/cppp/';
  }
}

export interface CriterionCheck {
  passed: boolean;
  score: number;
  maxScore: number;
  userValueFormatted: string;
  requiredValueFormatted: string;
  relaxationApplied?: boolean;
  message: string;
  details: string;
}

export interface MatchCriteriaBreakdown {
  turnover: CriterionCheck;
  experience: CriterionCheck;
  pastTrackRecord: CriterionCheck;
  certifications: CriterionCheck & {
    matchedCertifications: string[];
    missingCertifications: string[];
    matchedPreferredCertifications?: string[];
  };
  location: CriterionCheck;
  sectorAlignment: CriterionCheck;
}

export type MatchVerdict = 'HIGH_MATCH' | 'MODERATE_MATCH' | 'LOW_MATCH' | 'INELIGIBLE';

export interface MatchResult {
  tenderId: string;
  overallScore: number; // 0 to 100
  verdict: MatchVerdict;
  breakdown: MatchCriteriaBreakdown;
  exemptions: {
    emdExempt: boolean;
    emdAmountSaved: number;
    feeExempt: boolean;
    feeAmountSaved: number;
    turnoverRelaxationEligible: boolean;
    msePricePreferenceEligible: boolean;
    purchasePreferenceClause: string;
  };
  gapAnalysis: {
    criticalGaps: string[];
    minorGaps: string[];
    actionableRecommendations: string[];
    consortiumViable: boolean;
  };
  bidReadinessLevel: 'Ready to Bid' | 'Minor Prep Needed' | 'High Effort Required' | 'Not Feasible';
}

export type ApplicationStatus = 
  | 'Interested'
  | 'Preparing Documents'
  | 'Ready to Submit'
  | 'Submitted'
  | 'Won'
  | 'Lost'
  | 'Bookmarked'
  | 'Reviewing RFP'
  | 'Bid Submitted'
  | 'Technically Qualified'
  | 'Awarded';

export interface TrackedTender {
  tenderId: string;
  status: ApplicationStatus;
  userNotes: string;
  checklist: Record<string, boolean>;
  bidValueProposed?: number;
  targetSubmissionDate?: string;
  addedAt: string;
  updatedAt: string;
}
