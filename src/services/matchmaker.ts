import type { MSMEProfile, Tender, MatchResult, CriterionCheck, MatchVerdict } from '../types';

function safeNumber(val: unknown, fallback = 0): number {
  if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
    return Math.max(0, val);
  }
  return fallback;
}

export function formatINR(amount: number): string {
  const safe = safeNumber(amount, 0);
  if (safe >= 10000000) {
    const cr = safe / 10000000;
    return `₹${cr.toFixed(cr >= 10 ? 1 : 2)} Cr`;
  }
  if (safe >= 100000) {
    const lk = safe / 100000;
    return `₹${lk.toFixed(lk >= 10 ? 1 : 2)} Lakh`;
  }
  return `₹${Math.round(safe).toLocaleString('en-IN')}`;
}

function normalizeWord(word: string): string {
  const w = word.toLowerCase();
  if (w.endsWith('ies') && w.length > 5) return w.slice(0, -3) + 'y';
  if (w.endsWith('ing') && w.length > 5) return w.slice(0, -3);
  if (w.endsWith('tion') && w.length > 6) return w.slice(0, -4);
  if (w.endsWith('ers') && w.length > 5) return w.slice(0, -3);
  if (w.endsWith('er') && w.length > 4) return w.slice(0, -2);
  if (w.endsWith('ed') && w.length > 4) return w.slice(0, -2);
  if (w.endsWith('es') && w.length > 4) return w.slice(0, -2);
  if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) return w.slice(0, -1);
  return w;
}

function tokenizeText(text: string): string[] {
  if (!text) return [];
  const STOP_WORDS = new Set([
    'and', 'or', 'the', 'for', 'with', 'of', 'in', 'to', 'a', 'an', 'as', 'at', 'by', 
    'is', 'it', 'on', 'all', 'etc', 'india', 'indian', 'national', 'state', 'pvt', 'ltd',
    'service', 'services', 'product', 'products', 'solution', 'solutions', 'supply', 'supplies',
    'work', 'works', 'system', 'systems', 'item', 'items', 'material', 'materials',
    'contract', 'contracts', 'contractor', 'contractors', 'project', 'projects',
    'operation', 'operations', 'equipment', 'equipments', 'device', 'devices',
    'management', 'support', 'consultancy', 'general', 'company', 'procurement',
    'providing', 'provision', 'limited', 'technical', 'installation', 'related',
    'commercial', 'standard', 'enterprise', 'enterprises'
  ]);
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .map(w => normalizeWord(w.trim()))
    .filter(w => w.length >= 3 && !STOP_WORDS.has(w));
}

