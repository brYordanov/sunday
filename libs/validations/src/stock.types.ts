import { symbol, z } from 'zod';

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
  createdAt: z.string(),
});

export type StockDto = z.infer<typeof StockSchema>;
