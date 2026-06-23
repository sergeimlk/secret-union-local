import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BackButton } from '../components/ui/BackButton';
import { VideoPlayer } from '../components/classroom/VideoPlayer';
import { useProgress } from '../hooks/useProgress';

// A simple, fast markdown parser for clean HTML rendering without extra dependencies
function parseMarkdown(text) {
  if (!text) return '';
  let html = text;

  // Escape HTML entities to prevent injection
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headings
  html = html.replace(/^#\s+(.+)$/gm, '<h1 class="text-2xl font-black text-white font-display border-b border-border-white pb-2 mb-4 mt-6">$1</h1>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2 class="text-xl font-bold text-gold-300 font-display mt-6 mb-3">$1</h2>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3 class="text-lg font-bold text-white font-display mt-4 mb-2">$1</h3>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gold-400 font-semibold">$1</strong>');

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, (match, text, url) => {
    let displayText = text;
    if (text.startsWith('http://') || text.startsWith('https://')) {
      try {
        const parsed = new URL(text);
        const pathTruncated = parsed.pathname.length > 15 ? parsed.pathname.substring(0, 15) + '...' : parsed.pathname;
        displayText = parsed.hostname + pathTruncated;
      } catch (e) {
        displayText = text.length > 30 ? text.substring(0, 30) + '...' : text;
      }
    }
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-gold-400 hover:text-gold-300 underline font-medium transition-colors break-all">${displayText}</a>`;
  });

  // Bullet points
  // First group lists
  html = html.replace(/^\s*-\s+(.+)$/gm, '<li class="text-text-secondary ml-4 mb-2 list-disc">$1</li>');
  html = html.replace(/^\s*\*\s+(.+)$/gm, '<li class="text-text-secondary ml-4 mb-2 list-disc">$1</li>');

  // Paragraphs (split by double lines, wrap non-HTML block lines)
  const lines = html.split('\n');
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '<div class="h-4"></div>';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<li') || trimmed.startsWith('<div')) {
      return line;
    }
    return `<p class="text-text-secondary font-body font-light leading-relaxed mb-3">${line}</p>`;
  });

  return processedLines.join('\n');
}

function getGoogleDriveEmbedUrl(url) {
  if (!url) return null;
  if (!url.includes('google.com')) return null;
  
  let id = null;
  const matchId = url.match(/[?&]id=([^&]+)/);
  if (matchId) {
    id = matchId[1];
  } else {
    const matchPath = url.match(/\/file\/d\/([^/]+)/);
    if (matchPath) {
      id = matchPath[1];
    }
  }
  return id ? `https://drive.google.com/file/d/${id}/preview` : null;
}

