import * as nest from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { Response } from "express";

import { Exception } from "@SRC/util/exception";
import { OmitKeyof } from "@SRC/util/type";

import { config } from "./config";
import { logger } from "./logger";

@nest.Catch()
export class AllExceptionFilter implements nest.ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: nest.ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        const getCode = (status: number): (Exception.INPUT_INVALID | Exception.API_NOT_FOUND | Exception.INTERNAL_SERVER_ERROR)["code"] => {
            switch (status) {
                case 400:
                    return "INPUT_INVALID";
                case 404:
                    return "API_NOT_FOUND";
                default:
                    return "INTERNAL_SERVER_ERROR";
            }
        };

        const [body, status] =
            exception instanceof Exception.Http ?
                (() => {
                    logger().warn(exception);
                    exception.body;
                    return [exception.body as Exception<string>, exception.status];
                })()
            : this.isHttpException(exception) ?
                [
                    {
                        code: getCode(exception.getStatus()),
                        message: exception.message,
                        detail: exception,
                    } satisfies Exception<string>,
                    exception.getStatus(),
                ]
            :   ((): [Exception.INTERNAL_SERVER_ERROR, 500] => {
                    logger().fatal(exception);
                    return [{ code: "INTERNAL_SERVER_ERROR", detail: exception }, nest.HttpStatus.INTERNAL_SERVER_ERROR];
                })();

        const { httpAdapter } = this.httpAdapterHost;
        return httpAdapter.reply(res, this.toBody(body), status);
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

    toBody(exception: Exception<string>): Exception<string> {
        if (config("NODE_ENV") !== "production") return exception;
        return { code: exception.code, message: exception.message } satisfies OmitKeyof<Exception<string>, "detail">;
    }
}
