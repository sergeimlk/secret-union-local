import React from 'react';
import { LessonItem } from './LessonItem';

export function LessonList({ lessons, moduleId, activeLessonId, completedLessons, onToggleCompletion }) {
  if (!lessons || lessons.length === 0) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-bg-card/30 p-8 text-center text-sm text-text-muted">
        Aucune leçon disponible pour ce module.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {lessons.map((lesson, idx) => {
        const isCompleted = !!completedLessons[lesson.id];
        const isActive = activeLessonId === lesson.id;

        return (
          <div
            key={lesson.id}
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'forwards' }}
          >
            <LessonItem
              lesson={lesson}
              moduleId={moduleId}
              isCompleted={isCompleted}
              onToggle={onToggleCompletion}
              isActive={isActive}
            />
          </div>
        );
      })}
    </div>
  );
}

export default LessonList;
