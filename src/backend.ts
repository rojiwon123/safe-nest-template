import core from '@nestia/core';
import * as nest from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { Configuration } from './infrastructure/config';
// import { db } from './infrastructure/db';
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
    export const start = (
        options: nest.NestApplicationOptions = {},
    ): Promise<Backend> =>
        core.DynamicModule.mount(controllers, {
            imports: [InfraModule],
        })
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
            .then((app) => app.listen(Configuration.PORT).then(() => app))
            .then(tapLog('start'))
            .then((app) => {
                const end = () => app.close().then(tapLog('end'));
                process.on('SIGINT', () => end().then(() => process.exit(0)));
                return { end };
            });

    export const end = (backend: Backend) => backend.end();
}
