// lib/form-cover-options.ts
import { FORM_TEMPLATES } from '@/lib/forms/form-templates';

export type CoverOption = { label: string; url: string };

export const COVER_OPTIONS: CoverOption[] = (() => {
  const seen = new Set<string>();
  const base: CoverOption[] = [
    {
      label: 'Default (notebook)',
      url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1800&auto=format&fit=crop'
    }
  ];

  FORM_TEMPLATES.forEach((t) => {
    if (t.coverUrl && !seen.has(t.coverUrl)) {
      base.push({ label: t.name, url: t.coverUrl });
      seen.add(t.coverUrl);
    }
  });

  return base;
})();
