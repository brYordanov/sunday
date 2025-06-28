import { StockSymbolPaginatedResponceDto } from '@sunday/validations';

export const mockStockSymbols = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc',
    exchangeName: 'NASDAQ',
    exchangeShortName: 'NASDAQ',
    type: 'Equity',
  },
];

export const mockExternalStockApiSymbols = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc',
    exchange: 'NASDAQ',
    exchangeShortName: 'NASDAQ',
    type: 'Equity',
  },
];

export const mockSymbolsPagiantedResponse: StockSymbolPaginatedResponceDto = {
  data: mockStockSymbols,
  metaData: {
    total: 1,
    page: 1,
    itemsPerPage: 10,
    totalPages: 1,
  },
};
