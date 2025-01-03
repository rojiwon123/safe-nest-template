import { Layer, LogLevel, Logger } from "effect";

import { config } from "@/infrastructure/config";
import { Make } from "@/util/make";

import { logger } from "./index";
import { LogLevelType } from "./level.type";

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
