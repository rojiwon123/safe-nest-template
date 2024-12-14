import { getCurrentInvoke } from "@codegenie/serverless-express";
import { Array, Layer, LogLevel, Logger, String } from "effect";
import { InspectOptions, inspect } from "util";
import winston from "winston";

import { Make } from "@/util/make";

import { Config, config } from "./config";

export type LogLevelType = LogLevel.LogLevel["label"];

/// 로그 메시지 형식을 맞추기 위한 함수들입니다.

const inspectOptions = ({ level, colors }: { level: string; colors: boolean }): InspectOptions => {
    switch (level) {
        case "FATAL":
        case "ERROR":
        case "WARN":
            return { colors, sorted: false, depth: null };
        case "INFO":
            return { colors, sorted: false };
        case "DEBUG":
        case "TRACE":
            return { colors, sorted: false, depth: null, showHidden: true, showProxy: true, maxArrayLength: null, numericSeparator: true };
        default:
            return { colors };
    }
};

const stringify = ({ colors = false }: { colors?: boolean } = {}) =>
    winston.format((info) => {
        const message: unknown = info.message;
        info.message =
            Array.isArray(message) ?
                message
                    .map((input) => (String.isString(input) ? input : inspect(input, inspectOptions({ level: info.level, colors }))))
                    .join(" ")
            : String.isString(message) ? message
            : inspect(message, inspectOptions({ level: info.level, colors }));
        return info;
    })();

const LOCAL_TRANSPORTS = () => [
    new winston.transports.Stream({
        stream: process.stdout,
        format: winston.format.combine(
            stringify({ colors: true }),
            winston.format.colorize({
                level: true,
                colors: {
                    TRACE: "gray",
                    DEBUG: "gray",
                    INFO: "green",
                    WARN: "yellow",
                    ERROR: "blue",
                    FATAL: "red",
                } satisfies Record<Exclude<LogLevelType, "ALL" | "OFF">, "red" | "blue" | "yellow" | "green" | "gray" | "white">,
            }),
            winston.format.printf(
                (info) => `[${info.level}] ${new Date().toLocaleString("ko", { timeZone: "Asia/Seoul" })} ${info.message}`,
            ),
        ),
    }),
];

const LAMBDA_TRANSPORTS = () => [
    new winston.transports.Stream({
        stream: process.stdout,
        format: winston.format.combine(
            stringify({ colors: false }),
            winston.format.printf(
                (info) =>
                    `[${info.level}] ${new Date().toISOString()} ${getCurrentInvoke().context?.awsRequestId}\r` +
                    `${info.message}`.replaceAll("\n", "\r"),
            ),
        ),
    }),
];

const winstonLogger = Make.once(() =>
    winston.createLogger({
        levels: { FATAL: 0, ERROR: 1, WARN: 2, INFO: 3, DEBUG: 4, TRACE: 5 } satisfies Record<Exclude<LogLevelType, "ALL" | "OFF">, number>,
        level: config("LOG_LEVEL"),
        transports: config("AWS_EXECUTION_ENV")?.startsWith("AWS_Lambda") ? LAMBDA_TRANSPORTS() : LOCAL_TRANSPORTS(),
    }),
);

export const logger =
    (level: Exclude<Lowercase<Config["LOG_LEVEL"]>, "all" | "off"> = "info") =>
    (...message: unknown[]) => {
        winstonLogger().log(level.toUpperCase(), { message });
    };

// for effect system

const fromLabel = (label: LogLevelType): LogLevel.LogLevel =>
    (
        ({
            ALL: LogLevel.All,
            DEBUG: LogLevel.Debug,
            ERROR: LogLevel.Error,
            FATAL: LogLevel.Fatal,
            INFO: LogLevel.Info,
            OFF: LogLevel.None,
            TRACE: LogLevel.Trace,
            WARN: LogLevel.Warning,
        }) satisfies Record<LogLevelType, LogLevel.LogLevel>
    )[label];

export const EffectLogger = Make.once(() =>
    Logger.replace(
        Logger.defaultLogger,

        Logger.make((options) => {
            const level = options.logLevel;
            const annotations = [...options.annotations].flatMap(([key, value]) => [`\n[${key}]`, value]);
            const body = Array.isArray(options.message) ? options.message : [options.message];
            const lowercase = (
                {
                    ALL: "all",
                    OFF: "off",
                    DEBUG: "debug",
                    ERROR: "error",
                    FATAL: "fatal",
                    INFO: "info",
                    TRACE: "trace",
                    WARN: "warn",
                } satisfies Record<LogLevelType, Lowercase<LogLevelType>>
            )[level.label];
            if (lowercase === "all" || lowercase === "off") return;
            logger(lowercase)(...annotations, ...body);
        }),
    ).pipe(Layer.provide(Logger.minimumLogLevel(fromLabel(config("LOG_LEVEL"))))),
);
