import { LoggerService } from "@nestjs/common";
import winston from "winston";
import { Configuration } from "./config";

export namespace Logger {
  const createStreamTransport = () => {
    // 서비스 인프라 환경에 맞게 외부 로깅 시스템과 연동한다.
    return new winston.transports.Stream({ stream: process.stdout });
  };
  const logger: LoggerService = ((mode: typeof Configuration.NODE_ENV) => {
    const console = new winston.transports.Console();
    const _logger = winston.createLogger({
      level: mode === "development" ? "silly" : "error",
      format: winston.format.simple(),
      transports: mode === "production" ? createStreamTransport() : console
    });
    return _logger;
  })(Configuration.NODE_ENV);

  export const get = (): LoggerService => logger;
}
