export type CryptoQueryParams = Partial<{
  symbol: string | null;
  createdAfter: Date | null;
  createdBefore: Date | null;
}>;

export type registerCryptoPayload = {
  symbol: string;
};
