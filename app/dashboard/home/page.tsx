import * as React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Form Builder')
};

export default function HomePage(): React.JSX.Element {
  redirect('/dashboard/home/forms');
}
