import { Backend } from './backend';
import { initConfig } from './infrastructure/config';
import { initLogger, logger } from './infrastructure/logger';
import { connectPrisma } from './infrastructure/prisma';

initConfig();
initLogger();

connectPrisma()
    .then(() =>
        Backend.start({
            logger: false,
            cors: { origin: '*', credentials: false },
        }),
    )
    .catch(logger.fatal);
