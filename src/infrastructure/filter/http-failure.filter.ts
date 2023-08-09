import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

import { HttpFailure } from "@APP/utils";

@Catch(HttpFailure)
export class HttpFailureFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: HttpFailure, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        httpAdapter.reply(
            ctx.getResponse(),
            exception.message,
            exception.status,
        );
    }
}
