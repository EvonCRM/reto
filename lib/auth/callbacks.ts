import { addMinutes } from 'date-fns';
import type { NextAuthConfig } from 'next-auth';

import { TOTP_AND_RECOVERY_CODES_EXPIRY_MINUTES } from '@/constants/limits';
import { Routes } from '@/constants/routes';
import { symmetricEncrypt } from '@/lib/auth/encryption';
import { AuthErrorCode } from '@/lib/auth/errors';
import { prisma } from '@/lib/db/prisma';
import { IdentityProvider } from '@/types/identity-provider';


async function isAuthenticatorAppEnabled(userId: string): Promise<boolean> {
  const count = await prisma.authenticatorApp.count({
    where: { userId }
  });
  return count > 0;
}

function redirectToTotp(userId: string): string {
  if (!process.env.AUTH_SECRET) {
    console.error(
      'Missing encryption key; cannot proceed with token encryption.'
    );
    return `${Routes.AuthError}?error=${AuthErrorCode.InternalServerError}`;
  }
  const token = symmetricEncrypt(userId, process.env.AUTH_SECRET);
  const expiry = symmetricEncrypt(
    addMinutes(
      new Date(),
      TOTP_AND_RECOVERY_CODES_EXPIRY_MINUTES
    ).toISOString(),
    process.env.AUTH_SECRET
  );
  return `/auth/totp?token=${encodeURIComponent(token)}&expiry=${encodeURIComponent(expiry)}`;
}

export const callbacks = {
  async signIn({ user, account }): Promise<string | boolean> {
    if (!account) {
      return false;
    }
    
    // All Credentials Provider
    if (account.type === 'credentials') {
      if (!user || !user.id) {
        return false;
      }

      // Check if MFA is enabled
      if (account.provider === IdentityProvider.Credentials) {
        if (await isAuthenticatorAppEnabled(user.id)) {
          return redirectToTotp(user.id);
        }
      }

      return true;
    }

    return true;
  },
  async jwt({ token, trigger, user }) {
    if ((trigger === 'signIn' || trigger === 'signUp') && user) {
      token.sub = user.id;
      token.organizationId = user.organizationId;
    }

    // Let's not allow the client to indirectly update the token using useSession().update()
    if (trigger === 'update') {
      return token;
    }

    return token;
  },
  async session({ session, token }) {
    if (session.user && token.sub) {
      session.user.id = token.sub;
      session.user.organizationId = token.organizationId as string | null;
    }

    return session;
  }
} satisfies NextAuthConfig['callbacks'];
