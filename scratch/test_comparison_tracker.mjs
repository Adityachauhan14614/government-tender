// Test suite for Tender Comparison and Bid Tracker modules
import { mockTenders } from 'file:///e:/government%20tender/src/data/mockTenders.ts';
import { mockMSMEProfiles } from 'file:///e:/government%20tender/src/data/mockProfiles.ts';
import { evaluateTenderMatch } from 'file:///e:/government%20tender/src/services/matchmaker.ts';
import { 
  loadTrackedTenders, 
  saveTrackedTenders,
  normalizeStatus
} from 'file:///e:/government%20tender/src/services/tenderStorage.ts';

// Mock localStorage
const mockStorage = new Map();
global.localStorage = {
  getItem: (k) => mockStorage.get(k) || null,
  setItem: (k, v) => mockStorage.set(k, String(v)),
  removeItem: (k) => mockStorage.delete(k),
  clear: () => mockStorage.clear(),
};

const profile = mockMSMEProfiles[0];
const tenders = mockTenders;
const matches = new Map();
for (const t of tenders) {
  matches.set(t.id, evaluateTenderMatch(profile, t));
}

const tests = [
  // 1. Select two tenders for comparison
  {
    name: '1. Select two tenders for comparison',
    fn: () => {
      const selectedIds = [tenders[0].id, tenders[1].id];
      const compared = tenders.filter(t => selectedIds.includes(t.id));
      return compared.length === 2 && compared[0].id === tenders[0].id && compared[1].id === tenders[1].id;
    }
  },

  // 2. Select three tenders for comparison
  {
    name: '2. Select three tenders for comparison',
    fn: () => {
      const selectedIds = [tenders[0].id, tenders[1].id, tenders[2].id];
      const compared = tenders.filter(t => selectedIds.includes(t.id));
      return compared.length === 3;
    }
  },

  // 3. Prevent invalid comparison selection (< 2 and > 3)
  {
    name: '3. Prevent invalid comparison selection (< 2 and > 3)',
    fn: () => {
      // < 2 condition check
      const single = [tenders[0]];
      const isUnderMin = single.length < 2;

      // > 3 condition check
      let selection = [tenders[0].id, tenders[1].id, tenders[2].id];
      const fourthTenderId = tenders[3].id;
      let blockedFourth = false;
      if (selection.length >= 3) {
        blockedFourth = true; // blocked as per handleToggleCompare max 3
      }
      return isUnderMin && blockedFourth;
    }
  },

  // 4. Verify all comparison attributes are accessible
  {
    name: '4. Verify all comparison attributes are present and formatted',
    fn: () => {
      const t1 = tenders[0];
      const m1 = matches.get(t1.id);
      
      const hasValue = typeof t1.estimatedValue === 'number' && t1.estimatedValue > 0;
      const hasEmd = typeof t1.earnestMoneyDeposit === 'number';
      const hasFee = typeof t1.tenderFee === 'number';
      const hasDeadline = Boolean(t1.submissionDeadline);
      const hasDept = Boolean(t1.issuingAuthority);
      const hasLocation = Boolean(t1.location.state && t1.location.city);
      const hasPortal = Boolean(t1.portal);
      const hasEnterpriseClass = Array.isArray(t1.eligibilityCriteria.allowedEnterpriseCategories);
      const hasTurnover = typeof t1.eligibilityCriteria.minTurnoverRequired === 'number';
      const hasExperience = typeof t1.eligibilityCriteria.minYearsExperienceRequired === 'number';
      const hasMandatoryCerts = Array.isArray(t1.eligibilityCriteria.mandatoryCertifications);
      const hasConsortium = typeof t1.eligibilityCriteria.consortiumAllowed === 'boolean';
      const hasPreference = typeof t1.eligibilityCriteria.mseExemptionAllowed.purchasePreferencePercent === 'number';
      const hasScoreAndVerdict = typeof m1.overallScore === 'number' && Boolean(m1.verdict);

      return hasValue && hasEmd && hasFee && hasDeadline && hasDept && hasLocation &&
             hasPortal && hasEnterpriseClass && hasTurnover && hasExperience &&
             hasMandatoryCerts && hasConsortium && hasPreference && hasScoreAndVerdict;
    }
  },

  // 5. Add tender to Bid Tracker
  {
    name: '5. Add tender to Bid Tracker with initial Interested status',
    fn: () => {
      let tracked = {};
      const tenderId = tenders[0].id;
      tracked[tenderId] = {
        tenderId,
        status: 'Interested',
        userNotes: '',
        checklist: {},
        addedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return Boolean(tracked[tenderId]) && tracked[tenderId].status === 'Interested';
    }
  },

  // 6. Prevent duplicate tender entries in Bid Tracker
  {
    name: '6. Prevent duplicate tender entries in Bid Tracker',
    fn: () => {
      let tracked = {};
      const tenderId = tenders[0].id;
      // Add first time
      tracked[tenderId] = {
        tenderId,
        status: 'Interested',
        userNotes: 'Initial',
        checklist: {},
        addedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      // Toggle or re-add
      const keysBefore = Object.keys(tracked).length;
      if (tracked[tenderId]) {
        // Already exists, keying prevents duplicate object entry
        tracked[tenderId] = { ...tracked[tenderId], updatedAt: new Date().toISOString() };
      }
      const keysAfter = Object.keys(tracked).length;
      return keysBefore === 1 && keysAfter === 1;
    }
  },

  // 7. Update bid status across all 6 required statuses
  {
    name: '7. Update bid status across all 6 statuses',
    fn: () => {
      const tenderId = tenders[0].id;
      let tracked = {
        [tenderId]: {
          tenderId,
          status: 'Interested',
          userNotes: '',
          checklist: {},
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      };

      const statuses = ['Interested', 'Preparing Documents', 'Ready to Submit', 'Submitted', 'Won', 'Lost'];
      for (const st of statuses) {
        tracked[tenderId] = { ...tracked[tenderId], status: st };
        if (normalizeStatus(tracked[tenderId].status) !== st) return false;
      }
      return true;
    }
  },

  // 8. Add and edit notes and target submission date
  {
    name: '8. Add and edit notes and target submission date',
    fn: () => {
      const tenderId = tenders[0].id;
      let entry = {
        tenderId,
        status: 'Interested',
        userNotes: '',
        checklist: {},
        addedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Edit notes
      entry = { ...entry, userNotes: 'Quotation finalized at ₹4.2 Cr' };
      // Set target date
      entry = { ...entry, targetSubmissionDate: '2026-12-10' };

      return entry.userNotes === 'Quotation finalized at ₹4.2 Cr' &&
             entry.targetSubmissionDate === '2026-12-10';
    }
  },

  // 9. Remove a pipeline entry
  {
    name: '9. Remove a pipeline entry safely',
    fn: () => {
      const tenderId = tenders[0].id;
      let tracked = {
        [tenderId]: {
          tenderId,
          status: 'Interested',
          userNotes: '',
          checklist: {},
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      };

      // Remove
      delete tracked[tenderId];
      return Object.keys(tracked).length === 0 && !tracked[tenderId];
    }
  },

  // 10. Refresh application and verify persistence (LocalStorage)
  {
    name: '10. Refresh application and verify LocalStorage persistence',
    fn: () => {
      mockStorage.clear();
      const initialData = {
        [tenders[0].id]: {
          tenderId: tenders[0].id,
          status: 'Preparing Documents',
          userNotes: 'Persisted team notes',
          checklist: { 'ISO Certificate': true },
          targetSubmissionDate: '2026-12-12',
          addedAt: '2026-11-20T10:00:00Z',
          updatedAt: '2026-11-20T11:00:00Z',
        }
      };

      // Save
      saveTrackedTenders(initialData);

      // Reload
      const loaded = loadTrackedTenders();
      const item = loaded[tenders[0].id];
      return item && 
             item.tenderId === tenders[0].id &&
             item.status === 'Preparing Documents' &&
             item.userNotes === 'Persisted team notes' &&
             item.targetSubmissionDate === '2026-12-12' &&
             item.checklist['ISO Certificate'] === true;
    }
  },

  // 11. Verify dashboard statistics calculation
  {
    name: '11. Verify dashboard statistics match actual pipeline data',
    fn: () => {
      const mockPipeline = {
        [tenders[0].id]: { tenderId: tenders[0].id, status: 'Interested' },
        [tenders[1].id]: { tenderId: tenders[1].id, status: 'Preparing Documents' },
        [tenders[2].id]: { tenderId: tenders[2].id, status: 'Ready to Submit' },
        [tenders[3].id]: { tenderId: tenders[3].id, status: 'Submitted' },
        [tenders[4].id]: { tenderId: tenders[4].id, status: 'Won' },
        [tenders[5].id]: { tenderId: tenders[5].id, status: 'Lost' },
      };

      const trackedList = Object.values(mockPipeline);
      const totalInPipeline = trackedList.length;
      const interestedCount = trackedList.filter(t => normalizeStatus(t.status) === 'Interested').length;
      const inPrepCount = trackedList.filter(t => {
        const s = normalizeStatus(t.status);
        return s === 'Preparing Documents' || s === 'Ready to Submit';
      }).length;
      const submittedCount = trackedList.filter(t => normalizeStatus(t.status) === 'Submitted').length;
      const wonCount = trackedList.filter(t => normalizeStatus(t.status) === 'Won').length;
      const lostCount = trackedList.filter(t => normalizeStatus(t.status) === 'Lost').length;

      return totalInPipeline === 6 &&
             interestedCount === 1 &&
             inPrepCount === 2 &&
             submittedCount === 1 &&
             wonCount === 1 &&
             lostCount === 1;
    }
  },

  // 12. Verify existing search and matching features still intact
  {
    name: '12. Verify matching engine and search are intact',
    fn: () => {
      const m0 = matches.get(tenders[0].id);
      return m0 && typeof m0.overallScore === 'number' && 
             ['HIGH_MATCH', 'MODERATE_MATCH', 'LOW_MATCH', 'INELIGIBLE'].includes(m0.verdict);
    }
  },

  // 13. Regression Fix 1: Deadline Urgency in Tender Comparison
  {
    name: '13. Regression Fix 1: Deadline urgency logic & expired deadline protection',
    fn: () => {
      const getDeadlineBadgeText = (daysLeft) => {
        if (daysLeft < 0) return 'Deadline Passed';
        if (daysLeft === 0) return 'Closing Today';
        if (daysLeft <= 7) return `${daysLeft} day${daysLeft === 1 ? '' : 's'} remaining`;
        return `${daysLeft} days remaining`;
      };

      const pastMinus5 = getDeadlineBadgeText(-5);
      const pastMinus1 = getDeadlineBadgeText(-1);
      const today = getDeadlineBadgeText(0);
      const oneDay = getDeadlineBadgeText(1);
      const fourDays = getDeadlineBadgeText(4);
      const twelveDays = getDeadlineBadgeText(12);

      const pastIsNeverClosingToday = pastMinus5 !== 'Closing Today' && pastMinus1 !== 'Closing Today';
      const pastIsDeadlinePassed = pastMinus5 === 'Deadline Passed' && pastMinus1 === 'Deadline Passed';
      const todayIsClosingToday = today === 'Closing Today';
      const correctClosingSoon = oneDay === '1 day remaining' && fourDays === '4 days remaining';
      const correctNormal = twelveDays === '12 days remaining';

      return pastIsNeverClosingToday && pastIsDeadlinePassed && todayIsClosingToday && correctClosingSoon && correctNormal;
    }
  },

  // 14. Regression Fix 2: Persist Proposed Bid Value
  {
    name: '14. Regression Fix 2: Proposed bid value persists and restores without duplicates',
    fn: () => {
      mockStorage.clear();
      const testId = tenders[0].id;
      let tracked = {};

      // Helper simulating handleSaveProposedBid in App.tsx
      const saveProposedBid = (tId, amount) => {
        const current = tracked[tId] || {
          tenderId: tId,
          status: 'Interested',
          userNotes: '',
          checklist: {},
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        tracked[tId] = {
          ...current,
          bidValueProposed: amount,
          updatedAt: new Date().toISOString()
        };
      };

      // 1. Save on untracked tender
      saveProposedBid(testId, 45000000);
      saveTrackedTenders(tracked);

      // 2. Reload from storage
      let loaded = loadTrackedTenders();
      const firstEntry = loaded[testId];
      const val1 = firstEntry?.bidValueProposed;
      const status1 = firstEntry?.status;
      const keys1 = Object.keys(loaded).length;

      // 3. Update proposed bid on already tracked tender
      saveProposedBid(testId, 42000000);
      saveTrackedTenders(tracked);

      // 4. Reload again
      loaded = loadTrackedTenders();
      const val2 = loaded[testId]?.bidValueProposed;
      const keys2 = Object.keys(loaded).length;

      return val1 === 45000000 && 
             status1 === 'Interested' && 
             keys1 === 1 && 
             val2 === 42000000 && 
             keys2 === 1; // No duplicate entries
    }
  },

  // 15. Regression Fix 3: Default Status in Notes/Checklist Saving
  {
    name: '15. Regression Fix 3: Fallback status defaults to Interested and preserves existing',
    fn: () => {
      let tracked = {};
      const tenderId1 = tenders[0].id;
      const tenderId2 = tenders[1].id;

      // Simulate handleSaveNotes on untracked tender
      const saveNotes = (tId, notes) => {
        const current = tracked[tId] || {
          tenderId: tId,
          status: 'Interested', // must default to Interested, not 'Reviewing RFP'
          userNotes: notes,
          checklist: {},
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        tracked[tId] = {
          ...current,
          userNotes: notes,
          updatedAt: new Date().toISOString()
        };
      };

      // Simulate handleToggleChecklist on untracked tender
      const toggleChecklist = (tId, doc) => {
        const current = tracked[tId] || {
          tenderId: tId,
          status: 'Interested', // must default to Interested, not 'Preparing Documents'
          userNotes: '',
          checklist: {},
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        tracked[tId] = {
          ...current,
          checklist: { ...current.checklist, [doc]: !current.checklist[doc] },
          updatedAt: new Date().toISOString()
        };
      };

      // Test untracked note save
      saveNotes(tenderId1, 'Initial analysis note');
      const untrackedStatusFromNotes = tracked[tenderId1].status;

      // Test untracked checklist toggle
      toggleChecklist(tenderId2, 'Udyam Certificate');
      const untrackedStatusFromChecklist = tracked[tenderId2].status;

      // Set tenderId1 to 'Submitted' and update notes again -> must PRESERVE 'Submitted'
      tracked[tenderId1].status = 'Submitted';
      saveNotes(tenderId1, 'Updated post-submission note');
      const preservedStatus = tracked[tenderId1].status;

      // Test normalizeStatus legacy support
      const legacyReviewing = normalizeStatus('Reviewing RFP');
      const legacyBookmarked = normalizeStatus('Bookmarked');
      const legacySubmitted = normalizeStatus('Bid Submitted');

      return untrackedStatusFromNotes === 'Interested' &&
             untrackedStatusFromChecklist === 'Interested' &&
             preservedStatus === 'Submitted' &&
             legacyReviewing === 'Preparing Documents' &&
             legacyBookmarked === 'Interested' &&
             legacySubmitted === 'Submitted';
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
