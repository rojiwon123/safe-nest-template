import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

import { IFailure } from "@APP/api/types";

import { Logger } from "../logger";

@Catch()
export class UnExpectedExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        Logger.get().error((exception as Error).stack ?? exception);
        httpAdapter.reply(
            ctx.getResponse(),
            {
                cause: "INTERNAL_ERROR",
                message: "알 수 없는 오류가 발생했습니다.",
            } satisfies IFailure,
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}
