import type { MSMEProfile, Tender, TrackedTender, ApplicationStatus } from '../types/index.ts';
import { mockMSMEProfiles } from '../data/mockProfiles.ts';
import { mockTenders } from '../data/mockTenders.ts';

export function normalizeStatus(status: ApplicationStatus | string): ApplicationStatus {
  switch (status) {
    case 'Interested':
    case 'Bookmarked':
      return 'Interested';
    case 'Preparing Documents':
    case 'Reviewing RFP':
      return 'Preparing Documents';
    case 'Ready to Submit':
      return 'Ready to Submit';
    case 'Submitted':
    case 'Bid Submitted':
    case 'Technically Qualified':
      return 'Submitted';
    case 'Won':
    case 'Awarded':
      return 'Won';
    case 'Lost':
      return 'Lost';
    default:
      return 'Interested';
  }
}

const STORAGE_KEYS = {
  CURRENT_PROFILE_ID: 'tendersetu_current_profile_id',
  PROFILES: 'tendersetu_profiles',
  TENDERS: 'tendersetu_tenders',
  TRACKED_TENDERS: 'tendersetu_tracked_tenders',
};

export function loadProfiles(): MSMEProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILES);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading profiles from localStorage', e);
  }
  return mockMSMEProfiles;
}

export function saveProfiles(profiles: MSMEProfile[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
  } catch (e) {
    console.error('Error saving profiles to localStorage', e);
  }
}

export function loadCurrentProfileId(): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_PROFILE_ID);
    if (raw) return raw;
  } catch (e) {
    console.error(e);
  }
  return mockMSMEProfiles[0].id;
}

export function saveCurrentProfileId(id: string) {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROFILE_ID, id);
  } catch (e) {
    console.error(e);
  }
}

export function loadTenders(): Tender[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TENDERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge with mockTenders to guarantee all official CPPP metadata fields & Demo Data flags are populated
        const mockMap = new Map(mockTenders.map(t => [t.id, t]));
        return parsed.map((item: any) => {
          const fallback = mockMap.get(item.id);
          return {
            ...fallback,
            ...item,
            officialTenderId: item.officialTenderId || fallback?.officialTenderId || item.tenderNumber,
            publishingDepartment: item.publishingDepartment || fallback?.publishingDepartment || item.department,
            publicationDate: item.publicationDate || fallback?.publicationDate || item.publishedDate,
            closingDate: item.closingDate || fallback?.closingDate || item.submissionDeadline,
            officialSourceName: item.officialSourceName || fallback?.officialSourceName || `${item.portal || 'Government'} Portal`,
            officialTenderUrl: item.officialTenderUrl || fallback?.officialTenderUrl || (item.portal === 'CPPP' ? 'https://eprocure.gov.in/cppp/' : item.portal === 'GeM' ? 'https://gem.gov.in/' : 'https://www.ireps.gov.in/'),
            lastUpdatedTimestamp: item.lastUpdatedTimestamp || fallback?.lastUpdatedTimestamp || '2026-11-26T12:00:00Z',
            tenderStatus: item.tenderStatus || fallback?.tenderStatus || item.status,
            isDemoData: item.isDemoData ?? fallback?.isDemoData ?? true,
          };
        });
      }
    }
  } catch (e) {
    console.error(e);
  }
  return mockTenders;
}

export function saveTenders(tenders: Tender[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TENDERS, JSON.stringify(tenders));
  } catch (e) {
    console.error(e);
  }
}

export function loadTrackedTenders(): Record<string, TrackedTender> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRACKED_TENDERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        // Validate and ensure each entry has valid structure
        const validated: Record<string, TrackedTender> = {};
        for (const [key, value] of Object.entries(parsed)) {
          if (value && typeof value === 'object' && (value as any).tenderId) {
            validated[key] = {
              tenderId: (value as any).tenderId,
              status: (value as any).status || 'Interested',
              userNotes: typeof (value as any).userNotes === 'string' ? (value as any).userNotes : '',
              checklist: (value as any).checklist && typeof (value as any).checklist === 'object' ? (value as any).checklist : {},
              bidValueProposed: typeof (value as any).bidValueProposed === 'number' ? (value as any).bidValueProposed : undefined,
              targetSubmissionDate: typeof (value as any).targetSubmissionDate === 'string' ? (value as any).targetSubmissionDate : undefined,
              addedAt: (value as any).addedAt || new Date().toISOString(),
              updatedAt: (value as any).updatedAt || new Date().toISOString(),
            };
          }
        }
        return validated;
      }
    }
  } catch (e) {
    console.error('Error loading tracked tenders from localStorage', e);
  }
  return {};
}

export function saveTrackedTenders(tracked: Record<string, TrackedTender>) {
  try {
    if (tracked && typeof tracked === 'object') {
      localStorage.setItem(STORAGE_KEYS.TRACKED_TENDERS, JSON.stringify(tracked));
    }
  } catch (e) {
    console.error('Error saving tracked tenders to localStorage', e);
  }
}
