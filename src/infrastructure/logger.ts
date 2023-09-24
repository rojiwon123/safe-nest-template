import winston from "winston";

import { pick } from "@APP/utils/map";

import { Configuration } from "./config";

const transports: winston.transport =
    Configuration.NODE_ENV === "production"
        ? new winston.transports.Stream({
              level: "warn",
              stream: process.stdout, // 외부 스트림으로 변경할 것
              format: winston.format.printf(
                  (info) => `--- LOG LEVEL: ${info.level} ---\n` + info.message,
              ),
          })
        : new winston.transports.Console({
              level: "silly",
              format: winston.format.combine(
                  winston.format.colorize({
                      message: true,
                      colors: { info: "white" },
                  }),
                  winston.format.printf(pick("message")),
              ),
          });

export const Logger: Logger = winston.createLogger({ transports });

export type Logger = Record<LogLevel, (message: unknown) => Logger>;

type LogLevel =
    | "error"
    | "warn"
    | "info"
    | "http"
    | "verbose"
    | "debug"
    | "silly";

/**
   const AwsStream = () => {
        const client = new CloudWatchLogsClient({
            region: Configuration.AWS_REGION,
        });
        return new Writable({
            write(chunk, encoding, callback) {
                const log = chunk.toString();
                const command = new PutLogEventsCommand({
                    logGroupName: Configuration.AWS_LOG_GROUP,
                    logStreamName: Configuration.NODE_ENV,
                    logEvents: [{ message: log, timestamp: Date.now() }],
                });
                client
                    .send(command)
                    .then(() => {
                        callback();
                    })
                    .catch(console.log);
            },
        });
    };
 */
