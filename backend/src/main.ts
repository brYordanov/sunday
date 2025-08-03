import { resolve } from 'path';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ZodValidationInterceptor } from './core/interceptors/zod-validation.interceptor';
import 'tsconfig-paths/register';

const isProd = process.env.NODE_ENV === 'production';
const envFile = isProd ? '.env.docker' : '.env.local';
const corsOrigin = isProd ? ['https://sunday-fe.bigtilt.org'] : '*';
dotenv.config({ path: envFile });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    origin: corsOrigin,
    // credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  };

  app.useGlobalInterceptors(new ZodValidationInterceptor(new Reflector()));

  app.enableCors(corsOptions);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
