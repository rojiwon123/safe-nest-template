import { createBackend } from "./backend";
import { logger } from "./infrastructure/logger";

const bootstrap = async () => {
    try {
        const backend = await createBackend({
            logger: {
                verbose: logger("trace"),
                debug: logger("debug"),
                log: logger("info"),
                warn: logger("warn"),
                error: logger("error"),
                fatal: logger("fatal"),
            },
        });
        await backend.start();
    } catch (error: unknown) {
        logger("fatal")(error);
        throw error;
    }
};

void bootstrap();
