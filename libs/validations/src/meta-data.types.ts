import { z } from 'zod';

export const PagiantedMetaDataSchema = z.object({
  total: z.number(),
  page: z.number(),
  totalPages: z.number(),
  itemsPerPage: z.number(),
});

export type PagiantedMetaDataDto = z.infer<typeof PagiantedMetaDataSchema>;
