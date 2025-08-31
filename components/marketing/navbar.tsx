'use client';

import * as React from 'react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Routes } from '@/constants/routes';
import { cn } from '@/lib/utils';

export function Navbar(): React.JSX.Element {
  return (
    <section className="sticky inset-x-0 top-0 z-40 border-b bg-background py-4">
      <div className="container">
        <nav className="flex justify-between items-center">
          <Link
            href={Routes.Root}
            className="flex items-center gap-2"
          >
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle className="rounded-xl border-none shadow-none" />
            <Link
              href={Routes.Login}
              className={cn(
                buttonVariants({
                  variant: 'outline'
                }),
                'rounded-xl'
              )}
            >
              Log in
            </Link>
            <Link
              href={Routes.SignUp}
              className={cn(
                buttonVariants({
                  variant: 'default'
                }),
                'rounded-xl'
              )}
            >
              Start Challenge
            </Link>
          </div>
        </nav>
      </div>
    </section>
  );
}
