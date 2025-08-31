'use server';

import { redirect } from 'next/navigation';
import { addHours } from 'date-fns';
import { returnValidationErrors } from 'next-safe-action';

import { actionClient } from '@/actions/safe-action';
import { EMAIL_VERIFICATION_EXPIRY_HOURS } from '@/constants/limits';
import { Routes } from '@/constants/routes';
import { createUserWithOrganization } from '@/lib/auth/organization';
import { hashPassword } from '@/lib/auth/password';
import { createHash, randomString } from '@/lib/auth/utils';
import { prisma } from '@/lib/db/prisma';
import { sendVerifyEmailAddressEmail } from '@/lib/smtp/send-verify-email-address-email';
import { getBaseUrl } from '@/lib/urls/get-base-url';
import { signUpSchema } from '@/schemas/auth/sign-up-schema';

export const signUp = actionClient
  .metadata({ actionName: 'signUp' })
  .schema(signUpSchema)
  .action(async ({ parsedInput }) => {
    try {
      console.log('📝 Sign up attempt for:', parsedInput.email);
      
      console.log('🔍 Step 1: Checking if email exists...');
      const normalizedEmail = parsedInput.email.toLowerCase();
      const count = await prisma.user.count({
        where: { email: normalizedEmail }
      });
      console.log('✅ Email check completed, count:', count);
      
      if (count > 0) {
        console.log('❌ Email already exists:', normalizedEmail);
        return returnValidationErrors(signUpSchema, {
          email: {
            _errors: ['Email address is already taken.']
          }
        });
      }

      console.log('🔐 Step 2: Hashing password...');
      const hashedPassword = await hashPassword(parsedInput.password);
      console.log('✅ Password hashed successfully');
      
      console.log('👤 Step 3: Creating user with organization...');
      const organizationId = await createUserWithOrganization({
        name: parsedInput.name,
        email: normalizedEmail,
        hashedPassword,
        locale: 'en-US'
      });
      console.log('✅ User and organization created successfully, ID:', organizationId);

      console.log('📧 Step 4: Setting up email verification...');
      const otp = randomString(3).toUpperCase();
      const hashedOtp = await createHash(`${otp}${process.env.AUTH_SECRET}`);

      await prisma.verificationToken.create({
        data: {
          identifier: normalizedEmail,
          token: hashedOtp,
          expires: addHours(new Date(), EMAIL_VERIFICATION_EXPIRY_HOURS)
        },
        select: {
          identifier: true // SELECT NONE
        }
      });
      console.log('✅ Verification token created');

      // Log OTP to console for development/testing when email is not configured
      console.log('🔑 Email Verification OTP for', normalizedEmail, ':', otp);

      try {
        await sendVerifyEmailAddressEmail({
          recipient: normalizedEmail,
          name: parsedInput.name,
          otp,
          verificationLink: `${getBaseUrl()}${Routes.VerifyEmailRequest}/${hashedOtp}`
        });
        console.log('✅ Verification email sent (or logged)');
      } catch (e) {
        console.error('⚠️  Email sending failed (continuing anyway):', e.message);
      }

      console.log('🎉 Step 5: Sign up process completed, redirecting...');
      
      return redirect(
        `${Routes.VerifyEmail}?email=${encodeURIComponent(parsedInput.email)}`
      );
      
    } catch (error) {
      // Check if this is a Next.js redirect (not a real error)
      if (error?.message === 'NEXT_REDIRECT') {
        console.log('✅ Sign-up completed successfully with redirect');
        throw error; // Re-throw redirect to allow Next.js to handle it
      }
      
      console.error('💥 FATAL ERROR in sign-up process:');
      console.error('Error name:', error?.name);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      
      // Re-throw the error to trigger the client-side error handling
      throw error;
    }
  });
