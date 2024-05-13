import { Backend } from './backend';
import { logger } from './infrastructure/logger';

void Backend.start({
    logger: false,
    cors: { credentials: false },
}).catch(logger.fatal);
