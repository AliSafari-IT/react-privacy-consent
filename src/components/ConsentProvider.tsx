import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { 
  ConsentContextType, 
  PrivacyConsentConfig, 
  ConsentRecord, 
  ConsentDecision,
  ConsentStatus 
} from '../types';
import { useConsentStorage } from '../hooks/useConsentStorage';
import { generateSessionId, createConsentRecord } from '../utils/consentUtils';
import { applyConsentTheme } from '../utils/themeUtils';

export interface ConsentProviderProps {
  children: ReactNode;
  config: PrivacyConsentConfig;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export function ConsentProvider({ children, config }: ConsentProviderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPreferencesVisible, setIsPreferencesVisible] = useState(false);
  const [consentRecord, setConsentRecord] = useState<ConsentRecord | null>(null);
  const [sessionId] = useState(() => generateSessionId());
  
  const initialized = useRef(false);
  
  const { saveConsent, loadConsent, clearConsent } = useConsentStorage(config.settings.storageKey);
  
  // Initialize consent record
  useEffect(() => {
    console.log('[ConsentProvider] Initializing with storage key:', config.settings.storageKey);
    
    // Reset initialized flag when key dependencies change
    if (config.settings.version || config.settings.storageKey) {
      initialized.current = false;
    }
    
    if (initialized.current) {
      console.log('[ConsentProvider] Already initialized, skipping');
      return;
    }
    
    console.log('[ConsentProvider] useEffect triggered - initializing consent');
    console.log('[ConsentProvider] Config version:', config.settings.version);
    console.log('[ConsentProvider] Config categories:', config.settings.categories.map(c => c.id));
    
    const savedConsent = loadConsent();
    console.log('Loaded consent from storage:', savedConsent ? 'found' : 'not found');
    
    if (savedConsent && savedConsent.version === config.settings.version) {
      console.log('Consent version matches current version:', config.settings.version);
      
      // Check if consent is still valid
      const expirationDate = new Date(savedConsent.lastUpdated);
      expirationDate.setDate(expirationDate.getDate() + config.settings.expirationDays);
      
      if (expirationDate > new Date()) {
        console.log('Consent is not expired, valid until:', expirationDate);
        
        // Ensure all configured categories exist in the saved consent
        const allCategoriesPresent = config.settings.categories.every(category => 
          savedConsent.decisions.some(d => d.categoryId === category.id)
        );
        
        if (allCategoriesPresent) {
          // All categories found, use the saved consent
          console.log('[ConsentProvider] All categories present in saved consent, using it', savedConsent.decisions);
          console.log('[ConsentProvider] Setting consent record to:', savedConsent);
          setConsentRecord(savedConsent);
          // Ensure the record is saved with the current storage key
          saveConsent(savedConsent);
          console.log('[ConsentProvider] Consent record set successfully');
          initialized.current = true;
          return;
        } else {
          console.log('[ConsentProvider] Some categories missing in saved consent, merging with defaults');
          // Some categories are missing, merge with defaults
          const mergedDecisions: ConsentDecision[] = [...savedConsent.decisions];
          
          // Add any missing categories with their default values
          config.settings.categories.forEach(category => {
            const exists = savedConsent.decisions.some(d => d.categoryId === category.id);
            if (!exists) {
              mergedDecisions.push({
                categoryId: category.id,
                status: category.required ? 'accepted' : (category.defaultValue ? 'accepted' : 'rejected') as ConsentStatus,
                timestamp: new Date(),
                version: config.settings.version
              });
            }
          });
          
          // Create a new record with the merged decisions
          const mergedRecord = createConsentRecord(
            savedConsent.sessionId, 
            mergedDecisions, 
            config.settings.version
          );
          
          console.log('[ConsentProvider] Setting merged consent record:', mergedRecord);
          setConsentRecord(mergedRecord);
          saveConsent(mergedRecord);
          initialized.current = true;
          return;
        }
      } else {
        console.log('[ConsentProvider] Consent is expired, expired on:', expirationDate);
      }
    } else {
      console.log('[ConsentProvider] No valid consent found or version mismatch');
      if (savedConsent) {
        console.log('[ConsentProvider] Saved consent version:', savedConsent.version);
        console.log('[ConsentProvider] Expected version:', config.settings.version);
      }
    }
    
    // Create a default consent record when none is found
    // This ensures we always have a valid record with default values
    console.log('[ConsentProvider] Creating default consent record');
    const initialDecisions: ConsentDecision[] = config.settings.categories.map(category => ({
      categoryId: category.id,
      status: category.required ? 'accepted' : (category.defaultValue ? 'accepted' : 'rejected') as ConsentStatus,
      timestamp: new Date(),
      version: config.settings.version
    }));
    
    const defaultRecord = createConsentRecord(sessionId, initialDecisions, config.settings.version);
    console.log('[ConsentProvider] Setting initial default consent record:', defaultRecord);
    setConsentRecord(defaultRecord);
    
    // Save the default record to localStorage to ensure persistence
    console.log('[ConsentProvider] Saving default record to localStorage');
    saveConsent(defaultRecord);
    
    // Show banner if no valid consent found
    const showDelay = config.settings.autoShowDelay || 0;
    setTimeout(() => {
      if (!savedConsent || savedConsent.version !== config.settings.version) {
        console.log('[ConsentProvider] Showing consent banner');
        setIsVisible(true);
        config.onBannerShow?.();
      }
    }, showDelay);
    
    initialized.current = true;
  }, [config.settings.version, config.settings.storageKey, config.settings.categories, 
      config.settings.expirationDays, loadConsent, saveConsent, sessionId, config.onBannerShow]);

