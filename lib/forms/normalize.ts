// lib/forms/normalize.ts
import type { FieldConfig, FormConfig, FormStep } from '@/types/form';

export function toOneFieldPerStep(form: FormConfig): FormConfig {
  const all: FieldConfig[] = form.steps.flatMap((s) => s.fields ?? []);
  const steps: FormStep[] = all.map((f, idx) => ({
    id: `step-${idx + 1}`,
    title: f.label || `Paso ${idx + 1}`,
    fields: [f]
  }));
  return {
    ...form,
    type: 'multi-step',
    steps: steps.length
      ? steps
      : [{ id: 'step-1', title: 'Paso 1', fields: [] }]
  };
}
