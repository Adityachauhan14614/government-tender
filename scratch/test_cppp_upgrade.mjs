import assert from 'node:assert';
import { mockTenders } from '../src/data/mockTenders.ts';
import { getOfficialTenderUrl } from '../src/types/index.ts';
import { loadTenders } from '../src/services/tenderStorage.ts';

// Mock localStorage for Node environment
const storage = new Map();
global.localStorage = {
  getItem: (key) => storage.get(key) || null,
  setItem: (key, val) => storage.set(key, String(val)),
  removeItem: (key) => storage.delete(key),
  clear: () => storage.clear()
};

console.log('--- CPPP & OFFICIAL TENDER UPGRADE VERIFICATION SUITE ---');

// Test 1: All 8 required fields are present on every mock tender
{
  assert.strictEqual(mockTenders.length, 8, 'All 8 mock tenders must be present');
  for (const t of mockTenders) {
    assert(t.officialTenderId, `Tender ${t.id} must have officialTenderId`);
    assert(t.publishingDepartment, `Tender ${t.id} must have publishingDepartment`);
    assert(t.publicationDate, `Tender ${t.id} must have publicationDate`);
    assert(t.closingDate, `Tender ${t.id} must have closingDate`);
    assert(t.officialSourceName, `Tender ${t.id} must have officialSourceName`);
    assert(t.officialTenderUrl, `Tender ${t.id} must have officialTenderUrl`);
    assert(t.lastUpdatedTimestamp, `Tender ${t.id} must have lastUpdatedTimestamp`);
    assert(t.tenderStatus, `Tender ${t.id} must have tenderStatus`);
    assert.strictEqual(t.isDemoData, true, `Tender ${t.id} must be flagged as isDemoData`);
  }
  console.log('[PASS] Test 1: All 8 required official procurement fields present on all tenders');
}

// Test 2: getOfficialTenderUrl never generates fake URLs and routes to official portals
{
  const cpppTenders = mockTenders.filter(t => t.portal === 'CPPP');
  assert(cpppTenders.length >= 3, 'Must have at least 3 CPPP tenders');
  for (const t of cpppTenders) {
    const url = getOfficialTenderUrl(t);
    assert.strictEqual(url, 'https://eprocure.gov.in/cppp/', 'CPPP tender URL must point to official CPPP portal');
    assert(!url.includes('/tenderdetails/'), 'URL must not contain fake mock subpaths');
  }

  const gemTenders = mockTenders.filter(t => t.portal === 'GeM');
  for (const t of gemTenders) {
    const url = getOfficialTenderUrl(t);
    assert.strictEqual(url, 'https://gem.gov.in/', 'GeM tender URL must point to official GeM portal');
  }

  const irepsTenders = mockTenders.filter(t => t.portal === 'IREPS');
  for (const t of irepsTenders) {
    const url = getOfficialTenderUrl(t);
    assert.strictEqual(url, 'https://www.ireps.gov.in/', 'IREPS tender URL must point to official IREPS portal');
  }
  console.log('[PASS] Test 2: getOfficialTenderUrl returns verified official portal URLs without fake paths');
}

// Test 3: CPPP tenders have official source name "Central Public Procurement Portal (CPPP)"
{
  const cpppTender = mockTenders.find(t => t.id === 'tnd-002');
  assert(cpppTender, 'Tender tnd-002 must exist');
  assert.strictEqual(cpppTender.portal, 'CPPP');
  assert.strictEqual(cpppTender.officialSourceName, 'Central Public Procurement Portal (CPPP)');
  assert.strictEqual(cpppTender.publishingDepartment, 'Information Technology & Data Protection Division');
  assert.strictEqual(cpppTender.officialTenderId, 'CPPP/2026/NHA/91024');
  console.log('[PASS] Test 3: CPPP tender tnd-002 has verified official source attribution');
}

// Test 4: loadTenders defensively populates missing fields for legacy stored records
{
  localStorage.clear();
  // Simulate legacy saved tender lacking the 8 new fields
  localStorage.setItem('tendersetu_tenders', JSON.stringify([
    {
      id: 'tnd-002',
      tenderNumber: 'CPPP/2026/NHA/91024',
      title: 'Legacy Title',
      portal: 'CPPP',
      department: 'Legacy Department',
      publishedDate: '2026-11-14',
      submissionDeadline: '2026-12-08T17:00:00',
      status: 'Active'
    }
  ]));

  const loaded = loadTenders();
  assert(loaded.length >= 1);
  const upgraded = loaded[0];
  assert.strictEqual(upgraded.officialTenderId, 'CPPP/2026/NHA/91024');
  assert.strictEqual(upgraded.publishingDepartment, 'Information Technology & Data Protection Division');
  assert.strictEqual(upgraded.officialSourceName, 'Central Public Procurement Portal (CPPP)');
  assert.strictEqual(upgraded.officialTenderUrl, 'https://eprocure.gov.in/cppp/');
  assert.strictEqual(upgraded.isDemoData, true);
  console.log('[PASS] Test 4: loadTenders seamlessly upgrades legacy stored records');
}

console.log('ALL CPPP UPGRADE TESTS PASSED.');
