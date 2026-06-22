import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useContentMap } from './hooks/useContentMap';
import { GridBackground } from './components/effects/GridBackground';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CommunityPage } from './pages/CommunityPage';
import { ClassroomPage } from './pages/ClassroomPage';
import { ModulePage } from './pages/ModulePage';
import { LessonPage } from './pages/LessonPage';
import { AboutPage } from './pages/AboutPage';

export function App() {
  const { contentMap, loading, error } = useContentMap();
  const [theme, setTheme] = React.useState(() => {
    return localStorage.getItem('su-theme') || 'metallic';
  });

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('su-theme', theme);
  }, [theme]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-bg-primary">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-t-2 border-r-2 border-gold-500" />
          <span className="absolute font-display text-xs font-bold text-gold-400">SU</span>
        </div>
        <p className="mt-4 font-display text-sm tracking-widest text-text-secondary uppercase animate-pulse">
          Chargement de Secret Union...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-bg-primary p-6 text-center">
        <div className="rounded-full bg-error/10 border border-error/20 p-4 text-error mb-4">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white font-display">Erreur de chargement</h2>
        <p className="mt-2 text-text-secondary max-w-md">
          Impossible de charger le fichier d'indexation <code>content-map.json</code>. 
          Vérifiez que le script de génération a été exécuté.
        </p>
      </div>
    );
  }

  return (
    <Router>
      <div className="relative min-h-screen flex flex-col bg-bg-primary text-text-primary">
        {/* Background Grids & Glows */}
        <GridBackground />

        {/* Global Navigation Header */}
        <Navbar contentMap={contentMap} theme={theme} setTheme={setTheme} />

        {/* Main Content Area */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<CommunityPage contentMap={contentMap} />} />
            <Route path="/classroom" element={<ClassroomPage contentMap={contentMap} />} />
            <Route path="/module/:id" element={<ModulePage contentMap={contentMap} />} />
            <Route path="/module/:id/lesson/:lessonId" element={<LessonPage contentMap={contentMap} />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
