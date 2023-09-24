import { isString } from "@fxts/core";
import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

import { Failure } from "@APP/utils/failure";

import { Logger } from "../logger";

@Catch(Failure.Http)
export class HttpFailureFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: Failure.Http, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        if (isString(exception.log)) Logger.error(exception.log);
        httpAdapter.reply(
            ctx.getResponse(),
            exception.message,
            exception.status,
        );
    }
}
