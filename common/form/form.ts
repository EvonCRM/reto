'use client';

import { useCallback, useState } from 'react';
import { FieldConfig, FormConfig } from './types';
import update from 'immutability-helper';

export function createSimpleForm(): FormConfig {
  return {
    steps: [
      {
        title: 'First step',
        fields: [],
      },
    ],
    type: 'simple',
    title: 'Simple form',
    description: 'A very simple form',
  };
}

// Main hook
export function useFormBuilder() {
  const [form, setForm] = useState<FormConfig>(createSimpleForm);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDirty, setIsDirty] = useState(false);

  // TODO: Auto-save every 2s if there are changes
  // useAutoSave(form, isDirty)

  const clearForm = useCallback(() => {
    setForm(createSimpleForm());
    setCurrentStep(0);
    setIsDirty(false);
  }, []);

  const addField = useCallback(
    (field: FieldConfig) => {
      const step = update(form.steps[currentStep], {
        fields: { $push: [field] },
      });
      const steps = update(form.steps, {
        [currentStep]: { $set: step },
      });
      setForm({
        ...form,
        steps,
      });
    },
    [currentStep, form]
  );

  const removeField = useCallback(
    (field: FieldConfig) => {
      const fields = form.steps[currentStep].fields.filter(
        (f) => f.id !== field.id
      );
      const steps = update(form.steps, {
        [currentStep]: { fields: { $set: fields } },
      });
      setForm({
        ...form,
        steps,
      });
    },
    [currentStep, form]
  );

  const moveField = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setForm((prevForm) => {
        const fields = [...prevForm.steps[currentStep].fields];
        const [removed] = fields.splice(dragIndex, 1);
        fields.splice(hoverIndex, 0, removed);
        return update(prevForm, {
          steps: {
            [currentStep]: { fields: { $set: fields } },
          },
        });
      });
    },
    [currentStep]
  );

  const trySetForm = useCallback((newForm: string) => {
    try {
      const parsed = JSON.parse(newForm);
      // Basic runtime check to ensure parsed is a FormConfig
      if (
        typeof parsed !== 'object' ||
        !parsed ||
        !Array.isArray(parsed.steps) ||
        typeof parsed.type !== 'string' ||
        typeof parsed.title !== 'string' ||
        typeof parsed.description !== 'string'
      ) {
        throw new Error('Parsed object is not a valid FormConfig');
      }
      setForm(parsed);
      setIsDirty(false);
    } catch (e) {
      // TODO: dispatch a toast/notification instead
      console.error('Invalid JSON', e);
    }
  }, []);

  return {
    form,
    currentStep,
    isDirty,
    clearForm,
    addField,
    removeField,
    moveField,
    trySetForm,
  };
}
