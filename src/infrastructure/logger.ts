import { getCurrentInvoke } from "@codegenie/serverless-express";
import { isString } from "@fxts/core";
import util from "util";
import winston from "winston";

import { DateTime } from "@/util/datetime";
import { freeze } from "@/util/fn";
import { Once } from "@/util/once";

import { config } from "./config";

type LogLevel = readonly ["FATAL", "ERROR", "WARN", "INFO", "DEBUG"];
export type LogType = LogLevel[number];

type _IndexOf<T extends readonly unknown[], K extends T[number]> = {
    [I in keyof T]: T[I] extends K ? I : never;
}[number];

type IndexOf<T extends LogType> = _IndexOf<LogLevel, T> extends `${infer N extends number}` ? N : never;

type LogLevels = {
    [T in LogType]: IndexOf<T>;
};

const levels = (): LogLevels => ({ FATAL: 0, ERROR: 1, WARN: 2, INFO: 3, DEBUG: 4 });

const timestamp = () => DateTime.of().toLocaleString({ locales: "ko", options: { timeZone: "Asia/Seoul" } });
const inspectOptions = ({ level, colors }: { level: string; colors: boolean }): util.InspectOptions => {
    switch (level) {
        case "FATAL":
        case "ERROR":
        case "WARN":
            return { colors, sorted: false, depth: null };
        case "INFO":
            return { colors, sorted: false };
        case "DEBUG":
            return { colors, sorted: false, depth: null, showHidden: true, showProxy: true, maxArrayLength: null, numericSeparator: true };
        default:
            return { colors };
    }
};

const stringify = ({ colors = false }: { colors?: boolean } = {}) =>
    winston.format((info) => {
        const message: unknown = info.message;
        if (isString(message)) info.message = message;
        if (Array.isArray(message))
            info.message = message
                .map((input) => (isString(input) ? input : util.inspect(input, inspectOptions({ level: info.level, colors }))))
                .join(" ");
        return info;
    })();

const LAMBDA_TRANSPORTS = () => [
    new winston.transports.Stream({
        stream: process.stdout,
        format: winston.format.combine(
            stringify(),
            winston.format.printf(
                (info) =>
                    `[${info.level}] ${timestamp()} ${getCurrentInvoke().context?.awsRequestId}\r` +
                    `${info.message}`.replaceAll("\n", "\r"),
            ),
        ),
    }),
];

const LOCAL_TRANSPORTS = () => [
    new winston.transports.Stream({
        stream: process.stdout,
        format: winston.format.combine(
            stringify({ colors: true }),
            winston.format.colorize({
                colors: {
                    FATAL: "red",
                    ERROR: "blue",
                    WARN: "yellow",
                    INFO: "green",
                    DEBUG: "gray",
                } satisfies Record<LogType, "red" | "blue" | "yellow" | "green" | "gray" | "white">,
                level: true,
            }),
            winston.format.printf((info) => `[${info.level}] ${timestamp()} ${info.message}`),
        ),
    }),
];

const define = Once.of(() => {
    const winstonLogger = winston.createLogger({
        levels: levels(),
        level: config("LOG_LEVEL"),
        transports: config("AWS_EXECUTION_ENV")?.startsWith("AWS_Lambda") ? LAMBDA_TRANSPORTS() : LOCAL_TRANSPORTS(),
    });

    const _logger =
        (level: LogType) =>
        (...message: unknown[]): void => {
            winstonLogger.log(level, { message });
        };

    return freeze({
        fatal: _logger("FATAL"),
        error: _logger("ERROR"),
        warn: _logger("WARN"),
        info: _logger("INFO"),
        log: _logger("INFO"),
        debug: _logger("DEBUG"),
    });
});

export const initLogger = define.init;
export const logger = define.get;
