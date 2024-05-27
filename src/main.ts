import { Backend } from './backend';
import { initConfig } from './infrastructure/config';
import { initLogger, logger } from './infrastructure/logger';

initConfig();
initLogger();

Backend.start({
    logger: false,
    cors: { origin: '*', credentials: false },
    // preStart: connectPrisma,
    // postEnd: disconnectPrisma,
}).catch(logger.fatal);
