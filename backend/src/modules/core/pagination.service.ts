import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
  paginate(queryBuilder: any, page: number, limit: number) {
    const skip = (page - 1) * limit;
    return queryBuilder.take(limit).skip(skip);
  }
}
