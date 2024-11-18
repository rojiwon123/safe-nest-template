import { Backend } from "./backend";
import { initConfig } from "./infrastructure/config";
import { initLogger, logger } from "./infrastructure/logger";

initConfig();
initLogger();

void Backend.create({ logger: logger() })
    .start()
    .catch((err: unknown) => {
        logger().fatal(err);
        throw err;
    });
