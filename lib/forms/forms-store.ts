import { FormConfig, FormMeta, StoredForm, ThemeId } from '@/types/form';

const LS_KEY = 'form-builder:forms';

function readAll(): StoredForm[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(list: StoredForm[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

export function listForms(): FormMeta[] {
  return readAll()
    .sort((a, b) => +new Date(b.meta.updatedAt) - +new Date(a.meta.updatedAt))
    .map((x) => x.meta);
}

export function getFormById(id: string): StoredForm | undefined {
  return readAll().find((f) => f.meta.id === id);
}

export function upsertForm(
  config: FormConfig,
  opts?: { id?: string; theme?: ThemeId; coverUrl?: string }
): string {
  const all = readAll();
  const id = opts?.id ?? crypto.randomUUID();

  const meta: FormMeta = {
    id,
    title: config.title || 'Sin título',
    description: config.description ?? '',
    type: config.type,
    theme: opts?.theme ?? 'light',
    coverUrl: opts?.coverUrl,
    updatedAt: new Date().toISOString(),
    fieldsCount: config.steps.reduce((acc, s) => acc + s.fields.length, 0),
    stepsCount: config.steps.length
  };

  const existingIdx = all.findIndex((f) => f.meta.id === id);
  const stored: StoredForm = { meta, config };

  if (existingIdx >= 0) {
    all[existingIdx] = stored;
  } else {
    all.unshift(stored);
  }
  writeAll(all);
  return id;
}

export function duplicateForm(id: string): string | undefined {
  const all = readAll();
  const base = all.find((f) => f.meta.id === id);
  if (!base) return;
  const newId = crypto.randomUUID();
  const copy: StoredForm = {
    meta: {
      ...base.meta,
      id: newId,
      title: base.meta.title + ' (Copia)',
      updatedAt: new Date().toISOString()
    },
    config: { ...base.config, title: base.config.title + ' (Copia)' }
  };
  all.unshift(copy);
  writeAll(all);
  return newId;
}

export function removeForm(id: string) {
  const next = readAll().filter((f) => f.meta.id !== id);
  writeAll(next);
}
