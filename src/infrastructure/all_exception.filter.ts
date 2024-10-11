import * as nest from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { Response } from "express";

import { Exception } from "@SRC/common/exception";

import { logger } from "./logger";

@nest.Catch()
export class AllExceptionFilter implements nest.ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: nest.ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const [body, status] =
            exception instanceof Exception.Http ?
                (() => {
                    logger.warn(exception);
                    return [exception.body, exception.status];
                })()
            : this.isHttpException(exception) ?
                [
                    {
                        code: "SYSTEM_ERROR",
                        message: exception.message,
                    } satisfies Exception.SystemError,
                    exception.getStatus(),
                ]
            :   (() => {
                    logger.error(exception);
                    return [
                        {
                            code: "SYSTEM_ERROR",
                            message: "internal_server_error",
                        } satisfies Exception.SystemError,
                        nest.HttpStatus.INTERNAL_SERVER_ERROR,
                    ];
                })();

        const { httpAdapter } = this.httpAdapterHost;
        return httpAdapter.reply(res, body, status);
    }

    isHttpException(error: unknown): error is nest.HttpException {
        const prototype = Object.getPrototypeOf(error);
        if (typeof prototype === "object" && prototype !== null) {
            const name = prototype.constructor.name;
            if (name === "HttpException") return true;
            if (name === "Error" || name === "Object") return false; // 재귀 단축
            return this.isHttpException(prototype);
        }
        return false;
    }
}
