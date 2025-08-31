export enum IdentityProvider {
  Credentials = 'credentials',
  TotpCode = 'totp-code',
  RecoveryCode = 'recovery-code'
}

export const identityProviderFriendlyNames = {
  [IdentityProvider.Credentials]: 'Credentials',
  [IdentityProvider.TotpCode]: 'TOTP code',
  [IdentityProvider.RecoveryCode]: 'Recovery code'
} as const;