function evaluateSectorMatch(
  profile: MSMEProfile, 
  tender: Tender
): { score: number; passed: boolean; matchLevel: 'STRONG' | 'ADJACENT' | 'UNRELATED' | 'UNKNOWN'; message: string; details: string } {
  const tenderTags = (tender.matchedSectorTags || []).map(t => t.trim().toLowerCase());
  const tenderCategory = (tender.category || '').toLowerCase().trim();
  const tenderSubCategory = (tender.subCategory || '').toLowerCase().trim();
  const tenderFullContext = `${tenderCategory} ${tenderSubCategory} ${tender.matchedSectorTags?.join(' ') || ''}`.toLowerCase();
  
  const profileSector = (profile.industrySector || '').toLowerCase().trim();
  const profileSecondary = (profile.secondarySectors || []).map(s => s.toLowerCase().trim()).filter(Boolean);
  const profileProducts = (profile.primaryProductsServices || []).map(s => s.toLowerCase().trim()).filter(Boolean);
  const profileFullText = `${profileSector} ${profileSecondary.join(' ')} ${profileProducts.join(' ')}`.trim();

  const hasTenderSector = Boolean(tenderCategory || tenderSubCategory || tenderTags.length > 0);
  const hasProfileSector = Boolean(profileSector || profileSecondary.length > 0 || profileProducts.length > 0);

  // Guard: if either the tender or the company profile has no sector data, treat as UNKNOWN
  if (!hasTenderSector || !hasProfileSector) {
    return {
      score: 0,
      passed: false,
      matchLevel: 'UNKNOWN',
      message: 'Sector Data Incomplete or Unavailable',
      details: !hasTenderSector
        ? 'Tender category, subcategory, and sector tags are not specified. Sector compatibility cannot be determined without reviewing the original RFP document.'
        : 'Company profile industry sector is not specified. Complete your profile offerings to verify sector compatibility.',
    };
  }
  
  // 1. Direct multi-word tag matching with word boundaries to avoid substring false positives
  const matchedDirectTags: string[] = [];
  for (const tag of tenderTags) {
    if (tag.length >= 3) {
      const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      if (regex.test(profileFullText)) {
        matchedDirectTags.push(tag);
      }
    }
  }

  // 2. Category / SubCategory domain overlap
  // Both sides must be non-empty to avoid false positives from empty-string substring matching
  const primarySectorMatches = Boolean(
    profileSector && tenderCategory && (
      tenderCategory.includes(profileSector) || 
      profileSector.includes(tenderCategory) ||
      (tenderSubCategory && tenderSubCategory.includes(profileSector))
    )
  );

  const secondarySectorMatches = profileSecondary.some(sec => 
    sec && tenderCategory && (
      tenderCategory.includes(sec) || 
      sec.includes(tenderCategory) ||
      (tenderSubCategory && tenderSubCategory.includes(sec))
    )
  );

  // 3. Meaningful domain token overlap (generic noise words stripped)
  const tenderTokens = new Set(tokenizeText(tenderFullContext));
  const profileTokens = new Set(tokenizeText(profileFullText));
  const overlappingKeywords: string[] = [];
  
  for (const token of tenderTokens) {
    if (profileTokens.has(token)) {
      overlappingKeywords.push(token);
    }
  }

  if (matchedDirectTags.length > 0 || primarySectorMatches || overlappingKeywords.length >= 2) {
    const displayKeywords = matchedDirectTags.length > 0 
      ? matchedDirectTags 
      : (primarySectorMatches ? [profileSector] : overlappingKeywords.slice(0, 3));
    return {
      score: 5,
      passed: true,
      matchLevel: 'STRONG',
      message: 'Strong Industry & Product Portfolio Match',
      details: `Tender scope closely aligns with your core domain keywords (${displayKeywords.join(', ')}).`,
    };
  } else if (secondarySectorMatches || overlappingKeywords.length === 1) {
    const displayKeywords = secondarySectorMatches ? [tender.category] : overlappingKeywords;
    return {
      score: 3,
      passed: true,
      matchLevel: 'ADJACENT',
      message: `Partial / Adjacent Sector Match (${displayKeywords[0]})`,
      details: `Tender belongs to an adjacent industry domain with partial competency overlap (${displayKeywords[0]}).`,
    };
  }

  return {
    score: 0,
    passed: false,
    matchLevel: 'UNRELATED',
    message: 'Unrelated Industry Sector',
    details: `Tender domain (${tender.category} / ${tender.subCategory}) does not match your registered offerings (${profile.industrySector || 'General'}).`,
  };
}

