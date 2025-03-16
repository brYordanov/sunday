export {};
import { string, z } from 'zod';
import { PagiantedMetaDataSchema } from './meta-data.types';

export const StockSymbolQueryParamsSchema = z.object({
  query: z.string().optional(),
  limit: z.coerce.number().int().positive().default(10),
  order: z.enum(['ASC', 'DESC']).default('ASC'),
  page: z.number().default(1),
});
export type StockSymbolQueryParamsDto = z.infer<typeof StockSymbolQueryParamsSchema>;

export const StockSymbolSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  exchangeName: z.string().nullable(),
  exchangeShortName: z.string().nullable(),
  type: z.string(),
});
export type StockSymbolDto = z.infer<typeof StockSymbolSchema>;

export const StockSymbolResponceSchema = z.object({
  message: z.string(),
  data: StockSymbolSchema.array().optional(),
});
export type StockSymbolResponceDto = z.infer<typeof StockSymbolResponceSchema>;

export const StockSymbolPaginatedResponceSchema = z.object({
  data: StockSymbolSchema.array(),
  metaData: PagiantedMetaDataSchema,
});

export type StockSymbolPaginatedResponceDto = z.infer<typeof StockSymbolPaginatedResponceSchema>;

export type SymbolExternalApi = {
  symbol: string;
  name: string;
  price: number;
  exchange: string;
  exchangeShortName: string;
  type: string;
};

export const StockSymbolExternalApi = z.object({
  symbol: z.string(),
  name: z.string(),
  price: z.number(),
  exchange: z.string(),
  exchangeShortName: z.string().nullable(),
  type: z.string(),
});
export type StockSymbolExternalApiDto = z.infer<typeof StockSymbolExternalApi>;
