import { DynamicModule } from "@nestia/core";
import { INestApplication, NestApplicationOptions } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import { prisma } from "./infrastructure/DB";
import { Configuration } from "./infrastructure/config";
import { InfraModule } from "./infrastructure/infra.module";
import { Logger } from "./infrastructure/logger";

export namespace Backend {
    export const start = async (
        options: NestApplicationOptions = {},
    ): Promise<INestApplication> => {
        // await prisma.$connect();
        const app = await NestFactory.create(
            await DynamicModule.mount(`${__dirname}/controllers`, {
                imports: [InfraModule],
            }),
            options,
        );
        await app
            .use(cookieParser())
            .use(helmet({ contentSecurityPolicy: true, hidePoweredBy: true }))
            .listen(Configuration.PORT);
        process.on("SIGINT", async () => {
            await end(app);
            process.exit(0);
        });
        Logger.info(
            `Server start ${new Date().toLocaleString(undefined, {
                timeZoneName: "longGeneric",
            })}`,
        );
        return app;
    };

    export const end = async (app: INestApplication) => {
        await app.close();
        await prisma.$disconnect();
        Logger.info(
            `Server end ${new Date().toLocaleString(undefined, {
                timeZoneName: "longGeneric",
            })}`,
        );
    };
}
