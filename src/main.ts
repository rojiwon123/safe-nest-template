import { Backend } from "./backend";
import { initConfig } from "./infrastructure/config";
import { initLogger, logger } from "./infrastructure/logger";

initConfig();
initLogger();

Backend.start({
    logger: false,
    // preStart: connectPrisma,
    // postEnd: disconnectPrisma,
})
    .then(Backend.listen)
    .catch((err) => {
        logger().fatal(err);
        throw err;
    });
