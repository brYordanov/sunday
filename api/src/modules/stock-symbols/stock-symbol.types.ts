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
  statusCode: number; 
  message: string;
  data?: StockSymbol[];
};


export type QueryParams = {
  query: string,
  limit: number,
  order: 'ASC' | 'DESC'
}
