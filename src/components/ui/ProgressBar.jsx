import React from 'react';

export function ProgressBar({ progress, showText = true, className = '' }) {
  const percentage = Math.min(100, Math.max(0, progress || 0));

  return (
    <div className={`w-full ${className}`}>
      {showText && (
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-text-secondary font-medium font-body">Progression</span>
          <span className="text-gold-400 font-bold font-body">{percentage}%</span>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border-white">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-300 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
