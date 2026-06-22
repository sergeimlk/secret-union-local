import React from 'react';
import { ModuleGrid } from '../components/classroom/ModuleGrid';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useProgress } from '../hooks/useProgress';

export function ClassroomPage({ contentMap }) {
  const { progress } = useProgress();

  if (!contentMap) return null;

  // Calculate overall platform progress
  const totalLessons = contentMap.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = Object.values(progress).filter(Boolean).length;
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero section */}
      <div className="text-center py-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4">
          THE <span className="text-gold-gradient font-black">SECRET UNION</span>
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-text-secondary font-body font-light leading-relaxed mb-8">
          Maîtrise la création de contenu viral, automatise tes processus avec l'IA et domine ton marché grâce aux stratégies de Secret Union.
        </p>

        {/* Global Progress Card */}
        <div className="mx-auto max-w-xl glass-card p-6 border border-border-subtle bg-bg-card/70 shadow-2xl backdrop-blur-xl mb-12 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold tracking-wider text-text-secondary uppercase">
              Progression globale de la formation
            </span>
            <span className="text-lg font-black text-gold-400">
              {completedLessons} / {totalLessons} leçons
            </span>
          </div>
          <ProgressBar progress={overallProgress} showText={false} />
        </div>
      </div>

      {/* Modules section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-6 font-display border-l-2 border-gold-500 pl-3">
          CLASSROOM
        </h2>
        <ModuleGrid modules={contentMap.modules} />
      </div>
    </div>
  );
}

export default ClassroomPage;
