import { ConsoleLogger, LoggerService } from "@nestjs/common";
import { Configuration } from "./config";

export namespace Logger {
  export const none: LoggerService = {
    log() {},
    error() {},
    warn() {}
  };
  export const Console = new ConsoleLogger();

  export const get = (): LoggerService => {
    switch (Configuration.NODE_ENV) {
      case "development":
        return Console;

      case "production":
        return Console; // 추후 변경
    }
    return none;
  };
}
