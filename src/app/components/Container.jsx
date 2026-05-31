import React from 'react';

export default function Container({ children, className = '', size = '7xl' }) {
  const sizeClasses = {
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full',
  };

  return (
    <div className={`w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20 ${sizeClasses[size] || 'max-w-7xl'} ${className}`}>
      {children}
    </div>
  );
}
