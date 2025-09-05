// lib/forms/forms-store.ts
// ÚNICO punto de verdad para formularios en LocalStorage

import type { FormConfig } from '@/types/form';

const FORMS_KEY = 'app:forms';
const META_KEY = 'app:forms-meta';

export type FormsDb<T> = Record<string, T>;

export type FormMeta = {
  id: string;
  title?: string;
  description?: string;
  theme?: string;
  coverUrl?: string;
  type?: 'simple' | 'multi-step';
  stepsCount?: number;
  fieldsCount?: number;
  updatedAt?: number;
  createdAt?: number;
};

const isBrowser = () => typeof window !== 'undefined';
function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function readDb<T = any>(): FormsDb<T> {
  if (!isBrowser()) return {} as FormsDb<T>;
  return safeParse<FormsDb<T>>(localStorage.getItem(FORMS_KEY), {});
}
function writeDb<T = any>(db: FormsDb<T>) {
  if (!isBrowser()) return;
  localStorage.setItem(FORMS_KEY, JSON.stringify(db));
}

function readMeta(): FormsDb<FormMeta> {
  if (!isBrowser()) return {};
  return safeParse<FormsDb<FormMeta>>(localStorage.getItem(META_KEY), {});
}
function writeMeta(meta: FormsDb<FormMeta>) {
  if (!isBrowser()) return;
  localStorage.setItem(META_KEY, JSON.stringify(meta));
}

/** Calcula metadatos básicos a partir del FormConfig */
function computeMetaFromForm(
  id: string,
  form: FormConfig,
  prev?: FormMeta
): FormMeta {
  const stepsCount = form.steps?.length ?? 0;
  const fieldsCount =
    form.steps?.reduce((acc, s) => acc + (s.fields?.length ?? 0), 0) ?? 0;
  return {
    id,
    title: form.title,
    description: form.description,
    type: form.type,
    stepsCount,
    fieldsCount,
    theme: prev?.theme ?? undefined,
    coverUrl: prev?.coverUrl ?? form.backgroundUrl ?? undefined,
    createdAt: prev?.createdAt ?? Date.now(),
    updatedAt: Date.now()
  };
}

/** Crea o actualiza un form. Si no pasas id, genera uno. Devuelve el id. */
export function upsertForm(
  form: FormConfig,
  opts?: { id?: string; theme?: string; coverUrl?: string }
): string {
  const id =
    opts?.id ??
    (isBrowser() ? crypto.randomUUID() : Math.random().toString(36).slice(2));

  const db = readDb<FormConfig>();
  db[id] = form;
  writeDb(db);

  const mb = readMeta();
  const prev = mb[id];
  mb[id] = {
    ...computeMetaFromForm(id, form, prev),
    theme: opts?.theme ?? mb[id]?.theme,
    coverUrl: opts?.coverUrl ?? mb[id]?.coverUrl ?? form.backgroundUrl
  };
  writeMeta(mb);

  return id;
}

export function getForm(id: string): FormConfig | null {
  const db = readDb<FormConfig>();
  const f = db[id] ?? null;
  // Migración suave: si no trae backgroundUrl y meta tiene coverUrl, inyectar
  if (f && !f.backgroundUrl) {
    const mb = readMeta();
    const cover = mb[id]?.coverUrl;
    if (cover) f.backgroundUrl = cover;
  }
  return f;
}

/** Actualiza parcialmente un form existente (parcial profundo simple) */
export function updateForm(
  id: string,
  patch: Partial<FormConfig>
): FormConfig | null {
  const db = readDb<FormConfig>();
  const prev = db[id];
  if (!prev) return null;
  const merged = { ...prev, ...patch } as FormConfig;
  db[id] = merged;
  writeDb(db);

  const mb = readMeta();
  mb[id] = computeMetaFromForm(id, merged, mb[id]);
  writeMeta(mb);

  return merged;
}

export function deleteForm(id: string) {
  const db = readDb<FormConfig>(); // usa la misma base
  const mb = readMeta(); // y el meta
  if (!db[id]) return;
  delete db[id];
  delete mb[id];
  writeDb(db);
  writeMeta(mb);
}

export function duplicateForm(id: string): string | null {
  const original = getForm(id);
  if (!original) return null;
  const clone: FormConfig = JSON.parse(JSON.stringify(original));
  // Cambios visuales mínimos
  clone.title = `${clone.title ?? 'Formulario'} (copia)`;
  const newId = upsertForm(clone, {
    theme: readMeta()[id]?.theme,
    coverUrl: readMeta()[id]?.coverUrl ?? original.backgroundUrl
  });
  return newId;
}

export function listForms(): FormMeta[] {
  const mb = readMeta();
  return Object.values(mb).sort(
    (a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0)
  );
}

export function getMeta(id: string): FormMeta | null {
  const mb = readMeta();
  return mb[id] ?? null;
}

export function updateMeta(
  id: string,
  patch: Partial<FormMeta>
): FormMeta | null {
  const mb = readMeta();
  const prev = mb[id];
  if (!prev) return null;
  const next = { ...prev, ...patch, id, updatedAt: Date.now() };
  mb[id] = next;
  writeMeta(mb);
  return next;
}

export function clearAllForms() {
  if (!isBrowser()) return;
  localStorage.removeItem(FORMS_KEY);
  localStorage.removeItem(META_KEY);
}

/** Migra todos los forms: si no tienen backgroundUrl pero sí coverUrl en meta, inyecta */
export function migrateFormsBackground() {
  const db = readDb<FormConfig>();
  const mb = readMeta();
  let changed = 0;
  for (const id of Object.keys(db)) {
    const f = db[id];
    if (!f.backgroundUrl && mb[id]?.coverUrl) {
      f.backgroundUrl = mb[id]!.coverUrl;
      db[id] = f;
      mb[id] = computeMetaFromForm(id, f, mb[id]);
      changed++;
    }
  }
  if (changed > 0) {
    writeDb(db);
    writeMeta(mb);
  }
  return changed;
}
