import React from 'react';
import { ConsentBannerProps } from '../types';
import { useConsent } from '../hooks/useConsent';

export function ConsentBanner({ 
  className = '', 
  style = {}, 
  onAcceptAll,
  onRejectAll,
  onManagePreferences,
  children 
}: ConsentBannerProps) {
  const { 
    isVisible, 
    acceptAll, 
    rejectAll, 
    showPreferences, 
    config 
  } = useConsent();

  if (!isVisible) return null;

  const handleAcceptAll = () => {
    acceptAll();
    onAcceptAll?.();
  };

  const handleRejectAll = () => {
    rejectAll();
    onRejectAll?.();
  };

  const handleManagePreferences = () => {
    showPreferences();
    onManagePreferences?.();
  };

  const bannerClasses = [
    'consent-banner',
    `consent-banner--${config.banner.position}`,
    `consent-banner--${config.banner.layout}`,
    config.banner.animation ? 'consent-banner--animated' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <>
      {config.banner.backdrop && <div className="consent-backdrop" />}
      <div 
        className={bannerClasses}
        style={style}
        role="dialog"
        aria-labelledby="consent-title"
        aria-describedby="consent-description"
      >
        {children || (
          <div className="consent-banner__content">
            <div className="consent-banner__text">
              <h3 id="consent-title" className="consent-banner__title">
                {config.texts.title}
              </h3>
              <p id="consent-description" className="consent-banner__description">
                {config.texts.description}
              </p>
              {(config.texts.learnMoreUrl || config.texts.privacyPolicyUrl) && (
                <div className="consent-banner__links">
                  {config.texts.learnMoreUrl && (
                    <a 
                      href={config.texts.learnMoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="consent-banner__link"
                    >
                      {config.texts.learnMoreText}
                    </a>
                  )}
                  {config.texts.privacyPolicyUrl && (
                    <a 
                      href={config.texts.privacyPolicyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="consent-banner__link"
                    >
                      Privacy Policy
                    </a>
                  )}
                </div>
              )}
            </div>
            
            <div className="consent-banner__actions">
              {config.settings.showAcceptAll && (
                <button
                  onClick={handleAcceptAll}
                  className="consent-button consent-button--primary"
                  type="button"
                >
                  {config.texts.acceptAllText}
                </button>
              )}
              
              {config.settings.showDeclineAll && (
                <button
                  onClick={handleRejectAll}
                  className="consent-button consent-button--secondary"
                  type="button"
                >
                  {config.texts.rejectAllText}
                </button>
              )}
              
              {config.settings.showManagePreferences && (
                <button
                  onClick={handleManagePreferences}
                  className="consent-button consent-button--ghost"
                  type="button"
                >
                  {config.texts.managePreferencesText}
                </button>
              )}
            </div>
            
            {config.banner.showCloseButton && (
              <button
                onClick={handleRejectAll}
                className="consent-banner__close"
                aria-label={config.texts.closeText}
                type="button"
              >
                ×
              </button>
            )}
            
            {config.texts.poweredByText && (
              <div className="consent-banner__powered-by">
                {config.texts.poweredByText}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
