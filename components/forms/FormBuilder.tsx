'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import useFormBuilder from '@/hooks/useFormBuilder';
import { upsertForm } from '@/lib/forms/forms-store';

import FormEditor from './FormEditor';
import FormPreview from './FormPreview';

const FormBuilder: React.FC = () => {
  const router = useRouter();
  const search = useSearchParams();
  const editingId = search.get('id') || undefined;

  const sp = useSearchParams();
  const id = sp.get('id') ?? 'new';
  const from = sp.get('from') as 'forms' | 'templates' | null;

  // 👇 remonta FormBuilder cada vez que cambia el id
  return (
    <FormBuilderScreen
      key={id}
      editingId={id !== 'new' ? id : undefined}
      from={from ?? undefined}
    />
  );
};

// components/forms/FormBuilder.tsx

type Props = {
  editingId?: string; // ← llega desde la page
  from?: 'forms' | 'templates';
};

const FormBuilderScreen: React.FC<Props> = ({ editingId, from }) => {
  const router = useRouter();
  const startAtCover = from === 'templates';

  // ← pasa el id al hook; el hook debe rehidratar cuando cambie
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
  } = useFormBuilder(editingId, { startAtCover });

  const onSave = () => {
    const id = upsertForm(form, {
      id: editingId, // respeta id si editas; crea nuevo si undefined
      theme: 'ocean',
      coverUrl: form.backgroundUrl ?? undefined
    });
    router.replace(
      `/dashboard/form-builder?id=${id}${from ? `&from=${from}` : ''}`
    );
  };

  const onSaveAndExit = () => {
    router.push('/dashboard/home/forms');
  };

  useEffect(() => {
    if (from === 'templates') changeStep(-1);
  }, [from, changeStep]);

  return (
    <div className="flex h-full min-h-0 flex-col md:flex-row md:divide-x">
      {/* Panel de edición */}
      <section className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <a
              href={
                from === 'templates'
                  ? '/dashboard/home/templates'
                  : '/dashboard/home/forms'
              }
              className="text-sm text-gray-600 hover:underline"
            >
              ← Mis formularios
            </a>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={onSave}
                className="rounded bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700"
              >
                💾 Guardar
              </button>
              <button
                onClick={onSaveAndExit}
                className="rounded border px-3 py-2 text-sm hover:bg-gray-50"
              >
                Guardar y salir
              </button>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-4">
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
      </section>

      {/* Panel de previsualización */}
      <section className="min-h-0 flex-1 overflow-auto p-4">
        <FormPreview
          form={form}
          previewStep={currentStep}
          setPreviewStep={changeStep} // ← viene del hook del editor
          previewMode={true}
          coverEnabled={true}
        />
      </section>
    </div>
  );
};

export default FormBuilder;
