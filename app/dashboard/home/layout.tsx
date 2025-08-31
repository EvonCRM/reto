import * as React from 'react';
import { type Metadata } from 'next';

import {
  Page,
  PageBody,
  PageHeader,
  PagePrimaryBar,
  PageTitle
} from '@/components/ui/page';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Form Builder')
};

export default function HomeLayout(): React.JSX.Element {
  return (
    <Page>
      <PageHeader>
        <PagePrimaryBar>
          <PageTitle>Form Builder</PageTitle>
        </PagePrimaryBar>
      </PageHeader>
      <PageBody>
        <div className="mx-auto max-w-6xl p-2 sm:p-6">
          {/* Clean content area - ready for form builder implementation */}
        </div>
      </PageBody>
    </Page>
  );
}
