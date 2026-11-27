// Scratch test script for Tender Discovery Workflow
import { mockTenders } from 'file:///e:/government%20tender/src/data/mockTenders.ts';
import { mockMSMEProfiles } from 'file:///e:/government%20tender/src/data/mockProfiles.ts';
import { evaluateTenderMatch } from 'file:///e:/government%20tender/src/services/matchmaker.ts';

const profile = mockMSMEProfiles[0]; // Solar manufacturer profile
const tenders = mockTenders;

// Precompute matches
const matches = new Map();
for (const t of tenders) {
  matches.set(t.id, evaluateTenderMatch(profile, t));
}

// Emulate filter logic from App.tsx
function filterTenders({
  searchQuery = '',
  selectedVerdict = 'ALL',
  selectedPortal = 'ALL',
  selectedSector = 'ALL',
  onlyEmdExempt = false,
  selectedCategory = 'ALL',
  selectedState = 'ALL',
  selectedValueRange = 'ALL',
  selectedEnterpriseCategory = 'ALL',
  selectedCertification = 'ALL',
  selectedStatus = 'ALL',
}) {
  return tenders.filter((t) => {
    const match = matches.get(t.id);
    if (!match) return false;

    // Search Query: robust whitespace-trimmed case-insensitive token search
    if (searchQuery.trim()) {
      const queryTokens = searchQuery.trim().toLowerCase().split(/\s+/);
      const searchCorpus = [
        t.title,
        t.tenderNumber,
        t.id,
        t.issuingAuthority,
        t.department,
        t.category,
        t.subCategory,
        t.location.state,
        t.location.city,
        ...(t.matchedSectorTags || [])
      ].join(' ').toLowerCase();

      const allTokensMatch = queryTokens.every(token => searchCorpus.includes(token));
      if (!allTokensMatch) return false;
    }

    // Verdict filter
    if (selectedVerdict !== 'ALL') {
      if (selectedVerdict === 'HIGH_MATCH' && match.verdict !== 'HIGH_MATCH') return false;
      if (selectedVerdict === 'MODERATE_MATCH' && match.verdict !== 'MODERATE_MATCH') return false;
      if (selectedVerdict === 'LOW_MATCH' && match.verdict !== 'LOW_MATCH') return false;
      if (selectedVerdict === 'INELIGIBLE' && match.verdict !== 'INELIGIBLE') return false;
    }

    // Portal filter
    if (selectedPortal !== 'ALL' && t.portal !== selectedPortal) {
      return false;
    }

    // Sector filter
    if (selectedSector !== 'ALL') {
      const matchesSec = t.matchedSectorTags.some(tag => 
        tag.toLowerCase().includes(selectedSector.toLowerCase())
      ) || t.subCategory.toLowerCase().includes(selectedSector.toLowerCase());
      if (!matchesSec) return false;
    }

    // EMD exemption filter
    if (onlyEmdExempt && !match.exemptions.emdExempt) {
      return false;
    }

    // Tender Category filter (Products, Works, Services)
    if (selectedCategory !== 'ALL' && t.category !== selectedCategory) {
      return false;
    }

    // Location / State filter
    if (selectedState !== 'ALL') {
      if (selectedState === 'Pan-India') {
        if (!t.location.isPanIndia) return false;
      } else {
        if (t.location.state.toLowerCase() !== selectedState.toLowerCase() && !t.location.isPanIndia) {
          return false;
        }
      }
    }

    // Estimated Value Range filter
    if (selectedValueRange !== 'ALL') {
      if (selectedValueRange === 'UNDER_1CR' && t.estimatedValue >= 10000000) return false;
      if (selectedValueRange === '1CR_TO_5CR' && (t.estimatedValue < 10000000 || t.estimatedValue > 50000000)) return false;
      if (selectedValueRange === 'ABOVE_5CR' && t.estimatedValue <= 50000000) return false;
    }

    // Enterprise Category filter (Micro, Small, Medium)
    if (selectedEnterpriseCategory !== 'ALL') {
      if (!t.eligibilityCriteria.allowedEnterpriseCategories.includes(selectedEnterpriseCategory)) {
        return false;
      }
    }

    // Mandatory Certification filter
    if (selectedCertification !== 'ALL') {
      if (selectedCertification === 'NONE_REQUIRED') {
        if (t.eligibilityCriteria.mandatoryCertifications.length > 0) return false;
      } else {
        const hasCert = t.eligibilityCriteria.mandatoryCertifications.some(
          c => c.toLowerCase() === selectedCertification.toLowerCase()
        );
        if (!hasCert) return false;
      }
    }

    // Tender Status filter
    if (selectedStatus !== 'ALL' && t.status !== selectedStatus) {
      return false;
    }

    return true;
  });
}

