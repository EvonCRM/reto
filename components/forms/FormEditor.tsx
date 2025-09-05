'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import type { FieldConfig, FormConfig } from '@/types/form';

import FieldEditor from './FieldEditor';
import FieldList from './FieldList';

// 1) Helper para generar defaultValues según los fields
function buildDefaultValues(form: FormConfig): Record<string, any> {
  const dv: Record<string, any> = {};
  for (const step of form.steps) {
    for (const f of step.fields) {
      if (f.type === 'select' && (f as any).multiple) {
        dv[f.name] = []; // selección múltiple → array
      } else {
        dv[f.name] = ''; // text, date, textarea, select simple
      }
    }
  }
  return dv;
}

interface FormEditorProps {
  form: FormConfig;
  currentStep: number;
  updateForm: (updates: Partial<FormConfig>) => void;
  changeStep: (index: number) => void;
  addStep: () => void;
  removeStep: (index: number) => void;
  addField: (field: Omit<FieldConfig, 'id' | 'name'>) => void;
  updateField: (
    stepIndex: number,
    fieldId: string,
    updates: Partial<FieldConfig>
  ) => void;
  removeField: (stepIndex: number, fieldId: string) => void;
}

const FormEditor: React.FC<FormEditorProps> = ({
  form,
  currentStep,
  setPreviewStep,
  previewMode,
  updateForm,
  changeStep,
  addStep,
  addField,
  updateField,
  removeField
}) => {
  // Estado para editar o crear campos
  const [fieldEditor, setFieldEditor] = useState<
    | { mode: 'create'; field?: undefined }
    | { mode: 'edit'; field: FieldConfig }
    | null
  >(null);
  const defaultValues = useMemo(() => buildDefaultValues(form), [form]);

  // 3) Crea RHF con esos defaults
  const methods = useForm<Record<string, any>>({
    defaultValues,
    mode: 'onChange'
  });

  // 4) Cuando cambie el form (abrir otro id/template), resetea
  useEffect(() => {
    methods.reset(defaultValues);
  }, [defaultValues, methods]);

  // Manejar cambio de tipo de formulario (simple vs multi-step)
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as FormConfig['type'];
    updateForm({ type: newType });
    if (newType === 'simple' && form.steps.length > 1) {
      // Reducir a un solo paso conservando el primero
      updateForm({ steps: [form.steps[0]] });
    }
  };

  // Renderiza la lista de pasos como pestañas
  const renderSteps = () => {
    if (form.type === 'simple') {
      return null;
    }
    return (
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {form.steps.map((step, index) => {
          const active = currentStep === index;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => changeStep(index)}
              aria-current={active ? 'step' : undefined}
              className={[
                'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition',
                active
                  ? 'bg-[hsl(var(--active))] text-white border border-transparent hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]'
                  : 'border border-foreground/30 text-foreground hover:border-[hsl(var(--active))] focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]'
              ].join(' ')}
              title={step.title || `Paso ${index + 1}`}
            >
              <span
                className={[
                  'grid size-5 place-content-center rounded-full text-[11px] font-semibold border',
                  active ? 'border-white/80' : 'border-foreground/30'
                ].join(' ')}
              >
                {index + 1}
              </span>
              <span className="line-clamp-1">
                {step.title || `Paso ${index + 1}`}
              </span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={addStep}
          className="
            inline-flex items-center gap-2 rounded-md border border-foreground/30 px-3
            py-1.5 text-sm text-foreground
            hover:border-[hsl(var(--active))]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]
          "
          title="Agregar paso"
        >
          <span className="text-base leading-none">＋</span>
          Paso
        </button>
      </div>
    );
  };

  const currentStepObj = form.steps[currentStep];

  const handleAddField = () => {
    setFieldEditor({ mode: 'create' });
  };

  const handleEditField = (field: FieldConfig) => {
    setFieldEditor({ mode: 'edit', field });
  };

  const handleDeleteField = (fieldId: string) => {
    removeField(currentStep, fieldId);
  };

  const handleSaveField = (
    data: Partial<FieldConfig> & {
      type: FieldConfig['type'];
      label: string;
      required: boolean;
    }
  ) => {
    if (!fieldEditor) return;
    if (fieldEditor.mode === 'create') {
      // Para crear pasamos todo excepto id y name
      addField({
        type: data.type,
        label: data.label,
        placeholder: data.placeholder,
        helpText: data.helpText,
        required: data.required,
        validations: data.validations
        // name e id se generan automáticamente en el hook useFormBuilder
      });
    } else if (fieldEditor.mode === 'edit' && fieldEditor.field) {
      // Para actualizar excluimos id y name
      const updates: Partial<FieldConfig> = { ...data };
      delete (updates as any).id;
      delete (updates as any).name;
      updateField(currentStep, fieldEditor.field.id, updates);
    }
    setFieldEditor(null);
  };

  return (
    <div className="overflow-y-visible p-4 text-foreground">
      <h2 className="text-xl font-semibold">Form Editor</h2>

      {/* Configuración general */}
      <div className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium">Form title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateForm({ title: e.target.value })}
            placeholder="Form title"
            className="
              mt-1 block w-full rounded-md
              border border-foreground/30 bg-background px-3 py-2 text-sm
              placeholder:text-muted-foreground
              hover:border-[hsl(var(--active))]
              focus:border-[hsl(var(--active))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]
            "
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            rows={2}
            value={form.description || ''}
            onChange={(e) => updateForm({ description: e.target.value })}
            placeholder="Descripción (opcional)"
            className="
              mt-1 block w-full rounded-md
              border border-foreground/30 bg-background px-3 py-2 text-sm
              placeholder:text-muted-foreground
              hover:border-[hsl(var(--active))]
              focus:border-[hsl(var(--active))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]
            "
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Form Type</label>
          <select
            value={form.type}
            onChange={handleTypeChange}
            className="
              mt-1 block w-full rounded-md
              border border-foreground/30 bg-background px-3 py-2 text-sm
              hover:border-[hsl(var(--active))]
              focus:border-[hsl(var(--active))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]
            "
          >
            <option value="simple">Simple (un solo paso)</option>
            <option value="multi-step">Multi-paso</option>
          </select>
        </div>
      </div>

      {/* Gestor de pasos */}
      {renderSteps()}

      {/* Lista de campos del paso actual */}
      <div className="mt-6">
        <h3 className="text-lg font-medium">
          Fields for step {form.type === 'multi-step' ? currentStep + 1 : ''}
        </h3>

        <FieldList
          fields={currentStepObj?.fields || []}
          onEdit={handleEditField}
          onDelete={handleDeleteField}
        />

        <button
          type="button"
          onClick={handleAddField}
          className="
            mt-3 inline-flex items-center gap-1 rounded-md
            border border-foreground/30 px-3 py-2 text-sm
            hover:border-[hsl(var(--active))]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]
          "
        >
          + Add field
        </button>
      </div>

      {/* Editor de campo */}
      {fieldEditor && (
        <FieldEditor
          mode={fieldEditor.mode}
          initial={fieldEditor.mode === 'edit' ? fieldEditor.field : undefined}
          onCancel={() => setFieldEditor(null)}
          onSave={handleSaveField}
        />
      )}
    </div>
  );
};

export default FormEditor;
