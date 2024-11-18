import { DynamicModule } from "@nestia/core";
import * as nest from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import { config } from "./infrastructure/config";
import { connectPrisma } from "./infrastructure/db";
import { InfraModule } from "./infrastructure/infra.module";
import { logger } from "./infrastructure/logger";
import { Once } from "./util/once";
import { OmitKeyof } from "./util/type";

export interface Backend {
    start: () => Promise<void>;
    end: () => Promise<void>;
    get: () => Promise<nest.INestApplication<unknown>>;
}

export namespace Backend {
    interface IOptions extends OmitKeyof<nest.NestApplicationOptions, "cors"> {}

    export const create = (options: IOptions = {}): Backend => {
        const app = Once.of(async () =>
            Promise.resolve()
                .then(connectPrisma)
                .then(async () =>
                    NestFactory.create(await DynamicModule.mount(__dirname + "/controller", { imports: [InfraModule] }), {
                        ...options,
                        cors: {
                            origin: config("ALLOW_ORIGIN")
                                .split(/\s+/)
                                .filter((line) => line !== ""),
                            credentials: true,
                        },
                    }),
                )
                .then((app) => app.use(cookieParser(), helmet({ contentSecurityPolicy: true, hidePoweredBy: true })).init()),
        );
        process.on("SIGINT", () =>
            app
                .get()
                .then((b) => b.close())
                .then(() => process.exit(process.exitCode)),
        );
        return {
            start: async () =>
                app
                    .map(async (b) => (await b).listen(config("PORT")))
                    .then(() => logger().log(`Nest Application listening on ${config("PORT")}`)),
            end: () => app.map(async (b) => (await b).close()).then(() => logger().log("Nest Application end")),
            get: app.get,
        };
    };
}
