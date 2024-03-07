import * as nest from '@nestjs/common';
import util from 'util';
import winston from 'winston';

import { Configuration } from './config';

type LogMethod = (message: unknown) => void;

/** LoggerService interface */
interface ILogger extends Readonly<Record<nest.LogLevel, LogMethod>> {}

const stringify = (input: unknown) => util.inspect(input, { depth: 5 });

namespace Winston {
    const logger = winston.createLogger({
        levels: {
            FATAL: 0,
            ERROR: 1,
            WARN: 2,
            LOG: 3,
            VERBOSE: 4,
            DEBUG: 5,
        },
        level: Configuration.NODE_ENV === 'production' ? 'LOG' : 'DEBUG',
        transports: new winston.transports.Stream({
            stream: process.stdout,
            format: winston.format.combine(
                winston.format.printf(
                    (info) => `[${info.level}] ${info.message}`,
                ),
                ...(Configuration.NODE_ENV !== 'production'
                    ? [
                          winston.format.colorize({
                              message: true,
                              colors: {
                                  FATAL: 'purple',
                                  ERROR: 'red',
                                  WARN: 'yellow',
                                  LOG: 'white',
                                  VERBOSE: 'white',
                                  DEBUG: 'white',
                              },
                          }),
                      ]
                    : []),
            ),
        }),
    });

    export const write =
        (level: 'FATAL' | 'ERROR' | 'WARN' | 'LOG' | 'VERBOSE' | 'DEBUG') =>
        (message: unknown): void => {
            logger.log(level, stringify(message).replaceAll('\\n', '\n'));
        };
}

export const logger: ILogger = {
    fatal(message) {
        if (message instanceof Error) {
            const { message: msg, name, stack, ...meta } = message;
            Winston.write('FATAL')(
                stack
                    ? stack + stringify(meta)
                    : { name, message: msg, ...meta },
            );
            return;
        }
        Winston.write('FATAL')(message);
    },
    error(message) {
        if (message instanceof Error) {
            const { message: msg, name, stack, ...meta } = message;
            Winston.write('ERROR')(
                stack
                    ? stack + stringify(meta)
                    : { name, message: msg, ...meta },
            );
            return;
        }
        Winston.write('ERROR')(message);
    },
    warn: Winston.write('WARN'),
    log: Winston.write('LOG'),
    verbose: Winston.write('VERBOSE'),
    debug: Winston.write('DEBUG'),
};

/**
 * lambda 환경에서는 별도의 로그 스트림 연결이 필요 없음
import { CloudWatchLogsClient, PutLogEventsCommand } from '@aws-sdk/client-cloudwatch-logs';
import { Writable } from 'stream';
const aws_client = new CloudWatchLogsClient();
new Writable({
    write(chunk, _, callback) {
        const command = new PutLogEventsCommand({
            logGroupName: Configuration.AWS_LOG_GROUP,
            logStreamName: Configuration.NODE_ENV,
            logEvents: [
                {
                    message: chunk.toString(),
                    timestamp: Date.now(),
                },
            ],
        });
        aws_client
            .send(command)
            .then(() => callback())
            .catch(console.log);
    },
})
*/
