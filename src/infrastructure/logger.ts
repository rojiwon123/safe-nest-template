import { LoggerService } from "@nestjs/common";
import winston from "winston";
import { Configuration } from "./config";

export namespace Logger {
    const logger: LoggerService = ((mode: typeof Configuration.NODE_ENV) => {
        const _logger = winston.createLogger({
            level: mode === "development" ? "silly" : "error",
            format: winston.format.simple(),
            transports: new winston.transports.Stream({
                stream: process.stdout,
            }),
        });
        return _logger;
    })(Configuration.NODE_ENV);

    export const get = (): LoggerService => logger;
}

/**
  const createAwsStream = (mode: typeof Configuration.NODE_ENV) => {
    const client = new CloudWatchLogsClient({
      region: Configuration.AWS_REGION
    });
    const stream = new Writable({
      write(chunk, encoding, callback) {
        const log = chunk.toString();
        const command = new PutLogEventsCommand({
          logGroupName: Configuration.AWS_LOG_GROUP,
          logStreamName: mode,
          logEvents: [{ message: log, timestamp: Date.now() }]
        });
        client
          .send(command)
          .then(() => {
            callback();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
 */
