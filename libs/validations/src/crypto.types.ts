import { symbol, z } from 'zod';
import { CryptoSymbolSchema } from './crypto-symbols.types';

export const CryptoSchema = z.object({
  id: z.number(),
  symbol: z.string(),
  oldestRecordDate: z.string(),
  newestRecordDate: z.string(),
  createdAt: z.coerce.date().transform((date) => date.toISOString().split('T')[0]),
});
export type CryptoDto = z.output<typeof CryptoSchema>;

export const RegisterCryptoBodySchema = z.object({
  symbol: z.string().nonempty(),
});
export type RegisterCryptoBodyDto = z.infer<typeof RegisterCryptoBodySchema>;

export const GetCryptoQueryParamsSchema = z.object({
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
export type GetCryptoQueryParamsDto = z.infer<typeof GetCryptoQueryParamsSchema>;

export const DetailedCryptoInfoSchema = z.object({
  analysedData: CryptoSchema,
  cryptoSymbolData: CryptoSymbolSchema,
  cachedData: z.record(z.any()),
});
export type DetailedCryptoInfoDto = z.infer<typeof DetailedCryptoInfoSchema>;
