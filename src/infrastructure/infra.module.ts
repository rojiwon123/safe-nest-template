import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";

import { BadRequestExceptionFilter } from "./filter/badrequest.filter";
import { FailureFilter } from "./filter/failure.filter";
import { UnExpectedExceptionFilter } from "./filter/unexpected.filter";

@Module({
    providers: [
        { provide: APP_FILTER, useClass: UnExpectedExceptionFilter },
        { provide: APP_FILTER, useClass: FailureFilter },
        { provide: APP_FILTER, useClass: BadRequestExceptionFilter },
    ],
})
export class InfraModule {}
