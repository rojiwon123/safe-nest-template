import { Prisma, PrismaClient } from '@PRISMA';

import { Once } from '@SRC/common/once';
import { Result } from '@SRC/common/result';

import { config } from './config';
import { logger } from './logger';

export interface IPrismaClient extends Prisma.TransactionClient {
    $transaction: PrismaClient['$transaction'];
    /**
     * Transaction with `Result` Instance
     *
     * If closure return `Result.Err` instance, transaction execute rollback.
     */
    $safeTransaction: <T, E>(
        closure: (tx: Prisma.TransactionClient) => Promise<Result<T, E>>,
    ) => Promise<Result<T, E>>;
}

const once = Once.unit(() => {
    const client = new PrismaClient({
        datasources: { database: { url: config('DATABASE_URL') } },
        log:
            config('NODE_ENV') === 'development'
                ? [
                      { emit: 'event', level: 'error' },
                      { emit: 'event', level: 'warn' },
                      { emit: 'event', level: 'info' },
                      { emit: 'event', level: 'query' },
                  ]
                : [
                      { emit: 'event', level: 'error' },
                      { emit: 'event', level: 'warn' },
                  ],
    });

    client.$on('error', logger.error);
    client.$on('warn', logger.warn);

    if (config('NODE_ENV') === 'development') {
        client.$on('query', logger.info);
        client.$on('info', logger.info);
    }

    return client.$extends({
        client: {
            $safeTransaction: async <T, E>(
                closure: (
                    tx: Prisma.TransactionClient,
                ) => Promise<Result<T, E>>,
            ): Promise<Result<T, E>> => {
                const rollback = new Error('transaction rollback');
                return client
                    .$transaction((tx) =>
                        closure(tx).then(
                            Result.match(Result.Ok<T, E>, (err) => {
                                rollback.cause = err;
                                throw rollback;
                            }),
                        ),
                    )
                    .catch((error: unknown) => {
                        if (error === rollback)
                            return Result.Err<T, E>(rollback.cause as E);
                        throw error; // unexpected error
                    });
            },
        },
    });
});

export const prisma = new Proxy(
    {},
    {
        get: (_, key: keyof IPrismaClient) => once.run()[key],
    },
) as IPrismaClient;

export const connectPrisma = () => once.run().$connect();
export const disconnectPrisma = () => once.run().$disconnect();
