import { isString } from "@fxts/core";
import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

import { HttpFailure } from "@APP/utils/failure";

import { Logger } from "../logger";

@Catch(HttpFailure)
export class HttpFailureFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: HttpFailure, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        if (isString(exception.stack)) Logger.error(exception.stack);
        httpAdapter.reply(
            ctx.getResponse(),
            exception.message,
            exception.status,
        );
    }
}
