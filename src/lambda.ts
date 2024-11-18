import sls from "@codegenie/serverless-express";
import type { Handler } from "aws-lambda";

import { Backend } from "./backend";
import { Exception } from "./common/exception";
import { initConfig } from "./infrastructure/config";
import { initLogger, logger } from "./infrastructure/logger";
import { Once } from "./util/once";

initConfig();
initLogger();

const backend = Once.of(() =>
    Backend.create({ logger: false })
        .get()
        .then((app) => sls({ app: app.getHttpAdapter().getInstance() })),
);

backend.init();
export const handler: Handler = (event, context, callback) =>
    backend
        .map(async (f) => (await f)(event, context, callback))
        .catch((err: unknown) => {
            logger().fatal(context.awsRequestId, err);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "서비스가 불가능합니다.",
                } satisfies Exception.INTERNAL_SERVER_ERROR),
                headers: { "Content-Type": "application/json" },
            };
        });
