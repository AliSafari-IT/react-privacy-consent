import { useState, useEffect } from 'react'
import { 
  ConsentProvider, 
  ConsentBanner, 
  ConsentModal, 
  useConsent,
  type PrivacyConsentConfig,
  type ConsentCategory,
  applyConsentTheme,
  getDarkTheme
} from '../../src/index'
import { useTheme, ThemeToggle } from '@asafarim/react-themes'
import '../../src/styles.css'

// Demo configuration for the privacy consent system
const demoConfig: PrivacyConsentConfig = {
  settings: {
    version: '1.6.0', // Increment version to reset any corrupted storage
    storageKey: 'asafarim-demo-privacy-consent-v2', // Use unique storage key with version to ensure persistence
    expirationDays: 365,
    autoShowDelay: 1000,
    showDeclineAll: true,
    showAcceptAll: true,
    showManagePreferences: true,
    respectDoNotTrack: true,
    categories: [
      {
        id: 'necessary',
        name: 'Necessary Cookies',
        description: 'Essential cookies required for basic website functionality. These cannot be disabled.',
        type: 'necessary' as const,
        required: true,
        defaultValue: true
      },
      {
        id: 'analytics',
        name: 'Analytics & Performance',
        description: 'Help us understand how visitors interact with our website by collecting anonymous information.',
        type: 'analytics' as const,
        required: false,
        defaultValue: false
      },
      {
        id: 'marketing',
        name: 'Marketing & Advertising',
        description: 'Used to deliver personalized advertisements and measure campaign effectiveness.',
        type: 'marketing' as const,
        required: false,
        defaultValue: false
      },
      {
        id: 'preferences',
        name: 'Preferences',
        description: 'Remember your settings and preferences for a better user experience.',
        type: 'preferences' as const,
        required: false,
        defaultValue: false
      }
    ]
  },
  banner: {
    position: 'bottom',
    layout: 'banner',
    showCloseButton: true,
    showCompanyLogo: false,
    blocking: false,
    animation: true,
    backdrop: false
  },
  texts: {
    title: 'We value your privacy',
    description: 'We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies.',
    acceptAllText: 'Accept All',
    rejectAllText: 'Reject All',
    managePreferencesText: 'Manage Preferences',
    savePreferencesText: 'Save Preferences',
    closeText: 'Close',
    learnMoreText: 'Learn More',
    learnMoreUrl: 'https://asafarim.com/legal-docs/terms-of-service',
    privacyPolicyUrl: 'https://asafarim.com/legal-docs/privacy-policy',
    cookiePolicyUrl: 'https://asafarim.com/legal-docs/cookie-policy'
  },
  onConsentChange: (consent) => {
    console.log('Consent changed:', consent);
  },
  onBannerShow: () => {
    console.log('Banner shown');
  },
  onBannerHide: () => {
    console.log('Banner hidden');
  },
  onError: (error) => {
    console.error('Privacy consent error:', error);
  }
};

