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

export class Backend {
    private constructor(private readonly _app: nest.INestApplication) {
        process.on('SIGINT', () =>
            this.end()
                // .then(() => db.$connect())
                .then(() => process.exit(0)),
        );
    }

    static async start(options: nest.NestApplicationOptions = {}) {
        //   await db.$connect();
        return core.DynamicModule.mount(controllers, {
            imports: [InfraModule],
        })
            .then((module) => NestFactory.create(module, options))
            .then((app) =>
                app.use(
                    cookieParser(),
                    helmet({
                        contentSecurityPolicy: true,
                        hidePoweredBy: true,
                    }),
                ),
            )
            .then((app) => app.init())
            .then((app) => app.listen(Configuration.PORT).then(() => app))
            .then(tapLog('start'))
            .then((app) => new Backend(app));
    }

    async end() {
        return this._app.close().then(tapLog('end'));
    }
}
