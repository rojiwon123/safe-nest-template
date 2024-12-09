import serverless from "@codegenie/serverless-express";
import { Handler } from "aws-lambda";
import { Option } from "effect";

import { createBackend } from "@/backend";
import { SystemErr } from "@/common/err/err_code/system.code";
import { logger } from "@/infrastructure/logger";

let app: Option.Option<Handler> = Option.none();

export const handler: Handler = async (e, c, cb) => {
    try {
        const sls: Handler = await Option.match(app, {
            onSome: (i) => i,
            onNone: async () => serverless({ app: (await createBackend({ logger: false })).app.getHttpAdapter().getInstance() }),
        });
        app = Option.some(sls);
        return await sls(e, c, cb);
    } catch (error: unknown) {
        logger("fatal")(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                code: "INTERNAL_SERVER_ERROR",
                message: "서비스가 불가능합니다.",
            } satisfies SystemErr.INTERNAL_SERVER_ERROR),
            headers: { "Content-Type": "application/json" },
        };
    }
};
