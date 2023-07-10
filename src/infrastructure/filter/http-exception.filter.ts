import { IFailure } from "@APP/api/types";
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: HttpException, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        httpAdapter.reply(
            ctx.getResponse(),
            {
                code:
                    (exception.cause as string | undefined) ?? "INVALID_INPUT",
                message: exception.message,
            } satisfies IFailure,
            exception.getStatus(),
        );
    }
}
