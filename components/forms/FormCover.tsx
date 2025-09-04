'use client';

import clsx from 'clsx';

import { fontClassFor } from '@/lib/fonts/fonts';
import type { FormConfig } from '@/types/form';

type Props = {
  form: FormConfig;
  onStart?: () => void; // callback al pulsar “Comenzar”
  ctaLabel?: string; // texto del botón
};

export default function FormCover({
  form,
  onStart,
  ctaLabel = 'Comenzar'
}: Props) {
  const bg = form.backgroundUrl;
  const tint = form.backgroundTint ?? 'dark';

  return (
    <section
      className={clsx(
        'relative overflow-hidden rounded-xl border shadow-sm',
        fontClassFor(form.fontTheme)
      )}
      aria-label="Portada del formulario"
    >
      {/* Fondo */}
      {bg && (
        <div
          aria-hidden
          className="absolute inset-0 bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize:
              form.backgroundMode === 'contain' ? 'contain' : 'cover'
          }}
        />
      )}
      {/* Overlay */}
      <div
        aria-hidden
        className={clsx(
          'absolute inset-0',
          tint === 'darker'
            ? 'bg-black/55'
            : tint === 'dark'
              ? 'bg-black/40'
              : tint === 'medium'
                ? 'bg-black/25'
                : tint === 'light'
                  ? 'bg-black/10'
                  : 'bg-transparent'
        )}
      />

      {/* Contenido */}
      <div className="relative grid min-h-[320px] place-items-center p-8 text-center sm:min-h-[420px]">
        <div className="max-w-2xl space-y-3">
          {form.infoTop && (
            <span className="inline-block rounded-full border border-white/70 px-3 py-1 text-xs text-white/90 backdrop-blur-sm">
              {form.infoTop}
            </span>
          )}
          <h1 className="text-2xl font-bold leading-tight text-white drop-shadow sm:text-3xl">
            {form.title || 'Formulario'}
          </h1>
          {form.description && (
            <p className="mx-auto max-w-xl text-sm text-white/90 drop-shadow">
              {form.description}
            </p>
          )}

          {onStart && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onStart}
                className="rounded border border-white/85 bg-transparent px-4 py-2 text-sm text-white hover:bg-white/10"
              >
                {ctaLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
