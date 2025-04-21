import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StocksModule } from './modules/stocks/stocks.module';
import { join } from 'path';
import { CacheModule } from './modules/cache/cache.module';
import { StockSymbolsModule } from './modules/stock-symbols/stock-symbols.module';
import { CryptoModule } from './modules/crypto/crypto.module';

@Module({
  imports: [
    StocksModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'local'}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PG_HOST'),
        port: configService.get('PG_PORT'),
        username: configService.get('PG_USERNAME'),
        password: configService.get('PG_PASSWORD'),
        database: configService.get('PG_NAME'),
        entities: [join(process.cwd(), 'dist/**/*.entity.js')],
        synchronize: false,
      }),
    }),
    CacheModule,
    StockSymbolsModule,
    CryptoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
