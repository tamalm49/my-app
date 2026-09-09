import type z from 'zod';
import type { createUserSchema } from '../middlewares/use.validation.js';
export type CreateUserInput = z.infer<typeof createUserSchema>;