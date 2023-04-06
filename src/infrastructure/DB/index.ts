import { Configuration } from "@INFRA/config";
import { PrismaClient } from "@PRISMA";

export const prisma = new PrismaClient({
  log:
    Configuration.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : []
});
