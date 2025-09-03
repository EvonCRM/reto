'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { VALIDATION_PATTERNS } from '@/schemas/forms/patterns';
import type { FieldConfig, FieldSelectConfig, FormConfig } from '@/types/form';

interface FormPreviewProps {
  form: FormConfig;
}

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
        let v = z.array(z.string());
        if (field.required) v = v.min(1, 'Selecciona al menos una opción');
        if (typeof f.minSelected === 'number')
          v = v.min(f.minSelected, `Elige al menos ${f.minSelected}`);
        if (typeof f.maxSelected === 'number')
          v = v.max(f.maxSelected, `Elige como máximo ${f.maxSelected}`);
        if (!f.allowCustom) {
          v = v.refine(
            (arr) => arr.every((val) => optionValues.includes(val)),
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

const FormPreview: React.FC<FormPreviewProps> = ({ form }) => {
  const [previewStep, setPreviewStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});

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

  // Resetear valores cuando cambie el paso utilizando los datos guardados
  useEffect(() => {
    const defaultValues: Record<string, any> = {};
    stepFields.forEach((field) => {
      defaultValues[field.name] = formData[field.name] ?? '';
    });
    reset(defaultValues);
  }, [previewStep, stepFields, formData, reset]);

  const onSubmit = (data: Record<string, any>) => {
    // Guardar datos de este paso
    setFormData((prev) => ({ ...prev, ...data }));
    if (previewStep < form.steps.length - 1) {
      setPreviewStep((prev) => prev + 1);
    } else {
      // Formulario completo
      console.log('Datos del formulario:', { ...formData, ...data });
      alert('Formulario enviado con éxito (ver consola)');
    }
  };

  const onBack = () => {
    if (previewStep > 0) {
      setPreviewStep((prev) => prev - 1);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      <h2 className="mb-2 text-xl font-semibold text-gray-800">
        Previsualización
      </h2>
      {form.infoTop && (
        <p className="mb-2 text-sm text-gray-600">{form.infoTop}</p>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {stepFields.map((field) => (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            {field.type === 'text' && (
              <input
                type="text"
                className={`mt-1 block w-full rounded border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors[field.name] ? 'border-red-500' : ''}`}
                placeholder={field.placeholder || ''}
                {...register(field.name)}
              />
            )}
            {field.type === 'date' && (
              <input
                type="date"
                className={`mt-1 block w-full rounded border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors[field.name] ? 'border-red-500' : ''}`}
                {...register(field.name)}
              />
            )}
            {field.type === 'textarea' && (
              <textarea
                rows={3}
                className={`mt-1 block w-full rounded border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors[field.name] ? 'border-red-500' : ''}`}
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
                    <div
                      role="group"
                      aria-labelledby={`${field.name}-legend`}
                      className="mt-2 space-y-2"
                    >
                      {(field.options ?? []).map((opt) => {
                        const checked = value.includes(opt.value);
                        return (
                          <label
                            key={opt.value}
                            className="flex cursor-pointer items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              className="size-4 accent-indigo-600"
                              checked={checked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  rhf.onChange([...value, opt.value]);
                                } else {
                                  rhf.onChange(
                                    value.filter((v) => v !== opt.value)
                                  );
                                }
                              }}
                              onBlur={rhf.onBlur}
                            />
                            <span className="text-sm text-gray-800">
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
              <div
                role="radiogroup"
                aria-labelledby={`${field.name}-legend`}
                className="mt-2 space-y-2"
              >
                {(field.options ?? []).map((opt) => (
                  <label
                    key={opt.value}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      {...register(field.name)}
                      className="size-4 accent-indigo-600"
                    />
                    <span className="text-sm text-gray-800">{opt.label}</span>
                  </label>
                ))}
              </div>
            )}

            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">
                {(errors as any)[field.name]?.message?.toString()}
              </p>
            )}
            {field.helpText && (
              <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
            )}
          </div>
        ))}
        <div className="flex items-center justify-between border-t pt-4">
          {form.type === 'multi-step' && previewStep > 0 && (
            <button
              type="button"
              onClick={onBack}
              className="rounded border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
            >
              Anterior
            </button>
          )}
          <button
            type="submit"
            className="ml-auto rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
          >
            {form.type === 'multi-step' && previewStep < form.steps.length - 1
              ? 'Siguiente'
              : 'Enviar'}
          </button>
        </div>
      </form>
      {form.infoBottom && (
        <p className="mt-2 text-sm text-gray-600">{form.infoBottom}</p>
      )}
    </div>
  );
};

export default FormPreview;
