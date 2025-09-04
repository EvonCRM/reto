// app/dashboard/templates/page.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import HomeTabs from '@/components/layout/HomeTabs';
import { FORM_TEMPLATES } from '@/lib/forms/form-templates';
import { upsertForm } from '@/lib/forms/forms-store';
import { toOneFieldPerStep } from '@/lib/forms/normalize';

// Grid fluido + cards centradas de tamaño consistente
export default function TemplatesPage() {
  const router = useRouter();

  const onUseTemplate = (tplId: string) => {
    const tpl = FORM_TEMPLATES.find((t) => t.id === tplId);
    if (!tpl) return;

    const formCopy = structuredClone(tpl.form);
    formCopy.backgroundUrl = tpl.coverUrl;
    formCopy.backgroundMode = 'cover';
    formCopy.backgroundTint = formCopy.backgroundTint ?? 'dark';

    const normalized = toOneFieldPerStep(formCopy);

    const newId = upsertForm(normalized, {
      theme: tpl.theme,
      coverUrl: tpl.coverUrl
    });
    router.push(`/dashboard/form-builder?id=${newId}&from=templates`);
  };

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <HomeTabs />
        {/* <Link
          href="/dashboard/form-builder?from=forms"
          className="rounded bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700"
        >
          ➕ Nuevo
        </Link> */}
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-semibold">Elige un template</h1>
        <Link
          href="/dashboard/home/templates"
          className="text-xs text-indigo-600 hover:underline"
        >
          ← Volver
        </Link>
      </div>

      <div className="grid justify-items-center gap-6 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        {FORM_TEMPLATES.map((t) => (
          <article
            key={t.id}
            className="min-h-[320px] w-full max-w-[320px] overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
          >
            <div
              className="h-28 w-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${t.coverUrl})`
              }}
            />
            <div className="space-y-2 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px]">
                  {t.theme}
                </span>
              </div>
              <h3 className="line-clamp-1 text-sm font-semibold">{t.name}</h3>
              <p className="line-clamp-2 text-xs text-gray-600">
                {t.description}
              </p>
            </div>
            <div className="flex items-center gap-2 p-4 pt-0">
              <button
                onClick={() => onUseTemplate(t.id)}
                className="w-full rounded bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700"
              >
                Usar este template
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
