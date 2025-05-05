import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { AnyZodObject } from 'zod';

@Injectable()
export class ZodValidationInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const bodySchema: AnyZodObject = this.reflector.get<AnyZodObject>(
      'zodBodySchema',
      context.getHandler(),
    );
    const querySchema: AnyZodObject = this.reflector.get<AnyZodObject>(
      'zodQuerySchema',
      context.getHandler(),
    );
    const responseSchema: AnyZodObject = this.reflector.get<AnyZodObject>(
      'zodResponseSchema',
      context.getHandler(),
    );

    if (querySchema) {
      const queryValidation = querySchema.safeParse(request.query);
      if (!queryValidation.success) {
        throw new BadRequestException({
          message: 'Invalid query params',
          error: queryValidation.error.format(),
        });
      }

      request.query = queryValidation.data;
    }

    if (bodySchema) {
      const bodyValidation = bodySchema.safeParse(request.body);
      if (!bodyValidation.success) {
        throw new BadRequestException({
          message: 'Invalid request body',
          error: bodyValidation.error.format(),
        });
      }

      request.body = bodyValidation.data;
    }

    return next.handle().pipe(
      map((response) => {
        if (responseSchema) {
          const arraySchema = responseSchema.array();
          const schemaToUse = Array.isArray(response) ? arraySchema : responseSchema;
          const responseValidation = schemaToUse.safeParse(response);

          if (!responseValidation.success) {
            throw new BadRequestException({
              message: 'Invalida respose format',
              errors: responseValidation.error.format(),
            });
          }

          return responseValidation.data;
        }

        return response;
      }),
    );
  }
}
