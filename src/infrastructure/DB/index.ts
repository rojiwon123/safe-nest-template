import { Prisma, PrismaClient } from "@PRISMA";

import { Result } from "@APP/utils/result";

import { Configuration } from "../config";
import { Logger } from "../logger";

const _prisma = new PrismaClient({
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

export const prisma = _prisma.$extends({
    client: {
        $safeTransaction: async <T, E extends Result.Error.IFailure>(
            closure: (tx: Prisma.TransactionClient) => Promise<Result<T, E>>,
        ): Promise<Result<T, E>> => {
            const rollback = new Error("transaction rollback");
            try {
                const end: Result.Ok<T> = await _prisma.$transaction(
                    async (tx) => {
                        const result = await closure(tx);
                        if (Result.Error.is(result)) {
                            rollback.cause = result;
                            throw rollback;
                        }
                        return result;
                    },
                );
                return end;
            } catch (error: unknown) {
                if (Object.is(rollback, error))
                    return rollback.cause as Result.Error<E>;
                throw error; // unexpected error
            }
        },
    },
}) as unknown as Prisma.TransactionClient & {
    $transaction: typeof _prisma.$transaction;
    /** Connect with the databas */
    $connect: typeof _prisma.$connect;
    /** Disconnect from the database */
    $disconnect: typeof _prisma.$disconnect;
    /**
     * Transaction with `Result` Instance
     *
     * If closure return `Result.Error` instance, transaction execute rollback.
     */
    $safeTransaction: () => <T, E extends Result.Error.IFailure>(
        closure: (tx: Prisma.TransactionClient) => Promise<Result<T, E>>,
    ) => Promise<Result<T, E>>;
};

// extends를 통해 orm method의 반환값을 변경할 수 있다.
// 그래서 PrismaClient 타입 정보가 충돌하는데, 나는 반환값을 변경하는 extends를 추가하지 않았으므로
// as keyword로 타입을 변경하였다.

if (Configuration.NODE_ENV === "development") {
    _prisma.$on("query", (e) => {
        Logger.warn("\n--- Query ---");
        Logger.info(e.query);
        Logger.debug("\n--- Params ---");
        Logger.info(e.params);
        Logger.info(`\nDuration: \x1b[32m${e.duration}ms\x1b[0m`);
    });
}
