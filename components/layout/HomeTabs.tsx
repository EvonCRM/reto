'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/dashboard/home/forms', label: 'My forms', emoji: '🧰' },
  { href: '/dashboard/home/templates', label: 'Templates', emoji: '🎨' }
];

export default function HomeTabNav() {
  const pathname = usePathname();
  return (
    <div
      role="tablist"
      className="inline-flex overflow-hidden rounded-lg border border-input bg-background"
    >
      {TABS.map((t, i) => {
        const active = pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            role="tab"
            aria-selected={active}
            className={[
              'px-4 py-2 text-sm transition',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              i !== 0 ? 'border-l border-input' : '',
              active
                ? 'bg-[hsl(var(--active))] text-white'
                : 'bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
            ].join(' ')}
          >
            <span className="mr-1">{t.emoji}</span>
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
