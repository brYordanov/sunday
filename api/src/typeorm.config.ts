import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';
import * as glob from 'glob';

config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('PG_HOST'),
  port: +configService.get('PG_PORT'),
  username: configService.get('PG_USERNAME'),
  password: configService.get('PG_PASSWORD'),
  database: configService.get('PG_NAME'),
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
  synchronize: false,
});
