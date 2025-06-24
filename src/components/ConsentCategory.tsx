import React from 'react';
import { ConsentCategoryProps } from '../types';
import { ConsentToggle } from './ConsentToggle';

export function ConsentCategory({ 
  category, 
  value, 
  onChange, 
  disabled = false, 
  className = '' 
}: ConsentCategoryProps) {
  const categoryClasses = [
    'consent-category',
    disabled ? 'consent-category--disabled' : '',
    category.required ? 'consent-category--required' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={categoryClasses}>
      <div className="consent-category__header">
        <h4 className="consent-category__name">{category.name}</h4>
        <ConsentToggle
          checked={value}
          onChange={onChange}
          disabled={disabled}
          size="md"
        />
      </div>
      <p className="consent-category__description">{category.description}</p>
      {category.required && (
        <span className="consent-category__required-badge">
          Required
        </span>
      )}
    </div>
  );
}
