import React from 'react';

export const formatCurrency = (amount, currencySymbol = '$', currencyCode = '') => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return <span style={{ fontWeight: 'bold', color: '#dc3545' }}>{currencySymbol}0</span>;
  }

  let formattedValue;
  let suffix = '';

  if (Math.abs(amount) >= 1_000_000_000) {
    formattedValue = amount / 1_000_000_000;
    suffix = 'b';
  } else if (Math.abs(amount) >= 1_000_000) {
    formattedValue = amount / 1_000_000;
    suffix = 'm';
  } else if (Math.abs(amount) >= 1_000) {
    formattedValue = amount / 1_000;
    suffix = 'k';
  } else {
    // For numbers less than 1000, use standard locale formatting
    const standardFormat = amount.toLocaleString('vi-VN');
    if (currencyCode === 'VND') {
      return <span style={{ fontWeight: 'bold', color: '#28a745' }}>{standardFormat} {currencyCode}</span>;
    } else if (currencySymbol) {
      return <span style={{ fontWeight: 'bold', color: '#28a745' }}>{currencySymbol}{standardFormat}</span>;
    } else {
      return <span style={{ fontWeight: 'bold', color: '#28a745' }}>{standardFormat}</span>; // Fallback if no symbol or code
    }
  }

  const integerPart = Math.floor(formattedValue);
  const fractionalPart = Math.floor((formattedValue - integerPart) * 10); // Get the first digit after decimal

  let abbreviatedAmount = `${integerPart}`;
  if (fractionalPart > 0) {
    abbreviatedAmount += fractionalPart;
  }

  // Apply currency symbol or code based on type
  if (currencyCode === 'VND') {
    return (
      <span style={{ fontWeight: 'bold', color: '#28a745' }}>
        {abbreviatedAmount}
        <span style={{ color: '#007bff' }}>{suffix}</span>
        <span style={{ color: '#6c757d' }}> {currencyCode}</span>
      </span>
    );
  } else if (currencySymbol) {
    return (
      <span style={{ fontWeight: 'bold', color: '#28a745' }}>
        <span style={{ color: '#6c757d' }}>{currencySymbol}</span>
        {abbreviatedAmount}
        <span style={{ color: '#007bff' }}>{suffix}</span>
      </span>
    );
  } else {
    return (
      <span style={{ fontWeight: 'bold', color: '#28a745' }}>
        {abbreviatedAmount}
        <span style={{ color: '#007bff' }}>{suffix}</span>
      </span>
    );
  }
};