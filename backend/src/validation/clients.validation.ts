import { z } from 'zod';

export const clientFilterSchema = z.enum([
  'id',
  'firstName',
  'lastName',
  'email',
  'phone',
  'jobTitle',
  'linkedin'
]);

export type ClientFilter = z.infer<typeof clientFilterSchema>;

export const createClientSchema = z.object({
    firstName: z.string().trim().min(2),
    lastName: z.string().trim().min(2),
    email: z.string().trim().email().max(254).optional(),
    phone: z.string().trim().min(8).max(30).optional(),
    jobTitle: z.string().trim().min(2).optional(),
    linkedin: z.string().trim().min(2).optional(),
    companyId: z.number().int().min(1).optional(),
    createdBy: z.number().int().min(1)
}).strict()

export const updateClientSchema = z.object({
    firstName: z.string().trim().min(2).optional(),
    lastName: z.string().trim().min(2).optional(),
    email: z.string().trim().email().max(254).optional(),
    phone: z.string().trim().min(8).max(30).optional(),
    jobTitle: z.string().trim().min(2).optional(),
    linkedin: z.string().trim().min(2).optional(),
    companyId: z.number().int().min(1).optional(),
}).refine(
    data => Object.keys(data).length > 0,
    {message: 'must cover one input'}
).strict()

export const clientIdSchema = z.coerce.number().int().min(1);

export const searchClientSchema = z.object({
    filter: clientFilterSchema,
    value: z.string().trim().min(1)
})