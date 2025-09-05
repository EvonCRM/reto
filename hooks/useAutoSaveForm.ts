'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { upsertForm } from '@/lib/forms/forms-store';
import type { FormConfig } from '@/types/form';

type Status = 'idle' | 'saving' | 'saved' | 'error';

export function useAutosaveForm(opts: {
  form: FormConfig;
  id?: string; // editingId si existe
  onFirstSave?: (newId: string) => void; // para actualizar la URL la 1a vez
  delay?: number; // debounce ms
}) {
  const { form, id, onFirstSave, delay = 800 } = opts;
  const [status, setStatus] = useState<Status>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  // snapshot para evitar escrituras redundantes
  const lastJsonRef = useRef<string>('');
  const firstSavedIdRef = useRef<string | null>(id ?? null);
  const timerRef = useRef<number | null>(null);

  // Stringify una sola vez por render (profundo)
  const json = useMemo(() => JSON.stringify(form), [form]);

  // Guarda inmediatamente (sin debounce). Útil en beforeunload/visibilitychange.
  const flush = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    return doSave();
  };

  const doSave = () => {
    // no guardes si no hay cambios
    if (json === lastJsonRef.current) return;
    setStatus('saving');
    try {
      const savedId = upsertForm(form, {
        id: firstSavedIdRef.current ?? id,
        theme: 'elegant',
        coverUrl: form.backgroundUrl ?? undefined
      });
      // fija id inicial si no había
      if (!firstSavedIdRef.current) {
        firstSavedIdRef.current = savedId;
        onFirstSave?.(savedId);
      }
      lastJsonRef.current = json;
      setLastSavedAt(Date.now());
      setStatus('saved');
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  // Debounce en cambios de form
  useEffect(() => {
    if (json === lastJsonRef.current) return;
    setStatus('saving');
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(doSave, delay) as unknown as number;
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [json, delay]);

  // Guardar al cambiar de pestaña/cerrar
  useEffect(() => {
    const onHide = () => flush();
    const onBeforeUnload = () => flush();
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [json]);

  return { status, lastSavedAt, flush, id: firstSavedIdRef.current ?? id };
}
