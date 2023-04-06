import { Logger } from "@INFRA/logger";
import { Backend } from "./application";

Backend.start({
  logger: Logger.get(),
  cors: { credentials: true }
});
