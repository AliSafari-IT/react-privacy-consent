import { ConsentRecord, ConsentDecision } from '../types';

export function generateSessionId(): string {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
}

export function createConsentRecord(
  sessionId: string,
  decisions: ConsentDecision[],
  version: string,
  userId?: string
): ConsentRecord {
  return {
    userId,
    sessionId,
    decisions,
    lastUpdated: new Date(),
    version,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
  };
}

export function isValidConsentRecord(record: ConsentRecord, currentVersion: string): boolean {
  return Boolean(
    record &&
    record.version === currentVersion &&
    record.decisions &&
    Array.isArray(record.decisions) &&
    record.lastUpdated &&
    record.sessionId
  );
}

export function getConsentValue(record: ConsentRecord | null, categoryId: string): boolean {
  if (!record) return false;
  
  const decision = record.decisions.find((d: ConsentDecision) => d.categoryId === categoryId);
  return decision?.status === 'accepted';
}

export function mergeConsentDecisions(
  existing: ConsentDecision[],
  updates: ConsentDecision[]
): ConsentDecision[] {
  const merged = [...existing];
  
  updates.forEach(update => {
    const existingIndex = merged.findIndex((d: ConsentDecision) => d.categoryId === update.categoryId);
    if (existingIndex >= 0) {
      merged[existingIndex] = update;
    } else {
      merged.push(update);
    }
  });
  
  return merged;
}

export function hasExpiredConsent(record: ConsentRecord, expirationDays: number): boolean {
  if (!record.lastUpdated) return true;
  
  const expirationDate = new Date(record.lastUpdated);
  expirationDate.setDate(expirationDate.getDate() + expirationDays);
  
  return expirationDate <= new Date();
}

export function sanitizeConsentRecord(record: ConsentRecord): ConsentRecord {
  return {
    userId: record.userId,
    sessionId: record.sessionId,
    decisions: record.decisions.map((d: ConsentDecision) => ({
      categoryId: d.categoryId,
      status: d.status,
      timestamp: new Date(d.timestamp),
      version: d.version
    })),
    lastUpdated: new Date(record.lastUpdated),
    version: record.version,
    ipAddress: record.ipAddress,
    userAgent: record.userAgent
  };
}
