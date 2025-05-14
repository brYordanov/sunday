export const mockAnalysedData = {
  id: 1,
  symbol: 'BTC',
  oldestRecordDate: '2023-01-01',
  newestRecordDate: '2024-01-01',
  createdAt: '2023-01-01T00:00:00Z',
};

export const mockSymbolData = {
  symbol: 'BTC',
  name: 'Bitcoin',
  id: 'bitcoin',
  image: 'https://example.com/image.png',
  circulating_supply: 19423485,
  total_supply: 21000000,
  max_supply: 21000000,
  ath: 69000,
  ath_change_percentage: -10.5,
  ath_date: '2021-11-10T00:00:00Z',
  atl: 67.81,
  atl_change_percentage: 30000,
  last_updated: '2024-01-01T00:00:00Z',
};

export const mockCachedData = JSON.stringify({
  '2024-01-28': {
    open: 10,
    close: 20,
    high: 25,
    low: 5,
    volume: 100,
    _timestamp: 1700000000,
  },
});
