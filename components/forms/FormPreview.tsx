'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { fontClassFor } from '@/lib/fonts/fonts';
import { VALIDATION_PATTERNS } from '@/schemas/forms/patterns';
import type { FieldConfig, FieldSelectConfig, FormConfig } from '@/types/form';

import FormCover from './FormCover';

/**
 * Genera un esquema de validación de Zod a partir de una lista de campos.
 */
function generateSchema(fields: FieldConfig[]) {
  const schemaShape: Record<string, z.ZodTypeAny> = {};
  fields.forEach((field) => {
    // --- SELECT (simple / múltiple) ---
    if (field.type === 'select') {
      const f = field as FieldSelectConfig;

      // opciones seguras (evita undefined)
      const options = Array.isArray(f.options) ? f.options : [];
      const optionValues = options.map((o) => o.value);
      const multiple = !!f.multiple;

      if (multiple) {
        let v: any = z.array(z.string());
        if (field.required) v = v.min(1, 'Selecciona al menos una opción');
        if (typeof f.minSelected === 'number')
          v = v.min(f.minSelected, `Choose at least ${f.minSelected}`);
        if (typeof f.maxSelected === 'number')
          v = v.max(f.maxSelected, `Choose at most ${f.maxSelected}`);
        if (!f.allowCustom) {
          v = v.refine(
            (arr: string) => arr.every((val) => optionValues.includes(val)),
            {
              message: 'Una o más opciones no son válidas'
            }
          );
        }
        schemaShape[field.name] = v;
      } else {
        let v = z.string();
        if (field.required) v = v.min(1, 'Required field');
        if (!f.allowCustom) {
          v = v.refine((val) => optionValues.includes(val), {
            message: 'Opción inválida'
          });
        }
        schemaShape[field.name] = v;
      }

      return;
    }
    let validator: z.ZodString = z.string();
    if (field.required) {
      validator = validator.min(1, 'Required field');
    }
    const v = field.validations;
    if (v?.minLength) {
      validator = validator.min(
        v.minLength,
        `You must type at least ${v.minLength} characters`
      );
    }
    if (v?.maxLength) {
      validator = validator.max(
        v.maxLength,
        `You must type at most ${v.maxLength} characters`
      );
    }
    if (v?.regex) {
      if (v.regex !== 'custom') {
        const pattern = VALIDATION_PATTERNS[v.regex]?.pattern;
        if (pattern) {
          validator = validator.regex(
            pattern,
            VALIDATION_PATTERNS[v.regex]?.message
          );
        }
      } else if (v.customRegex) {
        try {
          const customPattern = new RegExp(v.customRegex);
          validator = validator.regex(customPattern, 'Formato inválido');
        } catch {}
      }
    }
    schemaShape[field.name] = validator;
  });

  return z.object(schemaShape);
}

type PreviewProps = {
  form: FormConfig;
  previewStep: number;
  setPreviewStep: (n: number) => void;
  previewMode?: boolean;
  coverEnabled?: boolean;
};

