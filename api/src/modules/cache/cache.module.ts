import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheRepository } from './cache.repository';
import { Cache } from './entities/cache.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cache])],
  providers: [CacheService, CacheRepository],
  exports: [CacheService],
})
export class CacheModule {}
