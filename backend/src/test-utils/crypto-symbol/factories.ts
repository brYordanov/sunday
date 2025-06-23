export const createMockSymbolService = () => ({
  getSpecificSymbol: jest.fn(),
});

export const createMockRepo = () => ({
  findOne: jest.fn(),
  count: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn(),
});

export const createMockHttpService = () => ({
  axiosRef: {
    get: jest.fn(),
  },
});

export const createMockPaginationService = () => ({
  paginate: jest.fn(),
});
