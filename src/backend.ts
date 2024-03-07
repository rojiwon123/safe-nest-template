import { DynamicModule } from '@nestia/core';
import * as nest from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { Configuration } from './infrastructure/config';
import { db } from './infrastructure/db';
import { InfraModule } from './infrastructure/infra.module';
import { logger } from './infrastructure/logger';

const controllers = `${__dirname}/controllers`;
const date = () =>
    new Date().toLocaleString(undefined, {
        timeZoneName: 'longGeneric',
    });

export class Backend {
    private constructor(private readonly _application: nest.INestApplication) {}

    static async create(
        options: nest.NestApplicationOptions = {},
    ): Promise<Backend> {
        await db.$connect();
        const app = await NestFactory.create(
            await DynamicModule.mount(controllers, {
                imports: [InfraModule],
            }),
            options,
        );
        app.use(cookieParser()).use(
            helmet({ contentSecurityPolicy: true, hidePoweredBy: true }),
        );
        const backend = new Backend(app);
        process.on('SIGINT', async () => {
            await backend.close();
            process.exit(0);
        });
        return backend;
    }

    async open() {
        await this._application.listen(Configuration.PORT);
        logger.log(`Server open ${date()}`);
    }

    async close() {
        await this._application.close();
        await db.$disconnect();
        logger.log(`Server close ${date()}`);
    }
}
