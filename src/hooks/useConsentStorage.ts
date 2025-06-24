import { useCallback } from 'react';
import { ConsentRecord, UseConsentStorageReturn } from '../types';

export function useConsentStorage(storageKey: string): UseConsentStorageReturn {
  const isStorageAvailable = typeof Storage !== 'undefined';

  const saveConsent = useCallback((record: ConsentRecord) => {
    if (!isStorageAvailable) return;
    
    try {
      const serializedRecord = JSON.stringify(record);
      localStorage.setItem(storageKey, serializedRecord);
    } catch (error) {
      console.warn('Failed to save consent to localStorage:', error);
    }
  }, [storageKey, isStorageAvailable]);

  const loadConsent = useCallback((): ConsentRecord | null => {
    if (!isStorageAvailable) return null;
    
    try {
      const serializedRecord = localStorage.getItem(storageKey);
      if (!serializedRecord) return null;
      
      const record = JSON.parse(serializedRecord);
      
      // Validate the loaded record
      if (!record || !record.decisions || !record.version) {
        return null;
      }
      
      // Convert timestamp strings back to Date objects
      return {
        ...record,
        lastUpdated: new Date(record.lastUpdated),
        decisions: record.decisions.map((d: any) => ({
          ...d,
          timestamp: new Date(d.timestamp)
        }))
      };
    } catch (error) {
      console.warn('Failed to load consent from localStorage:', error);
      return null;
    }
  }, [storageKey, isStorageAvailable]);

  const clearConsent = useCallback(() => {
    if (!isStorageAvailable) return;
    
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Failed to clear consent from localStorage:', error);
    }
  }, [storageKey, isStorageAvailable]);

  return {
    saveConsent,
    loadConsent,
    clearConsent,
    isStorageAvailable
  };
}
