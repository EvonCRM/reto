'use client';

import React from 'react';

import useFormBuilder from '@/hooks/useFormBuilder';

import FormEditor from './FormEditor';
import FormPreview from './FormPreview';

const FormBuilder: React.FC = () => {
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

  return (
    <div className="flex h-screen flex-col divide-y md:flex-row md:divide-x md:divide-y-0">
      {/* Panel de edición */}
      <div className="h-1/2 overflow-auto md:h-full md:w-1/2">
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
      <div className="h-1/2 overflow-auto bg-white md:h-full md:w-1/2">
        <FormPreview form={form} />
      </div>
    </div>
  );
};

export default FormBuilder;
