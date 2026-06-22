import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';

export function ModuleCard({ module, progress }) {
  const hasVideos = module.lessons.some(l => l.type === 'video');

  return (
    <Link
      to={`/module/${module.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-bg-card hover-gold-border p-4 transition-all duration-300"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-bg-primary">
        {module.coverImage ? (
          <img
            src={module.coverImage}
            alt={module.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold-900/20 to-bg-card">
            <span className="font-display text-4xl font-extrabold text-gold-500/20">
              {module.number}
            </span>
          </div>
        )}
        
        {/* Play Overlay if module has videos */}
        {hasVideos && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-bg-primary shadow-lg shadow-gold-500/20 transition-transform duration-300 group-hover:scale-110">
              <svg className="h-6 w-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Level Badge */}
        {module.level && (
          <div className="absolute top-2 left-2">
            <Badge level={module.level} />
          </div>
        )}

        {/* Module Number Tag */}
        <div className="absolute top-2 right-2 rounded bg-bg-primary/80 px-2 py-0.5 text-[10px] font-bold tracking-widest text-gold-300 border border-gold-500/10">
          N° {module.number}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col pt-4">
        <h3 className="font-display text-lg font-bold text-text-primary group-hover:text-gold-300 transition-colors line-clamp-1">
          {module.title}
        </h3>
        <p className="mt-2 text-sm text-text-secondary line-clamp-2 flex-1 font-body font-light leading-relaxed">
          {module.description || "Découvrez le module et commencez à apprendre de suite !"}
        </p>

        {/* Lesson Count Info */}
        <div className="mt-4 mb-3 flex items-center justify-between text-xs text-text-muted">
          <span>{module.totalLessons} leçons</span>
          <span>{module.lessons.filter(l => l.type === 'video').length} vidéos</span>
        </div>

        {/* Progress Bar */}
        <ProgressBar progress={progress} showText={true} />
      </div>
    </Link>
  );
}

export default ModuleCard;
