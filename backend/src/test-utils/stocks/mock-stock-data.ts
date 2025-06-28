export const mockStockData = {
  id: 1,
  symbol: 'AAPL',
  oldestRecordDate: '2020-01-01',
  newestRecordDate: '2024-01-01',
  createdAt: new Date('2024-01-01'),
};

export const mockStockDto = {
  id: 1,
  symbol: 'AAPL',
  oldestRecordDate: '2020-01-01',
  newestRecordDate: '2024-01-01',
  createdAt: '2024-01-01',
};

export const mockStockSchema = {
  '2024-01-01': {
    open: 100,
    close: 150,
    volume: 10000,
  },
};

export const mockSymbolSchema = {
  symbol: 'AAPL',
  name: 'Apple Inc',
  exchangeName: 'NASDAQ',
  exchangeShortName: 'NASDAQ',
  type: 'Equity',
};

export const mockStockSchemaStringified = JSON.stringify({
  '2024-06-01': { OPEN: 100, CLOSE: 105, HIGH: 110, LOW: 90, VOLUME: 100000 },
});
