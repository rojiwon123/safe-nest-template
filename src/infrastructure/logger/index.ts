import winston from "winston";

import { config } from "@/infrastructure/config";
import { LAMBDA_TRANSPORTS } from "@/infrastructure/logger/transport/lambda.transport";
import { LOCAL_TRANSPORTS } from "@/infrastructure/logger/transport/local.transport";
import { Make } from "@/util/make";
import { Exclude } from "@/util/type";

import { LogLevelType } from "./level.type";

const winstonLogger = Make.once(() =>
    winston.createLogger({
        levels: { FATAL: 0, ERROR: 1, WARN: 2, INFO: 3, DEBUG: 4, TRACE: 5 } satisfies Record<Exclude<LogLevelType, "ALL" | "OFF">, number>,
        level: config("LOG_LEVEL"),
        transports: config("AWS_EXECUTION_ENV")?.startsWith("AWS_Lambda") ? LAMBDA_TRANSPORTS() : LOCAL_TRANSPORTS(),
    }),
);

export const logger =
    (level: Exclude<Lowercase<LogLevelType>, "all" | "off"> = "info") =>
    (...message: unknown[]) => {
        winstonLogger().log(level.toUpperCase(), { message });
    };
