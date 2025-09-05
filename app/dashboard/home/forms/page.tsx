'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { PlusIcon, Trash } from 'lucide-react';

import HomeTabs from '@/components/layout/HomeTabs';
import { deleteForm, listForms } from '@/lib/forms/forms-store';
import type { FormMeta } from '@/types/form';

export default function FormsTabPage() {
  const [items, setItems] = useState<FormMeta[]>([]);
  const [q, setQ] = useState('');
  useEffect(() => {
    setItems(listForms());
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((m) =>
      [m.title, m.description].join(' ').toLowerCase().includes(s)
    );
  }, [items, q]);

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <HomeTabs />
        <Link
          href="/dashboard/form-builder?from=forms"
          className="inline-flex items-center gap-1 rounded-md bg-[hsl(var(--active))] px-3 py-2 text-sm text-white shadow-sm hover:bg-[hsl(var(--active))]/90"
        >
          <PlusIcon className="w-5" />
          Create
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search..."
          className="
            h-9 w-full max-w-xs rounded-md border border-input bg-background
            px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
          "
        />
        <div className="ml-auto text-xs text-muted-foreground">
          {filtered.length} resultado(s)
        </div>
      </div>

      {/* Grid / Empty */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          Aún no tienes formularios. ¡Crea el primero! ✨
          <div className="mt-3">
            <Link
              href="/dashboard/form-builder?from=forms"
              className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              Crear formulario
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid justify-items-center gap-6 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
          {filtered.map((m) => (
            <article
              key={m.id}
              className="
                flex min-h-[300px] w-[260px] flex-col overflow-hidden rounded-xl
                border bg-card text-card-foreground shadow-sm transition hover:shadow-md
              "
            >
              <div
                className="h-24 w-full bg-muted bg-cover bg-center"
                style={{
                  backgroundImage: m.coverUrl ? `url(${m.coverUrl})` : undefined
                }}
              />

              <div className="flex-1 space-y-2 p-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] capitalize">
                    {m.type}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">
                    {m.theme}
                  </span>
                  <span className="ml-auto text-[11px] text-muted-foreground">
                    {m.stepsCount} steps · {m.fieldsCount} fields
                  </span>
                </div>

                <h3 className="line-clamp-1 text-sm font-semibold">
                  {m.title}
                </h3>

                {m.description && (
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {m.description}
                  </p>
                )}
              </div>

              {/* Acciones (misma altura que "Editar") */}
              <div className="my-2 flex items-center justify-evenly gap-2 p-2">
                <Link
                  href={`/dashboard/form-builder?id=${m.id}&from=forms`}
                  className="
                    rounded border border-input bg-background px-2 py-1 text-xs
                    hover:bg-accent hover:text-accent-foreground
                  "
                >
                  ✏️ Edit
                </Link>

                {/* <Link
                  href={`/dashboard/forms/${m.id}`}
                  className="
                    rounded border border-input bg-background px-2 py-1 text-xs
                    hover:bg-accent hover:text-accent-foreground
                  "
                >
                  👀 Preview
                </Link> */}

                {/* Eliminar alineado a la derecha */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (!window.confirm('¿Eliminar este formulario?')) return;
                    deleteForm(m.id);
                    setItems((prev) => prev.filter((x) => x.id !== m.id));
                  }}
                  title="Eliminar formulario"
                  aria-label="Eliminar formulario"
                  className="inline-flex items-center gap-1 rounded border border-input bg-background px-2 py-1 text-xs text-black hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-white"
                >
                  <Trash className="size-4" />
                  <span>Delete</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* FAB móvil opcional */}
      <Link
        href="/dashboard/form-builder?from=forms"
        className="fixed bottom-6 right-6 rounded-full bg-primary p-4 text-primary-foreground shadow-lg hover:bg-primary/90 sm:hidden"
        aria-label="Crear formulario"
      >
        +
      </Link>
    </section>
  );
}
