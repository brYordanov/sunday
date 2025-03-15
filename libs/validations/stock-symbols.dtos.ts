export {};
import { z } from "zod";

export const StockSymbolQueryParamsDto = z.object({
    query: z.string(),
    limit: z.number().int().positive(),
    order: z.enum(['ASC', 'DESC'])
})