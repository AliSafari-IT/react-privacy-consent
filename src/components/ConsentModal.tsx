import React from 'react';
import { ConsentModalProps } from '../types';
import { useConsent } from '../hooks/useConsent';
import { ConsentCategory } from './ConsentCategory';

export function ConsentModal({ 
  isOpen, 
  onClose, 
  className = '', 
  style = {},
  showBackdrop = true
}: ConsentModalProps) {  const { 
    config, 
    consentRecord, 
    updateConsent, 
    acceptAll, 
    rejectAll,
    hidePreferences,
    hideBanner,
    getConsent
  } = useConsent();

  if (!isOpen) return null;
  
  const handleSavePreferences = () => {
    // First hide the preferences modal
    hidePreferences();
    // Then hide the banner
    hideBanner(); 
    // Finally close the modal
    onClose();
  };
  const handleAcceptAll = () => {
    // Accept all cookies and close the modal
    acceptAll();
    onClose();
  };

  const handleRejectAll = () => {
    // Reject all non-required cookies and close the modal
    rejectAll();
    onClose();
  };

  const modalClasses = [
    'consent-modal',
    className
  ].filter(Boolean).join(' ');

  return (
    <>
      {showBackdrop && (
        <div 
          className="consent-modal__backdrop" 
          onClick={onClose}
          role="presentation"
        />
      )}
      <div 
        className={modalClasses}
        style={style}
        role="dialog"
        aria-labelledby="consent-modal-title"
        aria-modal="true"
      >
        <div className="consent-modal__content">
          <div className="consent-modal__header">
            <h2 id="consent-modal-title" className="consent-modal__title">
              {config.texts.managePreferencesText}
            </h2>
            <button
              onClick={onClose}
              className="consent-modal__close"
              aria-label={config.texts.closeText}
              type="button"
            >
              ×
            </button>
          </div>
          
          <div className="consent-modal__body">
            <p className="consent-modal__description">
              {config.texts.description}
            </p>
              <div className="consent-modal__categories">
              {config.settings.categories.map((category) => {
                const currentValue = getConsent(category.id) === 'accepted';
                
                return (
                  <ConsentCategory
                    key={category.id}
                    category={category}
                    value={currentValue}
                    onChange={(accepted) => updateConsent(category.id, accepted)}
                    disabled={category.required}
                  />
                );
              })}
            </div>
            
            {(config.texts.privacyPolicyUrl || config.texts.cookiePolicyUrl) && (
              <div className="consent-modal__links">
                {config.texts.privacyPolicyUrl && (
                  <a 
                    href={config.texts.privacyPolicyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="consent-modal__link"
                  >
                    Privacy Policy
                  </a>
                )}
                {config.texts.cookiePolicyUrl && (
                  <a 
                    href={config.texts.cookiePolicyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="consent-modal__link"
                  >
                    Cookie Policy
                  </a>
                )}
              </div>
            )}
          </div>
          
          <div className="consent-modal__footer">
            <div className="consent-modal__actions">
              <button
                onClick={handleSavePreferences}
                className="consent-button consent-button--primary"
                type="button"
              >
                {config.texts.savePreferencesText}
              </button>
              
              {config.settings.showAcceptAll && (
                <button
                  onClick={handleAcceptAll}
                  className="consent-button consent-button--secondary"
                  type="button"
                >
                  {config.texts.acceptAllText}
                </button>
              )}
              
              {config.settings.showDeclineAll && (
                <button
                  onClick={handleRejectAll}
                  className="consent-button consent-button--ghost"
                  type="button"
                >
                  {config.texts.rejectAllText}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
