import React from 'react';
import { Link } from 'react-router-dom';

export function LessonItem({ lesson, moduleId, isCompleted, onToggle, isActive }) {
  const isVideo = lesson.type === 'video';

  const handleCheckboxClick = (e) => {
    e.stopPropagation(); // prevent navigating to lesson
    e.preventDefault();
    onToggle(lesson.id);
  };

  return (
    <div
      className={`group relative flex items-center justify-between rounded-xl border border-border-subtle p-4 transition-all duration-300 ${
        isActive
          ? 'bg-gold-900/10 border-gold-500/50'
          : 'bg-bg-card/50 hover:bg-bg-card-hover hover:border-border-hover'
      }`}
    >
      {/* Clickable Area to navigate */}
      <Link
        to={`/module/${moduleId}/lesson/${lesson.id}`}
        className="flex flex-1 items-center gap-3"
      >
        {/* Lesson Type Icon */}
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
            isActive
              ? 'border-gold-500 bg-gold-900/30 text-gold-400'
              : 'border-border-white bg-bg-primary text-text-muted group-hover:border-gold-500/30 group-hover:text-gold-500'
          }`}
        >
          {isVideo ? (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
        </div>

        {/* Title */}
        <div className="flex flex-col">
          <span
            className={`text-sm font-semibold transition-colors duration-200 ${
              isActive
                ? 'text-gold-300'
                : 'text-text-primary group-hover:text-gold-400'
            }`}
          >
            {lesson.title}
          </span>
          <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">
            {isVideo ? 'Vidéo' : 'Texte'}
          </span>
        </div>
      </Link>

      {/* Checkbox completed status */}
      <button
        onClick={handleCheckboxClick}
        className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300 focus:outline-none ${
          isCompleted
            ? 'border-success bg-success text-bg-primary font-bold'
            : 'border-border-white hover:border-gold-500/50 hover:bg-gold-500/10 text-transparent'
        }`}
        title={isCompleted ? 'Marquer comme non vu' : 'Marquer comme vu'}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>
  );
}

export default LessonItem;