const tests = [
  {
    name: '1. Search by title (case-insensitive with extra spaces)',
    fn: () => {
      const res = filterTenders({ searchQuery: '   ROOFTOP   SOLAR   ' });
      return res.length > 0 && res.every(t => t.title.toLowerCase().includes('solar'));
    }
  },
  {
    name: '2. Search by department / organization (GUVNL)',
    fn: () => {
      const res = filterTenders({ searchQuery: 'guvnl' });
      return res.length > 0 && res.some(t => t.issuingAuthority.includes('GUVNL'));
    }
  },
  {
    name: '3. Search by tender ID / ref number',
    fn: () => {
      const res = filterTenders({ searchQuery: 'GEM/2026/B/8912401' });
      return res.length === 1 && res[0].tenderNumber === 'GEM/2026/B/8912401';
    }
  },
  {
    name: '4. Search by sector tag (Cybersecurity)',
    fn: () => {
      const res = filterTenders({ searchQuery: 'Cybersecurity' });
      return res.length > 0 && res.every(t => 
        t.matchedSectorTags.includes('Cybersecurity') || t.title.toLowerCase().includes('cybersecurity')
      );
    }
  },
  {
    name: '5. Search empty result handling',
    fn: () => {
      const res = filterTenders({ searchQuery: 'nonexistent-query-xyz-12345' });
      return res.length === 0;
    }
  },
  {
    name: '6. Filter by Tender Category (Products vs Services vs Works)',
    fn: () => {
      const products = filterTenders({ selectedCategory: 'Products' });
      const works = filterTenders({ selectedCategory: 'Works' });
      return products.every(t => t.category === 'Products') && works.every(t => t.category === 'Works');
    }
  },
  {
    name: '7. Filter by State / Scope (Gujarat and Pan-India inclusion)',
    fn: () => {
      const gujarat = filterTenders({ selectedState: 'Gujarat' });
      return gujarat.length > 0 && gujarat.every(t => t.location.state === 'Gujarat' || t.location.isPanIndia);
    }
  },
  {
    name: '8. Filter by Estimated Value Range (<1 Cr, 1-5 Cr, >5 Cr)',
    fn: () => {
      const under1Cr = filterTenders({ selectedValueRange: 'UNDER_1CR' });
      const mid = filterTenders({ selectedValueRange: '1CR_TO_5CR' });
      const above5Cr = filterTenders({ selectedValueRange: 'ABOVE_5CR' });
      return under1Cr.every(t => t.estimatedValue < 10000000) &&
             mid.every(t => t.estimatedValue >= 10000000 && t.estimatedValue <= 50000000) &&
             above5Cr.every(t => t.estimatedValue > 50000000);
    }
  },
  {
    name: '9. Filter by Enterprise Eligibility (Small)',
    fn: () => {
      const small = filterTenders({ selectedEnterpriseCategory: 'Small' });
      return small.every(t => t.eligibilityCriteria.allowedEnterpriseCategories.includes('Small'));
    }
  },
  {
    name: '10. Filter by Mandatory Certification (ISO-9001 vs None Required)',
    fn: () => {
      const iso9001 = filterTenders({ selectedCertification: 'ISO-9001' });
      return iso9001.every(t => t.eligibilityCriteria.mandatoryCertifications.includes('ISO-9001'));
    }
  },
  {
    name: '11. Filter by Status (Closing Soon)',
    fn: () => {
      const closingSoon = filterTenders({ selectedStatus: 'Closing Soon' });
      return closingSoon.length > 0 && closingSoon.every(t => t.status === 'Closing Soon');
    }
  },
  {
    name: '12. Composite Filters (Portal: GeM + Sector: Solar + 100% EMD Waived)',
    fn: () => {
      const res = filterTenders({
        selectedPortal: 'GeM',
        selectedSector: 'Solar',
        onlyEmdExempt: true
      });
      return res.length > 0 && res.every(t => {
        const match = matches.get(t.id);
        return t.portal === 'GeM' && 
               t.matchedSectorTags.includes('Solar') && 
               match.exemptions.emdExempt;
      });
    }
  },
  {
    name: '13. Reset Filters restores all tenders',
    fn: () => {
      const all = filterTenders({});
      return all.length === tenders.length;
    }
  }
];

let passed = 0;
for (const test of tests) {
  try {
    const ok = test.fn();
    if (ok) {
      console.log(`[PASS] ${test.name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${test.name}`);
    }
  } catch (err) {
    console.error(`[ERROR] ${test.name}:`, err);
  }
}

console.log(`\nRESULTS: ${passed}/${tests.length} tests passed.`);
if (passed !== tests.length) process.exit(1);
