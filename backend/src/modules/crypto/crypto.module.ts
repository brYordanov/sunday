import { Module } from '@nestjs/common';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Crypto } from './crypto.entity';
import { CacheModule } from '../cache/cache.module';
import { CryptoSymbolsModule } from '../crypto-symbols/crypto-symbols.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Crypto]),
    HttpModule.register({
      baseURL: 'https://data-api.coindesk.com',
    }),
    ConfigModule.forRoot(),
    CacheModule,
    CryptoSymbolsModule,
  ],
  controllers: [CryptoController],
  providers: [CryptoService],
})
export class CryptoModule {}
