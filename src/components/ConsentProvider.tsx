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
  
  const { saveConsent, loadConsent, clearConsent } = useConsentStorage(config.settings.storageKey);  // Initialize consent record
  useEffect(() => {
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
          console.log('[ConsentProvider] Consent record set successfully, returning early');
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
  }, []); // Remove dependencies to prevent re-initialization

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
  }, [sessionId, config, saveConsent]);

  const acceptAll = useCallback(() => {
    const decisions: ConsentDecision[] = config.settings.categories.map(category => ({
      categoryId: category.id,
      status: 'accepted' as ConsentStatus,
      timestamp: new Date(),
      version: config.settings.version
    }));
    
    updateConsentRecord(decisions);
    setIsVisible(false);
    setIsPreferencesVisible(false);
    config.onBannerHide?.();
  }, [config, updateConsentRecord]);

  const rejectAll = useCallback(() => {
    const decisions: ConsentDecision[] = config.settings.categories.map(category => ({
      categoryId: category.id,
      status: category.required ? 'accepted' : 'rejected' as ConsentStatus,
      timestamp: new Date(),
      version: config.settings.version
    }));
    
    updateConsentRecord(decisions);
    setIsVisible(false);
    setIsPreferencesVisible(false);
    config.onBannerHide?.();
  }, [config, updateConsentRecord]);  const updateConsent = useCallback((categoryId: string, accepted: boolean) => {
    console.log(`Updating consent for category ${categoryId} to ${accepted ? 'accepted' : 'rejected'}`);
    
    // Create initial decisions from default values if no consent record exists
    let currentDecisions;
    
    if (consentRecord && Array.isArray(consentRecord.decisions)) {
      console.log('Using existing consent record decisions');
      currentDecisions = [...consentRecord.decisions];
    } else {
      console.log('No existing consent record, creating default decisions');
      currentDecisions = config.settings.categories.map(category => ({
        categoryId: category.id,
        status: category.defaultValue ? 'accepted' : 'rejected' as ConsentStatus,
        timestamp: new Date(),
        version: config.settings.version
      }));
    }
    
    // Filter out the category we're updating
    const existingDecisions = currentDecisions.filter((d: ConsentDecision) => d.categoryId !== categoryId);
    
    // Create the new decision
    const newDecision: ConsentDecision = {
      categoryId,
      status: accepted ? 'accepted' : 'rejected' as ConsentStatus,
      timestamp: new Date(),
      version: config.settings.version
    };
    
    // Combine all decisions
    const allDecisions = [...existingDecisions, newDecision];
    console.log('Updated decisions:', 
      allDecisions.map((d: ConsentDecision) => `${d.categoryId}: ${d.status}`).join(', '));
    
    // Save the updated consent record using updateConsentRecord which handles storage
    const updatedRecord = updateConsentRecord(allDecisions);
    
    return updatedRecord;
  }, [consentRecord, config.settings.version, config.settings.categories, updateConsentRecord, saveConsent]);
  const getConsent = useCallback((categoryId: string): ConsentStatus => {
    if (!consentRecord) {
      // If no consent record exists, use default values
      const category = config.settings.categories.find(c => c.id === categoryId);
      return category?.defaultValue ? 'accepted' : 'pending';
    }
    
    const decision = consentRecord.decisions.find((d: ConsentDecision) => d.categoryId === categoryId);
    if (decision) {
      return decision.status;
    }
    
    // If no decision found, use default value
    const category = config.settings.categories.find(c => c.id === categoryId);
    return category?.defaultValue ? 'accepted' : 'pending';
  }, [consentRecord, config.settings.categories]);

  const getAllConsent = useCallback(() => {
    return consentRecord;
  }, [consentRecord]);

  const hasConsent = useCallback((categoryId: string): boolean => {
    return getConsent(categoryId) === 'accepted';
  }, [getConsent]);  const resetConsent = useCallback(() => {
    console.log('Resetting consent to default state');
    
    // Clear consent from storage
    clearConsent();
    
    // Create initial decisions based on defaults
    const initialDecisions: ConsentDecision[] = config.settings.categories.map(category => ({
      categoryId: category.id,
      status: category.required ? 'accepted' : (category.defaultValue ? 'accepted' : 'rejected') as ConsentStatus,
      timestamp: new Date(),
      version: config.settings.version
    }));
    
    console.log('Initial decisions after reset:', 
      initialDecisions.map(d => `${d.categoryId}: ${d.status}`).join(', '));
    
    // Create a new consent record but DON'T save it to storage yet
    // We want the user to explicitly accept or reject cookies
    // We'll reuse the existing sessionId to maintain consistency
    const record = createConsentRecord(sessionId, initialDecisions, config.settings.version);
    
    // Update the state with new session ID and defaults
    setConsentRecord(record);
    
    // Show the banner and hide preferences
    setIsVisible(true);
    setIsPreferencesVisible(false);
    
    // Trigger the callback
    config.onBannerShow?.();
    
    console.log('Consent reset complete, banner shown, waiting for user action');
  }, [clearConsent, config, config.settings.categories, config.settings.version]);

  const contextValue: ConsentContextType = {
    isVisible,
    showBanner,
    hideBanner,
    showPreferences,
    hidePreferences,
    acceptAll,
    rejectAll,
    updateConsent,
    getConsent,
    getAllConsent,
    hasConsent,
    resetConsent,
    isPreferencesVisible,
    consentRecord,
    config
  };

  return (
    <ConsentContext.Provider value={contextValue}>
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
