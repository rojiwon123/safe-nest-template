import * as cloudwatch from "@aws-sdk/client-cloudwatch-logs";
import stream from "stream";
import util from "util";
import winston from "winston";

import { DateTime } from "@SRC/util/datetime";
import { freezeObject } from "@SRC/util/fn";
import { Once } from "@SRC/util/once";

import { config } from "./config";

type LogLevel = readonly ["FATAL", "ERROR", "WARN", "INFO", "DEBUG"];

export type LogType = LogLevel[number];

type _IndexOf<T extends readonly unknown[], K extends T[number]> = {
    [I in keyof T]: T[I] extends K ? I : never;
}[number];

type IndexOf<T extends LogType> = _IndexOf<LogLevel, T> extends `${infer N extends number}` ? N : never;

type LogLevels = { [T in LogType]: IndexOf<T> };
const levels = (): LogLevels => ({
    FATAL: 0,
    ERROR: 1,
    WARN: 2,
    INFO: 3,
    DEBUG: 4,
});

const timestamp = () => DateTime.unit().toLcaleString({ locales: "ko", options: { timeZone: "Asia/Seoul" } });
const inspectOptions = ({ level, colors }: { level: string; colors: boolean }): util.InspectOptions => {
    switch (level) {
        case "FATAL":
            return { colors, sorted: false, depth: null };
        case "ERROR":
        case "WARN":
        case "INFO":
            return { colors, sorted: false };
        case "DEBUG":
            return { colors, sorted: false, depth: null, showHidden: true, showProxy: true, maxArrayLength: null, numericSeparator: true };
        default:
            return { colors };
    }
};

const isString = (input: unknown) => typeof input === "string";

const stringify = ({ colors = false }: { colors?: boolean } = {}) =>
    winston.format((info) => {
        const message = info.message;
        if (isString(message)) info.message = message;
        if (Array.isArray(message))
            info.message = message
                .map((input: unknown) => (isString(input) ? input : util.inspect(input, inspectOptions({ level: info.level, colors }))))
                .join(" ");
        return info;
    })();

const localTransports = () => [
    new winston.transports.Stream({
        stream: process.stdout,
        format: winston.format.combine(
            stringify({ colors: true }),
            winston.format.colorize({
                level: true,
                colors: {
                    FATAL: "red",
                    ERROR: "blue",
                    WARN: "yellow",
                    INFO: "green",
                    DEBUG: "gray",
                } satisfies Record<LogType, "red" | "blue" | "yellow" | "green" | "gray" | "white">,
            }),
            winston.format.printf((info) => `[${info.level}] ${timestamp()} ${info.message}`),
        ),
    }),
];

const cloudTransports = () => [
    new winston.transports.Stream({
        stream: new stream.Writable({
            write(chunk, _, callback) {
                const message = typeof chunk === "string" ? chunk : "";
                const timestamp = Date.now();
                return new cloudwatch.CloudWatchLogsClient()
                    .send(
                        new cloudwatch.PutLogEventsCommand({
                            logGroupName: "log-group-name",
                            logStreamName: "log-stream-name",
                            logEvents: [{ message, timestamp }],
                        }),
                    )
                    .then(() => callback(null))
                    .catch(callback);
            },
        }),
        format: winston.format.combine(
            stringify({ colors: false }),
            winston.format.printf((info) => `[${info.level}] ${timestamp()} ${info.message}`),
        ),
    }),
];
cloudTransports;

const once = Once.unit(() => {
    const winston_logger = winston.createLogger({
        levels: levels(),
        level: config("LOG_LEVEL"),
        silent: config("SILENT") === true || config("SILENT") === "true",
        transports: localTransports(),
    });

    const _logger =
        (level: LogType) =>
        (...message: unknown[]) => {
            winston_logger.log(level, { message });
        };

    return freezeObject({
        fatal: _logger("FATAL"),
        error: _logger("ERROR"),
        warn: _logger("WARN"),
        info: _logger("INFO"),
        log: _logger("INFO"),
        debug: _logger("DEBUG"),
    });
});

export const initLogger = once.init;
export const logger = once.run;