  // Apply theme
  useEffect(() => {
    if (config.theme) {
      applyConsentTheme(config.theme);
    }
  }, [config.theme]);

  // Respect Do Not Track
  useEffect(() => {
    if (config.settings.respectDoNotTrack && navigator.doNotTrack === '1') {
      const record = createConsentRecord(
        sessionId,
        config.settings.categories.map(cat => ({
          categoryId: cat.id,
          status: cat.required ? 'accepted' : 'rejected' as ConsentStatus,
          timestamp: new Date(),
          version: config.settings.version
        })),
        config.settings.version
      );
      setConsentRecord(record);
      saveConsent(record);
      setIsVisible(false);
    }
  }, [config.settings, sessionId, saveConsent]);

  const showBanner = useCallback(() => {
    setIsVisible(true);
    config.onBannerShow?.();
  }, [config]);

  const hideBanner = useCallback(() => {
    setIsVisible(false);
    config.onBannerHide?.();
  }, [config]);

  const showPreferences = useCallback(() => {
    setIsPreferencesVisible(true);
  }, []);

  const hidePreferences = useCallback(() => {
    setIsPreferencesVisible(false);
  }, []);

  const updateConsentRecord = useCallback((decisions: ConsentDecision[]) => {
    const record = createConsentRecord(sessionId, decisions, config.settings.version);
    setConsentRecord(record);
    saveConsent(record);
    config.onConsentChange?.(record);
    return record;
  }, [config, sessionId, saveConsent]);
  
  // Add updateConsent function for ConsentContextType
  const updateConsent = useCallback((categoryId: string, accepted: boolean) => {
    if (!consentRecord) return;
    
    const newDecisions = consentRecord.decisions.map((decision: ConsentDecision) => {
      if (decision.categoryId === categoryId) {
        return {
          ...decision,
          status: accepted ? 'accepted' : 'rejected' as ConsentStatus,
          timestamp: new Date()
        };
      }
      return decision;
    });
    
    updateConsentRecord(newDecisions);
  }, [consentRecord, updateConsentRecord]);
  
  // Add getAllConsent function for ConsentContextType
  const getAllConsent = useCallback(() => {
    return consentRecord;
  }, [consentRecord]);
  
  // Define getConsent before it's used in hasConsent
  const getConsent = useCallback((categoryId: string): boolean => {
    if (!consentRecord) return false;
    
    const decision = consentRecord.decisions.find((d: ConsentDecision) => d.categoryId === categoryId);
    return decision ? decision.status === 'accepted' : false;
  }, [consentRecord]);
  
  // Add hasConsent function for ConsentContextType
  const hasConsent = useCallback((categoryId: string): boolean => {
    return getConsent(categoryId);
  }, [getConsent]);

  const acceptAll = useCallback(() => {
    const decisions = config.settings.categories.map(category => ({
      categoryId: category.id,
      status: 'accepted' as ConsentStatus,
      timestamp: new Date(),
      version: config.settings.version
    }));
    
    const record = updateConsentRecord(decisions);
    hideBanner();
    return record;
  }, [config.settings.categories, config.settings.version, hideBanner, updateConsentRecord]);

  const rejectAll = useCallback(() => {
    const decisions = config.settings.categories.map(category => ({
      categoryId: category.id,
      status: category.required ? 'accepted' : 'rejected' as ConsentStatus,
      timestamp: new Date(),
      version: config.settings.version
    }));
    
    const record = updateConsentRecord(decisions);
    hideBanner();
    return record;
  }, [config.settings.categories, config.settings.version, hideBanner, updateConsentRecord]);



  const resetConsent = useCallback(() => {
    console.log('Resetting consent to default state');
    
    // Clear consent from storage
    clearConsent();
    
    // Create a new default record
    const decisions = config.settings.categories.map(category => ({
      categoryId: category.id,
      status: category.required ? 'accepted' : (category.defaultValue ? 'accepted' : 'rejected') as ConsentStatus,
      timestamp: new Date(),
      version: config.settings.version
    }));
    
    const record = createConsentRecord(sessionId, decisions, config.settings.version);
    setConsentRecord(record);
    saveConsent(record);
    
    // Show the banner again
    setIsVisible(true);
    config.onBannerShow?.();
    
    return record;
  }, [clearConsent, config, sessionId, saveConsent]);

  // Fix the getConsent type to match ConsentContextType
  const getConsentStatus = useCallback((categoryId: string): ConsentStatus => {
    if (!consentRecord) return 'pending';
    
    const decision = consentRecord.decisions.find((d: ConsentDecision) => d.categoryId === categoryId);
    return decision ? decision.status : 'pending';
  }, [consentRecord]);
  
  const contextValue: ConsentContextType = {
    isVisible,
    isPreferencesVisible,
    consentRecord,
    showBanner,
    hideBanner,
    showPreferences,
    hidePreferences,
    acceptAll,
    rejectAll,
    getConsent: getConsentStatus, // Use the correctly typed function
    resetConsent,
    // Add missing properties required by ConsentContextType
    updateConsent,
    getAllConsent,
    hasConsent,
    config
  };

  return (
    <ConsentContext.Provider key={sessionId} value={contextValue}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsentContext(): ConsentContextType {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error('useConsentContext must be used within a ConsentProvider');
  }
  return context;
}
