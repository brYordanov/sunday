import { StockSymbol } from './stock-symbol.entity';

export type SymbolExternalApi = {
  symbol: string;
  name: string;
  price: number;
  exchange: string;
  exchangeShortName: string;
  type: string;
};

export type Response = {
  message: string;
  data?: StockSymbol[];
};
