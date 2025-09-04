import type { Metadata } from 'next';

import FormBuilder from '@/components/forms/FormBuilder';

export const metadata: Metadata = {
  title: 'Form Builder',
  description:
    'Editor de formularios dinámicos con vista previa en tiempo real.'
};

export default function FormBuilderPage() {
  return (
    <main className="max-w-8xl mx-auto py-2">
      <h1 className="mb-4 text-xl font-semibold">
        Crea formularios dinámicos con pasos y validaciones en tiempo real.
      </h1>
      <div className="rounded-lg border shadow-sm">
        <FormBuilder />
      </div>
    </main>
  );
}
