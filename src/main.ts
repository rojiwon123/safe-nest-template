import { Backend } from './backend';
import { logger } from './infrastructure/logger';

void Backend.create({
    logger: false,
    cors: { credentials: false },
})
    .then((app) => app.open())
    .catch(logger.fatal);
