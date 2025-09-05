import * as React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { SidebarRenderer } from '@/components/dashboard/sidebar-renderer';
import {
  Page,
  PageHeader,
  PagePrimaryBar,
  PageTitle
} from '@/components/ui/page';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Routes } from '@/constants/routes';
import { getProfile } from '@/data/account/get-profile';
import { dedupedAuth } from '@/lib/auth';
import { getLoginRedirect } from '@/lib/auth/redirect';
import { checkSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Dashboard')
};

export default async function DashboardLayout({
  children
}: React.PropsWithChildren): Promise<React.JSX.Element> {
  const session = await dedupedAuth();
  if (!checkSession(session)) {
    return redirect(getLoginRedirect());
  }

  const userFromDb = await prisma.user.findFirst({
    where: { id: session.user.id },
    select: {
      completedOnboarding: true,
      organization: {
        select: {
          completedOnboarding: true
        }
      }
    }
  });
  if (
    !userFromDb!.completedOnboarding ||
    !userFromDb!.organization!.completedOnboarding
  ) {
    return redirect(Routes.Onboarding);
  }

  const profile = await getProfile();

  return (
    <div className="flex h-screen overflow-auto">
      <SidebarProvider>
        <SidebarRenderer profile={profile} />
        <SidebarInset
          id="skip"
          className="size-full lg:[transition:max-width_0.2s_linear] lg:peer-data-[state=collapsed]:max-w-[calc(100vw-var(--sidebar-width-icon))] lg:peer-data-[state=expanded]:max-w-[calc(100vw-var(--sidebar-width))]"
        >
          <Page>
            <PageHeader>
              <PagePrimaryBar>
                <PageTitle>My workspace</PageTitle>
                <ThemeToggle />
              </PagePrimaryBar>
            </PageHeader>
            <div className="max-w-8xl mx-auto w-full px-4 py-6 sm:px-6 sm:py-8">
              {children}
            </div>
          </Page>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
