import React from 'react';

export function AboutPage() {
  return (
    <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="text-center py-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
          À PROPOS DE <span className="text-gold-gradient font-black">SECRET UNION</span>
        </h1>
        <p className="text-text-secondary text-sm font-body max-w-xl mx-auto">
          Découvre les règles, les méthodologies d'automatisation IA et les stratégies de monétisation.
        </p>
      </div>

      {/* Main Container */}
      <div className="space-y-8">
        {/* Intro description */}
        <section className="glass-card border border-border-subtle bg-bg-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-white font-display border-l-2 border-gold-500 pl-3">
            Le mot de l'équipe 🗣️
          </h2>
          <p className="text-sm text-text-secondary font-body font-light leading-relaxed">
            "Secret Union est né de la volonté de regrouper et de simplifier les meilleures méthodes de création de contenu et de monétisation automatique par l'intelligence artificielle. Notre objectif est de te fournir un arsenal d'outils et de stratégies validées pour te libérer du temps tout en démultipliant tes revenus. Suis la structure des modules pas à pas, passe à l'action tous les jours, et exploite la communauté pour propulser tes projets."
          </p>
        </section>

        {/* Support Links */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="glass-card border border-border-subtle bg-bg-card p-6 space-y-3">
            <h3 className="text-base font-bold text-white font-display">
              📅 Mentorat & Coaching 1:1
            </h3>
            <p className="text-xs text-text-secondary font-body">
              Réserve ton appel de mentorat privé pour concevoir un plan d'action personnalisé et analyser tes comptes de contenu.
            </p>
            <a
              href="https://calendly.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-gold !py-2 !px-4 !min-height-0 !text-xs w-full text-center mt-2"
            >
              Réserver un appel
            </a>
          </div>

          <div className="glass-card border border-border-subtle bg-bg-card p-6 space-y-3">
            <h3 className="text-base font-bold text-white font-display">
              🗂️ Outils & Prompts IA
            </h3>
            <p className="text-xs text-text-secondary font-body">
              Accède à la base de prompts exclusifs, aux templates de scripts et aux outils recommandés dans la formation.
            </p>
            <a
              href="#/classroom"
              className="btn-primary-gold !py-2 !px-4 !min-height-0 !text-xs w-full text-center mt-2"
            >
              Accéder aux modules
            </a>
          </div>
        </section>

        {/* Rules & Values */}
        <section className="glass-card border border-border-subtle bg-bg-card p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white font-display border-l-2 border-gold-500 pl-3">
            Les règles de la communauté 🤝🏽
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="text-xl">⚡</span>
              <div>
                <h4 className="text-sm font-bold text-white">Action et Régularité</h4>
                <p className="text-xs text-text-secondary font-body mt-1 leading-relaxed">
                  Applique les concepts quotidiennement. La constance dans la publication et l'amélioration de tes vidéos est le seul secret de la virilité organique.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-xl">🤝</span>
              <div>
                <h4 className="text-sm font-bold text-white">Entraide et Retours</h4>
                <p className="text-xs text-text-secondary font-body mt-1 leading-relaxed">
                  Profite de la communauté pour faire analyser tes vidéos et tes scripts. Donne également ton avis constructif pour aider les autres membres à progresser.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-xl">🤫</span>
              <div>
                <h4 className="text-sm font-bold text-white">Confidentialité Stricte</h4>
                <p className="text-xs text-text-secondary font-body mt-1 leading-relaxed">
                  Toutes les stratégies, prompts, scripts et coulisses de Secret Union doivent rester dans ce cercle privé. Aucun partage ou fuite externe n'est toléré.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
