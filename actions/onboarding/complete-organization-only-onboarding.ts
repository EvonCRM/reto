'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

import { authActionClient } from '@/actions/safe-action';
import { Routes } from '@/constants/routes';
import { Caching, OrganizationCacheKey, UserCacheKey } from '@/data/caching';
import { stripeServer } from '@/lib/billing/stripe-server';
import { prisma } from '@/lib/db/prisma';
import { NotFoundError } from '@/lib/validation/exceptions';
import { completeOrganizationOnboardingSchema } from '@/schemas/onboarding/complete-organization-onboarding-schema';

export const completeOrganizationOnlyOnboarding = authActionClient
  .metadata({ actionName: 'completeOrganizationOnlyOnboarding' })
  .schema(completeOrganizationOnboardingSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    const organization = await prisma.organization.findFirst({
      where: { id: session.user.organizationId },
      select: {
        completedOnboarding: true,
        stripeCustomerId: true
      }
    });
    if (!organization) {
      throw new NotFoundError('Organiztion not found');
    }
    if (organization.completedOnboarding) {
      return redirect(Routes.Dashboard);
    }

    await prisma.organization.update({
      where: { id: session.user.organizationId },
      data: {
        name: parsedInput.organizationName,
        completedOnboarding: true
      },
      select: {
        id: true // SELECT NONE
      }
    });

    if (organization.stripeCustomerId) {
      try {
        await stripeServer.customers.update(organization.stripeCustomerId, {
          name: parsedInput.organizationName
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      console.warn('Stripe customer ID is missing');
    }


    revalidateTag(
      Caching.createUserTag(UserCacheKey.OnboardingData, session.user.id)
    );
    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.OrganizationDetails,
        session.user.organizationId
      )
    );

    return redirect(Routes.Home);
  });
