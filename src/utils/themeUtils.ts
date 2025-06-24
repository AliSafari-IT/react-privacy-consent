import { ConsentTheme } from '../types';

export function applyConsentTheme(theme: ConsentTheme): void {
  const root = document.documentElement;
  
  // Apply CSS custom properties
  root.style.setProperty('--consent-primary-color', theme.primaryColor);
  root.style.setProperty('--consent-secondary-color', theme.secondaryColor);
  root.style.setProperty('--consent-background-color', theme.backgroundColor);
  root.style.setProperty('--consent-text-color', theme.textColor);
  root.style.setProperty('--consent-border-color', theme.borderColor);
  root.style.setProperty('--consent-border-radius', theme.borderRadius);
  root.style.setProperty('--consent-font-family', theme.fontFamily);
  root.style.setProperty('--consent-font-size', theme.fontSize);
  root.style.setProperty('--consent-button-style', theme.buttonStyle);
  root.style.setProperty('--consent-shadow', theme.shadow ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none');
}

export function removeConsentTheme(): void {
  const root = document.documentElement;
  
  const themeProperties = [
    '--consent-primary-color',
    '--consent-secondary-color',
    '--consent-background-color',
    '--consent-text-color',
    '--consent-border-color',
    '--consent-border-radius',
    '--consent-font-family',
    '--consent-font-size',
    '--consent-button-style',
    '--consent-shadow'
  ];
  
  themeProperties.forEach(property => {
    root.style.removeProperty(property);
  });
}

export function getDefaultTheme(): ConsentTheme {
  return {
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    backgroundColor: '#ffffff',
    textColor: '#212529',
    borderColor: '#dee2e6',
    borderRadius: '0.375rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '14px',
    buttonStyle: 'solid',
    shadow: true
  };
}

export function getDarkTheme(): ConsentTheme {
  return {
    primaryColor: '#0d6efd',
    secondaryColor: '#adb5bd',
    backgroundColor: '#212529',
    textColor: '#ffffff',
    borderColor: '#495057',
    borderRadius: '0.375rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '14px',
    buttonStyle: 'solid',
    shadow: true
  };
}
