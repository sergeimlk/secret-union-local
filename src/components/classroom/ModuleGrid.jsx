import React from 'react';
import { ModuleCard } from './ModuleCard';
import { useProgress } from '../../hooks/useProgress';

export function ModuleGrid({ modules }) {
  const { getModuleProgress } = useProgress();

  if (!modules || modules.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">Aucun module disponible.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {modules.map((module, index) => {
        const progress = getModuleProgress(module);
        return (
          <div
            key={module.id}
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
          >
            <ModuleCard module={module} progress={progress} />
          </div>
        );
      })}
    </div>
  );
}

export default ModuleGrid;
