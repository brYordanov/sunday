import { SetMetadata } from "@nestjs/common";
import { AnyZodObject } from "zod";

export const ValidateBody = (schema: AnyZodObject) => SetMetadata('zodBodySchema', schema) 

export const ValidateQuery = (schema: AnyZodObject) => SetMetadata('zodQuerySchema', schema)

export const ValidateResponse = (schema: AnyZodObject) => SetMetadata('zodResponseSchema', schema)