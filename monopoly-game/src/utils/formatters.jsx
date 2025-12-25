import React from 'react';

export const formatCurrency = (amount, currencySymbol = '$', currencyCode = '') => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return <span style={{ fontWeight: 'bold', color: '#dc3545' }}>{currencySymbol}0</span>;
  }

  if (Math.abs(amount) >= 1000) {
    const integerPart = Math.floor(Math.abs(amount) / 1000);
    const decimalPart = Math.floor((Math.abs(amount) % 1000) / 100);

    const formattedText = (
      <>
        {integerPart}
        <span style={{ color: '#007bff' }}>k</span>
        {decimalPart}
      </>
    );

    if (currencyCode === 'VND') {
      return (
        <span style={{ fontWeight: 'bold', color: '#28a745' }}>
          {formattedText}
          <span style={{ color: '#6c757d' }}> {currencyCode}</span>
        </span>
      );
    } else if (currencySymbol) {
      return (
        <span style={{ fontWeight: 'bold', color: '#28a745' }}>
          <span style={{ color: '#6c757d' }}>{currencySymbol}</span>
          {formattedText}
        </span>
      );
    } else {
      return (
        <span style={{ fontWeight: 'bold', color: '#28a745' }}>
          {formattedText}
        </span>
      );
    }
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
};