import { Configuration } from "@INFRA/config";
import { PrismaClient } from "@PRISMA";

export const prisma = new PrismaClient({
  datasources: { database: { url: Configuration.DATABASE_URL } },
  log:
    Configuration.NODE_ENV === "development"
      ? [
          {
            emit: "event",
            level: "query"
          },
          {
            emit: "stdout",
            level: "error"
          },
          {
            emit: "stdout",
            level: "info"
          },
          {
            emit: "stdout",
            level: "warn"
          }
        ]
      : []
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
