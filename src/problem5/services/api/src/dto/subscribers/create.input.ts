import { z } from 'zod';

export const SubscriberCreateSchema = z.object({
  email: z.email(),
  status: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

export type SubscriberCreateInput = z.infer<typeof SubscriberCreateSchema>;