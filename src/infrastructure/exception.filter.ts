import * as nest from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';

import { Exception } from '@SRC/common/exception';

import { logger } from './logger';

@nest.Catch()
export class ExceptionFilter implements nest.ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: nest.ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        // custom error
        if (exception instanceof Exception) {
            logger.error(exception);
            httpAdapter.reply(res, exception.body, exception.getStatus());
        }
        // native error
        if (this.isHttpException(exception)) {
            const response = exception.getResponse();
            const message =
                typeof response === 'object' &&
                'message' in response &&
                typeof response['message'] === 'string'
                    ? response['message']
                    : undefined;

            httpAdapter.reply(
                res,
                { code: 'NATIVE_ERROR', message },
                exception.getStatus(),
            );
            return;
        }

        // unknwon error
        logger.error(exception);
        const status = nest.HttpStatus.INTERNAL_SERVER_ERROR;
        const code = 'NTERNAL_SERVER_ERROR';
        httpAdapter.reply(res, { code }, status);
    }

    isHttpException(error: unknown): error is nest.HttpException {
        const prototype = Object.getPrototypeOf(error);
        if (typeof prototype === 'object' && prototype !== null) {
            const name = prototype.constructor.name;
            if (name === 'HttpException') return true;
            if (name === 'Error' || name === 'Object') return false; // 재귀 단축
            return this.isHttpException(prototype);
        }
        return false;
    }
}
