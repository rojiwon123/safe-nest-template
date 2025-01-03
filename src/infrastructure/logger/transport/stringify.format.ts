import { String } from "effect";
import util from "util";
import winston from "winston";

const inspectOptions = ({ level, colors }: { level: string; colors: boolean }): util.InspectOptions => {
    switch (level) {
        case "FATAL":
        case "ERROR":
        case "WARN":
            return { colors, sorted: false, depth: null };
        case "INFO":
            return { colors, sorted: false };
        case "DEBUG":
        case "TRACE":
            return {
                colors,
                sorted: false,
                depth: null,
                showHidden: true,
                showProxy: true,
                maxArrayLength: null,
                numericSeparator: true,
            };
        default:
            return { colors };
    }
};

export const stringifyLogFormat = ({ colors = false }: { colors?: boolean } = {}) =>
    winston.format((info) => {
        const message: unknown = info.message;
        info.message =
            Array.isArray(message) ?
                message
                    .map((input) => (String.isString(input) ? input : util.inspect(input, inspectOptions({ level: info.level, colors }))))
                    .join(" ")
            : String.isString(message) ? message
            : util.inspect(message, inspectOptions({ level: info.level, colors }));
        return info;
    })();
