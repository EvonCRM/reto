'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { listForms } from '@/lib/forms/forms-store';
import type { FormMeta } from '@/types/form';

export default function FormsTabContent() {
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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar formularios…"
          className="rounded border px-3 py-2 text-sm"
          aria-label="Buscar formularios"
        />
        <div className="ml-auto text-xs text-gray-500">
          {filtered.length} resultado(s)
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center text-gray-600">
          Aún no tienes formularios. ¡Crea el primero! ✨
          <div className="mt-3">
            <Link
              href="/dashboard/form-builder"
              className="rounded bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700"
            >
              Crear formulario
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <article
              key={m.id}
              className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
            >
              <div
                className="h-24 w-full bg-cover bg-center"
                style={{
                  backgroundImage: m.coverUrl
                    ? `url(${m.coverUrl})`
                    : 'linear-gradient(135deg,#e0e7ff,#fde68a)'
                }}
              />
              <div className="space-y-2 p-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] capitalize">
                    {m.type}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px]">
                    {m.theme}
                  </span>
                  <span className="ml-auto text-[11px] text-gray-500">
                    {m.stepsCount} pasos · {m.fieldsCount} campos
                  </span>
                </div>
                <h3 className="line-clamp-1 text-sm font-semibold">
                  {m.title}
                </h3>
                {m.description && (
                  <p className="line-clamp-2 text-xs text-gray-600">
                    {m.description}
                  </p>
                )}
                {/* Acciones (misma altura que "Editar") */}
                <div className="mt-2 flex items-center gap-2 pt-1">
                  <Link
                    href={`/dashboard/form-builder?id=${m.id}&from=forms`}
                    className="rounded border px-2 py-1 text-xs hover:bg-gray-50
               dark:border-zinc-700 dark:hover:bg-zinc-800"
                  >
                    ✏️ Editar
                  </Link>

                  <Link
                    href={`/dashboard/forms/${m.id}`}
                    className="rounded border px-2 py-1 text-xs hover:bg-gray-50
               dark:border-zinc-700 dark:hover:bg-zinc-800"
                  >
                    👀 Preview
                  </Link>

                  {/* Eliminar alineado a la derecha */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (!window.confirm('¿Eliminar este formulario?')) return;
                      deleteForm(m.id); // tu función del store
                      setItems((prev) => prev.filter((x) => x.id !== m.id)); // refrescar UI
                    }}
                    title="Eliminar formulario"
                    aria-label="Eliminar formulario"
                    className="
      ml-auto inline-flex items-center gap-1 rounded-md border border-red-500/30 px-2 py-1
      text-xs text-red-600 hover:bg-red-50
      focus:outline-none focus:ring-2 focus:ring-red-500/50
      dark:border-red-400/30 dark:text-red-400 dark:hover:bg-red-500/10
    "
                  >
                    🗑 Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      {/* FAB móvil (opcional) */}
      <Link
        href="/dashboard/form-builder"
        className="fixed bottom-6 right-6 rounded-full bg-indigo-600 p-4 text-white shadow-lg hover:bg-indigo-700 sm:hidden"
        aria-label="Crear formulario"
      >
        +
      </Link>
    </div>
  );
}