function DemoContent() {
  const { 
    consentRecord, 
    isVisible, 
    showPreferences, 
    resetConsent, 
    acceptAll, 
    rejectAll,
    getConsent,
    hasConsent 
  } = useConsent();
  const { mode, currentTheme } = useTheme();

  // Debug: Log consent record changes
  useEffect(() => {
    console.log('[Demo] Consent record updated:', consentRecord);
    if (consentRecord) {
      console.log('[Demo] Current consent decisions:', consentRecord.decisions);
      consentRecord.decisions.forEach(decision => {
        console.log(`[Demo] Category ${decision.categoryId}: ${decision.status} (timestamp: ${decision.timestamp})`);
      });
    }
  }, [consentRecord]);

  useEffect(() => {
    console.log('[Demo] Theme mode changed to:', mode);
    console.log('[Demo] Current theme object:', currentTheme);
    
    // Handle all possible theme modes including 'auto'
    const isDark = mode === 'dark' || (mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      console.log('[Demo] Applying dark theme to consent components');
      applyConsentTheme({
        primaryColor: 'var(--primary-600, #dc2626)',
        secondaryColor: 'var(--primary-700, #b91c1c)',
        backgroundColor: 'var(--gray-900, #111827)',
        textColor: 'var(--gray-100, #f3f4f6)',
        borderColor: 'var(--gray-700, #374151)',
        borderRadius: '8px',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '14px',
        buttonStyle: 'solid',
        shadow: true
      });
    } else {
      console.log('[Demo] Applying light theme to consent components');
      applyConsentTheme({
        primaryColor: 'var(--primary-600, #2563eb)',
        secondaryColor: 'var(--primary-700, #1d4ed8)',
        backgroundColor: 'var(--gray-50, #f9fafb)',
        textColor: 'var(--gray-900, #111827)',
        borderColor: 'var(--gray-200, #e5e7eb)',
        borderRadius: '8px',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '14px',
        buttonStyle: 'solid',
        shadow: true
      });
    }
  }, [mode, currentTheme]);

  const getConsentStatusDisplay = (categoryId: string) => {
    const status = getConsent(categoryId);
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="demo-container">
      <h1>React Privacy Consent Demo</h1>
      
      {/* Theme Controls */}
      <div className="demo-section">
        <h2>Theme Controls</h2>
        <div className="demo-controls">
          <ThemeToggle />
          <div style={{ marginLeft: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
            <strong>Current Theme Mode:</strong> {mode}
            <br />
            <strong>Is Dark:</strong> {mode === 'dark' || (mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'Yes' : 'No'}
          </div>
        </div>
      </div>

      {/* Consent Controls */}
      <div className="demo-section">
        <h2>Consent Controls</h2>
        <div className="demo-controls">
          <button onClick={() => showPreferences()}>
            🛠️ Manage Preferences
          </button>
          <button onClick={acceptAll}>
            ✅ Accept All
          </button>
          <button onClick={rejectAll}>
            ❌ Reject All
          </button>
          <button onClick={resetConsent}>
            🔄 Reset Consent
          </button>
        </div>
      </div>

      {/* Current Consent Status */}
      <div className="demo-section">
        <h2>Current Consent Status</h2>
        {consentRecord ? (
          <div className="consent-status">
            <p><strong>Session ID:</strong> {consentRecord.sessionId}</p>
            <p><strong>Version:</strong> {consentRecord.version}</p>
            <p><strong>Last Updated:</strong> {new Date(consentRecord.lastUpdated).toLocaleString()}</p>
            
            <h3>Categories:</h3>
            {demoConfig.settings.categories.map((category) => (
              <div key={category.id} className="consent-category">
                <div>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  {category.required && <small><em>Required</em></small>}
                </div>
                <span className={`status-badge status-${getConsent(category.id)}`}>
                  {getConsentStatusDisplay(category.id)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p>No consent record available</p>
        )}
      </div>

      {/* Banner Status */}
      <div className="demo-section">
        <h2>Banner Status</h2>
        <p>Banner is currently: <strong>{isVisible ? 'Visible' : 'Hidden'}</strong></p>
        {!isVisible && (
          <p><em>The banner will show automatically when consent is reset or on first visit.</em></p>
        )}
      </div>

      {/* Integration Guide */}
      <div className="demo-section">
        <h2>Integration Guide</h2>
        <div style={{ textAlign: 'left' }}>
          <h3>1. Install the Package</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
            npm install @asafarim/react-privacy-consent
          </pre>

          <h3>2. Basic Usage</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
{`import { ConsentProvider, ConsentBanner, ConsentModal } from '@asafarim/react-privacy-consent';
import '@asafarim/react-privacy-consent/styles.css';

function App() {
  return (
    <ConsentProvider config={yourConfig}>
      <YourAppContent />
      <ConsentBanner />
      <ConsentModal />
    </ConsentProvider>
  );
}`}
          </pre>

          <h3>3. Use Consent Data</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
{`import { useConsent } from '@asafarim/react-privacy-consent';

function YourComponent() {
  const { hasConsent, getConsent } = useConsent();
  
  if (hasConsent('analytics')) {
    // Load analytics scripts
  }
  
  return <div>Your content</div>;
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}

function ConsentModalWrapper() {
  const { isPreferencesVisible, hidePreferences } = useConsent();
  
  return (
    <ConsentModal 
      isOpen={isPreferencesVisible} 
      onClose={hidePreferences}
    />
  );
}

function App() {
  return (
    <ConsentProvider config={demoConfig}>
      <DemoContent />
      <ConsentBanner />
      <ConsentModalWrapper />
    </ConsentProvider>
  );
}

export default App
