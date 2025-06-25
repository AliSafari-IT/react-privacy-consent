# React Privacy Consent Demo

This is a standalone React demo application for testing the `@asafarim/react-privacy-consent` package.

## Features

- **Complete Privacy Consent System**: Demonstrates banner, modal, and consent management
- **Theme Support**: Light and dark theme switching with real-time preview
- **Consent Persistence**: Shows how consent choices persist across page reloads
- **Interactive Controls**: Test all consent functions (accept all, reject all, manage preferences, reset)
- **Real-time Status**: View current consent status and category details
- **Integration Guide**: Code examples for implementing in your own projects

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn or pnpm

### Installation

1. Navigate to the demo directory:
```bash
cd demo
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open your browser and navigate to `http://localhost:3005`

## Demo Features

### 1. Theme Controls
- Switch between light and dark themes
- See how themes affect the consent UI components
- Themes are applied using CSS custom properties

### 2. Consent Management
- **Manage Preferences**: Open the modal to configure individual categories
- **Accept All**: Accept all consent categories at once
- **Reject All**: Reject all non-required categories
- **Reset Consent**: Clear all consent data and show banner again

### 3. Consent Status Display
- View current consent record details
- See individual category statuses (Accepted/Rejected/Pending)
- Monitor session ID, version, and last updated timestamp

### 4. Banner Behavior
- Automatically shows on first visit or after reset
- Configurable delay (1 second in demo)
- Multiple action buttons (Accept All, Reject All, Manage Preferences)

### 5. Modal Functionality
- Detailed category management
- Individual toggle controls
- Category descriptions and requirements
- Save preferences functionality

## Configuration

The demo uses a comprehensive configuration object that demonstrates all available options:

```typescript
const demoConfig: PrivacyConsentConfig = {
  settings: {
    version: '1.0.0',
    storageKey: 'demo-privacy-consent',
    expirationDays: 365,
    autoShowDelay: 1000,
    categories: [
      // Necessary, Analytics, Marketing, Preferences
    ]
  },
  ui: {
    banner: {
      // Banner configuration
    },
    modal: {
      // Modal configuration
    }
  },
  // Event callbacks
  onConsentChange: (consent) => console.log('Consent changed:', consent),
  onBannerShow: () => console.log('Banner shown'),
  // ... other callbacks
};
```

## Testing Scenarios

### 1. First-time Visitor
1. Refresh the page or reset consent
2. Banner should appear after 1 second
3. Test different banner actions

### 2. Returning Visitor
1. Set some preferences
2. Refresh the page
3. Verify preferences are maintained
4. Banner should not appear

### 3. Theme Testing
1. Switch to dark theme
2. Open preferences modal
3. Verify dark theme is applied to all components

### 4. Consent Persistence
1. Accept some categories, reject others
2. Refresh the page multiple times
3. Verify choices persist across reloads

## Development

### Building the Package

From the parent directory:
```bash
npm run build
```

### Testing Changes

The demo uses Vite's alias configuration to import directly from the source code, so changes to the package source will be reflected immediately in the demo.

## Integration Guide

See the Integration Guide section in the demo app for code examples and implementation details.

## Troubleshooting

### Common Issues

1. **Banner not showing**: Check console for errors, verify configuration
2. **Preferences not persisting**: Check localStorage in browser dev tools
3. **Theme not applying**: Verify CSS custom properties are being set
4. **TypeScript errors**: Ensure all types are properly imported

### Debug Information

The demo includes console logging for all consent events. Open browser dev tools to see:
- Consent changes
- Banner/modal show/hide events
- Storage operations
- Theme applications

## Package Information

- **Package**: `@asafarim/react-privacy-consent`
- **Version**: 1.4.0
- **License**: MIT
- **Repository**: [GitHub Repository URL]

## Support

For issues, questions, or contributions, please refer to the main package documentation and repository.
