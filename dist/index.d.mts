import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

type ConsentType = 'necessary' | 'analytics' | 'marketing' | 'preferences' | 'custom';
type ConsentStatus = 'accepted' | 'rejected' | 'pending';
type BannerPosition = 'top' | 'bottom' | 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
type BannerLayout = 'banner' | 'modal' | 'inline' | 'corner-popup';
interface ConsentCategory$1 {
    id: string;
    name: string;
    description: string;
    type: ConsentType;
    required: boolean;
    defaultValue: boolean;
}
interface ConsentDecision {
    categoryId: string;
    status: ConsentStatus;
    timestamp: Date;
    version: string;
}
interface ConsentRecord {
    userId?: string;
    sessionId: string;
    decisions: ConsentDecision[];
    lastUpdated: Date;
    version: string;
    ipAddress?: string;
    userAgent?: string;
}
interface PrivacySettings {
    categories: ConsentCategory$1[];
    version: string;
    expirationDays: number;
    storageKey: string;
    showDeclineAll: boolean;
    showAcceptAll: boolean;
    showManagePreferences: boolean;
    autoShowDelay: number;
    respectDoNotTrack: boolean;
}
interface BannerConfig {
    position: BannerPosition;
    layout: BannerLayout;
    showCloseButton: boolean;
    showCompanyLogo: boolean;
    blocking: boolean;
    animation: boolean;
    backdrop: boolean;
}
interface ConsentTexts {
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
interface ConsentTheme {
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
interface PrivacyConsentConfig {
    settings: PrivacySettings;
    banner: BannerConfig;
    texts: ConsentTexts;
    theme?: ConsentTheme;
    onConsentChange?: (record: ConsentRecord) => void;
    onBannerShow?: () => void;
    onBannerHide?: () => void;
    onError?: (error: Error) => void;
}
interface ConsentContextType {
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
interface ConsentBannerProps {
    className?: string;
    style?: React.CSSProperties;
    onAcceptAll?: () => void;
    onRejectAll?: () => void;
    onManagePreferences?: () => void;
    children?: React.ReactNode;
}
interface ConsentModalProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    style?: React.CSSProperties;
    showBackdrop?: boolean;
}
interface ConsentCategoryProps {
    category: ConsentCategory$1;
    value: boolean;
    onChange: (accepted: boolean) => void;
    disabled?: boolean;
    className?: string;
}
interface ConsentButtonProps {
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
interface ConsentToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    label?: string;
}
interface UseConsentReturn extends ConsentContextType {
}
interface UseConsentStorageReturn {
    saveConsent: (record: ConsentRecord) => void;
    loadConsent: () => ConsentRecord | null;
    clearConsent: () => void;
    isStorageAvailable: boolean;
}
interface UseConsentValidationReturn {
    validateRecord: (record: ConsentRecord) => boolean;
    validateCategory: (category: ConsentCategory$1) => boolean;
    validateConfig: (config: PrivacyConsentConfig) => boolean;
    errors: string[];
}
type ConsentChangeHandler = (record: ConsentRecord) => void;
type ConsentEventHandler = () => void;
type ConsentErrorHandler = (error: Error) => void;

interface ConsentProviderProps {
    children: ReactNode;
    config: PrivacyConsentConfig;
}
declare function ConsentProvider({ children, config }: ConsentProviderProps): react_jsx_runtime.JSX.Element;
declare function useConsentContext(): ConsentContextType;

declare function ConsentBanner({ className, style, onAcceptAll, onRejectAll, onManagePreferences, children }: ConsentBannerProps): react_jsx_runtime.JSX.Element | null;

declare function ConsentModal({ isOpen, onClose, className, style, showBackdrop }: ConsentModalProps): react_jsx_runtime.JSX.Element | null;

declare function ConsentCategory({ category, value, onChange, disabled, className }: ConsentCategoryProps): react_jsx_runtime.JSX.Element;

declare function ConsentToggle({ checked, onChange, disabled, size, className, label }: ConsentToggleProps): react_jsx_runtime.JSX.Element;

/**
 * Hook to access privacy consent functionality
 * Must be used within a ConsentProvider
 */
declare function useConsent(): UseConsentReturn;

declare function useConsentStorage(storageKey: string): UseConsentStorageReturn;

declare function generateSessionId(): string;
declare function createConsentRecord(sessionId: string, decisions: ConsentDecision[], version: string, userId?: string): ConsentRecord;
declare function isValidConsentRecord(record: ConsentRecord, currentVersion: string): boolean;
declare function getConsentValue(record: ConsentRecord | null, categoryId: string): boolean;
declare function mergeConsentDecisions(existing: ConsentDecision[], updates: ConsentDecision[]): ConsentDecision[];
declare function hasExpiredConsent(record: ConsentRecord, expirationDays: number): boolean;
declare function sanitizeConsentRecord(record: ConsentRecord): ConsentRecord;

declare function applyConsentTheme(theme: ConsentTheme): void;
declare function removeConsentTheme(): void;
declare function getDefaultTheme(): ConsentTheme;
declare function getDarkTheme(): ConsentTheme;

declare const defaultPrivacySettings: PrivacySettings;
declare const defaultBannerConfig: BannerConfig;
declare const defaultConsentTexts: ConsentTexts;
declare const defaultPrivacyConsentConfig: PrivacyConsentConfig;

export { type BannerConfig, type BannerLayout, type BannerPosition, ConsentBanner, type ConsentBannerProps, type ConsentButtonProps, ConsentCategory, type ConsentCategoryProps, type ConsentCategory$1 as ConsentCategoryType, type ConsentChangeHandler, type ConsentContextType, type ConsentDecision, type ConsentErrorHandler, type ConsentEventHandler, ConsentModal, type ConsentModalProps, ConsentProvider, type ConsentRecord, type ConsentStatus, type ConsentTexts, type ConsentTheme, ConsentToggle, type ConsentToggleProps, type ConsentType, type PrivacyConsentConfig, type PrivacySettings, type UseConsentReturn, type UseConsentStorageReturn, type UseConsentValidationReturn, applyConsentTheme, createConsentRecord, defaultBannerConfig, defaultConsentTexts, defaultPrivacyConsentConfig, defaultPrivacySettings, generateSessionId, getConsentValue, getDarkTheme, getDefaultTheme, hasExpiredConsent, isValidConsentRecord, mergeConsentDecisions, removeConsentTheme, sanitizeConsentRecord, useConsent, useConsentContext, useConsentStorage };
