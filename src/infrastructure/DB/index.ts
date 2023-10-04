import { PrismaClient } from "@PRISMA";

import { Configuration } from "../config";
import { Logger } from "../logger";

export const prisma = new PrismaClient({
    datasources: { database: { url: Configuration.DATABASE_URL } },
    log: ((mode: typeof Configuration.NODE_ENV) => {
        switch (mode) {
            case "development":
                return [
                    { emit: "stdout", level: "error" },
                    { emit: "stdout", level: "warn" },
                    { emit: "stdout", level: "info" },
                    { emit: "event", level: "query" },
                ];
            case "test":
                return [
                    { emit: "stdout", level: "error" },
                    { emit: "stdout", level: "warn" },
                ];
            case "production":
                return [
                    { emit: "stdout", level: "error" },
                    { emit: "stdout", level: "warn" },
                ];
        }
    })(Configuration.NODE_ENV),
});

if (Configuration.NODE_ENV === "development") {
    prisma.$on("query", (e) => {
        Logger.warn("\n--- Query ---");
        Logger.info(e.query);
        Logger.debug("\n--- Params ---");
        Logger.info(e.params);
        Logger.info(`\nDuration: \x1b[32m${e.duration}ms\x1b[0m`);
    });
}
