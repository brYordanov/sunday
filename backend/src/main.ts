import { resolve } from 'path';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ZodValidationInterceptor } from './core/interceptors/zod-validation.interceptor';
import 'tsconfig-paths/register';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.docker' : '.env.local' });

const isProd = process.env.NODE_ENV === 'production';

const ALLOWED_ORIGINS = isProd ? ['https://sunday-fe.bigtilt.org'] : '*';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    origin: ALLOWED_ORIGINS,
    // credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
  };

  app.useGlobalInterceptors(new ZodValidationInterceptor(new Reflector()));

  app.enableCors(corsOptions);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
