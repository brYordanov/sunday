import { PaginationService } from './pagination.service';

describe('PaginationService', () => {
  let service: PaginationService;

  beforeEach(() => {
    service = new PaginationService();
  });

  it('should paginate using take and skip', () => {
    const mockQueryBuilder = {
      take: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
    };

    const page = 2;
    const limit = 10;

    const result = service.paginate(mockQueryBuilder, page, limit);

    expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    expect(mockQueryBuilder.skip).toHaveBeenCalledWith(10);
    expect(result).toBe(mockQueryBuilder);
  });

  it('should return page 1 correctly', () => {
    const mockQueryBuilder = {
      take: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
    };

    const page = 1;
    const limit = 25;

    const result = service.paginate(mockQueryBuilder, page, limit);

    expect(mockQueryBuilder.take).toHaveBeenCalledWith(25);
    expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
    expect(result).toBe(mockQueryBuilder);
  });
});
