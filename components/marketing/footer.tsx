import * as React from 'react';

import { Logo } from '@/components/ui/logo';

export function Footer(): React.JSX.Element {
  return (
    <footer className="px-2 pb-10 pt-20 sm:container">
      <div className="container">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Logo />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Event Horizon Technologies - Technical Challenge
          </p>
        </div>
      </div>
    </footer>
  );
}
