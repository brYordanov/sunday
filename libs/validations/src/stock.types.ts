import { z } from 'zod';
import { parseStringToDate } from './helpers';

const TermSchema = z.object({
  trend: z.string(),
  change: z.number(),
  isStable: z.boolean(),
});

export const StockSchema = z.object({
  id: z.number(),
  symbol: z.string(),
  oldestRecordDate: z.string(),
  newestRecordDate: z.string(),
  termAnalysis: z.object({
    midTerm: TermSchema,
    longTerm: TermSchema,
    shortTerm: TermSchema,
  }),
  predictability: z.object({
    midTerm: z.boolean(),
    longTerm: z.boolean(),
    shortTerm: z.boolean(),
  }),
  createdAt: z.date().transform((date) => date.toISOString().split('T')[0]),
});

export type StockDto = z.infer<typeof StockSchema>;

export const GetStockQueryParamsSchema = z.object({
  id: z.coerce.number().optional(),
  symbol: z.string().optional(),
  createdAfter: z.string().optional(),
  createdBefore: z.string().optional(),
  order: z.enum(['ASC', 'DESC']).optional(),
});

export type GetStockQueryParamsDto = z.infer<typeof GetStockQueryParamsSchema>;

export const RegisterStockBodySchema = z.object({
  symbol: z.string().nonempty(),
});

export type RegisterStockBodyDto = z.infer<typeof RegisterStockBodySchema>;
