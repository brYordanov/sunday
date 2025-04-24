import { Module } from '@nestjs/common';
import { CryptoSymbolsController } from './crypto-symbols.controller';
import { CryptoSymbolsService } from './crypto-symbols.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoSymbol } from './crypto-symbols.entity';
import { PaginationService } from 'src/core/services/pagination.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([CryptoSymbol]), HttpModule.register({})],
  controllers: [CryptoSymbolsController],
  providers: [CryptoSymbolsService, PaginationService],
})
export class CryptoSymbolsModule {}
