import * as nest from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { Response } from "express";

import { Exception } from "@/common/exception";
import { OmitKeyof } from "@/util/type";

import { config } from "./config";
import { logger } from "./logger";

@nest.Catch()
export class AllExceptionFilter implements nest.ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: nest.ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        const SYSTEM_ERROR: {
            400: Exception.INPUT_INVALID["code"];
            404: Exception.API_NOT_FOUND["code"];
            [x: number]: string | undefined;
        } = {
            400: "INPUT_INVALID",
            404: "API_NOT_FOUND",
        };

        const [body, status]: [Exception<string>, number] =
            exception instanceof Exception.Http ?
                (() => {
                    logger().warn(exception);
                    return [exception.body, exception.status];
                })()
            : this.isHttpException(exception) ?
                [
                    {
                        code: SYSTEM_ERROR[exception.getStatus()],
                        message: exception.message,
                        detail: exception,
                    },
                    exception.getStatus(),
                ]
            :   (() => {
                    logger().fatal(exception);
                    return [
                        {
                            code: "INTERNAL_SERVER_ERROR",
                            message: "요청을 처리할 수 없습니다.",
                            detail: exception,
                        } satisfies Exception.INTERNAL_SERVER_ERROR,
                        nest.HttpStatus.INTERNAL_SERVER_ERROR,
                    ];
                })();

        return this.httpAdapterHost.httpAdapter.reply(res, this.toBody(body), status);
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

    toBody(input: Exception<string>): Exception<string> {
        if (config("NODE_ENV") !== "production") return input;
        return { code: input.code, message: input.message } satisfies OmitKeyof<Exception<string>, "detail">;
    }
}
