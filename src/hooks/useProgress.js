import { useState, useEffect } from 'react';

/**
 * Custom hook to track lesson progression in localStorage.
 * Progress is stored as an object: { [lessonId]: boolean }
 */
export function useProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('su-skool-progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleLesson = (lessonId) => {
    setProgress((prev) => {
      const updated = { ...prev, [lessonId]: !prev[lessonId] };
      try {
        localStorage.setItem('su-skool-progress', JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving progress to localStorage', err);
      }
      return updated;
    });
  };

  const setLessonCompleted = (lessonId, completed) => {
    setProgress((prev) => {
      const updated = { ...prev, [lessonId]: !!completed };
      try {
        localStorage.setItem('su-skool-progress', JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving progress to localStorage', err);
      }
      return updated;
    });
  };

  const getModuleProgress = (module) => {
    if (!module || !module.lessons || module.lessons.length === 0) return 0;
    const completedCount = module.lessons.filter(l => !!progress[l.id]).length;
    return Math.round((completedCount / module.lessons.length) * 100);
  };

  const getLessonCompleted = (lessonId) => {
    return !!progress[lessonId];
  };

  return {
    progress,
    toggleLesson,
    setLessonCompleted,
    getModuleProgress,
    getLessonCompleted,
  };
}
