import { prisma } from "@INFRA/DB";
import { IConnection } from "@nestia/fetcher";

export const seedAll = async (connection: IConnection): Promise<void> => {};

export const removeAll = async () => {
  await prisma.$transaction([
    prisma.$executeRaw`TRUNCATE TABLE users cascade;`
  ]);
};
