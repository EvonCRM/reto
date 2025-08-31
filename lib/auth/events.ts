import type { NextAuthConfig } from 'next-auth';

import { createOrganizationAndConnectUser } from '@/lib/auth/organization';
import { prisma } from '@/lib/db/prisma';
import { sendConnectedAccountSecurityAlertEmail } from '@/lib/smtp/send-connected-account-security-alert-email';
import { sendWelcomeEmail } from '@/lib/smtp/send-welcome-email';

export const events = {
  async signIn({ user, isNewUser }) {
    if (user && user.id) {
      await prisma.user.updateMany({
        where: { id: user.id },
        data: { lastLogin: new Date() }
      });

      if (isNewUser && user.email) {
        if (!user.organizationId) {
          await createOrganizationAndConnectUser({
            userId: user.id,
            normalizedEmail: user.email.toLowerCase()
          });
        }
        // OAuth provider specific logic would go here
        if (user.name) {
          await sendWelcomeEmail({
            name: user.name,
            recipient: user.email!
          });
        }
      }
    }
  },
  async signOut(message) {
    if ('session' in message && message.session?.sessionToken) {
      await prisma.session.deleteMany({
        where: { sessionToken: message.session.sessionToken }
      });
    }
  },
  async linkAccount({ user, account }) {
    if (user && user.name && user.email && account && account.provider) {
      // Here we check if the user just has been created using an OAuth provider
      // - If yes -> No need to send out security alert
      // - If no (which means linked using an existing account) -> Send out security alert
      const newUser = await prisma.user.findFirst({
        where: {
          email: user.email,
          lastLogin: null
        },
        select: {
          _count: {
            select: { accounts: true }
          }
        }
      });
      const isNewUser = newUser && newUser._count.accounts < 2;

      if (!isNewUser) {
        try {
          await sendConnectedAccountSecurityAlertEmail({
            recipient: user.email,
            name: user.name,
            action: 'connected',
            provider: account.provider
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
} satisfies NextAuthConfig['events'];
