import React from 'react';

export function GoldGlow({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute -z-10 rounded-full bg-radial from-gold-500/10 to-transparent blur-3xl ${className}`} />
  );
}

export default GoldGlow;
