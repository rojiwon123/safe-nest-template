import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

import { IFailure } from "@APP/api/types";

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: BadRequestException, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        httpAdapter.reply(
            ctx.getResponse(),
            {
                cause: "INVALID_INPUT",
                message: exception.message,
            } satisfies IFailure,
            exception.getStatus(),
        );
    }
}