function FormPreview({
  form,
  previewStep,
  setPreviewStep,
  previewMode = true,
  coverEnabled = true
}: PreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const allFields = useMemo(
    () => (form.steps ?? []).flatMap((s) => s.fields ?? []),
    [form.steps]
  );

  // 2) Esquema global (no por paso)
  const fullSchema = useMemo(() => generateSchema(allFields), [allFields]);

  const stepFields: FieldConfig[] = useMemo(() => {
    if (form.type === 'multi-step') {
      if (previewStep < 0) return []; // portada
      return form.steps?.[previewStep]?.fields ?? [];
    }
    // simple
    return form.steps?.[0]?.fields ?? [];
  }, [form.type, form.steps, previewStep]);

  const defaultValues = useMemo(() => {
    const d: Record<string, any> = {};
    for (const f of allFields) {
      if (f.type === 'select' && (f as FieldSelectConfig).multiple)
        d[f.name] = [];
      else d[f.name] = '';
    }
    return d;
  }, [allFields]);

  const prefixCount = useMemo(() => {
    if (form.type !== 'multi-step' || previewStep < 0) return 0;
    return form.steps
      .slice(0, previewStep)
      .reduce((acc, s) => acc + (s.fields?.length ?? 0), 0);
  }, [form.type, form.steps, previewStep]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    trigger,
    setFocus,
    getValues,
    watch
  } = useForm({
    resolver: zodResolver(fullSchema),
    shouldUnregister: false,
    defaultValues
  });

  useEffect(() => {
    if (previewStep < 0) return;
    const defaultValues: Record<string, any> = {};
    stepFields.forEach((field) => {
      defaultValues[field.name] =
        formData[field.name] ??
        (field.type === 'select' && (field as any).multiple ? [] : '');
    });
    // reset(defaultValues);
  }, [previewStep, stepFields, formData, reset]);

  const last =
    form.type === 'multi-step' ? Math.max(0, (form.steps?.length ?? 1) - 1) : 0;

  const coverEnabledSafe = !!coverEnabled;
  const clamp = (n: number) =>
    Math.max(coverEnabledSafe ? -1 : 0, Math.min(n, last));

  const onStart = () => goto(0);

  const onBack = () => {
    console.log('onBack called:', {
      previewStep,
      coverEnabledSafe,
      coverEnabled
    });

    if (previewStep === -1) return;

    if (previewStep === 0 && coverEnabledSafe) {
      console.log('Going to cover: goto(-1)');
      return goto(-1);
    }

    console.log('Going back one step:', previewStep - 1);
    return goto(previewStep - 1);
  };

  const goto = (n: number) => {
    const clampedValue = clamp(n);
    console.log('goto called:', {
      requested: n,
      clamped: clampedValue,
      coverEnabledSafe,
      range: `${coverEnabledSafe ? -1 : 0} to ${last}`
    });
    setPreviewStep(clampedValue);
  };

  function focusFirstError() {
    const firstKey = Object.keys(errors ?? {})[0];
    if (firstKey) setFocus(firstKey as any, { shouldSelect: true });
  }

  const onNext = async () => {
    if (previewStep === -1) return goto(0);

    // Nombres de campos del paso actual
    const names = stepFields.map((f) => f.name);
    const ok = await trigger(names); // 👈 valida SOLO el paso visible
    if (!ok) {
      // Enfoca el primer error del paso
      const firstErr = names.find((n) => !!(errors as any)[n]);
      if (firstErr) setFocus(firstErr as any);
      return;
    }
    if (previewStep < last) return goto(previewStep + 1);
  };

  const showCover = coverEnabledSafe && previewStep === -1;

  useEffect(() => {
    if (form.cover?.enabled) {
      setPreviewStep(-1);
    } else {
      setPreviewStep((prev) => (prev < 0 ? 0 : prev));
    }
  }, [form.cover?.enabled]);

  useEffect(() => {
    const sub = watch((vals) => {
      console.log('snapshot', vals);
    });
    return () => sub.unsubscribe();
  }, [watch]);

  return (
    <div className="flex h-[70vh] min-h-0 flex-col">
      {/* Título fuera del fondo */}
      <div className="shrink-0 px-4 py-2">
        <h2 className="text-xl font-semibold">Preview</h2>
      </div>

      {/* Área con fondo */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {/* Fondo (siempre debajo) */}
        {form.backgroundUrl && (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${form.backgroundUrl})`,
                backgroundSize:
                  form.backgroundMode === 'contain' ? 'contain' : 'cover'
              }}
            />
            <div
              aria-hidden
              className={
                {
                  light: 'pointer-events-none absolute inset-0 z-0 bg-black/10',
                  medium:
                    'pointer-events-none absolute inset-0 z-0 bg-black/25',
                  dark: 'pointer-events-none absolute inset-0 z-0 bg-black/40',
                  darker:
                    'pointer-events-none absolute inset-0 z-0 bg-black/55',
                  none: ''
                }[form.backgroundTint || 'dark']
              }
            />
          </>
        )}
        <div
          className={clsx(
            'relative z-10 h-full overflow-y-auto p-4',
            fontClassFor(form.fontTheme)
          )}
        >
          <div className="grid min-h-full place-items-center p-4">
            {/* PORTADA (paso -1) */}
            <div className={showCover ? 'w-full max-w-2xl' : 'w-full max-w-lg'}>
              {showCover ? (
                <FormCover
                  form={form}
                  onStart={onStart}
                  ctaLabel="Start"
                />
              ) : (
                <div className="grid min-h-full place-items-center">
                  <div className="w-full max-w-lg">
                    <form
                      onSubmit={handleSubmit(() => {})}
                      className="space-y-5 rounded-lg bg-transparent p-0"
                      noValidate
                    >
                      {stepFields.map((field, i) => {
                        const qn = prefixCount + i + 1;
                        return (
                          <div
                            key={field.id}
                            className="space-y-2"
                          >
                            {/* número + label */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center text-white">
                                <span className="grid size-6 place-content-center rounded-full border border-white/90 text-[11px] font-semibold">
                                  {qn}
                                </span>
                              </div>
                              <label className="block text-sm font-medium text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
                                {field.label}
                                {field.required && (
                                  <span className="text-red-300"> *</span>
                                )}
                              </label>
                            </div>

                            {/* inputs */}
                            {field.type === 'text' && (
                              <input
                                type="text"
                                className="mt-1 block w-full rounded border border-white/85 bg-transparent px-3 py-2 text-sm text-white shadow-none placeholder:text-white/70 focus:border-white focus:ring-white/80"
                                placeholder={field.placeholder || ''}
                                {...register(field.name)}
                              />
                            )}

                            {field.type === 'date' && (
                              <input
                                type="date"
                                className={`mt-1 block w-full rounded border border-white/80 bg-transparent text-sm text-white shadow-none [color-scheme:dark] placeholder:text-white/70 focus:border-white focus:ring-white/80 ${errors[field.name] ? 'border-red-300 focus:border-red-300 focus:ring-red-300/60' : ''}`}
                                {...register(field.name)}
                              />
                            )}

                            {field.type === 'textarea' && (
                              <textarea
                                rows={4}
                                className={`mt-1 block w-full rounded border border-white/80 bg-transparent text-sm text-white shadow-none placeholder:text-white/70 focus:border-white focus:ring-white/80 ${errors[field.name] ? 'border-red-300 focus:border-red-300 focus:ring-red-300/60' : ''}`}
                                placeholder={field.placeholder || ''}
                                {...register(field.name)}
                              />
                            )}

                            {field.type === 'select' && field.multiple && (
                              <Controller
                                control={control}
                                name={field.name}
                                render={({ field: rhf }) => {
                                  const value: string[] = Array.isArray(
                                    rhf.value
                                  )
                                    ? rhf.value
                                    : [];
                                  return (
                                    <div className="mt-1 space-y-2">
                                      {(field.options ?? []).map((opt) => {
                                        const checked = value.includes(
                                          opt.value
                                        );
                                        return (
                                          <label
                                            key={opt.value}
                                            className="flex cursor-pointer items-center gap-2 text-white"
                                          >
                                            <input
                                              type="checkbox"
                                              checked={checked}
                                              onChange={(e) => {
                                                if (e.target.checked)
                                                  rhf.onChange([
                                                    ...value,
                                                    opt.value
                                                  ]);
                                                else
                                                  rhf.onChange(
                                                    value.filter(
                                                      (v) => v !== opt.value
                                                    )
                                                  );
                                              }}
                                              onBlur={rhf.onBlur}
                                              className="grid size-4 appearance-none place-content-center rounded border border-white/90
                             before:hidden before:size-2 before:rounded-sm before:bg-white before:content-['']
                             checked:bg-transparent checked:before:block focus:outline-none focus:ring-2 focus:ring-white/60"
                                            />
                                            <span className="text-sm">
                                              {opt.label}
                                            </span>
                                          </label>
                                        );
                                      })}
                                    </div>
                                  );
                                }}
                              />
                            )}
                            {field.type === 'select' && !field.multiple && (
                              <div className="mt-1 space-y-2">
                                {(field.options ?? []).map((opt) => (
                                  <label
                                    key={opt.value}
                                    className="flex cursor-pointer items-center gap-2 text-white"
                                  >
                                    <input
                                      type="radio"
                                      value={opt.value}
                                      {...register(field.name)}
                                      className="
                                      grid size-4 appearance-none place-content-center rounded-full
                                      border border-white/90
                                      before:hidden before:size-2 before:rounded-full
                                      before:bg-white
                                      before:content-[''] checked:bg-transparent checked:before:block focus:outline-none focus:ring-2 focus:ring-white/60
                                    "
                                    />
                                    <span className="text-sm">{opt.label}</span>
                                  </label>
                                ))}
                              </div>
                            )}

                            {/* errores/ayuda */}
                            {errors[field.name] && (
                              <p className="mt-1 text-sm text-red-200">
                                {(errors as any)[
                                  field.name
                                ]?.message?.toString()}
                              </p>
                            )}
                            {field.helpText && (
                              <p className="mt-1 text-xs text-white/80">
                                {field.helpText}
                              </p>
                            )}
                          </div>
                        );
                      })}

                      {/* Controles */}
                      <div className="mt-2 flex items-center justify-between border-t border-white/30 pt-4">
                        {form.type === 'multi-step' && (
                          <>
                            <button
                              type="button"
                              onClick={onBack}
                              className="rounded border border-white/70 bg-transparent px-4 py-2 text-sm text-white hover:bg-white/10"
                            >
                              Back
                            </button>
                            <button
                              type="button"
                              onClick={onNext}
                              className="ml-auto rounded border border-white/80 bg-transparent px-4 py-2 text-sm text-white hover:bg-white/10"
                            >
                              {previewStep < form.steps.length - 1
                                ? 'Next'
                                : 'Send Form'}
                            </button>
                          </>
                        )}

                        {form.type !== 'multi-step' && (
                          <button
                            type="submit"
                            className="ml-auto rounded border border-white/80 bg-transparent px-4 py-2 text-sm text-white hover:bg-white/10"
                          >
                            Enviar
                          </button>
                        )}
                      </div>
                    </form>

                    {form.infoBottom && (
                      <p className="mt-2 text-sm text-white/90">
                        {form.infoBottom}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormPreview;
