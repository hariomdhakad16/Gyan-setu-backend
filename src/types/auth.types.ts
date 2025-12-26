import { z } from 'zod';
import { registerSchema } from '../validation/schemas/Auth.schema';

export type RegisterBody = z.infer<typeof registerSchema>['body'];
