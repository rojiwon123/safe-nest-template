import { Prisma, PrismaClient } from "@prisma/client";
import { Effect, FiberRef } from "effect";

import { Make } from "@/util/make";

import { config } from "./config";
import { logger } from "./logger";

const createClient = () => {
    const client = new PrismaClient({
        // datasources: { database: { url: config("DATABASE_URL") } },
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
    client.$on("error", logger("error"));
    client.$on("warn", logger("warn"));
    if (config("NODE_ENV") === "development") {
        client.$on("query", logger());
        client.$on("info", logger());
    }
    return client;
};

/**
 * transaction을 적용하지 않은 전역 db client
 *
 * effect system과 무관하게 동작한다.
 *
 * transaction을 구성하기 위해서는 명시적으로 DB().$transaction을 사용해야 한다.
 */
export const DB = Make.once<PrismaClient>(createClient);

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

const DBRef = Make.once(() => FiberRef.unsafeMake<Prisma.TransactionClient>(DB()));
/**
 * effect system 내에서 transactionable client를 적용하기 위해 사용하는 client
 *
 * `DB`와 다르게 동적으로 transaction client가 될 수도 있고 전역 client가 될 수도 있다.
 */
export const DBTx = Make.once(() => FiberRef.get(DBRef()));
export const Transaction =
    (options: TransactionOptions = {}) =>
    <A, E, R>(self: Effect.Effect<A, E, R>): Effect.Effect<A, E, R> =>
        Effect.gen(function* () {
            const db = yield* FiberRef.get(DBRef());
            const isIn = (db as PrismaClient)["$transaction"] === undefined;
            if (isIn) return yield* self;
            const tx = yield* Effect.promise(() => createTransaction(options));
            return yield* Effect.locally(
                DBRef(),
                tx.tx,
            )(self).pipe(
                Effect.tap(() => Effect.sync(tx.emitCommit)),
                Effect.tapErrorCause(() => Effect.sync(tx.emitRollback)),
            );
        });

type TxManager = {
    tx: Prisma.TransactionClient;
    emitCommit: () => void;
    emitRollback: () => void;
};
const createTransaction = async (options: TransactionOptions = {}) =>
    new Promise<TxManager>((resolve) => {
        DB()
            .$transaction(
                (tx) =>
                    new Promise((commit, emitRollback) => {
                        resolve({ tx, emitCommit: () => commit(undefined), emitRollback: () => emitRollback() });
                    }),
                options,
            )
            .catch(() => {});
    });

export class PrismaErr extends Error {
    override name = "PrismaErr";
    constructor(cause: unknown) {
        super("PrismaClient Error", { cause });
    }
}

export const queryEffect = <T>(op: (tx: Prisma.TransactionClient) => Promise<T>): Effect.Effect<T, PrismaErr> =>
    Effect.gen(function* () {
        const tx = yield* DBTx();
        return yield* Effect.tryPromise({ try: () => op(tx), catch: (err) => new PrismaErr(err) });
    });
