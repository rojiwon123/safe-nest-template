import { identity, isObject } from "@fxts/core";

import { Prisma, PrismaClient } from "@PRISMA";

import { freeze } from "@/util/fn";
import { Once } from "@/util/once";
import { Result } from "@/util/result";

import { config } from "./config";
import { logger } from "./logger";

export interface IPrismaClient extends Prisma.TransactionClient {
    $transaction: PrismaClient["$transaction"];
    /**
     * Transaction with `Result` Instance
     *
     * If closure return `Result.Err` instance, transaction execute rollback.
     */
    $safeTransaction: <Ok, Err>(closure: (tx: Prisma.TransactionClient) => Promise<Result<Ok, Err>>) => Promise<Result<Ok, Err>>;
}

const once = Once.of(() => {
    const client = new PrismaClient({
        datasources: { database: { url: config("DATABASE_URL") } },
        log:
            config("NODE_ENV") === "development" ?
                [
                    { emit: "event", level: "error" },
                    { emit: "event", level: "warn" },
                    { emit: "event", level: "info" },
                    { emit: "event", level: "query" },
                ]
            :   [
                    { emit: "event", level: "error" },
                    { emit: "event", level: "warn" },
                ],
    });

    client.$on("error", logger().error);
    client.$on("warn", logger().warn);

    if (config("NODE_ENV") === "development") {
        client.$on("query", logger().info);
        client.$on("info", logger().info);
    }

    return client;
});

export const prisma = (input: ITransactionable<object> = {}): Prisma.TransactionClient => input.tx ?? once.get();

export const connectPrisma = () => once.map((tx) => tx.$connect());
export const disconnectPrisma = () => once.map((tx) => tx.$disconnect());

export type ITransactionable<T extends object> = T & {
    tx?: Prisma.TransactionClient;
};

export const transaction = <T>(
    closure: (tx: Prisma.TransactionClient) => Promise<T>,
    options: { maxWait?: number; timeout?: number; isolationLevel?: Prisma.TransactionIsolationLevel } = {},
): Promise<T> => once.map((tx) => tx.$transaction(closure, options));

const kind = Symbol("PrismaRollback");
export interface Rollback {
    [kind]: typeof kind;
    error: unknown;
}

export const isRollback = <T>(input: T | Rollback): input is Rollback => isObject(input) && kind in input && input[kind] === kind;

const Rollback = (error: unknown): Rollback => freeze({ [kind]: kind, error });

/**
 * Result Monad 반환 함수에 대해 트랜잭션을 처리하기 위한 함수
 *
 * Result.Err 케이스에 대해 transaction rollback을 수행합니다.
 *
 * 그 밖에 에러에 의해 rollback이 수행된 경우, rollback 원인 정보가 `Rollback` 타입으로 리턴됩니다.
 */
export const safeTransaction = async <Ok, Err>(
    closure: (tx: Prisma.TransactionClient) => Result<Ok, Err> | Promise<Result<Ok, Err>>,
    options: {
        /**
         * The maximum amount of time Prisma Client will wait to acquire a transaction from the database. The default value is 2 seconds.
         *
         * @default 2000
         */
        maxWait?: number;
        /**
         * The maximum amount of time the interactive transaction can run before being canceled and rolled back. The default value is 5 seconds.
         *
         * @default 5000
         */
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    } = {},
): Promise<Result<Ok, Err | Rollback>> => {
    const rollback = new Error("transaction rollback");
    const throwRollback = (err: Err) => {
        rollback.cause = err;
        throw rollback;
    };
    try {
        const conclusion = await transaction(async (tx) => Result.match(identity, throwRollback)(await closure(tx)), options);
        return Result.Ok(conclusion);
    } catch (err: unknown) {
        return Result.Err(err === rollback ? (rollback.cause as Err) : Rollback(err));
    }
};
