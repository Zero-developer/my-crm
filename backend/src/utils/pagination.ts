import { z } from 'zod'

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
}).strict();

export type PaginationQuery = z.infer<typeof paginationSchema>;

export function getPagination(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const take = limit;

    return {
        skip,
        take
    }
}

export function paginationMeta(page: number, limit: number, total: number) {
    const totalPages = Math.ceil(total/limit);

    return {
        page,
        limit,
        total,
        totalPages
    }
}