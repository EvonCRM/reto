import * as React from 'react';
import type { Metadata } from 'next';

import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Form Builder')
};

export default function HomePage(): React.JSX.Element {
  return (
    <div className="mx-auto max-w-6xl p-2 sm:p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome to Form Builder</h1>
        <p className="text-muted-foreground mt-2">
          Ready to start building forms for your organization.
        </p>
      </div>
    </div>
  );
}