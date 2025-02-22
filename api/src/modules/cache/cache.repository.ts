import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Cache } from './entities/cache.entity';

@Injectable()
export class CacheRepository {
  constructor(
    @InjectRepository(Cache)
    private readonly cacheRepo: Repository<Cache>,
  ) {}

  async get(key: string): Promise<any> {
    const cacheEntry = await this.cacheRepo.findOneBy({ key });
    return cacheEntry ? cacheEntry.value : null;
  }

  async set(key: string, value: any): Promise<void> {
    const cacheEntry = this.cacheRepo.create({ key, value });
    await this.cacheRepo.save(cacheEntry);
  }

  async delete(key: string): Promise<void> {
    await this.cacheRepo.delete({ key });
  }

  async clearAll(): Promise<void> {
    await this.cacheRepo.clear();
  }
}
