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
const date = () =>
    new Date().toLocaleString(undefined, {
        timeZoneName: 'longGeneric',
    });

export class Backend {
    private constructor(private readonly _app: nest.INestApplication) {}

    static async start(
        options: nest.NestApplicationOptions = {},
    ): Promise<Backend> {
        //   await db.$connect();
        const app = await NestFactory.create(
            await core.DynamicModule.mount(controllers, {
                imports: [InfraModule],
            }),
            options,
        );
        await app
            .use(
                cookieParser(),
                helmet({ contentSecurityPolicy: true, hidePoweredBy: true }),
            )
            .init();
        await app.listen(Configuration.PORT);
        logger.log(`Server start ${date()}`);
        const backend = new Backend(app);
        process.on('SIGINT', async () => {
            await backend.end();
            process.exit(0);
        });
        return backend;
    }

    async end() {
        await this._app.close();
        //     await db.$disconnect();
        logger.log(`Server end ${date()}`);
    }
}
