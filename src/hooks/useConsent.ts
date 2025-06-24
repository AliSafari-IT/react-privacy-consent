import { useConsentContext } from '../components/ConsentProvider';
import { UseConsentReturn } from '../types';

/**
 * Hook to access privacy consent functionality
 * Must be used within a ConsentProvider
 */
export function useConsent(): UseConsentReturn {
  return useConsentContext();
}
