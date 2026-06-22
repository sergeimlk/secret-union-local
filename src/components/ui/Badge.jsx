import React from 'react';

export function Badge({ level, className = '' }) {
  if (level === undefined || level === null) return null;

  return (
    <span className={`inline-flex items-center rounded-full border border-gold-500/20 bg-gold-900/30 px-3 py-1 text-xs font-semibold text-gold-400 font-display tracking-wider ${className}`}>
      LEVEL {level}
    </span>
  );
}

export default Badge;
