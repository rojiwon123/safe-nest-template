import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

import { Logger } from "../logger";

@Catch()
export class UnExpectedErrorFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        Logger.error(
            exception instanceof Error ? exception.stack : "Unknown Error",
        );
        httpAdapter.reply(
            ctx.getResponse(),
            "INTERNAL_SERVER_ERROR",
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}