export function evaluateTenderMatch(profile: MSMEProfile, tender: Tender): MatchResult {
  const criticalGaps: string[] = [];
  const minorGaps: string[] = [];
  const actionableRecommendations: string[] = [];

  const companyCategory = profile?.category;
  const isMSE = companyCategory === 'Micro' || companyCategory === 'Small';
  const allowsConsortium = Boolean(tender.eligibilityCriteria?.consortiumAllowed);

  // Flags to track conditional pathways vs mandatory failures
  let reliesOnRelaxation = false;
  let reliesOnConsortium = false;
  let hasMandatoryContractFailure = false;
  let hasMandatoryTurnoverFailure = false;
  let hasMandatoryExpFailure = false;

  // -------------------------------------------------------------
  // 1. Enterprise Category Eligibility Verification
  // -------------------------------------------------------------
  const allowedCategories = tender.eligibilityCriteria?.allowedEnterpriseCategories || [];
  const hasCategoryRestriction = Array.isArray(allowedCategories) && allowedCategories.length > 0;
  const isCategoryPermitted = !hasCategoryRestriction || 
    (companyCategory ? allowedCategories.includes(companyCategory) : false);

  if (hasCategoryRestriction && !isCategoryPermitted) {
    criticalGaps.push(
      `Disqualified by Enterprise Category: Tender is strictly restricted to [${allowedCategories.join(', ')}] enterprises. Your company is classified as ${companyCategory || 'an Unspecified'} enterprise.`
    );
    actionableRecommendations.push(
      `This tender legally bars ${companyCategory || 'unspecified'} enterprises. To participate, partner as a consortium member or subcontractor with an eligible ${allowedCategories.join(' or ')} enterprise.`
    );
  }

  // -------------------------------------------------------------
  // 2. Mandatory & Preferred Certifications Scoring (Max 25 pts)
  // -------------------------------------------------------------
  const userCertCodes = new Set((profile.certifications || []).map(c => (c.code || '').toUpperCase()));
  const mandatoryCerts = (tender.eligibilityCriteria?.mandatoryCertifications || []).filter(Boolean);
  const rawPreferredCerts = (tender.eligibilityCriteria?.preferredCertifications || []).filter(Boolean);

  // Eliminate duplicates: preferred certs that are already mandatory
  const preferredCerts = rawPreferredCerts.filter(
    p => !mandatoryCerts.some(m => m.toUpperCase() === p.toUpperCase())
  );

  const matchedMandatoryCerts: string[] = [];
  const missingMandatoryCerts: string[] = [];
  for (const certCode of mandatoryCerts) {
    if (userCertCodes.has(certCode.toUpperCase())) {
      matchedMandatoryCerts.push(certCode);
    } else {
      missingMandatoryCerts.push(certCode);
    }
  }

  const matchedPreferredCerts: string[] = [];
  for (const certCode of preferredCerts) {
    if (userCertCodes.has(certCode.toUpperCase())) {
      matchedPreferredCerts.push(certCode);
    }
  }

  const certPassed = missingMandatoryCerts.length === 0;
  let certScore = 0;
  let certMsg = '';
  let certDetails = '';

  const hasMandatory = mandatoryCerts.length > 0;
  const hasPreferred = preferredCerts.length > 0;

  if (!hasMandatory && !hasPreferred) {
    certScore = 25;
    certMsg = 'No mandatory or preferred certifications required';
    certDetails = 'All bidders eligible regarding certifications.';
  } else if (hasMandatory && hasPreferred) {
    // 20 points allocated to mandatory + 5 bonus points for preferred certifications
    const mandatoryRatio = matchedMandatoryCerts.length / mandatoryCerts.length;
    const mandatoryPoints = Math.round(20 * mandatoryRatio);
    const preferredPoints = Math.round(5 * (matchedPreferredCerts.length / preferredCerts.length));
    certScore = Math.min(25, mandatoryPoints + preferredPoints);

    if (certPassed) {
      if (matchedPreferredCerts.length > 0) {
        certMsg = `All ${mandatoryCerts.length} mandatory verified (+${matchedPreferredCerts.length} preferred bonus)`;
        certDetails = `Your profile holds all required certifications (${matchedMandatoryCerts.join(', ')}) plus preferred bonus accreditations (${matchedPreferredCerts.join(', ')}).`;
      } else {
        certMsg = `All ${mandatoryCerts.length} mandatory certifications verified`;
        certDetails = `Your profile holds all required certifications: ${matchedMandatoryCerts.join(', ')}. Preferred certifications not held: ${preferredCerts.join(', ')}.`;
      }
    } else {
      certMsg = `Missing ${missingMandatoryCerts.length} mandatory certification(s): ${missingMandatoryCerts.join(', ')}`;
      certDetails = `Missing critical mandatory certifications: ${missingMandatoryCerts.join(', ')}. Verified: ${matchedMandatoryCerts.length ? matchedMandatoryCerts.join(', ') : 'None'}.${matchedPreferredCerts.length ? ` (Held preferred: ${matchedPreferredCerts.join(', ')})` : ''}`;
      for (const missingCert of missingMandatoryCerts) {
        criticalGaps.push(`Missing mandatory certification: ${missingCert}`);
      }
      actionableRecommendations.push(
        `Expedite acquisition of ${missingMandatoryCerts.join(', ')} or confirm if equivalent accreditation is acceptable under Section 4 of RFP.`
      );
    }
  } else if (hasMandatory && !hasPreferred) {
    const mandatoryRatio = matchedMandatoryCerts.length / mandatoryCerts.length;
    certScore = Math.min(25, Math.round(25 * mandatoryRatio));

    if (certPassed) {
      certMsg = `All ${mandatoryCerts.length} mandatory certifications verified`;
      certDetails = `Your profile holds all required certifications: ${matchedMandatoryCerts.join(', ')}.`;
    } else {
      certMsg = `Missing ${missingMandatoryCerts.length} mandatory certification(s): ${missingMandatoryCerts.join(', ')}`;
      certDetails = `Missing critical certifications: ${missingMandatoryCerts.join(', ')}. Verified: ${matchedMandatoryCerts.length ? matchedMandatoryCerts.join(', ') : 'None'}.`;
      for (const missingCert of missingMandatoryCerts) {
        criticalGaps.push(`Missing mandatory certification: ${missingCert}`);
      }
      actionableRecommendations.push(
        `Expedite acquisition of ${missingMandatoryCerts.join(', ')} or confirm if equivalent accreditation is acceptable under Section 4 of RFP.`
      );
    }
  } else {
    // Only preferred certifications configured
    const preferredPoints = Math.round(5 * (matchedPreferredCerts.length / preferredCerts.length));
    certScore = Math.min(25, 20 + preferredPoints);
    certMsg = `Preferred certifications held: ${matchedPreferredCerts.length} of ${preferredCerts.length}`;
    certDetails = `No mandatory certifications required. Preferred held: ${matchedPreferredCerts.join(', ') || 'None'}.`;
  }

  const certificationsCheck = {
    passed: certPassed,
    score: certScore,
    maxScore: 25,
    userValueFormatted: `${matchedMandatoryCerts.length} of ${mandatoryCerts.length} Mand.${hasPreferred ? ` (+${matchedPreferredCerts.length} Pref.)` : ''}`,
    requiredValueFormatted: mandatoryCerts.join(', ') || (preferredCerts.length ? `Pref: ${preferredCerts.join(', ')}` : 'None'),
    message: certMsg,
    details: certDetails,
    matchedCertifications: matchedMandatoryCerts,
    missingCertifications: missingMandatoryCerts,
    matchedPreferredCertifications: matchedPreferredCerts,
  };

  // -------------------------------------------------------------
  // 3. Turnover Evaluation & Safe Relaxation Logic (Max 25 pts)
  // -------------------------------------------------------------
  const requiredTurnover = safeNumber(tender.eligibilityCriteria?.minTurnoverRequired, 0);
  const userTurnover = safeNumber(profile.financials?.turnoverFY24 ?? profile.financials?.averageTurnover, 0);
  const isStartup = Boolean(profile.specialStatus?.isStartupIndiaRecognized);
  const allowsTurnoverRelaxation = Boolean(
    tender.eligibilityCriteria?.mseExemptionAllowed?.turnoverExperienceRelaxation && (isMSE || isStartup)
  );

  let turnoverPassed = false;
  let turnoverRelaxed = false;
  let turnoverScore = 0;
  let turnoverMsg = '';
  let turnoverDetails = '';

  if (requiredTurnover === 0) {
    turnoverPassed = true;
    turnoverScore = 25;
    turnoverMsg = 'No minimum turnover threshold required';
    turnoverDetails = 'All enterprises qualify regardless of past turnover.';
  } else if (userTurnover >= requiredTurnover) {
    turnoverPassed = true;
    turnoverScore = 25;
    turnoverMsg = `Exceeds threshold (${formatINR(userTurnover)} vs ${formatINR(requiredTurnover)} req)`;
    turnoverDetails = `Your annual turnover of ${formatINR(userTurnover)} satisfies the tender threshold of ${formatINR(requiredTurnover)} naturally without exemptions.`;
  } else if (allowsTurnoverRelaxation) {
    // GFR 2017 Rule 173(i) permits relaxation subject to quality/technical specifications
    const turnoverRatio = requiredTurnover > 0 ? userTurnover / requiredTurnover : 0;
    const deficitPercent = Math.max(1, Math.round((1 - turnoverRatio) * 100));

    // Evaluate technical capability proof (relaxation is conditioned on quality/specifications)
    // Avoid counting certPassed as quality proof if tender required zero mandatory certifications
    const hasVerifiedCerts = (mandatoryCerts.length > 0 && certPassed) ||
      (profile.certifications || []).some(c => c.verified !== false && Boolean(c.code));
    const hasQualityProof = hasVerifiedCerts || 
      Boolean(profile.specialStatus?.isZedCertified || profile.specialStatus?.isStartupIndiaRecognized);

    turnoverRelaxed = true;
    reliesOnRelaxation = true;

    // Score reflects actual financial baseline + relaxation allowance
    const baseFinancialScore = Math.round(12 * Math.min(1, turnoverRatio));
    const relaxationUplift = hasQualityProof ? 8 : 4;
    turnoverScore = Math.min(20, Math.max(8, baseFinancialScore + relaxationUplift));

    if (hasQualityProof) {
      // Conditionally eligible subject to procuring authority verification
      turnoverPassed = true;
      turnoverMsg = 'Conditional: Relies on MSE Turnover Relaxation (GFR Rule 173-i)';
      turnoverDetails = `Turnover (${formatINR(userTurnover)}) is below the required ${formatINR(requiredTurnover)} (${deficitPercent}% deficit). Tender permits consideration of MSE turnover relaxation under GFR Rule 173(i), but final qualification is conditional upon procuring authority review of technical capability.`;
      minorGaps.push(`Conditional Eligibility: Turnover relies on procuring entity approval of MSE turnover relaxation under GFR Rule 173(i).`);
    } else {
      // Cannot guarantee qualification when technical/quality standards are not verified
      turnoverPassed = false;
      turnoverMsg = 'Turnover deficit; relaxation unconfirmed due to missing quality proof';
      turnoverDetails = `Turnover (${formatINR(userTurnover)}) is below required threshold. Tender permits MSE turnover relaxation, but GFR Rule 173(i) conditions relaxation on meeting quality standards, which are currently unverified.`;
      criticalGaps.push(`Turnover deficit without verified quality proof: GFR Rule 173(i) relaxation cannot be established.`);
    }

    actionableRecommendations.push(
      `Submit your Udyam Certificate citing GFR Rule 173(i) along with manufacturing/quality credentials to formally claim turnover relaxation.`
    );
  } else {
    const turnoverRatio = requiredTurnover > 0 ? userTurnover / requiredTurnover : 0;
    const deficitPercent = Math.max(1, Math.round((1 - turnoverRatio) * 100));
    turnoverScore = Math.max(0, Math.round(25 * turnoverRatio));
    turnoverMsg = `Deficit of ${deficitPercent}% (${formatINR(userTurnover)} vs ${formatINR(requiredTurnover)})`;
    turnoverDetails = `Annual turnover falls short of the mandatory ${formatINR(requiredTurnover)} requirement. Tender does not permit MSE turnover relaxation.`;

    if (allowsConsortium) {
      reliesOnConsortium = true;
      criticalGaps.push(`Turnover deficit of ${deficitPercent}% (${formatINR(userTurnover)} vs ${formatINR(requiredTurnover)} required; no relaxation permitted)`);
      actionableRecommendations.push(
        `Consider forming a Joint Venture / Consortium as permitted by this tender to bridge the ${formatINR(requiredTurnover)} turnover requirement.`
      );
    } else {
      hasMandatoryTurnoverFailure = true;
      criticalGaps.push(`Mandatory Turnover Deficit: Annual turnover (${formatINR(userTurnover)}) falls short of ${formatINR(requiredTurnover)} required. Neither relaxation nor consortium is permitted.`);
    }
  }

  const turnoverCheck: CriterionCheck = {
    passed: turnoverPassed,
    score: turnoverScore,
    maxScore: 25,
    userValueFormatted: formatINR(userTurnover),
    requiredValueFormatted: formatINR(requiredTurnover),
    relaxationApplied: turnoverRelaxed,
    message: turnoverMsg,
    details: turnoverDetails,
  };

  // -------------------------------------------------------------
  // 4. Operational Experience (Years in Business - Max 15 pts)
  // -------------------------------------------------------------
  const reqYears = safeNumber(tender.eligibilityCriteria?.minYearsExperienceRequired, 0);
  const userYears = safeNumber(profile.experience?.yearsInBusiness, 0);
  const allowsExpRelaxation = Boolean(
    profile.specialStatus?.isStartupIndiaRecognized && 
    tender.eligibilityCriteria?.mseExemptionAllowed?.turnoverExperienceRelaxation
  );

  let expPassed = false;
  let expRelaxed = false;
  let expScore = 0;
  let expMsg = '';
  let expDetails = '';

  if (reqYears === 0 || userYears >= reqYears) {
    expPassed = true;
    expScore = 15;
    expMsg = `${userYears} Years experience (Meets >= ${reqYears} yrs requirement)`;
    expDetails = `Your company has been in active operation for ${userYears} years, satisfying the minimum ${reqYears} years benchmark naturally.`;
  } else if (allowsExpRelaxation) {
    expRelaxed = true;
    expPassed = true;
    reliesOnRelaxation = true;
    expScore = Math.min(13, 10 + Math.round(3 * (reqYears > 0 ? userYears / reqYears : 1)));
    expMsg = 'Conditional: Relies on DPIIT Startup Experience Relaxation';
    expDetails = `Prior experience (${userYears} yrs vs ${reqYears} yrs req) relies on startup relaxation permitted by this tender under DPIIT procurement orders. Final acceptance remains subject to procuring entity verification of technical proposal.`;
    minorGaps.push('Conditional Eligibility: Experience qualification depends on procuring authority granting startup relaxation.');
  } else {
    // No relaxation available; experience requirement is not met — cannot confirm eligibility
    hasMandatoryExpFailure = true;
    expScore = reqYears > 0 ? Math.max(0, Math.round(15 * (userYears / reqYears))) : 0;
    expMsg = `Requires ${reqYears} years — Only ${userYears} years recorded (Mandatory gap)`;
    expDetails = `Tender mandates a minimum of ${reqYears} years of operational experience. Your company has ${userYears} years, and no applicable startup or MSE experience relaxation is configured for this tender. This unmet mandatory requirement prevents confirmed eligibility.`;
    minorGaps.push(`Mandatory Experience Deficit: ${userYears} years in business vs ${reqYears} years required. No applicable relaxation is configured for this tender.`);
  }

  const experienceCheck: CriterionCheck = {
    passed: expPassed,
    score: expScore,
    maxScore: 15,
    userValueFormatted: `${userYears} Years`,
    requiredValueFormatted: `${reqYears} Years`,
    relaxationApplied: expRelaxed,
    message: expMsg,
    details: expDetails,
  };

  // -------------------------------------------------------------
  // 5. Past Single Contract Value (Max 20 pts)
  // -------------------------------------------------------------
  const reqContract = safeNumber(tender.eligibilityCriteria?.minSingleWorkOrderValue, 0);
  const userMaxContract = safeNumber(profile.experience?.maxSingleContractValue, 0);

  let contractPassed = false;
  let contractScore = 0;
  let contractMsg = '';
  let contractDetails = '';

  if (reqContract === 0) {
    contractPassed = true;
    contractScore = 20;
    contractMsg = 'No single past contract minimum required';
    contractDetails = 'All contract history scales eligible.';
  } else if (userMaxContract >= reqContract) {
    contractPassed = true;
    contractScore = 20;
    contractMsg = `Single contract max ${formatINR(userMaxContract)} meets ${formatINR(reqContract)} req`;
    contractDetails = `Your largest delivered contract of ${formatINR(userMaxContract)} meets or exceeds the required single order threshold (${formatINR(reqContract)}).`;
  } else {
    // Individual solo bidding threshold unmet
    contractPassed = false;
    const ratio = reqContract > 0 ? userMaxContract / reqContract : 0;
    contractScore = Math.min(19, Math.max(0, Math.round(20 * ratio)));
    const deficitPercent = Math.max(1, Math.round((1 - ratio) * 100));

    if (allowsConsortium) {
      // Tender permits Consortium/JV: conditional consortium eligibility
      reliesOnConsortium = true;
      contractMsg = `Past single contract (${formatINR(userMaxContract)}) below ${formatINR(reqContract)} req (Conditional via Consortium)`;
      contractDetails = `Largest past contract is ${formatINR(userMaxContract)} (${deficitPercent}% deficit against ${formatINR(reqContract)}). Individual solo bidding threshold is unmet; conditional eligibility is available by partnering with a qualifying lead member in a Consortium/JV.`;
      minorGaps.push(`Solo bidding threshold unmet: Single contract ${formatINR(userMaxContract)} achieved vs ${formatINR(reqContract)} required. Conditionally eligible via Consortium/JV.`);
      actionableRecommendations.push(
        `Form a Consortium / Joint Venture with a lead partner satisfying the ${formatINR(reqContract)} single contract mandate to participate.`
      );
    } else {
      // Consortium is NOT allowed: mandatory single contract threshold is an unresolved mandatory eligibility failure
      hasMandatoryContractFailure = true;
      contractMsg = `Mandatory single contract threshold unmet (${formatINR(userMaxContract)} vs ${formatINR(reqContract)} req)`;
      contractDetails = `Tender mandates execution of a single work order worth at least ${formatINR(reqContract)}. Your largest recorded contract is ${formatINR(userMaxContract)} (${deficitPercent}% shortfall). With no consortium permitted, this constitutes a mandatory eligibility failure.`;
      criticalGaps.push(`Mandatory Single Contract Value Unmet: Tender requires demonstrated execution of at least one order worth ${formatINR(reqContract)}, whereas your largest recorded contract is ${formatINR(userMaxContract)} (${deficitPercent}% deficit). No consortium or relaxation is permitted.`);

      if (tender.eligibilityCriteria?.subcontractingAllowed) {
        actionableRecommendations.push(
          `Subcontracting up to ${tender.eligibilityCriteria.subcontractingPercentage || 25}% is allowed; explore participation as a specialized subcontractor to an eligible prime contractor.`
        );
      }
    }
  }

  const pastTrackRecordCheck: CriterionCheck = {
    passed: contractPassed,
    score: contractScore,
    maxScore: 20,
    userValueFormatted: formatINR(userMaxContract),
    requiredValueFormatted: formatINR(reqContract),
    message: contractMsg,
    details: contractDetails,
  };

  // -------------------------------------------------------------
  // 6. Location Eligibility & Operational Suitability (Max 10 pts)
  // -------------------------------------------------------------
  const isPanIndia = Boolean(tender.location?.isPanIndia);
  const tenderState = (tender.location?.state || '').trim();
  const userHomeState = (profile.location?.state || '').trim();
  const userOperationalStates = profile.operationalStates || [];

  // Check if tender explicitly defines a mandatory bidder location restriction
  const hasMandatoryBidderLocationOnly = Boolean(
    (tender.eligibilityCriteria as Record<string, unknown>)?.mandatoryLocalBidderOnly
  );

  const isLocalEntity = Boolean(
    tenderState && userHomeState.toLowerCase() === tenderState.toLowerCase()
  );
  const hasOperationalPresence = Boolean(
    tenderState && userOperationalStates.some(s => s.toLowerCase() === tenderState.toLowerCase())
  );

  let locPassed = true;
  let locScore = 0;
  let locMsg = '';
  let locDetails = '';

  if (hasMandatoryBidderLocationOnly && !isLocalEntity && !isPanIndia) {
    // Explicit geographic bidder restriction failed
    locPassed = false;
    locScore = 0;
    locMsg = `Restricted to Local Bidders in ${tenderState}`;
    locDetails = `This tender enforces a mandatory geographic bidder restriction. Only entities headquartered in ${tenderState} are eligible to bid.`;
    criticalGaps.push(`Mandatory Bidder Location Restriction: Only bidders registered in ${tenderState} are eligible.`);
  } else if (isPanIndia) {
    locPassed = true;
    locScore = 10;
    locMsg = 'Pan-India Delivery (All states eligible)';
    locDetails = 'This tender welcomes bidders nationwide across all Indian states and Union Territories.';
  } else if (isLocalEntity) {
    locPassed = true;
    locScore = 10;
    locMsg = `Local Registered Entity in ${tenderState} (Home State Advantage)`;
    locDetails = `Your registered headquarters is in ${userHomeState}, offering operational logistics and local response advantages.`;
  } else if (hasOperationalPresence) {
    locPassed = true;
    locScore = 8;
    locMsg = `Operational presence in ${tenderState}`;
    locDetails = `Your enterprise maintains active business operations in ${tenderState}.`;
  } else {
    // Delivery/work location does NOT disqualify bidders for open national tenders
    locPassed = true;
    locScore = 5;
    locMsg = `Delivery Site in ${tenderState || 'Specific State'} (Open National Bidding)`;
    locDetails = `Tender delivery/work site is in ${tenderState || 'site state'}. Open to national bidders; operational mobilization or partner presence will be required for site delivery.`;
  }

  const locationCheck: CriterionCheck = {
    passed: locPassed,
    score: locScore,
    maxScore: 10,
    userValueFormatted: userHomeState || 'Unspecified',
    requiredValueFormatted: tender.location?.isPanIndia ? 'PAN-India' : tenderState || 'State Specified',
    message: locMsg,
    details: locDetails,
  };

  // -------------------------------------------------------------
  // 7. Sector & Capability Alignment (Max 5 pts)
  // -------------------------------------------------------------
  const sectorEvaluation = evaluateSectorMatch(profile, tender);
  if (sectorEvaluation.matchLevel === 'UNRELATED') {
    minorGaps.push(
      `Core Domain Mismatch: Tender category (${tender.category} / ${tender.subCategory}) does not match your registered offerings (${profile.industrySector || 'General'}). Domain disparity precludes High Match.`
    );
    actionableRecommendations.push(
      `Ensure your technical bid demonstrates relevant domain expertise or team credentials for ${tender.category}, or explore co-bidding with a specialized firm.`
    );
  } else if (sectorEvaluation.matchLevel === 'UNKNOWN') {
    minorGaps.push(
      `Tender Sector Data Missing: Category and subcategory are not specified in the tender data. Sector compatibility cannot be confirmed without reviewing the original RFP document.`
    );
    actionableRecommendations.push(
      `Obtain the full tender document to verify category and subcategory requirements before submitting a bid.`
    );
  }

  const sectorCheck: CriterionCheck = {
    passed: sectorEvaluation.passed,
    score: sectorEvaluation.score,
    maxScore: 5,
    userValueFormatted: profile.industrySector || 'General Enterprise',
    requiredValueFormatted: `${tender.category} / ${tender.subCategory}`,
    message: sectorEvaluation.message,
    details: sectorEvaluation.details,
  };

  // -------------------------------------------------------------
  // 8. Overall Score & Strict Verdict Determination
  // -------------------------------------------------------------
  const totalScore = turnoverCheck.score + 
                     experienceCheck.score + 
                     pastTrackRecordCheck.score + 
                     certificationsCheck.score + 
                     locationCheck.score + 
                     sectorCheck.score;

  const safeTotalScore = Math.max(0, Math.min(100, Math.round(totalScore)));
  const isSectorUnrelated = sectorEvaluation.matchLevel === 'UNRELATED';
  const isSectorUnknown = sectorEvaluation.matchLevel === 'UNKNOWN';

  let verdict: MatchVerdict = 'LOW_MATCH';
  let bidReadinessLevel: 'Ready to Bid' | 'Minor Prep Needed' | 'High Effort Required' | 'Not Feasible' = 'Ready to Bid';

  if (!isCategoryPermitted || !locPassed || hasMandatoryContractFailure || hasMandatoryTurnoverFailure || criticalGaps.length >= 2 || safeTotalScore < 40) {
    // Mandatory failure: category barred, local bidder restriction failed, mandatory contract/turnover unmet, or multiple critical gaps
    verdict = 'INELIGIBLE';
    bidReadinessLevel = 'Not Feasible';
  } else if (criticalGaps.length === 1) {
    // Single critical gap (e.g. missing mandatory cert) precludes HIGH_MATCH regardless of high numerical score
    verdict = safeTotalScore >= 60 ? 'MODERATE_MATCH' : 'LOW_MATCH';
    bidReadinessLevel = 'High Effort Required';
  } else if (reliesOnRelaxation || reliesOnConsortium) {
    // Zero critical gaps, but qualification depends on relaxation (turnover/exp) or consortium partner
    // Communicates CONDITIONAL ELIGIBILITY rather than confirmed natural qualification
    verdict = 'MODERATE_MATCH';
    bidReadinessLevel = 'Minor Prep Needed';
  } else if (isSectorUnrelated || isSectorUnknown || hasMandatoryExpFailure) {
    // Sector unrelated/unknown, or mandatory experience requirement unmet without relaxation:
    // A high numerical score cannot override these unresolved qualification issues
    verdict = safeTotalScore >= 60 ? 'MODERATE_MATCH' : 'LOW_MATCH';
    bidReadinessLevel = 'High Effort Required';
  } else {
    // Confirmed natural eligibility
    if (safeTotalScore >= 80) {
      verdict = 'HIGH_MATCH';
      bidReadinessLevel = 'Ready to Bid';
    } else if (safeTotalScore >= 60) {
      verdict = 'MODERATE_MATCH';
      bidReadinessLevel = 'Minor Prep Needed';
    } else {
      verdict = 'LOW_MATCH';
      bidReadinessLevel = 'High Effort Required';
    }
  }

  // -------------------------------------------------------------
  // 9. Statutory Exemptions & Purchase Preference (Dynamic Text)
  // -------------------------------------------------------------
  const allowsEmdExemption = Boolean(tender.eligibilityCriteria?.mseExemptionAllowed?.emd && isMSE);
  const allowsFeeExemption = Boolean(tender.eligibilityCriteria?.mseExemptionAllowed?.tenderFee && isMSE);
  const emdAmountSaved = allowsEmdExemption ? safeNumber(tender.earnestMoneyDeposit, 0) : 0;
  const feeAmountSaved = allowsFeeExemption ? safeNumber(tender.tenderFee, 0) : 0;

  const rawPrefPercent = tender.eligibilityCriteria?.mseExemptionAllowed?.purchasePreferencePercent;
  const purchasePrefApplicable = isMSE && typeof rawPrefPercent === 'number' && rawPrefPercent > 0;

  let purchasePrefClause = '';
  if (purchasePrefApplicable) {
    purchasePrefClause = `Eligible for ${rawPrefPercent}% MSE purchase preference allocation under configured tender terms (L1 price matching band).`;
    if (profile.specialStatus?.isWomenOwned) {
      purchasePrefClause += ` Enterprise qualifies for consideration under the Women-owned MSE sub-target.`;
      actionableRecommendations.push(
        `Indicate Women-Owned MSE status in technical submission to claim applicable procurement reservation.`
      );
    }
    if (profile.specialStatus?.isScStOwned) {
      purchasePrefClause += ` Enterprise qualifies for consideration under the SC/ST Entrepreneur MSE sub-target.`;
      actionableRecommendations.push(
        `Submit SC/ST entrepreneur caste credentials alongside Udyam certificate to claim applicable procurement reservation.`
      );
    }
  } else {
    purchasePrefClause = 'Purchase preference is not configured or not applicable for this tender category.';
  }

  if (allowsEmdExemption && tender.earnestMoneyDeposit > 0) {
    actionableRecommendations.unshift(
      `Claim 100% EMD waiver (${formatINR(tender.earnestMoneyDeposit)} saved) by submitting Udyam Registration in the GeM/CPPP bid portal.`
    );
  }

  return {
    tenderId: tender.id,
    overallScore: safeTotalScore,
    verdict,
    breakdown: {
      turnover: turnoverCheck,
      experience: experienceCheck,
      pastTrackRecord: pastTrackRecordCheck,
      certifications: certificationsCheck,
      location: locationCheck,
      sectorAlignment: sectorCheck,
    },
    exemptions: {
      emdExempt: allowsEmdExemption,
      emdAmountSaved,
      feeExempt: allowsFeeExemption,
      feeAmountSaved,
      turnoverRelaxationEligible: allowsTurnoverRelaxation,
      msePricePreferenceEligible: purchasePrefApplicable,
      purchasePreferenceClause: purchasePrefClause,
    },
    gapAnalysis: {
      criticalGaps,
      minorGaps,
      actionableRecommendations,
      consortiumViable: Boolean(tender.eligibilityCriteria?.consortiumAllowed),
    },
    bidReadinessLevel,
  };
}
