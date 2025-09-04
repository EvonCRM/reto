'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { VALIDATION_PATTERNS } from '@/schemas/forms/patterns';
import type { FieldConfig, FieldSelectConfig, FormConfig } from '@/types/form';

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
          v = v.min(f.minSelected, `Elige al menos ${f.minSelected}`);
        if (typeof f.maxSelected === 'number')
          v = v.max(f.maxSelected, `Elige como máximo ${f.maxSelected}`);
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
        if (field.required) v = v.min(1, 'Campo requerido');
        if (!f.allowCustom) {
          v = v.refine((val) => optionValues.includes(val), {
            message: 'Opción inválida'
          });
        }
        schemaShape[field.name] = v;
      }

      return; // <- MUY IMPORTANTE: no sigas con la lógica de strings
    }

    // --- AQUÍ SIGUE TU LÓGICA EXISTENTE PARA text/date/textarea ---
    let validator: z.ZodString = z.string();
    if (field.required) {
      validator = validator.min(1, 'Campo requerido');
    }
    const v = field.validations;
    if (v?.minLength) {
      validator = validator.min(
        v.minLength,
        `Debe tener al menos ${v.minLength} caracteres`
      );
    }
    if (v?.maxLength) {
      validator = validator.max(
        v.maxLength,
        `Debe tener máximo ${v.maxLength} caracteres`
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
};

function FormPreview({
  form,
  previewStep,
  setPreviewStep,
  previewMode = true
}: PreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  console.log('form', form);

  // Obtener campos del paso actual
  const stepFields = form.steps[previewStep]?.fields || [];

  // Generar esquema Zod y resolver
  const schema = useMemo(() => generateSchema(stepFields), [stepFields]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    const defaultValues: Record<string, any> = {};
    stepFields.forEach((field) => {
      defaultValues[field.name] = formData[field.name] ?? '';
    });
    reset(defaultValues);
  }, [previewStep, stepFields, formData, reset]);

  // const onSubmit = (data: Record<string, any>) => {
  //   setFormData((prev) => ({ ...prev, ...data }));
  //   if (previewStep < form.steps.length - 1) {
  //     setPreviewStep((prev) => prev + 1);
  //   } else {
  //     console.log('Datos del formulario:', { ...formData, ...data });
  //     alert('Formulario enviado con éxito (ver consola)');
  //   }
  // };

  const prefixCount =
    form.type === 'multi-step'
      ? form.steps
          .slice(0, previewStep)
          .reduce((acc, s) => acc + (s.fields?.length ?? 0), 0)
      : 0;

  const onNext = async () => {
    if (!previewMode) {
      const ok = await trigger();
      if (!ok) return;
    }
    if (form.type === 'multi-step' && previewStep < form.steps.length - 1) {
      setPreviewStep(previewStep + 1);
    }
  };
  const onBack = () => {
    if (form.type === 'multi-step' && previewStep > 0)
      setPreviewStep(previewStep - 1);
  };

  // dentro del panel de configuración general del Form
  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Título fuera del fondo */}
      <div className="shrink-0 px-4 pt-2">
        <h2 className="mb-2 text-xl font-semibold text-gray-800">
          Previsualización
        </h2>
        {form.infoTop && (
          <p className="mb-2 text-sm text-gray-600">{form.infoTop}</p>
        )}
      </div>

      {/* Área con fondo */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {form.backgroundUrl && (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${form.backgroundUrl})`,
                backgroundSize:
                  form.backgroundMode === 'contain' ? 'contain' : 'cover'
              }}
            />
            <div
              aria-hidden
              className={
                form.backgroundTint === 'light'
                  ? 'pointer-events-none absolute inset-0 bg-white/40'
                  : form.backgroundTint === 'dark'
                    ? 'pointer-events-none absolute inset-0 bg-black/35'
                    : ''
              }
            />
          </>
        )}
        <div className="relative h-full overflow-y-auto p-4">
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
                      <div className="flex items-center gap-3">
                        <div className="flex items-center text-white">
                          <span className="grid size-6 place-content-center rounded-full border border-white/90 text-[11px] font-semibold">
                            {qn}
                          </span>
                          {/* <span className="mx-2 h-px w-6 bg-white/80" /> */}
                          {/* <span className="inline-block size-2 rotate-45 border-r-2 border-t-2 border-white/80" /> */}
                        </div>
                        <label className="block text-sm font-medium text-white drop-shadow">
                          {field.label}
                          {field.required && (
                            <span className="text-red-300"> *</span>
                          )}
                        </label>
                      </div>
                      {field.type === 'text' && (
                        <input
                          type="text"
                          className={`mt-1 block w-full rounded border border-white/80 bg-transparent text-sm text-white shadow-none placeholder:text-white/70 focus:border-white focus:ring-white/80 ${errors[field.name] ? 'border-red-300 focus:border-red-300 focus:ring-red-300/60' : ''}`}
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
                          defaultValue={[]}
                          render={({ field: rhf }) => {
                            const value: string[] = Array.isArray(rhf.value)
                              ? rhf.value
                              : [];
                            return (
                              <div className="mt-1 space-y-2">
                                {(field.options ?? []).map((opt) => {
                                  const checked = value.includes(opt.value);
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
                                            rhf.onChange([...value, opt.value]);
                                          else
                                            rhf.onChange(
                                              value.filter(
                                                (v) => v !== opt.value
                                              )
                                            );
                                        }}
                                        onBlur={rhf.onBlur}
                                        className="
                                          grid size-4 appearance-none place-content-center rounded
                                          border border-white/90
                                          before:hidden before:size-2 before:rounded-sm
                                          before:bg-white
                                          before:content-[''] checked:bg-transparent checked:before:block focus:outline-none focus:ring-2 focus:ring-white/60
                                        "
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
                      {errors[field.name] && (
                        <p className="mt-1 text-sm text-red-200">
                          {(errors as any)[field.name]?.message?.toString()}
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
                <div className="mt-2 flex items-center justify-between border-t border-white/30 pt-4">
                  {form.type === 'multi-step' && previewStep > 0 && (
                    <button
                      type="button"
                      onClick={onBack}
                      className="rounded border border-white/70 bg-transparent px-4 py-2 text-sm text-white hover:bg-white/10"
                    >
                      Anterior
                    </button>
                  )}

                  {form.type === 'multi-step' ? (
                    <button
                      type="button"
                      onClick={onNext}
                      className="ml-auto rounded border border-white/80 bg-transparent px-4 py-2 text-sm text-white hover:bg-white/10"
                    >
                      {previewStep < form.steps.length - 1
                        ? 'Siguiente'
                        : 'Finalizar'}
                    </button>
                  ) : (
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
                <p className="mt-2 text-sm text-white/90">{form.infoBottom}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormPreview;
