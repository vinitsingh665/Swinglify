import React from 'react';

export default function Skeleton({ className = '', width, height, style, borderRadius, circle = false }) {
  const mergedStyle = {
    width: width || '100%',
    height: height || '100%',
    borderRadius: circle ? '50%' : borderRadius || 'var(--radius-sm)',
    ...style,
  };

  return (
    <div
      className={`skeleton-base ${className}`}
      style={mergedStyle}
      aria-hidden="true"
    />
  );
}
