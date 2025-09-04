'use client';

import Link from 'next/link';

import HomeTabs from '@/components/layout/HomeTabs';

export default function TemplatesTabPage() {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <HomeTabs />
        <Link
          href="/dashboard/templates"
          className="rounded border px-3 py-2 text-sm hover:bg-gray-50"
        >
          Ver galería
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-3">
        {[
          { emoji: '📬', name: 'Contacto' },
          { emoji: '🎯', name: 'Feedback' },
          { emoji: '🛠️', name: 'Soporte' }
        ].map((t) => (
          <Link
            key={t.name}
            href="/dashboard/templates"
            // centradas en sm/md con mx-auto + max-w; en lg ya ocupan su columna
            className="mx-auto flex w-[260px] max-w-[260px] flex-col items-center justify-center rounded-xl border bg-background p-6 text-center transition hover:shadow-md"
          >
            <div className="text-3xl">{t.emoji}</div>
            <div className="mt-2 text-sm font-semibold">{t.name}</div>
            <p className="mt-1 text-xs text-gray-500">Usar este template</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
