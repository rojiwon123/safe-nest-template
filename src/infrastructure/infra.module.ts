import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";

import { ExceptionFilter } from "./exception.filter";

@Module({
    providers: [{ provide: APP_FILTER, useClass: ExceptionFilter }],
})
export class InfraModule {}
