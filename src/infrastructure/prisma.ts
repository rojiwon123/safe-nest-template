import { isObject } from "@fxts/core";

import { Prisma, PrismaClient } from "@PRISMA";

import { freezeObject } from "@SRC/util/fn";
import { Once } from "@SRC/util/once";
import { Result } from "@SRC/util/result";

import { config } from "./config";
import { logger } from "./logger";

const once = Once.unit(() => {
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
        client.$on("query", logger().debug);
        client.$on("info", logger().debug);
    }

    return client;
});

export type Transactionable<T extends object> = T & {
    tx?: Prisma.TransactionClient;
};
export const prisma = (input: Transactionable<object> = {}): Prisma.TransactionClient => input.tx ?? once.run();

export const connectPrisma = () => once.run().$connect();
export const disconnectPrisma = () => once.run().$disconnect();

export interface TransactionOptions {
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
}
export const transaction = async <T>(fn: (tx: Prisma.TransactionClient) => Promise<T>, options: TransactionOptions = {}): Promise<T> =>
    once.run().$transaction(fn, options);

const kind = Symbol("PrismaRollback");
export interface Rollback {
    [kind]: typeof kind;
    error: unknown;
}
export const isRollback = <T>(input: T | Rollback): input is Rollback => isObject(input) && kind in input && input[kind] === kind;
const Rollback = (error: unknown): Rollback => freezeObject({ [kind]: kind, error });

export const safeTransaction = async <T, E>(
    fn: (tx: Prisma.TransactionClient) => Promise<Result<T, E>>,
    options: TransactionOptions = {},
): Promise<Result<T, E | Rollback>> => {
    const rollback = new Error("transaction rollback");
    return once
        .run()
        .$transaction(
            (tx) =>
                fn(tx).then((result) =>
                    result.match(Result.Ok<T, E>, (err) => {
                        rollback.cause = err;
                        throw rollback;
                    }),
                ),
            options,
        )
        .catch((err: unknown) => (err === rollback ? Result.Err<T, E>(rollback.cause as E) : Result.Err(Rollback(err))));
};