export function LessonPage({ contentMap }) {
  const { id, lessonId } = useParams();
  const navigate = useNavigate();
  const { progress, setLessonCompleted, getLessonCompleted } = useProgress();

  const [lessonContent, setLessonContent] = useState('');
  const [loadingContent, setLoadingContent] = useState(false);
  const [autoplayNext, setAutoplayNext] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const countdownTimerRef = useRef(null);

  if (!contentMap) return null;

  const currentModule = contentMap.modules.find(m => m.id === id);
  if (!currentModule) return null;

  const lessonIndex = currentModule.lessons.findIndex(l => l.id === lessonId);
  const currentLesson = currentModule.lessons[lessonIndex];

  if (!currentLesson) {
    return (
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-white">Leçon introuvable</h2>
        <p className="mt-2 text-text-secondary">La leçon demandée n'existe pas ou a été déplacée.</p>
        <Link to={`/module/${currentModule.id}`} className="btn-primary-gold mt-6">Retour au module</Link>
      </div>
    );
  }

  const prevLesson = lessonIndex > 0 ? currentModule.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < currentModule.lessons.length - 1 ? currentModule.lessons[lessonIndex + 1] : null;

  const isCompleted = getLessonCompleted(currentLesson.id);

  // Fetch lesson text/markdown content
  useEffect(() => {
    async function fetchLessonText() {
      setLessonContent('');
      const filePath = currentLesson.contentFile || currentLesson.textFile;
      if (!filePath) {
        setLessonContent('*(Pas de description)*');
        return;
      }

      setLoadingContent(true);
      try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error('File not found');
        const text = await response.text();
        setLessonContent(text);
      } catch (err) {
        console.error('Error fetching lesson file:', err);
        setLessonContent('*(Impossible de charger le contenu)*');
      } finally {
        setLoadingContent(false);
      }
    }

    fetchLessonText();

    // Reset countdown if lesson changes
    setAutoplayNext(false);
    setCountdown(0);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
  }, [lessonId]);

  // Mark lesson as completed automatically after render to avoid concurrent update warnings
  useEffect(() => {
    if (currentLesson && !isCompleted) {
      const timer = setTimeout(() => {
        setLessonCompleted(currentLesson.id, true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentLesson?.id, isCompleted]);

  // Clean up countdown timer on unmount
  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, []);

  // Keyboard navigation between lessons
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === 'INPUT') return;

      if (e.code === 'ArrowLeft' && e.altKey && prevLesson) {
        navigate(`/module/${currentModule.id}/lesson/${prevLesson.id}`);
      } else if (e.code === 'ArrowRight' && e.altKey && nextLesson) {
        navigate(`/module/${currentModule.id}/lesson/${nextLesson.id}`);
      } else if (e.code === 'Escape') {
        navigate(`/module/${currentModule.id}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevLesson, nextLesson, currentModule]);

  const handleVideoEnd = () => {
    // Automatically mark as completed
    setLessonCompleted(currentLesson.id, true);

    if (nextLesson) {
      setAutoplayNext(true);
      setCountdown(5); // 5 seconds countdown

      countdownTimerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimerRef.current);
            navigate(`/module/${currentModule.id}/lesson/${nextLesson.id}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const cancelAutoplay = () => {
    setAutoplayNext(false);
    setCountdown(0);
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
  };

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="mb-4 flex items-center justify-between">
        <BackButton to={`/module/${currentModule.id}`} label={`Retour à ${currentModule.title}`} />
        <span className="text-xs font-bold uppercase tracking-widest text-gold-500">
          Leçon {currentLesson.number} / {currentModule.lessons.length}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Main Content Area: Video and Text */}
        <div className="lg:col-span-3 space-y-6">
          {/* Video Player or Placeholder */}
          {currentLesson.hasVideo && currentLesson.videoFile ? (
            <div className="relative">
              {getGoogleDriveEmbedUrl(currentLesson.videoFile) ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border-subtle bg-black shadow-xl">
                  <iframe
                    src={getGoogleDriveEmbedUrl(currentLesson.videoFile)}
                    className="h-full w-full object-contain"
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                </div>
              ) : (
                <VideoPlayer src={currentLesson.videoFile} onVideoEnd={handleVideoEnd} />
              )}
              
              {/* Autoplay Next Banner Overlay */}
              {autoplayNext && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 rounded-2xl border border-gold-500/25">
                  <h3 className="text-2xl font-black text-gold-400 font-display mb-2">
                    Leçon suivante dans {countdown}s...
                  </h3>
                  <p className="text-text-secondary text-sm mb-6">
                    "{nextLesson.title}"
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        clearInterval(countdownTimerRef.current);
                        navigate(`/module/${currentModule.id}/lesson/${nextLesson.id}`);
                      }}
                      className="btn-primary-gold px-6 py-2"
                    >
                      Regarder maintenant
                    </button>
                    <button
                      onClick={cancelAutoplay}
                      className="rounded-full border border-border-hover hover:border-gold-500/50 hover:bg-gold-500/10 px-6 py-2 text-sm font-semibold text-text-primary transition-all duration-200"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border-subtle bg-bg-card flex flex-col items-center justify-center p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/20 bg-bg-primary text-gold-500 mb-4">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white font-display mb-1">
                Leçon textuelle uniquement
              </h3>
              <p className="text-xs text-text-muted max-w-sm">
                Cette section ne contient pas de support vidéo. Consultez la documentation écrite ci-dessous.
              </p>
            </div>
          )}

          {/* Lesson Header Title */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-white pb-4">
            <h1 className="text-xl sm:text-2xl font-black text-white font-display">
              {currentLesson.title}
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLessonCompleted(currentLesson.id, !isCompleted)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border transition-all duration-300 ${
                  isCompleted
                    ? 'border-success bg-success/10 text-success'
                    : 'border-border-white hover:border-gold-500/30 text-text-secondary hover:text-white'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${isCompleted ? 'bg-success' : 'bg-text-muted'}`} />
                {isCompleted ? 'Complétée' : 'Marquer complétée'}
              </button>
            </div>
          </div>

          {/* Written Description / File content */}
          <div className="glass-card border border-border-subtle bg-bg-card p-6 md:p-8 shadow-xl">
            {loadingContent ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gold-500 border-r-2" />
              </div>
            ) : (
              <div
                className="prose-gold select-text"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(lessonContent) }}
              />
            )}
          </div>

          {/* Footer Prev/Next Navigation buttons */}
          <div className="flex items-center justify-between border-t border-border-white pt-6">
            {prevLesson ? (
              <Link
                to={`/module/${currentModule.id}/lesson/${prevLesson.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-card hover:bg-bg-card-hover px-4 py-2 text-sm font-semibold text-text-primary hover:text-gold-300 transition-all duration-200"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Précédent :</span> {prevLesson.title}
              </Link>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <Link
                to={`/module/${currentModule.id}/lesson/${nextLesson.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-card hover:bg-bg-card-hover px-4 py-2 text-sm font-semibold text-text-primary hover:text-gold-300 transition-all duration-200"
              >
                <span className="hidden sm:inline">Suivant :</span> {nextLesson.title}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>

        {/* Sidebar Column: Module Outline */}
        <div className="lg:col-span-1">
          <div className="glass-card border border-border-subtle bg-bg-card/75 p-4 shadow-xl sticky top-24 max-h-[calc(100vh-8rem)] flex flex-col">
            <h3 className="text-sm font-black text-white font-display uppercase tracking-widest border-b border-border-white pb-3 mb-3 flex items-center justify-between">
              <span>Outline du module</span>
              <span className="text-[10px] text-gold-400">N° {currentModule.number}</span>
            </h3>

            {/* List scroll container */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scroller">
              {currentModule.lessons.map((les) => {
                const isActive = les.id === lessonId;
                const lesCompleted = !!progress[les.id];

                return (
                  <Link
                    key={les.id}
                    to={`/module/${currentModule.id}/lesson/${les.id}`}
                    className={`flex items-start gap-3 rounded-lg p-2 text-xs transition-colors duration-200 ${
                      isActive
                        ? 'bg-gold-500/10 text-gold-300 font-semibold border border-gold-500/20'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-card-hover border border-transparent'
                    }`}
                  >
                    {/* Status Circle */}
                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-border-white">
                      {lesCompleted && (
                        <div className="h-2.5 w-2.5 rounded-full bg-success" />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <span className="line-clamp-2">{les.title}</span>
                      <span className="text-[9px] text-text-muted mt-0.5 uppercase tracking-wide">
                        {les.type === 'video' ? '🎥 Vidéo' : '📝 Texte'}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonPage;
