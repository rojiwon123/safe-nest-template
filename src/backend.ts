import core from '@nestia/core';
import * as nest from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { config } from './infrastructure/config';
import { InfraModule } from './infrastructure/infra.module';
import { logger } from './infrastructure/logger';

const controllers = `${__dirname}/controllers`;

const tapLog =
    (command: 'start' | 'end') =>
    <T>(input: T) => {
        logger.log(
            `Server ${command} ${new Date().toLocaleString(undefined, {
                timeZoneName: 'longGeneric',
            })}`,
        );
        return input;
    };

interface Backend {
    end: () => Promise<void>;
}

export namespace Backend {
    interface IOptions extends nest.NestApplicationOptions {
        /**
         * nest application 생성 전 실행되는 함수
         */
        preStart?: () => void | Promise<void>;
        /**
         * nest application이 종료된 후 실행되는 함수
         */
        postEnd?: () => void | Promise<void>;
    }

    const callAsync = async (fn?: () => unknown | Promise<unknown>) =>
        fn ? fn() : null;

    export const start = (options: IOptions = {}): Promise<Backend> =>
        callAsync(options.preStart)
            .then(() =>
                core.DynamicModule.mount(controllers, {
                    imports: [InfraModule],
                }),
            )
            .then((module) => NestFactory.create(module, options))
            .then((app) =>
                app
                    .use(
                        cookieParser(),
                        helmet({
                            contentSecurityPolicy: true,
                            hidePoweredBy: true,
                        }),
                    )
                    .init(),
            )
            .then((app) => app.listen(config('PORT')).then(() => app))
            .then(tapLog('start'))
            .then((app) => {
                const end = () =>
                    app.close().then(options.postEnd).then(tapLog('end'));
                process.on('SIGINT', () => end().then(() => process.exit(0)));
                return { end };
            });

    export const end = (backend: Backend) => backend.end();
}
