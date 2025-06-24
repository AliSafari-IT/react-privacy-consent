import React from 'react';
import { ConsentToggleProps } from '../types';

export function ConsentToggle({ 
  checked, 
  onChange, 
  disabled = false, 
  size = 'md', 
  className = '', 
  label 
}: ConsentToggleProps) {
  const toggleClasses = [
    'consent-toggle',
    `consent-toggle--${size}`,
    checked ? 'consent-toggle--checked' : '',
    disabled ? 'consent-toggle--disabled' : '',
    className
  ].filter(Boolean).join(' ');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(event.target.checked);
    }
  };

  return (
    <label className={toggleClasses}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="consent-toggle__input"
        aria-label={label}
      />
      <span className="consent-toggle__slider"></span>
      {label && <span className="consent-toggle__label">{label}</span>}
    </label>
  );
}
