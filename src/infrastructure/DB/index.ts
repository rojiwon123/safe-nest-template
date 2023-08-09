import { PrismaClient } from "@PRISMA";

import { Configuration } from "../config";

export const prisma = new PrismaClient({
    datasources: { database: { url: Configuration.DATABASE_URL } },
    log: ((mode: typeof Configuration.NODE_ENV) => {
        switch (mode) {
            case "development":
                return [
                    { emit: "event", level: "query" },
                    { emit: "stdout", level: "error" },
                    { emit: "stdout", level: "info" },
                    { emit: "stdout", level: "warn" },
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
        console.log("\n\x1b[33m--- Query ---\x1b[0m");
        console.log(e.query);
        console.log("\n\x1b[34m--- Params ---\x1b[0m");
        console.log(e.params);
        console.log(`\nDuration: \x1b[32m${e.duration}ms\x1b[0m`);
    });
}
