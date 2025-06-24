import { useCallback } from 'react';
import { ConsentRecord, UseConsentStorageReturn } from '../types';

export function useConsentStorage(storageKey: string): UseConsentStorageReturn {
  const isStorageAvailable = typeof Storage !== 'undefined';
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
      
      const serializedRecord = JSON.stringify(recordToSave);
      console.log(`Saving consent to localStorage (key: ${storageKey}):`, recordToSave);
      localStorage.setItem(storageKey, serializedRecord);
    } catch (error) {
      console.error('Failed to save consent to localStorage:', error);
    }
  }, [storageKey, isStorageAvailable]);  const loadConsent = useCallback((): ConsentRecord | null => {
    if (!isStorageAvailable) {
      console.warn('Storage is not available, cannot load consent');
      return null;
    }
    
    try {
      console.log(`Loading consent from localStorage (key: ${storageKey})`);
      const serializedRecord = localStorage.getItem(storageKey);
      
      if (!serializedRecord) {
        console.log('No saved consent found in localStorage');
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
      
      return parsedRecord;
    } catch (error) {
      console.warn('Failed to load consent from localStorage:', error);
      return null;
    }
  }, [storageKey, isStorageAvailable]);
  const clearConsent = useCallback(() => {
    if (!isStorageAvailable) {
      console.warn('Storage is not available, cannot clear consent');
      return;
    }
    
    try {
      console.log(`Clearing consent from localStorage (key: ${storageKey})`);
      localStorage.removeItem(storageKey);
      console.log('Consent data cleared successfully');
    } catch (error) {
      console.error('Failed to clear consent from localStorage:', error);
    }
  }, [storageKey, isStorageAvailable]);

  return {
    saveConsent,
    loadConsent,
    clearConsent,
    isStorageAvailable
  };
}
