
export const Icon = ({ name, className = 'w-5 h-5' }: any) => {
  const common = 'stroke-current';
  switch (name) {
    case 'autocomplete':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M5 7h14M5 12h9M5 17h6" strokeWidth="1.8" className={common} />
        </svg>
      );
    case 'button':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="4" y="8" width="16" height="8" rx="4" strokeWidth="1.8" className={common} />
        </svg>
      );
    case 'checkbox':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="4" y="6" width="16" height="12" rx="2" strokeWidth="1.8" className={common} />
          <path d="M8 12l2.5 2.5L16 9" strokeWidth="1.8" className={common} />
        </svg>
      );
    case 'date':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="3.5" y="5" width="17" height="15" rx="2" strokeWidth="1.8" className={common} />
          <path d="M8 3.5v3M16 3.5v3M3.5 9h17" strokeWidth="1.8" className={common} />
        </svg>
      );
    case 'upload':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M12 16V7m0 0l-3.5 3.5M12 7l3.5 3.5" strokeWidth="1.8" className={common} />
          <rect x="4" y="16" width="16" height="4" rx="1.5" className="fill-current" />
        </svg>
      );
    case 'header':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M5 6h14M5 12h14M5 18h10" strokeWidth="1.8" className={common} />
        </svg>
      );
    case 'hidden':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" strokeWidth="1.8" className={common} />
          <circle cx="12" cy="12" r="2" className={common} />
        </svg>
      );
    case 'number':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M9 3v18M15 3v18M4 9h16M4 15h16" strokeWidth="1.8" className={common} />
        </svg>
      );
    case 'paragraph':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M6 6h12M6 10h10M6 14h8M6 18h6" strokeWidth="1.8" className={common} />
        </svg>
      );
    case 'radio':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="8" cy="12" r="3.2" strokeWidth="1.8" className={common} />
          <circle cx="16" cy="12" r="3.2" strokeWidth="1.8" className={common} />
        </svg>
      );
    case 'select':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="4" y="6" width="16" height="12" rx="2" strokeWidth="1.8" className={common} />
          <path d="M8 10l4 4 4-4" strokeWidth="1.8" className={common} />
        </svg>
      );
    case 'text':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M4 6h16M10 6v12" strokeWidth="1.8" className={common} />
        </svg>
      );
    case 'textarea':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="4" y="6" width="16" height="12" rx="2" strokeWidth="1.8" className={common} />
          <path d="M8 10h8M8 14h6" strokeWidth="1.8" className={common} />
        </svg>
      );
    default:
      return null;
  }
};
