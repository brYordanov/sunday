export const createMockRepo = () => ({
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  count: jest.fn(),
  createQueryBuilder: jest.fn(),
});

export const createMockHttpService = () => ({
  axiosRef: {
    get: jest.fn(),
  },
});
