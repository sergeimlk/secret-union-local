import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export function Navbar({ contentMap, theme, setTheme }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Handle click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simple search filter
  useEffect(() => {
    if (!searchQuery.trim() || !contentMap) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const matches = [];

    contentMap.modules.forEach((mod) => {
      // Check if module matches
      if (mod.title.toLowerCase().includes(query)) {
        matches.push({
          type: 'module',
          id: mod.id,
          title: mod.title,
          subtitle: `Module ${mod.number}`,
          url: `/module/${mod.id}`,
        });
      }

      // Check if lessons match
      mod.lessons.forEach((les) => {
        if (les.title.toLowerCase().includes(query)) {
          matches.push({
            type: 'lesson',
            id: les.id,
            title: les.title,
            subtitle: `${mod.title} — Leçon ${les.number}`,
            url: `/module/${mod.id}/lesson/${les.id}`,
          });
        }
      });
    });

    setSearchResults(matches.slice(0, 8)); // limit to 8 results
  }, [searchQuery, contentMap]);

  const handleResultClick = (url) => {
    setSearchQuery('');
    setIsOpen(false);
    navigate(url);
  };

  const handleResetProgress = () => {
    localStorage.removeItem('su-skool-progress');
    // also clear P-E progress if any
    localStorage.removeItem('pe-skool-progress');
    window.location.reload();
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border-white bg-bg-primary/85 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* Left Side: Logo & Brand */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold-500/20 bg-bg-card transition-all duration-300 group-hover:border-gold-500/50">
                {/* Padlock Icon for Secret Union */}
                <svg className="h-5.5 w-5.5 text-gold-500 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-display text-sm font-bold tracking-tight text-white-gradient uppercase">
                  SECRET UNION
                </span>
                <span className="label-caps text-[8px] text-gold-500">
                  PLATFORME LOCALE
                </span>
              </div>
            </Link>

            {/* Middle Side: Tabs Navigation (Skool Style) */}
            <div className="flex items-center h-full gap-1 sm:gap-4 md:gap-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center h-16 px-2 sm:px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                    isActive
                      ? 'border-gold-500 text-gold-400 font-bold'
                      : 'border-transparent text-text-secondary hover:text-white hover:border-border-hover'
                  }`
                }
              >
                Communauté
              </NavLink>

              <NavLink
                to="/classroom"
                className={({ isActive }) =>
                  `flex items-center h-16 px-2 sm:px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                    isActive
                      ? 'border-gold-500 text-gold-400 font-bold'
                      : 'border-transparent text-text-secondary hover:text-white hover:border-border-hover'
                  }`
                }
              >
                Classroom
              </NavLink>

              <span className="flex items-center h-16 px-2 sm:px-3 text-xs sm:text-sm font-semibold border-b-2 border-transparent text-text-disabled cursor-not-allowed select-none" title="Bientôt disponible">
                Calendrier
              </span>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `flex items-center h-16 px-2 sm:px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                    isActive
                      ? 'border-gold-500 text-gold-400 font-bold'
                      : 'border-transparent text-text-secondary hover:text-white hover:border-border-hover'
                  }`
                }
              >
                À Propos
              </NavLink>
            </div>

            {/* Right Side: Search Bar & Settings */}
            <div className="flex items-center gap-3 shrink-0">
              <div ref={dropdownRef} className="relative flex-1 max-w-[120px] xs:max-w-[180px] sm:max-w-xs">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="w-full rounded-full border border-border-subtle bg-bg-input py-1.5 pl-8 pr-3 text-xs text-text-primary placeholder-text-muted outline-none transition-all focus:border-border-active focus:ring-1 focus:ring-gold-500/30"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-text-muted">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Search Dropdown */}
                {isOpen && searchResults.length > 0 && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 md:w-96 max-h-96 overflow-y-auto rounded-xl border border-border-hover bg-bg-card/95 shadow-2xl backdrop-blur-xl scroller">
                    <div className="p-2">
                      {searchResults.map((result, idx) => (
                        <button
                          key={`${result.type}-${result.id}-${idx}`}
                          onClick={() => handleResultClick(result.url)}
                          className="w-full text-left rounded-lg px-3 py-2 hover:bg-gold-500/10 transition-colors flex items-center justify-between group"
                        >
                          <div className="flex flex-col pr-2">
                            <span className="text-xs font-semibold text-text-primary group-hover:text-gold-300 transition-colors line-clamp-1">
                              {result.title}
                            </span>
                            <span className="text-[10px] text-text-muted line-clamp-1">
                              {result.subtitle}
                            </span>
                          </div>
                          <span className="text-[8px] uppercase font-bold px-1.5 py-0.5 rounded border border-gold-500/20 text-gold-500 bg-gold-900/30 shrink-0">
                            {result.type === 'module' ? 'Module' : 'Leçon'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isOpen && searchQuery.trim() && searchResults.length === 0 && (
                  <div className="absolute right-0 mt-2 w-72 rounded-xl border border-border-hover bg-bg-card/95 p-3 text-center text-xs text-text-muted shadow-2xl backdrop-blur-xl">
                    Aucun résultat pour "{searchQuery}"
                  </div>
                )}
              </div>

              {/* Settings Gear Button */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-bg-card text-text-secondary hover:text-white hover:border-border-hover transition-all cursor-pointer"
                title="Paramètres"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-overlay p-4 backdrop-blur-sm animate-fade-in">
          <div className="glass-card border border-border-active bg-bg-card max-w-md w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => {
                setIsSettingsOpen(false);
                setResetConfirm(false);
              }}
              className="absolute top-4 right-4 text-text-muted hover:text-white cursor-pointer"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-black text-white font-display border-b border-border-white pb-3">
              Paramètres de Secret Union ⚙️
            </h3>

            {/* Theme Select */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
                Thème Visuel du Site
              </label>
              <div className="grid grid-cols-3 gap-3">
                {/* Theme: Metallic */}
                <button
                  onClick={() => setTheme('metallic')}
                  className={`flex flex-col items-center gap-2 rounded-xl p-3 border text-xs font-semibold transition-all cursor-pointer ${
                    theme === 'metallic'
                      ? 'border-gold-500 bg-gold-500/10 text-white font-bold'
                      : 'border-border-subtle bg-bg-primary/50 text-text-secondary hover:text-white hover:border-border-hover'
                  }`}
                >
                  <div className="flex gap-1">
                    <span className="h-3 w-3 rounded-full bg-slate-400" />
                    <span className="h-3 w-3 rounded-full bg-slate-600" />
                  </div>
                  <span>Métallique</span>
                </button>

                {/* Theme: Gold */}
                <button
                  onClick={() => setTheme('gold')}
                  className={`flex flex-col items-center gap-2 rounded-xl p-3 border text-xs font-semibold transition-all cursor-pointer ${
                    theme === 'gold'
                      ? 'border-gold-500 bg-gold-500/10 text-white font-bold'
                      : 'border-border-subtle bg-bg-primary/50 text-text-secondary hover:text-white hover:border-border-hover'
                  }`}
                >
                  <div className="flex gap-1">
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-600" />
                  </div>
                  <span>Doré Noir</span>
                </button>

                {/* Theme: Red */}
                <button
                  onClick={() => setTheme('red')}
                  className={`flex flex-col items-center gap-2 rounded-xl p-3 border text-xs font-semibold transition-all cursor-pointer ${
                    theme === 'red'
                      ? 'border-gold-500 bg-gold-500/10 text-white font-bold'
                      : 'border-border-subtle bg-bg-primary/50 text-text-secondary hover:text-white hover:border-border-hover'
                  }`}
                >
                  <div className="flex gap-1">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="h-3 w-3 rounded-full bg-red-800" />
                  </div>
                  <span>Noir & Rouge</span>
                </button>
              </div>
            </div>

            {/* Reset Progress Section */}
            <div className="border-t border-border-white pt-4 space-y-3">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
                Gestion des Données
              </label>
              
              {!resetConfirm ? (
                <button
                  onClick={() => setResetConfirm(true)}
                  className="w-full text-center rounded-xl border border-red-500/30 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10 text-red-400 py-2.5 text-xs font-semibold transition-all cursor-pointer"
                >
                  Réinitialiser ma progression
                </button>
              ) : (
                <div className="space-y-2 rounded-xl border border-red-500/50 bg-red-950/20 p-3">
                  <p className="text-[11px] text-red-400 leading-normal font-medium">
                    Êtes-vous sûr ? Cela effacera définitivement l'historique de complétion de toutes vos leçons.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleResetProgress}
                      className="flex-1 text-center bg-red-600 hover:bg-red-500 text-white py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Oui, réinitialiser
                    </button>
                    <button
                      onClick={() => setResetConfirm(false)}
                      className="flex-1 text-center border border-border-white hover:bg-bg-primary py-1.5 rounded-lg text-xs font-medium text-text-primary transition-colors cursor-pointer"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 text-center text-[10px] text-text-muted">
              Secret Union Platform v1.1.0 • Offline mode
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
