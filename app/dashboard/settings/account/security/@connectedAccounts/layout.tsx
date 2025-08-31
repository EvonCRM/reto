import * as React from 'react';

import { PasswordLoginHint } from '@/components/dashboard/settings/account/security/password-login-hint';
import { AnnotatedSection } from '@/components/ui/annotated';

export default function ConnectedAccountsLayout({
  children
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <>
      <AnnotatedSection
        title="Connected accounts"
        description="Manage your connected authentication accounts."
      >
        {children}
      </AnnotatedSection>
      <PasswordLoginHint />
    </>
  );
}
