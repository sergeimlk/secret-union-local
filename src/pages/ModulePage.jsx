import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BackButton } from '../components/ui/BackButton';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { LessonList } from '../components/classroom/LessonList';
import { useProgress } from '../hooks/useProgress';

export function ModulePage({ contentMap }) {
  const { id } = useParams();
  const { progress, toggleLesson, getModuleProgress } = useProgress();

  if (!contentMap) return null;

  const currentModule = contentMap.modules.find(m => m.id === id);

  if (!currentModule) {
    return (
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-white">Module introuvable</h2>
        <p className="mt-2 text-text-secondary">Le module demandé n'existe pas ou a été déplacé.</p>
        <Link to="/" className="btn-primary-gold mt-6">Retour à la classroom</Link>
      </div>
    );
  }

  const moduleProgress = getModuleProgress(currentModule);
  const totalLessonsCount = currentModule.lessons.length;
  const completedCount = currentModule.lessons.filter(l => !!progress[l.id]).length;

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <BackButton to="/" label="Retour à la classroom" className="mb-6" />

      {/* Module Header Area */}
      <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-bg-card/40 p-6 md:p-8 backdrop-blur-xl mb-8">
        {/* Cover image backdrop blur */}
        {currentModule.coverImage && (
          <div className="absolute inset-0 -z-10 opacity-10">
            <img
              src={currentModule.coverImage}
              alt=""
              className="h-full w-full object-cover blur-2xl"
            />
          </div>
        )}

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {currentModule.coverImage ? (
              <img
                src={currentModule.coverImage}
                alt={currentModule.title}
                className="w-full md:w-48 aspect-video md:aspect-square object-cover rounded-2xl border border-border-white"
              />
            ) : (
              <div className="flex w-full md:w-48 aspect-video md:aspect-square items-center justify-center rounded-2xl border border-border-white bg-bg-primary">
                <span className="font-display text-4xl font-extrabold text-gold-500/20">{currentModule.number}</span>
              </div>
            )}

            <div>
              <div className="flex flex-wrap gap-2 items-center mb-2">
                <Badge level={currentModule.level} />
                <span className="rounded bg-bg-primary/80 px-2 py-0.5 text-[10px] font-bold tracking-widest text-gold-300 border border-gold-500/10">
                  MODULE {currentModule.number}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                {currentModule.title}
              </h1>
              <p className="mt-3 text-sm text-text-secondary max-w-2xl font-body font-light leading-relaxed">
                {currentModule.description || "Découvrez toutes les leçons et progressez à votre rythme dans ce module."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Module Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Lesson Tree Checklist */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold tracking-tight text-white mb-4 font-display">
            CONTENU DE LA CLASSE
          </h2>
          <LessonList
            lessons={currentModule.lessons}
            moduleId={currentModule.id}
            completedLessons={progress}
            onToggleCompletion={toggleLesson}
          />
        </div>

        {/* Right Column: Module Progress and Info Card */}
        <div className="space-y-6">
          <div className="glass-card border border-border-subtle bg-bg-card p-6 shadow-xl sticky top-24">
            <h3 className="text-lg font-bold text-white font-display mb-4">
              Progression du module
            </h3>
            <ProgressBar progress={moduleProgress} showText={true} className="mb-6" />

            <div className="space-y-4 pt-4 border-t border-border-white">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Leçons complétées</span>
                <span className="font-semibold text-text-primary">{completedCount} / {totalLessonsCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Format des vidéos</span>
                <span className="font-semibold text-text-primary">HTML5 Local MP4</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Mode d'accès</span>
                <span className="font-semibold text-text-primary">100% Hors-ligne</span>
              </div>
            </div>

            {currentModule.lessons.length > 0 && (
              <Link
                to={`/module/${currentModule.id}/lesson/${currentModule.lessons[0].id}`}
                className="btn-primary-gold w-full mt-6 text-center"
              >
                {completedCount > 0 ? 'Reprendre la leçon' : 'Commencer le module'}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModulePage;
