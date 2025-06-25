import { useCallback, useEffect, useRef } from 'react';
import { ConsentRecord, UseConsentStorageReturn } from '../types';

// Create a global cache to ensure consistent storage key usage across components
const storageCache: Record<string, ConsentRecord | null> = {};

export function useConsentStorage(storageKey: string): UseConsentStorageReturn {
  const isStorageAvailable = typeof Storage !== 'undefined';
  const currentStorageKey = useRef(storageKey);
  
  // Update the ref if the storage key changes
  useEffect(() => {
    currentStorageKey.current = storageKey;
  }, [storageKey]);
  const saveConsent = useCallback((record: ConsentRecord) => {
    if (!isStorageAvailable) {
      console.warn('Storage is not available, cannot save consent');
      return;
    }
    
    try {
      // Make sure we have a valid record to save
      if (!record || !record.decisions || !Array.isArray(record.decisions) || record.decisions.length === 0) {
        console.error('Cannot save invalid consent record', record);
        return;
      }
      
      // Clone the record to avoid reference issues
      const recordToSave = {
        ...record,
        decisions: [...record.decisions]
      };
      
      // Update the in-memory cache
      storageCache[currentStorageKey.current] = recordToSave;
      
      const serializedRecord = JSON.stringify(recordToSave);
      console.log(`Saving consent to localStorage (key: ${currentStorageKey.current}):`, recordToSave);
      localStorage.setItem(currentStorageKey.current, serializedRecord);
      
      // Also save to sessionStorage as a backup
      sessionStorage.setItem(`${currentStorageKey.current}_backup`, serializedRecord);
    } catch (error) {
      console.error('Failed to save consent to localStorage:', error);
    }
  }, [isStorageAvailable]);  const loadConsent = useCallback((): ConsentRecord | null => {
    if (!isStorageAvailable) {
      console.warn('Storage is not available, cannot load consent');
      return null;
    }
    
    try {
      // Check if we have the record in our cache first
      if (storageCache[currentStorageKey.current]) {
        console.log(`Using cached consent record for key: ${currentStorageKey.current}`);
        return storageCache[currentStorageKey.current];
      }
      
      console.log(`Loading consent from localStorage (key: ${currentStorageKey.current})`);
      let serializedRecord = localStorage.getItem(currentStorageKey.current);
      
      // If not in localStorage, try the sessionStorage backup
      if (!serializedRecord) {
        console.log('No saved consent found in localStorage, checking sessionStorage backup');
        serializedRecord = sessionStorage.getItem(`${currentStorageKey.current}_backup`);
        
        if (serializedRecord) {
          console.log('Found consent record in sessionStorage backup');
        }
      }
      
      if (!serializedRecord) {
        console.log('No saved consent found in any storage');
        return null;
      }
      
      console.log('Found serialized consent record:', serializedRecord.substring(0, 100) + '...');
      
      const record = JSON.parse(serializedRecord);
      console.log('Parsed consent record:', record);
      
      // Validate the loaded record has all required properties
      if (!record || !record.decisions || !Array.isArray(record.decisions) || 
          !record.version || !record.sessionId || !record.lastUpdated) {
        console.warn('Consent record missing required fields, discarding', record);
        return null;
      }
      
      // Validate each decision has the required properties
      const validStatuses = ['accepted', 'rejected', 'pending'];
      const validDecisions = record.decisions.filter((d: any) => {
        const isValid = d && d.categoryId && typeof d.categoryId === 'string' && 
                        d.status && validStatuses.indexOf(d.status) !== -1 &&
                        d.timestamp && d.version;
                        
        if (!isValid) {
          console.warn('Invalid decision found:', d);
        }
        
        return isValid;
      });
      
      if (validDecisions.length !== record.decisions.length) {
        console.warn('Some consent decisions were invalid and filtered out', 
                     'Valid:', validDecisions.length, 
                     'Total:', record.decisions.length);
      }
      
      if (validDecisions.length === 0) {
        console.warn('No valid consent decisions found, discarding record');
        return null;
      }
      
      // Convert timestamp strings back to Date objects
      const parsedRecord = {
        ...record,
        lastUpdated: new Date(record.lastUpdated),
        decisions: validDecisions.map((d: any) => ({
          ...d,
          timestamp: new Date(d.timestamp)
        }))
      };
        console.log('Successfully loaded consent record with', 
                  parsedRecord.decisions.length, 'valid decisions:', 
                  parsedRecord.decisions.map((d: any) => `${d.categoryId}:${d.status}`).join(', '));
      
      // Update the cache
      storageCache[currentStorageKey.current] = parsedRecord;
      return parsedRecord;
    } catch (error) {
      console.warn('Failed to load consent from storage:', error);
      return null;
    }
  }, [isStorageAvailable]);
  const clearConsent = useCallback(() => {
    if (!isStorageAvailable) {
      console.warn('Storage is not available, cannot clear consent');
      return;
    }
    
    try {
      console.log(`Clearing consent from storage (key: ${currentStorageKey.current})`);
      localStorage.removeItem(currentStorageKey.current);
      sessionStorage.removeItem(`${currentStorageKey.current}_backup`);
      
      // Clear from cache
      delete storageCache[currentStorageKey.current];
      
      console.log('Consent data cleared successfully');
    } catch (error) {
      console.error('Failed to clear consent from storage:', error);
    }
  }, [isStorageAvailable]);

  return {
    saveConsent,
    loadConsent,
    clearConsent,
    isStorageAvailable
  };
}
