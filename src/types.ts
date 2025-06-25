// Privacy consent types
export type ConsentType = 'necessary' | 'analytics' | 'marketing' | 'preferences' | 'custom';
export type ConsentStatus = 'accepted' | 'rejected' | 'pending';
export type BannerPosition = 'top' | 'bottom' | 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type BannerLayout = 'banner' | 'modal' | 'inline' | 'corner-popup';

export interface ConsentCategory {
  id: string;
  name: string;
  description: string;
  type: ConsentType;
  required: boolean;
  defaultValue: boolean;
}

export interface ConsentDecision {
  categoryId: string;
  status: ConsentStatus;
  timestamp: Date;
  version: string;
}

export interface ConsentRecord {
  userId?: string;
  sessionId: string;
  decisions: ConsentDecision[];
  lastUpdated: Date;
  version: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface PrivacySettings {
  categories: ConsentCategory[];
  version: string;
  expirationDays: number;
  storageKey: string;
  showDeclineAll: boolean;
  showAcceptAll: boolean;
  showManagePreferences: boolean;
  autoShowDelay: number;
  respectDoNotTrack: boolean;
}

export interface BannerConfig {
  position: BannerPosition;
  layout: BannerLayout;
  showCloseButton: boolean;
  showCompanyLogo: boolean;
  blocking: boolean;
  animation: boolean;
  backdrop: boolean;
}

export interface ConsentTexts {
  title: string;
  description: string;
  acceptAllText: string;
  rejectAllText: string;
  managePreferencesText: string;
  savePreferencesText: string;
  closeText: string;
  learnMoreText: string;
  learnMoreUrl?: string;
  privacyPolicyUrl?: string;
  cookiePolicyUrl?: string;
  poweredByText?: string;
}

export interface ConsentTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderRadius: string;
  fontFamily: string;
  fontSize: string;
  buttonStyle: 'solid' | 'outlined' | 'ghost';
  shadow: boolean;
}

export interface PrivacyConsentConfig {
  settings: PrivacySettings;
  banner: BannerConfig;
  texts: ConsentTexts;
  theme?: ConsentTheme;
  onConsentChange?: (record: ConsentRecord) => void;
  onBannerShow?: () => void;
  onBannerHide?: () => void;
  onError?: (error: Error) => void;
}

// Context types
export interface ConsentContextType {
  isVisible: boolean;
  showBanner: () => void;
  hideBanner: () => void;
  showPreferences: () => void;
  hidePreferences: () => void;
  acceptAll: () => void;
  rejectAll: () => void;
  updateConsent: (categoryId: string, accepted: boolean) => void;
  getConsent: (categoryId: string) => ConsentStatus;
  getAllConsent: () => ConsentRecord | null;
  hasConsent: (categoryId: string) => boolean;
  resetConsent: () => void;
  isPreferencesVisible: boolean;
  consentRecord: ConsentRecord | null;
  config: PrivacyConsentConfig;
}

// Component props
export interface ConsentBannerProps {
  className?: string;
  style?: React.CSSProperties;
  onAcceptAll?: () => void;
  onRejectAll?: () => void;
  onManagePreferences?: () => void;
  children?: React.ReactNode;
}

export interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  style?: React.CSSProperties;
  showBackdrop?: boolean;
}

export interface ConsentCategoryProps {
  category: ConsentCategory;
  value: boolean;
  onChange: (accepted: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export interface ConsentButtonProps {
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface ConsentToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

// Hook return types
export interface UseConsentReturn extends ConsentContextType { }

export interface UseConsentStorageReturn {
  saveConsent: (record: ConsentRecord) => void;
  loadConsent: () => ConsentRecord | null;
  clearConsent: () => void;
  isStorageAvailable: boolean;
}

export interface UseConsentValidationReturn {
  validateRecord: (record: ConsentRecord) => boolean;
  validateCategory: (category: ConsentCategory) => boolean;
  validateConfig: (config: PrivacyConsentConfig) => boolean;
  errors: string[];
}

// Utility types
export type ConsentChangeHandler = (record: ConsentRecord) => void;
export type ConsentEventHandler = () => void;
export type ConsentErrorHandler = (error: Error) => void;
