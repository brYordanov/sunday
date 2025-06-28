export const createMockSymbolService = () => ({
  getSpecificSymbol: jest.fn(),
});

export const createMockRepo = () => ({
  createQueryBuilder: jest.fn(),
  count: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

export const createMockHttpService = () => ({
  axiosRef: {
    get: jest.fn(),
  },
});

export const createMockPaginationService = () => ({
  paginate: jest.fn(),
});

export const createConfigService = () => ({
  get: jest.fn().mockReturnValue('mock-api-key'),
});
