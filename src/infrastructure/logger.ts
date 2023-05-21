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
        Console.setLogLevels(["error", "verbose", "warn"]);
        return Console;

      case "production":
        Console.setLogLevels(["error", "warn"]);
        return Console; // 추후 변경

      case "test":
        Console.setLogLevels(["error"]);
        return Console;
    }
    //  return none;
  };
}
