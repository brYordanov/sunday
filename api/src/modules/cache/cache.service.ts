import { Injectable } from '@nestjs/common';
import { CacheRepository } from './cache.repository';

@Injectable()
export class CacheService {
  constructor(private readonly cacheRepository: CacheRepository) {}

  async getCachedData(key: string): Promise<any> {
    return this.cacheRepository.get(key);
  }

  async setCachedData(key: string, value: any): Promise<void> {
    await this.cacheRepository.set(key, value);
  }

  async deleteCachedData(key: string): Promise<void> {
    await this.cacheRepository.delete(key);
  }
}
