import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

import { ErrorCode } from "@APP/types/ErrorCode";

@Catch(BadRequestException)
export class BadRequestFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: BadRequestException, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        httpAdapter.reply(
            ctx.getResponse(),
            "INVALID_INPUT" satisfies ErrorCode.InvalidInput,
            exception.getStatus(),
        );
    }
}
