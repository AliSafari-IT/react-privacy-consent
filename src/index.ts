// Main exports
export { ConsentProvider, useConsentContext } from './components/ConsentProvider';
export { ConsentBanner } from './components/ConsentBanner';
export { ConsentModal } from './components/ConsentModal';
export { ConsentCategory } from './components/ConsentCategory';
export { ConsentToggle } from './components/ConsentToggle';

// Hooks
export { useConsent } from './hooks/useConsent';
export { useConsentStorage } from './hooks/useConsentStorage';

// Utilities
export { 
  generateSessionId, 
  createConsentRecord, 
  isValidConsentRecord,
  getConsentValue,
  mergeConsentDecisions,
  hasExpiredConsent,
  sanitizeConsentRecord
} from './utils/consentUtils';

export { 
  applyConsentTheme, 
  removeConsentTheme, 
  getDefaultTheme, 
  getDarkTheme 
} from './utils/themeUtils';

// Types
export type {
  ConsentType,
  ConsentStatus,
  BannerPosition,
  BannerLayout,
  ConsentCategory as ConsentCategoryType,
  ConsentDecision,
  ConsentRecord,
  PrivacySettings,
  BannerConfig,
  ConsentTexts,
  ConsentTheme,
  PrivacyConsentConfig,
  ConsentContextType,
  ConsentBannerProps,
  ConsentModalProps,
  ConsentCategoryProps,
  ConsentButtonProps,
  ConsentToggleProps,
  UseConsentReturn,
  UseConsentStorageReturn,
  UseConsentValidationReturn,
  ConsentChangeHandler,
  ConsentEventHandler,
  ConsentErrorHandler
} from './types';

// Import types for internal use
import type {
  PrivacySettings,
  BannerConfig,
  ConsentTexts,
  PrivacyConsentConfig
} from './types';

// Default configurations
export const defaultPrivacySettings: PrivacySettings = {
  categories: [
    {
      id: 'necessary',
      name: 'Necessary',
      description: 'Essential cookies required for basic website functionality.',
      type: 'necessary',
      required: true,
      defaultValue: true
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Cookies that help us understand how visitors interact with our website.',
      type: 'analytics',
      required: false,
      defaultValue: false
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'Cookies used to deliver personalized advertisements.',
      type: 'marketing',
      required: false,
      defaultValue: false
    },
    {
      id: 'preferences',
      name: 'Preferences',
      description: 'Cookies that remember your preferences and settings.',
      type: 'preferences',
      required: false,
      defaultValue: false
    }
  ],
  version: '1.0.0',
  expirationDays: 365,
  storageKey: 'asafarim-privacy-consent',
  showDeclineAll: true,
  showAcceptAll: true,
  showManagePreferences: true,
  autoShowDelay: 1000,
  respectDoNotTrack: true
};

export const defaultBannerConfig: BannerConfig = {
  position: 'bottom',
  layout: 'banner',
  showCloseButton: true,
  showCompanyLogo: false,
  blocking: false,
  animation: true,
  backdrop: false
};

export const defaultConsentTexts: ConsentTexts = {
  title: 'We value your privacy',
  description: 'We use cookies and similar technologies to provide the best experience on our website. Some are necessary for functionality, while others help us understand usage and improve our services.',
  acceptAllText: 'Accept All',
  rejectAllText: 'Reject All',
  managePreferencesText: 'Manage Preferences',
  savePreferencesText: 'Save Preferences',
  closeText: 'Close',
  learnMoreText: 'Learn More',
  poweredByText: 'Powered by @asafarim/react-privacy-consent'
};

export const defaultPrivacyConsentConfig: PrivacyConsentConfig = {
  settings: defaultPrivacySettings,
  banner: defaultBannerConfig,
  texts: defaultConsentTexts
};
