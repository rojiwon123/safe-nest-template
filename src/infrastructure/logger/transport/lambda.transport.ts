import { getCurrentInvoke } from "@codegenie/serverless-express";
import winston from "winston";

import { stringifyLogFormat } from "./stringify.format";

export const LAMBDA_TRANSPORTS = () => [
    new winston.transports.Stream({
        stream: process.stdout,
        format: winston.format.combine(
            stringifyLogFormat({ colors: false }),
            winston.format.printf(
                (info) =>
                    `[${info.level}] ${new Date().toISOString()} ${getCurrentInvoke().context?.awsRequestId}\r` +
                    `${info.message}`.replaceAll("\n", "\r"),
            ),
        ),
    }),
];
