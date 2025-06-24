import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
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
  
  const { saveConsent, loadConsent, clearConsent } = useConsentStorage(config.settings.storageKey);

  // Initialize consent record
  useEffect(() => {
    const savedConsent = loadConsent();
    
    if (savedConsent && savedConsent.version === config.settings.version) {
      // Check if consent is still valid
      const expirationDate = new Date(savedConsent.lastUpdated);
      expirationDate.setDate(expirationDate.getDate() + config.settings.expirationDays);
      
      if (expirationDate > new Date()) {
        setConsentRecord(savedConsent);
        return;
      }
    }
    
    // Show banner if no valid consent found
    const showDelay = config.settings.autoShowDelay || 0;
    setTimeout(() => {
      if (!savedConsent || savedConsent.version !== config.settings.version) {
        setIsVisible(true);
        config.onBannerShow?.();
      }
    }, showDelay);
  }, [config, loadConsent]);

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
  }, [config, updateConsentRecord]);

  const updateConsent = useCallback((categoryId: string, accepted: boolean) => {
    if (!consentRecord) return;
    
    const existingDecisions = consentRecord.decisions.filter((d: ConsentDecision) => d.categoryId !== categoryId);
    const newDecision: ConsentDecision = {
      categoryId,
      status: accepted ? 'accepted' : 'rejected',
      timestamp: new Date(),
      version: config.settings.version
    };
    
    updateConsentRecord([...existingDecisions, newDecision]);
  }, [consentRecord, config.settings.version, updateConsentRecord]);

  const getConsent = useCallback((categoryId: string): ConsentStatus => {
    if (!consentRecord) return 'pending';
    
    const decision = consentRecord.decisions.find((d: ConsentDecision) => d.categoryId === categoryId);
    return decision?.status || 'pending';
  }, [consentRecord]);

  const getAllConsent = useCallback(() => {
    return consentRecord;
  }, [consentRecord]);

  const hasConsent = useCallback((categoryId: string): boolean => {
    return getConsent(categoryId) === 'accepted';
  }, [getConsent]);

  const resetConsent = useCallback(() => {
    clearConsent();
    setConsentRecord(null);
    setIsVisible(true);
    setIsPreferencesVisible(false);
    config.onBannerShow?.();
  }, [clearConsent, config]);

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
