# @asafarim/react-privacy-consent

A comprehensive React TypeScript package for GDPR/CCPA privacy consent management with customizable UI components, automatic compliance handling, and modern accessibility features.

![npm version](https://img.shields.io/npm/v/@asafarim/react-privacy-consent)
![license](https://img.shields.io/npm/l/@asafarim/react-privacy-consent)
![typescript](https://img.shields.io/badge/TypeScript-Ready-blue)

## 📸 Preview

See the privacy consent system in action:

**[Live Interactive Demo](https://bibliography.asafarim.com/privacy-consent/demo)**

## ✨ Features

### 🏛️ **Compliance & Legal**
- **GDPR Compliant**: Full EU General Data Protection Regulation support
- **CCPA Ready**: California Consumer Privacy Act compliance
- **Consent Records**: Detailed tracking with timestamps and versioning
- **Legal Documentation**: Built-in support for privacy policy and cookie policy links
- **Do Not Track**: Automatic respect for browser DNT settings

### 🎨 **User Experience**
- **Multiple Layouts**: Banner, modal, inline, and corner popup options
- **Flexible Positioning**: Top, bottom, center, or corner placement
- **Smooth Animations**: Beautiful transitions with reduced motion support
- **Mobile Optimized**: Touch-friendly controls and responsive design
- **Dark Mode**: Automatic theme detection and customization

### 🔧 **Developer Experience**
- **TypeScript First**: Comprehensive type definitions and IntelliSense support
- **React 18+ Ready**: Optimized for latest React features
- **Flexible API**: Easy integration with existing projects
- **Custom Themes**: Full control over colors, typography, and styling
- **Event Callbacks**: Comprehensive event handling and analytics integration

### ♿ **Accessibility**
- **WCAG 2.1 AA**: Web Content Accessibility Guidelines compliant
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Readers**: Proper ARIA labels and announcements
- **High Contrast**: Automatic high contrast mode support
- **Focus Management**: Logical tab order and focus indicators

### 🛡️ **Privacy & Security**
- **Local Storage**: Secure local consent storage
- **Version Control**: Automatic consent version management
- **Expiration Handling**: Configurable consent expiration
- **Data Minimization**: Only essential data collection
- **Secure by Default**: Privacy-first approach

## 📦 Installation

```bash
npm install @asafarim/react-privacy-consent
# or
yarn add @asafarim/react-privacy-consent
# or
pnpm add @asafarim/react-privacy-consent
```

## 🚀 Quick Start

### 1. Wrap your app with ConsentProvider

```tsx
import React from 'react';
import { 
  ConsentProvider, 
  defaultPrivacyConsentConfig 
} from '@asafarim/react-privacy-consent';
import '@asafarim/react-privacy-consent/styles.css';

function App() {
  return (
    <ConsentProvider config={defaultPrivacyConsentConfig}>
      <YourAppContent />
    </ConsentProvider>
  );
}
```

### 2. Add the consent banner and modal

```tsx
import React from 'react';
import { 
  ConsentBanner, 
  ConsentModal, 
  useConsent 
} from '@asafarim/react-privacy-consent';

function ConsentManager() {
  const { isPreferencesVisible, hidePreferences } = useConsent();

  return (
    <>
      <ConsentBanner />
      <ConsentModal 
        isOpen={isPreferencesVisible} 
        onClose={hidePreferences} 
      />
    </>
  );
}
```

### 3. Check consent in your components

```tsx
import React, { useEffect } from 'react';
import { useConsent } from '@asafarim/react-privacy-consent';

function AnalyticsComponent() {
  const { hasConsent, consentRecord } = useConsent();

  useEffect(() => {
    if (hasConsent('analytics')) {
      // Initialize analytics
      console.log('Analytics consent granted');
    }
  }, [hasConsent]);

  return (
    <div>
      Analytics Status: {hasConsent('analytics') ? 'Enabled' : 'Disabled'}
    </div>
  );
}
```

## 🎯 Real-World Examples

### 📊 **E-commerce Integration**

```tsx
import { ConsentProvider, useConsent } from '@asafarim/react-privacy-consent';

const ecommerceConfig = {
  settings: {
    categories: [
      {
        id: 'necessary',
        name: 'Essential',
        description: 'Required for shopping cart and checkout functionality.',
        type: 'necessary',
        required: true,
        defaultValue: true
      },
      {
        id: 'analytics',
        name: 'Analytics',
        description: 'Help us understand shopping patterns and improve our store.',
        type: 'analytics',
        required: false,
        defaultValue: false
      },
      {
        id: 'marketing',
        name: 'Marketing',
        description: 'Personalized product recommendations and promotional offers.',
        type: 'marketing',
        required: false,
        defaultValue: false
      }
    ],
    version: '2.0.0',
    expirationDays: 365,
    storageKey: 'ecommerce-consent'
  },
  banner: {
    position: 'bottom',
    layout: 'banner',
    animation: true
  },
  texts: {
    title: 'Your Privacy Matters',
    description: 'We use cookies to enhance your shopping experience, provide personalized recommendations, and analyze our traffic.',
    privacyPolicyUrl: '/privacy-policy',
    cookiePolicyUrl: '/cookie-policy'
  }
};

function EcommerceApp() {
  return (
    <ConsentProvider config={ecommerceConfig}>
      <ProductRecommendations />
      <AnalyticsDashboard />
    </ConsentProvider>
  );
}

function ProductRecommendations() {
  const { hasConsent } = useConsent();
  
  if (!hasConsent('marketing')) {
    return <div>Enable marketing cookies for personalized recommendations</div>;
  }
  
  return <PersonalizedProducts />;
}
```

### 🏢 **SaaS Dashboard**

```tsx
const saasConfig = {
  settings: {
    categories: [
      {
        id: 'necessary',
        name: 'Necessary',
        description: 'Essential for platform functionality and security.',
        type: 'necessary',
        required: true,
        defaultValue: true
      },
      {
        id: 'analytics',
        name: 'Usage Analytics',
        description: 'Help us improve the platform based on usage patterns.',
        type: 'analytics',
        required: false,
        defaultValue: true
      },
      {
        id: 'preferences',
        name: 'User Preferences',
        description: 'Remember your dashboard layout and settings.',
        type: 'preferences',
        required: false,
        defaultValue: true
      }
    ],
    autoShowDelay: 2000,
    respectDoNotTrack: true
  },
  banner: {
    position: 'top-right',
    layout: 'corner-popup',
    showCloseButton: true
  },
  onConsentChange: (record) => {
    // Send consent data to analytics
    analytics.track('consent_updated', {
      categories: record.decisions.map(d => d.categoryId),
      timestamp: record.lastUpdated
    });
  }
};
```

## 📖 API Reference

### 🏗️ ConsentProvider

```tsx
interface ConsentProviderProps {
  children: ReactNode;
  config: PrivacyConsentConfig;
}
```

### 🪝 useConsent Hook

```tsx
const {
  // Visibility controls
  isVisible,                    // Banner visibility
  showBanner,                   // Show banner manually
  hideBanner,                   // Hide banner
  isPreferencesVisible,         // Preferences modal visibility
  showPreferences,              // Show preferences modal
  hidePreferences,              // Hide preferences modal
  
  // Consent actions
  acceptAll,                    // Accept all categories
  rejectAll,                    // Reject non-required categories
  updateConsent,                // Update specific category
  resetConsent,                 // Clear all consent data
  
  // Consent queries
  getConsent,                   // Get consent status for category
  getAllConsent,                // Get complete consent record
  hasConsent,                   // Check if category is accepted
  
  // Data
  consentRecord,                // Current consent record
  config                        // Configuration object
} = useConsent();
```

### 🎨 Custom Configuration

```tsx
interface PrivacyConsentConfig {
  settings: {
    categories: ConsentCategory[];     // Consent categories
    version: string;                   // Consent version
    expirationDays: number;           // Consent validity period
    storageKey: string;               // localStorage key
    showDeclineAll: boolean;          // Show decline all button
    showAcceptAll: boolean;           // Show accept all button
    showManagePreferences: boolean;   // Show preferences button
    autoShowDelay: number;            // Auto-show delay (ms)
    respectDoNotTrack: boolean;       // Honor DNT header
  };
  banner: {
    position: BannerPosition;         // Banner placement
    layout: BannerLayout;             // Banner style
    showCloseButton: boolean;         // Show close button
    showCompanyLogo: boolean;         // Show company logo
    blocking: boolean;                // Block page interaction
    animation: boolean;               // Enable animations
    backdrop: boolean;                // Show backdrop
  };
  texts: {
    title: string;                    // Main title
    description: string;              // Description text
    acceptAllText: string;            // Accept button text
    rejectAllText: string;            // Reject button text
    managePreferencesText: string;    // Preferences button text
    savePreferencesText: string;      // Save button text
    closeText: string;                // Close button text
    learnMoreText: string;            // Learn more link text
    learnMoreUrl?: string;            // Learn more URL
    privacyPolicyUrl?: string;        // Privacy policy URL
    cookiePolicyUrl?: string;         // Cookie policy URL
    poweredByText?: string;           // Attribution text
  };
  theme?: ConsentTheme;               // Custom theme
  onConsentChange?: (record) => void; // Consent change callback
  onBannerShow?: () => void;          // Banner show callback
  onBannerHide?: () => void;          // Banner hide callback
  onError?: (error) => void;          // Error callback
}
```

## 🎨 Theming & Customization

### CSS Variables

The package uses CSS custom properties for easy theming:

```css
:root {
  --consent-primary-color: #007bff;
  --consent-secondary-color: #6c757d;
  --consent-background-color: #ffffff;
  --consent-text-color: #212529;
  --consent-border-color: #dee2e6;
  --consent-border-radius: 0.375rem;
  --consent-font-family: system-ui, -apple-system, sans-serif;
  --consent-font-size: 14px;
  --consent-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### Custom Theme Object

```tsx
import { getDefaultTheme, getDarkTheme } from '@asafarim/react-privacy-consent';

const customTheme = {
  ...getDefaultTheme(),
  primaryColor: '#ff6b6b',
  secondaryColor: '#4ecdc4',
  backgroundColor: '#f8f9fa',
  borderRadius: '0.5rem'
};

const config = {
  // ...other config
  theme: customTheme
};
```

## 🔧 Advanced Usage

### Dynamic Category Management

```tsx
function DynamicConsentManager() {
  const { config, updateConsent } = useConsent();
  
  const handleCustomConsent = async () => {
    // Load user-specific categories from API
    const userCategories = await fetchUserCategories();
    
    // Update consent for each category
    userCategories.forEach(category => {
      updateConsent(category.id, category.defaultValue);
    });
  };
  
  return <button onClick={handleCustomConsent}>Load My Preferences</button>;
}
```

### Analytics Integration

```tsx
function AnalyticsIntegration() {
  const { consentRecord, hasConsent } = useConsent();
  
  useEffect(() => {
    if (hasConsent('analytics')) {
      // Initialize Google Analytics
      gtag('config', 'GA_MEASUREMENT_ID');
      
      // Track consent event
      gtag('event', 'consent_granted', {
        categories: consentRecord?.decisions
          .filter(d => d.status === 'accepted')
          .map(d => d.categoryId)
      });
    }
  }, [consentRecord, hasConsent]);
}
```

### Server-Side Integration

```tsx
// Send consent data to server
const config = {
  onConsentChange: async (record) => {
    try {
      await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: getCurrentUserId(),
          consent: record,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to save consent:', error);
    }
  }
};
```

## 🌍 Browser Support

- **Chrome** 60+
- **Firefox** 55+
- **Safari** 12+
- **Edge** 79+
- **Mobile browsers** with ES2018 support

## 📱 Mobile Optimization

The package is fully optimized for mobile devices:

- Touch-friendly controls with appropriate hit targets
- Responsive layouts that adapt to screen size
- Swipe gestures for dismissing banners
- Optimized for both portrait and landscape orientations
- Battery-conscious animations and transitions

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/AliSafari-IT/asafarim
cd ASafariM.Clients/packages/react-privacy-consent
pnpm install
pnpm build
pnpm test
```

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Why Choose @asafarim/react-privacy-consent?

### ✅ **Production Ready**
- Battle-tested in production environments
- Comprehensive error handling and fallbacks
- Optimized for performance and bundle size
- Regular security updates and maintenance

### 🎯 **Compliance Focused**
- Built by privacy professionals
- Regular updates for changing regulations
- Comprehensive audit trail and documentation
- Legal team approved implementation patterns

### 🚀 **Developer Friendly**
- Extensive TypeScript support
- Comprehensive documentation with live examples
- Active community support
- Regular feature updates based on user feedback

## 🔗 Related Packages & Ecosystem

- **[`@asafarim/react-themes`](https://www.npmjs.com/package/@asafarim/react-themes)** - Theme management system with privacy-aware styling
- **[`@asafarim/dd-menu`](https://www.npmjs.com/package/@asafarim/dd-menu)** - Dropdown menu component
- **[ASafariM Bibliography](https://bibliography.asafarim.com)** - Live application showcasing the consent system
- **[Interactive Demo](https://bibliography.asafarim.com/privacy-consent/demo)** - Comprehensive feature demonstration

## 📈 Project Stats

- 🏗️ **Built with**: TypeScript, React 18, Modern CSS
- 📦 **Bundle Size**: ~12KB gzipped
- 🌍 **Browser Support**: Modern browsers with localStorage support
- ⚡ **Performance**: Optimized rendering with minimal re-renders
- ♿ **Accessibility**: WCAG 2.1 AA compliant
- 🛡️ **Security**: Privacy-first design with secure defaults

---

<div align="center">

### 🛡️ **Protect User Privacy with Confidence**

**[Try the Live Demo](https://bibliography.asafarim.com/privacy-consent/demo)** | **[View Documentation](https://www.npmjs.com/package/@asafarim/react-privacy-consent)** | **[See Source Code](https://github.com/AliSafari-IT/asafarim)**

Made with ❤️ and 🔒 by **[ASafariM](https://github.com/AliSafari-IT)**

*Empowering developers to build privacy-compliant applications with ease*

</div>
