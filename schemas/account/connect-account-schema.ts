import { z } from 'zod';

export const connectAccountSchema = z.object({
  provider: z.string({
    required_error: 'Provider is required',
    invalid_type_error: 'Provider must be a string'
  })
});

export type ConnectAccountSchema = z.infer<typeof connectAccountSchema>;
