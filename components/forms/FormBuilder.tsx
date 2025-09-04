'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import useFormBuilder from '@/hooks/useFormBuilder';
import { upsertForm } from '@/lib/forms/forms-store';

import FormEditor from './FormEditor';
import FormPreview from './FormPreview';

const FormBuilder: React.FC = () => {
  const router = useRouter();
  const search = useSearchParams();
  const editingId = search.get('id') || undefined;
  const {
    form,
    currentStep,
    updateForm,
    changeStep,
    addStep,
    removeStep,
    addField,
    updateField,
    removeField
  } = useFormBuilder();

  const onSave = () => {
    const id = upsertForm(form, {
      id: editingId, // si vienes de editar, respeta el id; si no, crea uno nuevo
      theme: 'ocean', // TODO: elegir desde UI
      coverUrl: undefined
    });
    // navega al builder con ese id o al panel
    router.push(`/dashboard/form-builder?id=${id}`);
  };
  const onSaveAndExit = () => {
    const id = upsertForm(form, { id: editingId, theme: 'ocean' });
    router.push('/dashboard/home/forms'); // volver al panel
  };

  return (
    <div className="flex h-screen flex-col divide-y md:flex-row md:divide-x md:divide-y-0">
      {/* Panel de edición */}
      <div className="h-1/2 overflow-auto md:h-full md:w-1/2">
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <a
            href="/dashboard/home/forms"
            className="text-sm text-gray-600 hover:underline"
          >
            ← Mis formularios
          </a>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={onSave}
              className="rounded bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700"
              title="Guardar cambios"
            >
              💾 Guardar
            </button>
            <button
              onClick={onSaveAndExit}
              className="rounded border px-3 py-2 text-sm hover:bg-gray-50"
              title="Guardar y volver al panel"
            >
              Guardar y salir
            </button>
          </div>
        </div>
        <FormEditor
          form={form}
          currentStep={currentStep}
          updateForm={updateForm}
          changeStep={changeStep}
          addStep={addStep}
          removeStep={removeStep}
          addField={addField}
          updateField={updateField}
          removeField={removeField}
        />
      </div>
      {/* Panel de previsualización */}
      <div className="h-1/2 overflow-auto md:h-full md:w-1/2">
        <FormPreview form={form} />
      </div>
    </div>
  );
};

export default FormBuilder;
