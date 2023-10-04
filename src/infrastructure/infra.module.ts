import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";

import { BadRequestFilter } from "./filter/bad-request.filter";
import { HttpFailureFilter } from "./filter/http-failure.filter";
import { UnExpectedErrorFilter } from "./filter/unexpected.filter";

@Module({
    providers: [
        { provide: APP_FILTER, useClass: UnExpectedErrorFilter },
        { provide: APP_FILTER, useClass: HttpFailureFilter },
        { provide: APP_FILTER, useClass: BadRequestFilter },
    ],
})
export class InfraModule {}
