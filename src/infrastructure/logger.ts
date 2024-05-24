import * as cloudwatch from '@aws-sdk/client-cloudwatch-logs';
import stream from 'stream';
import util from 'util';
import winston from 'winston';

import { Once } from '@SRC/common/once';

import { config } from './config';

interface LogLevel {
    FATAL: 0;
    ERROR: 1;
    WARN: 2;
    INFO: 3; // log
    DEBUG: 4;
}

const inspect_options: Record<keyof LogLevel, util.InspectOptions> = {
    FATAL: { colors: false, sorted: false },
    ERROR: { colors: false, sorted: false },
    WARN: { colors: false, sorted: false },
    INFO: { colors: false, sorted: false },
    DEBUG: {
        colors: false,
        sorted: false,
        depth: null,
        showHidden: true,
        showProxy: true,
        maxArrayLength: null,
        numericSeparator: true,
    },
};

const stringify = (level: keyof LogLevel, ...messages: unknown[]) =>
    messages
        .map((message) =>
            typeof message === 'string'
                ? message
                : util.inspect(message, inspect_options[level]),
        )
        .join(' ');

const timestamp = () =>
    new Date().toLocaleString('ko', { timeZone: 'Asia/Seoul' });

const writer = Once.unit(() => {
    const CONSOLE_TRANSPORT = new winston.transports.Stream({
        stream: process.stdout,
        format: winston.format.combine(
            winston.format.colorize({
                message: true,
                colors: {
                    FATAL: 'red',
                    ERROR: 'red',
                    WARN: 'yellow',
                    INFO: 'white',
                    DEBUG: 'white',
                } satisfies Record<keyof LogLevel, string>,
            }),
            winston.format.printf((info) => `[${info.level}] ` + info.message),
        ),
    });

    const aws_log_client = new cloudwatch.CloudWatchLogsClient({
        region: 'ap-northeast-2',
    });

    const LOG_STREAM_TRANSPORT = new winston.transports.Stream({
        stream: new stream.Writable({
            write(chunk, _, callback) {
                const message = typeof chunk === 'string' ? chunk : '';
                const timestamp = Date.now();
                return aws_log_client
                    .send(
                        new cloudwatch.PutLogEventsCommand({
                            logGroupName: '',
                            logStreamName: '',
                            logEvents: [{ message, timestamp }],
                        }),
                    )
                    .then(() => callback(null))
                    .catch(callback);
            },
        }),
        format: winston.format.printf(
            (info) => `[${info.level}] ${timestamp()} ${info.message}`,
        ),
    });

    const PRODUCTION_MODE = config('NODE_ENV') === 'production';

    const LOG_LEVEL: keyof LogLevel = PRODUCTION_MODE ? 'INFO' : 'DEBUG';

    const winston_logger = winston.createLogger({
        levels: {
            FATAL: 0,
            ERROR: 1,
            WARN: 2,
            INFO: 3, // log
            DEBUG: 4,
        } satisfies LogLevel,
        level: LOG_LEVEL,
        format: winston.format((info) => {
            info.message = stringify(
                info.level as keyof LogLevel,
                ...info.message,
            );
            return info;
        })(),
        transports: PRODUCTION_MODE
            ? [LOG_STREAM_TRANSPORT]
            : [CONSOLE_TRANSPORT],
    });

    return (level: keyof LogLevel, message: unknown[]): void => {
        winston_logger.log(level, { message });
    };
});

export const logger = Object.freeze({
    fatal: (...message: unknown[]) => writer.run()('FATAL', message),
    error: (...message: unknown[]) => writer.run()('ERROR', message),
    warn: (...message: unknown[]) => writer.run()('WARN', message),
    info: (...message: unknown[]) => writer.run()('INFO', message),
    log: (...message: unknown[]) => writer.run()('INFO', message),
    debug: (...message: unknown[]) => writer.run()('DEBUG', message),
});

export const initLogger = () => writer.init();
