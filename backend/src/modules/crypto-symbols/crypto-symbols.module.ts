import { Module } from '@nestjs/common';
import { CryptoSymbolsController } from './crypto-symbols.controller';
import { CryptoSymbolsService } from './crypto-symbols.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoSymbol } from './crypto-symbols.entity';
import { HttpModule } from '@nestjs/axios';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [TypeOrmModule.forFeature([CryptoSymbol]), HttpModule.register({}), CoreModule],
  controllers: [CryptoSymbolsController],
  providers: [CryptoSymbolsService],
  exports: [CryptoSymbolsService],
})
export class CryptoSymbolsModule {}
