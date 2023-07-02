import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { AllExceptionFilter } from "./filter/all-exception.filter";
import { HttpExceptionFilter } from "./filter/http-exception.filter";
import { LoggerInterceptor } from "./interceptor/logger.interceptor";

@Module({
    providers: [
        { provide: APP_FILTER, useClass: AllExceptionFilter },
        { provide: APP_FILTER, useClass: HttpExceptionFilter },
        { provide: APP_INTERCEPTOR, useClass: LoggerInterceptor }, // first
    ],
})
export class InfraModule {}
