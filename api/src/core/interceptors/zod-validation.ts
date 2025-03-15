import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { AnyZodObject } from "zod";

@Injectable()
export class ZodValidationInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest()

        // const bodySchema: AnyZodObject = this.reflector.get('zodBodySchema', context.getHandler())
        // const querySchema: AnyZodObject = this.reflector.get('zodQuerySchema', context.getHandler())
        console.log(11111);
        

        return next.handle()
    }
}