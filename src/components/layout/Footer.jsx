import React from 'react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border-white bg-bg-primary py-8 text-center text-xs text-text-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="font-display tracking-wider">
          © {new Date().getFullYear()} SECRET UNION. TOUS DROITS RÉSERVÉS.
        </p>
        <p className="mt-2 text-[10px] text-text-disabled">
          Plateforme d'apprentissage locale et offline pour Secret Union. Conçu pour performer.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
