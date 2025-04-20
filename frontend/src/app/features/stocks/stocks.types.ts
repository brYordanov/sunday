export type registerStockPayload = {
  symbol: string;
};

export type StockQueryParams = Partial<{
  symbol: string | null;
  createdAfter: Date | null;
  createdBefore: Date | null;
}>;
