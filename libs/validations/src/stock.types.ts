import { z } from 'zod';
import { StockSymbolSchema } from './stock-symbols.types';

export const StockSchema = z.object({
  id: z.number(),
  symbol: z.string(),
  oldestRecordDate: z.string(),
  newestRecordDate: z.string(),
  createdAt: z.coerce.date().transform((date) => date.toISOString().split('T')[0]),
});
export type StockDto = z.infer<typeof StockSchema>;

export const GetStockQueryParamsSchema = z.object({
  id: z.coerce.number().optional(),
  symbol: z.string().optional(),
  createdAfter: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, 'Date must be in the format YYYY-MM-DD')
    .optional(),
  createdBefore: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, 'Date must be in the format YYYY-MM-DD')
    .optional(),
  order: z.enum(['ASC', 'DESC']).optional(),
});
export type GetStockQueryParamsDto = z.infer<typeof GetStockQueryParamsSchema>;

export const StockSymbolPropertySchema = z.object({
  symbol: z.string().nonempty(),
});
export type StockSymbolPropertyDto = z.infer<typeof StockSymbolPropertySchema>;

export const DetailedStockInfoSchema = z.object({
  analysedData: StockSchema,
  stockSymbolData: StockSymbolSchema,
  cachedData: z.record(z.any()),
});
export type DetailedStockInfoDto = z.infer<typeof DetailedStockInfoSchema>;
