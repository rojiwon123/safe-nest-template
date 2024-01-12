import * as nest from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { Request, Response } from "express";
import util from "util";

import { Failure } from "@APP/utils/failure";

import { Logger } from "./logger";

const stringify = (input: unknown) => util.inspect(input, { depth: 5 });

@nest.Catch()
export class ExceptionFilter implements nest.ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: nest.ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const req = ctx.getRequest<Request>();
        const res = ctx.getResponse<Response>();

        const log = (res: ILogResponse) =>
            this.log(
                {
                    method: req.method,
                    url: req.originalUrl,
                    body: req.body,
                },
                res,
            );

        if (this.isHttpException(exception)) {
            const status = exception.getStatus();
            const message = exception.message;
            Logger.warn(
                log({
                    status,
                    message,
                    stack: exception.stack,
                }),
            );
            httpAdapter.reply(res, message, status);
            return;
        }

        if (exception instanceof Failure.Http) {
            const status = exception.status;
            const message = exception.message;
            Logger.warn(
                log({
                    status,
                    message,
                    stack: exception.stack,
                }),
            );
            httpAdapter.reply(res, message, status);
            return;
        }

        const status = nest.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = "NTERNAL_SERVER_ERROR";
        Logger.error(
            log({
                status,
                message,
                stack:
                    exception instanceof Error
                        ? exception.stack
                        : stringify(exception),
            }),
        );
        httpAdapter.reply(res, message, status);
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

    log(req: ILogRequest, res: ILogResponse) {
        return [
            new Date().toISOString(),
            `${req.method} ${req.url}`,
            stringify(req.body),
            `${res.status} ${res.message}`,
            res.stack,
        ].join("\n");
    }
}

interface ILogRequest {
    method: string;
    url: string;
    body: unknown;
}

interface ILogResponse {
    status: number;
    message: string;
    stack: string | undefined;
}
