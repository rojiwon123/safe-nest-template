import core from "@nestia/core";
import * as nest from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import { config } from "./infrastructure/config";
import { InfraModule } from "./infrastructure/infra.module";
import { logger } from "./infrastructure/logger";
import { OmitKeyof } from "./util/type";

export interface Backend {
    end: () => Promise<void>;
    listen: () => Promise<void>;
}

export namespace Backend {
    interface IOptions extends OmitKeyof<nest.NestApplicationOptions, "cors"> {
        /**
         * nest application 생성 전 실행되는 함수
         */
        preStart?: () => void | Promise<void>;
        /**
         * nest application이 종료된 후 실행되는 함수
         */
        postEnd?: () => void | Promise<void>;
    }

    const callAsync = async (fn?: () => unknown | Promise<unknown>) => (fn ? fn() : null);

    export const start = (options: IOptions = {}): Promise<Backend> =>
        callAsync(options.preStart)
            .then(async () =>
                NestFactory.create(core.DynamicModule.mount(`${__dirname}/controller`, { imports: [InfraModule] }), {
                    ...options,
                    cors: {
                        origin: config("ORIGIN")
                            .split(/\s+/)
                            .filter((line) => line !== ""),
                        credentials: true,
                    },
                }),
            )
            .then((app) => app.use(cookieParser(), helmet({ contentSecurityPolicy: true, hidePoweredBy: true })).init())
            .then((app) => {
                const end = () =>
                    app
                        .close()
                        .then(options.postEnd)
                        .then(() => logger().log("Nest Application end"));
                const listen = () => app.listen(config("PORT")).then(() => logger().log(`Nest Application listening on ${config("PORT")}`));
                process.on("SIGINT", () => end().then(() => process.exit(process.exitCode)));
                logger().log("Nest Application start");
                return { end, listen };
            });

    export const end = (backend: Backend) => backend.end();
    export const listen = (backend: Backend) => backend.listen();
}
