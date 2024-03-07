import * as nest from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';

import { logger } from './logger';

@nest.Catch()
export class ExceptionFilter implements nest.ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: nest.ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        if (this.isHttpException(exception)) {
            const status = exception.getStatus();
            const message = exception.message;
            httpAdapter.reply(res, message, status);
            return;
        }

        logger.error(exception);
        const status = nest.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = 'NTERNAL_SERVER_ERROR';
        httpAdapter.reply(res, message, status);
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
