import { z } from 'zod';
import { PagiantedMetaDataSchema } from './meta-data.types';

export const CryptoSymbolSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  image: z.string(),
  circulating_supply: z.number().min(0),
  total_supply: z.number().min(0),
  max_supply: z.number().nullable(),
  ath: z.number(),
  ath_change_percentage: z.number(),
  ath_date: z.string(),
  atl: z.number(),
  atl_change_percentage: z.number(),
  last_updated: z.string(),
});
export type CryptoSymbolDto = z.infer<typeof CryptoSymbolSchema>;

export const populateCryptoSymbolsResponseSchema = z.object({
  message: z.string(),
  data: z.array(CryptoSymbolSchema).optional(),
});
export type PopulateCryptoSymbolsResponseDto = z.infer<typeof populateCryptoSymbolsResponseSchema>;

export const CryptoSymbolQueryParamsSchema = z.object({
  query: z
    .string()
    .optional()
    .transform((val) => val?.toUpperCase()),
  limit: z.coerce.number().int().positive().default(10),
  order: z.enum(['ASC', 'DESC']).default('ASC'),
  page: z.coerce.number().int().positive().default(1),
});
export type CryptoSymbolQueryParamsDto = z.infer<typeof CryptoSymbolQueryParamsSchema>;

export const CryptoSymbolPaginatedResponceSchema = z.object({
  data: CryptoSymbolSchema.array(),
  metaData: PagiantedMetaDataSchema,
});

export type CryptoSymbolPaginatedResponceDto = z.infer<typeof CryptoSymbolPaginatedResponceSchema>;
