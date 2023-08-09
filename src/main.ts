import { Backend } from "./application";

void Backend.start({
    logger: false,
    cors: { credentials: true },
});
