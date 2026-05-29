export default function Footer() {
  return (
    <footer className="relative z-10 py-6 text-center">
      <p className="text-sm text-white/50">
        Creado con{' '}
        <span className="text-accent-400" aria-hidden="true">
          ♥
        </span>{' '}
        por{' '}
        <span className="font-semibold text-white/80">BORC STUDIOS</span>
        {' · '}
        <a
          href="https://www.alexbope75.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-300 hover:text-brand-200 transition-colors"
        >
          Alexander Bone
        </a>
      </p>
    </footer>
  );
}
