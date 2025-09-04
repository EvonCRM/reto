'use client';

import { useCallback, useEffect, useState } from 'react';

import { getForm } from '@/lib/forms/forms-store';
import { FieldConfig, FormConfig, FormStep } from '@/types/form';

/**
 * Genera un identificador único a partir del timestamp y un número aleatorio.
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

const DRAFT_KEY = 'form-builder-draft';

const defaultEmptyForm = (): FormConfig => ({
  title: 'Formulario sin título',
  type: 'simple',
  steps: [{ id: 'step-1', title: 'Paso 1', fields: [] }]
});

export default function useFormBuilder(
  editingId?: string,
  opts?: { startAtCover?: boolean }
) {
  const startAtCover = opts?.startAtCover ?? false;

  const emptyForm: FormConfig = {
    title: '',
    description: '',
    infoTop: '',
    infoBottom: '',
    type: 'simple',
    steps: [
      {
        id: generateId(),
        title: 'Paso 1',
        fields: []
      }
    ]
  };

  // const [form, setForm] = useState<FormConfig>(() => {
  //   if (typeof window === 'undefined') return emptyForm;
  //   try {
  //     const stored = localStorage.getItem(DRAFT_KEY);
  //     return stored ? (JSON.parse(stored) as FormConfig) : emptyForm;
  //   } catch (err) {
  //     console.error(err);
  //     return emptyForm;
  //   }
  // });
  const [form, setForm] = useState<FormConfig>(defaultEmptyForm());

  const [currentStep, setCurrentStep] = useState<number>(startAtCover ? -1 : 0);

  const [isDirty, setIsDirty] = useState(false);

  // Auto‑guardado cada 2 segundos cuando hay cambios
  useEffect(() => {
    if (!isDirty) return;
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      } catch (_err) {
        // no se puede guardar
        console.error(_err);
      }
      setIsDirty(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [form, isDirty]);

  useEffect(() => {
    if (!editingId) {
      setForm(defaultEmptyForm());
      setCurrentStep(0);
      return;
    }
    const loaded = getForm(editingId);
    setForm(loaded ?? defaultEmptyForm());
    setCurrentStep(0);
  }, [editingId]);

  /**
   * Actualiza propiedades de alto nivel del formulario (título, descripción, etc.).
   */
  const updateForm = useCallback((updates: Partial<FormConfig>) => {
    setForm((prev) => {
      const newForm = { ...prev, ...updates } as FormConfig;
      setIsDirty(true);
      return newForm;
    });
  }, []);

  /**
   * Cambia el índice del paso actual.
   */
  const changeStep = useCallback(
    (index: number) => {
      if (index >= 0 && index < form.steps.length) {
        setCurrentStep(index);
      } else {
        setCurrentStep(-1);
      }
    },
    [form.steps.length]
  );

  /**
   * Añade un nuevo paso vacío al formulario.
   */
  const addStep = useCallback(() => {
    setForm((prev) => {
      const newStep: FormStep = {
        id: generateId(),
        title: `Paso ${prev.steps.length + 1}`,
        fields: []
      };
      const newForm = {
        ...prev,
        steps: [...prev.steps, newStep]
      } as FormConfig;
      setIsDirty(true);
      return newForm;
    });
    setCurrentStep((prev) => prev + 1);
  }, []);

  /**
   * Elimina un paso por índice.
   */
  const removeStep = useCallback((index: number) => {
    setForm((prev) => {
      if (prev.steps.length <= 1) return prev; // no eliminar el único paso
      const newSteps = prev.steps.filter((_, i) => i !== index);
      const newForm = { ...prev, steps: newSteps } as FormConfig;
      setIsDirty(true);
      return newForm;
    });
    setCurrentStep(0);
  }, []);

  /**
   * Añade un campo al paso actual.
   */
  const addField = useCallback(
    (field: Omit<FieldConfig, 'id' | 'name'>) => {
      setForm((prev) => {
        const step = prev.steps[currentStep];
        if (!step) return prev;
        const kebabName = field.label
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        const newField: FieldConfig = {
          ...field,
          id: generateId(),
          name: kebabName || generateId()
        };
        const updatedStep: FormStep = {
          ...step,
          fields: [...step.fields, newField]
        };
        const newSteps = prev.steps.map((s, idx) =>
          idx === currentStep ? updatedStep : s
        );
        const newForm = { ...prev, steps: newSteps } as FormConfig;
        setIsDirty(true);
        return newForm;
      });
    },
    [currentStep]
  );

  /**
   * Actualiza las propiedades de un campo dentro del paso especificado.
   */
  const updateField = useCallback(
    (stepIndex: number, fieldId: string, updates: Partial<FieldConfig>) => {
      setForm((prev) => {
        const step = prev.steps[stepIndex];
        if (!step) return prev;
        const newFields = step.fields.map((field) =>
          field.id === fieldId ? { ...field, ...updates } : field
        );
        const newSteps = prev.steps.map((s, idx) =>
          idx === stepIndex ? { ...s, fields: newFields } : s
        );
        const newForm = { ...prev, steps: newSteps } as FormConfig;
        setIsDirty(true);
        return newForm;
      });
    },
    []
  );

  /**
   * Elimina un campo por ID en el paso especificado.
   */
  const removeField = useCallback((stepIndex: number, fieldId: string) => {
    setForm((prev) => {
      const step = prev.steps[stepIndex];
      if (!step) return prev;
      const newFields = step.fields.filter((field) => field.id !== fieldId);
      const newSteps = prev.steps.map((s, idx) =>
        idx === stepIndex ? { ...s, fields: newFields } : s
      );
      const newForm = { ...prev, steps: newSteps } as FormConfig;
      setIsDirty(true);
      return newForm;
    });
  }, []);

  /**
   * Reinicia el constructor eliminando cualquier borrador.
   */
  const resetForm = useCallback(() => {
    setForm(emptyForm);
    setCurrentStep(0);
    setIsDirty(false);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (_err) {
      return;
      // ignore
    }
  }, []);

  return {
    form,
    currentStep,
    isDirty,
    updateForm,
    changeStep,
    addStep,
    removeStep,
    addField,
    updateField,
    removeField,
    resetForm
  };
}
