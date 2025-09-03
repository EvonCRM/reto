import type { Metadata } from 'next';

import FormBuilder from '@/components/forms/FormBuilder';

export const metadata: Metadata = {
  title: 'Form Builder',
  description:
    'Editor de formularios dinámicos con vista previa en tiempo real.'
};

export default function FormBuilderPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Form Builder</h1>
      <p className="mb-6 text-sm text-gray-600">
        Crea formularios dinámicos con pasos y validaciones en tiempo real.
      </p>
      <div className="rounded-lg border shadow-sm">
        <FormBuilder />
      </div>
    </main>
  );
}
