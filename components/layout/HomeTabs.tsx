'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/dashboard/home/forms', label: 'Mis formularios', emoji: '🧰' },
  { href: '/dashboard/home/templates', label: 'Templates', emoji: '🎨' }
];

export default function HomeTabNav() {
  const pathname = usePathname();
  return (
    <div
      className="inline-flex overflow-hidden rounded-lg border"
      role="tablist"
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
              active ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-gray-50',
              i !== 0 ? 'border-l' : ''
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
