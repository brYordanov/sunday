import { SetMetadata } from '@nestjs/common';
import { AnyZodObject } from 'zod';

export const ValidateBody = (schema: AnyZodObject) =>
  SetMetadata('zodBodySchema', schema as AnyZodObject);

export const ValidateQuery = (schema: AnyZodObject) =>
  SetMetadata('zodQuerySchema', schema as AnyZodObject);

export const ValidateResponse = (schema: AnyZodObject) =>
  SetMetadata('zodResponseSchema', schema as AnyZodObject);
