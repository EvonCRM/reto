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
    formCopy.backgroundTint = formCopy.backgroundTint ?? 'darker';
    formCopy.fontTheme = formCopy.fontTheme ?? 'default';

    const normalized = toOneFieldPerStep(formCopy);

    const id = upsertForm(normalized, {
      theme: tpl.theme,
      coverUrl: tpl.coverUrl
    });
    router.push(`/dashboard/form-builder?id=${id}&from=templates`);
  };

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <HomeTabs />
        {/* CTA opcional
        <Link
          href="/dashboard/form-builder?from=forms"
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          ➕ Nuevo
        </Link> */}
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-sm font-semibold text-foreground">
          Choose a template
        </h1>
        <Link
          href="/dashboard/home/templates"
          className="rounded text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          ← Back
        </Link>
      </div>

      <div className="grid justify-items-center gap-6 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        {FORM_TEMPLATES.map((t) => (
          <article
            key={t.id}
            className="
              min-h-[320px] w-full max-w-[320px] overflow-hidden rounded-xl
              border border-input bg-card text-card-foreground shadow-sm
              transition hover:shadow-md
            "
          >
            <div
              className="h-28 w-full bg-muted bg-cover bg-center"
              style={{
                backgroundImage: t.coverUrl ? `url(${t.coverUrl})` : undefined
              }}
            />

            <div className="space-y-2 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">
                  {t.theme}
                </span>
              </div>

              <h3 className="line-clamp-1 text-sm font-semibold">{t.name}</h3>
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {t.description}
              </p>
            </div>

            <div className="flex items-center gap-2 p-4 pt-0">
              <button
                onClick={() => onUseTemplate(t.id)}
                className="
                  w-full rounded-md bg-[hsl(var(--active))] px-3 py-2 text-sm
                  text-white shadow-sm hover:opacity-95
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                "
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
